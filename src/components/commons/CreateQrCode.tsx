import { t } from "i18next";
import { Button } from "primereact/button";
import { useRef } from "react";
import QRCode from "react-qr-code";
import { useReactToPrint } from "react-to-print";
import DynamicDialog from "../DynamicDialog";
import { HeaderPrint } from "../payroll/HeaderPrint";
import { formatDateTimeMMddYYYY, formatHidePhoneNumber } from "../../const";
import { useAppSelector } from "../../app/hooks";
import { CustomerModel } from "../../models/category/Customer.model";

type QrCodeProps = {
	value: string;
	customer?: CustomerModel;
	onClose: VoidFunction;
};

export default function CreateQrCode(props: QrCodeProps) {
	const printRef = useRef<HTMLDivElement>(null);
	const storeConfigState = useAppSelector((state) => state.storeconfig);
	const StoreInfoName = storeConfigState.list.find((item: any) => item.key === "name");
	const handlePrint = useReactToPrint({
		content: () => printRef.current,
	});

	return (
		<DynamicDialog
			width={303}
			// minHeight={'90%'}
			// height={'auto'}
			visible={true}
			mode={"view"}
			position={"center"}
			title={t("QR CODE")}
			okText=""
			cancelText=""
			draggable={false}
			isBackgroundGray={true}
			resizeable={false}
			onClose={props.onClose}
			body={
				<div ref={printRef} className="mb-1" style={{ fontSize: 13 }}>
					<div className="mb-1">
						<HeaderPrint title="QR CODE" orderCode={props.value} />
					</div>
					<table className="mb-1 w-100" style={{ lineHeight: "17px" }}>
						<tbody>
							<tr>
								<td>{t("customer")}:</td>
								<td className="text-end">
									<span className="fw-bold">
										{props.customer?.firstName} {props.customer?.lastName}
									</span>
								</td>
							</tr>
							<tr>
								<td>{t("phone")}:</td>
								<td className="text-end">
									<span className="fw-bold">
										{formatHidePhoneNumber(props.customer?.phone || "")}
									</span>
								</td>
							</tr>

							<tr>
								<td colSpan={4} style={{ borderBottom: "1px dashed" }}></td>
							</tr>
						</tbody>
					</table>
					<div className="d-flex justify-content-center flex-column  py-2" style={{ alignItems: "center" }}>
						<QRCode
							// size={450}
							style={{ height: "auto", width: "50%" }}
							value={props.value}
						/>
						<div className="text-center pt-2 fw-bold">
							{formatDateTimeMMddYYYY(new Date())} - {t("welcome_store")} {StoreInfoName.value}
						</div>
					</div>
				</div>
			}
			footer={
				<>
					<Button
						type="button"
						label={t("action.close")}
						className="me-3 bg-white text-blue dialog-cancel-button"
						onClick={props.onClose}
					/>
					<Button
						type="button"
						label={t("print_qr")}
						className="text-white wtc-bg-primary dialog-cancel-button"
						icon="ri ri-printer-line"
						onClick={handlePrint}
					/>
				</>
			}
			closeIcon
		/>
	);
}
