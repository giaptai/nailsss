import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { isFormFieldInvalid } from "../../utils/data.util";
import { InputNumber } from "primereact/inputnumber";
import { useAppSelector } from "../../app/hooks";
import { RoleService } from "../../services/Role.service";

type WtcInputIconTextProps = {
	value?: string | number;
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
	maxValue?: number;
	suffix?: string;
	type?: string;
	tabIndex?: number;
	isCurr?: boolean;
	minFractionDigits?: number;
	maxFractionDigits?: number;
	isPercent?: boolean;
	target: string;
	code: string;
	action: string;
};

export default function WtcRoleInputIconNumber(props: WtcInputIconTextProps) {
	const role = useAppSelector((state) => state.auth.role);
	const readOnly = props.readonly || !RoleService.isAllowField(role, props.target, props.code, props.action);
	const disabled = props.disabled || !RoleService.isAllowAction(role, props.target, props.action);
	const [value, setValue] = useState<number | null>(
		props.field && props.formik
			? props.formik.values[props.field]
				? props.formik.values[props.field]
				: props.value
			: props.value
	);
	const ref = useRef<InputNumber>(null);

	useEffect(() => {
		if (props.focused) {
			ref?.current?.focus();
		}
	}, [props.focused]);

	const handleChange = (e: any) => {
		const newValue = e.value;
		if (newValue !== null && newValue !== undefined) {
			if (props.maxValue !== undefined && newValue > props.maxValue) {
				setValue(props.maxValue);
				if (props.formik) {
					props.formik.setFieldValue(props.field, props.maxValue);
				}
			} else {
				setValue(newValue);
				if (props.formik) {
					props.formik.setFieldValue(props.field, newValue);
				}
			}
		} else {
			setValue(null);
			if (props.formik) {
				props.formik.setFieldValue(props.field, null);
			}
		}
	};
	return (
		<div
			className={clsx(
				{ ["p-invalid"]: isFormFieldInvalid(props.field, props.formik) },
				{ ["disabled"]: readOnly },
				{ ["hide"]: props.hide },
				{ ["my-disable-input-div"]: disabled },
				"input-icon-text  p-1 wtc-bg-white rounded-4 w-100"
			)}
			onClick={() => {
				if (!readOnly) {
					ref?.current?.focus();
				}
			}}
		>
			<div className="d-flex align-items-center">
				{props.leadingIconImage && (
					<div className="p-2 font-size-icon-input wtc-text-primary">
						<img src={props.leadingIconImage} />
					</div>
				)}
				{props.leadingIcon && (
					<i className={`${props.leadingIcon} p-2 font-size-icon-input wtc-text-primary`}></i>
				)}
				<div className="flex flex-column gap-2 w-100">
					<div>
						{props.required && <strong className="text-danger">*</strong>}
						<label htmlFor="inputtext" style={{ color: "#5B6B86" }}>
							{props.placeHolder}
						</label>
					</div>
					<InputNumber
						tabIndex={disabled ? -1 : props.tabIndex}
						id=""
						ref={ref}
						className={`my-no-border ps-0 ${disabled && "my-disable-input "}`}
						onClick={props.onClick}
						mode={props.isCurr ? "currency" : "decimal"}
						currency={props.isCurr ? "USD" : undefined}
						locale={props.isCurr ? "en-US" : undefined}
						minFractionDigits={props.minFractionDigits || 0}
						maxFractionDigits={props.maxFractionDigits || 0}
						disabled={disabled}
						value={value}
						prefix={props.isPercent == true ? "%" : undefined}
						inputClassName="ps-0"
						onChange={handleChange}
						onKeyDown={(event) => {
							if (event.key === "Enter" && props.onEnter) {
								props.onEnter(value?.toString() || "");
							}
						}}
						suffix={props.suffix}
						max={props.maxValue}
						min={0}
						style={{ height: "44px" }}
					/>
				</div>
			</div>
		</div>
	);
}
