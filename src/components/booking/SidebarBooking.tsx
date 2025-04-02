import { Sidebar } from "primereact/sidebar";
import { useTranslation } from "react-i18next";
import "./SidebarBooking.css";
import { Accordion, AccordionTab, AccordionTabChangeEvent } from "primereact/accordion";
import PhoneInput from "react-phone-input-2";
import { FormikErrors, FormikProps, useFormik } from "formik";
import emailIcon from "../../assets/svg/mail.svg";
import userIcon from "../../assets/svg/user.svg";
import {
	checkEmptyAndUndefined,
	convertISOToDateString,
	convertISOToDateStringEditBirthday,
	convertToISOString,
	formatCapitalize,
	formatDateBirthday,
	formatDateTimeMMddYYYYHHmm,
	formatDateTimeYYYYMMdd,
	formatHidePhoneNumber,
	formatPhoneNumberSubmitDatabase,
	handleAddValue,
	isISOString,
	PageTarget,
	phoneGuestCustomer,
	states,
} from "../../const";
import DynamicDialog from "../DynamicDialog";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { actions } from "../../types";
import { useEffect, useRef, useState } from "react";
import { fetchUsers, filterSearchEmpl } from "../../slices/user.slice";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import WtcCard from "../commons/WtcCard";
import { WindowModel } from "../../models/category/Window.model";
import Square from "../../views/category/Window/Square";
import {
	calculatorDiscount,
	deleteEmployee,
	deleteListServiceInArray,
	UpdateListServiceClick,
	updateSaveDrag,
	updatetempService,
} from "../../slices/newOder.slice";
import { isMobile } from "react-device-detect";
import { UserModel } from "../../models/category/User.model";
import useWindowSize from "../../app/screen";
import { ListServiceSelectedModel } from "../../models/category/ListServiceSelected.model";
import { failed } from "../../utils/alert.util";
import { Plus } from "lucide-react";
import {
	addCustomer,
	fetchCustomers,
	filterSearch,
	selectCustomerOrder,
	setCurrentPage,
	setCurrentRows,
	updateCustomer,
} from "../../slices/customer.slice";
import { fetchWindow } from "../../slices/window.slice";
import { fetchServices } from "../../slices/service.slice";
import { fetchMenus } from "../../slices/menu.slice";
import { v4 as uuidv4 } from "uuid";
import { BookingModel } from "../../models/category/Booking.model";
import { formatDateToFormatString } from "../../utils/date.util";
import HeaderList from "../HeaderList";
import LoadingIndicator from "../Loading";
import WtcEmptyBox from "../commons/WtcEmptyBox";
import { CustomerModel } from "../../models/category/Customer.model";
import WtcItemCard from "../commons/WtcItemCard";
import { Paginator } from "primereact/paginator";
import { itemListStyleInfo, itemsLineSpacing } from "../Theme";
import WtcButton from "../commons/WtcButton";
import WtcRoleButton from "../commons/WtcRoleButton";
import WtcInputIconText from "../commons/WtcInputIconText";
import WtcRoleInputIconText from "../commons/WtcRoleInputIconText";
import WtcRoleDropdownIconState from "../commons/WtcRoleDropdownIconState";
import WtcInputPhone from "../commons/WtcInputPhone";
import WtcDropdownIconText from "../commons/WtcDropdownIconText";
import _ from "lodash";
import SelectedServiceEmployee from "../commons/SelectedServiceEmployeeV2";
import { ServiceModel } from "../../models/category/Service.model";
import { changeAction } from "../../slices/booking.slice";
import { getFormErrorMessage, isFormFieldInvalid } from "../../utils/validate.util";
import { Calendar } from "primereact/calendar";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";

