import { SketchPicker } from "react-color";
import WtcHeaderColor from "./WtcHeaderColorV2";
import { useCallback, useRef, useState } from "react";
import WtcClickOutside from "./WtcClickOutside";
import clsx from "clsx";
import { RoleService } from "../../services/Role.service";
import { useAppSelector } from "../../app/hooks";
type PropsColor = {
	field: string;
	formik: any;
	value: string;
	target: string;
	action: string;
	leadingIcon?: string;
	disabled?: boolean;
	hiddenLabel?: boolean;
};
export default function WtcInputChooseColor(props: PropsColor) {
	const role = useAppSelector((state) => state.auth.role);
	const popover = useRef<HTMLDivElement>(null);
	const [isOpen, toggle] = useState(false);
	const close = useCallback(() => toggle(false), []);
	WtcClickOutside(popover, close);
	const disabled = props.disabled || !RoleService.isAllowAction(role, props.target, props.action);
	return (
		<div
			className={clsx(
				{ ["my-disable-input-div"]: disabled },
				"input-icon-text p-2 wtc-bg-white w-100 position-relative d-flex justify-content-start align-items-center"
			)}
			style={{ borderRadius: "4px", maxHeight: "60px" }}
			onClick={() => {
				if (!disabled) toggle(true);
			}}
		>
			<div className="d-flex align-items-center">
				{props.leadingIcon && <i className={`${props.leadingIcon} p-2 wtc-text-primary fs-3 `}></i>}
				<div className="flex flex-column ms-0 gap-2 w-100">
					{!props.hiddenLabel && (
						<div>
							<label htmlFor="inputtext" style={{ color: "#5B6B86" }}>
								Color
							</label>
						</div>
					)}
					<WtcHeaderColor className="py-2" color={props.value} height={32} width={96} />
					{isOpen && (
						<div className="popover" ref={popover}>
							<SketchPicker
								width="300px"
								className="mt-2"
								color={props.value}
								onChangeComplete={(color) => props.formik.setFieldValue(props.field, color.hex)}
							/>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
