import { t } from "i18next";
import { Button } from "primereact/button";
import { InputSwitch } from "primereact/inputswitch";
import { InputText } from "primereact/inputtext";
import { RadioButton } from "primereact/radiobutton";
import { useEffect, useRef, useState } from "react";
import { isMobile } from "react-device-detect";
import { useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { useAppSelector } from "../../app/hooks";
import useWindowSize from "../../app/screen";
import { orderStatus, paymentStatus } from "../../app/state";
import {
	CalDiscountListService,
	CheckRoleWithAction,
	FormatMoneyNumber,
	getValueStoreConfig,
	isCurrentTimeGreaterThanExpiration,
	MethodPayment,
	PageTarget,
} from "../../const";
import { GiftcardModel } from "../../models/category/Giftcard.model";
import { PaymentModel } from "../../models/category/Payment.model";
import { fetchGiftcard } from "../../slices/giftcard.slice";
import {
	addListPayment,
	addPayment,
	addPaymentCreditCard,
	deleteListPayment,
	editListPayment,
	resetActionState,
} from "../../slices/payment.slice";
import { completed, failed, processing } from "../../utils/alert.util";
import { toFixedRefactor, toLocaleStringRefactor } from "../../utils/string.ultil";
import DynamicDialog from "../DynamicDialog";
import IconButton from "../commons/IconButton";
import WtcButton from "../commons/WtcButton";
import WtcCard from "../commons/WtcCard";
import WtcMenuItem from "../commons/WtcMenuItem";
import { Tooltip } from "primereact/tooltip";
import { useNavigate } from "react-router-dom";
import feeCreditIcon from "../../assets/svg/fee_creditcard.svg";
import {
	createCode,
	displayOrderClover,
	paymentClover,
	refreshTokenClover,
	resetActionStateClover,
	resetPaymentStateClover,
	showThankClover,
	updateObjectPayment,
} from "../../slices/clover.slice";
import WtcRoleButton from "../commons/WtcRoleButton";
import { PrintPayment } from "./PrintPayment";
import { unwrapResult } from "@reduxjs/toolkit";
export default function PaymentMethod() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const paymentState = useAppSelector((state) => state.payment);
	const [showPrint, setShowPrint] = useState(false);
	const giftCardState = useAppSelector((state) => state.giftcard);
	const newOderState = useAppSelector((state) => state.newOder);
	const storeConfigState = useAppSelector((state) => state.storeconfig);
	const IsPaymentClover = getValueStoreConfig(storeConfigState.list, "isDeviceCreditCard");
	const cloverState = useAppSelector((state) => state.clover);
	const moneyPaied = paymentState.ListPayment.reduce((sum, payment) => sum + payment.amount, 0);
	const authState = useAppSelector((state) => state.auth);
	const totalFeeCreditcard = paymentState.ListPayment.reduce(
		(sum, payment) => sum + (payment?.feeCreditCard ? payment.feeCreditCard : 0),
		0
	);
	const [moneyEdit, setMoneyEdit] = useState(0);
	const totalRemaining = toLocaleStringRefactor(toFixedRefactor(paymentState.Total - moneyPaied, 2) + moneyEdit);
	const totalServices = newOderState.tempService.reduce(
		(accumulator, item) => accumulator + (item.ListService?.length || 0),
		0
	);
	const [dialogVisible, setDialogVisible] = useState(false);
	const [dialogVisibleGiftCard, setDialogVisibleGiftCard] = useState(false);
	const [disabledInputGiftCard, setDisabledInputGiftCard] = useState(false);
	const [actionDialog, setActionDialog] = useState<"add" | "edit">("add");
	const [paymentClick, setPaymentClick] = useState<PaymentModel>();
	const screenSize = useWindowSize();
	const [keyboard, setKeyboard] = useState("");
	const [typeChoosePayment, setTypeChoosePayment] = useState<"CREDIT_CARD" | "CASH" | "GIFT_CARD" | "">("");
	const [optionPaymentCreditCard, setOptionPaymentCreditCard] = useState<"zelle" | "vemo" | "cashapp">("zelle");
	const [inputMoney, setInputMoney] = useState("0");
	const [giftCardCode, setGiftCardCode] = useState("");
	const [giftCard, setGiftCard] = useState<GiftcardModel | undefined>();
	const divRef = useRef<HTMLDivElement | null>(null);
	const totalPaidAmount = paymentState.ListPayment.filter((payment) => payment.status === "PAID").reduce(
		(sum, payment) => sum + payment.amount,
		0
	);
	const [tempPayment, setTempPayment] = useState<PaymentModel | null>(null);
	const lineItems = newOderState.tempService.flatMap((item) => {
		return (
			item.ListService?.map((i) => {
				return {
					binName: [
						item?.Employee?.profile?.firstName || "",
						item?.Employee?.profile?.middleName || "",
						item?.Employee?.profile?.lastName || "",
					]
						.join(" ")
						.trim(),
					name: i?.displayName || "",
					price: `$${FormatMoneyNumber(i?.storePrice * i.unit) || "0.00"}`,
					quantity: i?.unit || 0,
				};
			}) || []
		);
	});
	const [checkedFee, setCheckedFee] = useState<boolean>(true);
	const getTaxRate = (data: any): number => {
		const taxRateInfo = data.find((item: any) => item.key === "taxRate");
		return taxRateInfo ? Number(taxRateInfo.value) : 0;
	};
	const getCreditCardFeeAmount = (data: any): number => {
		const taxRateInfo = data.find((item: any) => item.key === "creditCardFeeAmount");
		return taxRateInfo ? Number(taxRateInfo.value) : 0;
	};
	const handleKeyboardAction = (key: string) => {
		setKeyboard(key);
	};
	const scrollToBottom = () => {
		if (divRef.current) {
			divRef.current.scrollIntoView({ behavior: "smooth" });
		}
	};
	const handleClickChoosePay = (str: any) => {
		if (Number(totalRemaining) != 0) {
			if (str == MethodPayment.GIFTCARD) setDialogVisibleGiftCard(true);
			else setDialogVisible(true);
			setTypeChoosePayment(str);
		}
	};
	const handleClickEditPay = (item: PaymentModel) => {
		if (item.status != paymentStatus.paid) {
			setPaymentClick(item);
			setTypeChoosePayment(item.typePayment);
			setMoneyEdit(item.amount);
			setInputMoney(item.amount.toString());
			setActionDialog("edit");
			if (item.typePayment == MethodPayment.GIFTCARD) {
				setDialogVisibleGiftCard(true);
				setGiftCardCode(item?.giftCardId || "");
			} else setDialogVisible(true);
		}
	};
	const handleChange = (e: any) => {
		setOptionPaymentCreditCard(e.target.value);
	};
	const handleCloseDialog = () => {
		setDialogVisible(false);
		setDialogVisibleGiftCard(false);
		setTypeChoosePayment("");
		setInputMoney("0");
		setMoneyEdit(0);
		setGiftCardCode("");
		setDisabledInputGiftCard(false);
		setGiftCard(undefined);
	};
	const handleAddPaymentMethod = () => {
		let payment;
		if (typeChoosePayment == MethodPayment.CREDITCARD) {
			payment = new PaymentModel(
				uuidv4(),
				typeChoosePayment,
				Number(inputMoney),
				optionPaymentCreditCard,
				paymentStatus.inprocessing,
				undefined,
				checkedFee == true ? getCreditCardFeeAmount(storeConfigState.list) : 0
			);
		} else if (typeChoosePayment == MethodPayment.CASH)
			payment = new PaymentModel(
				uuidv4(),
				typeChoosePayment,
				Number(inputMoney),
				undefined,
				paymentStatus.inprocessing,
				undefined,
				null
			);
		else {
			payment = new PaymentModel(
				uuidv4(),
				typeChoosePayment,
				Number(inputMoney),
				undefined,
				paymentStatus.inprocessing,
				giftCard?.cardId,
				null
			);
		}
		// dispatch(addListPayment(payment));
		handleCloseDialog();
		setMoneyEdit(0);
		setInputMoney("0");
		scrollToBottom();
		setGiftCard(undefined);
		if (
			typeChoosePayment == MethodPayment.CREDITCARD &&
			Number(totalRemaining.replace(/,/g, "")) - payment.amount != 0
		) {
			setTempPayment(payment);
			const data = {
				amount: checkedFee
					? (payment.amount + getCreditCardFeeAmount(storeConfigState.list)) * 100
					: payment.amount * 100,
				externalPaymentId: uuidv4().replace(/-/g, ""),
			};
			const paymentObject = {
				orderId: paymentState.OrderId,
				details: [
					{
						method: MethodPayment.CREDITCARD,
						isCreditCardFee: checkedFee,
						totalTip: paymentState.TotalTip,
						amount: payment.amount,
						attributes: { optionPayment: payment.optionPayment },
					},
				],
			};
			if (IsPaymentClover) {
				dispatch(updateObjectPayment(paymentObject));
				//Go to clover
				handleCloverAction(() => handlePaymentClover(data));
			} else {
				dispatch(addListPayment(payment));
				dispatch(addPaymentCreditCard(paymentObject));
			}
		} else {
			dispatch(addListPayment(payment));
		}
	};
	const handlePaymentClover = async (data: any) => {
		dispatch(paymentClover(data));
	};

	const handleCloverAction = async (actionFunction: Function) => {
		try {
			// Kiểm tra nếu không có access token hoặc đã hết hạn
			if (
				!cloverState.accessToken ||
				cloverState.accessToken === "" ||
				isCurrentTimeGreaterThanExpiration(Number(cloverState.accessTokenExpiration))
			) {
				// Hàm xử lý logic kiểm tra refresh token
				const handleDispatch = async () => {
					if (
						!cloverState.refreshToken ||
						cloverState.refreshToken === "" ||
						isCurrentTimeGreaterThanExpiration(Number(cloverState.refreshTokenExpiration))
					) {
						const result = await dispatch(createCode());
						unwrapResult(result);
					} else {
						const result = await dispatch(refreshTokenClover(cloverState.refreshToken));
						unwrapResult(result);
					}
				};

				await handleDispatch();
				await actionFunction();
			} else if (!isCurrentTimeGreaterThanExpiration(Number(cloverState.accessTokenExpiration))) {
				await actionFunction();
			}
		} catch (error) {
			//dispatch fulfill mới chạy actionFunction ngược lại catch error
			// console.error("An error occurred in handleCloverAction:", error);
			throw error;
		}
	};

	const handleViewOrderClover = (data: any) => {
		dispatch(displayOrderClover(data));
	};
	const handleEditPaymentMethod = (item: PaymentModel | undefined) => {
		if (item) {
			const updatedItem = { ...item, amount: Number(inputMoney), typePayment: typeChoosePayment };
			dispatch(editListPayment(updatedItem));
			handleCloseDialog();
			setMoneyEdit(0);
			setActionDialog("add");
		}
	};
	const handleDeleteSumary = (_id: string) => {
		dispatch(deleteListPayment(_id));
		handleCloseDialog();
	};
	const menuItemPayment = () => {
		switch (typeChoosePayment) {
			case MethodPayment.CREDITCARD:
				return (
					<>
						<WtcMenuItem
							iconClassName="custom-processing-button background-white"
							icon="ri-bank-card-line"
							iconWidth={45}
							iconHeight={45}
							flexGrow1={
								<>
									{typeChoosePayment == MethodPayment.CREDITCARD && checkedFee == true ? (
										<>
											<div className="fs-5 text-end text-secondary fw-normal">
												{"$ " + getCreditCardFeeAmount(storeConfigState.list) + " + "}
												<span className="fw-bold wtc-text-primary">
													$ {FormatMoneyNumber(inputMoney)} =
												</span>
											</div>
											<div className="d-flex justify-content-end fw-bold fs-5 text-danger">
												<span>
													${" "}
													{FormatMoneyNumber(
														Number(inputMoney) +
															getCreditCardFeeAmount(storeConfigState.list)
													)}
												</span>
											</div>
										</>
									) : (
										<div className="fs-3" style={{ color: "red" }}>
											$ {FormatMoneyNumber(inputMoney)}
										</div>
									)}
								</>
							}
							body={
								<>
									<div className="fs-4">{t("credit_card")}</div>
									<div className="d-flex justify-content-center fw-normal">
										<span>
											{t("feeCreditcard")} (${getCreditCardFeeAmount(storeConfigState.list)})
										</span>
										&ensp;
										<InputSwitch
											checked={checkedFee}
											onChange={(e) => setCheckedFee(e.value)}
											style={{
												height: 22,
											}}
										/>
									</div>
								</>
							}
						/>
						<div className="row">
							<div className="col-sm-4">
								<div className="flex align-items-center p-1">
									<RadioButton
										inputId="zelle"
										name={t("zelle")}
										value="zelle"
										style={{ width: "30px", height: "30px", alignItems: "center" }}
										onChange={handleChange}
										checked={optionPaymentCreditCard == "zelle"}
									/>
									<label htmlFor="zelle" className="fs-5">
										&ensp;{t("Zelle")}
									</label>
								</div>
							</div>
							<div className="col-sm-4">
								<div className="flex align-items-center p-1">
									<RadioButton
										inputId="vemo"
										name={t("vemo")}
										value="vemo"
										style={{ width: "30px", height: "30px", alignItems: "center" }}
										onChange={handleChange}
										checked={optionPaymentCreditCard == "vemo"}
									/>
									<label htmlFor="vemo" className="fs-5">
										&ensp;{t("Vemo")}
									</label>
								</div>
							</div>
							<div className="col-sm-4">
								<div className="flex align-items-center p-1">
									<RadioButton
										inputId="cashapp"
										name={t("cashapp")}
										value="cashapp"
										style={{ width: "30px", height: "30px", alignItems: "center" }} // Set size here
										onChange={handleChange}
										checked={optionPaymentCreditCard == "cashapp"}
									/>
									<label htmlFor="cashapp" className="fs-5">
										&ensp;{t("CashApp")}
									</label>
								</div>
							</div>
						</div>
					</>
				);
			case MethodPayment.CASH:
				return (
					<>
						<WtcMenuItem
							iconClassName="custom-processing-button background-white"
							icon="ri-money-dollar-box-line"
							iconWidth={45}
							iconHeight={45}
							iconTooltip="ri-money-dollar-box-line"
							flexGrow1={
								<>
									<div className="fs-3" style={{ color: "red" }}>
										$ {FormatMoneyNumber(inputMoney)}
									</div>
								</>
							}
							body={
								<>
									<div className="fs-4">{t("cash")}</div>
								</>
							}
						/>
					</>
				);
			default:
				return null;
		}
	};
	const handleClickSearchGiftCard = () => {
		const item = giftCardState.list.find((item) => item.cardId == giftCardCode);
		const listPaymentWithGiftcard = paymentState.ListPayment.filter(
			(item) => item.giftCardId == giftCardCode && item.status == paymentStatus.inprocessing
		);
		const moneyIsInProcess = listPaymentWithGiftcard.reduce((sum, payment) => sum + payment.amount, 0);
		if (item) {
			item.remaining = item.remaining - moneyIsInProcess;
			setGiftCard(item);
			setDisabledInputGiftCard(true);
		} else {
			failed(t("not_found_gift") + ": " + giftCardCode);
		}
	};
	const handleClearGiftCard = () => {
		setGiftCardCode("");
		setGiftCard(undefined);
		setDisabledInputGiftCard(false);
		setInputMoney("0");
	};
	const handleViewExistsPayment = async () => {
		if (tempPayment) {
			const data = { ...tempPayment, status: paymentStatus.paid };
			dispatch(addListPayment(data));
			setTempPayment(null);
		}
		const payments = paymentState.ListPayment.map((item, index) => ({
			label: `Payment ${index + 1} - ${item.typePayment}`,
			amount: `$ ${
				item.feeCreditCard && item.feeCreditCard > 0
					? FormatMoneyNumber(item.amount + item.feeCreditCard) || "0.00"
					: FormatMoneyNumber(item.amount) || "0.00"
			}`,
		}));
		let remaining = paymentState.Total - moneyPaied + moneyEdit;
		if (tempPayment) {
			payments.push({
				label: `Payment ${paymentState.ListPayment.length + 1} - ${tempPayment.typePayment}`,
				amount: `$ ${
					tempPayment.feeCreditCard && tempPayment.feeCreditCard > 0
						? FormatMoneyNumber(tempPayment.amount + tempPayment.feeCreditCard) || "0.00"
						: FormatMoneyNumber(tempPayment.amount) || "0.00"
				}`,
			});
			remaining = remaining - tempPayment.amount;
		}
		const dataView = {
			total: "$" + FormatMoneyNumber(paymentState.Total),
			tax: "$" + FormatMoneyNumber(paymentState?.Tax),
			subtotal: "$" + FormatMoneyNumber(paymentState.Total),
			payments: payments,
			discounts: [
				{
					name: "Discount",
					amount:
						"$" +
						FormatMoneyNumber(
							paymentState.StoreDiscount + CalDiscountListService(newOderState.tempService)
						),
				},
				{
					name: "Tip",
					amount: "$" + FormatMoneyNumber(paymentState.TotalTip),
				},
			],
			amountRemaining: "$" + FormatMoneyNumber(remaining),
			lineItems: lineItems,
		};
		await handleCloverAction(() => handleViewOrderClover(dataView));
	};

	const handlePayment = () => {
		const ListPaymentCreditCard = paymentState.ListPayment.filter(
			(item) => item.typePayment == MethodPayment.CREDITCARD
		);
		const moneyPaidWithCredit = ListPaymentCreditCard.reduce((sum, payment) => sum + payment.amount, 0);
		if (moneyPaidWithCredit < paymentState.TotalTip) {
			if (paymentState.TotalTip > Number(totalRemaining)) {
				failed(t("error_tip_creditCard"));
				return;
			}
		}
		const ListPaymentProcess = paymentState.ListPayment.filter((item) => item.status == paymentStatus.inprocessing);
		if (ListPaymentProcess.length == 0) {
			failed(t("error_payment_not_method"));
			return;
		}
		const paymentObject = {
			orderId: paymentState.OrderId,
			details: ListPaymentProcess.map((payment) => ({
				method: payment.typePayment,
				isCreditCardFee: payment.typePayment == MethodPayment.CREDITCARD ? checkedFee : undefined,
				amount: payment.amount,
				attributes:
					payment.typePayment === MethodPayment.GIFTCARD
						? { cardId: payment.giftCardId }
						: payment.typePayment == MethodPayment.CREDITCARD
						? { optionPayment: payment.optionPayment }
						: undefined,
			})),
		};
		const paymentWithCredit = ListPaymentProcess.filter((item) => item.typePayment == "CREDIT_CARD");
		if (paymentWithCredit && paymentWithCredit.length > 0 && IsPaymentClover) {
			const data = {
				amount:
					paymentWithCredit[0]?.feeCreditCard && paymentWithCredit[0]?.feeCreditCard > 0
						? (paymentWithCredit[0].amount + getCreditCardFeeAmount(storeConfigState.list)) * 100
						: paymentWithCredit[0].amount * 100,
				externalPaymentId: uuidv4().replace(/-/g, ""),
			};
			dispatch(updateObjectPayment(paymentObject));
			//Go to clover
			handleCloverAction(() => handlePaymentClover(data));
		} else {
			dispatch(addPayment(paymentObject));
		}
	};
	useEffect(() => {
		if (keyboard !== "") {
			const oldValue = inputMoney;
			if (typeChoosePayment == MethodPayment.GIFTCARD && giftCard) {
				switch (keyboard) {
					case "+/-":
						let nV = Number(oldValue);
						if (nV > 0) {
							nV = -1 * nV;
						} else {
							nV = Math.abs(nV);
						}
						break;
					case "BACK":
						if (oldValue.length === 1) {
							setInputMoney("0");
						} else {
							const value = oldValue.toString().slice(0, -1);
							setInputMoney(value);
						}
						break;
					case ".":
						const existed = oldValue.toString().includes(".");
						if (!existed) {
							const value = oldValue.toString() + ".";
							setInputMoney(value);
						}
						break;
					case totalRemaining:
						const num = Number(totalRemaining.replace(/,/g, ""));
						if (giftCard.remaining >= num) {
							setInputMoney(Number(num).toString());
						} else {
							setInputMoney(giftCard.remaining.toString());
						}
						break;
					case "+20":
						const clearNumber2 = Number(totalRemaining.replace(/,/g, ""));
						if (giftCard.remaining >= clearNumber2) {
							if (Number(oldValue) + 20 > Number(clearNumber2)) {
								setInputMoney(Number(clearNumber2).toString());
							} else setInputMoney((Number(oldValue) + 20).toString());
						} else {
							setInputMoney(giftCard.remaining.toString());
						}
						break;
					case "+50":
						const clearNumber = Number(totalRemaining.replace(/,/g, ""));
						if (giftCard.remaining >= clearNumber) {
							if (Number(oldValue) + 50 > Number(clearNumber)) {
								setInputMoney(Number(clearNumber).toString());
							} else setInputMoney((Number(oldValue) + 50).toString());
						} else {
							setInputMoney(giftCard.remaining.toString());
						}
						break;
					default:
						const value = oldValue === "0" ? keyboard : oldValue + keyboard;
						if (Number(value) >= giftCard.remaining) {
							setInputMoney(giftCard.remaining.toString());
						} else {
							const clearNumber3 = Number(totalRemaining.replace(/,/g, ""));
							if (Number(value) > Number(clearNumber3)) {
								setInputMoney(Number(clearNumber3).toString());
							} else {
								const existedDot = value.toString().includes(".");
								if (existedDot) {
									const stringArr = oldValue.toString().split(".");
									const decimal = stringArr[1];
									if (decimal.toString().length < 2) {
										setInputMoney(value);
									}
								} else {
									setInputMoney(value);
								}
							}
						}
						break;
				}
			} else
				switch (keyboard) {
					case "+/-":
						let nV = Number(oldValue);
						if (nV > 0) {
							nV = -1 * nV;
						} else {
							nV = Math.abs(nV);
						}
						break;
					case "BACK":
						if (oldValue.length === 1) {
							setInputMoney("0");
						} else {
							const value = oldValue.toString().slice(0, -1);
							setInputMoney(value);
						}
						break;
					case ".":
						const existed = oldValue.toString().includes(".");
						if (!existed) {
							const value = oldValue.toString() + ".";
							setInputMoney(value);
						}
						break;
					case totalRemaining:
						const num = Number(totalRemaining.replace(/,/g, ""));
						setInputMoney(Number(num).toString());
						break;
					case "+20":
						const clearNumber2 = Number(totalRemaining.replace(/,/g, ""));
						if (Number(oldValue) + 20 > Number(clearNumber2)) {
							setInputMoney(Number(clearNumber2).toString());
						} else setInputMoney((Number(oldValue) + 20).toString());
						break;
					case "+50":
						const clearNumber = Number(totalRemaining.replace(/,/g, ""));
						if (Number(oldValue) + 50 > Number(clearNumber)) {
							setInputMoney(Number(clearNumber).toString());
						} else setInputMoney((Number(oldValue) + 50).toString());
						break;
					default:
						const value = oldValue === "0" ? keyboard : oldValue + keyboard;
						const clearNumber3 = Number(totalRemaining.replace(/,/g, ""));
						if (Number(value) > Number(clearNumber3)) {
							setInputMoney(Number(clearNumber3).toString());
						} else {
							const existedDot = value.toString().includes(".");
							if (existedDot) {
								const stringArr = oldValue.toString().split(".");
								const decimal = stringArr[1];
								if (decimal.toString().length < 2) {
									setInputMoney(value);
								}
							} else {
								setInputMoney(value);
							}
						}
						break;
				}
		}
		setTimeout(() => {
			setKeyboard("");
		}, 100);
	}, [keyboard]);
	useEffect(() => {
		dispatch(fetchGiftcard());
	}, []);
	useEffect(() => {
		if (newOderState.status.code == orderStatus.done && Number(totalRemaining) == 0) {
			handlePayment();
		}
	}, [totalRemaining]);

	useEffect(() => {
		if (paymentState.actionState) {
			const handleActionState = async () => {
				switch (paymentState.actionState.status!) {
					case "completed":
						completed();
						dispatch(resetActionState());
						dispatch(fetchGiftcard());
						setGiftCard(undefined);
						if (cloverState.dataPaymentCreditCard) {
							dispatch(updateObjectPayment(undefined));
						}
						if (IsPaymentClover) {
							if (paymentState.Status.code === paymentStatus.paid) {
								dispatch(showThankClover());
							} else {
								handleViewExistsPayment();
							}
						}
						break;

					case "loading":
						processing();
						break;

					case "failed":
						failed(t(paymentState.actionState.error!));
						dispatch(resetActionState());
						break;

					default:
						break;
				}
			};

			handleActionState();
		}
	}, [paymentState.actionState]);

	useEffect(() => {
		if (cloverState.actionState) {
			switch (cloverState.actionState.status!) {
				case "completed":
					completed();
					dispatch(resetActionStateClover());

					break;
				case "loading":
					processing();
					break;
				case "failed":
					failed(t(cloverState.actionState.error!));
					dispatch(resetActionStateClover());
					break;
			}
		}
	}, [cloverState.actionState]);
	useEffect(() => {
		if (cloverState.paymentState) {
			switch (cloverState.paymentState.status!) {
				case "completed":
					dispatch(resetPaymentStateClover());
					if (cloverState.dataPaymentCreditCard)
						dispatch(addPaymentCreditCard(cloverState.dataPaymentCreditCard));
					break;
				case "loading":
					processing(t(`processing_payment_clover`));
					break;
				case "failed":
					failed(t(cloverState.paymentState.error!));
					dispatch(resetPaymentStateClover());
					break;
			}
		}
	}, [cloverState.paymentState]);
	useEffect(() => {
		dispatch(resetActionStateClover());
		if (IsPaymentClover) {
			if (paymentState.ListPayment.length == 0) {
				const dataView = {
					total: "$" + FormatMoneyNumber(paymentState.Total),
					tax: "$" + FormatMoneyNumber(paymentState?.Tax),
					subtotal: "$" + FormatMoneyNumber(paymentState.Total),
					discounts: [
						{
							name: "Discount",
							amount:
								"$" +
								FormatMoneyNumber(
									paymentState.StoreDiscount + CalDiscountListService(newOderState.tempService)
								),
						},
						{
							name: "Tip",
							amount: "$" + FormatMoneyNumber(paymentState.TotalTip),
						},
					],
					lineItems: lineItems,
				};
				handleCloverAction(() => handleViewOrderClover(dataView));
			} else {
				if (paymentState.Status.code != paymentStatus.paid) handleViewExistsPayment();
			}
		}
	}, []);
	return (
		<>
			<WtcCard
				classNameBody="p-0 m-0 h-100"
				body={
					<>
						<div style={{ height: "106px" }}>
							<WtcCard
								title={<span className="fs-title">{t("paymentmethod")}</span>}
								classNameBody="p-0 m-0 h-100 w-100"
								className="h-100 w-100"
								body={
									<div className="row">
										<div className="col-md-4 mx-0">
											<WtcMenuItem
												height={45}
												disabled={
													Number(totalRemaining) == 0 ||
													!CheckRoleWithAction(authState, PageTarget.payment, "INS")
												}
												padding="p-1"
												onClick={() => {
													handleClickChoosePay(MethodPayment.CREDITCARD);
												}}
												iconClassName="custom-processing-button background-white"
												icon="ri-bank-card-line"
												body={
													<>
														<div className="fs-value">{t("credit_card")}</div>
													</>
												}
											/>
										</div>
										<div className="col-md-4 mx-0">
											<WtcMenuItem
												height={45}
												disabled={
													Number(totalRemaining) == 0 ||
													!CheckRoleWithAction(authState, PageTarget.payment, "INS")
												}
												padding="p-1"
												onClick={() => {
													handleClickChoosePay(MethodPayment.CASH);
												}}
												iconClassName="custom-processing-button background-white"
												icon="ri-money-dollar-box-line"
												body={
													<>
														<div className="fs-value">{t("cash")}</div>
													</>
												}
											/>
										</div>
										<div className="col-md-4 mx-0">
											<WtcMenuItem
												height={45}
												disabled={
													Number(totalRemaining) == 0 ||
													!CheckRoleWithAction(authState, PageTarget.payment, "INS")
												}
												padding="p-1"
												onClick={() => {
													handleClickChoosePay(MethodPayment.GIFTCARD);
												}}
												iconClassName="custom-processing-button background-white"
												icon="ri-gift-line"
												body={
													<>
														<div className="fs-value">{t("giftcard")}</div>
													</>
												}
											/>
										</div>
									</div>
								}
							/>
						</div>
						<div style={{ height: screenSize.height - 450 }}>
							<WtcCard
								classNameBody="p-0 m-0 h-100"
								className="h-100"
								title={<span className="fs-title">{t("sumary")}</span>}
								body={
									<>
										<div className="me-1 pt-1">
											{paymentState.ListPayment.length > 0 &&
												paymentState.ListPayment.map((item, index) => {
													return (
														<div
															key={index}
															className={`'w-100 mb-1 my-border-left d-flex py-0 px-2 me-order-product'}`}
															style={{ fontSize: 18, cursor: "pointer" }}
														>
															<div
																className={`w-100 flex-grow-1`}
																onClick={() => handleClickEditPay(item)}
																style={{ alignContent: "center" }}
															>
																<div className="d-flex w-100 align-items-center">
																	<div className="flex-grow-1 py-1">
																		{!(
																			item.typePayment ==
																				MethodPayment.GIFTCARD ||
																			item.typePayment == MethodPayment.CASH
																		) ? (
																			<>
																				<div
																					className="align-self-center flex-grow-1 ps-2 fs-value fw-bold"
																					style={{ color: "#30363F" }}
																				>
																					<div className="fs-value">
																						{item.feeCreditCard &&
																						item.feeCreditCard > 0 ? (
																							<>
																								<img
																									id="isFee"
																									className="size-svg-order"
																									src={feeCreditIcon}
																								/>{" "}
																								<Tooltip
																									style={{
																										fontSize: 10,
																									}}
																									position="mouse"
																									target="#isFee"
																									content={t(
																										"isFeeCreditcard"
																									)}
																								/>
																							</>
																						) : null}

																						{t("credit_card")}
																						<span className="my-label-in-grid">
																							{" - "}
																							{t(
																								item.optionPayment || ""
																							) || ""}
																						</span>
																					</div>
																				</div>
																			</>
																		) : (
																			<>
																				<div
																					className="align-self-center flex-grow-1 ps-2 fw-bold"
																					style={{ color: "#30363F" }}
																				>
																					<div className="fs-value">
																						{t(item.typePayment)}
																					</div>
																				</div>
																			</>
																		)}
																	</div>
																	<div className=" px-2" style={{ fontWeight: 700 }}>
																		<div className={"wtc-text-primary fs-value"}>
																			$
																			{item.feeCreditCard &&
																			item?.feeCreditCard > 0
																				? FormatMoneyNumber(
																						Number(item.amount) +
																							item.feeCreditCard
																				  )
																				: toLocaleStringRefactor(
																						toFixedRefactor(
																							Number(item.amount),
																							2
																						)
																				  )}
																		</div>
																	</div>
																</div>
															</div>
															{item.status == paymentStatus.inprocessing ? (
																<div className="align-self-center fs-6">
																	<div
																		className="px-4 ps-1"
																		style={{ cursor: "pointer" }}
																		onClick={() => handleDeleteSumary(item._id)}
																	>
																		<i className="ri-delete-bin-5-line text-muted"></i>
																	</div>
																</div>
															) : (
																<div className="align-self-center fs-6 fw-bold">
																	<div
																		className="px-4 ps-1"
																		style={{ cursor: "pointer" }}
																	>
																		<i className="ri-check-line text-success"></i>
																	</div>
																</div>
															)}
														</div>
													);
												})}
										</div>
										<div ref={divRef}></div>
									</>
								}
							/>
						</div>
						<div className="d-flex flex-column" style={{ height: "163px" }}>
							<WtcCard
								title={<span className="fs-title">{t("total")}</span>}
								classNameBody="p-0 m-0 h-100"
								className="h-100"
								body={
									<div className=" pe-1 d-flex flex-column" style={{ borderRadius: 20, height: 110 }}>
										<div className="flex-grow-1 d-flex align-items-center pe-2">
											<div className="d-flex align-items-center">
												<div className="flex-grow-1 fw-bold" style={{ color: "#30363F" }}>
													<div className="label-item-total">
														<span className="two-line-ellipsis my-text-label label-item-total">
															{t("totaldue")} (
															<span className="label-total fs-value-disabled">
																{totalServices} items
															</span>
															)&ensp;
															<span className="wtc-text-primary fs-value">
																${" "}
																{toLocaleStringRefactor(
																	toFixedRefactor(
																		Number(paymentState.TotalService),
																		2
																	)
																)}
															</span>
														</span>
													</div>
													<div className="label-item-total">
														<span className="two-line-ellipsis my-text-label label-item-total">
															{t("total_feeCD")}{" "}
															<span className="wtc-text-primary fs-value">
																${" "}
																{toLocaleStringRefactor(
																	toFixedRefactor(Number(totalFeeCreditcard), 2)
																)}
															</span>
														</span>
													</div>
													<div className="label-item-total my-text-label two-line-ellipsis ">
														{t("tax")}(
														<span className="label-total fs-value-disabled">
															{getTaxRate(storeConfigState.list)}%
														</span>
														)
														<span className="wtc-text-primary fs-value">
															&ensp;${" "}
															{toLocaleStringRefactor(
																toFixedRefactor(paymentState.Tax, 2)
															)}
														</span>
													</div>
													<div className="label-item-total my-text-label two-line-ellipsis">
														{t("tip")}
														<span className="wtc-text-primary fs-value">
															&ensp;${" "}
															{toLocaleStringRefactor(
																toFixedRefactor(paymentState.TotalTip, 2)
															)}
														</span>
													</div>
												</div>
											</div>
											<div
												className="text-end flex-grow-1 text-secondary fw-bold"
												style={{ textAlign: "end" }}
											>
												{paymentState.Status.code == paymentStatus.paid ? (
													<span className="text-danger money-payment">
														&ensp;${" "}
														{toLocaleStringRefactor(
															toFixedRefactor(paymentState.Total + totalFeeCreditcard, 2)
														)}
													</span>
												) : (
													<span className="text-danger money-payment">
														&ensp;$ {totalRemaining}
													</span>
												)}
											</div>
										</div>
										<div className="label-item-total pe-1 fw-bold fs-value">
											{
												<>
													{t("discount")}(
													<span className="label-total fs-value-disabled">
														{t("store")}/{t("Employees")}
													</span>
													) &ensp;
													<span className="wtc-text-primary fs-value">
														${" "}
														{toLocaleStringRefactor(
															toFixedRefactor(paymentState.StoreDiscount, 2)
														)}{" "}
														/ ${" "}
														{toLocaleStringRefactor(
															toFixedRefactor(
																CalDiscountListService(newOderState.tempService),
																2
															)
														)}
													</span>
												</>
											}
										</div>
									</div>
								}
							/>
						</div>
					</>
				}
				footer={
					<>
						<div className="col-sm-6 me-1">
							<WtcButton
								label={t("orderlist")}
								icon="ri-arrow-go-back-line"
								className="w-100 text-white wtc-bg-primary"
								height={49}
								onClick={() => navigate("/order-list")}
							/>
						</div>
						{paymentState.Total - totalPaidAmount > 0 ? (
							<>
								<div className="col-sm-6">
									<WtcRoleButton
										disabled={moneyPaied == 0 || paymentState.Status.code == paymentStatus.paid}
										target="PAYMENT"
										action="INS"
										label={t("payment")}
										icon="pi pi-dollar"
										className="w-100 text-white wtc-bg-primary"
										fontSize={16}
										height={49}
										onClick={handlePayment}
									/>
								</div>
							</>
						) : (
							<div className="col-sm-6">
								<WtcButton
									label={t("print_bill")}
									icon="ri-printer-line"
									className=" w-100 text-white wtc-bg-primary"
									height={49}
									onClick={() => setShowPrint(true)}
								/>
							</div>
						)}
					</>
				}
				// {
				// 	paymentState.Status.code == paymentStatus.paid ? (
				// 		<>
				// 			<WtcButton
				// 				label={t("print_bill")}
				// 				icon="ri-printer-line"
				// 				className=" w-100 text-white wtc-bg-primary"
				// 				height={49}
				// 				onClick={() => setShowPrint(true)}
				// 			/>
				// 		</>
				// 	) : (
				// 		<>

				// 		</>
				// 	)
				// }
				className="h-100"
			/>
			<div>
				<DynamicDialog
					width={isMobile ? "60vw" : "38vw"}
					minHeight={"85vh"}
					visible={dialogVisible}
					mode={"add"}
					position={"center"}
					title={t("paymentorder")}
					okText=""
					cancelText=""
					draggable={false}
					isBackgroundGray={true}
					resizeable={false}
					onClose={handleCloseDialog}
					body={
						<>
							<div className="d-flex flex-column justify-content-between h-100">
								<div className="d-flex flex-column rounded w-100 h-100">
									<div
										className="w-100 px-1"
										style={{
											height: !(
												typeChoosePayment == MethodPayment.CASH ||
												typeChoosePayment == MethodPayment.GIFTCARD
											)
												? 150
												: 96,
										}}
									>
										<div className="row h-100 ps-2 pe-2">
											<WtcCard
												classNameBody="flex-grow-1 px-1 my-0"
												className="h-100"
												body={
													<div className="row">
														<div className="col-sm-12">{menuItemPayment()}</div>
													</div>
												}
											/>
										</div>
									</div>
									<div style={{ height: screenSize.height - 339 }}>
										<div className="flex-grow-1 w-100 flex-fill ps-2 pe-2 pt-1">
											<div className="row py-1">
												<div className="col-sm-3 padding-button">
													<WtcButton
														label={"1"}
														className={`w-100 ${
															keyboard === "1"
																? "text-white custom-primary-outline"
																: "text-black wtc-bg-secondary"
														}`}
														fontSize={24}
														height={(screenSize.height - 284) / 4.9}
														onClick={() => handleKeyboardAction("1")}
													/>
												</div>
												<div className="col-sm-3 padding-button">
													<WtcButton
														label={"2"}
														className={`w-100 ${
															keyboard === "2"
																? "text-white custom-primary-outline"
																: "text-black wtc-bg-secondary"
														}`}
														fontSize={24}
														height={(screenSize.height - 284) / 4.9}
														onClick={() => handleKeyboardAction("2")}
													/>
												</div>
												<div className="col-sm-3 padding-button">
													<WtcButton
														label={"3"}
														className={`w-100 ${
															keyboard === "3"
																? "text-white custom-primary-outline"
																: "text-black wtc-bg-secondary"
														}`}
														fontSize={24}
														height={(screenSize.height - 284) / 4.9}
														onClick={() => handleKeyboardAction("3")}
													/>
												</div>
												<div className="col-sm-3 padding-button">
													<WtcButton
														label={
															typeChoosePayment == MethodPayment.CREDITCARD &&
															checkedFee == true
																? FormatMoneyNumber(
																		parseFloat(totalRemaining.replace(/,/g, "")) +
																			getCreditCardFeeAmount(
																				storeConfigState.list
																			)
																  )
																: totalRemaining
														}
														className={`w-100 ${
															keyboard === totalRemaining
																? "text-danger custom-primary-outline"
																: "text-danger wtc-bg-secondary"
														}`}
														fontSize={24}
														height={(screenSize.height - 284) / 4.9}
														onClick={() => handleKeyboardAction(totalRemaining)}
													/>
												</div>
											</div>
											<div className="row">
												<div className="col-sm-3 padding-button">
													<WtcButton
														label={"4"}
														className={`w-100 ${
															keyboard === "4"
																? "text-white custom-primary-outline"
																: "text-black wtc-bg-secondary"
														}`}
														fontSize={24}
														height={(screenSize.height - 284) / 4.9}
														onClick={() => handleKeyboardAction("4")}
													/>
												</div>
												<div className="col-sm-3 padding-button">
													<WtcButton
														label={"5"}
														className={`w-100 ${
															keyboard === "5"
																? "text-white custom-primary-outline"
																: "text-black wtc-bg-secondary"
														}`}
														fontSize={24}
														height={(screenSize.height - 284) / 4.9}
														onClick={() => handleKeyboardAction("5")}
													/>
												</div>
												<div className="col-sm-3 padding-button">
													<WtcButton
														label={"6"}
														className={`w-100 ${
															keyboard === "6"
																? "text-white custom-primary-outline"
																: "text-black wtc-bg-secondary"
														}`}
														fontSize={24}
														height={(screenSize.height - 284) / 4.9}
														onClick={() => handleKeyboardAction("6")}
													/>
												</div>
												<div className="col-sm-3 padding-button">
													<WtcButton
														label={"+20"}
														className={`w-100 ${
															keyboard === "+20"
																? "text-white custom-primary-outline"
																: "text-black wtc-bg-secondary"
														}`}
														fontSize={24}
														height={(screenSize.height - 284) / 4.9}
														onClick={() => handleKeyboardAction("+20")}
													/>
												</div>
											</div>
											<div className="row py-1">
												<div className="col-sm-3 padding-button">
													<WtcButton
														label={"7"}
														className={`w-100 ${
															keyboard === "7"
																? "text-white custom-primary-outline"
																: "text-black wtc-bg-secondary"
														}`}
														fontSize={24}
														height={(screenSize.height - 284) / 4.9}
														onClick={() => handleKeyboardAction("7")}
													/>
												</div>
												<div className="col-sm-3 padding-button">
													<WtcButton
														label={"8"}
														className={`w-100 ${
															keyboard === "8"
																? "text-white custom-primary-outline"
																: "text-black wtc-bg-secondary"
														}`}
														fontSize={24}
														height={(screenSize.height - 284) / 4.9}
														onClick={() => handleKeyboardAction("8")}
													/>
												</div>
												<div className="col-sm-3 padding-button">
													<WtcButton
														label={"9"}
														className={`w-100 ${
															keyboard === "9"
																? "text-white custom-primary-outline"
																: "text-black wtc-bg-secondary"
														}`}
														fontSize={24}
														height={(screenSize.height - 284) / 4.9}
														onClick={() => handleKeyboardAction("9")}
													/>
												</div>
												<div className="col-sm-3 padding-button">
													<WtcButton
														label={"+50"}
														className={`w-100 ${
															keyboard === "+50"
																? "text-white custom-primary-outline"
																: "text-black wtc-bg-secondary"
														}`}
														fontSize={24}
														height={(screenSize.height - 284) / 4.9}
														onClick={() => handleKeyboardAction("+50")}
													/>
												</div>
											</div>
											<div className="row">
												<div className="col-sm-3 padding-button">
													<WtcButton
														label={"+/-"}
														disabled
														className={`w-100 ${
															keyboard === "+/-"
																? "text-white wtc-bg-primary"
																: "text-black wtc-bg-secondary"
														}`}
														fontSize={24}
														height={(screenSize.height - 284) / 4.9}
														onClick={() => handleKeyboardAction("+/-")}
													/>
												</div>
												<div className="col-sm-3 padding-button">
													<WtcButton
														label={"0"}
														className={`w-100 ${
															keyboard === "0"
																? "text-white wtc-bg-primary"
																: "text-black wtc-bg-secondary"
														}`}
														fontSize={24}
														height={(screenSize.height - 284) / 4.9}
														onClick={() => handleKeyboardAction("0")}
													/>
												</div>
												<div className="col-sm-3 padding-button">
													<WtcButton
														label={"."}
														className={`w-100 ${
															keyboard === "."
																? "text-white wtc-bg-primary"
																: "text-black wtc-bg-secondary"
														}`}
														fontSize={24}
														height={(screenSize.height - 284) / 4.9}
														onClick={() => handleKeyboardAction(".")}
													/>
												</div>
												<div className="col-sm-3 padding-button">
													<WtcButton
														label={""}
														icon="ri-delete-back-2-line"
														className={`w-100 ${
															keyboard === "BACK"
																? "text-white wtc-bg-primary"
																: "text-black wtc-bg-secondary-2"
														}`}
														fontSize={24}
														height={(screenSize.height - 284) / 4.9}
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
								onClick={handleCloseDialog}
							/>
							{actionDialog == "add" ? (
								<Button
									disabled={Number(inputMoney) == 0}
									type="button"
									label={t("action.add")}
									className="wtc-bg-primary text-white dialog-cancel-button"
									icon="ri ri-add-line"
									onClick={handleAddPaymentMethod}
								/>
							) : (
								<Button
									type="button"
									label={t("action.UPD")}
									className="wtc-bg-primary text-white dialog-cancel-button"
									icon="ri ri-add-line"
									onClick={() => handleEditPaymentMethod(paymentClick)}
								/>
							)}
						</div>
					}
				/>
				<DynamicDialog
					width={isMobile ? "60vw" : "45vw"}
					minHeight={"87vh"}
					visible={dialogVisibleGiftCard}
					mode={"add"}
					position={"center"}
					title={t("paymentorder")}
					okText=""
					cancelText=""
					draggable={false}
					isBackgroundGray={true}
					resizeable={false}
					onClose={handleCloseDialog}
					body={
						<>
							<div className="d-flex flex-column justify-content-between h-100">
								<div className="d-flex flex-column rounded w-100 h-100">
									<div className="w-100 px-1" style={{ height: 135 }}>
										<div className="row h-100 ps-2 pe-2">
											<WtcCard
												classNameBody="flex-grow-1 px-1 my-0"
												className="h-100"
												body={
													<div className="row">
														<div className="col-sm-12">
															<div className="menu-item-2 my-1 w-100">
																<div className="col-sm-12">
																	<div
																		className={`d-flex align-items-center p-3 my-1`}
																	>
																		<div
																			className="d-flex align-items-center "
																			onClick={() => {}}
																		>
																			<IconButton
																				onClick={() => {}}
																				icon="ri-gift-line"
																				width={45}
																				height={45}
																				actived={false}
																				className="custom-processing-button background-white"
																			/>
																			<div
																				className="flex-grow-1 ps-2 fw-bold"
																				style={{ color: "#30363F" }}
																			>
																				<div className="fs-title mb-1">
																					{t("giftcard")}
																				</div>
																				<div className="input-group-giftcard">
																					<InputText
																						readOnly={disabledInputGiftCard}
																						id="inputtext"
																						className="icon-text p-2 p-inputtext-no-border"
																						autoFocus
																						placeholder={""}
																						style={{ width: "100%" }}
																						value={giftCardCode}
																						onChange={(e) =>
																							setGiftCardCode(
																								e.target.value
																							)
																						}
																					/>
																					{giftCard == undefined ? (
																						<span
																							id="add-customer"
																							className="input-group-addon cursor color-icon-title"
																							onClick={
																								handleClickSearchGiftCard
																							}
																						>
																							<i
																								className="ri-search-line"
																								style={{
																									color: "#273672",
																								}}
																							></i>
																						</span>
																					) : (
																						<span
																							id="add-customer"
																							className="input-group-addon cursor color-icon-title"
																							onClick={
																								handleClearGiftCard
																							}
																						>
																							<i
																								className="ri-close-line"
																								style={{
																									color: "#273672",
																								}}
																							></i>
																						</span>
																					)}
																				</div>
																			</div>
																		</div>
																		<div
																			className="w-25 ps-2 fw-bold"
																			style={{ color: "#30363F" }}
																		>
																			<>
																				<div className="fs-title mb-1">
																					{t("remain")}
																				</div>
																				<InputText
																					disabled
																					id="inputtext"
																					className={`icon-text p-2 p-inputtext-no-border`}
																					placeholder={
																						"$ " +
																						(FormatMoneyNumber(
																							giftCard?.remaining || 0
																						) || "")
																					}
																					style={{ width: "90%" }}
																				/>
																			</>
																		</div>
																		<div className="flex-grow-1 fw-bold text-end">
																			<div
																				className="fs-3"
																				style={{ color: "red" }}
																			>
																				$ {FormatMoneyNumber(inputMoney)}
																			</div>
																		</div>
																	</div>
																</div>
															</div>
														</div>
													</div>
												}
											/>
										</div>
									</div>
									<div style={{ height: screenSize.height - 349 }}>
										<div className="flex-grow-1 w-100 flex-fill ps-2 pe-2 pt-1">
											<div className="row py-1">
												<div className="col-sm-3 padding-button">
													<WtcButton
														disabled={!giftCard}
														label={"1"}
														className={`w-100 ${
															keyboard === "1"
																? "text-white custom-primary-outline"
																: "text-black wtc-bg-secondary"
														}`}
														fontSize={24}
														height={(screenSize.height - 300) / 4.9}
														onClick={() => handleKeyboardAction("1")}
													/>
												</div>
												<div className="col-sm-3 padding-button">
													<WtcButton
														disabled={!giftCard}
														label={"2"}
														className={`w-100 ${
															keyboard === "2"
																? "text-white custom-primary-outline"
																: "text-black wtc-bg-secondary"
														}`}
														fontSize={24}
														height={(screenSize.height - 300) / 4.9}
														onClick={() => handleKeyboardAction("2")}
													/>
												</div>
												<div className="col-sm-3 padding-button">
													<WtcButton
														disabled={!giftCard}
														label={"3"}
														className={`w-100 ${
															keyboard === "3"
																? "text-white custom-primary-outline"
																: "text-black wtc-bg-secondary"
														}`}
														fontSize={24}
														height={(screenSize.height - 300) / 4.9}
														onClick={() => handleKeyboardAction("3")}
													/>
												</div>
												<div className="col-sm-3 padding-button">
													<WtcButton
														disabled={
															!giftCard || giftCard.remaining < Number(totalRemaining)
														}
														label={totalRemaining}
														className={`w-100 ${
															keyboard === totalRemaining
																? "text-danger custom-primary-outline"
																: "text-danger wtc-bg-secondary"
														}`}
														fontSize={24}
														height={(screenSize.height - 300) / 4.9}
														onClick={() => handleKeyboardAction(totalRemaining)}
													/>
												</div>
											</div>
											<div className="row">
												<div className="col-sm-3 padding-button">
													<WtcButton
														disabled={!giftCard}
														label={"4"}
														className={`w-100 ${
															keyboard === "4"
																? "text-white custom-primary-outline"
																: "text-black wtc-bg-secondary"
														}`}
														fontSize={24}
														height={(screenSize.height - 300) / 4.9}
														onClick={() => handleKeyboardAction("4")}
													/>
												</div>
												<div className="col-sm-3 padding-button">
													<WtcButton
														disabled={!giftCard}
														label={"5"}
														className={`w-100 ${
															keyboard === "5"
																? "text-white custom-primary-outline"
																: "text-black wtc-bg-secondary"
														}`}
														fontSize={24}
														height={(screenSize.height - 300) / 4.9}
														onClick={() => handleKeyboardAction("5")}
													/>
												</div>
												<div className="col-sm-3 padding-button">
													<WtcButton
														disabled={!giftCard}
														label={"6"}
														className={`w-100 ${
															keyboard === "6"
																? "text-white custom-primary-outline"
																: "text-black wtc-bg-secondary"
														}`}
														fontSize={24}
														height={(screenSize.height - 300) / 4.9}
														onClick={() => handleKeyboardAction("6")}
													/>
												</div>
												<div className="col-sm-3 padding-button">
													<WtcButton
														disabled={!giftCard || giftCard.remaining < 20}
														label={"+20"}
														className={`w-100 ${
															keyboard === "+20"
																? "text-white custom-primary-outline"
																: "text-black wtc-bg-secondary"
														}`}
														fontSize={24}
														height={(screenSize.height - 300) / 4.9}
														onClick={() => handleKeyboardAction("+20")}
													/>
												</div>
											</div>
											<div className="row py-1">
												<div className="col-sm-3 padding-button">
													<WtcButton
														disabled={!giftCard}
														label={"7"}
														className={`w-100 ${
															keyboard === "7"
																? "text-white custom-primary-outline"
																: "text-black wtc-bg-secondary"
														}`}
														fontSize={24}
														height={(screenSize.height - 300) / 4.9}
														onClick={() => handleKeyboardAction("7")}
													/>
												</div>
												<div className="col-sm-3 padding-button">
													<WtcButton
														disabled={!giftCard}
														label={"8"}
														className={`w-100 ${
															keyboard === "8"
																? "text-white custom-primary-outline"
																: "text-black wtc-bg-secondary"
														}`}
														fontSize={24}
														height={(screenSize.height - 300) / 4.9}
														onClick={() => handleKeyboardAction("8")}
													/>
												</div>
												<div className="col-sm-3 padding-button">
													<WtcButton
														disabled={!giftCard}
														label={"9"}
														className={`w-100 ${
															keyboard === "9"
																? "text-white custom-primary-outline"
																: "text-black wtc-bg-secondary"
														}`}
														fontSize={24}
														height={(screenSize.height - 300) / 4.9}
														onClick={() => handleKeyboardAction("9")}
													/>
												</div>
												<div className="col-sm-3 padding-button">
													<WtcButton
														disabled={!giftCard || giftCard.remaining < 50}
														label={"+50"}
														className={`w-100 ${
															keyboard === "+50"
																? "text-white custom-primary-outline"
																: "text-black wtc-bg-secondary"
														}`}
														fontSize={24}
														height={(screenSize.height - 300) / 4.9}
														onClick={() => handleKeyboardAction("+50")}
													/>
												</div>
											</div>
											<div className="row">
												<div className="col-sm-3 padding-button">
													<WtcButton
														label={"+/-"}
														disabled
														className={`w-100 ${
															keyboard === "+/-"
																? "text-white wtc-bg-primary"
																: "text-black wtc-bg-secondary"
														}`}
														fontSize={24}
														height={(screenSize.height - 300) / 4.9}
														onClick={() => handleKeyboardAction("+/-")}
													/>
												</div>
												<div className="col-sm-3 padding-button">
													<WtcButton
														disabled={!giftCard}
														label={"0"}
														className={`w-100 ${
															keyboard === "0"
																? "text-white wtc-bg-primary"
																: "text-black wtc-bg-secondary"
														}`}
														fontSize={24}
														height={(screenSize.height - 300) / 4.9}
														onClick={() => handleKeyboardAction("0")}
													/>
												</div>
												<div className="col-sm-3 padding-button">
													<WtcButton
														disabled={!giftCard}
														label={"."}
														className={`w-100 ${
															keyboard === "."
																? "text-white wtc-bg-primary"
																: "text-black wtc-bg-secondary"
														}`}
														fontSize={24}
														height={(screenSize.height - 300) / 4.9}
														onClick={() => handleKeyboardAction(".")}
													/>
												</div>
												<div className="col-sm-3 padding-button">
													<WtcButton
														disabled={!giftCard}
														label={""}
														icon="ri-delete-back-2-line"
														className={`w-100 ${
															keyboard === "BACK"
																? "text-white wtc-bg-primary"
																: "text-black wtc-bg-secondary-2"
														}`}
														fontSize={24}
														height={(screenSize.height - 300) / 4.9}
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
								onClick={handleCloseDialog}
							/>
							{actionDialog == "add" ? (
								<Button
									type="button"
									disabled={Number(inputMoney) == 0}
									label={t("action.add")}
									className="wtc-bg-primary text-white dialog-cancel-button"
									icon="ri ri-add-line"
									onClick={handleAddPaymentMethod}
								/>
							) : (
								<Button
									type="button"
									label={t("action.UPD")}
									disabled={Number(inputMoney) == 0}
									className="wtc-bg-primary text-white dialog-cancel-button"
									icon="ri ri-add-line"
									onClick={() => handleEditPaymentMethod(paymentClick)}
								/>
							)}
						</div>
					}
				/>
			</div>
			{showPrint == true && (
				<PrintPayment
					totalBill={FormatMoneyNumber(paymentState.Total + totalFeeCreditcard)}
					customer={paymentState.customer}
					onClose={() => setShowPrint(false)}
					totalDue={FormatMoneyNumber(paymentState.TotalService)}
					totalFeeCredit={FormatMoneyNumber(totalFeeCreditcard)}
					totalTax={FormatMoneyNumber(paymentState.Tax)}
					totalTip={FormatMoneyNumber(paymentState.TotalTip)}
					totalDiscount={FormatMoneyNumber(
						paymentState.StoreDiscount + CalDiscountListService(newOderState.tempService)
					)}
					ListService={newOderState.tempService}
					orderCode={newOderState.code || "#"}
				/>
			)}
		</>
	);
}
