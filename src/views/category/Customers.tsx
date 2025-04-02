import { FormikErrors, useFormik } from "formik";
import { t } from "i18next";
import { DropdownChangeEvent } from "primereact/dropdown";
import { OverlayPanel } from "primereact/overlaypanel";
import { Paginator } from "primereact/paginator";
import { Tooltip } from "primereact/tooltip";
import { useEffect, useRef, useState } from "react";
import { isMobile } from "react-device-detect";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import useWindowSize from "../../app/screen";
import emailIcon from "../../assets/svg/mail.svg";
import userIcon from "../../assets/svg/user.svg";
import DynamicDialog, { DialogMode } from "../../components/DynamicDialog";
import HeaderList from "../../components/HeaderList";
import LoadingIndicator from "../../components/Loading";
import { itemListStyle, itemsLineSpacing } from "../../components/Theme";
import StatusDropdown from "../../components/commons/StatusDropdown";
import WtcButton from "../../components/commons/WtcButton";
import WtcCard from "../../components/commons/WtcCard";
import WtcEmptyBox from "../../components/commons/WtcEmptyBox";
import WtcInputPhone from "../../components/commons/WtcInputPhone";
import WtcItemCard from "../../components/commons/WtcItemCard";
import WtcRoleButton from "../../components/commons/WtcRoleButton";
import WtcRoleDropdownIconState from "../../components/commons/WtcRoleDropdownIconState";
import WtcRoleDropdownIconText from "../../components/commons/WtcRoleDropdownIconText";
import WtcRoleInputIconText from "../../components/commons/WtcRoleInputIconText";
import {
	checkEmptyAndUndefined,
	convertISOToDateString,
	convertISOToDateStringEditBirthday,
	convertToISOString,
	formatCapitalize,
	formatDateBirthday,
	formatPhoneNumberSubmitDatabase,
	formatPhoneNumberViewUI,
	handleAddValue,
	isISOString,
	PageTarget,
	states,
} from "../../const";
import { CustomerModel } from "../../models/category/Customer.model";
import {
	addCustomer,
	deleteCustomer,
	fetchCustomers,
	filterSearch,
	resetActionState,
	resetFetchState,
	restoreCustomer,
	setCurrentPage,
	setCurrentRows,
	updateCustomer,
} from "../../slices/customer.slice";
import { completed, failed, processing, warningWithConfirm } from "../../utils/alert.util";

