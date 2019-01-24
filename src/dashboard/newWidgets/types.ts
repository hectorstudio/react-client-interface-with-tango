import { IInputMapping } from "../types";

export interface IWidgetProps {
  inputs: IInputMapping;
  mode: "run" | "edit" | "library";
  actualWidth: number;
  actualHeight: number;
}
