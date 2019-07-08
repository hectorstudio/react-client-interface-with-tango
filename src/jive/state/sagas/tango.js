import { eventChannel } from "redux-saga";
import { fork, take, put, call, cancel, cancelled } from "redux-saga/effects";

import {
  FETCH_DEVICE_NAMES,
  EXECUTE_COMMAND,
  SET_DEVICE_PROPERTY,
  DELETE_DEVICE_PROPERTY,
  FETCH_DEVICE_SUCCESS,
  FETCH_DEVICE,
  FETCH_DATABASE_INFO,
  FETCH_LOGGED_ACTIONS,
  SET_DEVICE_ATTRIBUTE_SUCCESS
} from "../actions/actionTypes";

import TangoAPI from "../api/tango";
import {
  fetchDeviceNamesSuccess,
  fetchDeviceNamesFailed,
  executeCommandSuccess,
  executeCommandFailed,
  setDevicePropertySuccess,
  setDevicePropertyFailed,
  setDeviceAttributeSuccess,
  setDeviceAttributeFailed,
  deleteDevicePropertySuccess,
  deleteDevicePropertyFailed,
  fetchDeviceSuccess,
  fetchDeviceFailed,
  fetchDatabaseInfoSuccess,
  fetchDatabaseInfoFailed,
  attributeFrameReceived,
  fetchLoggedActionsFailed,
  fetchLoggedActionsSuccess
} from "../actions/tango";

import { displayError } from "../actions/error";

export default function* tango() {
  yield fork(fetchDeviceNames);
  yield fork(fetchLoggedActions);
  yield fork(executeCommand);
  yield fork(setDeviceAttribute);
  yield fork(setDeviceProperty);
  yield fork(deleteDeviceProperty);
  yield fork(fetchDevice);
  yield fork(subscribeOnFetchDevice);
  yield fork(fetchDatabaseInfo);
  yield fork(refetchDeviceStateOnAttributeWrite);
}

/* Asynchronous actions */

function* fetchDeviceNames() {
  while (true) {
    const { tangoDB } = yield take(FETCH_DEVICE_NAMES);
    try {
      const names = yield call(TangoAPI.fetchDeviceNames, tangoDB);
      yield put(fetchDeviceNamesSuccess(names));
    } catch (err) {
      yield put(fetchDeviceNamesFailed(err.toString()));
    }
  }
}

function* fetchLoggedActions() {
  while (true) {
    const { tangoDB, deviceName, limit } = yield take(FETCH_LOGGED_ACTIONS);
    try {
      const logs = yield call(
        TangoAPI.fetchLoggedActions,
        tangoDB,
        deviceName,
        limit
      );
      yield put(fetchLoggedActionsSuccess(logs));
    } catch (err) {
      yield put(fetchLoggedActionsFailed(err.toString()));
    }
  }
}
function* executeCommand() {
  while (true) {
    const { tangoDB, command, argin, device } = yield take(EXECUTE_COMMAND);
    try {
      const { ok, output } = yield call(
        TangoAPI.executeCommand,
        tangoDB,
        command,
        argin,
        device
      );
      const action = ok
        ? executeCommandSuccess(tangoDB, command, output, device)
        : executeCommandFailed(tangoDB, command, argin, device);
      yield put(action);
    } catch (err) {
      yield put(displayError(err.toString()));
    }
  }
}

function* setDeviceAttribute() {
  while (true) {
    const { tangoDB, device, name, value } = yield take("SET_DEVICE_ATTRIBUTE");
    try {
      const { ok, attribute } = yield call(
        TangoAPI.setDeviceAttribute,
        tangoDB,
        device,
        name,
        value
      );
      const action = ok
        ? setDeviceAttributeSuccess(tangoDB, attribute)
        : setDeviceAttributeFailed(tangoDB, device, name, value);
      yield put(action);
    } catch (err) {
      yield put(displayError(err.toString()));
    }
  }
}

