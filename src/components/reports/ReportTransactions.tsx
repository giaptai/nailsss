import { t } from "i18next";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Column } from "primereact/column";
import { ColumnGroup } from "primereact/columngroup";
import { OverlayPanel } from "primereact/overlaypanel";
import { Row } from "primereact/row";
import { Nullable } from "primereact/ts-helpers";
import { useEffect, useRef, useState } from "react";
import { isMobile, isTablet } from "react-device-detect";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../app/hooks";
import useWindowSize from "../../app/screen";
import {
	convertToYYYYMMDD,
	formatCapitalize,
	formatDateTimeMMddYYYY,
	FormatMoneyNumber,
	MethodPayment,
} from "../../const";
import { PaymentService } from "../../services/Payment.service";
import { selectItem } from "../../slices/payroll.slice";
import { getReportRevenue, selectItemTransaction } from "../../slices/statement.slice";
import LoadingIndicator from "../Loading";
import DataTables from "../commons/DataTable";
import WtcButton from "../commons/WtcButton";
import WtcDropdownIconText from "../commons/WtcDropdownIconText";
import WtcEmptyBox from "../commons/WtcEmptyBox";
import WtcHeaderTitle from "../commons/WtcHeaderTitle";
import WtcItemViewLabel from "../commons/WtcItemViewLabel";

