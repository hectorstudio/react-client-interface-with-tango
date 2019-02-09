const ATTRIBUTES = `
subscription Attributes($fullNames: [String]!) {
  attributes(fullNames: $fullNames) {
    device
    attribute
    value
  }
}`;

function socketUrl(tangoDB) {
  const loc = window.location;
  const protocol = loc.protocol.replace("http", "ws");
  return protocol + "//" + loc.host + "/" + tangoDB + "/socket?dashboard";
}

function createSocket(tangoDB) {
  return new WebSocket(socketUrl(tangoDB), "graphql-ws");
}

export function changeEventEmitter(tangoDB, fullNames) {
  return emit => {
    const socket = createSocket(tangoDB);
    socket.addEventListener("open", () => {
      const variables = { fullNames };
      const startMessage = JSON.stringify({
        type: "start",
        payload: {
          query: ATTRIBUTES,
          variables
        }
      });

      socket.send(startMessage);
    });

    socket.addEventListener("message", msg => {
      const frame = JSON.parse(msg.data);
      if (frame.type === "data" && frame.payload.error == null) {
        emit(frame.payload.data.attributes);
      }
    });

    return () => {
      socket.close();
    };
  };
}
