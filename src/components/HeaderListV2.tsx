import { t } from "i18next";
import { Button } from "primereact/button";
import { Tooltip } from "primereact/tooltip";
import { useState } from "react";
import { isMobile } from "react-device-detect";
import { useDispatch } from "react-redux";
import useWindowSize from "../app/screen";
import { selectItemTurn } from "../slices/turn.slice";
import RefreshButton from "./commons/RefreshButton";
import WtcAddButton from "./commons/WtcAddButtonV2";
import WtcItemEmployeeTurn from "./commons/WtcItemEmployeeTurn";
import WtcSearchInput from "./commons/WtcSearchTextV2";
import DynamicDialog from "./DynamicDialog";
import WtcButton from "./commons/WtcButton";
import { PageTarget } from "../const";
import WtcRoleButton from "./commons/WtcRoleButton";
import StatusDropdownV2 from "./commons/StatusDropdownV2";

import { DropdownChangeEvent } from "primereact/dropdown";
export type HeaderListProps = {
	onSearchText: (value: string) => void;
	onAddNew: () => void;
	target: string;
	hideAdd?: boolean;
	callback: VoidFunction;
	isFilterStatus?: boolean;
	isTurn?: boolean;
	isNoCustomerOrder?: boolean;
	handleClickNoCustomer?: VoidFunction;
	isNewOrder?: boolean;
	onClickFilterStatus?: (event: React.MouseEvent<HTMLButtonElement>) => void;
	onClickTurns?: (event: React.MouseEvent<HTMLButtonElement>) => void;
	placeHolderSearch?: string;
	maxWidthSearch?: string;
	status?: string;
	setStatus?: (e: string) => void;
	labelSearch?: string;
	labelFilter?: string;
	titleButtonAdd?: string;
	arrStatus?: string[];
};
export default function HeaderList(props: HeaderListProps) {
	const [dialogVisibleEmpl, setdialogVisibleEmpl] = useState(false);
	const dispatch = useDispatch();
	const screenSize = useWindowSize();
	const bodyHeight = screenSize.height;

	const handleCloseDialog = () => {
		setdialogVisibleEmpl(false);
		dispatch(selectItemTurn(undefined));
	};
	const handleClickRedirectOrder = () => {
		const currentUrl = window.location.origin;
		const newUrl = `${currentUrl}/order`;
		window.open(newUrl, "_blank", "noopener,noreferrer");
	};

	return (
		<>
			<div className="font-title-card px-2 rounded-3 d-flex justify-content-between h-100 w-100">
				<div className="flex-grow-1 d-flex align-items-center">
					<div style={{ width: 471, display: "flex", flexDirection: "column", gap: "4px" }}>
						<span
							style={{
								fontSize: "16px",
								fontWeight: "600",
								color: "#3E4451",
							}}
						>
							{props.labelSearch ? props.labelSearch : "Search"}
						</span>
						<WtcSearchInput
							placeholder={props.placeHolderSearch ? props.placeHolderSearch : t("action.search")}
							onChanged={props.onSearchText}
							height={60}
							radius={4}
						/>
					</div>
					{props.isFilterStatus && (
						<div className="ms-2 flex-1" style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
							<span
								style={{
									fontSize: "16px",
									fontWeight: "600",
									color: "#3E4451",
								}}
							>
								{props.labelFilter ? props.labelFilter : "Status"}
							</span>
							<div>
								<StatusDropdownV2
									value={props.status || ""}
									onChange={(e: DropdownChangeEvent) => {
										props.setStatus && props.setStatus(e.value);
									}}
									radius={4}
									height={60}
									width={235}
									arrStatus={props.arrStatus}
								/>
								<Tooltip position="bottom" target="#button_fillter" content={t("fillter")} />
							</div>
						</div>
					)}
				</div>
				<div className="d-flex align-items-center mt-auto h-100">
					{props.isNoCustomerOrder && (
						<div className="me-2">
							<WtcButton
								label={t("no_cus")}
								className="fs-value w-100 wtc-bg-primary text-light "
								height={35}
								onClick={props.handleClickNoCustomer}
							/>
						</div>
					)}

					{/* <WtcSortButton label={t('sort')} onClick={() => { }} /> */}
					<div className="me-2">
						<RefreshButton callback={props.callback} width={64} height={64} />
					</div>
					{!props.hideAdd && (
						<div className="">
							<WtcAddButton
								target={props.target}
								action="INS"
								label={props.titleButtonAdd ? props.titleButtonAdd : "Add"}
								onClick={props.onAddNew}
								onKeyDown={(e) => {
									if (e.key === "Enter") {
										props.onAddNew();
									}
								}}
								backgroundColor="#1160B7"
								textColor="#FFFFFF"
								height={64}
							/>
						</div>
					)}

					{props.isTurn && (
						<div className="ms-2">
							<WtcRoleButton
								height={35}
								borderRadius={12}
								fontSize={16}
								action="INS"
								target={PageTarget.turn}
								tabIndex={0}
								className="me-button my-refresh-button wtc-bg-primary text-white fw-normal"
								label={t("turns")}
								icon={
									"ri-group-line align-self-center p-overlay-badge d-flex justify-content-center text-nowrap my-size-icon-header mr-0"
								}
								onClick={() => setdialogVisibleEmpl(true)}
							/>
						</div>
					)}
					{props.isNewOrder && (
						<div className="ms-2">
							<Button
								style={{ minWidth: "75px" }}
								tabIndex={0}
								className="me-button my-refresh-button wtc-bg-primary text-white"
								label={t("neworder")}
								icon={
									"ri-add-line align-self-center p-overlay-badge d-flex justify-content-center text-nowrap my-size-icon-header mr-0"
								}
								onClick={handleClickRedirectOrder}
							/>
						</div>
					)}
				</div>
			</div>
			<DynamicDialog
				width={isMobile ? "90vw" : "80vw"}
				minHeight={"85vh"}
				visible={dialogVisibleEmpl}
				mode={"view"}
				position={"center"}
				title={t("turns")}
				okText=""
				cancelText="Hủy"
				draggable={false}
				isBackgroundWhite={true}
				resizeable={false}
				onClose={handleCloseDialog}
				body={
					<div
						className="m-1 row"
						style={{ maxHeight: bodyHeight - 198, overflow: "hidden", borderRadius: 12 }}
					>
						<WtcItemEmployeeTurn />
					</div>
				}
				footer={
					<>
						<>
							<Button
								type="button"
								label={t("action.close")}
								className="me-2 bg-white text-blue dialog-cancel-button"
								onClick={handleCloseDialog}
							/>
						</>
					</>
				}
				closeIcon
			/>
		</>
	);
}