export default function Customers() {
	const dispatch = useAppDispatch();
	const screenSize = useWindowSize();
	const customerState = useAppSelector((state) => state.customer);
	const [dialogMode, setDialogMode] = useState<DialogMode>("view");
	const [selectedId, _setSelectedId] = useState("");
	const [dialogVisible, setDialogVisible] = useState(false);
	const fState = (customerState.currentPage - 1) * customerState.currentRows;
	const [first, setFirst] = useState(fState);
	const [_page, setPage] = useState(customerState.currentPage - 1);
	const [rows, setRows] = useState(customerState.currentRows);
	const [values, setValues] = useState<string[]>([]);
	const [disableButtonSubmit, setdisableButtonSubmit] = useState(true);
	const [checkSubmitEnter, setCheckSubmitEnter] = useState(false);
	const [_totalPages, setTotalPages] = useState(Math.ceil(customerState.filtered.length / rows));
	const [status, setStatus] = useState("ACTIVE");
	const [searchString, setSearchString] = useState("");
	const op = useRef<any>(null);
	// const isAllowEdit = !RoleService.isAllowAction(authState.role, {PageTarget.customer}, "UPD");
	const onPageChange = (event: any) => {
		setFirst(event.first);
		setRows(event.rows);
		dispatch(setCurrentRows(event.rows));
		setTotalPages(event.pageCount);
		setPage(event.page + 1);
		dispatch(setCurrentPage(event.page + 1));
	};
	const formikCustomer = useFormik<any>({
		initialValues: CustomerModel.initial(),
		validate: (data) => {
			const errors: FormikErrors<CustomerModel> = {};
			if (dialogMode == "add") {
				if (checkEmptyAndUndefined(data.firstName) && values.includes("firstName")) {
					errors.firstName = "y";
				}
				if (checkEmptyAndUndefined(data.lastName) && values.includes("lastName")) {
					errors.lastName = "y";
				}
				if (checkEmptyAndUndefined(data.phone) && values.includes("phone")) {
					errors.phone = "y";
				}
			} else {
				if (!data.lastName) {
					errors.lastName = "y";
				}
				if (!data.firstName) {
					errors.firstName = "y";
				}
				if (!data.phone) {
					errors.phone = "y";
				}
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
					data?.birthday && data.birthday !== "" && isISOString(data.birthday)
						? convertISOToDateStringEditBirthday(data.birthday)
						: data?.birthday && data.birthday !== ""
						? convertToISOString(data.birthday)
						: null,
			};
			if (dialogMode == "add") dispatch(addCustomer(submitData));
			else if (dialogMode == "edit") dispatch(updateCustomer({ _id: data._id, data: submitData }));
		},
	});
	const onClickFilterStatus = (e: any) => {
		if (op.current) {
			op.current.toggle(e);
		}
	};
	const closeDialog = (formik: any) => {
		setDialogVisible(false);
		setValues([]);
		setCheckSubmitEnter(false);
		formik.resetForm();
	};
	const openItem = async (item: CustomerModel) => {
		setDialogMode("edit");
		formikCustomer.setValues(item);
		setDialogVisible(true);
	};
	const handleDeleteEmployee = (id: string) => {
		dispatch(deleteCustomer(id));
	};
	const handleRestoreEmployee = (id: string) => {
		dispatch(restoreCustomer(id));
	};
	useEffect(() => {
		if (customerState.actionState) {
			switch (customerState.actionState.status!) {
				case "completed":
					fetchListLocal();
					completed();
					dispatch(resetActionState());
					// dispatch(fetchCustomers());
					closeDialog(formikCustomer);
					break;
				case "loading":
					processing();
					break;
				case "failed":
					failed(t(customerState.actionState.error!));
					dispatch(resetActionState());
					break;
			}
		}
	}, [customerState.actionState]);
	useEffect(() => {
		dispatch(filterSearch({ searchString: searchString, status: status }));
	}, [status]);
	const fetchListLocal = async () => {
		await dispatch(fetchCustomers());
		dispatch(filterSearch({ searchString: searchString, status: status }));
	};
	useEffect(() => {
		if (
			checkEmptyAndUndefined(formikCustomer.values.firstName) ||
			checkEmptyAndUndefined(formikCustomer.values.lastName) ||
			checkEmptyAndUndefined(formikCustomer.values.phone)
		)
			setdisableButtonSubmit(true);
		else setdisableButtonSubmit(false);
	}, [formikCustomer.values]);
	useEffect(() => {
		fetchListLocal();
	}, []);

	useEffect(() => {
		setTotalPages(Math.ceil(customerState.filtered.length / rows));
	}, [customerState.filtered]);
	useEffect(() => {
		if (!customerState.currentPage) {
			dispatch(setCurrentPage(1));
			setPage(0);
		}
		if (!customerState.currentRows) {
			dispatch(setCurrentRows(5));
			setRows(5);
		}
	}, [customerState.currentPage, customerState.currentRows]);
	useEffect(() => {
		if (customerState.fetchState) {
			switch (customerState.fetchState.status!) {
				case "failed":
					failed(t(customerState.fetchState.error!));
					dispatch(resetFetchState());
					break;
			}
		}
	}, [customerState.fetchState]);

	return (
		<>
			<WtcCard
				isPaging={true}
				title={
					<>
						<HeaderList
							callback={fetchListLocal}
							target={PageTarget.customer}
							onSearchText={(text) => {
								setSearchString(text);
								dispatch(filterSearch({ searchString: text, status: status }));
							}}
							onAddNew={() => {
								setDialogMode("add");
								setDialogVisible(true);
							}}
							isFilterStatus={true}
							onClickFilterStatus={(e) => onClickFilterStatus(e)}
						/>
						<OverlayPanel autoFocus ref={op} style={{ width: "300px" }}>
							<div className="row pb-2">
								<div className="form-group col-sm-12">
									<label htmlFor="from-date">{t("status")}</label>
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
							className="flex-grow-1 as"
							style={{ maxHeight: screenSize.height - 240, overflowX: "hidden", overflowY: "auto" }}
						>
							{customerState.fetchState.status == "loading" ? (
								<LoadingIndicator />
							) : !customerState.filtered || customerState?.filtered.length == 0 ? (
								<div className="w-100 h-100 d-flex flex-column justify-content-center">
									{" "}
									<WtcEmptyBox />
								</div>
							) : (
								customerState?.filtered.map((item: CustomerModel, index: any) => {
									if (index >= first && index < first + rows)
										return (
											<div className="w-100" key={"customer-" + item._id}>
												<WtcItemCard
													target={PageTarget.customer}
													index={index}
													verticalSpacing={itemsLineSpacing}
													selected={item._id === selectedId}
													onDbClick={() => {}}
													onClick={() => {
														openItem(item);
													}}
													status={item.status?.value}
													onDelete={() => dispatch(deleteCustomer(item._id))}
													onRestore={() => dispatch(restoreCustomer(item._id))}
													body={
														<div className="row align-items-center p-2">
															<div className="col-sm-3">
																<div
																	className="my-grid-value"
																	style={itemListStyle}
																>{`${formatCapitalize(
																	item.firstName
																)} ${formatCapitalize(item.lastName)}`}</div>
															</div>
															<div className="col-sm-3">
																<div style={itemListStyle}>
																	<span>
																		<i
																			id="phone_customer"
																			className="my-grid-icon ri-phone-line"
																		/>{" "}
																	</span>
																	{formatPhoneNumberViewUI(item.phone)}
																</div>
																<Tooltip
																	position="bottom"
																	target="#phone_customer"
																	content={t("phone")}
																/>
															</div>
															<div className="col-sm-2 text-truncate">
																<div className="w-100" style={itemListStyle}>
																	<span>
																		<i
																			id="birthday_customer"
																			className="my-grid-icon ri-cake-line"
																		/>{" "}
																	</span>
																	&ensp;
																	{item?.birthday
																		? formatDateBirthday(item?.birthday)
																		: "#"}{" "}
																</div>
																<Tooltip
																	position="bottom"
																	target="#birthday_customer"
																	content={t("birthday")}
																/>
															</div>
															<div className="col-sm-4 text-truncate">
																<div className="w-100" style={itemListStyle}>
																	<span>
																		<i
																			id="address_customer"
																			className="my-grid-icon ri-home-3-line"
																		/>{" "}
																	</span>
																	{item.address || "#"}
																</div>
																<Tooltip
																	position="bottom"
																	target="#address_customer"
																	content={t("address")}
																/>
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
								{/* {isMobile ?
                        <Paginator
                            first={first}
                            rows={rows}
                            totalRecords={customerState?.filtered?.length}
                            rowsPerPageOptions={[5, 10, 15, 20]}
                            onPageChange={onPageChange}
                            template={{ layout: 'PrevPageLink CuryrentPageReport NextPageLink' }}
                            currentPageReportTemplate={` ${page}/${totalPages}`} /> :
                        <Paginator
                            first={first}
                            rows={rows}
                            totalRecords={customerState?.filtered?.length}
                            rowsPerPageOptions={[5, 10, 15, 20]}
                            onPageChange={onPageChange} />} */}
							</div>
						)}
					</div>
				}
				className="h-100"
			/>
			<div
				className=""
				onKeyDown={(e) => {
					if (e.key === "Enter" && disableButtonSubmit == false && !checkSubmitEnter) {
						formikCustomer.handleSubmit();
						e.preventDefault();
					}
				}}
			>
				<DynamicDialog
					width={isMobile ? "90vw" : "75vw"}
					minHeight={"75vh"}
					visible={dialogVisible}
					mode={dialogMode}
					position={"center"}
					title={t("customer")}
					okText={t("Submit")}
					cancelText={t("action")}
					draggable={false}
					resizeable={false}
					onClose={() => closeDialog(formikCustomer)}
					footer={
						<div className=" d-flex wtc-bg-white align-items-center justify-content-between">
							<div className="d-flex">
								{formikCustomer.values.status?.code == "ACTIVE" && (
									<WtcRoleButton
										tabIndex={0}
										onFocus={() => setCheckSubmitEnter(true)}
										onBlur={() => setCheckSubmitEnter(false)}
										onKeyDown={(e) => {
											if (e.key === "Enter") {
												warningWithConfirm({
													title: t("do_you_delete"),
													text: "",
													confirmButtonText: t("Delete"),
													confirm: () => handleDeleteEmployee(formikCustomer.values._id),
												});
												e.preventDefault();
											}
										}}
										target={PageTarget.customer}
										action="DEL"
										label={t("action.delete")}
										className="bg-danger text-white me-2"
										icon="ri-close-large-line"
										fontSize={16}
										minWidth={100}
										onClick={() => {
											warningWithConfirm({
												title: t("do_you_delete"),
												text: "",
												confirmButtonText: t("Delete"),
												confirm: () => handleDeleteEmployee(formikCustomer.values._id),
											});
										}}
									/>
								)}
								{formikCustomer.values.status?.code == "INACTIVE" && (
									<WtcRoleButton
										tabIndex={0}
										target={PageTarget.customer}
										action="RES"
										label={t("action.restore")}
										className="bg-blue text-white me-2"
										icon="ri-loop-left-line"
										fontSize={16}
										minWidth={100}
										onFocus={() => setCheckSubmitEnter(true)}
										onBlur={() => setCheckSubmitEnter(false)}
										onKeyDown={(e) => {
											if (e.key === "Enter") {
												warningWithConfirm({
													title: t("do_you_restore"),
													text: "",
													confirmButtonText: t("Restore"),
													confirm: () => handleRestoreEmployee(formikCustomer.values._id),
												});
												e.preventDefault();
											}
										}}
										onClick={() => {
											warningWithConfirm({
												title: t("do_you_restore"),
												text: "",
												confirmButtonText: t("Restore"),
												confirm: () => handleRestoreEmployee(formikCustomer.values._id),
											});
										}}
									/>
								)}
							</div>
							<div className="d-flex">
								<WtcButton
									tabIndex={0}
									onFocus={() => setCheckSubmitEnter(true)}
									onBlur={() => setCheckSubmitEnter(false)}
									onKeyDown={(e) => {
										if (e.key === "Enter") {
											closeDialog(formikCustomer);
											e.preventDefault();
										}
									}}
									label={t("action.close")}
									className="bg-white text-blue me-2"
									borderColor="#283673"
									fontSize={16}
									onClick={() => closeDialog(formikCustomer)}
								/>
								{dialogMode == "add" && (
									// customer modal button
									<WtcRoleButton
										tabIndex={0}
										target={PageTarget.customer}
										action="INS"
										disabled={
											(formikCustomer &&
												formikCustomer.errors &&
												Object.keys(formikCustomer.errors).length > 0) ||
											disableButtonSubmit
										}
										label={t("action.create")}
										icon="ri-add-line"
										className="wtc-bg-primary text-white me-2"
										fontSize={16}
										onFocus={() => setCheckSubmitEnter(true)}
										onBlur={() => setCheckSubmitEnter(false)}
										onKeyDown={(e) => {
											if (e.key === "Enter") {
												formikCustomer.handleSubmit();
												e.preventDefault();
											}
										}}
										onClick={() => formikCustomer.handleSubmit()}
									/>
								)}

								{dialogMode == "edit" && (
									<WtcRoleButton
										tabIndex={0}
										target={PageTarget.customer}
										action="UPD"
										disabled={
											(formikCustomer &&
												formikCustomer.errors &&
												Object.keys(formikCustomer.errors).length > 0) ||
											disableButtonSubmit
										}
										label={t("action.UPD")}
										icon="ri-edit-line"
										className="wtc-bg-primary text-white me-2"
										minWidth={100}
										fontSize={16}
										onFocus={() => setCheckSubmitEnter(true)}
										onBlur={() => setCheckSubmitEnter(false)}
										onKeyDown={(e) => {
											if (e.key === "Enter") {
												formikCustomer.handleSubmit();
												e.preventDefault();
											}
										}}
										onClick={() => formikCustomer.handleSubmit()}
									/>
								)}
							</div>
						</div>
					}
					body={
						<div className="pt-3">
							<div className="row mb-2">
								<div
									className="col-sm-6 "
									onClick={() => handleAddValue("firstName", values, setValues)}
								>
									<WtcRoleInputIconText
										placeHolder={t("firstName")}
										maxLength={20}
										action={dialogMode == "add" ? "INS" : "UPD"}
										code="firstName"
										target={PageTarget.customer}
										focused
										required
										leadingIconImage={userIcon}
										field="firstName"
										formik={formikCustomer}
										value={formikCustomer.values.firstName}
									/>
								</div>
								<div className="col-sm-6" onClick={() => handleAddValue("lastName", values, setValues)}>
									<WtcRoleInputIconText
										placeHolder={t("lastName")}
										maxLength={20}
										action={dialogMode == "add" ? "INS" : "UPD"}
										code="firstName"
										target={PageTarget.customer}
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
									action={dialogMode == "add" ? "INS" : "UPD"}
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
									action={dialogMode == "add" ? "INS" : "UPD"}
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
										action={dialogMode == "add" ? "INS" : "UPD"}
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
										action={dialogMode == "add" ? "INS" : "UPD"}
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
										action={dialogMode == "add" ? "INS" : "UPD"}
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
									<WtcRoleInputIconText
										action={dialogMode == "add" ? "INS" : "UPD"}
										code="email"
										target={PageTarget.customer}
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
									<WtcRoleDropdownIconText
										action={dialogMode == "add" ? "INS" : "UPD"}
										code="gender"
										target={PageTarget.customer}
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
										action={dialogMode == "add" ? "INS" : "UPD"}
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
								<WtcRoleInputIconText
									action={dialogMode == "add" ? "INS" : "UPD"}
									code="note"
									target={PageTarget.customer}
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
			</div>
		</>
	);
}