function* setDeviceProperty() {
  while (true) {
    const { tangoDB, device, name, value } = yield take(SET_DEVICE_PROPERTY);
    const ok = yield call(
      TangoAPI.setDeviceProperty,
      tangoDB,
      device,
      name,
      value
    );
    const action = ok
      ? setDevicePropertySuccess(tangoDB, device, name, value)
      : setDevicePropertyFailed(tangoDB, device, name, value);
    yield put(action);
  }
}

function* deleteDeviceProperty() {
  while (true) {
    const { tangoDB, device, name } = yield take(DELETE_DEVICE_PROPERTY);
    const ok = yield call(TangoAPI.deleteDeviceProperty, tangoDB, device, name);
    const action = ok
      ? deleteDevicePropertySuccess(tangoDB, device, name)
      : deleteDevicePropertyFailed(tangoDB, device, name);
    yield put(action);
  }
}

function* fetchDevice() {
  while (true) {
    const { tangoDB, name } = yield take(FETCH_DEVICE);
    const device = yield call(TangoAPI.fetchDevice, tangoDB, name);
    const action = device
      ? fetchDeviceSuccess(tangoDB, device)
      : fetchDeviceFailed(tangoDB, name);
    yield put(action);
  }
}

function* fetchDatabaseInfo() {
  while (true) {
    const { tangoDB } = yield take(FETCH_DATABASE_INFO);
    const info = yield call(TangoAPI.fetchDatabaseInfo, tangoDB);
    const action = info
      ? fetchDatabaseInfoSuccess(tangoDB, info)
      : fetchDatabaseInfoFailed(tangoDB);
    yield put(action);
  }
}

function* refetchDeviceStateOnAttributeWrite() {
  while (true) {
    const {
      tangoDB,
      attribute: { device }
    } = yield take(SET_DEVICE_ATTRIBUTE_SUCCESS);
    const state = yield call(TangoAPI.fetchDeviceState, tangoDB, device);
    const action = { type: "DEVICE_STATE_RECEIVED", device, state };
    yield put(action);
  }
}

/* Subscriptions */

function createChangeEventChannel(tangoDB, fullNames, includeValues) {
  const emitter = TangoAPI.changeEventEmitter(
    tangoDB,
    fullNames,
    includeValues
  );
  return eventChannel(emitter);
}

function* handleChangeEvents(channel) {
  try {
    while (true) {
      const frame = yield take(channel);
      const action = attributeFrameReceived(frame);
      yield put(action);
    }
  } finally {
    if (yield cancelled()) {
      channel.close();
    }
  }
}

/* This generator has become a little messy due to some changes that needed to be made in order to make the performance acceptable. At some point, data fetching should probably be moved closer to the components, which will hopefully reduce the complexity. */
function* subscribeOnFetchDevice() {
  let scalarHandler = null;
  let nonScalarHandler = null;

  while (true) {
    const { device, tangoDB } = yield take(FETCH_DEVICE_SUCCESS);
    const { name: deviceName, attributes } = device;

    const scalarAttributes = attributes.filter(
      ({ dataformat }) => dataformat === "SCALAR"
    );

    const nonScalarAttributes = attributes.filter(
      ({ dataformat }) => dataformat !== "SCALAR"
    );

    const scalarFullNames = scalarAttributes.map(
      ({ name }) => `${deviceName}/${name}`
    );
    const nonScalarFullNames = nonScalarAttributes.map(
      ({ name }) => `${deviceName}/${name}`
    );

    const scalarChannel = yield call(
      createChangeEventChannel,
      tangoDB,
      scalarFullNames
    );

    const nonScalarChannel = yield call(
      createChangeEventChannel,
      tangoDB,
      nonScalarFullNames,
      false // <- important
    );

    if (scalarHandler != null) {
      yield cancel(scalarHandler);
    }

    if (nonScalarHandler != null) {
      yield cancel(nonScalarHandler);
    }

    scalarHandler = yield fork(handleChangeEvents, scalarChannel);
    nonScalarHandler = yield fork(handleChangeEvents, nonScalarChannel);
  }
}
