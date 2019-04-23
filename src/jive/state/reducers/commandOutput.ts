import { EXECUTE_COMMAND_SUCCESS } from "../actions/actionTypes";
import JiveAction from "../actions";

export interface ICommandOutputState {
  [device: string]: {
    [command: string]: any;
  };
}

export default function commandOutput(
  state: ICommandOutputState = {},
  action: JiveAction
): ICommandOutputState {
  switch (action.type) {
    case EXECUTE_COMMAND_SUCCESS: {
      const { command, result, device } = action;
      const forDevice = { ...state[device], [command]: result };
      return { ...state, [device]: forDevice };
    }
    default:
      return state;
  }
}
