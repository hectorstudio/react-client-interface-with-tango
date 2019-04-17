import { TangoAction } from "./tango";
import { DeviceListAction } from "./deviceList";

type JiveAction = TangoAction | DeviceListAction;
export default JiveAction;
