import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { t } from "i18next";
import { useEffect } from "react";
export type DialogMode = "view" | "add" | "edit" | "delete" | "restore";
type DialogConfigs = {
	visible: boolean;
	mode: DialogMode;
	position?: any;
	title: string;
	body: JSX.Element;
	draggable: boolean;
	resizeable: boolean;
	okText: string;
	cancelText: string;
	onClose: VoidFunction;
	onEnter?: VoidFunction;
	width?: string | number;
	height?: string | number;
	minHeight?: string | number;
	closeIcon?: boolean;
	status?: string;
	footer?: JSX.Element;
	isBackgroundGray?: boolean;
	isBackgroundWhite?: boolean;
	isNoFooter?: boolean;
	fontSizeTitle?: number;
};
export default function DynamicDialog(props: DialogConfigs) {
	const style: any = {};
	if (props.width) style.width = props.width;
	if (props.height) style.height = props.height;
	if (props.minHeight) style.minHeight = props.minHeight;
	if (true) style.padding = 0;
	const icon = props.mode == "view" ? "ri-list-view" : props.mode == "add" ? "ri-add-fill" : "ri-edit-line";
	const action = props.mode == "add" ? t("action.create") : props.mode == "edit" ? t("action.update") : "";
	const headerElement = (
		<div className="d-flex justify-content-between align-items-center" style={{ height: 56 }}>
			<div
				className="flex-grow-1 d-flex"
				style={{ fontSize: props.fontSizeTitle ? props.fontSizeTitle : 24, fontWeight: 600 }}
			>
				<i className={`${icon} me-2`}></i> {props.title}
			</div>
			{(props.closeIcon === undefined || props.closeIcon) && (
				<div
					className="d-flex align-items-center fw-normal"
					style={{ cursor: "pointer" }}
					onClick={props.onClose}
				>
					<span style={{ fontSize: 16 }}>{t("action.close")}</span>
					<i className="ri-close-large-line fs-4 ms-3"></i>
				</div>
			)}
		</div>
	);
	useEffect(() => {
		function keyDownHandler(e: globalThis.KeyboardEvent) {
			if (props.visible) {
				if (e.key === "Enter") {
					if (props.onEnter) {
						props.onEnter();
					}
					e.preventDefault();
				}
			}
		}
		document.addEventListener("keydown", keyDownHandler);
		return () => {
			document.removeEventListener("keydown", keyDownHandler);
		};
	}, [props.visible]);
	return (
		<Dialog
			baseZIndex={1000}
			blockScroll
			modal
			focusOnShow
			className="no-overflow"
			header={headerElement}
			visible={props.visible}
			position={props.position}
			style={style}
			contentStyle={{
				borderBottom: "1px solid #E0E4EA",
			}}
			footer={
				props.isNoFooter == true ? undefined : !props.footer ? (
					<div className=" d-flex wtc-bg-white align-items-center justify-content-end">
						<Button
							type="button"
							label={props.cancelText}
							outlined
							className="dialog-cancel-button"
							icon="ri ri-close-line"
							onClick={props.onClose}
						/>
						{props.mode != "view" && (
							<Button
								type="button"
								label={action ?? props.okText}
								className="dialog-confirm-blue-button ms-2"
								icon={icon}
								onClick={props.onEnter}
							/>
						)}
					</div>
				) : (
					props.footer
				)
			}
			onHide={props.onClose}
			draggable={props.draggable}
			contentClassName={`${
				props.isBackgroundGray
					? "my-background-order my-padding-dialog"
					: props.isBackgroundWhite
					? "my-background-order-white my-padding-dialog"
					: undefined
			}`}
			resizable={props.resizeable}
		>
			<div className="pt-1">{props.body}</div>
		</Dialog>
	);
}
