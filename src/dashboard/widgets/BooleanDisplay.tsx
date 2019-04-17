import React, { Component, Fragment, CSSProperties } from "react";
import { WidgetProps } from "./types";
import { WidgetDefinition, AttributeInput } from "../types";
import { number } from "prop-types";

interface Input {
	showDevice: boolean,
	attribute: AttributeInput,
	relation: string,
	limitValue: number

}
type Props = WidgetProps<Input>;
class BooleanDisplay extends Component<Props>{
	public render() {
		const { device, name } = this.deviceAndAttribute();
		const value = this.value();
		const style = { padding: "0.5em", whiteSpace: "nowrap" } as CSSProperties;
		const inner = this.props.inputs.showDevice ? (
			<Fragment>
				{device}/{name}: {value}
			</Fragment>
		) : (
				<Fragment>
					{name}: {value}
				</Fragment>
			);

		return <div style={style}>{inner}</div>;
	}
	private value(): any {
		if (this.props.mode !== "run") {
			return <span style={{ fontStyle: "italic" }}>bool</span>;
		}

		const {
			attribute: { value },
			limitValue,
			relation
		} = this.props.inputs;
		if (Number(parseFloat(value)) === value) {
			switch (relation) {
				case ">":
					return String(value > limitValue)
				case "<":
					return String(value < limitValue)
				case "=":
					return String(value == limitValue)
				case ">=":
					return String(value >= limitValue)
				case "<=":
					return String(value <= limitValue)
				default:
					break;
			}
		} else {
			return value === undefined ? null : String(value);
		}
	}

	private deviceAndAttribute(): { device: string; name: string } {
		const { attribute } = this.props.inputs;
		const device = attribute.device || "device";
		const name = attribute.attribute || "attribute";
		return { device, name };
	}
}
const definition: WidgetDefinition = {
	type: "BOOLEAN_DISPLAY",
	name: "Boolean Display",
	defaultWidth: 10,
	defaultHeight: 2,
	inputs: {
		attribute: {
			type: "attribute",
			label: "",
			dataFormat: "scalar",
			required: true
		},
		relation: {
			type: "select",
			label: "relation",
			default: ">",
			options: [
				{
					name: ">",
					value: ">"
				},
				{
					name: "<",
					value: "<"
				}
				,
				{
					name: ">",
					value: ">"
				},
				{
					name: ">=",
					value: ">="
				}
				,
				{
					name: "<=",
					value: "<="
				}
			]
		},
		limitValue: {
			type: "number",
			label: "limit value",
			required: true
		},
		showDevice: {
			type: "boolean",
			label: "Device Name",
			default: false
		}
	}
};
export default { component: BooleanDisplay, definition }