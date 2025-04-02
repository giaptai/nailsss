import { t } from "i18next";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";
import { useState } from "react";
import { isMobile } from "react-device-detect";
import { useAppSelector } from "../../app/hooks";
import { formatCapitalize, formatHidePhoneNumber } from "../../const";
import DynamicDialog from "../DynamicDialog";
import WtcCard from "../commons/WtcCard";
import WtcMenuItem from "../commons/WtcMenuItem";

export default function PaymentCustomer() {
	const [dialogVisible, setdialogVisible] = useState(false);
	const [tipMoney, setTipMoney] = useState(Number);
	const checkinState = useAppSelector((state) => state.newOder);
	const menuitem = (item: any) => {
		return (
			<div className="menu-item-2 me-1 w-100" style={{ height: 52, borderRadius: 12 }}>
				<div className="float-start" style={{ width: "auto" }}>
					<div className="float-start mt-2" style={{ height: 30 }}>
						<div
							className="ms-2 me-1 px-1 fs-name-empl"
							style={{
								height: 35,
								paddingTop: 8,
								color: "#30363F",
								background: "#d0e1fd",
								borderRadius: 10,
							}}
						>
							<span className="pt-1 mx-1">{t("customer")}</span>
						</div>
					</div>
					<div className="ms-1 float-end mt-1">
						<div
							className="fs-value fw-bold"
							style={{
								overflow: "hidden",
								whiteSpace: "nowrap",
								textOverflow: "ellipsis",
								color: "#30363F",
							}}
						>
							{formatCapitalize(item?.firstName || "")} {formatCapitalize(item?.lastName || "")}
						</div>
						<div className="my-label-in-grid fs-value-disabled" style={{ whiteSpace: "nowrap" }}>
							{formatHidePhoneNumber(item?.phone) || ""}
						</div>
					</div>
				</div>
			</div>
		);
	};
	return (
		<>
			<div className="d-flex flex-column h-100">
				<WtcCard
					classNameBody="p-0 m-0 px-1 h-100"
					className="h-100"
					body={
						<div className="h-100">
							<div className={`w-100 d-flex flex-column me-order-types`} style={{ overflowX: "auto" }}>
								<div className="d-flex w-100">
									<WtcMenuItem
										height={45}
										padding="px-2"
										iconClassName="custom-processing-button background-white"
										icon="ri-list-unordered"
										body={
											<>
												<div className="fs-value">{checkinState.code}</div>
											</>
										}
										flexGrow1={<></>}
									/>
								</div>
								<div className="d-flex w-100">{menuitem(checkinState.customer)}</div>
							</div>
						</div>
					}
				/>
			</div>
			<DynamicDialog
				width={isMobile ? "90vw" : "85vw"}
				minHeight={"25vh"}
				visible={dialogVisible}
				mode={"add"}
				position={"center"}
				title={t("note")}
				okText=""
				cancelText=""
				draggable={false}
				isBackgroundGray={true}
				resizeable={false}
				onClose={() => setdialogVisible(false)}
				body={
					<div className="my-background-order p-2">
						<InputNumber
							className="w-100"
							inputId="currency-us"
							value={tipMoney}
							onValueChange={(e) => setTipMoney(e.value || 0)}
							mode="currency"
							currency="USD"
							locale="en-US"
						/>
					</div>
				}
				closeIcon
				footer={
					<div className=" d-flex wtc-bg-white align-items-center justify-content-end">
						<Button
							type="button"
							label={t("action.close")}
							className="bg-white text-blue dialog-cancel-button"
							icon="ri ri-close-line"
							onClick={() => setdialogVisible(false)}
						/>
					</div>
				}
			/>
		</>
	);
}
