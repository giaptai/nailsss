import { t } from "i18next";
import { Button } from "primereact/button";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useReactToPrint } from "react-to-print";
import { useAppSelector } from "../../app/hooks";
import { convertToYYYYMMDD, formatCapitalize, FormatMoneyNumber, PageTarget, PaymentEmployeeModel } from "../../const";
import { OrderDetailPayrollModel } from "../../models/category/OrderDetailPayroll.model";
import { ProfileModel } from "../../models/category/Profile.model";
import { paymentServiceForEmployee, resetActionState } from "../../slices/payment.slice";
import { updateStatusPaid } from "../../slices/payroll.slice";
import { completed, failed, processing } from "../../utils/alert.util";
import { PaymentDetailsTable } from "../commons/WtcItemPrintPayroll";
import DynamicDialog from "../DynamicDialog";
import { HeaderPrint } from "./HeaderPrint";
import WtcRoleButton from "../commons/WtcRoleButton";

type Props = {
	item: OrderDetailPayrollModel[] | undefined;
	employee: ProfileModel | undefined;
	onClose: VoidFunction;
	fromDate: string;
	toDate: string;
	isPaymentService: boolean;
	employeeId: string | undefined;
};
export default function WtcPrintPayroll(props: Props) {
	const printRef = useRef<HTMLDivElement>(null);
	const [dialogVisible, setDialogVisible] = useState(true);
	const dispatch = useDispatch();
	const paymentState = useAppSelector((state) => state.payment);
	const paymentService = () => {
		if (props.employeeId) {
			const submitData: PaymentEmployeeModel = {
				from: convertToYYYYMMDD(props.fromDate),
				to: convertToYYYYMMDD(props.toDate),
				employeeId: props.employeeId,
			};
			dispatch(paymentServiceForEmployee(submitData));
		}
	};
	const handlePrint = useReactToPrint({
		content: () => printRef.current,
	});
	const handleClickClose = () => {
		setDialogVisible(false);
	};

	const calculateTotal = (key: string) => {
		return props.item?.reduce((sum, item) => {
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
		if (paymentState.actionState) {
			switch (paymentState.actionState.status!) {
				case "completed":
					completed();
					dispatch(resetActionState());
					const dataUpdate = {
						action: "SERVICE",
						employeeId: props.employeeId,
					};
					dispatch(updateStatusPaid(dataUpdate));
					const dataUpdateTip = {
						action: "TIP",
						employeeId: props.employeeId,
					};
					dispatch(updateStatusPaid(dataUpdateTip));
					handleClickClose();
					break;
				case "loading":
					processing();
					break;
				case "failed":
					failed(t(paymentState.actionState.error!));
					dispatch(resetActionState());
					break;
			}
		}
	}, [paymentState.actionState]);
	useEffect(() => {
		if (!dialogVisible) {
			setTimeout(() => {
				props.onClose();
			}, 1000);
		}
	}, [dialogVisible, props]);
	return (
		<>
			<DynamicDialog
				width={303}
				visible={dialogVisible}
				fontSizeTitle={props.isPaymentService ? 17 : 20}
				mode={"view"}
				position={"center"}
				title={props.isPaymentService ? t("payment_service") : t("pay_roll")}
				okText=""
				cancelText=""
				draggable={false}
				isBackgroundGray={true}
				resizeable={false}
				onClose={handleClickClose}
				body={
					<div ref={printRef} className="mb-1" style={{ fontSize: 13 }}>
						{props.item && props.employee && (
							<div className="px-1" key={props.employeeId}>
								<HeaderPrint
									fromDate={props.fromDate}
									title={props.isPaymentService ? t("payment_service") : t("pay_roll")}
									toDate={props.toDate}
								/>
								<table className="w-100" style={{ lineHeight: "17px" }}>
									<tbody>
										<tr>
											<td>{t("staff")}:</td>
											<td className="text-end">
												<span className="fw-bold">
													{formatCapitalize(props.employee.firstName)}{" "}
													{formatCapitalize(props.employee.middleName)}{" "}
													{formatCapitalize(props.employee.lastName)}
												</span>
											</td>
										</tr>
										<tr>
											<td>{t("total")}: </td>
											<td className="text-end">
												<span className="fw-bold">
													${" "}
													{/* {props.isPaymentService
														? FormatMoneyNumber(
																props.item.reduce(
																	(total, current) =>
																		total + current.totalAmountService || 0,
																	0
																) -
																	props.item.reduce(
																		(total, current) =>
																			total + calculateServicePaid(current) || 0,
																		0
																	)
														  )
														: FormatMoneyNumber(
																props.item.reduce(
																	(total, current) =>
																		total +
																			current.totalAmountService +
																			current.totalTip || 0,
																	0
																)
														  )} */}
													{FormatMoneyNumber(
														props.item.reduce(
															(total, current) =>
																total + current.totalAmountEmployeePrice,
															0
														)
													)}
												</span>
											</td>
										</tr>
										<tr>
											<td colSpan={4} style={{ borderBottom: "1px dashed" }}></td>
										</tr>
									</tbody>
								</table>
								<PaymentDetailsTable
									totalCash={calculateTotal("totalCash") || 0}
									totalSpa={calculateTotal("totalSpa") || 0}
									totalSpaCash={calculateTotal("totalSpaCash") || 0}
									totalCheckAndTip={calculateTotal("checkAndTip") || 0}
									totalDiscount={calculateTotal("totalAmountDiscount") || 0}
									totalTip={calculateTotal("totalTip") || 0}
									totalPaymentEmployee={calculateTotal("totalPaymentEmployee") || 0}
									isFooter
								/>
								{/* <table className="w-100" style={{ lineHeight: "17px" }}>
									<tbody>
										{props.item.map((payroll, _index) => {
											const totalDay = props.isPaymentService
												? payroll.totalAmountService - calculateServicePaid(payroll)
												: payroll.totalAmountService + payroll.totalTip;

											return (
												totalDay > 0 && (
													<React.Fragment key={_index}>
														<tr key={`${_index}-date`}>
															<td className="fw-bold">
																{t("date")}:{" "}
																{formatDateTimeMMddYYYY(payroll.transDate || "") ?? ""}
															</td>
															<td className="text-end fw-bold">
																<span>
																	{t("total")}: $ {FormatMoneyNumber(totalDay)}
																</span>
															</td>
														</tr>

														<tr key={`${_index}-compensation`}>
															<td>1. {t("compensation")}:</td>
															<td className="text-end">
																<span>
																	{FormatMoneyNumber(
																		payroll.payrolls?.[0]?.config?.compensation ||
																			""
																	)}
																</span>
															</td>
														</tr>

														<tr key={`${_index}-check`}>
															<td>2. {t("check")}:</td>
															<td className="text-end">
																<span>$ 0</span>
															</td>
														</tr>

														<tr key={`${_index}-check-cash`}>
															<td>
																3. {t("check/cash")}
																{props.employee && (
																	<>
																		({props.employee?.check}/
																		{10 - props?.employee?.check})
																	</>
																)}
																:
															</td>
															<td className="text-end">
																<span>
																	${FormatMoneyNumber(payroll.totalAmountCheck || 0)}/
																	${FormatMoneyNumber(payroll.totalAmountCash || 0)}
																</span>
															</td>
														</tr>

														<tr key={`${_index}-detail`}>
															<td className="fw-bold" colSpan={3}>
																{t("detail")}
															</td>
														</tr>

														<tr key={`${_index}-cash`}>
															<td>1. {t("Cash")}:</td>
															<td className="text-end">
																<span>$ 0</span>
															</td>
														</tr>

														<tr key={`${_index}-spacash`}>
															<td>2. {t("spacash")}:</td>
															<td className="text-end">
																<span>$ 0</span>
															</td>
														</tr>

														<tr key={`${_index}-total_spa`}>
															<td>3. {t("total_spa")}:</td>
															<td className="text-end">
																<span>$ 0</span>
															</td>
														</tr>

														<tr key={`${_index}-checkvstip`}>
															<td>4. {t("checkvstip")}:</td>
															<td className="text-end">
																<span>$ 0</span>
															</td>
														</tr>

														<tr key={`${_index}-tip`}>
															<td>5. {t("tip")}:</td>
															<td className="text-end">
																<span>$ {FormatMoneyNumber(payroll.totalTip)}</span>
															</td>
														</tr>

														<tr key={`${_index}-discount`}>
															<td>6. {t("discount")}:</td>
															<td className="text-end">
																<span>
																	$ {FormatMoneyNumber(payroll.totalAmountDiscount)}
																</span>
															</td>
														</tr>

														{_index + 1 !== props.item?.length && (
															<tr key={`${_index}-divider`}>
																<td
																	colSpan={4}
																	style={{ borderBottom: "1px dashed" }}
																></td>
															</tr>
														)}
													</React.Fragment>
												)
											);
										})}

										<tr>
											<td className="fw-bold" colSpan={3}>
												{t("detail")}
											</td>
										</tr>

										<tr>
											<td>1. {t("Cash")}:</td>
											<td className="text-end">
												<span>$ {FormatMoneyNumber(calculateTotal("totalCash") || 0)}</span>
											</td>
										</tr>

										<tr>
											<td>2. {t("spacash")}:</td>
											<td className="text-end">
												<span>$ {FormatMoneyNumber(calculateTotal("totalSpaCash") || 0)}</span>
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
												<span>$ {FormatMoneyNumber(calculateTotal("totalTip") || 0)}</span>
											</td>
										</tr>

										<tr>
											<td>6. {t("discount")}:</td>
											<td className="text-end">
												<span>
													$ {FormatMoneyNumber(calculateTotal("totalAmountDiscount") || 0)}
												</span>
											</td>
										</tr>
										<tr>
											<td colSpan={4} style={{ borderBottom: "1px dashed" }}></td>
										</tr>
										<tr>
											<td colSpan={4} className="text-center pt-2">
												{t("payment_due")}{" "}
												<div className="fw-bold fs-4 pt-2">
													$ {FormatMoneyNumber(calculateTotal("totalPaymentEmployee") || 0)}
												</div>
											</td>
										</tr>
									</tbody>
									<tfoot>
										<tr>
											<td colSpan={4} className="text-center pt-3">
												{t("thank_u")}
											</td>
										</tr>
									</tfoot>
								</table> */}
							</div>
						)}
					</div>
				}
				footer={
					<div
						id="button-footer-print"
						className=" d-flex wtc-bg-white align-items-center justify-content-end"
					>
						<Button
							type="button"
							label={t("action.close")}
							className="me-1 bg-white text-blue dialog-cancel-button p-0 px-1 m-0"
							onClick={handleClickClose}
							icon="ri-close-line fs-6"
							style={{ height: 30, width: "80px", fontSize: 13 }}
						/>

						{props.isPaymentService && (
							<Button
								type="button"
								label={t("payment")}
								className="me-1 text-white wtc-bg-primary dialog-cancel-button py-0 px-1 m-0"
								icon="pi pi-dollar fs-6 mr-2"
								onClick={paymentService}
								style={{ height: 30, width: "90px", fontSize: 13 }}
							/>
						)}
						<WtcRoleButton
							action="PRI"
							target={PageTarget.payroll}
							label={t("print")}
							icon="ri ri-printer-line fs-6"
							className="text-white wtc-bg-primary dialog-cancel-button p-0 px-2 m-0"
							height={30}
							width="80"
							fontSize={13}
							minWidth={80}
							onClick={handlePrint}
						/>
						{/* <Button
							type="button"
							label={t("print")}
							className="text-white wtc-bg-primary dialog-cancel-button p-0 px-2 m-0"
							icon="ri ri-printer-line fs-6"
							onClick={handlePrint}
							style={{ height: 30, width: "80px", fontSize: 13 }}
						/> */}
					</div>
				}
				closeIcon
			/>
		</>
	);
}
