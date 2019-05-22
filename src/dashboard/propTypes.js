import {
  shape,
  number,
  string,
  arrayOf,
  func,
  object,
  instanceOf
} from "prop-types";

export const widget = shape({
  attribute: string,
  device: string,
  params: object,
  type: string,
  date: instanceOf(Date),
  x: number,
  y: number
});

export const widgetDefinition = shape({
  component: func,
  fields: arrayOf(string),
  name: string,
  params: arrayOf(object),
  type: string
});

export const libraryWidgetDefinition = shape({
  component: func,
  field: arrayOf(string),
  name: string,
  params: arrayOf(object),
  type: string
});

export const subCanvas = shape({
  id: number,
  name: string,
  widgets: arrayOf(widget)
});
