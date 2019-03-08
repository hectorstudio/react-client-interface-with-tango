export interface WidgetProps<T = Record<string, any>> {
  inputs: T;
  mode: "run" | "edit" | "library";
  t0: number;
  actualWidth: number;
  actualHeight: number;
}
