import { InputText } from "primereact/inputtext";
import { KeyboardEventHandler, useRef, useState } from "react";

type WtcInputTextProps = {
	value: string;
	trailIcon?: JSX.Element;
	placeHolder?: string;
	border?: string;
	borderRadius?: number;
	padding?: string;
	className?: string;
	onChange: (value: string) => void;
	onKeyDown?: KeyboardEventHandler<HTMLInputElement>;
	inputType?: string;
	fontSize?: number;
	readonly?: boolean;
	leadingIcon?: string;
	leadingIconImage?: any;
	iconStyle?: Record<string, any>;
	trailIconStyle?: Record<string, any>;
	floatLabel?: boolean;
	disabled?: boolean;
	height?: number;
	auTofocus?: boolean;
	onClick?: VoidFunction;
	maxLength?: number;
};
export default function WtcInputText(props: WtcInputTextProps) {
	const [value, setValue] = useState(props.value);
	const [focus, setFocus] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);
	return (
		<div className="w-100 position-relative">
			{props.floatLabel && (
				<span className="p-float-label">
					<InputText
						autoFocus={props.auTofocus}
						ref={inputRef}
						type={props.inputType ?? "text"}
						className={`w-100 ${props.className}`}
						readOnly={props.readonly}
						disabled={props.disabled}
						value={value}
						maxLength={props.maxLength}
						onFocus={() => setFocus(true)}
						onBlur={() => setFocus(false)}
						placeholder={focus ? "" : props.placeHolder}
						style={{
							padding: props.padding,
							height: props.height ?? 45,
							borderRadius: props.borderRadius ?? 20,
							border: props.border,
							fontSize: props.fontSize,
						}}
						onChange={(e) => {
							setValue(e.target.value);
							props.onChange(e.target.value);
						}}
						onClick={props.onClick}
						onKeyDown={props.onKeyDown}
					/>
					<label
						style={{
							paddingLeft: props.leadingIcon ? (!focus && value === "" ? 48 : undefined) : undefined,
						}}
						htmlFor="wtc-input"
					>
						{props.placeHolder}
					</label>
				</span>
			)}
			{!props.floatLabel && (
				<InputText
					autoFocus={props.auTofocus}
					ref={inputRef}
					maxLength={props.maxLength}
					type={props.inputType ?? "text"}
					className={`w-100 ${props.className}`}
					readOnly={props.readonly}
					disabled={props.disabled}
					value={value}
					placeholder={props.placeHolder}
					style={{
						padding: props.padding,
						height: props.height ?? 45,
						borderRadius: props.borderRadius ?? 20,
						border: props.border,
						fontSize: props.fontSize,
					}}
					onClick={props.onClick}
					onChange={(e) => {
						setValue(e.target.value);
						props.onChange(e.target.value);
					}}
				/>
			)}
			{props.leadingIcon && (
				<div className="position-absolute fs-4" style={props.iconStyle ?? { top: 16, left: 16 }}>
					<i className={props.leadingIcon}></i>
				</div>
			)}
			{props.leadingIconImage && (
				<div className="position-absolute fs-4" style={props.iconStyle ?? { top: 16, left: 16 }}>
					<img className="fs-value w-100 h-100" src={props.leadingIconImage} />
				</div>
			)}
			{props.trailIcon && (
				<div className="position-absolute fs-4" style={props.trailIconStyle ?? { top: 16, right: 16 }}>
					{props.trailIcon}
				</div>
			)}
		</div>
	);
}
