import {take, takeLatest, fork} from "redux-saga/effects";
import createUserSaga from "../../shared/user/state/saga"
import { PRELOAD_USER, PRELOAD_USER_SUCCESS, LOGIN_SUCCESS, LOGOUT_SUCCESS, LOGOUT } from "../../shared/user/state/actionTypes";
export default function* sagas(){
    yield fork(createUserSaga());
    yield fork(loadDashboards);
}

function* loadDashboards(){
    while(true){
        // const {username} =yield takeLatest(PRELOAD_USER_SUCCESS, LOGIN_SUCCESS, LOGOUT);
        const {type} =yield take([PRELOAD_USER_SUCCESS, LOGIN_SUCCESS, LOGOUT_SUCCESS]);
        console.log("TYPE: " + type);
        if (type === "LOGOUT_SUCCESS"){
            // delete dashboards
        }else{
            // load dashboards
        }

        // yield call(UserAPI.extendLogin);
        // const result = yield call(UserAPI.extendLogin);
        //const  dashboards  = await loadUserDashboards("jonros")
    }
}