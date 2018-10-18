import { shape, number, string, oneOf, arrayOf, func, object } from 'prop-types';

export const widget = shape({
	attribute: string,
	device: string,
    params: object,
    type: string,
	x: number,
	y: number,
})

export const widgetDefinition = shape({
    component: func,
    fields: arrayOf(string),
    name: string,
    params: arrayOf(object),
    type: string,
})

export const libraryWidgetDefinition = shape({
    component: func,
    field: arrayOf(string),
    name: string,
    params: arrayOf(object),
    type: string,
})

export const subCanvas = shape({
    id: number,
    name: string,
    widgets: arrayOf(widget),
})

export const command = arrayOf(shape({
    displevel: string,
    inttype: string,
    intypedesc: string,
    name: string,
    outtype: string,
    outtypedesc: string,
    tag: number,
  }))