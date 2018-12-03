import * as types from './actionTypes';
// import { ATTRIBUTE_CHANGE } from './actionTypes';

function socketUrl() {
	const loc = window.location;
	const protocol = loc.protocol.replace('http', 'ws');
	return protocol + '//' + loc.host + process.env.REACT_APP_BASE_URL + loc.pathname.split('/')[2] + '/socket';
}

const ws = new WebSocket(socketUrl(), "graphql-ws");

export function receiveChange(data) {
    return { type: types.ATTRIBUTE_CHANGE, data }
}

export const init = ( store ) => {

	ws.addEventListener("open", () => {
	    console.log("Websocket open!")
	});

	ws.addEventListener("error", (e) => {
	    console.log("Websocket error!", e)
	});

	ws.addEventListener("message", msg => {
		const data = JSON.parse(msg.data);
		if (data.type === "data"){
			if (typeof data.payload.data !== 'undefined') {
				const events = data.payload.data.changeEvent
				var i;
				for (i in events){
					if (events[i]){
						store.dispatch(receiveChange(events[i]))
					}
				}
			}
		}
	    
	    /*
		if (data.events.CONFIG && data){
	    	
		}
		*/
	});
};

export const emit = (type, payload) => ws.send(JSON.stringify({type, payload}));
