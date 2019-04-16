import { FETCH_DEVICE_NAMES_SUCCESS } from "../actions/actionTypes";
import JiveAction from "../actions";

export interface IDeviceListState {
  nameList: string[];
}

const initialState = {
  nameList: []
};

export default function deviceList(
  state: IDeviceListState = initialState,
  action: JiveAction
): IDeviceListState {
  switch (action.type) {
    case FETCH_DEVICE_NAMES_SUCCESS: {
      const sortedDeviceNames = action.names.sort((a, b) => {
        return a.toLowerCase().localeCompare(b.toLowerCase());
      });
      return { ...state, nameList: sortedDeviceNames };
    }
    default:
      return state;
  }
}
