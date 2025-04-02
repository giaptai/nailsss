import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { paymentStatus, RequestState } from "../app/state";
import { CustomerModel } from "../models/category/Customer.model";
import { DiscountModel } from "../models/category/Discount.model";
import { GiftcardModel } from "../models/category/Giftcard.model";
import { ListServiceSelectedModel } from "../models/category/ListServiceSelected.model";
import { CheckinModel } from "../models/category/CheckIn.model";
import { commonCreateAsyncThunk } from "../app/thunk";
import { RefundService } from "../services/Refund.service";
import { parseHttpError, parseHttpErrorResponse } from "../app/error";
import { PaymentModel } from "../models/category/Payment.model";
import { MethodPayment } from "../const";
import { PaymentService } from "../services/Payment.service";

export interface RefundState {
	item: CheckinModel;
	tempService: ListServiceSelectedModel[];
	ListDiscount: DiscountModel[] | [];
	ListGiftCard: GiftcardModel[];
	ListServiceClick: ListServiceSelectedModel | undefined;
	ListServiceEditEmployee: ListServiceSelectedModel | undefined;
	customer: CustomerModel | undefined;
	_id: string;
	code: string | undefined;
	storeDiscount: number;
	tax: number;
	tip: number;
	totalAmount: number;
	totalAll: number;
	actionState: RequestState;
	updateListService: RequestState;
	updateItem: RequestState;
	fetchState: RequestState;
	ListPayment: PaymentModel[];
	ListPaymentOld: PaymentModel[];
}

