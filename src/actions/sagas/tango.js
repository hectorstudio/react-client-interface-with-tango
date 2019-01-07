import { fork, take, put, call } from "redux-saga/effects";

import {
  FETCH_DEVICE_NAMES,
  FETCH_DEVICE_NAMES_SUCCESS,
  FETCH_DEVICE_NAMES_FAILED,
  EXECUTE_COMMAND,
  SET_DEVICE_PROPERTY,
  DELETE_DEVICE_PROPERTY,
  SELECT_DEVICE
} from "../actionTypes";

import TangoAPI from "../api/tango";
import {
  fetchDeviceNamesSuccess,
  fetchDeviceNamesFailed,
  executeCommandFailed,
  executeCommandSuccess,
  setDevicePropertySuccess,
  setDeviceAttributeFailed,
  setDevicePropertyFailed,
  setDeviceAttributeSuccess,
  deleteDevicePropertySuccess,
  deleteDevicePropertyFailed,
  fetchDevice
} from "../tango";

import { displayError } from "../error";

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

function* selectDevice() {
  while (true) {
    const { tangoDB, name } = yield take(SELECT_DEVICE);
    yield put(fetchDevice(tangoDB, name));
  }
}

export default function* tango() {
  yield fork(fetchDeviceNames);
  yield fork(executeCommand);
  yield fork(setDeviceAttribute);
  yield fork(setDeviceProperty);
  yield fork(deleteDeviceProperty);
  yield fork(selectDevice);
}
