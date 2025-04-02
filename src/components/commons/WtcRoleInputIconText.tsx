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
	readonly?: boolean;
	focused?: boolean;
	onEnter?: (value: string) => void;
	target: string;
	code: string;
	action: string;
	disabled?: boolean;
	mask?: string;
	slotChar?: string;
	onClick?: VoidFunction;
	maxLength?: number;
	type?: string;
	tabIndex?: number;
};

export default function WtcRoleInputIconText(props: WtcRoleInputIconTextProps) {
	const role = useAppSelector((state) => state.auth.role);
	const readOnly = props.readonly || !RoleService.isAllowField(role, props.target, props.code, props.action);
	const disabled = props.disabled || !RoleService.isAllowAction(role, props.target, props.action);

	return (
		<WtcInputIconText
			tabIndex={props.disabled ? -1 : props.tabIndex}
			type={props.type}
			value={props.value}
			placeHolder={props.placeHolder}
			mask={props.mask}
			slotChar={props.slotChar}
			inputType={props.inputType}
			leadingIcon={props.leadingIcon}
			leadingIconImage={props.leadingIconImage}
			disabled={disabled}
			required={props.required}
			readonly={readOnly}
			hide={RoleService.isHideField(role, props.target, props.code)}
			field={props.field}
			formik={props.formik}
			focused={props.focused}
			onEnter={props.onEnter}
			onClick={props.onClick}
			maxLenght={props.maxLength}
		/>
	);
}