const SidebarBooking = ({
	dialogVisible,
	formikBooking,
	closeDialog,
	action,
}: {
	dialogVisible: boolean;
	setDialogVisible: (e: boolean) => void;
	formikBooking: FormikProps<BookingModel>;
	closeDialog: VoidFunction;
	action: actions;
}) => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();
	const bookingState = useAppSelector((state) => state.booking);
	const newOderState = useAppSelector((state) => state.newOder);
	const customerState = useAppSelector((state) => state.customer);
	const serviceState = useAppSelector((state) => state.service);

	const userState = useAppSelector((state) => state.user);
	const windows = useAppSelector((state) => state.window);
	const w = windows.list.filter((item) => item.type == "EMPLOYEE" && item.status.code == "ACTIVE");
	const [visibleConfirm, setVisibleConfirm] = useState(false);
	const [dialogVisibleEmpl, setDialogVisibleEmpl] = useState(false);
	const [dialogVisibleCus, setDialogVisibleCus] = useState(false);
	const [windowSelected, setWindowSelected] = useState(w[0]);
	const [activeItem, setActiveItem] = useState(windowSelected?.name);
	const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
	const [selectedEmployee, setSelectedEmployee] = useState<UserModel>();
	const [selected, setSelected] = useState<ListServiceSelectedModel[]>([]);
	const fState = (customerState.currentPage - 1) * customerState.currentRows;
	const [first, setFirst] = useState(fState);
	const [_page, setPage] = useState(customerState.currentPage - 1);
	const [rows, setRows] = useState(customerState.currentRows);
	const [_totalPages, setTotalPages] = useState(Math.ceil(customerState.filtered.length / rows));
	const [selectedCustomer, setSelectedCustomer] = useState<CustomerModel | undefined>(undefined);
	const [DialogVisibleAddCustomer, setDialogVisibleAddCustomer] = useState(false);
	const [selectedId, setSelectedId] = useState("");

	const [selectedServiceIds, setSelectedServiceIds] = useState<ServiceModel[]>([]);

	const [values, setValues] = useState<string[]>([]);
	const [isViewSer, setViewSer] = useState(false);

	const [activeAccordionIndex, setActiveAccordionIndex] = useState<number[]>([0, 1, 2]);
	const [statusBookingList, setStatusBookingList] = useState<string[]>([]);

	const NoCus = customerState.list.find((item) => item.phone == phoneGuestCustomer);
	const screenSize = useWindowSize();
	const bodyHeight = screenSize.height;

	const formikCustomer = useFormik<any>({
		initialValues: CustomerModel.initial(),
		validate: (data) => {
			const errors: FormikErrors<CustomerModel> = {};
			if (checkEmptyAndUndefined(data.firstName) && values.includes("firstName")) {
				errors.firstName = "y";
			}
			if (checkEmptyAndUndefined(data.lastName) && values.includes("lastName")) {
				errors.lastName = "y";
			}
			if (checkEmptyAndUndefined(data.phone) && values.includes("phone")) {
				errors.phone = "y";
			}
			return errors;
		},
		onSubmit: (data) => {
			const submitData = {
				firstName: data.firstName,
				lastName: data.lastName,
				phone: formatPhoneNumberSubmitDatabase(data.phone),
				address: data.address || null,
				city: data?.city || null,
				state: data?.state || null,
				zipcode: data?.zipcode || null,
				email: data.email || null,
				gender: data.gender || null,
				note: data.note || null,
				birthday:
					data?.birthday !== "" && isISOString(data?.birthday)
						? convertISOToDateStringEditBirthday(data.birthday)
						: data?.birthday !== ""
						? convertToISOString(data.birthday)
						: null,
			};
			dispatch(addCustomer(submitData));
		},
	});
	const closeDialogCus = (formik: any) => {
		setDialogVisibleAddCustomer(false);
		setValues([]);
		formik.resetForm();
		setDialogVisibleCus(false);
	};
	const onPageChange = (event: any) => {
		setFirst(event.first);
		setRows(event.rows);
		dispatch(setCurrentRows(event.rows));
		setTotalPages(event.pageCount);
		setPage(event.page + 1);
		dispatch(setCurrentPage(event.page + 1));
	};
	const handleClickCustomer = (item: CustomerModel) => {
		setSelectedCustomer(item);
		setSelectedId(item._id);
	};

	const handleSelectedServices = (item: ServiceModel) => {
		setSelectedServiceIds([item, ...selectedServiceIds]);
	};

	const selectServicesForEmployee = () => {
		const servicesByEmployee = selected.find((item) => {
			return item.Employee?._id === selectedEmployee?._id;
		})!;
		const updatedServicesByEmployee = {
			...servicesByEmployee,
			ListService: [...servicesByEmployee.ListService!, ...selectedServiceIds],
		};
		// servicesByEmployee.ListService = [...servicesByEmployee.ListService!, ...selectedServiceIds];
		setSelected([
			...selected.filter((item) => item.Employee !== servicesByEmployee.Employee),
			updatedServicesByEmployee,
		]);
		setSelectedServiceIds([]);
		setViewSer(false);
	};

	const handleSubmitSelectedCustomerSlide = (i: CustomerModel) => {
		setSelectedId(i._id);
		dispatch(selectCustomerOrder({ id: i._id }));
		dispatch(updateCustomer(i));
		setDialogVisibleCus(false);
	};
	const handleClickNoCustomer = () => {
		dispatch(updateCustomer(NoCus));
		setDialogVisibleCus(false);
	};
	const handleSubmitSelectedCustomer = () => {
		dispatch(updateCustomer(selectedCustomer));
		setDialogVisibleCus(false);
		dispatch(updateSaveDrag(true));
		formikBooking.setFieldValue("customer", selectedCustomer);
	};

	const handleClick = (index: number) => {
		setSelectedNumber(index);
	};
	const getUserAtPosition = (position: number) => {
		return userState.list
			.filter((user) => user.profile.positionWindow?._id == windowSelected?._id && user.status == "ACTIVE")
			.find((user) => user.profile?.positionPoint === position);
	};
	const handleDeleteEmployeeDialog = () => {
		dispatch(UpdateListServiceClick(undefined));
	};
	const handleItemClick = (item: any) => {
		setActiveItem(item.name);
		setWindowSelected(item);
		setSelectedNumber(null);
		setSelectedEmployee(undefined);
	};
	const selectedEmployee2 = useRef<ListServiceSelectedModel>();
	const handleClickEmployee = (item: UserModel | undefined) => {
		setSelectedEmployee(item);
		const newService: ListServiceSelectedModel = ListServiceSelectedModel.initial(item);
		(newService._id = uuidv4()), (selectedEmployee2.current = newService);
	};

	const handleSelectEmployees = () => {
		if (selected.find((item) => item.Employee?._id === selectedEmployee2.current!.Employee?._id)) {
			return failed("Đã tồn tại employee này");
		} else {
			setSelected([...selected, selectedEmployee2.current!]);
			setDialogVisibleEmpl(false);
		}
	};

	const handleDeleteService = (_id: string) => {
		const itemFind = newOderState.tempService.find((item) => item._id == _id);
		if (itemFind) {
			dispatch(deleteListServiceInArray(_id));
			// const detail = {
			// 	action: ActionOrder.delete,
			// 	payload: {
			// 		_id: _id,
			// 	},
			// };
			setSelected(selected.filter((item) => item._id !== _id));
		}
	};
	const handleDeleteEmployee = (_id: string) => {
		dispatch(deleteEmployee(_id));
		dispatch(calculatorDiscount(newOderState.ListDiscount));
		setSelected((prevSelected) => {
			return prevSelected.map((item) => {
				if (item?._id === _id) {
					return {
						...item,
						Employee: undefined,
					};
				}
				return item;
			});
		});
	};

	const formatCalendar = (dateFormat: Date) => {
		const resultDate = formatDateTimeYYYYMMdd(dateFormat);
		// const resultDate = formatDateTimeYYYYMMdd(dateFormat).concat(
		// 	" " +
		// 		String(dateFormat.getHours()).padStart(2, "0") +
		// 		":" +
		// 		String(dateFormat.getMinutes()).padStart(2, "0")
		// );
		// const resultDate =
		// 	dateFormat.getFullYear() +
		// 	"-" +
		// 	String(dateFormat.getMonth()).padStart(2, "0") +
		// 	"-" +
		// 	String(dateFormat.getDate()).padStart(2, "0");
		return resultDate;
	};

	const submitBooking = () => {
		const booking = BookingModel.initial();
		const dateNow = new Date(formikBooking.values.bookingDate);
		booking.bookingDate = formatCalendar(dateNow);
		booking.customer = { ...CustomerModel.fromJson(selectedCustomer), street1: "", birthday: null };
		const details: any = selected.flatMap((data) => ({
			emoployee: data.Employee,
			services: data.ListService || [],
		}));
		booking.attributes.detail = details;
		booking.status = formikBooking.values.status;
		formikBooking.setValues(booking);
		formikBooking.handleSubmit();
	};

	const deleteSoftBooking = () => {
		dispatch(changeAction("DEL"));
		formikBooking.handleSubmit();
	};

	const updateBooking = () => {
		const booking: BookingModel = BookingModel.initial();
		const dateNow = new Date(formikBooking.values.bookingDate);
		booking._id = formikBooking.values._id;
		booking.code = formikBooking.values.code;
		booking.bookingDate = formatCalendar(dateNow);
		booking.customer = { ...CustomerModel.fromJson(selectedCustomer) };
		const details: any = selected.flatMap((data) => ({
			emoployee: data.Employee,
			services: data.ListService || [],
		}));
		booking.attributes.detail = details;
		booking.status = { code: "DONE", value: "DONE" }; //mac dinh khi update staus la DONE ??
		formikBooking.setValues(booking);
		formikBooking.handleSubmit();
	};
	useEffect(() => {
		if (!windowSelected && w.length > 0) {
			setWindowSelected(w[0]);
			setActiveItem(w[0].name);
		}
	}, [windows]);

	useEffect(() => {
		dispatch(filterSearch({ searchString: "", status: "ALL" }));
	}, [customerState.list]);

	useEffect(() => {
		dispatch(filterSearchEmpl({ searchString: "", status: "ACTIVE" }));
	}, [userState.list]);
	useEffect(() => {
		!_.isEqual(newOderState.tempService, selected);
		{
			dispatch(updatetempService(selected));
			dispatch(calculatorDiscount(newOderState.ListDiscount));
		}
	}, [selected]);
	const fetchListLocal = () => {
		dispatch(fetchCustomers());
		dispatch(fetchUsers());
		dispatch(fetchWindow());
		dispatch(fetchServices());
		dispatch(fetchMenus());
	};
	useEffect(() => {
		fetchListLocal();
	}, []);

	// useEffect(() => {
	// 	if (selected.length > 0) {
	// 		setActiveIndex([...activeIndex, 2]);
	// 	} else {
	// 		setActiveIndex([0, 1]);
	// 	}
	// }, [selected]);
	useEffect(() => {
		if (bookingState.item && bookingState.action === "UPD") {
			formikBooking.setValues(bookingState.item);
			setSelectedCustomer(bookingState.item.customer);
			const id = bookingState.item._id;
			const status = bookingState.item.status;
			const detail = bookingState.item.attributes.detail;
			const code = bookingState.item.code;
			formikBooking.setFieldValue(
				"bookingDate",
				formatDateTimeMMddYYYYHHmm(new Date(bookingState.item.bookingDate))
			);
			const selectedUpdate =
				detail?.length > 0
					? detail.map((data) =>
							Object.assign(
								{
									Employee: data.emoployee,
									ListService: data.services || [],
									ListGiftCard: [],
									_id: id,
									code: code,
									tip: 0,
									discount: 0,
									status: status, // need changing
									OrderDetailId: undefined,
									BookingDetailId: undefined,
								},
								ListServiceSelectedModel
							)
					  )
					: [];
			setSelected(selectedUpdate);
			setSelectedServiceIds([]);
			if (bookingState.item.status.code === "INACTIVE") {
				setStatusBookingList(["INACTIVE"]);
			} else if (bookingState.item.status.code === "DONE") {
				setStatusBookingList(["DONE"]);
			} else {
				setStatusBookingList(["DONE", "INACTIVE"]);
			}
		} else if (bookingState.action === "INS") {
			formikBooking.resetForm();
			formikBooking.setFieldValue("bookingDate", formatDateTimeMMddYYYYHHmm(new Date()));
			setSelected([]);
			setSelectedCustomer(undefined);
			setStatusBookingList(["INPROCESSING"]);
		}
	}, [action, bookingState.action, bookingState.item]);
	return (
		<>
			<Sidebar
				visible={dialogVisible}
				onHide={() => closeDialog()}
				position="right"
				style={{ width: "881px" }}
				header={
					<>
						<div className="d-flex justify-content-between align-items-center">
							<h2
								style={{
									fontSize: "24px",
									fontWeight: "400",
									marginBottom: "0",
								}}
							>
								{action === "INS"
									? t("action.createBooking")
									: action === "UPD"
									? t("action.updateBooking")
									: ""}
							</h2>
						</div>
					</>
				}
			>
				<div className="d-flex flex-column">
					<div
						className="accordionSidebar px-3"
						style={{
							marginTop: "20px",
							marginBottom: "100px",
							backgroundColor: action === "INS" ? "white" : "#F4F4F4",
						}}
					>
						<Accordion
							activeIndex={activeAccordionIndex}
							multiple
							style={{ display: "flex", flexDirection: "column", gap: "20px" }}
							onTabChange={(e: AccordionTabChangeEvent) => {
								setActiveAccordionIndex(Array.isArray(e.index) ? e.index : [e.index]);
							}}
						>
							<AccordionTab header="BOOKING">
								<div className="row g-3">
									<div className="d-flex flex-column col-4" style={{ gap: "4px" }}>
										<label
											className="form-label"
											style={{
												fontSize: "16px",
												fontWeight: "600",
											}}
										>
											Code
										</label>
										<input
											type="text"
											disabled
											maxLength={50}
											className="form-control"
											value={formikBooking.values?.code}
											style={{
												border: "1px solid #CCCED5",
												borderRadius: "4px",
												padding: "12px",
												height: "60px",
											}}
										/>
										{formikBooking.errors.customer?.address && (
											<small className="p-error">
												{formikBooking.errors.customer.address as string}
											</small>
										)}
									</div>
									<div className="d-flex flex-column col-4" style={{ gap: "4px" }}>
										<label
											className="form-label"
											style={{
												fontSize: "16px",
												fontWeight: "600",
											}}
										>
											Status
										</label>
										<Dropdown
											className="my-dropdown-status"
											value={formikBooking.values.status.code.toUpperCase()}
											options={statusBookingList}
											placeholder="Select Status"
											onChange={(e: DropdownChangeEvent) =>
												formikBooking.setFieldValue("status", {
													code: e.value,
													value: e.value,
												})
											}
											style={{ height: "60px", border: "1px solid rgb(204, 206, 213)" }}
										/>
									</div>
									<div className="d-flex flex-column col-4" style={{ gap: "4px" }}>
										<label
											className="form-label"
											style={{
												fontSize: "16px",
												fontWeight: "600",
											}}
										>
											Estimated date and time
										</label>
										{/* <input
											type="text"
											maxLength={50}
											className="form-control"
											value={formikBooking.values?.bookingDate}
											onChange={() => {}}
											style={{
												border: "1px solid #CCCED5",
												borderRadius: "4px",
												padding: "12px",
												height: "60px",
											}}
										/> */}
										<Calendar
											className="booking-calendar"
											value={new Date(formikBooking.values?.bookingDate)}
											showIcon={true}
											showTime={true}
											hourFormat="12"
											iconPos="left"
											dateFormat="mm-dd-y"
											style={{ height: "60px" }}
											onChange={(e) => {
												formikBooking.setFieldValue(
													"bookingDate",
													e.value === null || e.value === undefined
														? formatDateTimeMMddYYYYHHmm(new Date())
														: formatDateTimeMMddYYYYHHmm(e.value)
												);
											}}
										/>
									</div>
								</div>
							</AccordionTab>
							<AccordionTab
								header={
									<>
										<span className="text-danger me-2">* </span>CUSTOMER
									</>
								}
								tabIndex={2}
							>
								<div className="row g-3">
									<div className="col-12 d-flex flex-column" style={{ gap: "4px" }}>
										<label
											className="form-label"
											style={{
												fontSize: "16px",
												fontWeight: "600",
											}}
										>
											Full name
										</label>
										<div
											className="input-group mb-3 border border-secondary"
											style={{ height: "60px", borderRadius: "4px", overflow: "hidden" }}
										>
											<button
												className="btn border-end border-secondary"
												style={{ border: "none" }}
												type="button"
												onClick={() => {
													setDialogVisibleCus(true);
												}}
											>
												<Plus />
											</button>
											<input
												type="text"
												className="form-control"
												placeholder={t("fullName")}
												readOnly
												required
												value={
													!formikBooking.values?.customer
														? " "
														: (formikBooking.values?.customer?.firstName || "") +
														  " " +
														  (formikBooking.values?.customer?.lastName || "")
												}
												onChange={() => {}}
												maxLength={20}
												onClick={() => {}}
												disabled={bookingState.action == "INS" ? false : true}
												style={{
													border: "none",
													padding: "12px",
													height: "60px",
												}}
											/>
										</div>
									</div>
								</div>
								<div className="row g-3">
									<div className="col-6 d-flex flex-column" style={{ gap: "4px" }}>
										<label
											className="form-label"
											style={{
												fontSize: "16px",
												fontWeight: "600",
											}}
										>
											Phone number
										</label>
										<div className="d-flex gap-2">
											<PhoneInput
												country={"us"}
												enableSearch
												disableSearchIcon
												containerStyle={{
													width: "100%",
													height: "60px",
												}}
												inputStyle={{
													width: "100%",
													height: "60px",
													paddingLeft: "100px",
												}}
												value={formikBooking.values?.customer?.phone}
												onChange={() => null}
												disabled={true}
											/>
										</div>
									</div>
									<div className="col-6 d-flex flex-column" style={{ gap: "4px" }}>
										<label
											className="form-label"
											style={{
												fontSize: "16px",
												fontWeight: "600",
											}}
										>
											Birth
										</label>
										<input
											type="email"
											className="form-control bg-white"
											placeholder="Birth"
											readOnly
											value={
												formikBooking.values?.customer?.birthday
													? formatDateToFormatString(
															String(formikBooking.values?.customer?.birthday),
															"DD/MM/YYYY"
													  )
													: ""
											}
											maxLength={20}
											onChange={() => null}
											style={{
												border: "1px solid #CCCED5",
												borderRadius: "4px",
												padding: "12px",
												height: "60px",
											}}
											disabled={true}
										/>
									</div>
								</div>
								{isFormFieldInvalid("customer.firstName", formikBooking) && (
									<small className="p-error">
										{getFormErrorMessage("customer.firstName", formikBooking)}
									</small>
								)}
							</AccordionTab>
							<AccordionTab
								header={
									<div className="d-flex gap-2">
										<Plus
											className="text-success border"
											style={{}}
											onClick={(e) => {
												e.stopPropagation();
												setDialogVisibleEmpl(true);
												if (newOderState.ListServiceClick?.Employee)
													dispatch(UpdateListServiceClick(undefined));
											}}
										/>
										<p className="my-auto">SERVICES</p>
									</div>
								}
							>
								<div className="">
									<div className="d-flex flex-column justify-content-center gap-2">
										<>
											{selected.map((item, index) => {
												return (
													<div
														key={"order-product-" + index}
														onClick={() => {
															setSelectedEmployee(item.Employee);
														}}
													>
														<SelectedServiceEmployee
															status={item.status}
															Employee={item.Employee}
															ListService={item.ListService}
															_id={item._id}
															code={undefined}
															tip={item.tip}
															discount={item.discount}
															ListGiftCard={item.ListGiftCard}
															OrderDetailId={item.OrderDetailId}
															handleDelete={handleDeleteService}
															handleDeleteEmployee={handleDeleteEmployee}
															// check open service
															isViewSer={isViewSer}
															setViewSer={setViewSer}
															BookingDetailId={""}
															// add setSelected
															setSelectedV2={setSelected}
															selectedV2={selected}
														/>
													</div>
												);
											})}
										</>
									</div>
								</div>
								{/* {isFormFieldInvalid("attributes", formikBooking) && (
									<>{getFormErrorMessage("attributes", formikBooking)}</>
								)} */}
							</AccordionTab>
						</Accordion>
					</div>
				</div>

				{action === "INS" ? (
					<div className="position-absolute bottom-0 end-0 p-3 bg-white border-top w-100">
						<div className="d-flex justify-content-end gap-2">
							<button className="btn btn-outline-secondary" onClick={closeDialog}>
								Cancel
							</button>
							<button
								type="button"
								onClick={() => {
									submitBooking();
								}}
								style={{
									padding: "16px 20px",
									backgroundColor: "#1160B7",
									border: "1px solid #8FAFF6",
									borderRadius: "8px",
									color: "white",
								}}
							>
								Save
							</button>
						</div>
					</div>
				) : action === "UPD" ? (
					<>
						<div className="position-absolute bottom-0 end-0 p-3 bg-white border-top w-100">
							<div className="d-flex justify-content-end gap-2">
								<button type="button" onClick={deleteSoftBooking} className="btn btn-outline-danger">
									Delete
								</button>
								<button
									type="button"
									onClick={updateBooking}
									className="btn btn-outline-secondary py-2 px-4"
									style={{
										color: "#FFFFFF",
										backgroundColor: "#1160B7",
									}}
								>
									Update
								</button>
							</div>
						</div>
					</>
				) : (
					<></>
				)}
			</Sidebar>
			<Dialog
				header={<div style={{ padding: "10px 0" }}>Delete this information?</div>}
				visible={visibleConfirm}
				style={{ width: "664px" }}
				onHide={() => {
					if (!visibleConfirm) return;
					setVisibleConfirm(false);
				}}
				footer={
					<div
						className="d-flex align-items-center justify-content-end"
						style={{ padding: "10px 0", borderTop: "1px solid #F0F2F4" }}
					>
						<Button
							label="Cancel"
							onClick={() => setVisibleConfirm(false)}
							style={{
								border: "1px solid #CCCED5",
								color: "#21242B",
								backgroundColor: "white",
								borderRadius: "8px",
								marginRight: "16px",
							}}
						/>
						<Button
							label="Yes"
							className="btn btn-primary"
							style={{
								backgroundColor: "#1160B7",
								borderRadius: "8px",
							}}
							onClick={() => {
								setVisibleConfirm(false);
								handleDeleteEmployeeDialog();
							}}
							autoFocus
						/>
					</div>
				}
			>
				<p
					style={{
						padding: "10px 0",
						fontWeight: "400",
						fontSize: "20px",
						lineHeight: "32px",
					}}
				>
					This action cannot be reverted. Are you sure to delete this employee's information?
				</p>
			</Dialog>
			<DynamicDialog
				width={isMobile ? "90vw" : "85vw"}
				minHeight={"85vh"}
				visible={dialogVisibleEmpl}
				mode={"add"}
				position={"center"}
				title={t("Employees")}
				okText=""
				cancelText="Hủy"
				draggable={false}
				isBackgroundGray={true}
				resizeable={false}
				onClose={() => {
					setDialogVisibleEmpl(false);
					setSelectedNumber(null);
					return;
				}}
				// status={formikStore.values.status.code}
				body={
					<div className="d-flex flex-column h-100">
						<div
							className="my-background-order p-0 px-1"
							style={{
								// height: bodyHeight > 639 ? bodyHeight - 190 : bodyHeight - 135,
								overflow: "hidden",
							}}
						>
							<WtcCard
								className="h-100"
								borderRadius={12}
								classNameBody="flex-grow-1 p-1 h-100"
								title={
									<div className="row bg-white boxContainer" style={{ textAlign: "center" }}>
										{windows.list
											.filter((item) => item.type == "EMPLOYEE" && item.status.code == "ACTIVE")
											.map((item: WindowModel, index) => {
												return (
													<div key={index} className="col boxItem">
														<div
															tabIndex={index + 1}
															key={item.code}
															onClick={() => {
																handleItemClick(item);
															}}
															className={`col clickable ${
																activeItem === item.name ? "my-active-title" : ""
															}`}
															onKeyDown={(e) => {
																if (e.key === "Enter") {
																	e.preventDefault();
																	handleItemClick(item);
																}
															}}
														>
															<span
																className={`fs-value rounded-circle d-inline-block text-center circle-rounded ${
																	activeItem === item.name ? "my-active-index" : ""
																}`}
															>
																{index + 1}
															</span>
															&ensp;
															<span className="text-color-gray fs-title">
																{item.name}
															</span>
														</div>
													</div>
												);
											})}
									</div>
								}
								tools={<></>}
								body={
									<div className="row bg-white mt-1" style={{ height: screenSize.height - 270 }}>
										{windows.list.filter(
											(item) => item.type == "EMPLOYEE" && item.status.code == "ACTIVE"
										).length > 0 ? (
											Array.from({ length: 20 }).map((_, index) => {
												const user = getUserAtPosition(index + 1);
												return (
													<Square
														heightIcon={40}
														widthIcon={40}
														height={(screenSize.height - 180) / 6}
														isUSer={false}
														key={index}
														index={index}
														selected={selectedNumber}
														onClick={() => {}}
														onClickEmployee={() => handleClick(index)}
														user={user?.profile}
														employee={user}
														onClickSelectEmpl={() => handleClickEmployee(user)}
													/>
												);
											})
										) : (
											<div className="text-center">{t("windows_empty")}</div>
										)}
									</div>
								}
								hideBorder={true}
							/>
						</div>
					</div>
				}
				closeIcon
				footer={
					<div className=" d-flex wtc-bg-white align-items-center justify-content-end">
						<Button
							type="button"
							disabled={selectedEmployee2.current ? false : true}
							label={t("select")}
							className="text-white wtc-bg-primary dialog-cancel-button"
							icon="ri ri-check-line"
							onClick={() => {
								// handleSelectEmployees(selectedEmployee);
								handleSelectEmployees();
								setDialogVisibleEmpl(false);
							}}
						/>
					</div>
				}
			/>

			<DynamicDialog
				width={isMobile ? "90vw" : "85vw"}
				minHeight={"85vh"}
				visible={dialogVisibleCus}
				mode={"add"}
				position={"center"}
				title={t("customer")}
				okText=""
				cancelText="Hủy"
				draggable={false}
				isBackgroundGray={true}
				resizeable={false}
				onClose={() => setDialogVisibleCus(false)}
				body={
					<div
						className="my-background-order p-0 px-1"
						style={{
							height: bodyHeight > 639 ? bodyHeight - 239 : bodyHeight - 178,
							overflow: "hidden",
						}}
					>
						<WtcCard
							classNameBody="flex-grow-1 pt-0 pe-0"
							isPaging={true}
							borderRadius={12}
							title={
								<HeaderList
									handleClickNoCustomer={handleClickNoCustomer}
									isNoCustomerOrder
									callback={fetchListLocal}
									target=""
									onSearchText={(text) =>
										dispatch(filterSearch({ searchString: text, status: "ALL" }))
									}
									onAddNew={() => {
										setDialogVisibleAddCustomer(true);
										setDialogVisibleCus(false);
									}}
								/>
							}
							hideBorder={true}
							body={
								<div className="d-flex flex-column h-100">
									<div
										className="flex-grow-1 as"
										style={{
											maxHeight: screenSize.height - 220,
											overflowX: "hidden",
											overflowY: "auto",
										}}
									>
										{customerState.fetchState.status == "loading" ? (
											<LoadingIndicator />
										) : !customerState.filtered || customerState?.filtered.length == 0 ? (
											<div className="w-100 h-100 d-flex flex-column justify-content-center">
												{" "}
												<WtcEmptyBox />
											</div>
										) : (
											customerState?.filtered
												.filter((i) => i?.status?.code == "ACTIVE")
												.map((item: CustomerModel, index: any) => {
													if (index >= first && index < first + rows)
														return (
															<div className="w-100" key={"customer-" + item._id}>
																<WtcItemCard
																	target={PageTarget.customer}
																	index={index}
																	hideDeleteSwiper={true}
																	slideButtons={[
																		<Button
																			type="button"
																			label={t("select")}
																			style={{ height: 35 }}
																			className="text-white wtc-bg-primary dialog-cancel-button"
																			icon="ri ri-check-line"
																			onClick={() =>
																				handleSubmitSelectedCustomerSlide(item)
																			}
																		/>,
																	]}
																	verticalSpacing={itemsLineSpacing}
																	selected={item._id === selectedId}
																	onDbClick={() => {}}
																	onClick={() => handleClickCustomer(item)}
																	status={item.status?.value}
																	onDelete={() => {}}
																	onRestore={() => {}}
																	body={
																		<div className="row align-items-center p-2">
																			<div className="col-sm-3">
																				<div
																					style={itemListStyleInfo}
																				>{`${formatCapitalize(
																					item.firstName
																				)} ${formatCapitalize(
																					item.lastName
																				)}`}</div>
																			</div>
																			<div className="col-sm-3">
																				<div style={itemListStyleInfo}>
																					<span>
																						<i className="my-grid-icon ri-phone-line" />{" "}
																					</span>
																					{formatHidePhoneNumber(item.phone)}
																				</div>
																			</div>
																			<div className="col-sm-2 text-truncate">
																				<div
																					className="w-100"
																					style={itemListStyleInfo}
																				>
																					<span>
																						<i className="my-grid-icon ri-cake-line" />{" "}
																					</span>
																					&ensp;
																					{item?.birthday
																						? formatDateBirthday(
																								item?.birthday
																						  )
																						: "#"}{" "}
																				</div>
																			</div>
																			<div className="col-sm-4 text-truncate">
																				<div
																					className="w-100"
																					style={itemListStyleInfo}
																				>
																					<span>
																						<i className="my-grid-icon ri-home-3-line" />{" "}
																					</span>
																					{item.address || "###"}
																				</div>
																			</div>
																		</div>
																	}
																/>
															</div>
														);
												})
										)}
									</div>
									{customerState.filtered?.length > 0 && (
										<div className="my-padding-top-paging">
											<Paginator
												first={first}
												rows={rows}
												totalRecords={customerState?.filtered?.length}
												rowsPerPageOptions={[10, 20]}
												onPageChange={onPageChange}
											/>
										</div>
									)}
								</div>
							}
							className="h-100"
						/>
					</div>
				}
				closeIcon
				footer={
					<div className=" d-flex wtc-bg-white align-items-center justify-content-end">
						<Button
							disabled={!selectedCustomer}
							type="button"
							label={t("select")}
							className="text-white wtc-bg-primary dialog-cancel-button"
							icon="ri ri-check-line"
							onClick={handleSubmitSelectedCustomer}
						/>
					</div>
				}
			/>

			<DynamicDialog
				width={isMobile ? "90vw" : "75vw"}
				minHeight={"75vh"}
				visible={DialogVisibleAddCustomer}
				mode={"add"}
				position={"center"}
				title={t("customer")}
				okText={t("Submit")}
				cancelText={t("action")}
				draggable={false}
				resizeable={false}
				onClose={() => closeDialogCus(formikCustomer)}
				footer={
					<div className=" d-flex wtc-bg-white align-items-center justify-content-end">
						<div className="d-flex">
							<WtcButton
								tabIndex={0}
								onFocus={() => {}}
								onBlur={() => {}}
								onKeyDown={(e) => {
									if (e.key === "Enter") {
										closeDialogCus(formikCustomer);
										e.preventDefault();
									}
								}}
								label={t("action.close")}
								className="bg-white text-blue me-2"
								borderColor="#283673"
								fontSize={16}
								onClick={() => closeDialogCus(formikCustomer)}
							/>
							{
								<WtcRoleButton
									tabIndex={0}
									target="USER"
									action="UPD"
									disabled={
										(formikCustomer &&
											formikCustomer.errors &&
											Object.keys(formikCustomer.errors).length > 0) ||
										false
									}
									label={t("action.create")}
									icon="ri-add-line"
									className="wtc-bg-primary text-white me-2"
									fontSize={16}
									onFocus={() => {}}
									onBlur={() => {}}
									onKeyDown={(e) => {
										if (e.key === "Enter") {
											formikCustomer.handleSubmit();
											e.preventDefault();
										}
									}}
									onClick={() => formikCustomer.handleSubmit()}
								/>
							}
						</div>
					</div>
				}
				body={
					<div className="pt-3">
						<div className="row mb-2">
							<div className="col-sm-6 " onClick={() => handleAddValue("firstName", values, setValues)}>
								<WtcInputIconText
									placeHolder={t("firstName")}
									maxLenght={20}
									focused
									required
									leadingIconImage={userIcon}
									field="firstName"
									formik={formikCustomer}
									value={formikCustomer.values.firstName}
								/>
							</div>
							<div className="col-sm-6" onClick={() => handleAddValue("lastName", values, setValues)}>
								<WtcInputIconText
									placeHolder={t("lastName")}
									maxLenght={20}
									required
									leadingIconImage={userIcon}
									field="lastName"
									formik={formikCustomer}
									value={formikCustomer.values.lastName}
								/>
							</div>
						</div>
						<div className="col-sm-12 mb-2">
							<WtcRoleInputIconText
								target={PageTarget.customer}
								code="address"
								maxLength={50}
								action="UPD"
								placeHolder={t("address")}
								leadingIcon={"ri-home-4-fill"}
								field="address"
								formik={formikCustomer}
								value={formikCustomer.values.address}
							/>
						</div>
						<div className="col-sm-12 mb-2 ">
							<WtcRoleInputIconText
								target={PageTarget.customer}
								code="city"
								maxLength={50}
								action="UPD"
								placeHolder={t("city")}
								leadingIcon={"ri-map-line"}
								field="city"
								formik={formikCustomer}
								value={formikCustomer.values.city}
							/>
						</div>
						<div className="row mt-2">
							<div className="col-sm-6 mb-2">
								<WtcRoleDropdownIconState
									filtler
									target={PageTarget.customer}
									code="state"
									action="UPD"
									disabled={false}
									placeHolder={t("state")}
									leadingIcon={"ri-pie-chart-line"}
									options={states}
									field="state"
									formik={formikCustomer}
									value={formikCustomer.values.state}
								/>
							</div>
							<div className="col-sm-6 mb-2">
								<WtcRoleInputIconText
									target={PageTarget.customer}
									type="tel"
									code="zipcode"
									action="UPD"
									placeHolder={t("zipcode")}
									mask="99999"
									slotChar="#####"
									leadingIcon={"ri-barcode-line"}
									field="zipcode"
									formik={formikCustomer}
									value={formikCustomer.values.zipcode}
								/>
							</div>
						</div>
						<div className="row mb-2">
							<div className="col-sm-6" onClick={() => handleAddValue("phone", values, setValues)}>
								<WtcInputPhone
									action={"INS"}
									code="phone"
									target={PageTarget.customer}
									placeHolder={t("phone")}
									type="tel"
									required
									mask="(999)999-9999"
									slotChar="(###)###-####"
									leadingIcon={"ri-phone-line"}
									field="phone"
									formik={formikCustomer}
									value={formikCustomer.values.phone}
								/>
							</div>
							<div className="col-md-6">
								<WtcInputIconText
									placeHolder="Email"
									leadingIconImage={emailIcon}
									field="email"
									formik={formikCustomer}
									value={formikCustomer.values.email}
								/>
							</div>
						</div>
						<div className="row mt-2">
							<div className="col-sm-6">
								<WtcDropdownIconText
									filtler={false}
									disabled={false}
									placeHolder={t("gender")}
									leadingIconImage={userIcon}
									options={[
										{ label: t("male"), value: "MALE" },
										{ label: t("female"), value: "FEMALE" },
										{ label: t("other"), value: "OTHER" },
									]}
									field="gender"
									formik={formikCustomer}
									value={formikCustomer.values.gender}
								/>
							</div>
							<div className="col-sm-6 ">
								<WtcInputPhone
									action={"INS"}
									code="birthday"
									target={PageTarget.customer}
									placeHolder={t("birthday")}
									mask="99/99/9999"
									slotChar="MM/DD/YYYY"
									leadingIcon={"ri-cake-line"}
									field="birthday"
									formik={formikCustomer}
									value={
										formikCustomer.values.birthday != null
											? convertISOToDateString(formikCustomer.values.birthday.toString())
											: undefined
									}
								/>
							</div>
						</div>
						<div className="col-sm-12 mt-2">
							<WtcInputIconText
								placeHolder={t("note")}
								leadingIcon={"ri-sticky-note-line"}
								field="note"
								formik={formikCustomer}
								value={formikCustomer.values.note}
							/>
						</div>
					</div>
				}
				closeIcon
			/>

			<DynamicDialog
				width={isMobile ? "90vw" : "85vw"}
				minHeight={"85vh"}
				visible={isViewSer}
				mode={"add"}
				position={"center"}
				title={t("service")}
				okText=""
				cancelText="Hủy"
				draggable={false}
				isBackgroundGray={true}
				resizeable={false}
				onClose={() => {
					setViewSer(false);
					setSelectedServiceIds([]);
					return;
				}}
				body={
					<div
						className="my-background-order p-0 px-1"
						style={{
							height: bodyHeight > 639 ? bodyHeight - 239 : bodyHeight - 178,
							overflow: "hidden",
						}}
					>
						<WtcCard
							classNameBody="flex-grow-1 pt-0 pe-0"
							isPaging={true}
							borderRadius={12}
							title={
								<></>
								// <HeaderList
								// 	handleClickNoCustomer={handleClickNoCustomer}
								// 	isNoCustomerOrder={false}
								// 	callback={() => {}}
								// 	target="SERVICE"
								// 	onSearchText={(text) =>
								// 		dispatch(filterSearch({ searchString: text, status: "ALL" }))
								// 	}
								// 	onAddNew={() => {
								// 		console.log("add new");
								// 	}}
								// />
							}
							hideBorder={true}
							body={
								<div className="d-flex flex-column h-100">
									<div
										className="flex-grow-1 as"
										style={{
											maxHeight: screenSize.height - 220,
											overflowX: "hidden",
											overflowY: "auto",
										}}
									>
										{serviceState.fetchState.status == "loading" ? (
											<LoadingIndicator />
										) : !serviceState.filtered || serviceState?.filtered.length == 0 ? (
											<div className="w-100 h-100 d-flex flex-column justify-content-center">
												{" "}
												<WtcEmptyBox />
											</div>
										) : (
											serviceState?.filtered
												.filter((i) => i?.status?.code == "ACTIVE")
												.map((item: ServiceModel, index: any) => {
													if (index >= first && index < first + rows) {
														//đếm số lượng item trùng lặp
														const existSelectServices: number = selected
															.filter((i) => i.Employee === selectedEmployee)
															.flatMap((service) => service.ListService)
															.filter(
																(itemService) => itemService?._id === item._id
															).length;

														const selectedNow: number = selectedServiceIds.filter(
															(itemId) => itemId._id === item._id
														).length;

														let countServiceItems =
															existSelectServices > 0
																? existSelectServices + selectedNow
																: selectedNow;

														return (
															<div className="w-100 my-1" key={"service-" + item._id}>
																<WtcItemCard
																	target={PageTarget.service}
																	index={index}
																	hideDeleteSwiper={false}
																	slideButtons={
																		[
																			// <Button
																			// 	type="button"
																			// 	label={t("select")}
																			// 	style={{ height: 35 }}
																			// 	className="text-white wtc-bg-primary dialog-cancel-button"
																			// 	icon="ri ri-check-line"
																			// 	onClick={() => {}}
																			// />,
																		]
																	}
																	verticalSpacing={itemsLineSpacing}
																	selected={selectedServiceIds
																		.flatMap((id) => id._id)
																		.includes(item._id)}
																	onDbClick={() => {}}
																	onClick={() => {
																		handleSelectedServices(item);
																	}}
																	status={item.status?.value}
																	onDelete={() => {}}
																	onRestore={() => {}}
																	body={
																		<div className="row align-items-center p-2">
																			<div className="col-sm-3">
																				<div style={itemListStyleInfo}>
																					{`${formatCapitalize(
																						item.displayName
																					)}`}
																				</div>
																			</div>
																			<div className="col-sm-3">
																				<div style={itemListStyleInfo}>
																					<span>
																						<i className="my-grid-icon pi pi-dollar" />{" "}
																					</span>
																					{item.employeePrice}
																				</div>
																			</div>
																			<div className="col-sm-4 text-truncate">
																				<div
																					className="w-100"
																					style={itemListStyleInfo}
																				>
																					<span>
																						Tax
																						<i
																							className={`ps-2 ${
																								item.tax.match("YES")
																									? "ri-checkbox-circle-line text-success fs-5"
																									: "ri-close-circle-line text-danger fs-5"
																							}`}
																						/>
																					</span>
																					&ensp;
																				</div>
																			</div>
																			<div className="col-sm-2 text-truncate">
																				<div
																					className="w-100"
																					style={itemListStyleInfo}
																				>
																					{countServiceItems}
																					{" - "}quantity
																				</div>
																			</div>
																		</div>
																	}
																/>
															</div>
														);
													}
												})
										)}
									</div>
									{customerState.filtered?.length > 0 && (
										<div className="my-padding-top-paging">
											<Paginator
												first={first}
												rows={rows}
												totalRecords={customerState?.filtered?.length}
												rowsPerPageOptions={[10, 20]}
												onPageChange={onPageChange}
											/>
										</div>
									)}
								</div>
							}
							className="h-100"
						/>
					</div>
				}
				closeIcon
				footer={
					<div className=" d-flex wtc-bg-white align-items-center justify-content-end">
						<Button
							disabled={false}
							type="button"
							label={t("select")}
							className="text-white wtc-bg-primary dialog-cancel-button"
							icon="ri ri-check-line"
							onClick={() => {
								selectServicesForEmployee();
							}}
						/>
					</div>
				}
			/>
		</>
	);
};

export default SidebarBooking;
