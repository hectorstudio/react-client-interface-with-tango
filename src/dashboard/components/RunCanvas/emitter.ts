const ATTRIBUTES = `
subscription Attributes($fullNames: [String]!) {
  attributes(fullNames: $fullNames) {
    device
    attribute
    value
    writeValue
    timestamp
  }
}`;

export interface AttributeFrame {
  device: string;
  attribute: string;
  timestamp: number;
  value: any;
  writeValue: any;
}

export const END = Symbol("END");
export type EmittedFrame = AttributeFrame | typeof END;

type EmitHandler = (frame: EmittedFrame) => void;
type Unsub = () => void;
type EmissionStarter = (emit: EmitHandler) => Unsub;

function socketUrl(tangoDB: string) {
  const loc = window.location;
  const protocol = loc.protocol.replace("http", "ws");
  return protocol + "//" + loc.host + "/" + tangoDB + "/socket?dashboard";
}

function createSocket(tangoDB: string) {
  return new WebSocket(socketUrl(tangoDB), "graphql-ws");
}

export function attributeEmitter(
  tangoDB: string,
  fullNames: string[]
): EmissionStarter {
  return emitHandler => {
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
        emitHandler(frame.payload.data.attributes as AttributeFrame);
      }
    });

    socket.addEventListener("close", () => {
      emitHandler(END);
    });

    return () => {
      socket.close();
    };
  };
}
