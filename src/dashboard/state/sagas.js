import {take, fork, put, call} from "redux-saga/effects";
import createUserSaga from "../../shared/user/state/saga"
import {loadUserDashboards} from "../dashboardRepo";
import {
    dashboardsLoaded
  } from "./actionCreators";
import { PRELOAD_USER, PRELOAD_USER_SUCCESS, LOGIN_SUCCESS, LOGOUT_SUCCESS, LOGOUT } from "../../shared/user/state/actionTypes";
export default function* sagas(){
    yield fork(createUserSaga());
    yield fork(loadDashboards);
}

function* loadDashboards(){
    while(true){
        const {type} =yield take([PRELOAD_USER_SUCCESS, LOGIN_SUCCESS, LOGOUT_SUCCESS]);
        if (type === "LOGOUT_SUCCESS"){
            // delete dashboards
        }else{
            const result = yield call(loadUserDashboards);
            yield put(dashboardsLoaded(result));
        }
    }
}