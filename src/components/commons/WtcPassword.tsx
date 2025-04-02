import { t } from "i18next";
import { KeyboardEventHandler, useState } from "react";
import WtcInputText from "./WtcInputText";
type WtcPasswordProps = {
	value: string;
	onChange: (value: string) => void;
	onKeyDown?: KeyboardEventHandler<HTMLInputElement>;
	disabled?: boolean;
	floatLabel?: boolean;
	placeHolder: string;
	onclick?: VoidFunction;
	className?: string;
};
export default function WtcPassword(props: WtcPasswordProps) {
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
			disabled={props.disabled}
			className={`wtc-text-primary ${props.className}`}
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
