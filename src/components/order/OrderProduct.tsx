import { t } from "i18next";
import _ from "lodash";
import { Button } from "primereact/button";
import { useEffect, useRef, useState } from "react";
import { isMobile } from "react-device-detect";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import useWindowSize from "../../app/screen";
import emptyImage from "../../assets/images/empty/empty_box_1.svg";
import {
	ActionButtonOrder,
	ActionOrder,
	FormatMoneyToNumber,
	PageTarget,
	Status,
	StatusValueOrder,
	getCurrentFormattedDate,
} from "../../const";
import { ListServiceSelectedModel } from "../../models/category/ListServiceSelected.model";
import { ServiceModel } from "../../models/category/Service.model";
import {
	AddOrder,
	EditOrder,
	UpdateListServiceClick,
	calculatorDiscount,
	clearState,
	deleteEmployee,
	deleteListServiceInArray,
	initOrder,
	resetActionState,
	resetUpdateState,
	updateActionOrder,
	updateDraftNew,
	updateIsEdit,
	updateItem,
	updateItemEdit,
	updateListService,
	updateListServiceEdit,
	updateSaveDrag,
	updateStatusOrder,
	updateValueTax,
	updateValueTip,
	updateValuetotalAll,
	updateValuetotalAmount,
} from "../../slices/newOder.slice";
import {
	GetListPayment,
	UpdateTotal,
	updateCustomerPayment,
	updateOrderId,
	updateStoreDiscount,
	updateTax,
	updateTotalService,
	updateTotalTip,
} from "../../slices/payment.slice";
import { EditServiceSelect, removeSelectedService, updateQuantity } from "../../slices/service.slice";
import { completed, failed, processing, questionWithConfirm, warningWithConfirm } from "../../utils/alert.util";
import { toFixedRefactor, toLocaleStringRefactor } from "../../utils/string.ultil";
import DynamicDialog from "../DynamicDialog";
import EmptyBox from "../commons/EmptyBox";
import SelectedServiceEmployee from "../commons/SelectedServiceEmployee";
import WtcButton from "../commons/WtcButton";
import WtcCard from "../commons/WtcCard";
import OrderItem from "./OrderItem";
import { useLocalStoreOrder } from "./useLocalStoreOrder";
import WtcRoleButton from "../commons/WtcRoleButton";
export default function OrderProduct() {
	const screenSize = useWindowSize();
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const bodyHeight = screenSize.height;
	const serviceState = useAppSelector((state) => state.service);
	const newOderState = useAppSelector((state) => state.newOder);
	const storeConfigState = useAppSelector((state) => state.storeconfig);
	const [CountService, setCountService] = useState(0);
	const [selected, setSelected] = useState<ListServiceSelectedModel[]>([]);
	const [totalTax, setTotalTax] = useState(0);
	const [products, setProducts] = useState<ServiceModel[]>(serviceState.selectedService);
	const [totalAmount, setTotalAmount] = useState<number>(0);
	const [totalTip, setTotalTip] = useState<number>(0);
	const actionMode = newOderState?.code == undefined ? "add" : "edit";
	const [dialogVisibleService, setDialogVisibleService] = useState(false);
	const [processDeleteSuccess, setProcessDeleteSuccess] = useState(false);
	const [keyboard, setKeyboard] = useState("");
	const [modifyMode, setModifyMode] = useState<"quantity" | "discount" | "price" | "">("price");
	const [ServiceClick, setServiceClick] = useState<ServiceModel>();
	const [checkInOld, setCheckInOld] = useState<ListServiceSelectedModel[]>();
	const [CustomerOld, setCustomerOld] = useState<string>("");
	const [storeDiscountOld, setStoreDiscountOld] = useState<number>(0);
	const [isDiscountFirst, setIsDiscountFirst] = useState<boolean>(true);
	const isDisabled =
		_.isEqual(newOderState.tempService, checkInOld) && _.isEqual(newOderState.storeDiscount, storeDiscountOld);
	const isDisabledCus = _.isEqual(newOderState.customer?._id, CustomerOld);
	const isExistsStatusNotDone = newOderState.tempService.some(
		(item) => (item?.status?.code !== "DONE" && item?.ListService?.length) || 0 > 0
	);
	const { addCheckInState, removeCheckInState } = useLocalStoreOrder();
	const handleAddLocalStore = () => {
		const newCheckInState = newOderState;
		addCheckInState(newCheckInState);
	};
	const [detailDelete, setDetailDelete] = useState<any[]>([]);
	const handleAddDetail = (newDetail: any) => {
		setDetailDelete((prevDetails) => [...prevDetails, newDetail]);
	};
	const getTaxRate = (data: any): number => {
		const taxRateInfo = data.find((item: any) => item.key === "taxRate");
		return taxRateInfo ? Number(taxRateInfo.value) : 0;
	};
	const getTipRate = (data: any): number => {
		const tipRateInfo = data.find((item: any) => item.key === "tipOnCreditCard");
		return tipRateInfo ? Number(tipRateInfo.value) : 0;
	};
	const ref = useRef<any>(null);
	const [height, setHeight] = useState(0);
	const menuItemService = (item: any) => {
		return (
			<div className="my-1">
				<OrderItem
					data={item}
					index={1}
					updateData={updateData}
					onClickRemove={() => {
						dispatch(removeSelectedService(item));
						setDialogVisibleService(false);
					}}
				/>
			</div>
		);
	};
	const calculateTotalTax = async (): Promise<number> => {
		const taxRate = getTaxRate(storeConfigState.list);
		const totalTax = selected.reduce((totalTax, order) => {
			const serviceTax = order.ListService
				? order.ListService
						// @ts-ignore
						.filter((service) => service.tax === true || service.tax === "YES")
						.reduce((acc, service) => acc + service.storePrice * service.unit * (taxRate / 100), 0)
				: 0;
			return totalTax + serviceTax;
		}, 0);

		const roundedTotalTax = Math.round(totalTax * 100) / 100;
		return roundedTotalTax;
	};

	const handleClickAdd = () => {
		if (ServiceClick) dispatch(EditServiceSelect(ServiceClick));
		setDialogVisibleService(false);
	};
	const handleKeyboardAction = (key: string) => {
		setKeyboard(key);
	};
	const changeModifyMode = (mode: "quantity" | "discount" | "price" | "") => {
		setModifyMode(mode);
	};
	const updateData = (newData: ServiceModel) => {
		setServiceClick(newData);
	};
	const handleSubmitOrder = () => {
		const taxRate = getTaxRate(storeConfigState.list);
		const tipRate = getTipRate(storeConfigState.list);

		if (newOderState?.customer == undefined) {
			failed(t("order_selectedcustomer"));
		} else {
			const newItem = {
				customerId: newOderState.customer?._id,
				totalMoney: FormatMoneyToNumber(
					totalAmount + totalTip + totalTax - (newOderState.storeDiscount + calculateTotalDiscount())
				),
				totalTax: FormatMoneyToNumber(totalTax),
				totalTip: FormatMoneyToNumber(totalTip),
				totalDiscount: FormatMoneyToNumber(calculateTotalDiscount() + newOderState.storeDiscount),
				transDate: actionMode === "add" ? getCurrentFormattedDate() : undefined,
				storeDiscount: FormatMoneyToNumber(newOderState.storeDiscount),
				attributes: {
					ListDiscount: newOderState.ListDiscount,
				},
			};
			if (actionMode == "add") {
				dispatch(updateItem(newItem));
			} else {
				dispatch(updateItemEdit(newItem));
			}
			if (selected.length > 0)
				if (actionMode == "add") {
					dispatch(updateListService({ selected, taxRate, tipRate }));
				} else {
					const selected = newOderState.tempService;
					dispatch(updateListServiceEdit({ selected, taxRate, tipRate, detailDelete }));
				}
			else dispatch(updateListService({ undefined, taxRate, tipRate }));
		}
	};
	const handleSubmitOrderDelete = (calculatedTotalAmount: any, calculatedTotalTip: any, roundedTotalTax: any) => {
		const taxRate = getTaxRate(storeConfigState.list);
		const tipRate = getTipRate(storeConfigState.list);
		const totalMoney = FormatMoneyToNumber(
			calculatedTotalAmount +
				calculatedTotalTip +
				roundedTotalTax -
				(newOderState.storeDiscount + calculateTotalDiscount())
		);
		if (newOderState?.customer == undefined) {
			failed(t("order_selectedcustomer"));
		} else {
			const newItem = {
				customerId: newOderState.customer?._id,
				totalMoney: totalMoney,
				totalTax: FormatMoneyToNumber(roundedTotalTax),
				totalTip: FormatMoneyToNumber(calculatedTotalTip),
				totalDiscount: FormatMoneyToNumber(calculateTotalDiscount() + newOderState.storeDiscount),
				transDate: actionMode === "add" ? getCurrentFormattedDate() : undefined,
				storeDiscount: FormatMoneyToNumber(newOderState.storeDiscount),
				attributes: {
					ListDiscount: newOderState.ListDiscount,
				},
			};
			if (actionMode == "add") {
				dispatch(updateItem(newItem));
			} else {
				dispatch(updateItemEdit(newItem));
			}
			if (selected.length > 0)
				if (actionMode == "add") {
					dispatch(updateListService({ selected, taxRate, tipRate }));
				} else {
					const selected = newOderState.tempService;
					dispatch(updateListServiceEdit({ selected, taxRate, tipRate, detailDelete }));
					setDetailDelete([]);
				}
			else dispatch(updateListService({ undefined, taxRate, tipRate }));
		}
	};
	const calculateTotalDiscount = (): number => {
		return newOderState.tempService.reduce((total, item) => total + (item.discount || 0), 0);
	};
	const handlePaymentOrder = () => {
		if (newOderState.ListServiceClick) dispatch(UpdateListServiceClick(undefined));
		if (newOderState.tempService.some((item) => item.Employee === undefined)) {
			failed(t("order_selectedstaff"));
		} else if (newOderState.tempService.length == 0) {
			failed(t("order_selectedservice"));
		} else if (isExistsStatusNotDone) {
			failed(t("order_notdone"));
		} else if (isDisabled && isDisabledCus) {
			dispatch(updateOrderId(newOderState._id));
			const statusDone: Status = {
				code: StatusValueOrder.done,
				value: StatusValueOrder.done,
			};
			dispatch(updateStatusOrder(statusDone));
			dispatch(GetListPayment(newOderState._id));
			dispatch(updateCustomerPayment(newOderState.customer));
			dispatch(updateStoreDiscount(newOderState.storeDiscount));
			dispatch(
				UpdateTotal(totalAmount + totalTax + totalTip - (newOderState.storeDiscount + calculateTotalDiscount()))
			);
			// dispatch(createMode({}));
			navigate("/payment");
		} else {
			dispatch(updateOrderId(newOderState._id));
			// setActionButton("payment");
			handleSubmitOrder();
		}
	};
	const handleClickDoneAllTask = () => {
		questionWithConfirm({
			title: t("ques_doneAll"),
			text: "",
			confirmButtonText: t("status_doneAll"),
			confirm: () => {
				const data = {
					details: selected
						.filter((item) => item.status.code !== "DONE")
						.map((item) => ({
							action: ActionButtonOrder.done,
							payload: {
								_id: item.OrderDetailId,
								employeeId: item.Employee?._id,
							},
						})),
				};
				dispatch(
					EditOrder({
						id: newOderState._id,
						data: data,
					})
				);
			},
			close: () => {},
		});
	};
	const handleDeleteService = (_id: string) => {
		warningWithConfirm({
			title: t("do_you_delete"),
			text: "",
			confirmButtonText: t("Delete"),
			confirm: () => {
				dispatch(deleteListServiceInArray(_id));
				const itemFind = newOderState.tempService.find((item) => item._id == _id);
				if (itemFind && itemFind.OrderDetailId) {
					const detail = {
						action: ActionOrder.delete,
						payload: {
							_id: _id,
						},
					};
					setSelected(selected.filter((item) => item._id !== _id));
					handleAddDetail(detail);
					setProcessDeleteSuccess(true);
				}
			},
		});
	};
	const handleDeleteEmployee = (_id: string) => {
		warningWithConfirm({
			title: t("do_you_delete"),
			text: "",
			confirmButtonText: t("Delete"),
			confirm: () => {
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
			},
		});
	};

	const calculateTotalAmount = async () => {
		const total = newOderState.tempService.reduce((total, current) => {
			const serviceTotal = Array.isArray(current.ListService)
				? current.ListService.reduce((serviceSum, service) => serviceSum + service.totalPriceOrder, 0)
				: 0;
			const giftCardTotal = Array.isArray(current.ListGiftCard)
				? current.ListGiftCard.reduce((giftCardSum, giftCard) => giftCardSum + giftCard.amount, 0)
				: 0;

			return total + serviceTotal + giftCardTotal;
		}, 0);
		const totalTip = newOderState.tempService.reduce((acc, item) => {
			return acc + (item.tip || 0);
		}, 0);
		const roundedTotalTip = parseFloat(totalTip.toFixed(2)) || 0;
		const roundedTotal = parseFloat(total.toFixed(2));
		const totalServices = newOderState.tempService.reduce(
			(accumulator, item) => accumulator + (item.ListService?.length || 0),
			0
		);
		setCountService(totalServices);
		setTotalTip(roundedTotalTip);
		setTotalAmount(roundedTotal);
		dispatch(updateValueTip(roundedTotalTip));
		dispatch(updateValuetotalAmount(roundedTotal));
		dispatch(updateTotalService(roundedTotal));

		return { roundedTotal, roundedTotalTip };
	};
	// const { cookieValue, saveCookie, getCookie, removeCookie } = useCookie("order");
	// useEffect(() => {
	// 	try {
	// 		// Xóa cookie cũ trước khi lưu
	// 		removeCookie();
	// 		if (JSON.stringify(newOderState).length > 4096) {
	// 			console.error("Data exceeds cookie size limit!");
	// 		} else {
	// 			saveCookie(JSON.stringify(newOderState), 1);
	// 		}
	// 		// Thử lưu cookie mới
	// 		saveCookie(JSON.stringify(newOderState), 1);

	// 		// Log giá trị cookie hiện tại
	// 		console.log("Current cookie value:", cookieValue);
	// 	} catch (error) {
	// 		// Log lỗi nếu có
	// 		console.error("Error while saving cookie:", error);
	// 	}
	// }, [newOderState]);
	useEffect(() => {
		if (newOderState.updateItem.status == "completed" && newOderState.updateListService.status == "completed") {
			if (actionMode == "add") {
				dispatch(AddOrder(newOderState.item));
				dispatch(resetUpdateState());
			} else {
				dispatch(EditOrder({ id: newOderState._id, data: newOderState.itemEdit }));
				dispatch(resetUpdateState());
			}
		}
	}, [newOderState.updateItem, newOderState.updateListService]);
	useEffect(() => {
		const handle = async () => {
			setTotalTax(await calculateTotalTax());
			dispatch(updateValueTax(await calculateTotalTax()));
		};
		handle();
	}, [selected]);
	useEffect(() => {
		setHeight(ref.current.clientHeight);
	}, []);
	useEffect(() => {
		calculateTotalAmount();
	}, [newOderState.tempService]);
	useEffect(() => {
		if (newOderState.draftNew == false) setCheckInOld(newOderState.tempService);
		if (newOderState.customer) setCustomerOld(newOderState.customer._id);
	}, []);
	useEffect(() => {
		if (isDiscountFirst) {
			setStoreDiscountOld(newOderState.storeDiscount);
			setIsDiscountFirst(false);
		}
	}, []);
	useEffect(() => {
		dispatch(updateValuetotalAll(newOderState.tax + newOderState.totalAmount + newOderState.tip));
	}, [newOderState.tax, newOderState.totalAmount, newOderState.tip]);
	useEffect(() => {
		setProducts(serviceState.selectedService);
	}, [serviceState.selectedService]);
	useEffect(() => {
		dispatch(
			UpdateTotal(totalAmount + totalTax + totalTip - (newOderState.storeDiscount + calculateTotalDiscount()))
		);
	}, [totalAmount, totalTip, totalTax, newOderState.ListDiscount]);
	useEffect(() => {
		dispatch(updateTax(totalTax));
	}, [totalTax]);
	useEffect(() => {
		dispatch(updateTotalTip(totalTip));
	}, [totalTip]);
	useEffect(() => {
		if (keyboard !== "") {
			let oldValue = "";
			switch (modifyMode) {
				case "discount":
					//oldValue=ServiceClick.discount
					break;
				case "quantity":
					if (ServiceClick?.unit == 1) oldValue = "0";
					else oldValue = ServiceClick?.unit.toString() || "0";
					break;
				case "price":
					//oldValue=ServiceClick.price
					break;
			}
			switch (keyboard) {
				case "+/-":
					let nV = Number(oldValue);
					if (nV > 0) {
						nV = -1 * nV;
					} else {
						nV = Math.abs(nV);
					}
					if (modifyMode === "discount") {
						nV = 0;
					}

					break;
				case "BACK":
					if (oldValue.length === 1) {
						if (oldValue === "0" && modifyMode === "quantity") {
							//dispatch(deleteProduct(ServiceClick))
							//dispatch(unselectProduct(ServiceClick))
						} else {
							if (ServiceClick?.idOrder)
								dispatch(updateQuantity({ id: ServiceClick.idOrder, quantity: 1 }));
							//dispatch(updateProduct({key:modifyMode,value:"0",index:currentIndex}))
						}
					} else {
						const value =
							ServiceClick?.unit && ServiceClick?.unit < 10 ? "0" : oldValue.toString().slice(0, -1);
						if (ServiceClick?.idOrder)
							dispatch(updateQuantity({ id: ServiceClick.idOrder, quantity: Number(value) }));
						//dispatch(updateProduct({key:modifyMode,value:value,index:currentIndex}))
					}
					break;
				case ".":
					// if(orderState.beginModify){
					//     dispatch(updateProduct({key:modifyMode,value:"0.",index:currentIndex}))
					// }
					// else{
					//     const existed=oldValue.toString().includes(".")
					//     if(!existed){
					//         const value=oldValue+"."
					//         dispatch(updateProduct({key:modifyMode,value:value,index:currentIndex}))
					//     }
					// }
					break;
				default:
					const value = oldValue === "0" ? keyboard : oldValue + keyboard;
					const index = products.findIndex((item) => item.idOrder === ServiceClick?.idOrder);
					if (index !== -1 && ServiceClick) {
						const updatedServiceItem = {
							...products[index],
							unit: Number(value),
						};
						setServiceClick(updatedServiceItem);
					}
					break;
			}
		}
		setTimeout(() => {
			setKeyboard("");
		}, 100);
	}, [keyboard]);
	useEffect(() => {
		if (!_.isEqual(newOderState.tempService, selected)) {
			setSelected(newOderState.tempService);
			if (newOderState.isTransfer) {
				dispatch(updateIsEdit(true));
			}
		}
	}, [newOderState.tempService]);
	useEffect(() => {
		if (newOderState.actionState) {
			switch (newOderState.actionState.status!) {
				case "completed":
					completed();
					setCheckInOld(newOderState.tempService);
					setStoreDiscountOld(newOderState.storeDiscount);
					if (newOderState.customer) setCustomerOld(newOderState.customer._id);
					dispatch(UpdateListServiceClick(undefined));
					dispatch(resetActionState());
					if (actionMode == "add") dispatch(clearState());
					// if (actionButton == "payment" || newOderState.status.code == StatusValueOrder.done) {
					// 	dispatch(updateOrderId(newOderState._id));
					// 	let statusDone: Status = {
					// 		code: StatusValueOrder.done,
					// 		value: StatusValueOrder.done,
					// 	};
					// 	dispatch(updateStatusOrder(statusDone));
					// 	dispatch(GetListPayment(newOderState._id));
					// 	dispatch(updateCustomerPayment(newOderState.customer));
					// 	// navigate("/payment");
					// }
					dispatch(updateDraftNew(false));
					break;
				case "loading":
					processing();
					break;
				case "failed":
					failed(t(newOderState.actionState.error!));
					dispatch(resetActionState());
					break;
			}
		}
	}, [newOderState.actionState]);
	useEffect(() => {
		if (newOderState.code) {
			dispatch(updateActionOrder("edit"));
		} else {
			dispatch(updateActionOrder("add"));
		}
	}, [newOderState?.code]);
	useEffect(() => {
		// use to delete call edit order
		const handleProcessDelete = async () => {
			if (processDeleteSuccess) {
				try {
					await dispatch(calculatorDiscount(newOderState.ListDiscount));
					await dispatch(updateActionOrder("edit"));
					await dispatch(updateIsEdit(true));
				} catch (error) {
					console.error("Error during process delete:", error);
				}
			}
		};

		handleProcessDelete();
	}, [processDeleteSuccess]);
	useEffect(() => {
		const handleEditProcess = async () => {
			if (newOderState.isEdit) {
				try {
					const { roundedTotal, roundedTotalTip } = await calculateTotalAmount();
					const roundedTotalTax = await calculateTotalTax();
					handleSubmitOrderDelete(roundedTotal, roundedTotalTip, roundedTotalTax);
					dispatch(updateIsEdit(false));
				} catch (error) {
					console.error("Error during edit process:", error);
				}
			}
		};

		handleEditProcess();
	}, [newOderState.isEdit]);
	useEffect(() => {
		dispatch(calculatorDiscount(newOderState.ListDiscount));
	}, [newOderState.ListDiscount]);

	useEffect(() => {
		if (newOderState.saveDrag == true) {
			handleAddLocalStore();
		}
	}, [newOderState]);
	useEffect(() => {
		if (isDisabled && isDisabledCus && newOderState.draftNew == false) {
			removeCheckInState(newOderState._idSave);
			dispatch(updateSaveDrag(false));
		}
	}, [isDisabled, isDisabledCus, newOderState.draftNew]);
	useEffect(() => {
		if (newOderState.status.code === "PAID") {
			dispatch(initOrder({}));
			setSelected([]);
			setTotalAmount(0);
			setTotalTax(0);
			setProducts([]);
			setTotalTip(0);
		}
	}, [newOderState.status.code]);

	return (
		<div className="h-100 my-background-order ps-0 pe-0 pt-0" style={{ borderRadius: "22px" }}>
			<div className="" style={{ height: height == 0 ? 402 : bodyHeight - height - 152 }}>
				<WtcCard
					background="#dadff2"
					classNameBody="flex-grow-1 px-1 pb-0 my-0"
					className="h-100 pe-0 me-0"
					borderRadius={12}
					body={
						<>
							<div className="pe-1 px-0 h-100" style={{ overflowY: "auto", overflowX: "hidden" }}>
								{selected.length > 0 ? (
									<>
										{selected.map((item, index) => {
											return (
												<div key={"order-product-" + index}>
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
														BookingDetailId={item.BookingDetailId}
													/>
												</div>
											);
										})}
									</>
								) : (
									<div className="h-100 d-flex flex-column justify-content-center">
										<EmptyBox
											description={<>{t("empty_srv")}</>}
											image={emptyImage}
											disabled={false}
										/>
									</div>
								)}
							</div>
						</>
					}
				/>
			</div>
			<div className="ps-0 pe-1 d-flex flex-column" style={{ borderRadius: 20, height: 150 }} ref={ref}>
				<div className="flex-grow-1 d-flex align-items-end pt-1 pe-2 ps-1">
					<div className="d-flex align-items-end">
						<div className=" ps-1 fw-bold" style={{ color: "#30363F" }}>
							<div className="label-item-total fs-value">
								{t("Services")} (
								<span className="label-total fs-value-disabled">{CountService} items</span>)&ensp;
								<span className="wtc-text-primary">
									$ {toLocaleStringRefactor(toFixedRefactor(totalAmount, 2))}
								</span>
							</div>

							<div className="label-item-total">
								{t("taxs")} (
								<span className="label-total fs-value-disabled">
									{getTaxRate(storeConfigState.list)}%
								</span>
								)&ensp;
								<span className="wtc-text-primary">
									$ {toLocaleStringRefactor(toFixedRefactor(totalTax, 2))}
								</span>
							</div>

							<div className="label-item-total">
								{t("tips")}&ensp;
								<span className="wtc-text-primary">
									$ {toLocaleStringRefactor(toFixedRefactor(totalTip, 2))}
								</span>
							</div>
						</div>
					</div>
					<div
						className="text-end flex-grow-1 align-items-center"
						style={{ textAlign: "end", alignSelf: "center" }}
					>
						<span className="text-danger money-payment fw-bold">
							${" "}
							{toLocaleStringRefactor(
								toFixedRefactor(
									Math.max(
										0,
										totalTax +
											totalAmount +
											totalTip -
											(newOderState.storeDiscount + calculateTotalDiscount())
									),
									2
								)
							)}
						</span>
					</div>
				</div>
				<div className="label-item-total ps-2 pe-1 fw-bold">
					{
						<>
							{t("discount")}(
							<span className="label-total fs-value-disabled">
								{t("store")}/{t("Employees")}
							</span>
							) &ensp;
							<span className="wtc-text-primary fs-value">
								$ {toLocaleStringRefactor(toFixedRefactor(newOderState.storeDiscount, 2))} / ${" "}
								{toLocaleStringRefactor(toFixedRefactor(calculateTotalDiscount(), 2))}
							</span>
						</>
					}
				</div>
				<div className="mt-3 row">
					{actionMode === "edit" ? (
						newOderState.status.code == StatusValueOrder.done ? (
							<>
								<div className="col-sm-6">
									<WtcRoleButton
										action={"INS"}
										target={PageTarget.payment}
										label={t("payment")}
										fontSize={16}
										icon="pi pi-dollar"
										className="w-100 text-white wtc-bg-primary"
										height={40}
										onClick={handlePaymentOrder}
									/>
								</div>
								<div className="col-sm-6">
									<WtcRoleButton
										action={"UPD"}
										target={PageTarget.order}
										fontSize={16}
										disabled={isDisabled && isDisabledCus}
										icon="ri-edit-line"
										label={t("edit_order")}
										className="w-100 text-white wtc-bg-submitorder fw-bold"
										height={40}
										onClick={handleSubmitOrder}
									/>
								</div>
							</>
						) : (
							<>
								<div className="col-sm-6">
									<WtcRoleButton
										action={"UPD"}
										target={PageTarget.order}
										label={t("status_doneAll")}
										fontSize={16}
										disabled={!isDisabled || !isDisabledCus}
										icon="pi pi-check"
										className="w-100 text-white wtc-bg-primary"
										height={40}
										onClick={handleClickDoneAllTask}
									/>
								</div>
								<div className="col-sm-6">
									<WtcRoleButton
										action={"UPD"}
										target={PageTarget.order}
										fontSize={16}
										disabled={isDisabled && isDisabledCus}
										icon="ri-edit-line"
										label={t("edit_order")}
										className="w-100 text-white wtc-bg-submitorder fw-bold"
										height={40}
										onClick={handleSubmitOrder}
									/>
								</div>
							</>
						)
					) : (
						<div className="col-sm-12">
							<WtcRoleButton
								action={"INS"}
								target={PageTarget.order}
								icon="ri-add-line"
								fontSize={16}
								label={t("submit_order")}
								className="w-100 text-white wtc-bg-submitorder fw-bold"
								height={40}
								onClick={handleSubmitOrder}
							/>
						</div>
					)}
				</div>
			</div>
			<DynamicDialog
				width={isMobile ? "60vw" : "38vw"}
				height={600}
				visible={dialogVisibleService}
				mode={"edit"}
				position={"center"}
				title={t("service")}
				okText=""
				cancelText=""
				draggable={false}
				isBackgroundGray={true}
				resizeable={false}
				onClose={() => setDialogVisibleService(false)}
				body={
					<>
						<div className="d-flex flex-column justify-content-between h-100">
							<div className="d-flex flex-column rounded w-100 h-100">
								<div className="w-100 px-1" style={{ height: 182 }}>
									<div className="row h-100 ps-2 pe-2">
										<WtcCard
											classNameBody="flex-grow-1 px-1 my-1"
											className="h-100"
											body={
												<div className="row">
													<div className="col-sm-12">{menuItemService(ServiceClick)}</div>
												</div>
											}
										/>
									</div>
								</div>
								<div style={{ height: 280 }}>
									<div className="flex-grow-1 w-100 h-100 flex-fill ps-2 pe-2 pt-2" ref={ref}>
										<div className="row py-2">
											<div className="col-sm-3">
												<WtcButton
													label={"1"}
													className={`w-100 ${
														keyboard === "1"
															? "text-white custom-primary-outline"
															: "text-black wtc-bg-secondary"
													}`}
													fontSize={24}
													height={280 / 4.8}
													onClick={() => handleKeyboardAction("1")}
												/>
											</div>
											<div className="col-sm-3">
												<WtcButton
													label={"2"}
													className={`w-100 ${
														keyboard === "2"
															? "text-white custom-primary-outline"
															: "text-black wtc-bg-secondary"
													}`}
													fontSize={24}
													height={280 / 4.8}
													onClick={() => handleKeyboardAction("2")}
												/>
											</div>
											<div className="col-sm-3">
												<WtcButton
													label={"3"}
													className={`w-100 ${
														keyboard === "3"
															? "text-white custom-primary-outline"
															: "text-black wtc-bg-secondary"
													}`}
													fontSize={24}
													height={280 / 4.8}
													onClick={() => handleKeyboardAction("3")}
												/>
											</div>
											<div className="col-sm-3">
												<WtcButton
													disabled
													label={"Qty"}
													className={`w-100 ${
														modifyMode === "quantity"
															? "text-white wtc-bg-primary"
															: "text-black wtc-bg-secondary-2"
													}`}
													fontSize={24}
													height={280 / 4.8}
													onClick={() => changeModifyMode("quantity")}
												/>
											</div>
										</div>
										<div className="row">
											<div className="col-sm-3">
												<WtcButton
													label={"4"}
													className={`w-100 ${
														keyboard === "4"
															? "text-white custom-primary-outline"
															: "text-black wtc-bg-secondary"
													}`}
													fontSize={24}
													height={280 / 4.8}
													onClick={() => handleKeyboardAction("4")}
												/>
											</div>
											<div className="col-sm-3">
												<WtcButton
													label={"5"}
													className={`w-100 ${
														keyboard === "5"
															? "text-white custom-primary-outline"
															: "text-black wtc-bg-secondary"
													}`}
													fontSize={24}
													height={280 / 4.8}
													onClick={() => handleKeyboardAction("5")}
												/>
											</div>
											<div className="col-sm-3">
												<WtcButton
													label={"6"}
													className={`w-100 ${
														keyboard === "6"
															? "text-white custom-primary-outline"
															: "text-black wtc-bg-secondary"
													}`}
													fontSize={24}
													height={280 / 4.8}
													onClick={() => handleKeyboardAction("6")}
												/>
											</div>
											<div className="col-sm-3">
												<WtcButton
													disabled
													label={"%Disc"}
													className={`w-100 ${
														modifyMode === "discount"
															? "text-white wtc-bg-primary"
															: "text-black wtc-bg-secondary-2"
													}`}
													fontSize={24}
													height={280 / 4.8}
													onClick={() => changeModifyMode("discount")}
												/>
											</div>
										</div>
										<div className="row py-2">
											<div className="col-sm-3">
												<WtcButton
													label={"7"}
													className={`w-100 ${
														keyboard === "7"
															? "text-white custom-primary-outline"
															: "text-black wtc-bg-secondary"
													}`}
													fontSize={24}
													height={280 / 4.8}
													onClick={() => handleKeyboardAction("7")}
												/>
											</div>
											<div className="col-sm-3">
												<WtcButton
													label={"8"}
													className={`w-100 ${
														keyboard === "8"
															? "text-white custom-primary-outline"
															: "text-black wtc-bg-secondary"
													}`}
													fontSize={24}
													height={280 / 4.8}
													onClick={() => handleKeyboardAction("8")}
												/>
											</div>
											<div className="col-sm-3">
												<WtcButton
													label={"9"}
													className={`w-100 ${
														keyboard === "9"
															? "text-white custom-primary-outline"
															: "text-black wtc-bg-secondary"
													}`}
													fontSize={24}
													height={280 / 4.8}
													onClick={() => handleKeyboardAction("9")}
												/>
											</div>
											<div className="col-sm-3">
												<WtcButton
													label={"Price"}
													className={`w-100 ${
														modifyMode === "price"
															? "text-white wtc-bg-primary"
															: "text-black wtc-bg-secondary-2"
													}`}
													fontSize={24}
													height={280 / 4.8}
													onClick={() => changeModifyMode("price")}
												/>
											</div>
										</div>
										<div className="row ">
											<div className="col-sm-3">
												<WtcButton
													label={"+/-"}
													className={`w-100 ${
														keyboard === "+/-"
															? "text-white wtc-bg-primary"
															: "text-black wtc-bg-secondary"
													}`}
													fontSize={24}
													height={280 / 4.8}
													onClick={() => handleKeyboardAction("+/-")}
												/>
											</div>
											<div className="col-sm-3">
												<WtcButton
													label={"0"}
													className={`w-100 ${
														keyboard === "0"
															? "text-white wtc-bg-primary"
															: "text-black wtc-bg-secondary"
													}`}
													fontSize={24}
													height={280 / 4.8}
													onClick={() => handleKeyboardAction("0")}
												/>
											</div>
											<div className="col-sm-3">
												<WtcButton
													label={"."}
													className={`w-100 ${
														keyboard === "."
															? "text-white wtc-bg-primary"
															: "text-black wtc-bg-secondary"
													}`}
													fontSize={24}
													height={280 / 4.8}
													onClick={() => handleKeyboardAction(".")}
												/>
											</div>
											<div className="col-sm-3">
												<WtcButton
													label={""}
													icon="ri-delete-back-2-line"
													className={`w-100 ${
														keyboard === "BACK"
															? "text-white wtc-bg-primary"
															: "text-black wtc-bg-secondary-2"
													}`}
													fontSize={24}
													height={280 / 4.8}
													onClick={() => setKeyboard("BACK")}
												/>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</>
				}
				closeIcon
				footer={
					<div className=" d-flex wtc-bg-white align-items-center justify-content-end">
						<Button
							type="button"
							label={t("action.close")}
							className="me-3 bg-white text-blue dialog-cancel-button"
							onClick={() => setDialogVisibleService(false)}
						/>
						<Button
							type="button"
							label={t("action.UPD")}
							className="wtc-bg-primary text-white  dialog-cancel-button"
							icon="ri ri-edit-line"
							onClick={handleClickAdd}
						/>
					</div>
				}
			/>
		</div>
	);
}
