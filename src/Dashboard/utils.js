export function getWidgetDefinition(widgetDefinitions, type) {
    return widgetDefinitions.find(definition => definition.type === type);
}
