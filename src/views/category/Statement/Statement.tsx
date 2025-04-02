import { t } from "i18next";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { Calendar } from "primereact/calendar";
import { Nullable } from "primereact/ts-helpers";
import { isMobile, isTablet } from "react-device-detect";
import { useAppSelector } from "../../../app/hooks";
import useWindowSize from "../../../app/screen";
import DataTable from "../../../components/commons/DataTable";
import WtcButton from "../../../components/commons/WtcButton";
import WtcHeaderTitle from "../../../components/commons/WtcHeaderTitle";
import WtcItemViewLabel from "../../../components/commons/WtcItemViewLabel";
import WtcSearchInput from "../../../components/commons/WtcSearchText";
import {
	convertToYYYYMMDD,
	formatDateTimeMMddYYYY,
	formatDateTimeMMddYYYYHHmm,
	FormatMoneyNumber,
} from "../../../const";
import { StatementModel } from "../../../models/category/Statement.model";
import { getStatements, reloadReport, filterSearch } from "../../../slices/statement.slice";
import LoadingIndicator from "../../../components/Loading";
// const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
export default function Statement() {
	const screenSize = useWindowSize();
	const [startDate, setStartDate] = useState<Nullable<Date>>(new Date());
	const [endDate, setEndDate] = useState<Nullable<Date>>(new Date());
	const [searchString, setSearchString] = useState("");
	const dispatch = useDispatch();
	const bodyHeight = screenSize.height;
	const statementState = useAppSelector((state) => state.statement);
	const calculateProfit = (item: StatementModel, isFormat: boolean) => {
		if (isFormat)
			return FormatMoneyNumber(
				item.totalAmountOrder -
					item.totalAmountPayroll +
					item.totalAmountStoreTip -
					item.totalDiscount +
					item.totalFeeCreditCard
			);
		else
			return (
				item.totalAmountOrder -
				item.totalAmountPayroll +
				item.totalAmountStoreTip -
				item.totalDiscount +
				item.totalFeeCreditCard
			);
	};

	const totalRevenu = statementState.filtered.reduce((total, current) => total + current.totalAmountOrder || 0, 0);
	const totalPayrolls = statementState.filtered.reduce(
		(total, current) => total + current.totalAmountPayroll || 0,
		0
	);
	const totalTip = statementState.filtered.reduce((total, current) => total + current.totalAmountStoreTip || 0, 0);
	const totalDiscount = statementState.filtered.reduce((total, current) => total + current.totalDiscount || 0, 0);
	const totalFeeCreditCard = statementState.filtered.reduce(
		(total, current) => total + current.totalFeeCreditCard || 0,
		0
	);
	const totalProfit = statementState.filtered.reduce(
		(total, current) => total + Number(calculateProfit(current, false)) || 0,
		0
	);
	const headerStateMent = () => {
		return (
			<div
				className="p-2 pe-0"
				style={{ display: "flex", justifyContent: "space-between", gap: "8px", alignItems: "center" }}
			>
				<div className="w-25 font-title-card">
					<div className={`align-self-center w-100`}>{t("Statement")}</div>
				</div>
				<div className="w-50">
					<WtcSearchInput
						placeholder={t("action.search")}
						value={searchString}
						onChanged={(text) => {
							setSearchString(text);
							dispatch(filterSearch({ searchString: text }));
						}}
					/>
				</div>
				<div style={{ display: "flex", gap: "8px", justifyContent: "end" }}>
					<Calendar
						// maxDate={endDate || new Date()}
						value={startDate}
						onChange={(e) => setStartDate(e.value)}
						style={{ maxHeight: 42, width: "50%" }}
						placeholder="From"
						showIcon
						iconPos="left"
						touchUI={isMobile || isTablet ? true : false}
						panelStyle={{ color: "rgb(33, 37, 41)" }}
						inputClassName="color-normal"
						dateFormat="mm-dd-yy"
					/>
					<Calendar
						// minDate={startDate || new Date()}
						// maxDate={new Date()}
						value={endDate}
						onChange={(e) => setEndDate(e.value)}
						style={{ maxHeight: 42, width: "50%" }}
						placeholder="To"
						showIcon
						iconPos="left"
						touchUI={isMobile || isTablet ? true : false}
						inputClassName="color-normal"
						dateFormat="mm-dd-yy"
					/>
					<WtcButton
						label={t("action.search")}
						className="bg-blue text-white"
						icon="ri-search-line"
						fontSize={14}
						disabled={startDate == null || endDate == null}
						labelStyle={{ fontWeight: "bold" }}
						borderRadius={12}
						height={42}
						onClick={fetchListLocal}
					/>
					<WtcButton
						label={t("reload")}
						className="bg-blue text-white"
						icon="ri-refresh-line"
						fontSize={14}
						disabled={startDate == null || endDate == null}
						labelStyle={{ fontWeight: "bold" }}
						borderRadius={12}
						height={42}
						onClick={reLoadReport}
					/>
				</div>
			</div>
		);
	};

	const contentStateMent = () => {
		return (
			<div className="ps-2">
				<DataTable
					id="table-statement"
					heightScroll={rows.length == 0 ? bodyHeight - 110 : bodyHeight - 170}
					data={rows}
					columns={columns}
				/>
			</div>
		);
	};

	const columns = [
		{ field: "date", header: <div>{t("date")}</div>, align: "center", frozen: true },
		{
			field: "revenue",
			header: (
				<div>
					{t("total")}
					<br />
					<span className="color-notifi fs-value-disabled">(1)</span>
				</div>
			),
			align: "right",
		},
		{
			field: "pay_roll",
			header: (
				<div>
					{t("pay_roll")}
					<br />
					<span className="color-notifi fs-value-disabled">(2)</span>
				</div>
			),
			align: "right",
		},
		{
			field: "tip",
			header: (
				<div>
					{t("tip")}
					<br />
					<span className="color-notifi fs-value-disabled">(3)</span>
				</div>
			),
			align: "right",
		},
		{
			field: "discount",
			header: (
				<div>
					{t("discount")}
					<br />
					<span className="color-notifi fs-value-disabled">(4)</span>
				</div>
			),
			align: "right",
		},
		{
			field: "feeCreditCard",
			header: (
				<div>
					{t("feeCreditcard")}
					<br />
					<span className="color-notifi fs-value-disabled">(5)</span>
				</div>
			),
			align: "right",
		},
		{
			field: "profit",
			frozen: true,
			header: (
				<div>
					{t("profit")}
					<br />
					<span className="color-notifi fs-value-disabled">(1)-(2)+(3)-(4)+(5)</span>
				</div>
			),
			align: "right",
		},
	];
	const rows =
		statementState.filtered && statementState?.filtered.length > 0
			? statementState.filtered.map((item, index) => ({
					id: index + 1,
					date: formatDateTimeMMddYYYYHHmm(item?.transDate),
					revenue: FormatMoneyNumber(item?.totalAmountOrder || 0),
					pay_roll: FormatMoneyNumber(item?.totalAmountPayroll || 0),
					tip: FormatMoneyNumber(item?.totalAmountStoreTip || 0),
					discount: FormatMoneyNumber(item?.totalDiscount || 0),
					feeCreditCard: FormatMoneyNumber(item?.totalFeeCreditCard || 0),
					profit: calculateProfit(item, true),
			  }))
			: [];

	const fetchListLocal = () => {
		if (startDate && endDate) {
			const data = {
				fromDate: convertToYYYYMMDD(startDate.toString()),
				toDate: convertToYYYYMMDD(endDate.toString()),
			};
			dispatch(getStatements(data));
		}
	};
	const reLoadReport = () => {
		if (startDate && endDate) {
			const data = {
				fromDate: convertToYYYYMMDD(startDate.toString()),
				toDate: convertToYYYYMMDD(endDate.toString()),
			};
			dispatch(reloadReport(data));
			dispatch(getStatements(data));
		}
	};
	useEffect(() => {
		fetchListLocal();
	}, []);
	return (
		<div className="w-100 row m-0 bg-statement" style={{ height: bodyHeight - 90 }}>
			<div className="h-100 w-100 row m-0 p-2 wtc-bg-white" style={{ borderRadius: 20 }}>
				<div className="col-sm-9 m-0 p-0 pe-2 rounded h-100">
					<div className="pe-2 bg-statement-item h-100 border-radius-12">
						{headerStateMent()}
						{contentStateMent()}
					</div>
				</div>
				<div
					className="col-sm-3 h-100 bg-statement-item border-radius-12 p-2"
					style={{ maxHeight: bodyHeight - 100, overflowY: "auto" }}
				>
					{statementState.fetchState.status === "loading" ? (
						<div
							className="w-100 d-flex flex-column justify-content-center text-center"
							style={{ height: screenSize.height - 250 }}
						>
							<LoadingIndicator />
						</div>
					) : (
						<>
							<WtcHeaderTitle label={t("date")} />
							<div className="row m-0 p-0">
								<div className="col-md-6 m-0 p-0 pe-1">
									<WtcItemViewLabel
										icon="pi pi-calendar-times"
										label={t("form_date")}
										value={formatDateTimeMMddYYYY(startDate || "")}
									/>
								</div>
								<div className="col-md-6 m-0 p-0 ps-1">
									<WtcItemViewLabel
										icon="pi pi-calendar-times"
										label={t("to_date")}
										value={formatDateTimeMMddYYYY(endDate || "")}
									/>
								</div>
							</div>

							<div className="pt-2"></div>
							<WtcHeaderTitle label={t("detail")} />
							<WtcItemViewLabel
								icon="pi pi-dollar"
								label={t("total_revenue")}
								value={FormatMoneyNumber(totalRevenu)}
							/>
							<WtcItemViewLabel
								icon="pi pi-dollar"
								label={t("total_payroll")}
								value={FormatMoneyNumber(totalPayrolls)}
							/>
							<div className="row m-0 p-0">
								<div className="col-md-6 m-0 p-0 pe-1">
									<WtcItemViewLabel
										icon="pi pi-dollar"
										label={t("total_tip")}
										value={FormatMoneyNumber(totalTip)}
									/>
								</div>
								<div className="col-md-6 m-0 p-0 ps-1">
									<WtcItemViewLabel
										icon="pi pi-dollar"
										label={t("total_discount")}
										value={FormatMoneyNumber(totalDiscount)}
									/>
								</div>
							</div>

							<WtcItemViewLabel
								icon="pi pi-dollar"
								label={t("total_feeCD")}
								value={FormatMoneyNumber(totalFeeCreditCard)}
							/>
							<div className="mt-2"></div>
							<WtcHeaderTitle label={t("profit")} />
							<WtcItemViewLabel
								classNameValue="text-danger money-payment fw-bold"
								icon="pi pi-dollar"
								label={t("profit")}
								value={FormatMoneyNumber(totalProfit)}
							/>
						</>
					)}
				</div>
			</div>
		</div>
	);
}
