import { FormikErrors, useFormik } from "formik";
import { t } from "i18next";
import _ from "lodash";
import { Button } from "primereact/button";
import { Paginator } from "primereact/paginator";
import { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { useAppSelector } from "../../app/hooks";
import useWindowSize from "../../app/screen";
import emailIcon from "../../assets/svg/mail.svg";
import userIcon from "../../assets/svg/user.svg";
import {
	checkEmptyAndUndefined,
	CheckRoleWithAction,
	convertISOToDateString,
	convertISOToDateStringEditBirthday,
	convertToISOString,
	formatCapitalize,
	formatDateBirthday,
	formatHidePhoneNumber,
	formatPhoneNumberSubmitDatabase,
	formatPhoneNumberViewUI,
	handleAddValue,
	isISOString,
	PageTarget,
	phoneGuestCustomer,
	states,
	StatusInitInprocessing,
} from "../../const";
import { CustomerModel } from "../../models/category/Customer.model";
import { ListServiceSelectedModel } from "../../models/category/ListServiceSelected.model";
import { UserModel } from "../../models/category/User.model";
import { WindowModel } from "../../models/category/Window.model";
import {
	calculatorDiscount,
	clearState,
	update_idSave,
	updateCustomer,
	UpdateListServiceClick,
	UpdateListServiceEditEmployee,
	updateSaveDrag,
	updatetempService,
} from "../../slices/newOder.slice";
import {
	addCustomer,
	fetchCustomers,
	filterSearch,
	resetActionState,
	selectCustomerOrder,
	setCurrentPage,
	setCurrentRows,
} from "../../slices/customer.slice";
import { fetchUsers, filterSearchEmpl } from "../../slices/user.slice";
import { fetchWindow } from "../../slices/window.slice";
import { completed, failed, processing } from "../../utils/alert.util";
import Square from "../../views/category/Window/Square";
import DynamicDialog from "../DynamicDialog";
import HeaderList from "../HeaderList";
import LoadingIndicator from "../Loading";
import { itemListStyleInfo, itemsLineSpacing } from "../Theme";
import CreateQrCode from "../commons/CreateQrCode";
import WtcButton from "../commons/WtcButton";
import WtcCard from "../commons/WtcCard";
import WtcDropdownIconText from "../commons/WtcDropdownIconText";
import WtcEmptyBox from "../commons/WtcEmptyBox";
import WtcInputIconText from "../commons/WtcInputIconText";
import WtcInputPhone from "../commons/WtcInputPhone";
import WtcItemCard from "../commons/WtcItemCard";
import WtcRoleButton from "../commons/WtcRoleButton";
import WtcRoleDropdownIconState from "../commons/WtcRoleDropdownIconState";
import WtcRoleInputIconText from "../commons/WtcRoleInputIconText";

export default function OrderBar() {
	const customerState = useAppSelector((state) => state.customer);
	const newOderState = useAppSelector((state) => state.newOder);
	const windows = useAppSelector((state) => state.window);
	const navigate = useNavigate();
	const [selected, setSelected] = useState<ListServiceSelectedModel[]>(newOderState.tempService);
	const [selectedEmployee, setSelectedEmployee] = useState<UserModel>();
	const userState = useAppSelector((state) => state.user);
	const [selectedId, setSelectedId] = useState("");
	const [selectedCustomer, setSelectedCustomer] = useState<CustomerModel>();
	const dispatch = useDispatch();
	const screenSize = useWindowSize();
	const bodyHeight = screenSize.height;
	const [dialogVisible, setDialogVisible] = useState(false);
	const [dialogVisibleEmpl, setDialogVisibleEmpl] = useState(false);
	const [DialogVisibleAddCustomer, setDialogVisibleAddCustomer] = useState(false);
	const [checkSubmitEnter, setCheckSubmitEnter] = useState(false);
	const [showQrCode, setShowQrCode] = useState(false);
	const [valueQrCode, setValueQrCode] = useState("");
	const [customerQrCode, setCustomerQrCode] = useState<CustomerModel | undefined>();
	const [values, setValues] = useState<string[]>([]);
	const [disableButtonSubmit, setDisableButtonSubmit] = useState(true);
	const w = windows.list.filter((item) => item.type == "EMPLOYEE" && item.status.code == "ACTIVE");
	const [windowSelected, setWindowSelected] = useState(w[0]);
	const [activeItem, setActiveItem] = useState(windowSelected?.name);
	const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
	const fState = (customerState.currentPage - 1) * customerState.currentRows;
	const [first, setFirst] = useState(fState);
	const [_page, setPage] = useState(customerState.currentPage - 1);
	const [rows, setRows] = useState(customerState.currentRows);
	const [_totalPages, setTotalPages] = useState(Math.ceil(customerState.filtered.length / rows));
	const NoCus = customerState.list.find((item) => item.phone == phoneGuestCustomer);
	const auth = useAppSelector((state) => state.auth);
	const onPageChange = (event: any) => {
		setFirst(event.first);
		setRows(event.rows);
		dispatch(setCurrentRows(event.rows));
		setTotalPages(event.pageCount);
		setPage(event.page + 1);
		dispatch(setCurrentPage(event.page + 1));
	};
	const handleClickEmployee = (item: UserModel | undefined) => {
		setSelectedEmployee(item);
	};
	const handleClick = (index: number) => {
		setSelectedNumber(index);
	};
	const handleItemClick = (item: any) => {
		setActiveItem(item.name);
		setWindowSelected(item);
		setSelectedNumber(null);
		setSelectedEmployee(undefined);
	};

	const handleSubmitSelectedCustomer = () => {
		dispatch(updateCustomer(selectedCustomer));
		setDialogVisible(false);
		dispatch(updateSaveDrag(true));
	};
	// const handleDeleteSelectedCustomer = () => {
	// 	dispatch(updateCustomer(undefined));
	// 	setSelectedId("");
	// };
	const handleDeleteEmployee = () => {
		dispatch(UpdateListServiceClick(undefined));
	};
	const handleClickCustomer = (item: CustomerModel) => {
		setSelectedCustomer(item);
		setSelectedId(item._id);
	};
	const closeDialog = (formik: any) => {
		setDialogVisibleAddCustomer(false);
		setValues([]);
		setCheckSubmitEnter(false);
		formik.resetForm();
		setDialogVisible(false);
	};
	const handleSelectEmployees = (employees: any) => {
		setSelectedNumber(null);
		if (newOderState.ListServiceEditEmployee) {
			let employeeExists = false;
			selected.forEach((item) => {
				if (item.Employee?._id === employees?._id) {
					employeeExists = true;
					return;
				}
			});
			if (employeeExists) {
				failed("Đã tồn tại employee này");
			} else {
				const updatedItem = new ListServiceSelectedModel(
					employees,
					newOderState.ListServiceEditEmployee.ListService,
					newOderState.ListServiceEditEmployee.ListGiftCard,
					newOderState.ListServiceEditEmployee._id,
					undefined,
					0,
					newOderState.ListServiceEditEmployee.discount,
					newOderState.ListServiceEditEmployee.status,
					newOderState.ListServiceClick?.OrderDetailId,
					undefined
				);
				setSelected((prevSelected) => {
					return prevSelected.map((item) =>
						item._id === newOderState.ListServiceEditEmployee?._id ? updatedItem : item
					);
				});
				dispatch(UpdateListServiceClick(updatedItem));
				dispatch(UpdateListServiceEditEmployee(null));
				setDialogVisibleEmpl(false);
			}
		} else {
			//kiểm tra xem employ chọn có trong list chưa
			if (selected.some((item) => item.Employee?._id === employees?._id)) {
				const selectedItem = selected.find((item) => item.Employee?._id === employees?._id);
				if (selectedItem) {
					dispatch(UpdateListServiceClick(selectedItem));
					setDialogVisibleEmpl(false);
				}
			} else if (newOderState.ListServiceClick && newOderState.ListServiceClick?.Employee == undefined) {
				setSelected((prevSelected) => {
					const updatedSelected = prevSelected.map((item) => {
						if (item._id === newOderState.ListServiceClick?._id) {
							const change = new ListServiceSelectedModel(
								employees,
								item.ListService,
								item.ListGiftCard,
								newOderState.ListServiceClick?._id,
								undefined,
								0,
								newOderState.ListServiceClick.discount,
								newOderState.ListServiceClick.status,
								newOderState.ListServiceClick.OrderDetailId,
								undefined
							);
							dispatch(UpdateListServiceClick(change));
							dispatch(updateSaveDrag(true));

							return change;
						}
						return item;
					});
					setDialogVisibleEmpl(false);
					dispatch(updateSaveDrag(true));
					return updatedSelected;
				});
			} else {
				setSelected((prevSelected) => {
					const updatedSelected = [...prevSelected];
					const selectedOnClickIndex = updatedSelected.findIndex(
						(item) => item === newOderState.ListServiceClick
					);

					if (selectedOnClickIndex !== -1 && newOderState.ListServiceClick) {
						updatedSelected[selectedOnClickIndex] = new ListServiceSelectedModel(
							employees,
							newOderState.ListServiceClick.ListService,
							newOderState.ListServiceClick.ListGiftCard,
							uuidv4(),
							undefined,
							0,
							0,
							newOderState.ListServiceClick.status,
							newOderState.ListServiceClick.OrderDetailId,
							undefined
						);
						dispatch(updateSaveDrag(true));

						dispatch(UpdateListServiceClick(updatedSelected[selectedOnClickIndex]));
					} else {
						//tạo phần tử mới push vào list
						const newItem = new ListServiceSelectedModel(
							employees,
							[],
							[],
							uuidv4(),
							undefined,
							0,
							0,
							StatusInitInprocessing(),
							undefined,
							undefined
						);
						updatedSelected.push(newItem);
						dispatch(UpdateListServiceClick(newItem));
						dispatch(updateSaveDrag(true));
					}
					setDialogVisibleEmpl(false);
					return updatedSelected;
				});
			}
		}
	};
	const handleClickCreateQrCode = (value: string, Cus: CustomerModel | undefined) => {
		setValueQrCode(value);
		setCustomerQrCode(Cus);
		setShowQrCode(true);
	};
	const fetchListLocal = () => {
		dispatch(fetchCustomers());
		dispatch(fetchUsers());
		dispatch(fetchWindow());
	};
	const handleSubmitSelectedCustomerSlide = (i: CustomerModel) => {
		setSelectedId(i._id);
		dispatch(selectCustomerOrder({ id: i._id }));
		dispatch(updateCustomer(i));
		setDialogVisible(false);
	};
	const handleClickNoCustomer = () => {
		dispatch(updateCustomer(NoCus));
		setDialogVisible(false);
	};
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
	const menuitemEmployee = (item: any | undefined) => {
		return item ? (
			<div className="menu-item-2 me-2" style={{ borderRadius: 12 }}>
				<div className="float-start" style={{ width: "auto" }}>
					<div className="float-start mt-1" style={{ height: 30 }}>
						<div
							className="px-2 mx-2 fw-bold fs-name-empl"
							style={{
								height: 28,
								paddingTop: 5,
								color: "#30363F",
								background: "#d0e1fd",
								borderRadius: 10,
							}}
						>
							<span className="pt-1">{t("staff")}</span>
						</div>
					</div>
					<div className="float-end">
						<div
							className="fs-name-empl fw-bold"
							style={{
								overflow: "hidden",
								whiteSpace: "nowrap",
								textOverflow: "ellipsis",
								color: "#30363F",
							}}
						>
							{formatCapitalize(item?.profile?.firstName || "")}{" "}
							{formatCapitalize(item?.profile?.middleName || "")}{" "}
							{formatCapitalize(item?.profile?.lastName || "")}
						</div>
						<div className="my-label-in-grid fs-value-disabled" style={{ whiteSpace: "nowrap" }}>
							{formatPhoneNumberViewUI(item?.profile?.phone) || ""}
						</div>
					</div>
				</div>
				<div className="float-end mt-1 ms-1 me-1">
					<WtcButton
						label={""}
						icon="ri-close-line"
						className="bg-danger text-white me-1"
						borderRadius={10}
						height={25}
						fontSize={14}
						labelStyle={{ fontWeight: "bold" }}
						onClick={handleDeleteEmployee}
					/>
				</div>
			</div>
		) : (
			<>
				{/* <div className="menu-item-2 me-2" style={{ borderRadius: 12 }}>
					<div className="float-start" style={{ width: "auto" }}>
						<div className="float-start mt-1" style={{ height: 30 }}>
							<div
								className="px-2 mx-2 fw-bold fs-name-empl"
								style={{
									height: 28,
									paddingTop: 5,
									color: "#30363F",
									background: "#d0e1fd",
									borderRadius: 10,
								}}
							>
								<span className="pt-1">{t("staff")}</span>
							</div>
						</div>
					</div>
				</div> */}
			</>
		);
	};
	const menuitem = (item: any) => {
		return (
			<div
				className={`menu-item-2 me-2 ${
					!CheckRoleWithAction(auth, PageTarget.order, newOderState.actionOrder == "add" ? "INS" : "UPD")
						? "disabled"
						: ""
				}`}
				style={{ borderRadius: 12 }}
				onClick={() => setDialogVisible(true)}
			>
				<div className="float-start" style={{ width: "auto" }}>
					<div className="float-start mt-1" style={{ height: 30 }}>
						<div
							className="px-2 mx-2 fw-bold fs-name-empl"
							style={{
								height: 28,
								paddingTop: 5,
								color: "#30363F",
								background: "#d0e1fd",
								borderRadius: 10,
							}}
						>
							<span className="pt-1">{t("customer")}</span>
						</div>
					</div>
					<div className="float-end">
						<div
							className="fs-name-empl fw-bold"
							style={{
								overflow: "hidden",
								whiteSpace: "nowrap",
								textOverflow: "ellipsis",
								color: "#30363F",
							}}
						>
							{formatCapitalize(item?.firstName || "")} {formatCapitalize(item?.lastName || "")}
						</div>
						<div className="my-label-in-grid fs-value-disabled" style={{ whiteSpace: "nowrap" }}>
							{formatHidePhoneNumber(item?.phone) || ""}
						</div>
					</div>
				</div>
				<div className="float-end mt-1 ms-1 me-1">
					{/* <WtcButton
						label={""}
						icon="ri-close-line"
						className="bg-danger text-white me-1"
						borderRadius={10}
						height={27}
						fontSize={14}
						labelStyle={{ fontWeight: "bold" }}
						onClick={handleDeleteSelectedCustomer}
					/> */}
				</div>
			</div>
		);
	};
	const headerOrderCode = () => {
		return (
			<>
				<div className="d-flex align-items-center fs-value fw-normal">
					{t("order")}&ensp;<span className="fs-title fw-bold">{newOderState?.code}</span>&ensp;
					{newOderState?.code != undefined && (
						<WtcButton
							label={""}
							className="wtc-bg-yellow text-white px-3"
							icon="ri-qr-code-line"
							fontSize={14}
							borderRadius={12}
							height={30}
							onClick={() =>
								handleClickCreateQrCode(newOderState.code ?? "", newOderState?.customer || undefined)
							}
						/>
					)}
					&ensp;
					{newOderState.saveDrag && (
						<span className="text-danger fw-bold px-1 rounded" style={{ border: "1px solid red" }}>
							DRAFT
						</span>
					)}
				</div>
			</>
		);
	};
	const headerNoOrderCode = () => {
		return (
			<>
				<div className="d-flex align-items-center fs-value fw-normal">
					<span className="fw-bold">{t("neworder")}</span>
					&ensp;
					<span className="fs-title fw-bold">
						{newOderState.saveDrag && (
							<span className="text-danger fw-bold px-1 rounded" style={{ border: "1px solid red" }}>
								DRAFT
							</span>
						)}
					</span>
					&ensp;
				</div>
			</>
		);
	};
	const getUserAtPosition = (position: number) => {
		return userState.list
			.filter((user) => user.profile.positionWindow?._id == windowSelected?._id && user.status == "ACTIVE")
			.find((user) => user.profile?.positionPoint === position);
	};
	useEffect(() => {
		if (!_.isEqual(newOderState.tempService, selected)) {
			setSelected(newOderState.tempService);
		}
	}, [newOderState.tempService]);

	useEffect(() => {
		!_.isEqual(newOderState.tempService, selected);
		{
			dispatch(updatetempService(selected));
			dispatch(calculatorDiscount(newOderState.ListDiscount));
		}
	}, [selected]);
	useEffect(() => {
		if (!newOderState.customer) dispatch(updateCustomer(NoCus));
		if (!newOderState._id && !newOderState._idSave) dispatch(update_idSave(uuidv4()));
	}, []);
	useEffect(() => {
		dispatch(filterSearch({ searchString: "", status: "ALL" }));
	}, [customerState.list]);
	useEffect(() => {
		dispatch(filterSearchEmpl({ searchString: "", status: "ACTIVE" }));
	}, [userState.list]);
	useEffect(() => {
		if (
			checkEmptyAndUndefined(formikCustomer.values.firstName) ||
			checkEmptyAndUndefined(formikCustomer.values.lastName) ||
			checkEmptyAndUndefined(formikCustomer.values.phone)
		)
			setDisableButtonSubmit(true);
		else setDisableButtonSubmit(false);
	}, [formikCustomer.values]);
	useEffect(() => {
		if (customerState.actionState) {
			switch (customerState.actionState.status!) {
				case "completed":
					completed();
					dispatch(resetActionState());
					closeDialog(formikCustomer);
					dispatch(updateSaveDrag(true));
					dispatch(updateCustomer(customerState.dataCreateSuccess));
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
		if (!windowSelected && w.length > 0) {
			setWindowSelected(w[0]);
			setActiveItem(w[0].name);
		}
	}, [windows]);
	return (
		<>
			<WtcCard
				borderRadius={12}
				className=""
				title={<>{newOderState?.code == undefined ? headerNoOrderCode() : headerOrderCode()}</>}
				tools={
					<div className="d-flex">
						{newOderState.ListServiceClick?.Employee
							? menuitemEmployee(newOderState.ListServiceClick.Employee)
							: menuitemEmployee(undefined)}
						<WtcRoleButton
							action={newOderState.actionOrder == "add" ? "INS" : "UPD"}
							target={PageTarget.order}
							height={35}
							fontSize={14}
							label={t("Employee")}
							icon="ri-add-circle-line"
							className="me-2 text-white wtc-bg-primary"
							onClick={() => {
								setDialogVisibleEmpl(true);
								if (newOderState.ListServiceClick?.Employee)
									dispatch(UpdateListServiceClick(undefined));
							}}
						/>
						{newOderState.customer ? (
							menuitem(newOderState.customer)
						) : (
							<WtcRoleButton
								action={newOderState.actionOrder == "add" ? "INS" : "UPD"}
								target={PageTarget.order}
								height={35}
								fontSize={14}
								label={t("customer")}
								icon="ri-add-circle-line"
								className="me-2 text-white wtc-bg-primary"
								onClick={() => {
									setDialogVisible(true);
								}}
							/>
						)}

						<WtcButton
							height={35}
							fontSize={14}
							label={t("orderlist")}
							icon="ri-shopping-cart-fill"
							className="text-white wtc-bg-primary me-2"
							onClick={() => {
								dispatch(clearState());
								navigate("/order-list");
							}}
						/>
						<WtcButton
							height={35}
							label={t("neworder")}
							fontSize={14}
							icon="ri-add-circle-line"
							className="text-white wtc-bg-primary"
							onClick={() => {
								setSelected([]);
								dispatch(UpdateListServiceClick(undefined));
								dispatch(clearState());
								dispatch(updateCustomer(NoCus));
								dispatch(update_idSave(uuidv4()));
							}}
						/>
						<DynamicDialog
							width={isMobile ? "90vw" : "85vw"}
							minHeight={"85vh"}
							visible={dialogVisible}
							mode={"add"}
							position={"center"}
							title={t("customer")}
							okText=""
							cancelText="Hủy"
							draggable={false}
							isBackgroundGray={true}
							resizeable={false}
							onClose={() => setDialogVisible(false)}
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
													setDialogVisible(false);
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
													) : !customerState.filtered ||
													  customerState?.filtered.length == 0 ? (
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
																		<div
																			className="w-100"
																			key={"customer-" + item._id}
																		>
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
																							handleSubmitSelectedCustomerSlide(
																								item
																							)
																						}
																					/>,
																				]}
																				verticalSpacing={itemsLineSpacing}
																				selected={item._id === selectedId}
																				onDbClick={() => {}}
																				onClick={() =>
																					handleClickCustomer(item)
																				}
																				status={item.status?.value}
																				onDelete={() => {}}
																				onRestore={() => {}}
																				body={
																					<div className="row align-items-center p-2">
																						<div className="col-sm-3">
																							<div
																								style={
																									itemListStyleInfo
																								}
																							>{`${formatCapitalize(
																								item.firstName
																							)} ${formatCapitalize(
																								item.lastName
																							)}`}</div>
																						</div>
																						<div className="col-sm-3">
																							<div
																								style={
																									itemListStyleInfo
																								}
																							>
																								<span>
																									<i className="my-grid-icon ri-phone-line" />{" "}
																								</span>
																								{formatHidePhoneNumber(
																									item.phone
																								)}
																							</div>
																						</div>
																						<div className="col-sm-2 text-truncate">
																							<div
																								className="w-100"
																								style={
																									itemListStyleInfo
																								}
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
																								style={
																									itemListStyleInfo
																								}
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
											// <div className="h-100 mt-1" style={{}}>
											// 	{customerState.fetchState.status == "loading" ? (
											// 		<LoadingIndicator />
											// 	) : !customerState.filtered || customerState?.filtered.length == 0 ? (
											// 		<div className="w-100 h-100 d-flex flex-column justify-content-center">
											// 			<WtcEmptyBox />
											// 		</div>
											// 	) : (
											// 		<div className="row ms-1 me-0">
											// 			{customerState?.filtered.map(
											// 				(item: CustomerModel, index: any) => {
											// 					// return (
											// 					// 	<WtcSquareCustomerItem
											// 					// 		idCustomerSelected={selectedCustomer?._id || ""}
											// 					// 		onClick={() => handleClickCustomer(item)}
											// 					// 		customer={item}
											// 					// 		keyIndex={index}
											// 					// 	/>
											// 					// );
											// 					if (index >= first && index < first + rows)
											// 						return (
											// 							<div
											// 								className="w-100"
											// 								key={"customer-" + item._id}
											// 							>
											// 								<WtcItemCard
											// 									index={index}
											// 									hideDeleteSwiper={true}
											// 									slideButtons={[
											// 										<Button
											// 											type="button"
											// 											label={t("select")}
											// 											className="text-white wtc-bg-primary dialog-cancel-button"
											// 											icon="ri ri-check-line"
											// 											onClick={() =>
											// 												handleSubmitSelectedCustomerSlide(
											// 													item._id
											// 												)
											// 											}
											// 										/>,
											// 									]}
											// 									verticalSpacing={itemsLineSpacing}
											// 									selected={item._id === selectedId}
											// 									onDbClick={() => {}}
											// 									onClick={() =>
											// 										handleClickCustomer(item)
											// 									}
											// 									status={item.status?.value}
											// 									onDelete={() => {}}
											// 									onRestore={() => {}}
											// 									body={
											// 										<div className="row align-items-center p-3">
											// 											<div className="col-sm-3">
											// 												<div
											// 													style={itemListStyle}
											// 												>{`${item.lastName} ${item.firstName}`}</div>
											// 											</div>
											// 											<div className="col-sm-3">
											// 												<div style={itemListStyle}>
											// 													<span>
											// 														<i className="my-grid-icon ri-phone-line" />{" "}
											// 													</span>
											// 													{item.phone}
											// 												</div>
											// 											</div>
											// 											<div className="col-sm-2 text-truncate">
											// 												<div
											// 													className="w-100"
											// 													style={itemListStyle}
											// 												>
											// 													<span>
											// 														<i className="my-grid-icon ri-cake-line" />{" "}
											// 													</span>
											// 													&ensp;
											// 													{item?.birthday
											// 														? formatDateBirthday(
											// 																item?.birthday
											// 														  )
											// 														: "#"}{" "}
											// 												</div>
											// 											</div>
											// 											<div className="col-sm-4 text-truncate">
											// 												<div
											// 													className="w-100"
											// 													style={itemListStyle}
											// 												>
											// 													<span>
											// 														<i className="my-grid-icon ri-home-3-line" />{" "}
											// 													</span>
											// 													{item.address || "###"}
											// 												</div>
											// 											</div>
											// 										</div>
											// 									}
											// 								/>
											// 							</div>
											// 						);
											// 				}
											// 			)}
											// 		</div>
											// 	)}

											// </div>
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
							onClose={() => setDialogVisibleEmpl(false)}
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
												<div
													className="row bg-white boxContainer"
													style={{ textAlign: "center" }}
												>
													{windows.list
														.filter(
															(item) =>
																item.type == "EMPLOYEE" && item.status.code == "ACTIVE"
														)
														.map((item: WindowModel, index) => {
															return (
																<div key={index} className="col boxItem">
																	<div
																		tabIndex={index + 1}
																		key={item.code}
																		onClick={() => handleItemClick(item)}
																		className={`col clickable ${
																			activeItem === item.name
																				? "my-active-title"
																				: ""
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
																				activeItem === item.name
																					? "my-active-index"
																					: ""
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
												<div
													className="row bg-white mt-1"
													style={{ height: screenSize.height - 270 }}
												>
													{windows.list.filter(
														(item) =>
															item.type == "EMPLOYEE" && item.status.code == "ACTIVE"
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
										disabled={!selectedEmployee}
										label={t("select")}
										className="text-white wtc-bg-primary dialog-cancel-button"
										icon="ri ri-check-line"
										onClick={() => handleSelectEmployees(selectedEmployee)}
									/>
								</div>
							}
						/>
					</div>
				}
			/>
			{showQrCode == true && (
				<CreateQrCode customer={customerQrCode} value={valueQrCode} onClose={() => setShowQrCode(false)} />
			)}
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
					visible={DialogVisibleAddCustomer}
					mode={"add"}
					position={"center"}
					title={t("customer")}
					okText={t("Submit")}
					cancelText={t("action")}
					draggable={false}
					resizeable={false}
					onClose={() => closeDialog(formikCustomer)}
					footer={
						<div className=" d-flex wtc-bg-white align-items-center justify-content-end">
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
								{
									<WtcRoleButton
										tabIndex={0}
										target="USER"
										action="UPD"
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
								}
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
			</div>
		</>
	);
}
