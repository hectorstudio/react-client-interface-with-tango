import { combineReducers } from "redux";

import user from "../../../shared/user/state/reducer";

import ui from "./ui";
import canvases from "./ui";

export default combineReducers({
  ui,
  canvases,
  user
});
