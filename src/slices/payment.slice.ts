import { createSlice } from "@reduxjs/toolkit";
import { parseHttpError } from "../app/error";
import { orderStatus, paymentStatus, RequestState, TypePayment } from "../app/state";
import { commonCreateAsyncThunk } from "../app/thunk";
import { MethodPayment, Status } from "../const";
import { CustomerModel } from "../models/category/Customer.model";
import { PaymentModel } from "../models/category/Payment.model";
import { PaymentService } from "../services/Payment.service";

export interface PaymentState {
	ListPayment: PaymentModel[];
	TotalTip: number;
	TypePayment: TypePayment | undefined;
	fetchState: RequestState;
	actionState: RequestState;
	customer: CustomerModel | undefined;
	Total: number;
	TotalService: number;
	Tax: number;
	StoreDiscount: number;
	OrderId: string;
	Status: Status;
	actionPaymentTipState: RequestState;
}
const initialState: PaymentState = {
	ListPayment: [],
	TotalTip: 0,
	TypePayment: undefined,
	fetchState: { status: "idle" },
	actionState: { status: "idle" },
	customer: undefined,
	Total: 0,
	TotalService: 0,
	Tax: 0,
	StoreDiscount: 0,
	OrderId: "",
	Status: { code: "", value: "" },
	actionPaymentTipState: { status: "idle" },
};
export const GetListPayment: any = commonCreateAsyncThunk({
	type: "payment/getListPayment",
	action: PaymentService.GetListPayment,
});
export const addPayment: any = commonCreateAsyncThunk({ type: "payment/addPayment", action: PaymentService.Payment });
export const addPaymentCreditCard: any = commonCreateAsyncThunk({
	type: "payment/addPaymentCreditCard",
	action: PaymentService.Payment,
});
export const paymentTipForEmployee: any = commonCreateAsyncThunk({
	type: "payment/paymentTipForEmployee",
	action: PaymentService.paymentTipForEmployee,
});
export const paymentServiceForEmployee: any = commonCreateAsyncThunk({
	type: "payment/paymentServiceForEmployee",
	action: PaymentService.paymentServiceForEmployee,
});

export const PaymentSlice = createSlice({
	name: "Payment",
	initialState,
	reducers: {
		resetFetchState(state) {
			state.fetchState = { status: "idle" };
		},
		resetActionState(state) {
			state.actionState = { status: "idle" };
		},
		resetActionPaymentTipState(state) {
			state.actionPaymentTipState = { status: "idle" };
		},
		setTypePayment(state, action) {
			if (action.payload) state.TypePayment = action.payload;
			else state.TypePayment = undefined;
		},
		UpdateTotal(state, action) {
			state.Total = action.payload;
		},
		updateTax(state, action) {
			state.Tax = action.payload;
		},
		updateTotalTip(state, action) {
			state.TotalTip = action.payload;
		},
		updateStoreDiscount(state, action) {
			state.StoreDiscount = action.payload;
		},
		updateTotalService(state, action) {
			state.TotalService = action.payload;
		},
		updateOrderId(state, action) {
			state.OrderId = action.payload;
		},
		updateStatusPayment(state, action) {
			state.Status = action.payload;
		},
		updateCustomerPayment(state, action) {
			state.customer = action.payload;
		},
		addListPayment(state, action) {
			state.ListPayment = [...state.ListPayment, action.payload];
		},
		editListPayment(state, action) {
			state.ListPayment = state.ListPayment.map((payment) =>
				payment._id === action.payload._id ? action.payload : payment
			);
		},
		deleteListPayment(state, action) {
			state.ListPayment = state.ListPayment.filter((payment) => payment._id !== action.payload);
		},
		clearState(state) {
			state.ListPayment = [];
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(addPayment.fulfilled, (state, action) => {
				state.actionState.status = "completed";
				console.log(action);
				const data = action?.payload?.data?.data.payment;
				const moneyPaied =
					data?.details &&
					data?.details.length > 0 &&
					data?.details.reduce((sum: any, payment: any) => sum + payment.amount, 0);
				if (moneyPaied == data?.amount) {
					const statusPaid: Status = {
						code: orderStatus.paid,
						value: orderStatus.paid,
					};
					state.Status = statusPaid;
				}
				state.ListPayment = state.ListPayment.map((item) =>
					item.status == paymentStatus.inprocessing ? { ...item, status: paymentStatus.paid } : item
				);
			})
			.addCase(addPayment.pending, (state, _action) => {
				state.actionState.status = "loading";
			})
			.addCase(addPayment.rejected, (state, action) => {
				const error = parseHttpError(action.payload);
				state.actionState = { status: "failed", code: error.statusCode, error: error.message };
			})
			.addCase(addPaymentCreditCard.fulfilled, (state, action) => {
				state.actionState.status = "completed";
				const data = action?.payload?.data?.data?.payment;
				const moneyPaied =
					data?.details &&
					data?.details.length > 0 &&
					data?.details.reduce((sum: any, payment: any) => sum + payment.amount, 0);
				if (moneyPaied == data?.amount) {
					const statusPaid: Status = {
						code: orderStatus.paid,
						value: orderStatus.paid,
					};
					state.Status = statusPaid;
				}
				state.ListPayment = state.ListPayment.map((item) =>
					item.typePayment == MethodPayment.CREDITCARD && item.status == paymentStatus.inprocessing
						? { ...item, status: paymentStatus.paid }
						: item
				);
			})
			.addCase(addPaymentCreditCard.pending, (state, _action) => {
				state.actionState.status = "loading";
			})
			.addCase(addPaymentCreditCard.rejected, (state, action) => {
				const error = parseHttpError(action.payload);
				state.actionState = { status: "failed", code: error.statusCode, error: error.message };
			})
			.addCase(GetListPayment.fulfilled, (state, action) => {
				state.fetchState.status = "completed";
				const List = action.payload.data.data;
				state.ListPayment = [];
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
							state.ListPayment.push(payment);
						});
					});
				}
			})
			.addCase(GetListPayment.pending, (state, _action) => {
				state.fetchState.status = "loading";
			})
			.addCase(GetListPayment.rejected, (state, action) => {
				const error = parseHttpError(action.payload);
				state.fetchState = { status: "failed", code: error.statusCode, error: error.message };
			})
			.addCase(paymentTipForEmployee.fulfilled, (state, _action) => {
				state.actionPaymentTipState.status = "completed";
			})
			.addCase(paymentTipForEmployee.pending, (state, _action) => {
				state.actionPaymentTipState.status = "loading";
			})
			.addCase(paymentTipForEmployee.rejected, (state, action) => {
				const error = parseHttpError(action.payload);
				state.actionPaymentTipState = { status: "failed", code: error.statusCode, error: error.message };
			})
			.addCase(paymentServiceForEmployee.fulfilled, (state, _action) => {
				state.actionState.status = "completed";
			})
			.addCase(paymentServiceForEmployee.pending, (state, _action) => {
				state.actionState.status = "loading";
			})
			.addCase(paymentServiceForEmployee.rejected, (state, action) => {
				const error = parseHttpError(action.payload);
				state.actionState = { status: "failed", code: error.statusCode, error: error.message };
			});
	},
});
export const {
	resetFetchState,
	addListPayment,
	updateOrderId,
	editListPayment,
	deleteListPayment,
	resetActionState,
	updateStoreDiscount,
	setTypePayment,
	UpdateTotal,
	updateTax,
	clearState,
	updateTotalTip,
	updateTotalService,
	updateStatusPayment,
	updateCustomerPayment,
	resetActionPaymentTipState,
} = PaymentSlice.actions;

export default PaymentSlice.reducer;
