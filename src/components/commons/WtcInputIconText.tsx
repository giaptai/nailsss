import clsx from "clsx";
import { InputMask } from "primereact/inputmask";
import { InputText } from "primereact/inputtext";
import { useEffect, useRef, useState } from "react";
import { isISOString } from "../../const";
import { isFormFieldInvalid } from "../../utils/data.util";

type WtcInputIconTextProps = {
	value?: string;
	placeHolder?: string;
	inputType?: string;
	leadingIconImage?: any;
	leadingIcon?: any;
	required?: boolean;
	field?: string;
	formik?: any;
	readonly?: boolean;
	hide?: boolean;
	focused?: boolean;
	disabled?: boolean;
	onEnter?: (value: string) => void;
	mask?: string;
	slotChar?: string;
	onClick?: VoidFunction;
	maxLenght?: number;
	isIcon?: boolean;
	type?: string;
	tabIndex?: number;
	autoComplete?: string;
};
export default function WtcInputIconText(props: WtcInputIconTextProps) {
	const [value, setValue] = useState(
		props.field && props.formik
			? props.formik.values[props.field]
				? props.formik.values[props.field]
				: props.value
			: props.value
	);
	const ref = useRef<HTMLInputElement>(null);
	const maxLength = props.maxLenght || 250;
	useEffect(() => {
		if (props.focused) {
			ref?.current?.focus();
		}
	}, []);
	useEffect(() => {
		if (isISOString(value)) setValue(props.value);
	}, [value]);
	return (
		<div
			className={clsx(
				{ ["p-invalid"]: isFormFieldInvalid(props.field, props.formik) },
				{ ["disabled"]: props.readonly },
				{ ["my-disable-input-div"]: props.disabled },
				{ ["hide"]: props.hide },
				"input-icon-text  p-1 wtc-bg-white rounded-4 h-100"
			)}
			onClick={() => {
				if (!props.readonly) {
					ref?.current?.focus();
				}
			}}
		>
			<div className="d-flex align-items-center">
				{props.leadingIconImage && (
					<div className="fs-4 p-2">
						<img src={props.leadingIconImage} />
					</div>
				)}
				{props.leadingIcon && (
					<i
						className={`${props.leadingIcon} p-2 wtc-text-primary font-size-icon-input ${
							props.isIcon ? "rounded-circle custom-primary-button p-component p-button-icon-only" : ""
						}`}
					></i>
				)}
				<div className="flex flex-column gap-2 w-100">
					<div>
						{props.required && <strong className="text-danger">*</strong>}
						<label htmlFor="inputtext" style={{ color: "#5B6B86" }} className="fs-value">
							{props.placeHolder}
						</label>
					</div>
					{props.mask ? (
						<InputMask
							style={{ height: "40px" }}
							tabIndex={props.disabled ? -1 : props.tabIndex}
							type={props.type}
							disabled={props.disabled}
							className={`${props.disabled ? "my-disable-input" : ""} ps-0 w-100 my-no-border`}
							value={value}
							onChange={(e) => {
								setValue(e.target.value);
								if (props.formik) {
									if (props.field?.includes(".")) {
										const fields = props.field.split(".");
										if (fields?.length == 2) {
											const target = { ...props.formik.values[fields[0]] };
											target[fields[1]] = e.target.value;
											props.formik.setFieldValue(fields[0], target);
										}
									} else {
										props.formik.setFieldValue(props.field, e.target.value);
									}
								}
							}}
							mask={props.mask}
							onClick={props.onClick}
							placeholder={props.slotChar}
							slotChar={props.slotChar}
						/>
					) : (
						<InputText
							id="inputtext"
							tabIndex={props.disabled ? -1 : props.tabIndex}
							type={props.type}
							ref={ref}
							className={` ${
								props.disabled ? "my-disable-input" : ""
							} h-100 icon-text p-2 pt-1 ps-0 p-inputtext-no-border`}
							placeholder={"..."}
							onClick={props.onClick}
							disabled={props.disabled}
							value={value}
							autoComplete={props.autoComplete || "off"}
							onChange={(e) => {
								if ([...e.target.value][0] === " ") e.target.value = e.target.value.trim();
								if (e.target.value.length <= maxLength) {
									setValue(e.target.value);
									if (props.formik) {
										if (props.field?.includes(".")) {
											const fields = props.field.split(".");
											if (fields?.length == 2) {
												const target = { ...props.formik.values[fields[0]] };
												target[fields[1]] = e.target.value;
												props.formik.setFieldValue(fields[0], target);
											}
										} else {
											props.formik.setFieldValue(props.field, e.target.value);
										}
									}
								}
							}}
							onKeyDown={(event) => {
								if (event.key == "Enter") {
									if (props.onEnter) {
										props.onEnter(value);
									}
								}
							}}
							style={{ width: "100%" }}
						/>
					)}
				</div>
			</div>
		</div>
	);
}
