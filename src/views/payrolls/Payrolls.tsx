import { t } from "i18next";
import { Calendar } from "primereact/calendar";
import { Column } from "primereact/column";
import { ColumnGroup } from "primereact/columngroup";
import { Dropdown } from "primereact/dropdown";
import { OverlayPanel } from "primereact/overlaypanel";
import { Row } from "primereact/row";
import { Nullable } from "primereact/ts-helpers";
import { useEffect, useRef, useState } from "react";
import { isMobile, isTablet } from "react-device-detect";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../app/hooks";
import useWindowSize from "../../app/screen";
import { paymentStatus } from "../../app/state";
import DataTables from "../../components/commons/DataTable";
import IconButton from "../../components/commons/IconButton";
import WtcButton from "../../components/commons/WtcButton";
import WtcCard from "../../components/commons/WtcCard";
import WtcEmptyBox from "../../components/commons/WtcEmptyBox";
import WtcRoleButton from "../../components/commons/WtcRoleButton";
import HeaderList from "../../components/HeaderList";
import LoadingIndicator from "../../components/Loading";
import DialogPrintPaymentTip from "../../components/payroll/DialogPrintPaymentTip";
import WtcDialogDetailDate from "../../components/payroll/WtcDialogDetailDate";
import WtcPrintAllStaffPayroll from "../../components/payroll/WtcPrintAllStaffPayroll";
import WtcPrintPayroll from "../../components/payroll/WtcPrintPayroll";
import {
	CheckRoleWithAction,
	convertToYYYYMMDD,
	formatCapitalize,
	formatDateTimeMMddYYYY,
	FormatMoneyNumber,
	PageTarget,
	typeFilter,
} from "../../const";
import { OrderDetailPayrollModel } from "../../models/category/OrderDetailPayroll.model";
import { PayrollModel } from "../../models/category/Payroll.model";
import { filterSearch, getPayrolls, selectItem, selectItemOrderDetail } from "../../slices/payroll.slice";
import { toFixedRefactor, toLocaleStringRefactor } from "../../utils/string.ultil";
// const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

