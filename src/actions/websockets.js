import * as types from './actionTypes';
import {uri} from '../constants/websocket.js';
var ws = new WebSocket("ws://" + uri + "/socket", "json");


export function receiveChange(data) {
    return { type: types.CHANGE, data }
}



export const init = ( store ) => {

	ws.addEventListener("open", () => {
	    console.log("Websocket open!")
	});


	ws.addEventListener("error", (e) => {
	    console.log("Websocket error!", e)
	});

	ws.addEventListener("message", msg => {
	    var data = JSON.parse(msg.data);
	    if (data.events.CHANGE && data){
	    	store.dispatch(receiveChange(data.events.CHANGE))
	    }
	    if (data.events.CONFIG && data){
	    	
	    }
	});

};
export const emit = ( type ,models ) => ws.send(JSON.stringify({"type": type, "models": models}));
