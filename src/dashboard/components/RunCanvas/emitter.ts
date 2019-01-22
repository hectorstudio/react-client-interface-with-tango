const CHANGE_EVENT = `
subscription ChangeEvent($models: [String]) {
  changeEvent(models: $models){
    eventType
    device
    name
    data {
      value
    }
  }
}`;

function socketUrl(tangoDB) {
  const loc = window.location;
  const protocol = loc.protocol.replace("http", "ws");
  return protocol + "//" + loc.host + "/" + tangoDB + "/socket";
}

function createSocket(tangoDB) {
  return new WebSocket(socketUrl(tangoDB), "graphql-ws");
}

export function changeEventEmitter(tangoDB, models) {
  const socket = createSocket(tangoDB);
  return emit => {
    socket.addEventListener("open", () => {
      const variables = { models };
      const startMessage = JSON.stringify({
        type: "start",
        payload: {
          query: CHANGE_EVENT,
          variables
        }
      });
      socket.send(startMessage);
    });

    socket.addEventListener("message", msg => {
      const frame = JSON.parse(msg.data);
      if (frame.type === "data" && frame.payload.error == null) {
        const events = frame.payload.data.changeEvent;
        for (const event of events) {
          emit(event);
        }
      }
    });

    return () => {
      socket.close();
    };
  };
}
