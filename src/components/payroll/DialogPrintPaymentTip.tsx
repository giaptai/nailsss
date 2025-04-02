import { t } from "i18next";
import { Button } from "primereact/button";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useReactToPrint } from "react-to-print";
import { useAppSelector } from "../../app/hooks";
import { paymentStatus } from "../../app/state";
import {
	convertToYYYYMMDD,
	formatDateTimeMMddYYYY,
	FormatMoneyNumber,
	PaymentEmployeeModel,
	typeFilter,
} from "../../const";
import { OrderDetailPayrollModel } from "../../models/category/OrderDetailPayroll.model";
import { ProfileModel } from "../../models/category/Profile.model";
import { paymentTipForEmployee, resetActionPaymentTipState, resetActionState } from "../../slices/payment.slice";
import { getPayrollsAfterPaymentTip } from "../../slices/payroll.slice";
import { completed, failed, processing } from "../../utils/alert.util";
import DynamicDialog from "../DynamicDialog";
import { HeaderPrint } from "./HeaderPrint";
type Props = {
	item: OrderDetailPayrollModel[] | undefined;
	employee: ProfileModel | undefined;
	onClose: VoidFunction;
	fromDate: string;
	toDate: string;
	employeeId: string | undefined;
};
export default function DialogPrintPaymentTip(props: Props) {
	const printRef = useRef<HTMLDivElement>(null);
	const [dialogVisible, setDialogVisible] = useState(true);
	const dispatch = useDispatch();
	const paymentState = useAppSelector((state) => state.payment);
	const calculateTipPaid = (item: OrderDetailPayrollModel) => {
		return item.payrolls
			.filter((item) => item.status.code === paymentStatus.paid && item.type === "TIP")
			.reduce((sum, item) => sum + (item.amountTip || 0), 0);
	};
	const handlePrint = useReactToPrint({
		content: () => printRef.current,
	});
	const paymentTip = () => {
		if (props.employeeId) {
			const submitData: PaymentEmployeeModel = {
				from: convertToYYYYMMDD(props.fromDate),
				to: convertToYYYYMMDD(props.toDate),
				employeeId: props.employeeId,
			};
			dispatch(paymentTipForEmployee(submitData));
		}
	};
	const handleClickClose = () => {
		setDialogVisible(false);
	};
	useEffect(() => {
		if (!dialogVisible) {
			setTimeout(() => {
				props.onClose();
			}, 1000);
		}
	}, [dialogVisible, props]);
	useEffect(() => {
		if (paymentState.actionPaymentTipState) {
			switch (paymentState.actionPaymentTipState.status!) {
				case "completed":
					completed();
					// const dataUpdate = {
					// 	action: "TIP",
					// 	employeeId: props.employeeId,
					// };
					// dispatch(updateStatusPaid(dataUpdate));
					const data = {
						fromDate: convertToYYYYMMDD(props.fromDate),
						toDate: convertToYYYYMMDD(props.toDate),
						status: typeFilter[2],
					};
					dispatch(getPayrollsAfterPaymentTip(data));
					handleClickClose();
					dispatch(resetActionPaymentTipState());
					// const item = payrollState.list.find((e) => e.employeeId == props.employeeId);
					// dispatch(selectItem(item));
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
	}, [paymentState.actionPaymentTipState]);
	return (
		<>
			<DynamicDialog
				width={303}
				visible={dialogVisible}
				fontSizeTitle={20}
				mode={"view"}
				position={"center"}
				title={t("payment_tip")}
				okText=""
				cancelText=""
				draggable={false}
				isBackgroundGray={true}
				resizeable={false}
				onClose={handleClickClose}
				body={
					<div ref={printRef} className="mb-1" style={{ fontSize: 13 }}>
						{props.item && props.employee && (
							<div className="px-1">
								<HeaderPrint fromDate={props.fromDate} title={t("payment_tip")} toDate={props.toDate} />
								<table className="w-100" style={{ lineHeight: "17px" }}>
									<tbody>
										<tr>
											<td>{t("staff")}:</td>
											<td className="text-end">
												<span className="fw-bold">
													{props.employee.firstName} {props.employee.middleName}{" "}
													{props.employee.lastName}
												</span>
											</td>
										</tr>
										<tr>
											<td>{t("total")}: </td>
											<td className="text-end">
												<span className="fw-bold fs-6">
													${" "}
													{FormatMoneyNumber(
														props.item.reduce(
															(total, current) => total + current.totalTip || 0,
															0
														) -
															props.item.reduce(
																(total, current) =>
																	total + calculateTipPaid(current) || 0,
																0
															)
													)}
												</span>
											</td>
										</tr>

										<tr>
											<td
												className="pt-2"
												colSpan={3}
												style={{ borderBottom: "1px dashed" }}
											></td>
										</tr>
										<tr>
											<td className="fw-bold" colSpan={3}>
												{t("detail")}
											</td>
										</tr>
									</tbody>
								</table>
								{props.item
									.filter((i) => i.totalTip > 0 && i.totalTip - calculateTipPaid(i) > 0)
									.map((payroll, index) => (
										<>
											<table style={{ width: "100%", lineHeight: "17px" }}>
												<tbody>
													<tr>
														<td>
															{index + 1 + ". " + t("date")}:{" "}
															{formatDateTimeMMddYYYY(payroll.transDate || "") ?? ""}
														</td>
														<td className="text-end">
															{t("tip")}: ${" "}
															{FormatMoneyNumber(
																payroll.totalTip - calculateTipPaid(payroll) || ""
															)}
														</td>
													</tr>
												</tbody>
											</table>
										</>
									))}
							</div>
						)}
					</div>
				}
				footer={
					<div id="button-footer-print">
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
							label={t("payment")}
							className=" me-1 text-white wtc-bg-primary dialog-cancel-button p-0 px-1 m-0"
							icon="pi pi-dollar fs-6"
							onClick={paymentTip}
							style={{ height: 30, width: "90px", fontSize: 13 }}
						/>
						<Button
							type="button"
							label={t("print")}
							className="text-white wtc-bg-primary dialog-cancel-button p-0 px-2 m-0"
							icon="ri ri-printer-line fs-6"
							onClick={handlePrint}
							style={{ height: 30, width: "80px", fontSize: 13 }}
						/>
					</div>
				}
				closeIcon
			/>
		</>
	);
}
