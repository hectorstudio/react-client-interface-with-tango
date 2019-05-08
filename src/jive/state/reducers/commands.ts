import { FETCH_DEVICE_SUCCESS } from "../actions/actionTypes";
import JiveAction from "../actions";

interface IDeviceCommand {
  name: string;
  displevel: string;
}

export interface ICommandsState {
  [deviceName: string]: {
    [commandName: string]: IDeviceCommand;
  };
}

export default function allCommands(
  state: ICommandsState = {},
  action: JiveAction
): ICommandsState {
  switch (action.type) {
    case FETCH_DEVICE_SUCCESS: {
      const { name, commands } = action.device;
      const hash = (commands || []).reduce(
        (accum, command) => ({
          ...accum,
          [command.name]: command
        }),
        {}
      );
      return { ...state, [name]: hash };
    }

    default:
      return state;
  }
}
