import { FormikErrors, useFormik } from "formik";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { DropdownChangeEvent } from "primereact/dropdown";
import { OverlayPanel } from "primereact/overlaypanel";
import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";
import "react-tabs/style/react-tabs.css";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import useWindowSize from "../../../app/screen";
import HeaderList from "../../../components/HeaderListV2";
import LoadingIndicator from "../../../components/Loading";
import StatusDropdown from "../../../components/commons/StatusDropdown";
import WtcCard from "../../../components/commons/WtcCard";
import WtcEmptyBox from "../../../components/commons/WtcEmptyBox";
import { formatDateTimeYYYYMMDD, formatPhoneNumberViewUI, PageTarget } from "../../../const";
import {
	addBooking,
	changeAction,
	deleteBookingSoft,
	editBooking,
	fetchBookings,
	filterSearch,
	resetActionState,
	resetFetchState,
	selectItem,
} from "../../../slices/booking.slice";
import SidebarBooking from "../../../components/booking/SidebarBooking";
import { BookingModel } from "../../../models/category/Booking.model";
import { formatDateToFormatString } from "../../../utils/date.util";
import { processing, showMessageToast } from "../../../utils/alert.util";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";

export default function Booking() {
	const { t } = useTranslation();
	const screenSize = useWindowSize();
	const bookingState = useAppSelector((state) => state.booking);
	const dispatch = useAppDispatch();
	const toast = useRef<any>(null);
	const [dialogVisible, setDialogVisible] = useState(false);
	const [status, setStatus] = useState("ALL");
	const [searchString, setSearchString] = useState("");
	const op = useRef<any>(null);
	const formikBooking = useFormik<BookingModel>({
		initialValues: BookingModel.initial(),
		validate: (data) => {
			const errors: FormikErrors<BookingModel> = {};
			if (!data.customer.firstName) {
				errors.customer = {
					...errors.customer,
					firstName: t("field_requird"),
				};
			}
			if (!data.customer.lastName) {
				errors.customer = {
					...errors.customer,
					lastName: t("field_requird"),
				};
			}
			return errors;
		},
		onSubmit: (data) => {
			const payload = {
				_id: data?._id,
				customerId: data.customer._id,
				attributes: data.attributes,
				bookingDate: data.bookingDate,
				status: data.status.value,
			};
			console.log(data);
			switch (bookingState.action) {
				case "INS":
					dispatch(addBooking(payload));
					break;
				case "UPD":
					dispatch(editBooking(payload));
					break;
				case "DEL":
					dispatch(deleteBookingSoft(payload._id));
					break;
			}
		},
	});

	const closeDialog = () => {
		setDialogVisible(false);
		formikBooking.resetForm();
	};
	const paginatorTemplate =
		"FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown";
	const onClickFilterStatus = (e: any) => {
		if (op.current) {
			op.current.toggle(e);
		}
	};

	const openItem = (item: BookingModel | undefined) => {
		if (item === undefined) {
			dispatch(changeAction("INS"));
			dispatch(selectItem(BookingModel.initial()));
		} else {
			dispatch(changeAction("UPD"));
			dispatch(selectItem(item));
			formikBooking.setValues(item);
		}
		setDialogVisible(true);
	};
	const fetchListLocal = async () => {
		dispatch(
			fetchBookings({
				fromDate: formatDateTimeYYYYMMDD(new Date()),
				toDate: formatDateTimeYYYYMMDD(new Date()),
			})
		);
		dispatch(filterSearch({ searchString: searchString, status: status }));
	};

	//first time load
	useEffect(() => {
		fetchListLocal();
	}, []);

	// filter by search by code, name customer
	useEffect(() => {
		dispatch(filterSearch({ searchString: searchString, status: status }));
	}, [searchString, status]);

	useEffect(() => {
		if (bookingState.actionState) {
			switch (bookingState.actionState.status!) {
				case "completed":
					Swal.close(); //tắt thông báo processing khi status là completed
					closeDialog();
					dispatch(resetActionState());
					dispatch(resetFetchState());
					dispatch(selectItem(undefined));
					fetchListLocal(); // fetch happens last to avoid loading the newset data
					showMessageToast(toast, "success", bookingState.successMessage);
					break;
				case "loading":
					processing();
					closeDialog();
					break;
				case "failed":
					Swal.close();
					// failed("error");
					// this is toast show message error
					dispatch(resetActionState());
					dispatch(resetFetchState());
					showMessageToast(toast, "error", t(bookingState.actionState.error!));
					break;
			}
		}
	}, [bookingState.actionState]);

	return (
		<>
			<WtcCard
				isPaging={true}
				title={
					<>
						<HeaderList
							callback={fetchListLocal}
							target={PageTarget.booking}
							onSearchText={(text) => {
								setSearchString(text);
							}}
							onAddNew={() => openItem(undefined)}
							onClickFilterStatus={(e) => onClickFilterStatus(e)}
							placeHolderSearch="Search code, name customer"
							isFilterStatus={true}
							status={status}
							setStatus={setStatus}
							labelSearch="Search booking"
							labelFilter="Booking’s status"
							titleButtonAdd={t("action.createBooking")}
							arrStatus={["ALL", "INPROCESSING", "DONE"]}
						/>
						<OverlayPanel autoFocus ref={op} style={{ width: "300px" }}>
							<div className="row pb-2">
								<div className="form-group col-sm-12">
									<label htmlFor="status">{t("status")}</label>
									<StatusDropdown
										value={status}
										onChange={(e: DropdownChangeEvent) => {
											setStatus(e.value);
										}}
									/>
								</div>
							</div>
						</OverlayPanel>
					</>
				}
				hideBorder={true}
				body={
					<div className="d-flex flex-column h-100">
						<div
							className="flex-grow-1"
							// style={{ maxHeight: screenSize.height - 220, overflowX: "hidden", overflowY: "auto" }}
							style={{ maxHeight: screenSize.height, overflowX: "hidden", overflowY: "auto" }}
						>
							{bookingState.fetchState.status == "loading" ? (
								<LoadingIndicator />
							) : bookingState?.filtered?.length == 0 ? (
								<div className="w-100 h-100 d-flex flex-column justify-content-center">
									{" "}
									<WtcEmptyBox />
								</div>
							) : (
								<>
									<DataTable
										value={bookingState?.filtered}
										showGridlines={true}
										paginator
										paginatorLeft
										rows={10}
										rowsPerPageOptions={[10, 25, 50]}
										tableStyle={{
											minWidth: "50rem",
											borderRadius: "0px",
										}}
										// onPage={onPageChange}
										paginatorTemplate={paginatorTemplate}
										currentPageReportTemplate="Showing {first} to {last} items of {totalRecords}"
										className="datatable-custom px-2"
										scrollable
										scrollHeight="100%"
									>
										<Column
											headerStyle={{
												height: "60px",
												backgroundColor: "#F4F4F4",
											}}
											body={(_, { rowIndex }) => (
												<p
													style={{
														fontSize: "16px",
														fontWeight: "400",
														color: "#3E4451",
														padding: "0px 12px",
														margin: "auto 0",
													}}
												>
													{rowIndex + 1}
												</p>
											)}
											header=""
										></Column>
										<Column
											headerStyle={{
												backgroundColor: "#F4F4F4",
											}}
											body={(rowData) => (
												<div
													style={{
														minWidth: "60px",
														padding: "12px",
														maxHeight: "72px",
													}}
												>
													<p
														style={{
															fontSize: "16px",
															fontWeight: "400",
															color: "#3E4451",
															margin: "auto",
														}}
													>
														{rowData.code}
													</p>
												</div>
											)}
											header="Code"
										></Column>
										<Column
											headerStyle={{
												backgroundColor: "#F4F4F4",
											}}
											body={(rowData) => (
												<div
													style={{
														minWidth: "60px",
														padding: "12px",
														maxHeight: "72px",
													}}
												>
													<p
														style={{
															fontSize: "16px",
															fontWeight: "400",
															color: "#3E4451",
															margin: "auto",
														}}
													>
														{rowData.customer.firstName + " " + rowData.customer.lastName}
													</p>
												</div>
											)}
											header="Customer"
										></Column>
										<Column
											headerStyle={{
												backgroundColor: "#F4F4F4",
											}}
											body={(rowData) => (
												<div style={{ minWidth: "60px", padding: "12px", maxHeight: "72px" }}>
													<p
														style={{
															fontSize: "16px",
															fontWeight: "400",
															color: "#3E4451",
															margin: "auto",
														}}
													>
														{formatPhoneNumberViewUI(rowData.customer.phone)}
													</p>
												</div>
											)}
											header="Phone"
										></Column>
										<Column
											headerStyle={{
												backgroundColor: "#F4F4F4",
											}}
											body={(rowData) => (
												<div style={{ minWidth: "60px", padding: "12px", maxHeight: "72px" }}>
													<p
														style={{
															fontSize: "16px",
															fontWeight: "400",
															color: "#3E4451",
															margin: "auto",
														}}
													>
														{formatDateToFormatString(
															String(rowData.bookingDate),
															"DD/MM/YYYY HH:mm"
														)}
													</p>
												</div>
											)}
											header="Estimated Date and Time"
										></Column>
										<Column
											bodyStyle={{
												width: "144px",
												maxHeight: "60px",
											}}
											headerStyle={{
												maxWidth: "144px",
												maxHeight: "60px",
												backgroundColor: "#F4F4F4",
											}}
											body={(rowData) => (
												<div style={{ minWidth: "60px", padding: "12px", maxHeight: "72px" }}>
													<p
														style={{
															fontSize: "16px",
															fontWeight: "400",
															color: "#3E4451",
															margin: "auto",
														}}
													>
														{rowData.status.code}
													</p>
												</div>
											)}
											header="Status"
										></Column>
										<Column
											headerStyle={{
												width: "104px",
												backgroundColor: "#F4F4F4",
											}}
											body={(rowData: BookingModel) => (
												<div
													className="d-flex justify-content-center"
													style={{ maxWidth: "104px" }}
												>
													<button
														className="bg-white"
														style={{
															border: "1px solid #DDDFE5",
															width: 75,
															height: 44,
															borderRadius: "4px",
														}}
														onClick={() => {
															openItem(rowData);
														}}
													>
														Details
													</button>
												</div>
											)}
											header="Action"
										></Column>
									</DataTable>
								</>
							)}
						</div>
					</div>
				}
				className="h-100"
			/>
			<div
				className=""
				onKeyDown={(e) => {
					if (e.key === "Enter") {
						formikBooking.handleSubmit();
						e.preventDefault();
					}
				}}
			>
				<SidebarBooking
					dialogVisible={dialogVisible}
					setDialogVisible={setDialogVisible}
					formikBooking={formikBooking}
					action={bookingState.action}
					closeDialog={closeDialog}
				/>
			</div>
			<Toast ref={toast} position="top-center" />
		</>
	);
}
