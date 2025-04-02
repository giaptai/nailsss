import { createSlice } from "@reduxjs/toolkit";
import { parseHttpError } from "../app/error";
import { RequestState } from "../app/state";
import { commonCreateAsyncThunk } from "../app/thunk";
import { GiftcardModel } from "../models/category/Giftcard.model";
import { GiftcardService } from "../services/Giftcard.service";
import { isStrContainIgnoreCase } from "../utils/string.ultil";
export interface GiftcardState {
	list: GiftcardModel[];
	filtered: GiftcardModel[];
	item: GiftcardModel | undefined;
	fetchState: RequestState;
	actionState: RequestState;
	fetchDetailState: RequestState;
	currentPage: number;
	currentRows: number;
	createSellSuccess: GiftcardModel | undefined;
}
const initialState: GiftcardState = {
	list: [],
	filtered: [],
	item: undefined,
	fetchState: { status: "idle" },
	actionState: { status: "idle" },
	fetchDetailState: { status: "idle" },
	currentPage: 1,
	currentRows: 10,
	createSellSuccess: undefined,
};
export const addGiftcard: any = commonCreateAsyncThunk({
	type: "giftcard/addGiftcard",
	action: GiftcardService.addGiftcard,
});
export const fetchGiftcard: any = commonCreateAsyncThunk({
	type: "giftcard/getGiftcard",
	action: GiftcardService.fetchGiftcard,
});
export const updateGiftcard: any = commonCreateAsyncThunk({
	type: "giftcard/updateGiftcard",
	action: GiftcardService.updateGiftcard,
});
export const deleteGiftcard: any = commonCreateAsyncThunk({
	type: "giftcard/deleteGiftcard",
	action: GiftcardService.deleteGiftcard,
});
export const restoreGiftcard: any = commonCreateAsyncThunk({
	type: "giftcard/restoreGiftcard",
	action: GiftcardService.restoreGiftcard,
});
export const fetchDetailGiftcard: any = commonCreateAsyncThunk({
	type: "giftcard/fetchDetailGiftcard",
	action: GiftcardService.fetchDetailGiftcard,
});

export const GiftCardSlice = createSlice({
	name: "menu",
	initialState,
	reducers: {
		selectItem(state, action) {
			state.item = action.payload;
		},
		resetFetchState(state) {
			state.fetchState = { status: "idle" };
		},
		resetActionState(state) {
			state.actionState = { status: "idle" };
		},
		resetFetchDetailState(state) {
			state.fetchDetailState = { status: "idle" };
		},
		setFiltered(state, action) {
			state.filtered = action.payload;
		},
		filterSearch(state, action) {
			state.filtered = state.list.filter((item) =>
				isStrContainIgnoreCase(
					`${item.cardId} ${
						item.type == "SELL_A_NEW" ? "Sell A New Gift Card" : "Give Store Credit Gift card"
					} ${item.phone} ${item.amount} ${item.firstName} ${item.lastName}`,
					action.payload
				)
			);
		},
		setCurrentPage: (state, action) => {
			state.currentPage = action.payload;
		},
		setCurrentRows: (state, action) => {
			state.currentRows = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(addGiftcard.fulfilled, (state, action) => {
				state.actionState.status = "completed";
				state.createSellSuccess = action.payload.data.data;
			})
			.addCase(addGiftcard.pending, (state, _action) => {
				state.actionState.status = "loading";
			})
			.addCase(addGiftcard.rejected, (state, action) => {
				const error = parseHttpError(action.payload);
				state.actionState = { status: "failed", code: error.statusCode, error: error.message };
			})
			.addCase(fetchGiftcard.fulfilled, (state, action) => {
				state.fetchState.status = "completed";
				const data = action.payload.data;
				state.list = GiftcardService.GiftcardFromJson(data.data);
				state.filtered = state.list;
			})
			.addCase(fetchGiftcard.pending, (state, _action) => {
				state.fetchState.status = "loading";
			})
			.addCase(fetchGiftcard.rejected, (state, action) => {
				const error = parseHttpError(action.payload);
				state.fetchState = { status: "failed", code: error.statusCode, error: error.message };
			})
			.addCase(updateGiftcard.fulfilled, (state, _action) => {
				state.actionState.status = "completed";
			})
			.addCase(updateGiftcard.pending, (state, _action) => {
				state.actionState.status = "loading";
			})
			.addCase(updateGiftcard.rejected, (state, action) => {
				const error = parseHttpError(action.payload);
				state.actionState = { status: "failed", code: error.statusCode, error: error.message };
			})
			.addCase(deleteGiftcard.fulfilled, (state, _action) => {
				state.actionState.status = "completed";
			})
			.addCase(deleteGiftcard.pending, (state, _action) => {
				state.actionState.status = "loading";
			})
			.addCase(deleteGiftcard.rejected, (state, action) => {
				const error = parseHttpError(action.payload);
				state.actionState = { status: "failed", code: error.statusCode, error: error.message };
			})
			.addCase(restoreGiftcard.fulfilled, (state, _action) => {
				state.actionState.status = "completed";
			})
			.addCase(restoreGiftcard.pending, (state, _action) => {
				state.actionState.status = "loading";
			})
			.addCase(restoreGiftcard.rejected, (state, action) => {
				const error = parseHttpError(action.payload);
				state.actionState = { status: "failed", code: error.statusCode, error: error.message };
			})
			.addCase(fetchDetailGiftcard.fulfilled, (state, action) => {
				state.fetchDetailState.status = "completed";
				const res = action.payload.data.data;
				const item = new GiftcardModel(
					res._id,
					res.cardId,
					res.amount,
					res.firstName,
					res.lastName,
					res.phone,
					res.zipcode,
					res.note,
					res.type,
					res.status,
					res.remaining,
					res.histories
				);
				state.item = item;
			})
			.addCase(fetchDetailGiftcard.pending, (state, _action) => {
				state.fetchDetailState.status = "loading";
			})
			.addCase(fetchDetailGiftcard.rejected, (state, action) => {
				const error = parseHttpError(action.payload);
				state.fetchDetailState = { status: "failed", code: error.statusCode, error: error.message };
			});
	},
});
export const {
	selectItem,
	resetFetchState,
	setFiltered,
	resetActionState,
	resetFetchDetailState,
	filterSearch,
	setCurrentPage,
	setCurrentRows,
} = GiftCardSlice.actions;

export default GiftCardSlice.reducer;
