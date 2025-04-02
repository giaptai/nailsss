import { useFormik } from "formik";
import { t } from "i18next";
import _ from "lodash";
import { Button } from "primereact/button";
import { RadioButton } from "primereact/radiobutton";
import { useEffect, useRef, useState } from "react";
import { isMobile } from "react-device-detect";
import { useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { useAppSelector } from "../../app/hooks";
import useWindowSize from "../../app/screen";
import emptyImage from "../../assets/images/empty/empty_box_1.svg";
import { FormatMoneyToNumber, getCurrentFormattedDate, getNameDiscount } from "../../const";
import { DiscountModel } from "../../models/category/Discount.model";
import { ListServiceSelectedModel } from "../../models/category/ListServiceSelected.model";
import {
	calculatorDiscount,
	updateListDiscount,
	UpdateListServiceClick,
	updatetempService,
	updateValueTax,
	updateValueTip,
	updateValuetotalAmount,
} from "../../slices/newOder.slice";
import { updateTotalService } from "../../slices/payment.slice";
import {
	clearListPaymentRefund,
	deleteListServiceInArray,
	GetListPaymentOld,
	RefundOrder,
	resetActionState,
	resetUpdateStateRefund,
	updateItemRefund,
	updateListServiceRefund,
} from "../../slices/refund.slice";
import { completed, failed, processing, questionWithConfirm, warningWithConfirm } from "../../utils/alert.util";
import { toFixedRefactor, toLocaleStringRefactor } from "../../utils/string.ultil";
import EmptyBox from "../commons/EmptyBox";
import SelectedServiceEmployee from "../commons/SelectedServiceEmployee";
import WtcButton from "../commons/WtcButton";
import WtcCard from "../commons/WtcCard";
import WtcDropdownIconText from "../commons/WtcDropdownIconText";
import WtcInputIconText from "../commons/WtcInputIconText";
import WtcListEmployeeTip from "../commons/WtcListEmployeeTip";
import DynamicDialog from "../DynamicDialog";
export default function RefundOrderNew() {
	const screenSize = useWindowSize();
	const dispatch = useDispatch();
	const bodyHeight = screenSize.height;
	const newOderState = useAppSelector((state) => state.newOder);
	const refundState = useAppSelector((state) => state.refund);
	const storeConfigState = useAppSelector((state) => state.storeconfig);
	const [CountService, setCountService] = useState(0);
	const [totalTax, setTotalTax] = useState(0);
	const [totalAmount, setTotalAmount] = useState<number>(0);
	const [totalTip, setTotalTip] = useState<number>(0);
	const refDialog = useRef<any>(null);
	const [dialogVisibleTip, setDialogVisibleTip] = useState(false);
	const [actionDialog, setActionDialog] = useState<"tip" | "discount" | undefined>(undefined);
	const [keyboard, setKeyboard] = useState("");
	const [ListServiceTip, setListServiceTip] = useState<ListServiceSelectedModel[]>(newOderState.tempService || []);
	const [ServiceTip, setServiceTip] = useState<ListServiceSelectedModel>();
	const [dialogVisibleDiscount, setDialogVisibleDiscount] = useState(false);
	const [valuePercent, setvaluePercent] = useState("");
	const [byDiscount, setByDiscount] = useState<
		"storeDiscount" | "coupons" | "storeEmployees" | "Empl" | "storeEmployee"
	>("storeDiscount");
	const [typeDiscount, setTypeDiscount] = useState("");
	const [typeQuickKey, settypeQuickKey] = useState<"dollar" | "percent">("dollar");
	const [moneyDiscount, setMoneydiscount] = useState<string>("0");
	const [listDiscount, setListDiscount] = useState<DiscountModel[]>([]);
	const moneyPaied = refundState.ListPayment.reduce((sum, payment) => sum + payment.amount, 0);

	const totalAllPayment =
		newOderState.tax +
		newOderState.totalAmount +
		newOderState.tip -
		(newOderState.storeDiscount +
			newOderState.tempService.reduce((total, item) => total + (item.discount || 0), 0));
	const totalRemaining = toFixedRefactor(totalAllPayment - moneyPaied, 2);
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
	const formik = useFormik<any>({
		initialValues: { coupon: "" },
		validate: (_data) => {
			return undefined;
		},
		onSubmit: (_data) => {},
	});
	const calculateTotalDiscount = (): number => {
		return newOderState.tempService.reduce((total, item) => total + (item.discount || 0), 0);
	};
	const calculateTotalTax = (): number => {
		const taxRate = getTaxRate(storeConfigState.list);
		const totalTax = newOderState.tempService.reduce((totalTax, order) => {
			const serviceTax = order.ListService
				? order.ListService
						// @ts-ignore
						.filter((service) => service.tax === true || service.tax === "YES")
						.reduce((acc, service) => acc + service.storePrice * service.unit * (taxRate / 100), 0)
				: 0;
			return totalTax + serviceTax;
		}, 0);
		return Math.round(totalTax * 100) / 100;
	};
	const handleCloseDialogTip = () => {
		setDialogVisibleTip(false);
		setActionDialog(undefined);
		setServiceTip(undefined);
	};
	const handleKeyboardAction = (key: string) => {
		setKeyboard(key);
	};
	const RemoveAllTip = () => {
		warningWithConfirm({
			title: t("remove_all_tip"),
			text: "",
			confirmButtonText: t("Delete"),
			confirm: () => {
				const updatedSelected = ListServiceTip.map((item) => ({
					...item,
					tip: 0,
				}));
				setListServiceTip(updatedSelected);
				dispatch(updatetempService(updatedSelected));
			},
		});
	};
	const handleSubmitTip = () => {
		dispatch(updatetempService(ListServiceTip));
		handleCloseDialogTip();
	};
	const handleClickAddTip = () => {
		setDialogVisibleTip(true);
		setListServiceTip(
			newOderState.tempService.filter((item) => item?.ListGiftCard == undefined || item.ListGiftCard.length == 0)
		);
		setActionDialog("tip");
	};
	const handleOnChangeDiscountType = (e: any) => {
		setvaluePercent((e.value / 100).toString());
		setTypeDiscount(e.type);
		let isOnlyStaff = false;
		let totalMoneyOnlyStaff = 0;

		if (byDiscount === "storeEmployee" || byDiscount === "Empl") {
			isOnlyStaff = true;
			totalMoneyOnlyStaff = newOderState.ListServiceClick?.ListService
				? newOderState.ListServiceClick.ListService.reduce((total, service) => {
						return total + service.storePrice * service.unit;
				  }, 0)
				: 0;
			totalMoneyOnlyStaff = Number(totalMoneyOnlyStaff.toFixed(2));
		}

		if (isOnlyStaff) {
			setMoneydiscount((totalMoneyOnlyStaff * (e.value / 100)).toFixed(2).toString());
		} else {
			setMoneydiscount((newOderState.totalAmount * (e.value / 100)).toFixed(2).toString());
		}
	};
	const updateTip = (id: string, newTip: number) => {
		const updatedSelected = ListServiceTip.map((item) => {
			if (item._id === id) {
				const returnValue = { ...item, tip: newTip };
				setServiceTip(returnValue);
				return returnValue;
			}

			return item;
		});
		setListServiceTip(updatedSelected);
	};
	const handleCloseDialogDiscount = () => {
		setDialogVisibleDiscount(false);
		setActionDialog(undefined);
		setByDiscount("coupons");
	};
	const onChangeTypeDiscount = (e: any) => {
		setByDiscount(e.value);
	};
	const handleRemoveDiscount = (id?: string) => {
		if (id) {
			warningWithConfirm({
				title: t("do_you_delete"),
				text: "",
				confirmButtonText: t("Delete"),
				confirm: () => {
					const temp: DiscountModel[] = listDiscount.filter((discount) => discount._id !== id);
					setListDiscount(temp);
					dispatch(updateListDiscount(temp));
					dispatch(calculatorDiscount(temp));
				},
			});
		} else if (id == undefined && listDiscount.length > 0) {
			warningWithConfirm({
				title: t("remove_all_discount"),
				text: "",
				confirmButtonText: t("Delete"),
				confirm: () => {
					setListDiscount([]);
					dispatch(updateListDiscount([]));
					dispatch(calculatorDiscount([]));
				},
			});
		}
	};
	const handleclickSwitch = (key: string) => {
		setKeyboard(key);
		if (typeQuickKey == "dollar") settypeQuickKey("percent");
		else if (typeQuickKey == "percent") settypeQuickKey("dollar");
	};
	const handleClickSubmitDiscount = () => {
		if (
			Number(moneyDiscount) >
			newOderState.totalAmount +
				newOderState.tax +
				newOderState.tip -
				(newOderState.storeDiscount + calculateTotalDiscount())
		) {
			failed(t("error_discountLarge"));
		} else if (Number(moneyDiscount) > 0) {
			if (typeDiscount && typeDiscount != "") {
				const newDiscount = new DiscountModel(
					uuidv4(),
					byDiscount,
					typeDiscount,
					Number(moneyDiscount),
					true,
					valuePercent,
					byDiscount == "coupons" || byDiscount == "storeDiscount" || byDiscount == "storeEmployees"
						? undefined
						: newOderState.ListServiceClick?.Employee,
					formik.values.coupon
				);
				setListDiscount((prevList) => [...prevList, newDiscount]);
			} else {
				if (typeQuickKey == "dollar") {
					const newDiscount = new DiscountModel(
						uuidv4(),
						byDiscount,
						typeDiscount,
						Number(moneyDiscount),
						false,
						"",
						byDiscount == "coupons" || byDiscount == "storeDiscount" || byDiscount == "storeEmployees"
							? undefined
							: newOderState.ListServiceClick?.Employee,
						formik.values.coupon
					);
					setListDiscount((prevList) => [...prevList, newDiscount]);
				} else {
					const newDiscount = new DiscountModel(
						uuidv4(),
						byDiscount,
						typeDiscount,
						Number(moneyDiscount),
						true,
						valuePercent,
						byDiscount == "coupons" || byDiscount == "storeDiscount" || byDiscount == "storeEmployees"
							? undefined
							: newOderState.ListServiceClick?.Employee,
						formik.values.coupon
					);
					setListDiscount((prevList) => [...prevList, newDiscount]);
				}
			}
			setTypeDiscount("");
			setvaluePercent("");
			setMoneydiscount("0");
			handleCloseDialogDiscount();
		} else {
			failed(t("error_discount0"));
		}
	};
	const handleClickAddDiscount = () => {
		setDialogVisibleDiscount(true);
		setActionDialog("discount");
	};
	const handleClickRefund = () => {
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
				transDate: getCurrentFormattedDate(),
				storeDiscount: FormatMoneyToNumber(newOderState.storeDiscount),
				attributes: {
					ListDiscount: newOderState.ListDiscount,
				},
			};
			dispatch(updateItemRefund(newItem));
			const list = newOderState.tempService;
			dispatch(updateListServiceRefund({ list, taxRate, tipRate }));
		}
	};
	const handleDeleteService = (_id: string) => {
		warningWithConfirm({
			title: t("do_you_delete"),
			text: "",
			confirmButtonText: t("Delete"),
			confirm: () => {
				dispatch(deleteListServiceInArray(_id));
			},
		});
	};
	useEffect(() => {
		setHeight(ref.current.clientHeight);
	}, []);
	useEffect(() => {
		if (refundState.updateItem.status == "completed" && refundState.updateListService.status == "completed") {
			const data = {
				_id: newOderState._id,
				data: refundState.item,
			};
			dispatch(RefundOrder(data));
			dispatch(resetUpdateStateRefund());
		}
	}, [refundState.updateItem, refundState.updateListService]);
	useEffect(() => {
		const calculateTotalAmount = () => {
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
			setTotalTip(roundedTotalTip);
			dispatch(updateValueTip(roundedTotalTip));
			const roundedTotal = parseFloat(total.toFixed(2));
			setTotalAmount(roundedTotal);
			dispatch(updateValuetotalAmount(roundedTotal));
			dispatch(updateTotalService(roundedTotal));
			const totalServices = newOderState.tempService.reduce(
				(accumulator, item) => accumulator + (item.ListService?.length || 0),
				0
			);
			setCountService(totalServices);
		};
		calculateTotalAmount();
		setTotalTax(calculateTotalTax());
		dispatch(updateValueTax(calculateTotalTax()));
	}, [newOderState.tempService]);
	useEffect(() => {
		if (actionDialog === "tip") {
			if (keyboard !== "") {
				switch (keyboard) {
					case "BACK":
						if (ServiceTip) {
							const oldValue = ServiceTip?.tip.toString();
							if (oldValue && oldValue.length === 1) {
								updateTip(ServiceTip?._id, 0);
							} else {
								const value = oldValue.slice(0, -1);
								updateTip(ServiceTip?._id, Number(value));
							}
						}
						break;
					case ".":
						if (ServiceTip) {
							const oldValue = ServiceTip.tip.toString();
							const existed = oldValue.includes(".");
							if (!existed) {
								const value1 = oldValue + ".001";
								const par = parseFloat(value1);
								updateTip(ServiceTip?._id, par);
							}
						}
						break;
					case "$1":
						if (ServiceTip) updateTip(ServiceTip?._id, 1);
						break;
					case "$2":
						if (ServiceTip) updateTip(ServiceTip?._id, 2);
						break;
					case "$3":
						if (ServiceTip) updateTip(ServiceTip?._id, 3);
						break;
					case "$4":
						if (ServiceTip) updateTip(ServiceTip?._id, 4);
						break;
					case "$5":
						if (ServiceTip) updateTip(ServiceTip?._id, 5);
						break;
					case "$6":
						if (ServiceTip) updateTip(ServiceTip?._id, 6);
						break;
					case "$7":
						if (ServiceTip) updateTip(ServiceTip?._id, 7);
						break;
					case "$8":
						if (ServiceTip) updateTip(ServiceTip?._id, 8);
						break;
					case "$9":
						if (ServiceTip) updateTip(ServiceTip?._id, 9);
						break;
					case "$10":
						if (ServiceTip) updateTip(ServiceTip?._id, 10);
						break;
					case "$12":
						if (ServiceTip) updateTip(ServiceTip?._id, 12);
						break;
					case "$15":
						if (ServiceTip) updateTip(ServiceTip?._id, 15);
						break;
					default:
						const value = ServiceTip?.tip === 0 ? keyboard : ServiceTip?.tip + keyboard;
						const existedDot = value.toString().includes(".");
						if (ServiceTip) {
							if (existedDot) {
								const stringArr = value.toString().split(".");
								const temp = stringArr[1];
								const tempValue = stringArr[0];
								if (temp.includes("001")) {
									if (keyboard == "0") {
										updateTip(ServiceTip?._id, Number(tempValue + "." + "002"));
									} else updateTip(ServiceTip?._id, Number(tempValue + "." + keyboard));
								} else if (temp.includes("002")) {
									updateTip(ServiceTip?._id, Number(tempValue + ".0" + keyboard));
								} else {
									if (temp.toString().length <= 2) updateTip(ServiceTip?._id, Number(value));
								}
							} else {
								updateTip(ServiceTip?._id, Number(value));
							}
						}
						break;
				}
			}
		} else if (actionDialog == "discount") {
			let isOnlyStaff = false;
			let totalMoneyOnlyStaff = 0;
			if (byDiscount == "storeEmployee" || byDiscount == "Empl") {
				isOnlyStaff = true;
				totalMoneyOnlyStaff = newOderState.ListServiceClick?.ListService
					? newOderState.ListServiceClick.ListService.reduce((total, service) => {
							return total + service.storePrice;
					  }, 0)
					: 0;
			}
			if (keyboard !== "" && keyboard !== "Switch") {
				switch (keyboard) {
					case "BACK":
						if (moneyDiscount.length === 1) {
							setMoneydiscount("0");
						} else {
							const value = moneyDiscount.slice(0, -1);
							setMoneydiscount(value);
						}
						break;
					case ".":
						const existed = moneyDiscount.includes(".");
						if (!existed) {
							const value = moneyDiscount + ".";
							setMoneydiscount(value);
						}
						break;
					case "$1":
						setMoneydiscount("1");
						break;
					case "$2":
						setMoneydiscount("2");
						break;
					case "$3":
						setMoneydiscount("3");
						break;
					case "$5":
						setMoneydiscount("5");
						break;
					case "$10":
						setMoneydiscount("10");
						break;
					case "$15":
						setMoneydiscount("15");
						break;
					case "$20":
						setMoneydiscount("20");
						break;
					case "$25":
						setMoneydiscount("25");
						break;
					case "$50":
						setMoneydiscount("50");
						break;
					case "1%":
						if (isOnlyStaff) setMoneydiscount((totalMoneyOnlyStaff * 0.01).toString());
						else setMoneydiscount((newOderState.totalAll * 0.01).toString());
						setvaluePercent("0.01");
						break;
					case "5%":
						if (isOnlyStaff) setMoneydiscount((totalMoneyOnlyStaff * 0.05).toString());
						else setMoneydiscount((newOderState.totalAll * 0.05).toString());
						setvaluePercent("0.05");
						break;
					case "10%":
						if (isOnlyStaff) setMoneydiscount((totalMoneyOnlyStaff * 0.1).toString());
						else setMoneydiscount((newOderState.totalAll * 0.1).toString());
						setvaluePercent("0.1");
						break;
					case "15%":
						if (isOnlyStaff) setMoneydiscount((totalMoneyOnlyStaff * 0.15).toString());
						else setMoneydiscount((newOderState.totalAll * 0.15).toString());
						setvaluePercent("0.15");
						break;
					case "20%":
						if (isOnlyStaff) setMoneydiscount((totalMoneyOnlyStaff * 0.2).toString());
						else setMoneydiscount((newOderState.totalAll * 0.2).toString());
						setvaluePercent("0.2");
						break;
					case "25%":
						if (isOnlyStaff) setMoneydiscount((totalMoneyOnlyStaff * 0.25).toString());
						else setMoneydiscount((newOderState.totalAll * 0.25).toString());
						setvaluePercent("0.25");
						break;
					case "30%":
						if (isOnlyStaff) setMoneydiscount((totalMoneyOnlyStaff * 0.3).toString());
						else setMoneydiscount((newOderState.totalAll * 0.3).toString());
						setvaluePercent("0.3");
						break;
					case "50%":
						if (isOnlyStaff) setMoneydiscount((totalMoneyOnlyStaff * 0.5).toString());
						else setMoneydiscount((newOderState.totalAll * 0.5).toString());
						setvaluePercent("0.5");
						break;
					case "100%":
						setvaluePercent("1");
						if (isOnlyStaff) setMoneydiscount(totalMoneyOnlyStaff.toString());
						else setMoneydiscount(newOderState.totalAll.toString());
						setMoneydiscount(newOderState.totalAll.toString());
						break;
					case "Clear":
						setMoneydiscount("0");
						break;
					default:
						const value = moneyDiscount === "0" ? keyboard : moneyDiscount + keyboard;
						const existedDot = value.toString().includes(".");
						if (existedDot) {
							const stringArr = moneyDiscount.toString().split(".");
							const decimal = stringArr[1];
							if (decimal.toString().length < 2) {
								setMoneydiscount(value);
							}
						} else {
							setMoneydiscount(value);
						}
						break;
				}
			}
		}
		setTimeout(() => {
			setKeyboard("");
		}, 100);
	}, [keyboard]);
	useEffect(() => {
		if (!_.isEqual(newOderState.ListDiscount, listDiscount)) {
			setListDiscount(newOderState.ListDiscount);
		}
	}, [newOderState.ListDiscount]);
	useEffect(() => {
		dispatch(updateListDiscount(listDiscount));
		dispatch(calculatorDiscount(listDiscount));
	}, [listDiscount]);
	useEffect(() => {
		if (totalRemaining == 0 && totalAllPayment > 0) {
			questionWithConfirm({
				title: t("ques_refu"),
				text: "",
				confirmButtonText: t("ok"),
				confirm: () => {
					handleClickRefund();
				},
				close: () => {},
			});
		}
	}, [totalRemaining]);
	useEffect(() => {
		if (refundState.actionState) {
			switch (refundState.actionState.status!) {
				case "completed":
					completed();
					dispatch(resetActionState());
					dispatch(UpdateListServiceClick(undefined));
					dispatch(clearListPaymentRefund());
					dispatch(GetListPaymentOld(refundState?._id));
					break;
				case "loading":
					processing();
					break;
				case "failed":
					failed(t(refundState.actionState.error!));
					dispatch(resetActionState());
					break;
			}
		}
	}, [refundState.actionState]);

	return (
		<>
			<div className="h-100 my-background-order ps-0 pe-0 pt-0" style={{ borderRadius: "22px" }}>
				<div className="" style={{ height: height == 0 ? 402 : bodyHeight - height - 162 }}>
					<WtcCard
						title={<>{t("service")}</>}
						background="#dadff2"
						classNameBody="flex-grow-1 px-1 pb-0 my-0"
						className="h-100 pe-0 me-0"
						borderRadius={12}
						body={
							<>
								<div className="pe-1 px-0 h-100" style={{ overflowY: "auto", overflowX: "hidden" }}>
									{newOderState.tempService.length > 0 ? (
										<>
											{newOderState.tempService.map((item, index) => {
												return (
													<div key={"order-product-" + index}>
														<SelectedServiceEmployee
															status={item.status}
															isRefund
															Employee={item.Employee}
															ListService={item.ListService}
															_id={item._id}
															code={undefined}
															tip={item.tip}
															discount={item.discount}
															ListGiftCard={item.ListGiftCard}
															OrderDetailId={item.OrderDetailId}
															BookingDetailId={item.BookingDetailId}
															handleDelete={handleDeleteService}
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
				<div className="ps-0 pe-1 d-flex flex-column" style={{ borderRadius: 20, height: 140 }} ref={ref}>
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
									)&ensp;<span className="wtc-text-primary">$ {totalTax}</span>
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
					<div className="mt-1 row">
						<div className="row mt-1 mx-0" style={{ height: 50 }}>
							<div className="col-sm-4 mt-1 ">
								<WtcButton
									label={t("edit_discount")}
									className="fs-value w-100 text-white wtc-bg-primary"
									height={40}
									onClick={handleClickAddDiscount}
								/>
							</div>
							<div className="col-sm-4 mt-1">
								<WtcButton
									label={t("edit_tip")}
									className="fs-value w-100 text-white wtc-bg-primary"
									height={40}
									onClick={handleClickAddTip}
								/>
							</div>
							<div className="col-sm-4 mt-1">
								<WtcButton
									disabled={totalRemaining != 0}
									label={t("refund")}
									className=" w-100 text-white wtc-bg-primary fs-value"
									height={40}
									onClick={handleClickRefund}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div ref={refDialog}>
				<DynamicDialog
					width={isMobile ? "90vw" : "85vw"}
					// minHeight={"100vh"}
					height={screenSize.height - 130}
					visible={dialogVisibleTip}
					mode={"edit"}
					position={"center"}
					title={t("tip")}
					okText=""
					cancelText=""
					draggable={false}
					isBackgroundGray={true}
					resizeable={false}
					onClose={handleCloseDialogTip}
					body={
						<div className="row h-100 w-100 py-1 ps-2">
							<div className="col-md-4 " style={{ height: screenSize.height - 275 }}>
								<WtcCard
									classNameBody="flex-grow-1 px-1 my-0"
									className="h-100"
									body={
										<div className="row">
											<div className="col-sm-12 mt-1">
												{ListServiceTip.filter((item) => item.Employee != undefined).map(
													(item, index) => {
														return (
															<div key={index}>
																<WtcListEmployeeTip
																	selected={
																		ServiceTip?.Employee?._id == item.Employee?._id
																	}
																	item={item}
																	onClick={() => setServiceTip(item)}
																/>
															</div>
														);
													}
												)}
											</div>
										</div>
									}
								/>
							</div>
							<div className="col-md-4 h-100">
								<div className="h-75">
									<div className="row py-1">
										<div className="col-sm-4 ps-0">
											<WtcButton
												disabled={!ServiceTip}
												label={"$1"}
												className={`w-100 ${
													keyboard === "$1"
														? "text-white custom-primary-outline"
														: "text-black wtc-bg-secondary"
												}`}
												fontSize={24}
												height={(screenSize.height - 265) / 6}
												onClick={() => handleKeyboardAction("$1")}
											/>
										</div>
										<div className="col-sm-4 ps-0">
											<WtcButton
												disabled={!ServiceTip}
												label={"$2"}
												className={`w-100 ${
													keyboard === "$2"
														? "text-white custom-primary-outline"
														: "text-black wtc-bg-secondary"
												}`}
												fontSize={24}
												height={(screenSize.height - 265) / 6}
												onClick={() => handleKeyboardAction("$2")}
											/>
										</div>
										<div className="col-sm-4 ps-0">
											<WtcButton
												disabled={!ServiceTip}
												label={"$3"}
												className={`w-100 ${
													keyboard === "$3"
														? "text-white custom-primary-outline"
														: "text-black wtc-bg-secondary"
												}`}
												fontSize={24}
												height={(screenSize.height - 265) / 6}
												onClick={() => handleKeyboardAction("$3")}
											/>
										</div>
									</div>
									<div className="row">
										<div className="col-sm-4 ps-0">
											<WtcButton
												disabled={!ServiceTip}
												label={"$4"}
												className={`w-100 ${
													keyboard === "$4"
														? "text-white custom-primary-outline"
														: "text-black wtc-bg-secondary"
												}`}
												fontSize={24}
												height={(screenSize.height - 265) / 6}
												onClick={() => handleKeyboardAction("$4")}
											/>
										</div>
										<div className="col-sm-4 ps-0">
											<WtcButton
												disabled={!ServiceTip}
												label={"$5"}
												className={`w-100 ${
													keyboard === "$5"
														? "text-white custom-primary-outline"
														: "text-black wtc-bg-secondary"
												}`}
												fontSize={24}
												height={(screenSize.height - 265) / 6}
												onClick={() => handleKeyboardAction("$5")}
											/>
										</div>
										<div className="col-sm-4 ps-0">
											<WtcButton
												disabled={!ServiceTip}
												label={"$6"}
												className={`w-100 ${
													keyboard === "$6"
														? "text-white custom-primary-outline"
														: "text-black wtc-bg-secondary"
												}`}
												fontSize={24}
												height={(screenSize.height - 265) / 6}
												onClick={() => handleKeyboardAction("$6")}
											/>
										</div>
									</div>
									<div className="row py-1">
										<div className="col-sm-4 ps-0">
											<WtcButton
												disabled={!ServiceTip}
												label={"$7"}
												className={`w-100 ${
													keyboard === "$7"
														? "text-white custom-primary-outline"
														: "text-black wtc-bg-secondary"
												}`}
												fontSize={24}
												height={(screenSize.height - 265) / 6}
												onClick={() => handleKeyboardAction("$7")}
											/>
										</div>
										<div className="col-sm-4 ps-0">
											<WtcButton
												disabled={!ServiceTip}
												label={"$8"}
												className={`w-100 ${
													keyboard === "$8"
														? "text-white custom-primary-outline"
														: "text-black wtc-bg-secondary"
												}`}
												fontSize={24}
												height={(screenSize.height - 265) / 6}
												onClick={() => handleKeyboardAction("$8")}
											/>
										</div>
										<div className="col-sm-4 ps-0">
											<WtcButton
												disabled={!ServiceTip}
												label={"$9"}
												className={`w-100 ${
													keyboard === "$9"
														? "text-white custom-primary-outline"
														: "text-black wtc-bg-secondary"
												}`}
												fontSize={24}
												height={(screenSize.height - 265) / 6}
												onClick={() => handleKeyboardAction("$9")}
											/>
										</div>
									</div>
									<div className="row ">
										<div className="col-sm-4 ps-0">
											<WtcButton
												disabled={!ServiceTip}
												label={"$10"}
												className={`w-100 ${
													keyboard === "$10"
														? "text-white wtc-bg-primary"
														: "text-black wtc-bg-secondary"
												}`}
												fontSize={24}
												height={(screenSize.height - 265) / 6}
												onClick={() => handleKeyboardAction("$10")}
											/>
										</div>
										<div className="col-sm-4 ps-0">
											<WtcButton
												disabled={!ServiceTip}
												label={"$12"}
												className={`w-100 ${
													keyboard === "$12"
														? "text-white wtc-bg-primary"
														: "text-black wtc-bg-secondary"
												}`}
												fontSize={24}
												height={(screenSize.height - 265) / 6}
												onClick={() => handleKeyboardAction("$12")}
											/>
										</div>
										<div className="col-sm-4 ps-0">
											<WtcButton
												disabled={!ServiceTip}
												label={"$15"}
												className={`w-100 ${
													keyboard === "$15"
														? "text-white wtc-bg-primary"
														: "text-black wtc-bg-secondary"
												}`}
												fontSize={24}
												height={(screenSize.height - 265) / 6}
												onClick={() => setKeyboard("$15")}
											/>
										</div>
									</div>
								</div>
								<div className="h-25 mt-1">
									<div className="row h-100">
										<div className="col-sm-12 mt-1 p-2 py-3 fw-bold">
											<div className="fs-5">
												{t("tips")}:&ensp;
												<span className="text-danger fs-5">
													${" "}
													{toLocaleStringRefactor(
														toFixedRefactor(
															ListServiceTip.reduce(
																(total, current) => total + current.tip || 0,
																0
															),
															2
														)
													)}
												</span>
											</div>
										</div>
										<div className="col-sm-12 mt-1 h-50">
											<WtcButton
												label={t("remove_alltip")}
												className=" w-100 text-white bg-danger"
												height={45}
												onClick={RemoveAllTip}
											/>
										</div>
									</div>
								</div>
							</div>
							<div className="col-md-4 h-100">
								<div className="row py-1">
									<div className="col-sm-4 ps-0">
										<WtcButton
											disabled={!ServiceTip}
											label={"1"}
											className={`w-100 ${
												keyboard === "1"
													? "text-white custom-primary-outline"
													: "text-black wtc-bg-secondary"
											}`}
											fontSize={24}
											height={(screenSize.height - 280) / 4.1}
											onClick={() => handleKeyboardAction("1")}
										/>
									</div>
									<div className="col-sm-4 ps-0">
										<WtcButton
											disabled={!ServiceTip}
											label={"2"}
											className={`w-100 ${
												keyboard === "2"
													? "text-white custom-primary-outline"
													: "text-black wtc-bg-secondary"
											}`}
											fontSize={24}
											height={(screenSize.height - 280) / 4.1}
											onClick={() => handleKeyboardAction("2")}
										/>
									</div>
									<div className="col-sm-4 ps-0">
										<WtcButton
											disabled={!ServiceTip}
											label={"3"}
											className={`w-100 ${
												keyboard === "3"
													? "text-white custom-primary-outline"
													: "text-black wtc-bg-secondary"
											}`}
											fontSize={24}
											height={(screenSize.height - 280) / 4.1}
											onClick={() => handleKeyboardAction("3")}
										/>
									</div>
								</div>
								<div className="row">
									<div className="col-sm-4 ps-0">
										<WtcButton
											disabled={!ServiceTip}
											label={"4"}
											className={`w-100 ${
												keyboard === "4"
													? "text-white custom-primary-outline"
													: "text-black wtc-bg-secondary"
											}`}
											fontSize={24}
											height={(screenSize.height - 280) / 4.1}
											onClick={() => handleKeyboardAction("4")}
										/>
									</div>
									<div className="col-sm-4 ps-0">
										<WtcButton
											disabled={!ServiceTip}
											label={"5"}
											className={`w-100 ${
												keyboard === "5"
													? "text-white custom-primary-outline"
													: "text-black wtc-bg-secondary"
											}`}
											fontSize={24}
											height={(screenSize.height - 280) / 4.1}
											onClick={() => handleKeyboardAction("5")}
										/>
									</div>
									<div className="col-sm-4 ps-0">
										<WtcButton
											disabled={!ServiceTip}
											label={"6"}
											className={`w-100 ${
												keyboard === "6"
													? "text-white custom-primary-outline"
													: "text-black wtc-bg-secondary"
											}`}
											fontSize={24}
											height={(screenSize.height - 280) / 4.1}
											onClick={() => handleKeyboardAction("6")}
										/>
									</div>
								</div>
								<div className="row py-1">
									<div className="col-sm-4 ps-0">
										<WtcButton
											disabled={!ServiceTip}
											label={"7"}
											className={`w-100 ${
												keyboard === "7"
													? "text-white custom-primary-outline"
													: "text-black wtc-bg-secondary"
											}`}
											fontSize={24}
											height={(screenSize.height - 280) / 4.1}
											onClick={() => handleKeyboardAction("7")}
										/>
									</div>
									<div className="col-sm-4 ps-0">
										<WtcButton
											disabled={!ServiceTip}
											label={"8"}
											className={`w-100 ${
												keyboard === "8"
													? "text-white custom-primary-outline"
													: "text-black wtc-bg-secondary"
											}`}
											fontSize={24}
											height={(screenSize.height - 280) / 4.1}
											onClick={() => handleKeyboardAction("8")}
										/>
									</div>
									<div className="col-sm-4 ps-0">
										<WtcButton
											disabled={!ServiceTip}
											label={"9"}
											className={`w-100 ${
												keyboard === "9"
													? "text-white custom-primary-outline"
													: "text-black wtc-bg-secondary"
											}`}
											fontSize={24}
											height={(screenSize.height - 280) / 4.1}
											onClick={() => handleKeyboardAction("9")}
										/>
									</div>
								</div>
								<div className="row ">
									<div className="col-sm-4 ps-0">
										<WtcButton
											disabled={!ServiceTip}
											label={"."}
											className={`w-100 ${
												keyboard === "."
													? "text-white wtc-bg-primary"
													: "text-black wtc-bg-secondary"
											}`}
											fontSize={24}
											height={(screenSize.height - 280) / 4.1}
											onClick={() => handleKeyboardAction(".")}
										/>
									</div>
									<div className="col-sm-4 ps-0">
										<WtcButton
											disabled={!ServiceTip}
											label={"0"}
											className={`w-100 ${
												keyboard === "0"
													? "text-white wtc-bg-primary"
													: "text-black wtc-bg-secondary"
											}`}
											fontSize={24}
											height={(screenSize.height - 280) / 4.1}
											onClick={() => handleKeyboardAction("0")}
										/>
									</div>
									<div className="col-sm-4 ps-0">
										<WtcButton
											disabled={!ServiceTip}
											label={""}
											icon="ri-delete-back-2-line"
											className={`w-100 ${
												keyboard === "BACK"
													? "text-white wtc-bg-primary"
													: "text-black wtc-bg-secondary-2"
											}`}
											fontSize={24}
											height={(screenSize.height - 280) / 4.1}
											onClick={() => setKeyboard("BACK")}
										/>
									</div>
								</div>
								{/* </div> */}
							</div>
						</div>
					}
					closeIcon
					footer={
						<div className=" d-flex wtc-bg-white align-items-center justify-content-end">
							<Button
								type="button"
								label={t("action.close")}
								className="me-3 bg-white text-blue dialog-cancel-button"
								onClick={handleCloseDialogTip}
							/>
							<Button
								type="button"
								label={t("edit_tip")}
								className="wtc-bg-primary text-white dialog-cancel-button"
								icon="ri ri-edit-line"
								onClick={handleSubmitTip}
							/>
						</div>
					}
				/>
			</div>
			<div ref={refDialog}>
				<DynamicDialog
					width={isMobile ? "90vw" : "85vw"}
					// minHeight={"100vh"}
					height={screenSize.height - 130}
					visible={dialogVisibleDiscount}
					mode={"add"}
					position={"center"}
					title={t("discount")}
					okText=""
					cancelText=""
					draggable={false}
					isBackgroundGray={true}
					resizeable={false}
					onClose={handleCloseDialogDiscount}
					body={
						<div className="row h-100 w-100 py-1">
							<div className="col-md-4 ps-3" style={{ height: screenSize.height - 265 }}>
								<WtcCard
									classNameBody="flex-grow-1 px-1 my-0"
									className="h-100"
									body={
										<>
											<div style={{ height: 257 }}>
												<WtcCard
													hideBorder={false}
													title={<span className="fs-title">Discount By</span>}
													classNameBody="flex-grow-1 px-1 my-0"
													className="h-100"
													body={
														<div className="row">
															<div className="col-sm-12">
																<div className="flex flex-wrap row">
																	<div className="col-sm-5">
																		<div className="flex align-items-center p-1">
																			<RadioButton
																				inputId="ingredient1"
																				name={t("coupons")}
																				value="coupons"
																				style={{
																					width: "30px",
																					height: "30px",
																					alignItems: "center",
																				}} // Set size here
																				onChange={(e) =>
																					onChangeTypeDiscount(e)
																				}
																				checked={byDiscount === "coupons"}
																			/>
																			<label
																				htmlFor="ingredient1"
																				className="fs-title"
																			>
																				&ensp;{t("coupons")}
																			</label>
																		</div>
																	</div>
																	<div className="col-sm-7">
																		<div className="flex align-items-center p-1">
																			<RadioButton
																				inputId="ingredient2"
																				name={t("store_discount")}
																				value="storeDiscount"
																				style={{
																					width: "30px",
																					height: "30px",
																					alignItems: "center",
																				}} // Set size here
																				onChange={(e) =>
																					onChangeTypeDiscount(e)
																				}
																				checked={byDiscount === "storeDiscount"}
																			/>
																			<label
																				htmlFor="ingredient2"
																				className="fs-title"
																			>
																				&ensp;{t("store_discount")}
																			</label>
																		</div>
																	</div>
																	{newOderState.ListServiceClick?.Employee ? (
																		<>
																			<div className="col-sm-5">
																				<div className="d-flex align-items-center p-1">
																					<RadioButton
																						inputId="ingredient3"
																						name={t("store_empl")}
																						value="Empl"
																						style={{
																							width: "30px",
																							height: "30px",
																							alignItems: "center",
																						}} // Set size here
																						onChange={(e) =>
																							onChangeTypeDiscount(e)
																						}
																						checked={byDiscount === "Empl"}
																					/>
																					<label
																						htmlFor="ingredient3"
																						className="fs-title ms-2"
																					>
																						{newOderState.ListServiceClick
																							.Employee.profile
																							.firstName +
																							" " +
																							newOderState
																								.ListServiceClick
																								.Employee.profile
																								.lastName}
																					</label>
																				</div>
																			</div>
																			<div className="col-sm-7">
																				<div className="d-flex align-items-center p-1">
																					<RadioButton
																						inputId="ingredient4"
																						name={t("store_empl")}
																						value="storeEmployee"
																						style={{
																							width: "30px",
																							height: "30px",
																							alignItems: "center",
																						}}
																						onChange={(e) =>
																							onChangeTypeDiscount(e)
																						}
																						checked={
																							byDiscount ===
																							"storeEmployee"
																						}
																					/>
																					<label
																						htmlFor="ingredient4"
																						className="fs-title ms-2"
																					>
																						{t("store")}/
																						{newOderState.ListServiceClick
																							.Employee.profile
																							.firstName +
																							" " +
																							newOderState
																								.ListServiceClick
																								.Employee.profile
																								.lastName}
																					</label>
																				</div>
																			</div>
																		</>
																	) : (
																		<div className="col-sm-12 ps-0">
																			<div className="flex align-items-center p-2">
																				<RadioButton
																					inputId="ingredient3"
																					name={t("store_empl")}
																					value="storeEmployees"
																					style={{
																						width: "30px",
																						height: "30px",
																						alignItems: "center",
																					}} // Set size here
																					onChange={(e) =>
																						onChangeTypeDiscount(e)
																					}
																					checked={
																						byDiscount === "storeEmployees"
																					}
																				/>
																				<label
																					htmlFor="ingredient3"
																					className="fs-title"
																				>
																					&ensp;{t("store_empl")}
																				</label>
																			</div>
																		</div>
																	)}
																</div>
															</div>
															<div className="col-md-6" style={{ height: 72 }}>
																<WtcInputIconText
																	placeHolder={t("coupons")}
																	formik={formik}
																	value={formik.values.coupon}
																	maxLenght={20}
																	field="coupon"
																/>
															</div>
															<div className="col-md-6" style={{ height: 72 }}>
																<WtcDropdownIconText
																	filtler={false}
																	disabled={false}
																	placeHolder={t("discount_type")}
																	options={[
																		{
																			label: t("NONE"),
																			value: { type: "", value: 0 },
																		},
																		{
																			label: t("FACEBOOK 15%"),
																			value: { type: "FACEBOOK", value: 15 },
																		},
																		{
																			label: t("ZALO 15%"),
																			value: { type: "ZALO", value: 15 },
																		},
																		{
																			label: t("SKYPE 20%"),
																			value: { type: "SKYPE", value: 20 },
																		},
																	]}
																	field="discountType"
																	formik={formik}
																	value={formik.values.discountType}
																	onChange={(e) => {
																		console.log("🚀 ~ OrderAction ~ value:", e);
																		handleOnChangeDiscountType(e);
																	}}
																/>
															</div>
														</div>
													}
												/>
											</div>
											<div className="" style={{ height: screenSize.height - 558 }}>
												<div className="h-100 pe-1" style={{ overflowY: "auto" }}>
													{listDiscount.map((item, index) => {
														return (
															<div key={index}>
																{item.IsPercent ? (
																	<>
																		<div
																			className={`col-sm-12 w-100 margin-bottom-1`}
																		>
																			<div
																				style={{
																					borderRadius: 11,
																					height: 45,
																					border: "1px solid transparent",
																				}}
																			>
																				<div
																					className={`d-flex w-100 p-1 h-100 index-key`}
																					style={{
																						background: "#FCFCFD",
																						borderRadius: 11,
																						height: "100%",
																						border: "1px solid #F1F3F6",
																					}}
																				>
																					<div
																						className="ms-2 h-100 flex-grow-1"
																						style={{
																							overflow: "hidden",
																							whiteSpace: "nowrap",
																							textOverflow: "ellipsis",
																						}}
																					>
																						<div className="d-flex">
																							<div className="label-name-service p-1 flex-grow-1">
																								{getNameDiscount(item)}{" "}
																								-{" "}
																								<span className="wtc-text-primary fw-bold">
																									{Number(
																										item.ValuePercent
																									) * 100}
																									%
																								</span>{" "}
																							</div>
																							<div
																								className="label-name-service flex-shrink-1 w-25"
																								style={{
																									textAlign: "end",
																								}}
																							>
																								{
																									<i
																										className="fw-normal ri-delete-bin-line text-muted fs-4 p-2"
																										onClick={() =>
																											handleRemoveDiscount(
																												item._id
																											)
																										}
																									></i>
																								}
																							</div>
																						</div>
																					</div>
																				</div>
																			</div>
																		</div>
																	</>
																) : (
																	<>
																		<div
																			className={`col-sm-12 w-100 margin-bottom-1`}
																		>
																			<div
																				style={{
																					borderRadius: 11,
																					height: 45,
																					border: "1px solid transparent",
																				}}
																			>
																				<div
																					className={`d-flex w-100 p-1 h-100 index-key`}
																					style={{
																						background: "#FCFCFD",
																						borderRadius: 11,
																						height: "100%",
																						border: "1px solid #F1F3F6",
																					}}
																				>
																					<div
																						className="ms-2 h-100 flex-grow-1"
																						style={{
																							overflow: "hidden",
																							whiteSpace: "nowrap",
																							textOverflow: "ellipsis",
																						}}
																					>
																						<div className="d-flex">
																							<div className="label-name-service p-1 flex-grow-1">
																								{getNameDiscount(item)}{" "}
																								-{" "}
																								<span className="wtc-text-primary fw-bold">
																									${" "}
																									{toLocaleStringRefactor(
																										toFixedRefactor(
																											item.TotalDisscount,
																											2
																										)
																									)}
																								</span>{" "}
																							</div>
																							<div
																								className="label-name-service flex-shrink-1 w-25"
																								style={{
																									textAlign: "end",
																								}}
																							>
																								{
																									<i
																										className="fw-normal ri-delete-bin-line text-muted fs-4 p-2"
																										onClick={() =>
																											handleRemoveDiscount(
																												item._id
																											)
																										}
																									></i>
																								}
																							</div>
																						</div>
																					</div>
																				</div>
																			</div>
																		</div>
																	</>
																)}
															</div>
														);
													})}
												</div>
											</div>
										</>
									}
								/>
							</div>
							<div className="col-md-4 h-100">
								{typeQuickKey == "dollar" ? (
									<div className="h-75">
										<div className="row pb-2">
											<div className="col-sm-4">
												<WtcButton
													disabled={!true}
													label={"$1"}
													className={`w-100 ${
														keyboard === "$1"
															? "text-white custom-primary-outline"
															: "text-black wtc-bg-secondary"
													}`}
													fontSize={24}
													height={(screenSize.height - 260) / 6}
													onClick={() => handleKeyboardAction("$1")}
												/>
											</div>
											<div className="col-sm-4">
												<WtcButton
													disabled={!true}
													label={"$2"}
													className={`w-100 ${
														keyboard === "$2"
															? "text-white custom-primary-outline"
															: "text-black wtc-bg-secondary"
													}`}
													fontSize={24}
													height={(screenSize.height - 260) / 6}
													onClick={() => handleKeyboardAction("$2")}
												/>
											</div>
											<div className="col-sm-4">
												<WtcButton
													disabled={!true}
													label={"$3"}
													className={`w-100 ${
														keyboard === "$3"
															? "text-white custom-primary-outline"
															: "text-black wtc-bg-secondary"
													}`}
													fontSize={24}
													height={(screenSize.height - 260) / 6}
													onClick={() => handleKeyboardAction("$3")}
												/>
											</div>
										</div>
										<div className="row">
											<div className="col-sm-4">
												<WtcButton
													disabled={!true}
													label={"$5"}
													className={`w-100 ${
														keyboard === "$5"
															? "text-white custom-primary-outline"
															: "text-black wtc-bg-secondary"
													}`}
													fontSize={24}
													height={(screenSize.height - 260) / 6}
													onClick={() => handleKeyboardAction("$5")}
												/>
											</div>
											<div className="col-sm-4">
												<WtcButton
													disabled={!true}
													label={"$10"}
													className={`w-100 ${
														keyboard === "$10"
															? "text-white custom-primary-outline"
															: "text-black wtc-bg-secondary"
													}`}
													fontSize={24}
													height={(screenSize.height - 260) / 6}
													onClick={() => handleKeyboardAction("$10")}
												/>
											</div>
											<div className="col-sm-4">
												<WtcButton
													disabled={!true}
													label={"$15"}
													className={`w-100 ${
														keyboard === "$15"
															? "text-white custom-primary-outline"
															: "text-black wtc-bg-secondary"
													}`}
													fontSize={24}
													height={(screenSize.height - 260) / 6}
													onClick={() => handleKeyboardAction("$15")}
												/>
											</div>
										</div>
										<div className="row py-2">
											<div className="col-sm-4">
												<WtcButton
													disabled={!true}
													label={"$20"}
													className={`w-100 ${
														keyboard === "$20"
															? "text-white custom-primary-outline"
															: "text-black wtc-bg-secondary"
													}`}
													fontSize={24}
													height={(screenSize.height - 260) / 6}
													onClick={() => handleKeyboardAction("$20")}
												/>
											</div>
											<div className="col-sm-4">
												<WtcButton
													disabled={!true}
													label={"$25"}
													className={`w-100 ${
														keyboard === "$25"
															? "text-white custom-primary-outline"
															: "text-black wtc-bg-secondary"
													}`}
													fontSize={24}
													height={(screenSize.height - 260) / 6}
													onClick={() => handleKeyboardAction("$25")}
												/>
											</div>
											<div className="col-sm-4">
												<WtcButton
													disabled={!true}
													label={"$50"}
													className={`w-100 ${
														keyboard === "$50"
															? "text-white custom-primary-outline"
															: "text-black wtc-bg-secondary"
													}`}
													fontSize={24}
													height={(screenSize.height - 260) / 6}
													onClick={() => handleKeyboardAction("$50")}
												/>
											</div>
										</div>
										<div className="row ">
											<div className="col-sm-6">
												<WtcButton
													label={"Switch to %"}
													className={`w-100 ${
														keyboard === "Switch"
															? "text-white wtc-bg-primary"
															: "text-black wtc-bg-secondary"
													}`}
													fontSize={24}
													height={(screenSize.height - 260) / 6}
													onClick={() => handleclickSwitch("Switch")}
												/>
											</div>
											<div className="col-sm-6">
												<WtcButton
													label={"Clear"}
													className={`w-100 ${
														keyboard === "Clear"
															? "text-white wtc-bg-primary"
															: "text-black wtc-bg-secondary"
													}`}
													fontSize={24}
													height={(screenSize.height - 260) / 6}
													onClick={() => setKeyboard("Clear")}
												/>
											</div>
										</div>
									</div>
								) : (
									<div className="h-75">
										<div className="row pb-2">
											<div className="col-sm-4">
												<WtcButton
													disabled={!true}
													label={"1%"}
													className={`w-100 ${
														keyboard === "1%"
															? "text-white custom-primary-outline"
															: "text-black wtc-bg-secondary"
													}`}
													fontSize={24}
													height={(screenSize.height - 260) / 6}
													onClick={() => handleKeyboardAction("1%")}
												/>
											</div>
											<div className="col-sm-4">
												<WtcButton
													disabled={!true}
													label={"5%"}
													className={`w-100 ${
														keyboard === "5%"
															? "text-white custom-primary-outline"
															: "text-black wtc-bg-secondary"
													}`}
													fontSize={24}
													height={(screenSize.height - 260) / 6}
													onClick={() => handleKeyboardAction("5%")}
												/>
											</div>
											<div className="col-sm-4">
												<WtcButton
													disabled={!true}
													label={"10%"}
													className={`w-100 ${
														keyboard === "10%"
															? "text-white custom-primary-outline"
															: "text-black wtc-bg-secondary"
													}`}
													fontSize={24}
													height={(screenSize.height - 260) / 6}
													onClick={() => handleKeyboardAction("10%")}
												/>
											</div>
										</div>
										<div className="row">
											<div className="col-sm-4">
												<WtcButton
													disabled={!true}
													label={"15%"}
													className={`w-100 ${
														keyboard === "15%"
															? "text-white custom-primary-outline"
															: "text-black wtc-bg-secondary"
													}`}
													fontSize={24}
													height={(screenSize.height - 260) / 6}
													onClick={() => handleKeyboardAction("15%")}
												/>
											</div>
											<div className="col-sm-4">
												<WtcButton
													disabled={!true}
													label={"20%"}
													className={`w-100 ${
														keyboard === "20%"
															? "text-white custom-primary-outline"
															: "text-black wtc-bg-secondary"
													}`}
													fontSize={24}
													height={(screenSize.height - 260) / 6}
													onClick={() => handleKeyboardAction("20%")}
												/>
											</div>
											<div className="col-sm-4">
												<WtcButton
													disabled={!true}
													label={"25%"}
													className={`w-100 ${
														keyboard === "25%"
															? "text-white custom-primary-outline"
															: "text-black wtc-bg-secondary"
													}`}
													fontSize={24}
													height={(screenSize.height - 260) / 6}
													onClick={() => handleKeyboardAction("25%")}
												/>
											</div>
										</div>
										<div className="row py-2">
											<div className="col-sm-4">
												<WtcButton
													disabled={!true}
													label={"30%"}
													className={`w-100 ${
														keyboard === "30%"
															? "text-white custom-primary-outline"
															: "text-black wtc-bg-secondary"
													}`}
													fontSize={24}
													height={(screenSize.height - 260) / 6}
													onClick={() => handleKeyboardAction("30%")}
												/>
											</div>
											<div className="col-sm-4">
												<WtcButton
													disabled={!true}
													label={"50%"}
													className={`w-100 ${
														keyboard === "50%"
															? "text-white custom-primary-outline"
															: "text-black wtc-bg-secondary"
													}`}
													fontSize={24}
													height={(screenSize.height - 260) / 6}
													onClick={() => handleKeyboardAction("50%")}
												/>
											</div>
											<div className="col-sm-4">
												<WtcButton
													disabled={!true}
													label={"100%"}
													className={`w-100 ${
														keyboard === "100%"
															? "text-white custom-primary-outline"
															: "text-black wtc-bg-secondary"
													}`}
													fontSize={24}
													height={(screenSize.height - 260) / 6}
													onClick={() => handleKeyboardAction("100%")}
												/>
											</div>
										</div>
										<div className="row ">
											<div className="col-sm-6">
												<WtcButton
													label={"Switch to $"}
													className={`w-100 ${
														keyboard === "Switch"
															? "text-white wtc-bg-primary"
															: "text-black wtc-bg-secondary"
													}`}
													fontSize={24}
													height={(screenSize.height - 260) / 6}
													onClick={() => handleclickSwitch("Switch")}
												/>
											</div>
											<div className="col-sm-6">
												<WtcButton
													label={"Clear"}
													className={`w-100 ${
														keyboard === "$15"
															? "text-white wtc-bg-primary"
															: "text-black wtc-bg-secondary"
													}`}
													fontSize={24}
													height={(screenSize.height - 260) / 6}
													onClick={() => setKeyboard("Clear")}
												/>
											</div>
										</div>
									</div>
								)}

								<div className="h-25 mt-1">
									<div className="row h-100">
										<div className="col-sm-12 mt-1 p-2 py-2">
											<div className="fs-5">
												{t("discount")}:&ensp;
												<span className="text-danger fs-4 fw-bold">
													${" "}
													{toLocaleStringRefactor(toFixedRefactor(Number(moneyDiscount), 2))}
												</span>
											</div>
										</div>
										<div className="col-sm-12 mt-1 h-50">
											<WtcButton
												label={t("remove_alldis")}
												className=" w-100 text-white bg-danger"
												height={45}
												disabled={listDiscount.length == 0}
												onClick={() => handleRemoveDiscount(undefined)}
											/>
										</div>
									</div>
								</div>
							</div>
							<div className="col-md-4 h-100">
								<div className="row pb-2">
									<div className="col-sm-4">
										<WtcButton
											disabled={!true}
											label={"1"}
											className={`w-100 ${
												keyboard === "1"
													? "text-white custom-primary-outline"
													: "text-black wtc-bg-secondary"
											}`}
											fontSize={24}
											height={(screenSize.height - 280) / 4.1}
											onClick={() => handleKeyboardAction("1")}
										/>
									</div>
									<div className="col-sm-4">
										<WtcButton
											disabled={!true}
											label={"2"}
											className={`w-100 ${
												keyboard === "2"
													? "text-white custom-primary-outline"
													: "text-black wtc-bg-secondary"
											}`}
											fontSize={24}
											height={(screenSize.height - 280) / 4.1}
											onClick={() => handleKeyboardAction("2")}
										/>
									</div>
									<div className="col-sm-4">
										<WtcButton
											disabled={!true}
											label={"3"}
											className={`w-100 ${
												keyboard === "3"
													? "text-white custom-primary-outline"
													: "text-black wtc-bg-secondary"
											}`}
											fontSize={24}
											height={(screenSize.height - 280) / 4.1}
											onClick={() => handleKeyboardAction("3")}
										/>
									</div>
								</div>
								<div className="row">
									<div className="col-sm-4">
										<WtcButton
											disabled={!true}
											label={"4"}
											className={`w-100 ${
												keyboard === "4"
													? "text-white custom-primary-outline"
													: "text-black wtc-bg-secondary"
											}`}
											fontSize={24}
											height={(screenSize.height - 280) / 4.1}
											onClick={() => handleKeyboardAction("4")}
										/>
									</div>
									<div className="col-sm-4">
										<WtcButton
											disabled={!true}
											label={"5"}
											className={`w-100 ${
												keyboard === "5"
													? "text-white custom-primary-outline"
													: "text-black wtc-bg-secondary"
											}`}
											fontSize={24}
											height={(screenSize.height - 280) / 4.1}
											onClick={() => handleKeyboardAction("5")}
										/>
									</div>
									<div className="col-sm-4">
										<WtcButton
											disabled={!true}
											label={"6"}
											className={`w-100 ${
												keyboard === "6"
													? "text-white custom-primary-outline"
													: "text-black wtc-bg-secondary"
											}`}
											fontSize={24}
											height={(screenSize.height - 280) / 4.1}
											onClick={() => handleKeyboardAction("6")}
										/>
									</div>
								</div>
								<div className="row py-2">
									<div className="col-sm-4">
										<WtcButton
											disabled={!true}
											label={"7"}
											className={`w-100 ${
												keyboard === "7"
													? "text-white custom-primary-outline"
													: "text-black wtc-bg-secondary"
											}`}
											fontSize={24}
											height={(screenSize.height - 280) / 4.1}
											onClick={() => handleKeyboardAction("7")}
										/>
									</div>
									<div className="col-sm-4">
										<WtcButton
											disabled={!true}
											label={"8"}
											className={`w-100 ${
												keyboard === "8"
													? "text-white custom-primary-outline"
													: "text-black wtc-bg-secondary"
											}`}
											fontSize={24}
											height={(screenSize.height - 280) / 4.1}
											onClick={() => handleKeyboardAction("8")}
										/>
									</div>
									<div className="col-sm-4">
										<WtcButton
											disabled={!true}
											label={"9"}
											className={`w-100 ${
												keyboard === "9"
													? "text-white custom-primary-outline"
													: "text-black wtc-bg-secondary"
											}`}
											fontSize={24}
											height={(screenSize.height - 280) / 4.1}
											onClick={() => handleKeyboardAction("9")}
										/>
									</div>
								</div>
								<div className="row ">
									<div className="col-sm-4">
										<WtcButton
											disabled={!true}
											label={"."}
											className={`w-100 ${
												keyboard === "."
													? "text-white wtc-bg-primary"
													: "text-black wtc-bg-secondary"
											}`}
											fontSize={24}
											height={(screenSize.height - 280) / 4.1}
											onClick={() => handleKeyboardAction(".")}
										/>
									</div>
									<div className="col-sm-4">
										<WtcButton
											disabled={!true}
											label={"0"}
											className={`w-100 ${
												keyboard === "0"
													? "text-white wtc-bg-primary"
													: "text-black wtc-bg-secondary"
											}`}
											fontSize={24}
											height={(screenSize.height - 280) / 4.1}
											onClick={() => handleKeyboardAction("0")}
										/>
									</div>
									<div className="col-sm-4">
										<WtcButton
											disabled={!true}
											label={""}
											icon="ri-delete-back-2-line"
											className={`w-100 ${
												keyboard === "BACK"
													? "text-white wtc-bg-primary"
													: "text-black wtc-bg-secondary-2"
											}`}
											fontSize={24}
											height={(screenSize.height - 280) / 4.1}
											onClick={() => setKeyboard("BACK")}
										/>
									</div>
								</div>
							</div>
						</div>
					}
					closeIcon
					footer={
						<div className=" d-flex wtc-bg-white align-items-center justify-content-end">
							<Button
								type="button"
								label={t("action.close")}
								className="me-3 bg-white text-blue dialog-cancel-button"
								onClick={handleCloseDialogDiscount}
								style={{ height: 40 }}
							/>
							<Button
								type="button"
								label={t("add_discount")}
								className="wtc-bg-primary text-white dialog-cancel-button"
								icon="ri ri-add-line"
								onClick={handleClickSubmitDiscount}
								style={{ height: 40 }}
							/>
						</div>
					}
				/>
			</div>
		</>
	);
}
