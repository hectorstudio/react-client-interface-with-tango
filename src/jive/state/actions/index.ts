import { TangoAction } from "./tango";
import { DeviceListAction } from "./deviceList";

type JiveAction = TangoAction | DeviceListAction;
// Note : eslint does not currently handle the scope of type definitions correctly
// eslint-disable-next-line no-undef
export default JiveAction;
