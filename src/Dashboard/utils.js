export function getWidgetDefinition(widgetDefinitions, type) {
    console.log(widgetDefinitions);
    return widgetDefinitions.find(definition => definition.type === type);
}
