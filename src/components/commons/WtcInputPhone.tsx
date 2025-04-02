import { useAppSelector } from "../../app/hooks";
import { RoleService } from "../../services/Role.service";
import WtcInputIconText from "./WtcInputIconText";

type WtcRoleInputIconTextProps = {
	value?: string;
	placeHolder?: string;
	inputType?: string;
	leadingIconImage?: any;
	leadingIcon?: any;
	required?: boolean;
	field?: string;
	formik?: any;
	focused?: boolean;
	onEnter?: (value: string) => void;
	mask?: string;
	slotChar?: string;
	onClick?: VoidFunction;
	type?: string;
	disabled?: boolean;
	readonly?: boolean;
	target: string;
	code: string;
	action: string;
};
export default function WtcInputPhone(props: WtcRoleInputIconTextProps) {
	const role = useAppSelector((state) => state.auth.role);
	const readOnly = props.readonly || !RoleService.isAllowField(role, props.target, props.code, props.action);
	const disabled = props.disabled || !RoleService.isAllowAction(role, props.target, props.action);
	return (
		<WtcInputIconText
			disabled={disabled}
			readonly={readOnly}
			type={props.type}
			value={props.value}
			placeHolder={props.placeHolder}
			mask={props.mask}
			slotChar={props.slotChar}
			inputType={props.inputType}
			leadingIcon={props.leadingIcon}
			leadingIconImage={props.leadingIconImage}
			required={props.required}
			field={props.field}
			formik={props.formik}
			focused={props.focused}
			onEnter={props.onEnter}
			onClick={props.onClick}
		/>
	);
}
