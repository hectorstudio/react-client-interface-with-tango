import { IRootState } from '../reducers/rootReducer';
import { objectValues } from '../utils';

export function queryDeviceWithName(state: IRootState, name: string) {
    const device = state.devices[name];
    if (device == null) {
        return device;
    }

    const properties = [...objectValues(state.properties[name])];
    const attributes = [...objectValues(state.attributes[name])];
    const commands = [...objectValues(state.commands[name])];
    
    return {...device, properties, attributes, commands};
}
