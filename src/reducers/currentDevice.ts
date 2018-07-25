export default function(state = '', action) {
    switch (action.type) {
    case 'FETCH_DEVICE_SUCCESS': // TODO: remove
        return action.device.name;

    case 'SELECT_DEVICE':
        return action.name;
    default:
        return state;
    }
}
