import { createSlice } from "@reduxjs/toolkit";

import { commonCreateAsyncThunk } from "../app/thunk";
import { RequestState } from "../app/state";
import { parseHttpError, parseHttpErrorResponse } from "../app/error";
import { AbilityService } from "../services/Ability.service";
import { AbilityModel } from "../models/category/Ability.model";

export interface AbilityState {
	item: AbilityModel | undefined;
	actionState: RequestState;
}
const initialState: AbilityState = {
	item: undefined,
	actionState: { status: "idle" },
};
export const addAbility: any = commonCreateAsyncThunk({
	type: "ability/addAbility",
	action: AbilityService.addAbility,
});
export const updateAbility: any = commonCreateAsyncThunk({
	type: "ability/updateAbility",
	action: AbilityService.updateAbility,
});
export const deleteAbility: any = commonCreateAsyncThunk({
	type: "ability/deleteAbility",
	action: AbilityService.deleteAbility,
});
export const AbilitySlice = createSlice({
	name: "ability",
	initialState,
	reducers: {
		selectItem(state, action) {
			state.item = action.payload;
		},
		resetActionState(state) {
			state.actionState = { status: "idle" };
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(addAbility.fulfilled, (state, _action) => {
				state.actionState.status = "completed";
			})
			.addCase(addAbility.pending, (state, _action) => {
				state.actionState.status = "loading";
			})
			.addCase(addAbility.rejected, (state, action) => {
				const error = parseHttpErrorResponse(action.payload);
				state.actionState = { status: "failed", code: error.statusCode, error: error.message };
			})
			.addCase(updateAbility.fulfilled, (state, _action) => {
				state.actionState.status = "completed";
			})
			.addCase(updateAbility.pending, (state, _action) => {
				state.actionState.status = "loading";
			})
			.addCase(updateAbility.rejected, (state, action) => {
				const error = parseHttpError(action.payload);
				state.actionState = { status: "failed", code: error.statusCode, error: error.message };
			})
			.addCase(deleteAbility.fulfilled, (state, _action) => {
				state.actionState.status = "completed";
			})
			.addCase(deleteAbility.pending, (state, _action) => {
				state.actionState.status = "loading";
			})
			.addCase(deleteAbility.rejected, (state, action) => {
				const error = parseHttpError(action.payload);
				state.actionState = { status: "failed", code: error.statusCode, error: error.message };
			});
	},
});
export const { selectItem, resetActionState } = AbilitySlice.actions;

export default AbilitySlice.reducer;
