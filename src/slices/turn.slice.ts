import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RequestState } from "../app/state";
import { TurnModel } from "../models/category/Turn.model";
import { commonCreateAsyncThunk } from "../app/thunk";
import { TurnService } from "../services/Turn.service";
import { parseHttpError } from "../app/error";
import { isStrContainIgnoreCase } from "../utils/string.ultil";

export interface TurnState {
	list: TurnModel[];
	filtered: TurnModel[];
	item: TurnModel | undefined;
	fetchState: RequestState;
	actionState: RequestState;
}
const initialState: TurnState = {
	list: [],
	filtered: [],
	item: undefined,
	fetchState: { status: "idle" },
	actionState: { status: "idle" },
};
export const fetchTurn: any = commonCreateAsyncThunk({ type: "Turn/getTurn", action: TurnService.fetchTurn });

export const TurnSlice = createSlice({
	name: "Turn",
	initialState,
	reducers: {
		selectItemTurn(state, action) {
			state.item = action.payload;
		},
		resetFetchState(state) {
			state.fetchState = { status: "idle" };
		},
		resetActionState(state) {
			state.actionState = { status: "idle" };
		},
		filterSearch: (state, action: PayloadAction<{ searchString: string }>) => {
			if (state.item) state.item = undefined;
			state.filtered = state.list.filter((item) => {
				const fullName = `${item.profile.firstName}${
					item.profile.middleName ? " " + item.profile.middleName : ""
				} ${item.profile.lastName}`;

				const searchString = `${fullName}`;
				return isStrContainIgnoreCase(searchString, action.payload.searchString);
			});
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchTurn.fulfilled, (state, action) => {
				state.fetchState.status = "completed";
				const data = action.payload.data.data.sort((a: any, b: any) => {
					const totalTurnA = a.turns.reduce((sum: any, turn: any) => sum + turn.totalTurn, 0);
					const totalTurnB = b.turns.reduce((sum: any, turn: any) => sum + turn.totalTurn, 0);
					return totalTurnA - totalTurnB;
				});
				state.list = TurnService.TurnFromJson(data);
				state.filtered = state.list;
			})
			.addCase(fetchTurn.pending, (state, _action) => {
				state.fetchState.status = "loading";
			})
			.addCase(fetchTurn.rejected, (state, action) => {
				const error = parseHttpError(action.payload);
				state.fetchState = { status: "failed", code: error.statusCode, error: error.message };
			});
	},
});
export const { selectItemTurn, resetFetchState, resetActionState, filterSearch } = TurnSlice.actions;

export default TurnSlice.reducer;
