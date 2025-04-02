import { HexColorPicker } from "react-colorful";
import WtcHeaderColor from "./WtcHeaderColor";
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
				"input-icon-text p-2 wtc-bg-white rounded-4 w-100 position-relative"
			)}
		>
			<div
				className="d-flex align-items-center"
				onClick={() => {
					if (!disabled) toggle(true);
				}}
			>
				{props.leadingIcon && <i className={`${props.leadingIcon} p-2 wtc-text-primary fs-3 `}></i>}
				<div className="flex flex-column ms-0 gap-2 w-100">
					{!props.hiddenLabel && (
						<div>
							<label htmlFor="inputtext" style={{ color: "#5B6B86" }}>
								Color
							</label>
						</div>
					)}
					<WtcHeaderColor className="py-2" color={props.value} height={14} />
					{isOpen && (
						<div className="popover" ref={popover}>
							<HexColorPicker
								className="mt-2"
								color={props.value}
								onChange={(color) => props.formik.setFieldValue(props.field, color)}
							/>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
