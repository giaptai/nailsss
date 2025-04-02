import { t } from "i18next";
import { Button } from "primereact/button";
import { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { formatCapitalize, FormatMoneyNumber } from "../../const";
import { OrderDetailPayrollModel } from "../../models/category/OrderDetailPayroll.model";
import { PayrollModel } from "../../models/category/Payroll.model";
import { PaymentDetailsTable } from "../commons/WtcItemPrintPayroll";
import DynamicDialog from "../DynamicDialog";
import { HeaderPrint } from "./HeaderPrint";

type Props = {
	item: PayrollModel[];
	onClose: VoidFunction;
	fromDate: string;
	toDate: string;
};
export default function WtcPrintAllStaffPayroll(props: Props) {
	const printRef = useRef<HTMLDivElement>(null);
	const [dialogVisible, setDialogVisible] = useState(true);
	const handleClickClose = () => {
		setDialogVisible(false);
	};

	const handlePrint = useReactToPrint({
		content: () => printRef.current,
	});
	const calculateTotal = (detail: OrderDetailPayrollModel[], key: string) => {
		return detail.reduce((sum, item) => {
			switch (key) {
				case "totalAmountServiceOrder":
					return sum + (item?.totalAmountServiceOrder || 0);
				case "totalAmountEmployeePrice":
					return sum + (item?.totalAmountEmployeePrice || 0);
				case "totalAmountService":
					return sum + (item?.totalAmountService || 0) + (item?.totalAmountDiscount || 0);
				case "totalCheck":
					return sum + (item?.totalAmountCheck || 0);
				case "totalCash":
					return sum + (item?.totalAmountCash || 0);
				case "totalAmountCheckBonus":
					return sum + (item?.totalAmountCheckBonus || 0);
				case "totalAmountCheckBonusRemaining":
					return sum + (item?.totalAmountCheck - item?.totalAmountCheckBonus);
				case "totalTip":
					return sum + (item?.totalTip || 0);
				case "totalAmountDiscount":
					return sum + (item?.totalAmountDiscount || 0);
				case "totalAmountGiftCard":
					return sum + (item?.totalAmountGiftCard || 0);
				case "totalPaymentEmployee":
					return sum + (item?.totalAmountService || 0) + (item?.totalTip || 0);
				case "totalSpaCash":
					return sum + (item?.totalAmountServiceOrder || 0) - (item?.totalAmountEmployeePrice || 0);
				default:
					return sum;
			}
		}, 0);
	};
	useEffect(() => {
		if (!dialogVisible) {
			setTimeout(() => {
				props.onClose();
			}, 400);
		}
	}, [dialogVisible, props]);
	return (
		<>
			<DynamicDialog
				width={303}
				visible={dialogVisible}
				mode={"view"}
				position={"center"}
				title={t("pay_roll")}
				okText=""
				cancelText=""
				draggable={false}
				isBackgroundGray={true}
				resizeable={false}
				onClose={handleClickClose}
				body={
					<div ref={printRef} className="mb-1" style={{ fontSize: 13 }}>
						<div className="px-1">
							<HeaderPrint fromDate={props.fromDate} title={t("payroll")} toDate={props.toDate} />

							{props.item.map((OrderDetailPayroll, index) => {
								return (
									<div key={index}>
										<table className="w-100" style={{ lineHeight: "17px" }}>
											<tbody>
												<tr>
													<td>{t("staff")}:</td>
													<td className="text-end">
														<span className="fw-bold">
															{formatCapitalize(OrderDetailPayroll.profile.firstName)}{" "}
															{formatCapitalize(OrderDetailPayroll.profile.middleName)}{" "}
															{formatCapitalize(OrderDetailPayroll.profile.lastName)}
														</span>
													</td>
												</tr>
												<tr>
													<td>{t("total")}: </td>
													<td className="text-end">
														<span className="fw-bold fs-6">
															${" "}
															{FormatMoneyNumber(
																OrderDetailPayroll.details.reduce(
																	(total, current) =>
																		total +
																			current.totalAmountService +
																			current.totalTip || 0,
																	0
																)
															)}
														</span>
													</td>
												</tr>

												<tr>
													<td
														className="pt-2"
														colSpan={4}
														style={{ borderBottom: "1px dashed" }}
													></td>
												</tr>
											</tbody>
										</table>
										<PaymentDetailsTable
											totalCash={calculateTotal(OrderDetailPayroll.details, "totalCash") || 0}
											totalSpa={calculateTotal(OrderDetailPayroll.details, "totalSpa") || 0}
											totalSpaCash={
												calculateTotal(OrderDetailPayroll.details, "totalSpaCash") || 0
											}
											totalCheckAndTip={
												calculateTotal(OrderDetailPayroll.details, "checkAndTip") || 0
											}
											totalDiscount={
												calculateTotal(OrderDetailPayroll.details, "totalAmountDiscount") || 0
											}
											totalTip={calculateTotal(OrderDetailPayroll.details, "totalTip") || 0}
											totalPaymentEmployee={
												calculateTotal(OrderDetailPayroll.details, "totalPaymentEmployee") || 0
											}
										/>
										{/* <table className="w-100" style={{ lineHeight: "17px" }}>
											<tbody>
												{OrderDetailPayroll.details.map((payroll, indexDetail) => {
													const totalDay = payroll.totalAmountService + payroll.totalTip;
													return (
														totalDay > 0 && (
															<>
																<tr>
																	<td className="fw-bold">
																		{t("date")}:{" "}
																		{formatDateTimeMMddYYYY(
																			payroll.transDate || ""
																		) ?? ""}
																	</td>
																	<td className="text-end fw-bold">
																		<span>
																			{t("total")}: ${" "}
																			{FormatMoneyNumber(totalDay)}
																		</span>
																	</td>
																</tr>

																<tr>
																	<td>1. {t("compensation")}:</td>
																	<td className="text-end">
																		<span>
																			{FormatMoneyNumber(
																				payroll.payrolls?.[0]?.config
																					?.compensation || ""
																			)}
																		</span>
																	</td>
																</tr>
																<tr>
																	<td>2. {t("check")}:</td>
																	<td className="text-end">
																		<span>$ 0</span>
																	</td>
																</tr>
																<tr>
																	<td>
																		3. {t("check/cash")}
																		{OrderDetailPayroll.profile && (
																			<>
																				({OrderDetailPayroll.profile.check}/
																				{10 - OrderDetailPayroll.profile.check})
																			</>
																		)}
																		:
																	</td>
																	<td className="text-end">
																		<span>
																			$
																			{FormatMoneyNumber(
																				payroll.totalAmountCheck || 0
																			)}
																			/$
																			{FormatMoneyNumber(
																				payroll.totalAmountCash || 0
																			)}{" "}
																		</span>
																	</td>
																</tr>
																<tr>
																	<td className="fw-bold" colSpan={3}>
																		{t("detail")}
																	</td>
																</tr>
																<tr>
																	<td>1. {t("Cash")}:</td>
																	<td className="text-end">
																		<span>$ 0</span>
																	</td>
																</tr>
																<tr>
																	<td>2. {t("spacash")}:</td>
																	<td className="text-end">
																		<span>$ 0</span>
																	</td>
																</tr>
																<tr>
																	<td>3. {t("total_spa")}:</td>
																	<td className="text-end">
																		<span>$ 0</span>
																	</td>
																</tr>
																<tr>
																	<td>4. {t("checkvstip")}:</td>
																	<td className="text-end">
																		<span>$ 0</span>
																	</td>
																</tr>
																<tr>
																	<td>5. {t("tip")}:</td>
																	<td className="text-end">
																		<span>
																			$ {FormatMoneyNumber(payroll.totalTip)}
																		</span>
																	</td>
																</tr>
																<tr>
																	<td>6. {t("discount")}:</td>
																	<td className="text-end">
																		<span>
																			${" "}
																			{FormatMoneyNumber(
																				payroll.totalAmountDiscount
																			)}
																		</span>
																	</td>
																</tr>
																{indexDetail + 1 !=
																	OrderDetailPayroll.details?.length && (
																	<tr>
																		<td
																			colSpan={4}
																			style={{ borderBottom: "1px dashed" }}
																		></td>
																	</tr>
																)}
															</>
														)
													);
												})}
											</tbody>
										</table> */}
										{index != props.item.length - 1 && (
											<>
												<div style={{ marginTop: 10, borderBottom: "1px dashed" }}></div>
												<div
													style={{
														marginTop: 1,
														marginBottom: 10,
														borderBottom: "1px dashed",
													}}
												></div>
											</>
										)}
									</div>
								);
							})}
							<div className="text-center">{t("thank_u")}</div>
						</div>
					</div>
				}
				footer={
					<>
						<Button
							type="button"
							label={t("action.close")}
							className="me-1 bg-white text-blue dialog-cancel-button p-0 px-1 m-0"
							onClick={handleClickClose}
							icon="ri-close-line fs-6"
							style={{ height: 30, width: "80px", fontSize: 13 }}
						/>
						<Button
							type="button"
							label={t("print")}
							className="text-white wtc-bg-primary dialog-cancel-button p-0 px-2 m-0"
							icon="ri ri-printer-line fs-6"
							onClick={handlePrint}
							style={{ height: 30, width: "80px", fontSize: 13 }}
						/>
					</>
				}
				closeIcon
			/>
		</>
	);
}
