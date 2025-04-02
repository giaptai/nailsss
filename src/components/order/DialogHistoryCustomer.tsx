import { t } from "i18next";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";
import { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { useAppSelector } from "../../app/hooks";
import useWindowSize from "../../app/screen";
import { formatDateTimeMMddYYYY, FormatMoneyNumber } from "../../const";
import { HistoryCustomer } from "../../models/category/HistoryCustomer.model";
import DataTables from "../commons/DataTable";
import WtcEmptyBox from "../commons/WtcEmptyBox";
import DynamicDialog from "../DynamicDialog";
import LoadingIndicator from "../Loading";
type Props = {
	item: HistoryCustomer | undefined;
	onClose: VoidFunction;
};
export default function DialogHistoryCustomer(props: Props) {
	const screenSize = useWindowSize();
	const bodyHeight = screenSize.height;
	const [dialogVisible, setDialogVisible] = useState(true);
	const newOderState = useAppSelector((state) => state.newOder);

	const [rows, setRows] = useState<any>();
	const headerGroup = (
		<ColumnGroup>
			<Row>
				<Column header={t("code")} align={"center"} />
				<Column header={t("date")} align={"center"} />
				<Column header={t("total_money")} align={"center"} />
				<Column header={t("tip")} align={"center"} />
				<Column header={t("discount")} align={"center"} />
				<Column header={t("tax")} align={"center"} />
			</Row>
		</ColumnGroup>
	);
	const columns = [
		{
			field: "order_code",
			align: "center",
		},
		{
			field: "transDate",
			align: "center",
		},
		{
			field: "totalMoney",
			align: "right",
		},
		{
			field: "totalTip",
			align: "right",
		},
		{
			field: "totalDiscount",
			align: "right",
		},
		{
			field: "totalTax",
			align: "right",
		},
	];
	const footerGroupDataTable = (
		<ColumnGroup>
			<Row>
				<Column footer="" colSpan={1} footerStyle={{ textAlign: "left" }} />
				<Column footer="" colSpan={1} footerStyle={{ textAlign: "left" }} />
				<Column
					footer={FormatMoneyNumber(props.item?.result[0]?.totalMoney || 0)}
					footerStyle={{ textAlign: "right" }}
					frozen={true}
				/>
				<Column
					footer={FormatMoneyNumber(props.item?.result[0]?.totalTip || 0)}
					footerStyle={{ textAlign: "right" }}
					frozen={true}
				/>
				<Column
					footer={FormatMoneyNumber(props.item?.result[0]?.totalDiscount || 0)}
					footerStyle={{ textAlign: "right" }}
					frozen={true}
				/>
				<Column
					footer={FormatMoneyNumber(props.item?.result[0]?.totalTax || 0)}
					footerStyle={{ textAlign: "right" }}
					frozen={true}
				/>
			</Row>
		</ColumnGroup>
	);
	const handleClickClose = () => {
		setDialogVisible(false);
	};
	useEffect(() => {
		if (!dialogVisible) {
			setTimeout(() => {
				props.onClose();
			}, 200);
		}
	}, [dialogVisible, props]);
	useEffect(() => {
		if (props.item?.result?.[0]?.orders?.length) {
			const newRows = props.item?.result?.[0]?.orders?.map((item, index) => ({
				id: index + 1,
				order_code: item.code,
				totalMoney: FormatMoneyNumber(item?.totalMoney || 0),
				totalTip: FormatMoneyNumber(item?.totalTip || 0),
				totalTax: FormatMoneyNumber(item?.totalTax || 0),
				totalDiscount: FormatMoneyNumber(item?.totalDiscount || 0),
				transDate: formatDateTimeMMddYYYY(item?.transDate),
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
				width={isMobile ? "90vw" : "75vw"}
				visible={dialogVisible}
				fontSizeTitle={20}
				mode={"view"}
				position={"center"}
				title={
					t("history") +
					" " +
					(props.item?.result[0]?.customer?.firstName || "") +
					" " +
					(props.item?.result[0]?.customer?.lastName || "")
				}
				okText=""
				cancelText=""
				draggable={false}
				isBackgroundGray={true}
				resizeable={false}
				onClose={handleClickClose}
				body={
					<div className="p-2 ">
						{newOderState.actionHistoryState.status == "loading" ? (
							<LoadingIndicator />
						) : !newOderState.historyCustomer || newOderState?.historyCustomer?.result.length == 0 ? (
							<div className="w-100 h-100 d-flex flex-column justify-content-center">
								{" "}
								<WtcEmptyBox />
							</div>
						) : (
							<DataTables
								id="payroll-table"
								data={rows}
								columns={columns}
								headerGroup={headerGroup}
								heightScroll={bodyHeight - 280}
								footerGroup={footerGroupDataTable}
							/>
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
							style={{ height: 40, width: "80px", fontSize: 13 }}
						/>
					</div>
				}
				closeIcon
			/>
		</>
	);
}
