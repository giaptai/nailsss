import { t } from "i18next";
import { Button } from "primereact/button";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { formatDateTimeMMddYYYY, FormatMoneyNumber } from "../../const";
import { CustomerModel } from "../../models/category/Customer.model";
import DynamicDialog from "../DynamicDialog";
import { HeaderPrint } from "../payroll/HeaderPrint";
import { ListServiceSelectedModel } from "../../models/category/ListServiceSelected.model";
import QRCode from "react-qr-code";
type prop = {
	onClose: VoidFunction;
	customer?: CustomerModel;
	totalBill: string;
	totalDue: string;
	totalFeeCredit: string;
	totalTax: string;
	totalTip: string;
	totalDiscount: string;
	ListService: ListServiceSelectedModel[];
	orderCode: string;
};
export const PrintPayment = (props: prop) => {
	const printRef = useRef<HTMLDivElement>(null);
	const handlePrint = useReactToPrint({
		content: () => printRef.current,
	});
	return (
		<>
			<DynamicDialog
				width={303}
				visible={true}
				mode={"view"}
				position={"center"}
				title={t("bill")}
				okText=""
				cancelText=""
				draggable={false}
				isBackgroundGray={true}
				resizeable={false}
				onClose={props.onClose}
				body={
					<div ref={printRef} className="mb-1" style={{ fontSize: 13 }}>
						<div className="px-1">
							<HeaderPrint orderCode={props.orderCode} title={t("bill")} />
							<table className="w-100" style={{ lineHeight: "17px" }}>
								<tbody>
									<tr>
										<td>{t("customer")}:</td>
										<td className="text-end">
											<span className="fw-bold">
												{props.customer ? props.customer.firstName : "#"}{" "}
												{props.customer ? props.customer.lastName : "#"}
											</span>
										</td>
									</tr>
									<tr>
										<td>{t("total")}: </td>
										<td className="text-end">
											<span className="fw-bold">$ {props.totalBill}</span>
										</td>
									</tr>
									<tr>
										<td colSpan={3} style={{ borderBottom: "1px dashed" }}></td>
									</tr>
									<tr>
										<td className="fw-bold" colSpan={3}>
											{t("total_detail")}
										</td>
									</tr>
									<tr>
										<td>{t("due")}: </td>
										<td className="text-end">
											<span>$ {props.totalDue}</span>
										</td>
									</tr>
									<tr>
										<td>{t("feeCreditcard")}: </td>
										<td className="text-end">
											<span>$ {props.totalFeeCredit}</span>
										</td>
									</tr>
									<tr>
										<td>{t("tax")}: </td>
										<td className="text-end">
											<span>$ {props.totalTax}</span>
										</td>
									</tr>
									<tr>
										<td>{t("tip")}: </td>
										<td className="text-end">
											<span>$ {props.totalTip}</span>
										</td>
									</tr>
									<tr>
										<td>{t("discount")}: </td>
										<td className="text-end">
											<span>$ {props.totalDiscount}</span>
										</td>
									</tr>
									<tr>
										<td colSpan={3} style={{ borderBottom: "1px dashed" }}></td>
									</tr>
									<tr>
										<td className="fw-bold" colSpan={3}>
											{t("Services")}
										</td>
									</tr>
									{props.ListService.map((serviceSelected, serviceIndex) => {
										return serviceSelected.ListService?.map((item, itemIndex) => {
											return (
												<tr key={`${serviceIndex}-${itemIndex}`}>
													<td>
														{serviceIndex + itemIndex + 1}. {item.displayName}
													</td>
													<td className="text-end">
														<span>$ {FormatMoneyNumber(item.storePrice * item.unit)}</span>
													</td>
												</tr>
											);
										});
									})}
								</tbody>
								<tfoot>
									<tr>
										<td colSpan={4} className="text-center pt-2">
											<QRCode style={{ height: "auto", width: "50%" }} value={props.orderCode} />
										</td>
									</tr>
									<tr>
										<td colSpan={4} className="text-center pt-2 fw-bold">
											{formatDateTimeMMddYYYY(new Date())} - {t("see_u")}
										</td>
									</tr>
								</tfoot>
							</table>
						</div>
					</div>
				}
				footer={
					<>
						<Button
							type="button"
							label={t("action.close")}
							className="me-1 bg-white text-blue dialog-cancel-button p-0 px-1 m-0"
							onClick={props.onClose}
							icon="ri-close-line fs-6"
							style={{ height: 30, width: "32%", fontSize: 13 }}
						/>
						<Button
							type="button"
							label={t("print")}
							className="text-white wtc-bg-primary dialog-cancel-button p-0 px-1 m-0"
							icon="ri ri-printer-line fs-6"
							onClick={handlePrint}
							style={{ height: 30, width: "32%", fontSize: 13 }}
						/>
					</>
				}
				closeIcon
			/>
		</>
	);
};
