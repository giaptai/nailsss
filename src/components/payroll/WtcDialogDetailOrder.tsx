import { t } from "i18next";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { ColumnGroup } from "primereact/columngroup";
import { useEffect, useState } from "react";
import { Row } from "react-bootstrap";
import { isMobile } from "react-device-detect";
import useWindowSize from "../../app/screen";
import { formatDateTimeMMddYYYY, FormatMoneyNumber, MethodPayment } from "../../const";
import DataTables from "../commons/DataTable";
import WtcCard from "../commons/WtcCard";
import DynamicDialog from "../DynamicDialog";
type Props = {
	item: any | undefined;
	onClose: VoidFunction;
};
export default function WtcDialogDetailOrder(props: Props) {
	const screenSize = useWindowSize();
	const bodyHeight = screenSize.height;
	const [rowsService, setRowsService] = useState<any>();
	const [dialogVisible, setDialogVisible] = useState(true);
	const [rowsPayment, setRowsPayment] = useState<any>();
	const headerGroupServices = (
		<ColumnGroup>
			<Row>
				<Column header={t("name")} align={"center"} />
				<Column header={t("value")} align={"center"} />
			</Row>
		</ColumnGroup>
	);
	const headerGroupPayment = (
		<ColumnGroup>
			<Row>
				<Column header={t("paymentmethod")} align={"center"} />
				<Column header={t("value")} align={"center"} />
			</Row>
		</ColumnGroup>
	);
	const columnsServices = [
		{
			field: "name",
			align: "left",
		},
		{
			field: "value",
			align: "right",
		},
	];
	const columnsPayments = [
		{
			field: "method",
			align: "left",
		},
		{
			field: "value",
			align: "right",
		},
	];
	const handleClickClose = () => {
		setDialogVisible(false);
	};
	useEffect(() => {
		if (!dialogVisible) {
			setTimeout(() => {
				props.onClose();
			}, 400);
		}
	}, [dialogVisible, props]);
	useEffect(() => {
		if (props.item?.orderDetail?.attributes?.services.length) {
			const newRows = props.item?.orderDetail?.attributes?.services.map((item: any, index: number) => ({
				id: index + 1,
				value: FormatMoneyNumber(item?.storePrice * item.unit || 0),
				name: item?.displayName,
				data: item,
			}));
			setRowsService(newRows);
		} else {
			setRowsService(undefined);
		}
		if (props.item?.order?.payment?.details.length) {
			const newRows = props.item?.order?.payment?.details.map((item: any, index: number) => ({
				id: index + 1,
				value: FormatMoneyNumber(item?.amount || 0),
				method:
					item?.method == MethodPayment.CREDITCARD
						? t("credit_card") + " - " + t(item?.attributes?.optionPayment || "") || ""
						: t(item.method),
				data: item,
			}));
			setRowsPayment(newRows);
		} else {
			setRowsPayment(undefined);
		}
	}, [props.item]);
	return (
		<>
			<DynamicDialog
				width={isMobile ? "90vw" : "60vw"}
				visible={dialogVisible}
				mode={"view"}
				position={"center"}
				title={
					t("detail") +
					" - " +
					props?.item?.order?.payment?.code +
					" - " +
					formatDateTimeMMddYYYY(props.item?.transDate)
				}
				okText=""
				cancelText=""
				draggable={false}
				isBackgroundGray={true}
				resizeable={false}
				onClose={handleClickClose}
				body={
					<div className="row m-0 p-0 py-0 px-1">
						<div className="col-md-6 p-2 pe-1">
							<WtcCard
								classNameBody="p-0 m-0 h-100 pb-2"
								className="h-100"
								title={<span className="fs-title">{t("payments")}</span>}
								body={
									<div className="p-2 pb-0">
										<DataTables
											id="payroll-table"
											data={rowsPayment}
											columns={columnsPayments}
											headerGroup={headerGroupPayment}
											heightScroll={bodyHeight - 280}
										/>
									</div>
								}
							/>
						</div>
						<div className="col-md-6 p-2 ps-1">
							<WtcCard
								classNameBody="p-0 m-0 h-100 pb-2"
								className="h-100"
								title={<span className="fs-title">{t("Services")}</span>}
								body={
									<div className="p-2 pb-0">
										<DataTables
											id="payroll-table"
											data={rowsService}
											columns={columnsServices}
											headerGroup={headerGroupServices}
											// onRowClick={handleRowClick}
											heightScroll={bodyHeight - 280}
										/>
									</div>
								}
							/>
						</div>
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
							style={{ height: 30, width: "80px" }}
						/>
					</div>
				}
				closeIcon
			/>
		</>
	);
}