export default function Payrolls() {
	const [typeFilterStatus, setTypeFilterStatus] = useState(typeFilter[2]);
	const screenSize = useWindowSize();
	const bodyHeight = screenSize.height;
	const dispatch = useDispatch();
	const [startDate, setStartDate] = useState<Nullable<Date>>(new Date());
	const [endDate, setEndDate] = useState<Nullable<Date>>(new Date());
	const payrollState = useAppSelector((state) => state.payroll);
	const [searchString, setSearchString] = useState("");
	const [showPrintADay, setShowPrintADay] = useState(false);
	const [showPrintAll, setShowPrintAll] = useState(false);
	const [showPaymentTip, setShowPaymentTip] = useState(false);
	const [showDetailDate, setShowDetailDate] = useState(false);
	const [showPaymentService, setShowPaymentService] = useState(false);
	const [orderDetailPayrollClick, setOrderDetailPayrollClick] = useState<OrderDetailPayrollModel[] | undefined>(
		undefined
	);
	const authState = useAppSelector((state) => state.auth);
	const [rows, setRows] = useState<any>();
	const op = useRef<any>(null);
	const myRef = useRef<HTMLDivElement>(null);
	const [activeItemId, setActiveItemId] = useState<string | null>(null);
	const handleClickOutside = (e: any) => {
		if (!myRef.current?.contains(e.target)) {
			if (activeItemId) {
				setActiveItemId(null);
			}
		}
	};
	const calculateTipPaid = (item: OrderDetailPayrollModel) => {
		return item.payrolls
			.filter((item) => item.status.code === paymentStatus.paid && item.type === "TIP")
			.reduce((sum, item) => sum + (item.amountTip || 0), 0);
	};
	const calculateServicePaid = (item: OrderDetailPayrollModel) => {
		return item.payrolls
			.filter((item) => item.status.code === paymentStatus.paid && item.type === "SERVICE")
			.reduce((sum, item) => sum + (item.amountService || 0), 0);
	};
	const handleClickEmployee = (item: PayrollModel | undefined) => {
		if (item && item.employeeId != payrollState.item?.employeeId) {
			dispatch(selectItem(item));
		} else {
			dispatch(selectItem(undefined));
		}
	};
	const ClickMoreAction = (itemId: string) => {
		setActiveItemId((prevId) => (prevId === itemId ? null : itemId));
	};
	const menuitemEmployees = (item: PayrollModel, index: number) => (
		<div
			tabIndex={index + 1}
			key={index}
			className={`d-flex align-items-center menu-item-payroll p-2 my-1 ${
				item.employeeId == payrollState?.item?.employeeId ? "border-active" : ""
			}`}
			style={{ maxHeight: 64 }}
			onClick={() => handleClickEmployee(item)}
		>
			<IconButton
				icon={"ri-printer-line"}
				width={48}
				height={48}
				onClick={(e) => {
					e.stopPropagation();
					if (!payrollState.item || item.employeeId != payrollState.item.employeeId)
						handleClickEmployee(item);
					handleClickPrintADay(item.details);
				}}
				actived={false}
				className="custom-primary-button"
			/>
			<div className="flex-grow-1 ps-2" style={{ color: "#30363F" }}>
				<div className="fs-title">
					{formatCapitalize(item?.profile?.firstName)} {formatCapitalize(item?.profile?.middleName)}{" "}
					{formatCapitalize(item?.profile?.lastName)}
				</div>
				<div>
					$
					<span className="fs-value text-nowrap p-text-primary">
						{" "}
						{toLocaleStringRefactor(
							toFixedRefactor(Number(calculateProfitFromDateToDate(item.details)), 2)
						)}
					</span>
				</div>
			</div>
			<div className="ps-2" style={{ color: "#30363F" }}>
				<div className="col-md-1 right-content">
					<nav className="navbar navbar-expand-lg navbar-light p-0">
						<div
							className={activeItemId === item?.employeeId ? "iq-show" : ""}
							onClick={(e) => {
								e.stopPropagation();
							}}
						>
							<div
								ref={myRef}
								onClick={(e) => {
									e.stopPropagation();
									if (!payrollState.item || item.employeeId != payrollState.item.employeeId)
										handleClickEmployee(item);
									ClickMoreAction(item?.employeeId);
								}}
							>
								<WtcRoleButton
									action="PAY"
									target={PageTarget.payroll}
									label={""}
									icon="ri-more-2-fill"
									width={"20"}
									minWidth={20}
									borderRadius={10}
									height={43}
									fontSize={13}
									className="text-white wtc-bg-primary mt-more-action px-1"
									onClick={() => {}}
									paddingIcon="px-0"
								/>
							</div>
							{activeItemId === item?.employeeId && (
								<div
									className="iq-sub-dropdown px-1"
									style={{ width: 155, right: -29, backgroundColor: "rgb(218, 223, 242)" }}
								>
									<div className="iq-card shadow-none m-0">
										<div className="iq-card-body p-2 px-0 ">
											<div className="me-1">
												<WtcButton
													label={t("payment_tip")}
													icon="pi pi-dollar"
													className="text-white wtc-bg-primary fw-normal mb-1"
													height={30}
													contentStart={true}
													fontSize={13}
													width={140}
													disabled={
														calculateTotal("tipNotPaid") == 0 ||
														typeFilterStatus == typeFilter[0]
													}
													onClick={() => {
														handleClickPaymentTip(item.details);
														if (
															!payrollState.item ||
															item.employeeId != payrollState.item.employeeId
														)
															handleClickEmployee(item);
													}}
													borderRadius={8}
												/>
												<WtcButton
													label={t("payment_service")}
													icon="pi pi-dollar"
													className="text-white wtc-bg-primary fw-normal"
													height={30}
													contentStart={true}
													fontSize={13}
													width={140}
													disabled={
														calculateTotal("serviceNotPaid") == 0 ||
														typeFilterStatus == typeFilter[0]
													}
													onClick={() => {
														handleClickPaymentService(item.details);
														if (
															!payrollState.item ||
															item.employeeId != payrollState.item.employeeId
														)
															handleClickEmployee(item);
													}}
													borderRadius={8}
												/>
											</div>
										</div>
									</div>
								</div>
							)}
						</div>
					</nav>
				</div>
			</div>
		</div>
	);
	// const onClickFilterStatus = (e: any) => {
	// 	if (op.current) {
	// 		op.current.toggle(e);
	// 	}
	// };
	const StatusTemplate = (value: string) => {
		let icon, text;
		switch (value) {
			case typeFilter[0]:
				icon = <i className="my-grid-icon text-muted"></i>;
				text = t("all");
				break;
			case typeFilter[1]:
				icon = <i className="my-grid-icon ri-check-double-line text-success"></i>;
				text = t("status_paid");
				break;
			case typeFilter[2]:
				icon = <i className="my-grid-icon ri-loader-2-line wtc-text-primary"></i>;
				text = t("status_processing");
				break;

			default:
				icon = null;
				text = "";
				break;
		}
		return (
			<div className="d-flex">
				<div className="me-1">{icon}</div>
				<div style={{ alignContent: "center" }}>{text}</div>
			</div>
		);
	};
	const headerPayroll = () => {
		return (
			<div
				className="p-2 pe-0"
				style={{ display: "flex", justifyContent: "space-between", gap: "8px", alignItems: "center" }}
			>
				<div className="w-25 font-title-card">
					<div className={`w-100`}>{t("pay_rolls")}</div>
				</div>
				<div style={{ display: "flex", gap: "8px", justifyContent: "end" }}>
					<Calendar
						// maxDate={endDate || new Date()}
						value={startDate}
						onChange={(e) => setStartDate(e.value)}
						style={{ maxHeight: 42, width: "25%" }}
						placeholder="From"
						dateFormat="mm-dd-yy"
						showIcon
						iconPos="left"
						touchUI={isMobile || isTablet ? true : false}
					/>
					<Calendar
						// minDate={startDate || new Date()}
						value={endDate}
						onChange={(e) => setEndDate(e.value)}
						style={{ maxHeight: 42, width: "25%" }}
						dateFormat="mm-dd-yy"
						placeholder="To"
						showIcon
						iconPos="left"
						touchUI={isMobile || isTablet ? true : false}
					/>
					{/* <Button
						label={t("filter")}
						className="bg-blue text-white fs-6"
						icon="ri-filter-line"
						style={{ borderRadius: 12, fontWeight: "bold", height: 42, borderColor: "#283673" }}
						disabled={startDate == null || endDate == null}
						onClick={onClickFilterStatus}
					/> */}
					<div
						tabIndex={0}
						className="p-0"
						style={{ border: "1px solid #d1d5db", borderRadius: "8px", height: 43 }}
					>
						{
							<Dropdown
								autoFocus
								tabIndex={0}
								value={typeFilterStatus}
								// options={["ALL", "ACTIVE", "INACTIVE", "DELETED"]}
								options={typeFilter}
								itemTemplate={StatusTemplate}
								valueTemplate={StatusTemplate}
								onChange={(e) => setTypeFilterStatus(e.value)}
								placeholder=""
								style={{
									width: "100%",
									height: "100%",
									borderRadius: 8,
									border: "none",
									maxHeight: "300px",
									fontSize: "15px !important",
								}}
							/>
						}
					</div>
					<OverlayPanel autoFocus ref={op} style={{ width: "220px" }}>
						<div className="row pb-2 p-0 m-0">
							<div className="form-group col-sm-12 p-0">
								<label htmlFor="status">{t("status")}</label>
								<div
									tabIndex={0}
									className="p-0"
									style={{ border: "1px solid #d1d5db", borderRadius: "8px" }}
								>
									{
										<Dropdown
											autoFocus
											tabIndex={0}
											value={typeFilterStatus}
											// options={["ALL", "ACTIVE", "INACTIVE", "DELETED"]}
											options={typeFilter}
											itemTemplate={StatusTemplate}
											valueTemplate={StatusTemplate}
											onChange={(e) => setTypeFilterStatus(e.value)}
											placeholder=""
											style={{
												width: "100%",
												height: "100%",
												borderRadius: 8,
												border: "none",
												maxHeight: "300px",
											}}
										/>
									}
								</div>
							</div>
						</div>
						{/* <div className="form-check">
							<input
								className="form-check-input"
								type="radio"
								name="filterType"
								id="statusAll"
								checked={typeFilterStatus === typeFilter[0]}
								onChange={() => setTypeFilterStatus(typeFilter[0])}
							/>
							<label className="form-check-label" htmlFor="statusAll">
								{t("all")}
							</label>
						</div>
						<div className="form-check">
							<input
								className="form-check-input"
								type="radio"
								name="filterType"
								id="statusPayment"
								checked={typeFilterStatus === typeFilter[1]}
								onChange={() => setTypeFilterStatus(typeFilter[1])}
							/>
							<label className="form-check-label" htmlFor="statusPayment">
								{t("payment")}
							</label>
						</div>
						<div className="form-check">
							<input
								className="form-check-input"
								type="radio"
								name="filterType"
								id="statusNotPayment"
								checked={typeFilterStatus === typeFilter[2]}
								onChange={() => setTypeFilterStatus(typeFilter[2])}
							/>
							<label className="form-check-label" htmlFor="statusNotPayment">
								{t("status_processing")}
							</label>
						</div> */}
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
	const isExistsService = (data: any, id: string) => {
		return data.some((i: any) => i.type === "SERVICE" && i.order._id == id);
	};
	const handleClickDate = (rowData: any) => {
		const PayrollFilter: any = [];
		rowData?.data.payrolls.map((i: any) => {
			if (i.type === "TIP") {
				if (!isExistsService(rowData?.data.payrolls, i.order._id)) {
					PayrollFilter.push(i);
				}
			} else {
				PayrollFilter.push(i);
			}
		});
		const payload = {
			...rowData?.data,
			// payrolls: rowData?.data.payrolls.filter((i: any) => i.type === "SERVICE"),
			payrolls: PayrollFilter,
		};
		dispatch(selectItemOrderDetail(payload));
		setShowDetailDate(true);
	};
	const contentPayroll = () => {
		return (
			<div className="ps-2">
				<DataTables
					id="payroll-table"
					data={rows}
					headerGroup={headerGroup}
					columns={columns}
					// onRowClick={handleRowClick}
					// onCellClick={handleCellClick}
					footerGroup={
						payrollState.item?.details
							? payrollState.item?.details?.length > 0
								? footerGroupDataTable
								: undefined
							: undefined
					}
					heightScroll={bodyHeight - 190}
				/>
			</div>
		);
	};

	const calculateProfitFromDateToDate = (item: OrderDetailPayrollModel[] | undefined) => {
		if (item && item.length > 0) {
			const totalProfit = item.reduce(
				(total, current) => total + (current.totalAmountService + current.totalTip),
				0
			);
			return totalProfit;
		} else return 0;
	};
	const fetchListLocal = () => {
		if (startDate && endDate) {
			const data = {
				fromDate: convertToYYYYMMDD(startDate.toString()),
				toDate: convertToYYYYMMDD(endDate.toString()),
				status: typeFilterStatus == typeFilter[0] ? undefined : typeFilterStatus,
			};
			dispatch(getPayrolls(data));
			dispatch(selectItem(undefined));
		}
	};
	const handleClickPrintADay = (item: OrderDetailPayrollModel[]) => {
		setShowPrintADay(true);
		setOrderDetailPayrollClick(item);
	};
	const handleClickPaymentTip = (item: OrderDetailPayrollModel[]) => {
		setOrderDetailPayrollClick(item);
		setShowPaymentTip(true);
		setActiveItemId(null);
	};
	const handleClickPaymentService = (item: OrderDetailPayrollModel[]) => {
		setOrderDetailPayrollClick(item);
		setShowPaymentService(true);
		setActiveItemId(null);
	};

	const headerGroup = (
		<ColumnGroup>
			<Row>
				<Column frozen={true} header={t("date")} rowSpan={2} align={"center"} />
				<Column
					frozen={true}
					header={
						<div>
							{t("total")}
							<br />
							<span className="color-notifi fs-value-disabled">(1)+(2)-(3)</span>
						</div>
					}
					rowSpan={2}
					align={"center"}
					style={{ width: 120 }}
				/>
				<Column header={<div>{t("amount")}</div>} colSpan={3} align={"center"} />
				<Column
					align={"center"}
					header={
						<div>
							{t("tip")}
							<br />
							<span className="color-notifi fs-value-disabled">(2)</span>
						</div>
					}
					colSpan={2}
				/>
				<Column
					header={
						<div>
							{t("discount")}
							<br />
							<span className="color-notifi fs-value-disabled">(3)</span>
						</div>
					}
					rowSpan={2}
					align={"center"}
				/>
				<Column align={"center"} header={<div>{t("payment")}</div>} colSpan={2} />
				<Column align={"center"} header={<div>{t("checkbonus")}</div>} rowSpan={2} />
				<Column align={"center"} header={<div>{t("rate")}</div>} rowSpan={2} />

				<Column header={t("feeCreditcard")} style={{ width: 110 }} align={"center"} rowSpan={2} />
				<Column header={<div>{t("tax")}</div>} rowSpan={2} align={"center"} />
			</Row>
			<Row>
				<Column field="service_amount" header={t("service_price")} style={{ width: 120 }} align={"center"} />
				<Column field="employee_price" header={t("employee_price")} style={{ width: 120 }} align={"center"} />
				<Column
					field="employee_amount"
					header={
						<div>
							{t("employee")}
							<span className="color-notifi fs-value-disabled fw-normal"> (1)</span>
						</div>
					}
					style={{ width: 120 }}
					align={"center"}
				/>
				<Column header={t("status_paid")} style={{ width: 110 }} align={"center"} />
				<Column header={t("status_processing")} style={{ width: 110 }} align={"center"} />
				<Column field="check" header={t("check")} style={{ width: 110 }} align={"center"} />
				<Column field="cash" header={<div>{t("Cash")}</div>} style={{ width: 110 }} align={"center"} />
				{/* <Column field="giftcard" header={<div>{t("giftcard")}</div>} style={{ width: 110 }} align={"center"} /> */}
			</Row>
		</ColumnGroup>
	);
	const actionBodyTemplate = (rowData: any) => {
		return (
			<>
				<div
					className="d-flex justify-content-center"
					onClick={() => {
						handleClickDate(rowData);
					}}
				>
					<div>
						<IconButton
							icon={"ri-edit-fill"}
							width={20}
							height={30}
							onClick={() => {}}
							actived={false}
							className="custom-primary-icon"
						/>
					</div>
					<div style={{ alignSelf: "center" }}>&ensp;{formatDateTimeMMddYYYY(rowData?.date)}</div>
				</div>
			</>
		);
	};
	const columns = [
		{
			field: "date",
			header: <div>{t("date")}</div>,
			align: "center",
			minWidth: 150,
			frozen: true,
			body: (rowData: any) => actionBodyTemplate(rowData),
		},
		{
			field: "profit",
			frozen: true,
			header: (
				<div>
					{t("total")}
					<br />
					<span className="color-notifi fs-value-disabled">(1)+(5)-(6)</span>
				</div>
			),
			align: "right",
			with: 900,
		},
		{
			field: "service_amount",
			align: "right",
			with: 900,
		},
		{
			field: "employee_price",
			align: "right",
			with: 900,
		},
		{
			field: "employee_amount",
			align: "right",
		},
		{
			field: "tipPaid",
			align: "right",
		},
		{
			field: "tipNotPaid",
			align: "right",
		},
		{
			field: "discount",
			header: (
				<div>
					{t("discount")}
					<br />
					<span className="color-notifi fs-value-disabled">(6)</span>
				</div>
			),
			align: "right",
		},
		{
			field: "check",
			align: "right",
		},
		{
			field: "cash",
			align: "right",
		},
		// {
		// 	field: "giftcard",
		// 	align: "right",
		// },
		{
			field: "checkBonus",
			align: "right",
		},
		{
			field: "rate",
			header: (
				<div>
					{t("rate")}
					<br />
					<span className="color-notifi fs-value-disabled">(4)</span>
				</div>
			),
			align: "right",
		},

		{
			field: "feeCreditCard",
			header: <div>{t("feeCreditcard")}</div>,
			align: "right",
			width: 200,
		},
		{
			field: "tax",
			header: <div>{t("tax")}</div>,
			align: "right",
		},
	];
	const calculateTotal = (key: string) => {
		return payrollState.item?.details.reduce((sum, item) => {
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
				case "compensation":
					return sum + (item?.payrolls?.[0]?.config.compensation || 0);
				case "totalTip":
					return sum + (item?.totalTip || 0);
				case "tipPaid":
					return sum + (calculateTipPaid(item) || 0);
				case "tipNotPaid":
					return sum + (item.totalTip - calculateTipPaid(item) || 0);
				case "servicePaid":
					return sum + (calculateServicePaid(item) || 0);
				case "serviceNotPaid":
					return sum + (item.totalAmountService - calculateServicePaid(item) || 0);
				case "totalAmountDiscount":
					return sum + (item?.totalAmountDiscount || 0);
				case "profit":
					return sum + (item?.totalAmountService + item?.totalTip || 0);
				case "tax":
					return sum + (item?.totalAmountTax || 0);
				case "feeCreditCard":
					return sum + (item?.totalAmountCreditCardFee || 0);
				case "totalAmountGiftCard":
					return sum + (item?.totalAmountGiftCard || 0);
				default:
					return sum;
			}
		}, 0);
	};
	const footerGroupDataTable = (
		<ColumnGroup>
			<Row>
				<Column footer="" frozen={true} colSpan={1} footerStyle={{ textAlign: "left" }} />
				<Column
					footer={FormatMoneyNumber(calculateTotal("profit") || 0)}
					footerStyle={{ textAlign: "right" }}
					frozen={true}
				/>
				<Column
					footer={FormatMoneyNumber(calculateTotal("totalAmountServiceOrder") || 0)}
					footerStyle={{ textAlign: "right" }}
				/>
				<Column
					footer={FormatMoneyNumber(calculateTotal("totalAmountEmployeePrice") || 0)}
					footerStyle={{ textAlign: "right" }}
				/>
				<Column
					footer={FormatMoneyNumber(calculateTotal("totalAmountService") || 0)}
					footerStyle={{ textAlign: "right" }}
				/>
				<Column
					footer={FormatMoneyNumber(calculateTotal("tipPaid") || 0)}
					footerStyle={{ textAlign: "right" }}
				/>
				<Column
					footer={FormatMoneyNumber(calculateTotal("tipNotPaid") || 0)}
					footerStyle={{ textAlign: "right" }}
				/>
				<Column
					footer={FormatMoneyNumber(calculateTotal("totalAmountDiscount") || 0)}
					footerStyle={{ textAlign: "right" }}
				/>
				<Column
					footer={FormatMoneyNumber(calculateTotal("totalCheck") || 0)}
					footerStyle={{ textAlign: "right" }}
				/>
				<Column
					footer={FormatMoneyNumber(calculateTotal("totalCash") || 0)}
					footerStyle={{ textAlign: "right" }}
				/>
				{/* <Column
					footer={FormatMoneyNumber(calculateTotal("totalAmountGiftCard") || 0)}
					footerStyle={{ textAlign: "right" }}
				/> */}
				<Column
					footer={
						FormatMoneyNumber(calculateTotal("totalAmountCheckBonus") || 0) +
						" / " +
						FormatMoneyNumber(calculateTotal("totalAmountCheckBonusRemaining") || 0)
					}
					footerStyle={{ textAlign: "right" }}
				/>
				<Column footer="" colSpan={1} footerStyle={{ textAlign: "right" }} />

				<Column
					footer={FormatMoneyNumber(calculateTotal("feeCreditCard") || 0)}
					footerStyle={{ textAlign: "right" }}
				/>
				<Column footer={FormatMoneyNumber(calculateTotal("tax") || 0)} footerStyle={{ textAlign: "right" }} />
			</Row>
		</ColumnGroup>
	);

	const handleClickPrintAll = () => {
		setShowPrintAll(true);
	};
	useEffect(() => {
		fetchListLocal();
	}, []);
	useEffect(() => {
		document.addEventListener("click", handleClickOutside);
		return () => document.removeEventListener("click", handleClickOutside);
	});
	useEffect(() => {
		if (payrollState.item?.details?.length) {
			const newRows = payrollState.item.details.map((item, index) => ({
				id: index + 1,
				date: formatDateTimeMMddYYYY(item?.transDate),
				service_amount: FormatMoneyNumber(item?.totalAmountServiceOrder || 0),
				employee_price: FormatMoneyNumber(item?.totalAmountEmployeePrice || 0),
				employee_amount: FormatMoneyNumber(item?.totalAmountService + item?.totalAmountDiscount || 0),
				check: FormatMoneyNumber(item?.totalAmountCheck || 0),
				cash: FormatMoneyNumber(item?.totalAmountCash || 0),
				// giftcard: FormatMoneyNumber(item?.totalAmountGiftCard || 0),
				checkBonus:
					FormatMoneyNumber(item?.totalAmountCheckBonus || 0) +
					" / " +
					FormatMoneyNumber(item?.totalAmountCheck - item?.totalAmountCheckBonus),
				rate: FormatMoneyNumber(item?.payrolls?.[0]?.config?.compensation || 0),
				tip: FormatMoneyNumber(item?.totalTip || 0),
				tipPaid: FormatMoneyNumber(calculateTipPaid(item) || 0),
				tipNotPaid: FormatMoneyNumber(item?.totalTip - calculateTipPaid(item) || 0),
				discount: FormatMoneyNumber(item?.totalAmountDiscount || 0),
				profit: FormatMoneyNumber(item?.totalAmountService + item?.totalTip || 0),
				feeCreditCard: FormatMoneyNumber(item?.totalAmountCreditCardFee || 0),
				tax: FormatMoneyNumber(item?.totalAmountTax || 0),
				data: item,
			}));
			setRows(newRows);
		} else {
			setRows(undefined);
		}
	}, [payrollState.item]);
	useEffect(() => {
		if (payrollState.fetchState) {
			switch (payrollState.fetchState.status!) {
				case "completed":
					dispatch(filterSearch({ searchString: searchString }));
					break;
			}
		}
	}, [payrollState.fetchState]);
	return (
		<>
			<div className=" wtc-bg-white rounded-4 h-100">
				<div className="row h-100" style={{ paddingLeft: 6 }}>
					<div className="col-sm-9 m-0 p-0 rounded" style={{ height: bodyHeight - 85 }}>
						<div
							className="pe-2 ms-2 mt-2 mb-2 bg-statement-item border-radius-12"
							style={{ height: bodyHeight - 104 }}
						>
							{headerPayroll()}
							{contentPayroll()}
						</div>
					</div>
					<div className="col-sm-3 h-100 p-2 pe-3">
						<div
							className="font-title-card wtc-bg-title d-flex align-items-center w-100 border-radius-top pt-1"
							style={{ maxHeight: 50 }}
						>
							<div className="flex-grow-1 mx-1">
								<HeaderList
									maxWidthSearch={"100%"}
									callback={fetchListLocal}
									hideAdd
									target=""
									placeHolderSearch={t("action.search_empl")}
									onSearchText={(text) => {
										// Optional: handle search text
										setSearchString(text);
										dispatch(filterSearch({ searchString: text }));
									}}
									onAddNew={() => {}}
								/>
							</div>
						</div>
						<div
							style={{ height: screenSize.height - 154, overflowY: "auto", borderRadius: "0 0 8px 8px" }}
						>
							<WtcCard
								background="#EEF1F9"
								hideBorder={true}
								borderRadius={-1}
								classNameBody="flex-grow-1 px-1 pb-2 mb-0 pt-1"
								body={
									<div className="p-1 pt-0">
										{payrollState.fetchState.status === "loading" ? (
											<div
												className="w-100 d-flex flex-column justify-content-center text-center"
												style={{ height: screenSize.height - 250 }}
											>
												<LoadingIndicator />
											</div>
										) : (!payrollState.filtered || payrollState?.filtered.length) == 0 ? (
											<div className="w-100 h-100 d-flex flex-column justify-content-center">
												<WtcEmptyBox />
											</div>
										) : (
											<div>
												{payrollState.filtered.map((item: PayrollModel, index) => (
													<div key={index} className="col-sm-12">
														{menuitemEmployees(item, index)}
													</div>
												))}
											</div>
										)}
									</div>
								}
								className="h-100"
								footer={
									CheckRoleWithAction(authState, PageTarget.payroll, "PRI") ? (
										<>
											<WtcRoleButton
												action="PRI"
												target={PageTarget.payroll}
												label={t("print_all")}
												icon="ri-printer-line"
												className="w-100 text-white wtc-bg-primary"
												height={49}
												onClick={handleClickPrintAll}
												classDiv="w-100"
											/>
										</>
									) : undefined
								}
							/>
						</div>
					</div>
				</div>
			</div>
			{showPrintADay == true && (
				<WtcPrintPayroll
					fromDate={formatDateTimeMMddYYYY(startDate || "") ?? ""}
					toDate={formatDateTimeMMddYYYY(endDate || "") ?? ""}
					item={orderDetailPayrollClick}
					employee={payrollState.item?.profile}
					onClose={() => setShowPrintADay(false)}
					isPaymentService={false}
					employeeId={payrollState.item?.employeeId}
				/>
			)}
			{showPaymentService == true && (
				<WtcPrintPayroll
					fromDate={formatDateTimeMMddYYYY(startDate || "") ?? ""}
					toDate={formatDateTimeMMddYYYY(endDate || "") ?? ""}
					item={orderDetailPayrollClick}
					employee={payrollState.item?.profile}
					onClose={() => setShowPaymentService(false)}
					isPaymentService={true}
					employeeId={payrollState.item?.employeeId}
				/>
			)}
			{showPaymentTip == true && (
				<DialogPrintPaymentTip
					fromDate={formatDateTimeMMddYYYY(startDate || "") ?? ""}
					toDate={formatDateTimeMMddYYYY(endDate || "") ?? ""}
					item={orderDetailPayrollClick}
					employee={payrollState.item?.profile}
					onClose={() => setShowPaymentTip(false)}
					employeeId={payrollState.item?.employeeId}
				/>
			)}
			{showPrintAll == true && (
				<WtcPrintAllStaffPayroll
					fromDate={formatDateTimeMMddYYYY(startDate || "") ?? ""}
					toDate={formatDateTimeMMddYYYY(endDate || "") ?? ""}
					onClose={() => setShowPrintAll(false)}
					item={payrollState.ListPrint}
				/>
			)}
			{showDetailDate == true && (
				<WtcDialogDetailDate
					onClose={() => setShowDetailDate(false)}
					item={payrollState.itemOrderDetail}
					profile={payrollState.item?.profile}
				/>
			)}
		</>
	);
}
