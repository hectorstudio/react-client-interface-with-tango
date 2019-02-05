export interface IWidgetProps<T = Record<string, any>> {
  inputs: T;
  mode: "run" | "edit" | "library";
  actualWidth: number;
  actualHeight: number;
}