export default function ReportTransactions() {
	const [valuePayment, setValuePayment] = useState<any>();
	const screenSize = useWindowSize();
	const dispatch = useDispatch();
	const [startDate, setStartDate] = useState<Nullable<Date>>(new Date());
	const [endDate, setEndDate] = useState<Nullable<Date>>(new Date());
	const bodyHeight = screenSize.height;
	const statementState = useAppSelector((state) => state.statement);
	const [rows, setRows] = useState<any>();
	const op = useRef<any>(null);
	const myRef = useRef<HTMLDivElement>(null);
	const [activeItemId, setActiveItemId] = useState<string | null>(null);
	const [fromDate, setFromDate] = useState<Nullable<Date>>(new Date());
	const [toDate, setToDate] = useState<Nullable<Date>>(new Date());
	const [selectedOption, setSelectedOption] = useState("TODAY");
	const handleClickOutside = (e: any) => {
		if (!myRef.current?.contains(e.target)) {
			if (activeItemId) {
				setActiveItemId(null);
			}
		}
	};
	const typePayments: any[] = [
		{ label: t("cash"), value: MethodPayment.CASH },
		{ label: t("credit_card"), value: MethodPayment.CREDITCARD },
		{ label: t("giftcard"), value: MethodPayment.GIFTCARD },
	];
	const [selectedTypePayment] = useState<any | null>(typePayments);

	const onClickFilterStatus = (e: any) => {
		if (op.current) {
			op.current.toggle(e);
		}
	};
	const handleRowClick = (rowData: any) => {
		if (rowData.data && rowData.data._id != statementState.itemTransaction?._id) {
			dispatch(selectItemTransaction(rowData.data));
		} else {
			dispatch(selectItemTransaction(undefined));
		}
	};
	const handleOptionChange = (value: string) => {
		setSelectedOption(value);

		if (value === "TODAY") {
			const today = new Date();
			setFromDate(today);
			setToDate(today);
		} else if (value === "LAST7") {
			const today = new Date();
			const last7 = new Date(today);
			last7.setDate(today.getDate() - 7);
			setFromDate(last7);
			setToDate(today);
		} else if (value === "LAST14") {
			const today = new Date();
			const last14 = new Date(today);
			last14.setDate(today.getDate() - 14);
			setFromDate(last14);
			setToDate(today);
		} else if (value === "LAST30") {
			const today = new Date();
			const last30 = new Date(today);
			last30.setDate(today.getDate() - 30);
			setFromDate(last30);
			setToDate(today);
		} else if (value === "OTHER") {
			const today = new Date();
			setFromDate(today);
			setToDate(today);
		}
	};
	const handleSearchData = () => {
		const data = {
			fromDate: convertToYYYYMMDD(fromDate?.toString() ?? ""),
			toDate: convertToYYYYMMDD(toDate?.toString() ?? ""),
			methods: selectedTypePayment,
		};
		dispatch(getReportRevenue(data));
		dispatch(selectItem(undefined));
		dispatch(selectItemTransaction(undefined));
	};
	const headerPayroll = () => {
		return (
			<div
				className="p-2 pe-0"
				style={{ display: "flex", justifyContent: "space-between", gap: "8px", alignItems: "center" }}
			>
				<div className="w-25 font-title-card">
					<div className={`w-100`}>{t("transactions")}</div>
				</div>
				<div style={{ display: "flex", gap: "8px", justifyContent: "end" }}>
					<Calendar
						// maxDate={endDate || new Date()}
						value={startDate}
						onChange={(e) => setStartDate(e.value)}
						style={{ maxHeight: 42, width: "32%" }}
						placeholder="From"
						dateFormat="mm-dd-y"
						showIcon
						iconPos="left"
						showTime
						showSeconds
						hourFormat="12"
						touchUI={isMobile || isTablet ? true : false}
					/>
					<Calendar
						// minDate={startDate || new Date()}
						value={endDate}
						onChange={(e) => setEndDate(e.value)}
						style={{ maxHeight: 42, width: "32%" }}
						placeholder="To"
						dateFormat="mm-dd-y"
						showIcon
						iconPos="left"
						showTime
						showSeconds
						hourFormat="12"
						touchUI={isMobile || isTablet ? true : false}
					/>
					<Button
						label={t("filter")}
						className="bg-blue text-white fs-6"
						icon="ri-filter-line"
						style={{ borderRadius: 12, fontWeight: "bold", height: 42, borderColor: "#283673" }}
						disabled={startDate == null || endDate == null}
						onClick={onClickFilterStatus}
					/>
					{/* <OverlayPanel autoFocus ref={op} style={{ width: "400px" }}>
						<div className="row pb-2 p-0 m-0">
							<div className="form-group col-sm-12 p-0">
								<WtcDropdownIconText
									multiSelect
									inputHeight={68}
									options={
										typePayments
											? typePayments.map((item: any) => {
													return { label: t(item.label), value: item.value };
											  })
											: []
									}
									disabled={false}
									placeHolder={t("paymenttype")}
									leadingIcon="ri-bank-card-line"
									value={selectedTypePayment?.map((it: any) => {
										return { label: it.label, value: it.value };
									})}
									onMultiChange={(values: any[]) => {
										const mappedValues = values.map((it: any) => {
											return { label: it.label, value: it.value };
										});
										setSelectedTypePayment(mappedValues);
									}}
								/>
							</div>
						</div>
					</OverlayPanel> */}
					<OverlayPanel autoFocus ref={op} style={{ width: "250px" }}>
						<div className="row">
							<div className="form-group col-sm-12">
								<WtcDropdownIconText
									options={[
										{ label: t("today"), value: "TODAY" },
										{ label: t("last_7"), value: "LAST7" },
										{ label: t("last_14"), value: "LAST14" },
										{ label: t("last_30"), value: "LAST30" },
										{ label: t("other"), value: "OTHER" },
									]}
									placeHolder={t("date")}
									leadingIcon="ri-calendar-schedule-line"
									value={selectedOption}
									disabled={false}
									onChange={handleOptionChange}
								/>
							</div>
							{selectedOption === "OTHER" && (
								<div className="form-group col-sm-12 transition">
									<label>From Date</label>
									<Calendar
										maxDate={toDate || new Date()}
										value={fromDate}
										onChange={(e) => setFromDate(e.value)}
									/>
									<label>To Date</label>
									<Calendar
										minDate={fromDate || new Date()}
										value={toDate}
										onChange={(e) => setToDate(e.value)}
									/>
								</div>
							)}
							<div className="d-flex justify-content-center mt-2">
								<WtcButton
									label={t("action.search")}
									className="bg-blue text-white"
									icon="ri-search-line"
									fontSize={14}
									width={245}
									labelStyle={{ fontWeight: "bold" }}
									borderRadius={12}
									height={50}
									onClick={handleSearchData}
								/>
							</div>
						</div>
					</OverlayPanel>
					<WtcButton
						label={t("action.search")}
						className="bg-blue text-white"
						icon="ri-search-line"
						fontSize={14}
						labelStyle={{ fontWeight: "bold" }}
						borderRadius={12}
						disabled={startDate == null || endDate == null}
						height={42}
						onClick={fetchListLocal}
					/>
				</div>
			</div>
		);
	};
	const contentReport = () => {
		return statementState.fetchState.status === "loading" ? (
			<div
				className="w-100 d-flex flex-column justify-content-center text-center"
				style={{ height: screenSize.height - 300 }}
			>
				<LoadingIndicator />
			</div>
		) : (!statementState.listTransaction || statementState?.listTransaction.length) == 0 ? (
			<div
				className="w-100 d-flex flex-column justify-content-center"
				style={{ height: screenSize.height - 300 }}
			>
				<WtcEmptyBox />
			</div>
		) : (
			<DataTables
				id="payroll-table"
				data={rows}
				columns={columns}
				headerGroup={headerGroup}
				onRowClick={handleRowClick}
				heightScroll={bodyHeight - 165}
				footerGroup={footerGroupDataTable}
			/>
		);
	};

	const fetchListLocal = () => {
		if (startDate && endDate) {
			const data = {
				fromDate: convertToYYYYMMDD(startDate.toString()),
				toDate: convertToYYYYMMDD(endDate.toString()),
				methods: selectedTypePayment,
			};
			dispatch(getReportRevenue(data));
			dispatch(selectItem(undefined));
			dispatch(selectItemTransaction(undefined));
		}
	};

	const headerGroup = (
		<ColumnGroup>
			<Row>
				<Column frozen={true} header={t("date")} align={"center"} />
				<Column header={<div>{t("code")}</div>} align={"center"} />
				<Column header={<div>{t("total_money")}</div>} align={"center"} />
				<Column header={<div>{t("tip")}</div>} align={"center"} />
				<Column header={<div>{t("discount")}</div>} align={"center"} />
				<Column header={<div>{t("tax")}</div>} align={"center"} />
				<Column header={<div>{t("customer")}</div>} align={"center"} />
			</Row>
		</ColumnGroup>
	);
	const columns = [
		{ field: "date", header: <div>{t("date")}</div>, align: "center", with: 200, frozen: true },
		{ field: "code", align: "center" },

		{
			field: "total_money",
			align: "right",
			with: 900,
		},
		{
			field: "total_tip",
			align: "right",
			with: 900,
		},
		{
			field: "total_discount",
			align: "right",
			with: 900,
		},
		{
			field: "total_tax",
			align: "right",
			with: 900,
		},
		{ field: "customer", align: "left" },
	];
	const calculateTotal = (key: string) => {
		return statementState?.listTransaction.reduce((sum, item) => {
			switch (key) {
				case "totalMoney":
					return sum + (item?.totalMoney || 0);
				case "totalDiscount":
					return sum + (item?.totalDiscount || 0);
				case "totalTip":
					return sum + (item?.totalTip || 0);
				case "totalTax":
					return sum + (item?.totalTax || 0);

				default:
					return sum;
			}
		}, 0);
	};
	const footerGroupDataTable = (
		<ColumnGroup>
			<Row>
				<Column
					footer={t("qty_inv") + ": " + statementState?.listTransaction.length}
					frozen={true}
					colSpan={1}
					footerStyle={{ textAlign: "right" }}
				/>
				<Column footer="" frozen={true} colSpan={1} footerStyle={{ textAlign: "left" }} />
				<Column
					footer={FormatMoneyNumber(calculateTotal("totalMoney") || 0)}
					footerStyle={{ textAlign: "right" }}
					frozen={true}
				/>
				<Column
					footer={FormatMoneyNumber(calculateTotal("totalTip") || 0)}
					footerStyle={{ textAlign: "right" }}
					frozen={true}
				/>
				<Column
					footer={FormatMoneyNumber(calculateTotal("totalDiscount") || 0)}
					footerStyle={{ textAlign: "right" }}
					frozen={true}
				/>
				<Column
					footer={FormatMoneyNumber(calculateTotal("totalTax") || 0)}
					footerStyle={{ textAlign: "right" }}
					frozen={true}
				/>
				<Column footer="" frozen={true} colSpan={1} footerStyle={{ textAlign: "left" }} />
			</Row>
		</ColumnGroup>
	);

	useEffect(() => {
		const fetchPaymentValues = async () => {
			if (statementState?.itemTransaction?.payment?.details) {
				const calculatedValue = await PaymentService.calculateAmountByMethod(
					statementState.itemTransaction.payment.details
				);
				setValuePayment(calculatedValue);
			} else {
				const calculatedValue = await PaymentService.calculateAmountByMethod(undefined);
				setValuePayment(calculatedValue);
			}
		};

		fetchPaymentValues();
	}, [statementState?.itemTransaction]);

	useEffect(() => {
		fetchListLocal();
	}, []);
	useEffect(() => {
		document.addEventListener("click", handleClickOutside);
		return () => document.removeEventListener("click", handleClickOutside);
	});
	useEffect(() => {
		if (statementState?.listTransaction.length) {
			const newRows = statementState?.listTransaction.map((item, index) => ({
				id: index + 1,
				date: formatDateTimeMMddYYYY(item?.transDate),
				total_money: FormatMoneyNumber(item?.totalMoney || 0),
				total_discount: FormatMoneyNumber(item?.totalDiscount || 0),
				total_tip: FormatMoneyNumber(item?.totalTip || 0),
				total_tax: FormatMoneyNumber(item?.totalTax || 0),
				code: item?.payment?.code || "#",
				customer: formatCapitalize(item?.customer?.firstName + " " + item?.customer?.lastName),
				data: item,
			}));
			setRows(newRows);
		} else {
			setRows(undefined);
		}
	}, [statementState?.listTransaction]);
	return (
		<>
			<div className=" wtc-bg-white rounded-4 h-100">
				<div className="row h-100" style={{ paddingLeft: 6 }}>
					<div className="col-sm-9 m-0 p-0 rounded" style={{ height: bodyHeight - 85 }}>
						<div
							className="pe-2 ms-2 mt-2 mb-2 ps-2 bg-statement-item border-radius-12"
							style={{ height: bodyHeight - 104 }}
						>
							{headerPayroll()}
							{contentReport()}
						</div>
					</div>
					<div className="col-sm-3 border-radius-12" style={{ height: bodyHeight - 85, overflowY: "auto" }}>
						<div className="p-2 mt-2 me-2 bg-statement-item border-radius-12">
							<WtcHeaderTitle label={t("payments")} />
							<div className="row m-0 p-0">
								<div className="col-md-4 m-0 p-0 pe-1">
									<WtcItemViewLabel
										label={t("cash")}
										value={"$ " + FormatMoneyNumber(valuePayment?.CASH || "0")}
									/>
								</div>
								<div className="col-md-4 m-0 p-0 pe-1">
									<WtcItemViewLabel
										label={t("credit_card")}
										value={"$ " + FormatMoneyNumber(valuePayment?.CREDIT_CARD || "0")}
									/>
								</div>
								<div className="col-md-4 m-0 p-0 pe-1">
									<WtcItemViewLabel
										label={t("giftcard")}
										value={"$ " + FormatMoneyNumber(valuePayment?.GIFT_CARD || "0")}
									/>
								</div>
							</div>

							<div className="pt-2">
								<WtcHeaderTitle label={t("Services")} />
								<div style={{ height: bodyHeight - 367, overflow: "auto" }}>
									<div className="row m-0 p-0">
										{(statementState.itemTransaction?.details || []).length > 0 ? (
											statementState.itemTransaction?.details.flatMap((item, detailIndex) =>
												item.attributes.services.map((service, serviceIndex) => (
													<div
														key={`${detailIndex}-${serviceIndex}`}
														className="col-md-6 m-0 p-0 ps-1"
													>
														<WtcItemViewLabel
															label={service.displayName}
															value={"$ " + FormatMoneyNumber(service.storePrice || "0")}
														/>
													</div>
												))
											)
										) : (
											<div
												className="w-100 d-flex flex-column justify-content-center"
												style={{ height: screenSize.height - 420 }}
											>
												<WtcEmptyBox />
											</div>
										)}
									</div>
								</div>
							</div>
							<div className="mt-2"></div>
							<WtcHeaderTitle label={t("staff")} />
							<div style={{ height: 48, overflow: "auto" }}>
								<div className="row m-0 p-0">
									{statementState.itemTransaction?.details ? (
										statementState.itemTransaction?.details?.map((item) => {
											return (
												<div className="col-md-6 m-0 p-0 ps-1">
													<WtcItemViewLabel
														value={formatCapitalize(
															item?.employee?.firstName +
																" " +
																item?.employee?.middleName +
																" " +
																item?.employee?.lastName
														)}
													/>
												</div>
											);
										})
									) : (
										<div className="w-100 d-flex flex-column justify-content-center">
											<div className="mt-2" style={{ opacity: 0.5 }}></div>
										</div>
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
