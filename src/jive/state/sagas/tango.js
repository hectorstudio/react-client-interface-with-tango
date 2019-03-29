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
  FETCH_LOGGED_ACTIONS
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
  attributeChange,
  fetchDatabaseInfoSuccess,
  fetchDatabaseInfoFailed,
  attributeFrameReceived,
  fetchLoggedActionsFailed,
  fetchLoggedActionsSuccess,
} from "../actions/tango";

import { displayError } from "../actions/error";

export default function* tango() {
  yield fork(fetchDeviceNames);
  yield fork (fetchLoggedActions);
  yield fork(executeCommand);
  yield fork(setDeviceAttribute);
  yield fork(setDeviceProperty);
  yield fork(deleteDeviceProperty);
  yield fork(fetchDevice);
  yield fork(subscribeOnFetchDevice);
  yield fork(fetchDatabaseInfo);
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
  while (true){
    const {tangoDB, deviceName, limit} = yield take(FETCH_LOGGED_ACTIONS);
    try{
      const logs = yield call(TangoAPI.fetchLoggedActions, tangoDB, deviceName, limit)
      yield put(fetchLoggedActionsSuccess(logs));
    }catch(err){
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
    const device = yield TangoAPI.fetchDevice(tangoDB, name);
    const action = device
      ? fetchDeviceSuccess(tangoDB, device)
      : fetchDeviceFailed(tangoDB, name);
    yield put(action);
  }
}

function* fetchDatabaseInfo() {
  while (true) {
    const { tangoDB } = yield take(FETCH_DATABASE_INFO);
    const info = yield TangoAPI.fetchDatabaseInfo(tangoDB);
    const action = info
      ? fetchDatabaseInfoSuccess(tangoDB, info)
      : fetchDatabaseInfoFailed(tangoDB);
    yield put(action);
  }
}

/* Subscriptions */

function createChangeEventChannel(tangoDB, fullNames) {
  const emitter = TangoAPI.changeEventEmitter(tangoDB, fullNames);
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

function* subscribeOnFetchDevice() {
  let handler = null;

  while (true) {
    const { device, tangoDB } = yield take(FETCH_DEVICE_SUCCESS);
    const { name: deviceName, attributes } = device;
    // Only subscribe to scalar attributes. Spectrums and images may be too data-heavy and crash the app.
    const scalarAttributes = attributes.filter(({ dataformat }) => dataformat === "SCALAR");
    const fullNames = scalarAttributes.map(({ name }) => `${deviceName}/${name}`);
    const channel = yield call(createChangeEventChannel, tangoDB, fullNames);
    if (handler != null) {
      yield cancel(handler);
    }
    handler = yield fork(handleChangeEvents, channel);
  }
}
