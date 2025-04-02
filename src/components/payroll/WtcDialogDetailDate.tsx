import { t } from "i18next";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { ColumnGroup } from "primereact/columngroup";
import { useEffect, useState } from "react";
import { Row } from "react-bootstrap";
import { isMobile } from "react-device-detect";
import useWindowSize from "../../app/screen";
import { formatCapitalize, formatDateTimeMMddYYYY, FormatMoneyNumber } from "../../const";
import DataTables from "../commons/DataTable";
import IconButton from "../commons/IconButton";
import DynamicDialog from "../DynamicDialog";
import WtcDialogDetailOrder from "./WtcDialogDetailOrder";

type Props = {
	item: any | undefined;
	onClose: VoidFunction;
	profile: any;
};
export default function WtcDialogDetailDate(props: Props) {
	const [showDetailOrder, setShowDetailOrder] = useState(false);
	const [itemDetailOrder, setItemDetailOrder] = useState();

	const [rows, setRows] = useState<any>();
	const [dialogVisible, setDialogVisible] = useState(true);
	const screenSize = useWindowSize();
	const bodyHeight = screenSize.height;
	const headerGroup = (
		<ColumnGroup>
			<Row>
				<Column header={t("payment_code")} align={"center"} rowSpan={2} />
				<Column header={t("order_code")} align={"center"} rowSpan={2} />
				<Column header={t("total_money")} align={"center"} rowSpan={2} />
				<Column header={t("tax")} align={"center"} rowSpan={2} />
				<Column header={t("tip")} align={"center"} colSpan={2} />
				<Column header={t("discount")} align={"center"} rowSpan={2} />
				<Column header={t("customer")} align={"center"} rowSpan={2} />
				<Column header={t("")} align={"center"} rowSpan={2} />
			</Row>
			<Row>
				<Column header={t("store")} align={"center"} />
				<Column header={t("employee")} align={"center"} />
			</Row>
		</ColumnGroup>
	);
	const columns = [
		{
			field: "paymentCode",
			align: "center",
		},
		{
			field: "code",
			align: "center",
		},
		{
			field: "totalMoney",
			align: "right",
		},
		{
			field: "totalTax",
			align: "right",
		},
		{
			field: "totalTipStore",
			align: "right",
		},
		{
			field: "totalTipEmployee",
			align: "right",
		},
		{
			field: "totalDiscount",
			align: "right",
		},
		{
			field: "customer",
			align: "left",
		},
		{
			align: "center",
			body: (rowData: any) => actionBodyTemplate(rowData),
		},
	];
	const handleClickClose = () => {
		setDialogVisible(false);
	};

	const actionBodyTemplate = (rowData: any) => {
		return (
			<>
				<div className="d-flex justify-content-center">
					<div>
						<IconButton
							icon={"ri-more-fill"}
							width={35}
							height={35}
							onClick={() => {
								setItemDetailOrder(rowData?.data);
								setShowDetailOrder(true);
							}}
							actived={false}
							className="custom-primary-button"
						/>
					</div>
					<div style={{ alignSelf: "center" }}>&ensp;Read more</div>
				</div>
			</>
		);
	};
	const menuDetail = () => {
		return (
			<DataTables
				id="payroll-table"
				data={rows}
				columns={columns}
				headerGroup={headerGroup}
				// onRowClick={handleRowClick}

				heightScroll={bodyHeight - 190}
			/>
		);
	};
	useEffect(() => {
		if (!dialogVisible) {
			setTimeout(() => {
				props.onClose();
			}, 300);
		}
	}, [dialogVisible, props]);
	useEffect(() => {
		if (props.item?.payrolls.length) {
			const newRows = props.item?.payrolls.map((item: any, index: number) => ({
				id: index + 1,
				totalMoney: FormatMoneyNumber(item?.order?.totalMoney + item.amountCreditCardFee || 0),
				code: item?.order?.code,
				customer: formatCapitalize(item?.order?.customer?.lastName + " " + item?.order?.customer?.firstName),
				paymentCode: item?.order?.payment?.code,
				totalTax: FormatMoneyNumber(item?.order?.totalTax),
				totalTipStore: FormatMoneyNumber(item?.order?.totalTip * (item?.config?.tipOnCreditCard / 100)),
				totalTipEmployee: FormatMoneyNumber(
					item?.order?.totalTip * ((100 - item?.config?.tipOnCreditCard) / 100)
				),
				totalDiscount: FormatMoneyNumber(item?.order?.totalDiscount),

				data: item,
			}));
			setRows(newRows);
		} else {
			setRows(undefined);
		}
	}, [props.item]);
	return (
		<>
			<DynamicDialog
				width={isMobile ? "90vw" : "95vw"}
				visible={dialogVisible}
				mode={"view"}
				position={"center"}
				title={
					t("pay_roll") +
					" - " +
					formatCapitalize(props?.profile?.firstName) +
					" " +
					formatCapitalize(props?.profile?.lastName) +
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
					<div className="p-2 pt-1">
						{props.item && props?.item?.payrolls.length > 0 ? menuDetail() : null}
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
			{showDetailOrder == true && (
				<WtcDialogDetailOrder onClose={() => setShowDetailOrder(false)} item={itemDetailOrder} />
			)}
		</>
	);
}
