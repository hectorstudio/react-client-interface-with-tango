import { eventChannel } from "redux-saga";
import { fork, take, put, call, cancel, cancelled } from "redux-saga/effects";

import {
  FETCH_DEVICE_NAMES,
  EXECUTE_COMMAND,
  SET_DEVICE_PROPERTY,
  DELETE_DEVICE_PROPERTY,
  FETCH_DEVICE_SUCCESS,
  FETCH_DEVICE,
  FETCH_DATABASE_INFO
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
  fetchDatabaseInfoFailed
} from "../actions/tango";

import { displayError } from "../actions/error";

export default function* tango() {
  yield fork(fetchDeviceNames);
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
      const ok = yield call(
        TangoAPI.setDeviceAttribute,
        tangoDB,
        device,
        name,
        value
      );
      const action = ok
        ? setDeviceAttributeSuccess(tangoDB, device, name, value)
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

function createChangeEventChannel(tangoDB, models) {
  const emitter = TangoAPI.changeEventEmitter(tangoDB, models);
  return eventChannel(emitter);
}

function* handleChangeEvents(channel) {
  try {
    while (true) {
      const data = yield take(channel);
      const action = attributeChange(data);
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
    const models = attributes.map(({ name }) => `${deviceName}/${name}`);
    const channel = yield call(createChangeEventChannel, tangoDB, models);
    if (handler != null) {
      yield cancel(handler);
    }
    handler = yield fork(handleChangeEvents, channel);
  }
}