const initialState: RefundState = {
	item: CheckinModel.initial(),
	ListServiceClick: undefined,
	ListDiscount: [],
	ListGiftCard: [],
	ListServiceEditEmployee: undefined,
	tempService: [],
	customer: undefined,
	_id: "",
	code: undefined,
	storeDiscount: 0,
	tax: 0,
	tip: 0,
	totalAmount: 0,
	totalAll: 0,
	actionState: { status: "idle" },
	updateListService: { status: "idle" },
	updateItem: { status: "idle" },
	fetchState: { status: "idle" },
	ListPayment: [],
	ListPaymentOld: [],
};
export const RefundOrder: any = commonCreateAsyncThunk({ type: "order/Refund", action: RefundService.refundOrder });
export const GetListPaymentOld: any = commonCreateAsyncThunk({
	type: "payment/getListPayment",
	action: PaymentService.GetListPayment,
});
export const refundSlice = createSlice({
	name: "refund",
	initialState,
	reducers: {
		updateStoreDiscountRefund(state, action) {
			state.storeDiscount = action.payload;
		},
		updateListDiscountRefund(state, action: PayloadAction<DiscountModel[]>) {
			state.ListDiscount = action.payload;
		},
		updateValueTaxRefund(state, action) {
			state.tax = action.payload;
		},
		updateValueTipRefund(state, action) {
			state.tip = action.payload;
		},
		updateValueTotalAllRefund(state, action) {
			state.totalAll = action.payload;
		},
		updateValuetotalAmountRefund(state, action) {
			state.totalAmount = action.payload;
		},
		updatetempService(state, action) {
			state.tempService = action.payload;
		},
		updateListGiftCard(state, action: PayloadAction<ListServiceSelectedModel>) {
			const existingItem = state.tempService.find(
				(item) => item?.ListGiftCard !== undefined && item?.ListGiftCard.length > 0
			);
			if (existingItem) {
				existingItem.ListGiftCard = [
					...(existingItem.ListGiftCard || []),
					...(action.payload.ListGiftCard || []),
				];
			} else {
				state.tempService = [...state.tempService, action.payload];
			}
		},
		UpdateListServiceClick(state, action) {
			state.ListServiceClick = action.payload;
		},
		UpdateListServiceEditEmployee(state, action) {
			state.ListServiceEditEmployee = action.payload;
		},
		deleteListServiceInArray(state, action) {
			const arr = state.tempService.filter((item) => item._id !== action.payload);
			if (state.ListServiceClick?._id === action.payload) {
				state.ListServiceClick = undefined;
			}
			state.tempService = arr;
		},
		resetUpdateStateRefund(state) {
			state.updateItem = { status: "idle" };
			state.updateListService = { status: "idle" };
		},
		updateCustomer(state, action) {
			state.customer = action.payload;
		},
		update_id(state, action) {
			state._id = action.payload;
		},
		update_code(state, action) {
			state.code = action.payload;
		},
		clearState(state) {
			Object.assign(state, initialState);
		},
		updateDiscountInTempService(state, action) {
			state.tempService.forEach((item) => {
				item.discount = action.payload;
			});
		},
		calculatorDiscount(state, action: PayloadAction<DiscountModel[]>) {
			state.storeDiscount = 0;
			state.tempService.forEach((item) => {
				item.discount = 0;
			});
			action.payload.forEach((item) => {
				if (!item.IsPercent) {
					if (item.DiscountBy === "storeDiscount" || item.DiscountBy === "coupons") {
						state.storeDiscount += item.TotalDisscount;
					} else if (item.DiscountBy == "Empl") {
						state.tempService.forEach((service) => {
							if (service.Employee?._id == item.Employee?._id) service.discount += item.TotalDisscount;
						});
					} else if (item.DiscountBy == "storeEmployee") {
						const valuePerPerson = item.TotalDisscount / 2;
						state.storeDiscount += valuePerPerson;
						state.tempService.forEach((service) => {
							if (service.Employee?._id == item.Employee?._id) service.discount += valuePerPerson;
						});
					} else {
						const tempSrv = state.tempService.filter(
							(item) =>
								item.Employee != null &&
								(item.ListGiftCard?.length == 0 || item.ListGiftCard == undefined)
						);
						const valuePerPerson = item.TotalDisscount / (tempSrv.length + 1);
						state.storeDiscount += valuePerPerson;
						state.tempService
							.filter(
								(item) =>
									item.Employee != null &&
									(item.ListGiftCard?.length == 0 || item.ListGiftCard == undefined)
							)
							.forEach((service) => {
								service.discount += valuePerPerson;
							});
					}
				} else {
					const value = state.totalAll * Number(item.ValuePercent);
					if (item.DiscountBy === "storeDiscount" || item.DiscountBy === "coupons") {
						state.storeDiscount += value;
					} else if (item.DiscountBy == "Empl") {
						state.tempService.forEach((service) => {
							if (service.Employee?._id == item.Employee?._id && service.ListService) {
								const totalStorePrice = service.ListService.reduce((total, service) => {
									return total + service.storePrice;
								}, 0);
								service.discount += totalStorePrice * Number(item.ValuePercent);
							}
						});
					} else if (item.DiscountBy == "storeEmployee") {
						var valueDiscountPercent = 0;
						state.tempService.forEach((service) => {
							if (service.Employee?._id == item.Employee?._id && service.ListService) {
								valueDiscountPercent = service.ListService.reduce((total, service) => {
									return total + service.storePrice;
								}, 0);
								valueDiscountPercent = (valueDiscountPercent * Number(item.ValuePercent)) / 2;
								service.discount += valueDiscountPercent;
							}
						});
						state.storeDiscount += valueDiscountPercent;
					} else {
						const tempSrv = state.tempService.filter(
							(item) =>
								item.Employee != null &&
								(item.ListGiftCard?.length == 0 || item.ListGiftCard == undefined)
						);
						let valueDiscountAll = 0;
						state.tempService.forEach((service) => {
							if (service.Employee?._id == item.Employee?._id && service.ListService) {
								valueDiscountAll = service.ListService.reduce((total, service) => {
									return total + service.storePrice;
								}, 0);
								valueDiscountAll = (valueDiscountPercent * Number(item.ValuePercent)) / 2;
							}
						});
						const valuePerPerson = valueDiscountAll / (tempSrv.length + 1);
						state.storeDiscount += valuePerPerson;
						state.tempService
							.filter(
								(item) =>
									item.Employee != null &&
									(item.ListGiftCard?.length == 0 || item.ListGiftCard == undefined)
							)
							.forEach((service) => {
								if (service.Employee) service.discount += valuePerPerson;
							});
					}
				}
			});
		},
		updateItemRefund(state, action: PayloadAction<Partial<CheckinModel>>) {
			state.item = { ...state.item, ...action.payload };
			state.updateItem.status = "completed";
		},
		updateListServiceRefund(state, action) {
			const { list, taxRate, tipRate } = action.payload;
			if (!list) {
				state.item.details = undefined;
			} else {
				state.item.details = RefundService.convertObjectToServiceByEmployee(list, taxRate, tipRate);
			}
			state.item.paymentDetails = state.ListPayment.map((payment, index) => ({
				method: payment.typePayment,
				isCreditCardFee:
					payment.typePayment == MethodPayment.CREDITCARD
						? payment.feeCreditCard
							? true
							: false
						: undefined,
				amount: payment.amount,
				index: index,
				attributes:
					payment.typePayment === MethodPayment.GIFTCARD
						? { cardId: payment.giftCardId }
						: payment.typePayment == MethodPayment.CREDITCARD
						? { optionPayment: payment.optionPayment }
						: undefined,
			}));
			state.updateListService.status = "completed";
		},
		resetActionState(state) {
			state.actionState = { status: "idle" };
		},
		resetFetchState(state) {
			state.fetchState = { status: "idle" };
		},
		addListPaymentRefund(state, action) {
			state.ListPayment = [...state.ListPayment, action.payload];
		},
		clearListPaymentRefund(state) {
			state.ListPayment = [];
		},
		deleteListPaymentRefund(state, action) {
			state.ListPayment = state.ListPayment.filter((payment) => payment._id !== action.payload);
		},
		editListPaymentRefund(state, action) {
			state.ListPayment = state.ListPayment.map((payment) =>
				payment._id === action.payload._id ? action.payload : payment
			);
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(RefundOrder.fulfilled, (state, action) => {
				const data = action.payload?.data?.data;
				state.tax = data.totalTax;
				state.storeDiscount = data.storeDiscount;
				state.tip = data.totalTip;
				state.totalAmount = data?.totalMoney - data?.totalTax + data.totalDiscount - data.totalTip;
				state.totalAll = data.totalMoney;
				state._id = data._id;
				state.actionState.status = "completed";
			})
			.addCase(RefundOrder.pending, (state, _action) => {
				state.actionState.status = "loading";
			})
			.addCase(RefundOrder.rejected, (state, action) => {
				const error = parseHttpErrorResponse(action.payload);
				state.actionState = { status: "failed", code: error.statusCode, error: error.message };
			})
			.addCase(GetListPaymentOld.fulfilled, (state, action) => {
				state.fetchState.status = "completed";
				const List = action.payload.data.data;
				state.ListPaymentOld = [];
				if (Array.isArray(List) && List.length > 0) {
					List.forEach((item) => {
						item.details.forEach((detail: any) => {
							const payment = new PaymentModel(
								item._id,
								detail.method,
								detail.amount,
								detail?.attributes?.optionPayment || undefined,
								paymentStatus.paid,
								detail?.attributes?.CardId || undefined,
								detail?.attributes?.creditCardFeeAmount || null
							);
							state.ListPaymentOld.push(payment);
						});
					});
				}
			})
			.addCase(GetListPaymentOld.pending, (state, _action) => {
				state.fetchState.status = "loading";
			})
			.addCase(GetListPaymentOld.rejected, (state, action) => {
				const error = parseHttpError(action.payload);
				state.fetchState = { status: "failed", code: error.statusCode, error: error.message };
			});
	},
});
export const {
	updateListGiftCard,
	calculatorDiscount,
	updateListDiscountRefund,
	update_code,
	updateValueTaxRefund,
	updateValueTipRefund,
	updateDiscountInTempService,
	updateValuetotalAmountRefund,
	deleteListServiceInArray,
	clearState,
	updatetempService,
	UpdateListServiceClick,
	UpdateListServiceEditEmployee,
	updateCustomer,
	updateItemRefund,
	updateListServiceRefund,
	updateStoreDiscountRefund,
	resetUpdateStateRefund,
	resetActionState,
	addListPaymentRefund,
	deleteListPaymentRefund,
	editListPaymentRefund,
	clearListPaymentRefund,
	updateValueTotalAllRefund,
	resetFetchState,
} = refundSlice.actions;
export default refundSlice.reducer;
