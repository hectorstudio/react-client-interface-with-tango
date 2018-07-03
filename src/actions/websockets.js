import * as types from './actionTypes';

function socketUrl() {
	const loc = window.location;
	const protocol = loc.protocol.replace('http', 'ws');
	return protocol + '//' + loc.host + '/socket';
}

const ws = new WebSocket(socketUrl(), "json");

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

export const emit = (type, models) => ws.send(JSON.stringify({type, models}));
