import clsx from "clsx";
import { useEffect, useState } from "react";
import { isBrowser } from "react-device-detect";
import Select from "react-select";
import { isFormFieldInvalid } from "../../utils/data.util";
import MultiSelect from "../MultiSelect";
// import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import _ from "lodash";
type WtcDropdownIconTextProps = {
	options: any[];
	value: any;
	placeHolder?: string;
	leadingIconImage?: any;
	leadingIcon?: string;
	field?: string;
	optionLabel?: string;
	optionValue?: string;
	formik?: any;
	multiSelect?: boolean;
	disabled: boolean;
	hide?: boolean;
	filtler?: boolean;
	inputHeight?: number;
	onMultiChange?: (values: any) => void;
	onChange?: (value: any) => void;
	required?: boolean;
	filterInputAutoFocus?: boolean;
	tabIndex?: number;
};
export default function WtcDropdownIconText(props: WtcDropdownIconTextProps) {
	const customStyles = {
		control: (provided: any, state: any) => ({
			...provided,
			width: "100%",
			padding: 0,
			height: 30,
			border: "none",
			boxShadow: state.isFocused ? "none" : provided.boxShadow,
			"&:hover": {
				border: "none",
			},
		}),
		singleValue: (provided: any) => ({
			...provided,
			color: "#273672",
			fontSize: "18px",
		}),
	};
	const [value, setValue] = useState(
		props.value ? props.value : props.formik && props.field ? props.formik.values[props.field] : ""
	);
	useEffect(() => {
		if (!_.isEqual(props.value, value)) {
			setValue(props.value);
		}
	}, [props.value]);

	return (
		<div
			className={clsx(
				{ ["p-invalid"]: isFormFieldInvalid(props.field, props.formik) },
				{ ["my-disable-input-div"]: props.disabled },
				{ ["hide"]: props.hide },
				"h-100 input-icon-text  p-2 pt-1 wtc-bg-white rounded-4"
			)}
		>
			<div className="d-flex align-items-center">
				{props.leadingIconImage && (
					<div className="fs-4 p-2 pb-1">
						<img src={props.leadingIconImage} />
					</div>
				)}
				{props.leadingIcon && (
					<i className={`${props.leadingIcon} p-1 pb-1 wtc-text-primary font-size-icon-input`}></i>
				)}
				<div className="flex flex-column ms-0 gap-2 w-100">
					<div>
						{props.required && <strong className="text-danger">*</strong>}
						<label htmlFor="username" style={{ color: "#5B6B86" }}>
							{props.placeHolder}
						</label>
					</div>
					{props.multiSelect ? (
						<MultiSelect
							tabIndex={props.disabled ? -1 : props.tabIndex}
							options={props.options}
							// className={`${props.disabled ? 'my-disable-input' : ''} dropdown-icon-text icon-text`}
							// selectAll
							isSelectAll
							onChange={(value: any) => {
								setValue(value);
								props.formik?.setFieldValue(props.field, value);
								if (props.onMultiChange) props.onMultiChange(value);
							}}
							// style={{ width: '100%', padding: 0, height: 30, border: 'none' }}
							value={value ? value : undefined}
						/>
					) : !isBrowser ? (
						<Select
							tabIndex={props.disabled ? -1 : props.tabIndex}
							minMenuHeight={680}
							aria-labelledby="aria-label"
							inputId="aria-example-input"
							name="aria-live-color"
							className={`${props.disabled ? "my-disable-input" : ""} `}
							isDisabled={props.disabled}
							options={props.options}
							styles={customStyles}
							placeholder={"..."}
							value={props.options.filter(function (option) {
								return option.value === value;
							})}
							onChange={
								props.onChange
									? (e) => {
											setValue(e.value);
											props.onChange!(e.value);
									  }
									: (e) => {
											setValue(e.value);
											if (props.formik) {
												props.formik.setFieldValue(props.field, e.value);
											}
									  }
							}
						/>
					) : (
						// <Dropdown
						// 	id="username"
						// 	filter={props.filtler}
						// 	tabIndex={props.disabled ? -1 : props.tabIndex}
						// 	className={`${props.disabled ? "my-disable-input" : ""} dropdown-icon-text icon-text`}
						// 	options={props.options}
						// 	disabled={props.disabled}
						// 	value={value}
						// 	// optionLabel={props.optionLabel ?? "label"}
						// 	// optionValue={props.optionValue ?? "value"}
						// 	onChange={
						// 		props.onChange
						// 			? (e) => {
						// 					setValue(e.target.value);
						// 					props.onChange!(e.target.value);
						// 			  }
						// 			: (e: DropdownChangeEvent) => {
						// 					setValue(e.target.value);
						// 					if (props.formik) {
						// 						props.formik.setFieldValue(props.field, e.target.value);
						// 					}
						// 			  }
						// 	}
						// 	style={{ width: "100%", padding: 0, height: 30, border: "none" }}
						// />
						<Select
							tabIndex={props.disabled ? -1 : props.tabIndex}
							minMenuHeight={680}
							aria-labelledby="aria-label"
							inputId="aria-example-input"
							name="aria-live-color"
							className={`${props.disabled ? "my-disable-input" : ""} `}
							isDisabled={props.disabled}
							options={props.options}
							styles={customStyles}
							placeholder={"..."}
							value={props.options.filter(function (option) {
								return option.value === value;
							})}
							onChange={
								props.onChange
									? (e) => {
											setValue(e.value);
											props.onChange!(e.value);
									  }
									: (e) => {
											setValue(e.value);
											if (props.formik) {
												props.formik.setFieldValue(props.field, e.value);
											}
									  }
							}
						/>
					)}
				</div>
			</div>
		</div>
	);
}
