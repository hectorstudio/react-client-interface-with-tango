import {
  ENABLE_DISPLEVEL,
  DISABLE_DISPLEVEL,
  SET_DATA_FORMAT
} from "../actions/actionTypes";
import JiveAction from "../actions";

export interface IDeviceDetailState {
  activeDataFormat?: string;
  disabledDisplevels: string[];
}

const initialState = {
  disabledDisplevels: []
};

export default function deviceViewer(
  state: IDeviceDetailState = initialState,
  action: JiveAction
): IDeviceDetailState {
  switch (action.type) {
    case ENABLE_DISPLEVEL: {
      const { displevel } = action;
      const disabledDisplevels = state.disabledDisplevels.filter(
        displevel2 => displevel2 !== displevel
      );
      return { ...state, disabledDisplevels };
    }

    case DISABLE_DISPLEVEL: {
      const { displevel } = action;
      const disabledDisplevels = [...state.disabledDisplevels, displevel];
      return { ...state, disabledDisplevels };
    }

    case SET_DATA_FORMAT:
      return { ...state, activeDataFormat: action.format };

    default:
      return state;
  }
}
