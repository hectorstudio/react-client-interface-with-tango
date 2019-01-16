export default function(state = '', action) {
    switch (action.type) {
    case 'SELECT_DEVICE':
        return action.name;
    default:
        return state;
    }
}
