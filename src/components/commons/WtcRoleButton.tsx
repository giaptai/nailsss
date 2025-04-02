import { Avatar } from "primereact/avatar";
import { Badge } from "primereact/badge";
import { Ripple } from "primereact/ripple";
import { Spinner } from "react-bootstrap";
import { RoleService } from "../../services/Role.service";
import { useAppSelector } from "../../app/hooks";
type WtcRoleButtonProps = {
	className?: string;
	label: string;
	height?: number;
	minWidth?: number;
	width?: string;
	icon?: string;
	iconImage?: string;
	base64Image?: boolean;
	bagde?: number;
	fontSize?: number;
	onClick?: VoidFunction;
	onBlur?: VoidFunction;
	onFocus?: VoidFunction;
	onKeyDown?: (e: React.KeyboardEvent) => void;
	rightTools?: JSX.Element;
	borderRadius?: number;
	borderColor?: string;
	backgroundColor?: string;
	loading?: boolean;
	disabled?: boolean;
	labelStyle?: any;
	target: string;
	action: string;
	formik?: any;
	radiusSTring?: string;
	classDiv?: string;
	paddingIcon?: string;
	tabIndex?: number;
	textColor?: string;
};
export default function WtcRoleButton(props: WtcRoleButtonProps) {
	const authState = useAppSelector((state) => state.auth);
	const disabled = props.disabled || !RoleService.isAllowAction(authState.role, props.target, props.action);
	const disabledRole = !RoleService.isAllowAction(authState.role, props.target, props.action);

	return (
		<div
			className={` ${props.classDiv} ${disabled ? "disabled" : ""} ${disabledRole ? "hide" : ""} `}
			style={{ width: props.width }}
		>
			<div
				tabIndex={props.disabled ? -1 : props.tabIndex}
				onKeyDown={props.onKeyDown}
				onBlur={props.onBlur}
				onFocus={props.onFocus}
				onClick={props.onClick}
				className={`me-button d-flex  justify-content-center ${
					props.paddingIcon ? props.paddingIcon : "px-2"
				} ${props.className ?? "bg-white"} p-ripple`}
				style={{
					height: props.height ?? 56,
					minWidth: props.minWidth || 100,
					width: props.width,
					borderRadius: props.radiusSTring ? props.radiusSTring : props.borderRadius ?? 12,
					fontSize: props.fontSize ?? 20,
					fontWeight: 600,
					border: props.borderColor ? `1px solid ${props.borderColor}` : undefined,
					backgroundColor: props.backgroundColor,
					color: props.textColor,
					cursor: "pointer",
				}}
			>
				{props.loading && (
					<div className="h-100 py-4">
						<Spinner className="text-white" />
					</div>
				)}
				{!props.loading && (
					<>
						<div className="d-flex">
							{props.icon ? (
								<i
									className={`${props.label !== "" ? "me-2" : ""} align-self-center p-overlay-badge ${
										props.icon
									}`}
									style={{ fontSize: props.height ? props.height / 1.6 : 24 }}
								>
									{props.bagde && (
										<Badge
											size={"normal"}
											value={props.bagde}
											severity="danger"
											style={{ fontSize: "0.5rem" }}
										></Badge>
									)}
								</i>
							) : (
								props.iconImage && (
									<>
										{props.base64Image && (
											<Avatar
												className="align-self-center me-2 primary-color fs-6"
												image={`data:image/jpeg;base64,${props.iconImage}`}
												shape="circle"
											/>
										)}
										{!props.base64Image && (
											<img
												src={props.iconImage}
												className={`${
													props.label !== "" ? "me-2" : ""
												} align-self-center p-overlay-badge`}
											>
												{props.bagde && (
													<Badge
														size={"normal"}
														value={props.bagde}
														severity="danger"
														style={{ fontSize: "0.5rem" }}
													></Badge>
												)}
											</img>
										)}
									</>
								)
							)}
						</div>
						<div className="d-flex align-self-center me-button">
							<span
								className={
									props.rightTools
										? "me-3 button-label-text button-focus"
										: "button-label-text button-focus"
								}
								style={props.labelStyle}
							>
								{props.label}
							</span>
							{props.rightTools}
						</div>
					</>
				)}
				<Ripple />
			</div>
		</div>
	);
}
