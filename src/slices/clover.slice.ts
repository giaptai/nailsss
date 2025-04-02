import { createSlice } from "@reduxjs/toolkit";
import { RequestState } from "../app/state";
import { commonCreateAsyncThunk, commonCreateAsyncThunkClover } from "../app/thunk";
import { CloverService } from "../services/Clover.service";
import { parseHttpError } from "../app/error";
import { t } from "i18next";

export interface CloverState {
	code: string;
	accessToken: string;
	accessTokenExpiration: string;
	refreshToken: string;
	refreshTokenExpiration: string;
	actionState: RequestState;
	paymentState: RequestState;
	dataPaymentCreditCard: any | undefined;
}
const initialState: CloverState = {
	code: "",
	accessToken: "",
	refreshToken: "",
	accessTokenExpiration: "",
	refreshTokenExpiration: "",
	actionState: { status: "idle" },
	paymentState: { status: "idle" },
	dataPaymentCreditCard: undefined,
};
export const createCode: any = commonCreateAsyncThunkClover({
	type: "clover/createCode",
	action: CloverService.createCode,
});
export const refreshTokenClover: any = commonCreateAsyncThunk({
	type: "clover/refreshTokenClover",
	action: CloverService.refreshTokenClover,
});
export const displayOrderClover: any = commonCreateAsyncThunk({
	type: "clover/displayOrderClover",
	action: CloverService.displayOrderClover,
});
export const paymentClover: any = commonCreateAsyncThunk({
	type: "clover/paymentClover",
	action: CloverService.paymentClover,
});
export const showThankClover: any = commonCreateAsyncThunk({
	type: "clover/showThankClover",
	action: CloverService.showThankClover,
});

export const CloverSlice = createSlice({
	name: "Clover",
	initialState,
	reducers: {
		updateCode(state, action) {
			state.code = action.payload;
		},
		updateAccessToken(state, action) {
			state.accessToken = action.payload;
		},
		updateRefreshToken(state, action) {
			state.refreshToken = action.payload;
		},
		resetActionStateClover(state) {
			state.actionState = { status: "idle" };
		},
		resetPaymentStateClover(state) {
			state.paymentState = { status: "idle" };
		},
		updateObjectPayment(state, action) {
			state.dataPaymentCreditCard = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(createCode.fulfilled, (state, action) => {
				const data = action.payload.data;
				state.actionState.status = "completed";

				state.accessToken = data.access_token;
				localStorage.setItem(import.meta.env.VITE_APP_storageAccessTokenKeyClover!, data.access_token);
				state.refreshToken = data.refresh_token;
				state.accessTokenExpiration = data.access_token_expiration;
				state.refreshTokenExpiration = data.refresh_token_expiration;
				// state.accessToken = data.
			})
			.addCase(createCode.pending, (state) => {
				state.actionState.status = "loading";
			})
			.addCase(createCode.rejected, (state, action) => {
				const error = action.payload || "Unknown error occurred.";
				if (error == "AUTHENTICATE_FAILED")
					state.actionState = { status: "failed", code: "401", error: t("clover_authen_faild") };
				else state.actionState = { status: "failed", code: "401", error: error };
			})
			.addCase(refreshTokenClover.fulfilled, (state, action) => {
				state.actionState.status = "completed";
				const data = action.payload.data;
				state.accessToken = data.access_token;
				state.refreshToken = data.refresh_token;
				state.accessTokenExpiration = data.access_token_expiration;
				state.refreshTokenExpiration = data.refresh_token_expiration;
			})
			.addCase(refreshTokenClover.pending, (state, _action) => {
				state.actionState.status = "loading";
			})
			.addCase(refreshTokenClover.rejected, (state, action) => {
				const error = parseHttpError(action.payload);
				state.actionState = { status: "failed", code: error.statusCode, error: error.message };
			})
			.addCase(displayOrderClover.fulfilled, (state, _action) => {
				state.actionState.status = "completed";
			})
			.addCase(displayOrderClover.pending, (state, _action) => {
				state.actionState.status = "loading";
			})
			.addCase(displayOrderClover.rejected, (state, action) => {
				const error = parseHttpError(action.payload);
				state.actionState = { status: "failed", code: error.statusCode, error: error.message };
			})
			.addCase(paymentClover.fulfilled, (state, action) => {
				if (action.payload.code === 209) {
					const error = parseHttpError(action.payload);
					console.log({ error });
					state.paymentState = { status: "failed", code: error.statusCode, error: "Payment failed" };
				} else {
					state.paymentState.status = "completed";
				}
			})
			.addCase(paymentClover.pending, (state, _action) => {
				state.paymentState.status = "loading";
			})
			.addCase(paymentClover.rejected, (state, action) => {
				const error = parseHttpError(action.payload);
				state.paymentState = { status: "failed", code: error.statusCode, error: error.message };
			});
	},
});
export const {
	updateCode,
	updateAccessToken,
	updateRefreshToken,
	resetActionStateClover,
	resetPaymentStateClover,
	updateObjectPayment,
} = CloverSlice.actions;

export default CloverSlice.reducer;
