import { KeyboardEventHandler, useState } from "react";
import WtcInputText from "./WtcInputText";
import { t } from "i18next";
import { RoleService } from "../../services/Role.service";
import { useAppSelector } from "../../app/hooks";
type WtcPasswordProps = {
	value: string;
	onChange: (value: string) => void;
	onKeyDown?: KeyboardEventHandler<HTMLInputElement>;
	disabled?: boolean;
	floatLabel?: boolean;
	placeHolder: string;
	onclick?: VoidFunction;
	className?: string;
	target: string;
	action: string;
};
export default function WtcRolePassword(props: WtcPasswordProps) {
	const role = useAppSelector((state) => state.auth.role);
	const disabled = props.disabled || !RoleService.isAllowAction(role, props.target, props.action);
	const [password, setPassword] = useState(props.value);
	const [visible, setVisible] = useState(false);
	return (
		<WtcInputText
			inputType={visible ? "text" : "password"}
			height={70}
			value={password}
			fontSize={20}
			border="1px solid #DADFF2"
			padding="20px 16px 20px 48px"
			placeHolder={t(props.placeHolder)}
			floatLabel={props.floatLabel}
			disabled={disabled}
			className={`wtc-text-primary ${props.className} ${disabled ? "my-disable-input-div" : ""}`}
			leadingIcon="ri-lock-2-fill wtc-text-primary"
			onClick={props.onclick}
			onChange={function (value: string): void {
				setPassword(value);
				props.onChange(value);
			}}
			onKeyDown={props.onKeyDown}
			trailIcon={
				<>
					<i
						className={visible ? "ri-eye-off-line" : "ri-eye-line"}
						style={{ fontSize: 18, color: "grey" }}
						onClick={() => {
							setVisible(!visible);
						}}
					/>
				</>
			}
		/>
	);
}
