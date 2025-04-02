import { isToday } from "date-fns";
import { format } from "date-fns-tz";
import { t } from "i18next";
import { Calendar } from "primereact/calendar";
import { InputText } from "primereact/inputtext";
import { OverlayPanel } from "primereact/overlaypanel";
import { Nullable } from "primereact/ts-helpers";
import { useEffect, useRef, useState } from "react";
import { isMobile } from "react-device-detect";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../app/hooks";
import useWindowSize from "../../../app/screen";
import { orderStatus } from "../../../app/state";
import ActionOrderDropdown from "../../../components/ActionOrderDropdown";
import DynamicDialog from "../../../components/DynamicDialog";
import HeaderList from "../../../components/HeaderList";
import LoadingIndicator from "../../../components/Loading";
import CreateQrCode from "../../../components/commons/CreateQrCode";
import WtcButton from "../../../components/commons/WtcButton";
import WtcCard from "../../../components/commons/WtcCard";
import WtcEmptyBox from "../../../components/commons/WtcEmptyBox";
import { useLocalStoreOrder } from "../../../components/order/useLocalStoreOrder";
import {
	convertToYYYYMMDD,
	formatCapitalize,
	formatHidePhoneNumber,
	formatPhoneNumberViewUI,
	StatusInitWait,
} from "../../../const";
import { CustomerModel } from "../../../models/category/Customer.model";
import { OrderModel } from "../../../models/category/Order.model";
import {
	calculatorDiscount,
	update_code,
	update_id,
	updateNewOrderState,
	updateCustomer,
	updateDraftNew,
	updateListDiscount,
	UpdateListServiceClick,
	updateStatusOrder,
	updatetempService,
} from "../../../slices/newOder.slice";
import {
	actionSearchData,
	deleteOrderSoft,
	fetchOrders,
	filterSearch,
	resetActionState,
} from "../../../slices/order.slice";
import {
	GetListPayment,
	updateCustomerPayment,
	updateOrderId,
	updateStatusPayment,
	updateStoreDiscount,
	updateTax,
	UpdateTotal,
	updateTotalService,
	updateTotalTip,
} from "../../../slices/payment.slice";
import {
	clearListPaymentRefund,
	GetListPaymentOld,
	updateStoreDiscountRefund,
	updateValueTaxRefund,
	updateValueTipRefund,
	updateValueTotalAllRefund,
	updateValuetotalAmountRefund,
} from "../../../slices/refund.slice";
import { fetchUsers } from "../../../slices/user.slice";
import { completed, failed, processing, warningWithConfirm } from "../../../utils/alert.util";
import { toFixedRefactor, toLocaleStringRefactor } from "../../../utils/string.ultil";
import WtcDropdownIconText from "../../../components/commons/WtcDropdownIconText";
export default function ListOrder() {
	const screenSize = useWindowSize();
	const fontStyle1 = { fontSize: 18, fontWeight: 700, color: "#384252", textOverflow: "clip" };
	const bodyHeight = screenSize.height;
	const [dialogVisible, setDialogVisible] = useState(false);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const orderState = useAppSelector((state) => state.order);
	const [searchString, setSearchString] = useState("");
	const [showQrCode, setShowQrcode] = useState(false);
	const [valueQrCode, setvalueQrCode] = useState("");
	const [customerQrCode, setCustomerQrCode] = useState<CustomerModel | undefined>();
	const [statusCall, setStatusCall] = useState<boolean>(false);
	const { checkInStateList, removeCheckInState } = useLocalStoreOrder();
	const [checkInStateListFilter, setCheckInStateListFilter] = useState<any[]>(checkInStateList);
	const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
	const op = useRef<any>(null);
	const [status, _setStatus] = useState("ALL");
	const [fromDate, setFromDate] = useState<Nullable<Date>>(new Date());
	const [toDate, setToDate] = useState<Nullable<Date>>(new Date());
	const [employeeSelected, _setEmployeeSelected] = useState(null);
	const myRef = useRef<HTMLDivElement>(null);
	const myRefDone = useRef<HTMLDivElement>(null);
	const [activeItemId, setActiveItemId] = useState<string | null>(null);
	const [itemOrderClick, setItemOrderClick] = useState<OrderModel | null>(null);
	const [selectedOption, setSelectedOption] = useState("TODAY");
	const ClickMoreAction = (itemId: string) => {
		setActiveItemId((prevId) => (prevId === itemId ? null : itemId));
	};
	const handleClickOutside = (e: any) => {
		if (!myRefDone.current?.contains(e.target)) {
			if (activeItemId) {
				setActiveItemId(null);
			}
		}
	};
	const handleDeleteOrder = (_id: string) => {
		if (_id) dispatch(deleteOrderSoft(_id));
	};

	const handleSearchData = () => {
		const data = {
			fromDate: convertToYYYYMMDD(fromDate?.toString() ?? ""),
			toDate: convertToYYYYMMDD(toDate?.toString() ?? ""),
		};
		dispatch(fetchOrders(data));
		dispatch(actionSearchData({ _idEmployee: employeeSelected, fromDate: fromDate, toDate: toDate }));
	};
	const handleCheckInStateListFilter = (list: any[], searchText: string) => {
		if (!searchText) return list;
		const lowerSearchText = searchText.toLowerCase();
		return list.filter((item) => {
			const customerName = `${item?.customer?.firstName || ""} ${item?.customer?.lastName || ""}`.toLowerCase();
			const employeeName = `${item?.tempService?.[0]?.Employee?.profile?.firstName || ""} ${
				item?.tempService?.[0]?.Employee?.profile?.lastName || ""
			}`.toLowerCase();
			return customerName.includes(lowerSearchText) || employeeName.includes(lowerSearchText);
		});
	};
	const menuitem = (item: OrderModel) => {
		const isGroupEmployee = item?.details.filter((detail) => detail.employee !== null).length;
		const isDrag = checkInStateList.some((i) => i._idSave == item._id);
		const transDate = item?.transDate;
		const displayDate = isToday(transDate)
			? `${t("today")} ${format(transDate, "hh:mm a", { timeZone })}`
			: format(transDate, "MM-dd-yyyy hh:mm a", { timeZone });

		return (
			<div className="menu-item-order effect-div mb-1" onClick={() => handleClickDetailsOrder(item, isDrag)}>
				<div className="row ps-2 w-100">
					<div className="col-md-9">
						<div className="col-sm-12 pt-1 pe-2">
							<div className="fs-value color-title">
								<i className="ri-edit-fill wtc-text-primary"></i>&ensp;
								{item.status.code === "PAID" ? item?.payment?.code : item.code}&ensp;
								<span className="text-danger text-nowrap fs-fullname-list">
									{item?.status.code != orderStatus.waiting &&
										toLocaleStringRefactor(toFixedRefactor(Number(item?.totalMoney), 2))}
								</span>
							</div>
						</div>
						<div className="mt-0 one-line-ellipsis my-label-in-grid fs-value" style={{ marginBottom: 1 }}>
							{isGroupEmployee > 1 ? (
								<i className="ri-group-line wtc-text-primary fs-value"></i>
							) : (
								<i className="ri-user-line  wtc-text-primary fs-value"></i>
							)}
							&ensp;
							<span className="text-color-info fs-fullname-list text-capitalize">
								{formatCapitalize(item?.details?.[0]?.employee?.profile?.firstName || "#")}{" "}
								{formatCapitalize(item?.details?.[0]?.employee?.profile?.middleName)}{" "}
								{formatCapitalize(item?.details?.[0]?.employee?.profile?.lastName || "#")}
							</span>
						</div>
						<div className="my-0 one-line-ellipsis my-label-in-grid fs-value">
							<i className="pi pi-user fs-value"></i>&ensp;
							<span className="text-color-info fs-fullname-list text-capitalize">
								{formatCapitalize(item?.customer?.firstName)}{" "}
								{formatCapitalize(item?.customer?.lastName)}
							</span>{" "}
							-{" "}
							<span className="fs-value-disabled text-color-info">
								{formatHidePhoneNumber(item?.customer?.phone)}
							</span>
						</div>

						<div className="my-0 one-line-ellipsis my-label-in-grid fs-value pb-1">
							<i className="pi pi-clock fs-value "></i>&ensp;
							<span className="fs-value-disabled text-color-info">
								{displayDate}&ensp;
								{isDrag && <span className="text-danger px-1 draft-style">{t("draft")}</span>}
							</span>
						</div>
					</div>
					<div className="col-md-3 pe-1 right-content" style={{ placeSelf: "center" }}>
						{item?.status.code === orderStatus.waiting ? (
							<div className="float-end mb-1">
								<nav className="navbar navbar-expand-lg navbar-light p-0">
									<div
										className={activeItemId === item?._id ? "iq-show" : ""}
										onClick={(e) => {
											e.stopPropagation();
										}}
									>
										<div
											ref={myRef}
											onClick={(e) => {
												e.stopPropagation();
												ClickMoreAction(item?._id);
											}}
										>
											<WtcButton
												label={""}
												icon="ri-more-2-fill"
												width={45}
												borderRadius={10}
												height={30}
												fontSize={16}
												className="text-white wtc-bg-primary mt-more-action"
												onClick={() => {}}
											/>
										</div>
										{activeItemId === item?._id && (
											<ActionOrderDropdown
												item={item}
												status={StatusInitWait()}
												isProfile={true}
												callback={() => setActiveItemId(null)}
												CheckinId={item?.checkIn._id}
												OrderDetailId={undefined}
												handleClickService={() => handleClickService(item)}
											/>
										)}
									</div>
								</nav>
							</div>
						) : (
							<div className="d-flex w-100 justify-content-end pt-1"></div>
						)}
						{item?.status.code == orderStatus.done ? (
							<div className="d-flex w-100 justify-content-end">
								<nav className="navbar navbar-expand-lg navbar-light p-0">
									<div
										className={activeItemId === item?._id ? "iq-show" : ""}
										onClick={(e) => {
											e.stopPropagation();
										}}
									>
										<div
											ref={myRefDone}
											onClick={(e) => {
												e.stopPropagation();
												ClickMoreAction(item?._id);
											}}
										>
											<WtcButton
												label={""}
												icon="ri-more-2-fill "
												width={45}
												borderRadius={10}
												height={30}
												fontSize={16}
												className="text-white wtc-bg-primary mt-more-action mb-1"
												onClick={() => {}}
											/>
										</div>
										{activeItemId == item?._id && (
											<nav className="navbar navbar-expand-lg navbar-light p-0">
												<div
													className="iq-sub-dropdown px-1"
													style={{
														width: 200,
														right: -4,
														backgroundColor: "rgb(218, 223, 242)",
													}}
												>
													<div className="iq-card shadow-none m-0">
														<div className="iq-card-body pb-2 pt-1 px-0 pl-1 ">
															<div className="me-1 mb-1">
																<WtcButton
																	label={t("payment")}
																	className="text-white wtc-bg-primary border-text-primary d-inline float-inline-end w-100 mb-1"
																	icon="pi pi-dollar "
																	fontSize={14}
																	labelStyle={{ fontWeight: "bold" }}
																	borderRadius={11}
																	height={35}
																	onClick={() => handleClickGoToPayment(item)}
																/>
																<WtcButton
																	label={t("action.delete")}
																	className="text-white wtc-bg-primary border-text-primary d-inline float-inline-end w-100 mb-1"
																	icon="ri-delete-bin-line"
																	fontSize={14}
																	borderRadius={11}
																	height={35}
																	onClick={() => {
																		warningWithConfirm({
																			title: t("do_you_delete"),
																			text: "",
																			confirmButtonText: t("Delete"),
																			confirm: () => {
																				handleDeleteOrder(item._id);
																			},
																		});
																	}}
																/>
															</div>
														</div>
													</div>
												</div>
											</nav>
										)}
									</div>
								</nav>
							</div>
						) : (
							item?.status.code != orderStatus.waiting &&
							item?.status.code != orderStatus.paid && (
								<div
									className="col-md-12 pe-0"
									onClick={(e) => {
										e.stopPropagation();
										warningWithConfirm({
											title: t("do_you_delete"),
											text: "",
											confirmButtonText: t("Delete"),
											confirm: () => {
												handleDeleteOrder(item._id);
											},
										});
									}}
								>
									<WtcButton
										label={""}
										className="bg-blue text-white mb-1"
										icon="ri-delete-bin-line"
										fontSize={14}
										labelStyle={{ fontWeight: "bold" }}
										borderRadius={10}
										height={30}
										width={45}
										onClick={() => {}}
									/>
								</div>
							)
						)}
						{item?.status.code == orderStatus.paid && (
							<div className="d-flex w-100 justify-content-end">
								<nav className="navbar navbar-expand-lg navbar-light p-0">
									<div
										className={activeItemId === item?._id ? "iq-show" : ""}
										onClick={(e) => {
											e.stopPropagation();
										}}
									>
										<div
											ref={myRefDone}
											onClick={(e) => {
												e.stopPropagation();
												ClickMoreAction(item?._id);
											}}
										>
											<WtcButton
												label={""}
												icon="ri-more-2-fill "
												width={45}
												borderRadius={10}
												height={30}
												fontSize={16}
												className="text-white wtc-bg-primary mt-more-action mb-1"
												onClick={() => {}}
											/>
										</div>
										{activeItemId == item?._id && (
											<nav className="navbar navbar-expand-lg navbar-light p-0">
												<div
													className="iq-sub-dropdown px-1"
													style={{
														width: 200,
														right: -4,
														backgroundColor: "rgb(218, 223, 242)",
													}}
												>
													<div className="iq-card shadow-none m-0">
														<div className="iq-card-body pb-2 pt-1 px-0 pl-1 ">
															<div className="me-1 mb-1">
																<div
																	onClick={(e) => {
																		e.stopPropagation();
																		handleClickDetailsOrder(item, false, true);
																	}}
																>
																	<WtcButton
																		label={t("refund")}
																		className="bg-blue text-white mb-1 w-100"
																		icon="ri-refund-fill"
																		fontSize={14}
																		labelStyle={{ fontWeight: "bold" }}
																		borderRadius={10}
																		height={30}
																		width={45}
																		onClick={() => {}}
																	/>
																</div>
																<WtcButton
																	label={t("action.delete")}
																	className="text-white wtc-bg-primary border-text-primary d-inline float-inline-end w-100 mb-1"
																	icon="ri-delete-bin-line"
																	fontSize={14}
																	borderRadius={11}
																	height={35}
																	onClick={() => {
																		warningWithConfirm({
																			title: t("do_you_delete"),
																			text: "",
																			confirmButtonText: t("Delete"),
																			confirm: () => {
																				handleDeleteOrder(item._id);
																			},
																		});
																	}}
																/>
															</div>
														</div>
													</div>
												</div>
											</nav>
										)}
									</div>
								</nav>
							</div>
						)}
						{
							<div
								onClick={(e) => {
									{
										e.stopPropagation();
										handleClickCreateQrCode(item?.code, item?.customer);
									}
								}}
							>
								<WtcButton
									label={""}
									className="wtc-bg-yellow text-white mb-1"
									icon="ri-qr-code-line"
									fontSize={14}
									borderRadius={10}
									height={30}
									width={45}
									onClick={() => {}}
								/>
							</div>
						}
					</div>
				</div>
			</div>
		);
	};
	const menuitemDrag = (item: any) => {
		const isGroupEmployee = item?.tempService.filter((detail: any) => detail.employee !== null).length;
		return (
			<div className="menu-item-order effect-div mb-1" onClick={() => handleClickDetailOrderDrag(item)}>
				<div className="row ps-2 w-100">
					<div className="col-md-9">
						<div className="col-sm-12 pt-1 pe-2">
							<div className="fs-value color-title">
								<i className="ri-edit-fill wtc-text-primary"></i>&ensp;{"#"}&ensp;
								<span className="text-danger text-nowrap fs-fullname-list">
									$ {toLocaleStringRefactor(toFixedRefactor(Number(item?.totalAll), 2))}
								</span>
							</div>
						</div>
						<div className="mt-0 one-line-ellipsis my-label-in-grid fs-value" style={{ marginBottom: 1 }}>
							{isGroupEmployee > 1 ? (
								<i className="ri-group-line wtc-text-primary"></i>
							) : (
								<i className="ri-user-line  wtc-text-primary"></i>
							)}
							&ensp;
							<span className="text-color-info fs-fullname-list text-capitalize">
								{formatCapitalize(item?.tempService?.[0]?.Employee?.profile?.firstName || "#")}{" "}
								{formatCapitalize(item?.tempService?.[0]?.Employee?.profile?.middleName)}{" "}
								{formatCapitalize(item?.tempService?.[0]?.Employee?.profile?.lastName || "#")}
							</span>
						</div>
						<div className="my-0 one-line-ellipsis my-label-in-grid fs-value">
							<i className="pi pi-user fs-value"></i>&ensp;
							<span className="text-color-info fs-fullname-list text-capitalize">
								{formatCapitalize(item?.customer?.firstName)}{" "}
								{formatCapitalize(item?.customer?.lastName)}
							</span>{" "}
							-{" "}
							<span className="fs-value-disabled text-color-info">
								{formatHidePhoneNumber(item?.customer?.phone)}
							</span>
						</div>
						<div className="my-0 one-line-ellipsis my-label-in-grid fs-value pb-1">
							<i className="pi pi-clock fs-value "></i>&ensp;
							<span className="fs-fullname-list text-color-info">
								{t("today")}&ensp;
								{<span className="text-danger px-1 draft-style">{t("draft")}</span>}
							</span>
						</div>
					</div>
					<div className="col-md-3" style={{ alignSelf: "center" }}>
						<div
							className="d-flex w-100 justify-content-end"
							onClick={(e) => {
								e.stopPropagation();
								warningWithConfirm({
									title: t("do_you_delete"),
									text: "",
									confirmButtonText: t("Delete"),
									confirm: () => {
										handleDeleteDraft(item._idSave);
									},
								});
							}}
						>
							<WtcButton
								label={""}
								className="bg-blue text-white mb-1"
								icon="ri-delete-bin-line"
								fontSize={14}
								labelStyle={{ fontWeight: "bold" }}
								borderRadius={10}
								height={30}
								width={45}
								onClick={() => {}}
							/>
						</div>
					</div>
				</div>
			</div>
		);
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
	const handleDeleteDraft = (id: string) => {
		removeCheckInState(id);
	};
	const handleClickService = (i: OrderModel) => {
		setItemOrderClick(i);
		setDialogVisible(true);
		setActiveItemId(null);
	};
	const handleClickDetailOrderDrag = (data: any) => {
		dispatch(updateNewOrderState(data));
		dispatch(updateDraftNew(true));
		dispatch(update_code(undefined));
		navigate("/order");
	};
	const handleClickDetailsOrder = async (item: OrderModel, isExistsDrag: boolean, refund?: boolean) => {
		if (isExistsDrag) {
			const data = checkInStateList.find((i) => i._idSave == item._id);
			dispatch(updateNewOrderState(data));
			dispatch(updateDraftNew(true));
			navigate("/order");
		} else {
			dispatch(updateStoreDiscount(item?.storeDiscount || 0));
			dispatch(UpdateListServiceClick(undefined));
			if (item?.checkInId == null || !(item?.status.code == orderStatus.waiting))
				dispatch(updatetempService(convertData(item)));
			if (item?.attributes?.ListDiscount) {
				dispatch(updateListDiscount(item?.attributes.ListDiscount));
				dispatch(calculatorDiscount(item?.attributes.ListDiscount));
			}
			dispatch(updateCustomer(item?.customer));
			dispatch(update_id(item?._id));
			dispatch(update_code(item?.code));
			dispatch(updateOrderId(item?._id));
			dispatch(updateStatusOrder(item.status));
			if (item?.status.code == orderStatus.paid) {
				dispatch(UpdateTotal(item?.totalMoney));
				dispatch(updateTax(item?.totalTax));
				dispatch(updateTotalTip(item?.totalTip));
				dispatch(updateTotalService(item?.totalMoney - item?.totalTax + item.totalDiscount - item.totalTip));
				dispatch(updateStatusOrder({ code: orderStatus.paid, value: orderStatus.paid }));
				dispatch(updateStatusPayment({ code: orderStatus.paid, value: orderStatus.paid }));
				dispatch(updateCustomerPayment(item?.customer));
				if (refund) {
					dispatch(clearListPaymentRefund());
					dispatch(
						updateValuetotalAmountRefund(
							item?.totalMoney - item?.totalTax + item.totalDiscount - item.totalTip
						)
					);
					dispatch(updateValueTaxRefund(item.totalTax));
					dispatch(updateValueTotalAllRefund(item.totalMoney));
					dispatch(updateValueTipRefund(item.totalTip));
					dispatch(updateStoreDiscountRefund(item.storeDiscount));
					dispatch(GetListPaymentOld(item?._id));
					navigate("/refund");
				} else {
					dispatch(GetListPayment(item?._id));
					navigate("/payment");
				}
			} else {
				navigate("/order");
			}
		}
	};
	const handleClickGoToPayment = async (item: OrderModel) => {
		dispatch(updateStoreDiscount(item?.storeDiscount || 0));
		dispatch(UpdateListServiceClick(undefined));
		if (item?.checkInId == null || !(item?.status.code == orderStatus.waiting))
			dispatch(updatetempService(convertData(item)));
		if (item?.attributes?.ListDiscount) {
			dispatch(updateListDiscount(item?.attributes.ListDiscount));
			dispatch(calculatorDiscount(item?.attributes.ListDiscount));
		}
		dispatch(updateCustomer(item?.customer));
		dispatch(update_id(item?._id));
		dispatch(update_code(item?.code));
		dispatch(updateOrderId(item?._id));
		dispatch(updateStatusOrder(item.status));
		dispatch(UpdateTotal(item?.totalMoney));
		dispatch(updateTax(item?.totalTax));
		dispatch(updateTotalTip(item?.totalTip));
		dispatch(updateTotalService(item?.totalMoney - item?.totalTax + item.totalDiscount - item.totalTip));
		dispatch(updateStatusOrder({ code: item.status.code, value: item.status.code }));
		dispatch(updateStatusPayment({ code: item.status.code, value: item.status.code }));
		dispatch(updateCustomerPayment(item?.customer));
		dispatch(GetListPayment(item?._id));
		navigate("/payment");
	};
	const handleClickCreateQrCode = (value: string, Cus: CustomerModel | undefined) => {
		setvalueQrCode(value);
		setCustomerQrCode(Cus);
		setShowQrcode(true);
	};
	const onClickFilterStatus = (e: any) => {
		if (op.current) {
			op.current.toggle(e);
		}
	};
	const convertData = (input: OrderModel) => {
		if (input == undefined) return undefined;
		else {
			const convertedData = input.details
				.filter((item) => item?.attributes.isCheckIn != true)
				.map((detail) => ({
					Employee: detail.employee || undefined,
					checkInId: input.checkInId,
					ListService: detail?.attributes.isCheckIn != true ? detail?.attributes?.services || [] : [],
					ListGiftCard: detail?.attributes.giftcards ? detail?.attributes?.giftcards || [] : [],
					code: input.code,
					tip: detail.attributes.tip,
					discount: detail.attributes.discount,
					status: detail.status,
					OrderDetailId: detail._id,
					_id: detail._id,
				}));
			return convertedData;
		}
	};
	const fetchListLocal = () => {
		const data = {
			fromDate: convertToYYYYMMDD(fromDate?.toString() ?? ""),
			toDate: convertToYYYYMMDD(toDate?.toString() ?? ""),
		};
		dispatch(fetchOrders(data));
		dispatch(filterSearch({ searchString: searchString, status: status }));
	};

	useEffect(() => {
		dispatch(filterSearch({ searchString: searchString, status: status }));
	}, [status]);

	useEffect(() => {
		if (orderState.actionState) {
			switch (orderState.actionState.status!) {
				case "completed":
					completed();
					dispatch(resetActionState());
					fetchListLocal();
					break;
				case "loading":
					processing();
					break;
				case "failed":
					failed(t(orderState.actionState.error!));
					dispatch(resetActionState());
					break;
			}
		}
	}, [orderState.actionState]);
	useEffect(() => {
		document.addEventListener("click", handleClickOutside);
		return () => document.removeEventListener("click", handleClickOutside);
	});
	useEffect(() => {
		const waiting = async () => {
			{
				const data = {
					fromDate: convertToYYYYMMDD(fromDate?.toString() ?? ""),
					toDate: convertToYYYYMMDD(toDate?.toString() ?? ""),
				};
				dispatch(fetchOrders(data));
				dispatch(fetchUsers());
				dispatch(filterSearch({ searchString: "", status: "ALL" }));
			}
			setStatusCall(true);
		};
		waiting();
	}, []);
	useEffect(() => {
		const newFilteredList = handleCheckInStateListFilter(checkInStateList, searchString);
		setCheckInStateListFilter(newFilteredList);
	}, [searchString, checkInStateList]);
	return (
		<div className="wtc-bg-white rounded-4 h-100 position-relative">
			<div className="row h-100 p-1">
				<div className="col-sm-12 h-100 p-2 pt-1">
					<div className="font-title-card wtc-bg-title rounded-4 d-flex align-items-center w-100 mb-1">
						<div className="flex-grow-1 mx-1" style={{ maxHeight: 55 }}>
							<HeaderList
								isTurn
								callback={fetchListLocal}
								hideAdd
								target="ORDER"
								onSearchText={(text) => {
									setSearchString(text);
									dispatch(filterSearch({ searchString: text, status: status }));
								}}
								onAddNew={() => {}}
								isFilterStatus={true}
								onClickFilterStatus={(e) => onClickFilterStatus(e)}
								isNewOrder={true}
							/>
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
						</div>
					</div>
					<div className="px-0 mx-0 w-100 " style={{ height: bodyHeight == 0 ? 534 : bodyHeight - 168 }}>
						<div className="row h-100 px-1">
							<div className="col-md-3 mt-1 h-100 px-1">
								<WtcCard
									classNameBody="flex-grow-1 px-2 pb-0 my-0"
									title={
										<div className="one-line-ellipsis fs-title color-title mb-1">
											<i className="ri-add-line text-blue fs-title" /> {t("status_waiting")}{" "}
										</div>
									}
									hideBorder
									borderRadius={12}
									background="#eef1f9"
									className="h-100 border-list-order"
									body={
										orderState.fetchState.status == "loading" || statusCall == false ? (
											<LoadingIndicator />
										) : (
											<div className="row">
												{orderState.filtered.filter(
													(item) => item?.status.code === orderStatus.waiting
												).length === 0 ? (
													<div
														className="w-100 d-flex flex-column justify-content-center"
														style={{
															height: bodyHeight == 0 ? 478 : bodyHeight - 224,
														}}
													>
														<WtcEmptyBox />
													</div>
												) : (
													orderState.filtered
														.filter((item) => item?.status.code === orderStatus.waiting)
														.map((item) => (
															<div
																key={"store-" + item?._id}
																className="col-sm-12 px-0 pb-0"
																style={{ paddingTop: "2px" }}
															>
																{menuitem(item)}
															</div>
														))
												)}
											</div>
										)
									}
								/>
							</div>
							<div className="col-md-3 mt-1 h-100 px-1">
								<WtcCard
									classNameBody="flex-grow-1 px-2 pb-0
									 my-0"
									title={
										<div className="one-line-ellipsis fs-title color-title mb-1">
											<i className="ri-loader-2-line text-blue fs-title" />{" "}
											{t("status_processing")}{" "}
										</div>
									}
									hideBorder
									background="#eef1f9"
									borderRadius={12}
									className="h-100 border-list-order"
									body={
										orderState.fetchState.status == "loading" || statusCall == false ? (
											<LoadingIndicator />
										) : (
											<div className="row">
												{orderState.filtered.filter(
													(item) => item?.status.code === orderStatus.inprocessing
												).length === 0 &&
												checkInStateList.filter((item) => item._id == "").length === 0 ? (
													<div
														className="w-100 d-flex flex-column justify-content-center"
														style={{
															height: bodyHeight == 0 ? 478 : bodyHeight - 224,
														}}
													>
														<WtcEmptyBox />
													</div>
												) : (
													<>
														{orderState.filtered
															.filter(
																(item) => item?.status.code === orderStatus.inprocessing
															)
															.map((item) => (
																<div
																	key={"store-" + item?._id}
																	className="col-sm-12 px-0 pb-0"
																	style={{ paddingTop: "2px" }}
																>
																	{menuitem(item)}
																</div>
															))}
														{checkInStateListFilter
															.filter((i) => !i.code || i.code == "")
															.map((item) => (
																<div
																	key={"store-" + item?._idSave}
																	className="col-sm-12 px-0 pb-0"
																	style={{ paddingTop: "2px" }}
																>
																	{menuitemDrag(item)}
																</div>
															))}
													</>
												)}
											</div>
										)
									}
								/>
							</div>
							<div className="col-md-3 mt-1 h-100 px-1">
								<WtcCard
									classNameBody="flex-grow-1 px-2 pb-0 my-0"
									title={
										<div className="one-line-ellipsis fs-title color-title mb-1">
											<i className="ri-check-line text-blue fs-title" /> {t("status_done")}{" "}
										</div>
									}
									hideBorder
									borderRadius={12}
									className="h-100 border-list-order"
									background="#eef1f9"
									body={
										orderState.fetchState.status == "loading" || statusCall == false ? (
											<LoadingIndicator />
										) : (
											<div className="row">
												{orderState.filtered.filter(
													(item) => item?.status.code === orderStatus.done
												).length === 0 ? (
													<div
														className="w-100 d-flex flex-column justify-content-center"
														style={{
															height: bodyHeight == 0 ? 478 : bodyHeight - 224,
														}}
													>
														<WtcEmptyBox />
													</div>
												) : (
													orderState.filtered
														.filter((item) => item?.status.code === orderStatus.done)
														.map((item) => (
															<div
																key={"store-" + item?._id}
																className="col-sm-12 px-0 pb-0"
																style={{ paddingTop: "2px" }}
															>
																{menuitem(item)}
															</div>
														))
												)}
											</div>
										)
									}
								/>
							</div>
							<div className="col-md-3 mt-1 h-100 px-1">
								<WtcCard
									classNameBody="flex-grow-1 px-2 pb-0 my-0"
									title={
										<div className="one-line-ellipsis fs-title color-title mb-1">
											<i className="pi pi-dollar text-blue fw-bold fs-title"></i>{" "}
											{t("status_paid")}{" "}
										</div>
									}
									hideBorder
									borderRadius={12}
									className="h-100 border-list-order"
									background="#eef1f9"
									body={
										orderState.fetchState.status == "loading" || statusCall == false ? (
											<LoadingIndicator />
										) : (
											<div className="row">
												{orderState.filtered.filter(
													(item) => item?.status.code === orderStatus.paid
												).length === 0 ? (
													<div
														className="w-100 d-flex flex-column justify-content-center"
														style={{
															height: bodyHeight == 0 ? 478 : bodyHeight - 224,
														}}
													>
														<WtcEmptyBox />
													</div>
												) : (
													orderState.filtered
														.filter((item) => item?.status.code === orderStatus.paid)
														.map((item) => (
															<div
																key={"store-" + item?._id}
																className="col-sm-12 px-0 pb-0"
																style={{ paddingTop: "2px" }}
															>
																{menuitem(item)}
															</div>
														))
												)}
											</div>
										)
									}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
			{showQrCode == true && (
				<CreateQrCode customer={customerQrCode} value={valueQrCode} onClose={() => setShowQrcode(false)} />
			)}
			<DynamicDialog
				width={isMobile ? "90vw" : "45vw"}
				minHeight={"85vh"}
				visible={dialogVisible}
				mode={"view"}
				position={"center"}
				title={t("order") + "  " + itemOrderClick?.code || ""}
				okText=""
				cancelText="Hủy"
				draggable={false}
				isBackgroundGray={true}
				resizeable={false}
				onClose={() => setDialogVisible(false)}
				body={
					<div className="bg-white p-0 px-1" style={{ height: bodyHeight - 220, overflow: "hidden" }}>
						<div className="row">
							<div className="col-md-8 pe-1">
								<WtcCard
									className="h-100"
									borderRadius={12}
									classNameBody="flex-grow-1 px-1 h-100"
									body={
										<div
											className="row bg-white"
											style={{ maxHeight: (screenSize.height - 200) / 2 }}
										>
											{itemOrderClick &&
												itemOrderClick?.checkIn?.details.map((item: any) => {
													return (
														<>
															<div
																className={`menu-item-order my-1 mt-1 d-flex flex-column align-propss-center justify-content-start`}
																style={{ cursor: "pointer", borderRadius: "12px" }}
															>
																<div className="d-flex align-propss-center p-0 pt-0 px-2 justify-content-start w-100">
																	<span style={fontStyle1}>
																		&ensp;
																		<span className="fs-name-empl fw-normal">
																			{t("staff")}{" "}
																		</span>
																		<span className="text-uppercase fs-value">
																			###
																		</span>
																		&ensp;
																	</span>
																</div>
																<div className="row w-100 m-0 p-0 mb-1">
																	{item?.attributes?.services.map(
																		(serviceprops: any, index: number) => (
																			<div
																				className={`col-sm-12 w-100 margin-bottom-1`}
																				key={index}
																			>
																				<div
																					style={{
																						borderRadius: 11,
																						height: 33,
																						border: "1px solid transparent",
																					}}
																				>
																					<div
																						className={`d-flex w-100 h-100 index-key`}
																						style={{
																							background:
																								"rgb(238, 241, 250)",
																							borderRadius: 11,
																							height: "100%",
																							border: "1px solid #F1F3F6",
																						}}
																					>
																						<div
																							className="ms-0 h-100 flex-grow-1"
																							style={{
																								overflow: "hidden",
																								whiteSpace: "nowrap",
																								textOverflow:
																									"ellipsis",
																							}}
																						>
																							<div className="d-flex">
																								<div className="p-1 flex-grow-1 my-label-in-grid">
																									{
																										serviceprops.displayName
																									}
																								</div>
																							</div>
																						</div>
																					</div>
																				</div>
																			</div>
																		)
																	)}
																</div>
															</div>
														</>
													);
												})}
										</div>
									}
									hideBorder={true}
								/>
							</div>
							<div className="col-md-4 ps-0 p-2">
								<WtcCard
									className="h-100"
									borderRadius={12}
									classNameBody="flex-grow-1 px-1 h-100"
									background="#EEF1F9"
									title={
										<>
											<i className="pi pi-user"></i> {t("customer")}
										</>
									}
									body={
										<div className="row" style={{ height: screenSize.height - 220 }}>
											<div className="d-flex flex-column align-items-start">
												<div
													className="flex ms-0 mt-2 gap-2 px-2 w-100"
													style={{ borderRadius: 12, backgroundColor: "#e5e8f3" }}
												>
													<div>
														<label
															htmlFor="inputtext"
															style={{ color: "#5B6B86" }}
															className="fs-value"
														>
															{t("name_cus")}
														</label>
													</div>
													<InputText
														id="inputtext"
														className={` fs-fullname-list icon-text pt-0 ps-0 p-inputtext-no-border`}
														placeholder={
															itemOrderClick?.customer.firstName ||
															"" + itemOrderClick?.customer.lastName ||
															""
														}
														value={
															itemOrderClick?.customer.firstName +
															" " +
															itemOrderClick?.customer.lastName
														}
														disabled={true}
														style={{
															width: "100%",
															height: 35,
															backgroundColor: "#e5e8f3",
														}}
													/>
												</div>
												<div
													className="flex mt-2 ms-0 gap-2 px-2 w-100"
													style={{ borderRadius: 12, backgroundColor: "#e5e8f3" }}
												>
													<div>
														<label
															htmlFor="inputtext"
															style={{ color: "#5B6B86" }}
															className="fs-value"
														>
															{t("phone_cus")}
														</label>
													</div>
													<InputText
														id="inputtext"
														className={`fs-fullname-list icon-text pt-0 ps-0 p-inputtext-no-border`}
														placeholder={
															itemOrderClick?.customer.firstName ||
															"" + itemOrderClick?.customer.lastName ||
															""
														}
														value={
															formatPhoneNumberViewUI(
																itemOrderClick?.customer.phone || "#"
															) || "#"
														}
														disabled={true}
														style={{
															width: "100%",
															height: 35,
															backgroundColor: "#e5e8f3",
														}}
													/>
												</div>
												<div
													className="flex mt-2 ms-0 gap-2 px-2 w-100"
													style={{ borderRadius: 12, backgroundColor: "#e5e8f3" }}
												>
													<div>
														<label
															htmlFor="inputtext"
															style={{ color: "#5B6B86" }}
															className="fs-value"
														>
															{t("address")}
														</label>
													</div>
													<InputText
														id="inputtext"
														className={`fs-fullname-list icon-text pt-0 ps-0 p-inputtext-no-border`}
														placeholder={
															itemOrderClick?.customer.firstName ||
															"" + itemOrderClick?.customer.lastName ||
															""
														}
														value={itemOrderClick?.customer.address || "#"}
														disabled={true}
														style={{
															width: "100%",
															height: 35,
															backgroundColor: "#e5e8f3",
														}}
													/>
												</div>
												<div
													className="flex mt-2 ms-0 gap-2 px-2 w-100"
													style={{ borderRadius: 12, backgroundColor: "#e5e8f3" }}
												>
													<div>
														<label
															htmlFor="inputtext"
															style={{ color: "#5B6B86" }}
															className="fs-value"
														>
															{t("time_create")}
														</label>
													</div>
													<InputText
														id="inputtext"
														className={`fs-fullname-list icon-text pt-0 ps-0 p-inputtext-no-border`}
														placeholder={
															itemOrderClick?.customer.firstName ||
															"" + itemOrderClick?.customer.lastName ||
															""
														}
														value={
															(itemOrderClick?.transDate &&
																format(itemOrderClick?.transDate || "", "hh:mm a", {
																	timeZone,
																})) ||
															undefined
														}
														disabled={true}
														style={{
															width: "100%",
															height: 35,
															backgroundColor: "#e5e8f3",
														}}
													/>
												</div>
											</div>
										</div>
									}
									hideBorder={true}
								/>
							</div>
						</div>
					</div>
				}
				closeIcon
				footer={
					<div className=" d-flex wtc-bg-white align-items-center justify-content-end">
						<WtcButton
							tabIndex={0}
							height={35}
							borderRadius={8}
							label={t("Cancel")}
							icon="ri-close-line"
							className="bg-white text-blue me-2"
							borderColor="#283673"
							fontSize={16}
							onClick={() => setDialogVisible(false)}
							onKeyDown={(e) => {
								if (e.key === "Enter") {
								}
							}}
						/>
						<WtcButton
							label={t("action.delete")}
							className="bg-danger text-white me-2"
							icon="ri-delete-bin-line"
							fontSize={18}
							borderRadius={8}
							height={35}
						/>
					</div>
				}
			/>
			{/* <div className="position-absolute order-absolute ">
				<IconButton
					tabIndex={1}
					icon={"ri-save-line"}
					onClick={handleClickRestoreOrder}
					actived={false}
					className="custom-primary-button "
					height={48}
					width={48}
				/>
			</div> */}
		</div>
	);
}
