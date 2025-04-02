import { t } from "i18next";
import { Button } from "primereact/button";
import { Tooltip } from "primereact/tooltip";
import { useState } from "react";
import { isMobile } from "react-device-detect";
import { useDispatch } from "react-redux";
import useWindowSize from "../app/screen";
import { selectItemTurn } from "../slices/turn.slice";
import RefreshButton from "./commons/RefreshButton";
import WtcAddButton from "./commons/WtcAddButton";
import WtcItemEmployeeTurn from "./commons/WtcItemEmployeeTurn";
import WtcSearchInput from "./commons/WtcSearchText";
import DynamicDialog from "./DynamicDialog";
import WtcButton from "./commons/WtcButton";
import { PageTarget } from "../const";
import WtcRoleButton from "./commons/WtcRoleButton";
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
};
export default function HeaderList(props: HeaderListProps) {
	const [dialogVisibleEmpl, setdialogVisibleEmpl] = useState(false);
	const dispatch = useDispatch();
	const screenSize = useWindowSize();
	const bodyHeight = screenSize.height;
	let title = "";
	switch (props.target) {
		case PageTarget.employee:
			title = t("Employees");
			break;
		case PageTarget.customer:
			title = t("Customers");
			break;
		case PageTarget.store:
			title = t("Stores");
			break;
		case PageTarget.role:
			title = t("Roles");
			break;
		case PageTarget.language:
			title = t("Codes");
			break;
		case PageTarget.window:
			title = "Window";
			break;
		case PageTarget.menu:
			title = "Menu";
			break;
		case PageTarget.service:
			title = t("service");
			break;
		case PageTarget.giftcard:
			title = t("giftcard");
			break;
		case PageTarget.order:
			title = t("orderlist");
			break;
		case PageTarget.payment:
			title = t("paymentlist");
			break;
	}
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
			<div className="font-title-card wtc-bg-title p-2 rounded-3 d-flex align-items-center w-100 justify-content-end">
				{title && <div className="flex-grow-1 mx-2"> {title}</div>}
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
				<div
					className="flex-grow-1 me-2"
					style={{ maxWidth: props.maxWidthSearch ? props.maxWidthSearch : 400 }}
				>
					<WtcSearchInput
						placeholder={props.placeHolderSearch ? props.placeHolderSearch : t("action.search")}
						onChanged={props.onSearchText}
					/>
				</div>
				{/* <WtcSortButton label={t('sort')} onClick={() => { }} /> */}
				{!props.hideAdd && (
					<div className="">
						<WtcAddButton
							target={props.target}
							action="INS"
							label={t("action.create")}
							onClick={props.onAddNew}
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									props.onAddNew();
								}
							}}
						/>
					</div>
				)}
				<div className="ms-2">
					<RefreshButton callback={props.callback} />
				</div>
				{props.isFilterStatus && (
					<div className="ms-2">
						<Button
							style={{ minWidth: "75px" }}
							id="button_fillter"
							tabIndex={0}
							className="me-button my-refresh-button wtc-bg-white text-blue"
							label={""}
							icon={
								"ri-filter-2-line align-self-center p-overlay-badge d-flex justify-content-center text-nowrap my-size-icon-header mr-0"
							}
							onClick={(e) => props.onClickFilterStatus && props.onClickFilterStatus(e)}
						/>
						<Tooltip position="bottom" target="#button_fillter" content={t("fillter")} />
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
