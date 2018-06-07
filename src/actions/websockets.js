import * as types from './actionTypes';
import {messageTypes, uri} from '../constants/websocket.js';
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
	    	console.log(data)
	    	store.dispatch(receiveChange(data.events.CHANGE))
	    }
	    if (data.events.CONFIG && data)
	        console.log(data)
	});

};
export const emit = ( models ) => ws.send(JSON.stringify({"type": "SUBSCRIBE", "models": models}));
