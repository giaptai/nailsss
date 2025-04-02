import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RequestState } from "../app/state";
import { StatementModel } from "../models/category/Statement.model";
import { commonCreateAsyncThunk } from "../app/thunk";
import { parseHttpError } from "../app/error";
import { StatementService } from "../services/Statement.service";
import { ReportTransactionsModel } from "../models/category/ReportRevenue.model";
import { isStrContainIgnoreCase } from "../utils/string.ultil";

export interface StatementState {
	list: StatementModel[];
	filtered: StatementModel[];
	item: StatementModel | undefined;
	fetchState: RequestState;
	actionState: RequestState;
	listTransaction: ReportTransactionsModel[];
	itemTransaction: ReportTransactionsModel | undefined;
}
const initialState: StatementState = {
	list: [],
	filtered: [],
	item: undefined,
	fetchState: { status: "idle" },
	actionState: { status: "idle" },
	listTransaction: [],
	itemTransaction: undefined,
};
// export const getRole: any = commonCreateAsyncThunk({ type: 'role/getRole', action: RoleService.getRole });
export const getStatements: any = commonCreateAsyncThunk({
	type: "Statement/getStatements",
	action: StatementService.fetchStatement,
});
export const reloadReport: any = commonCreateAsyncThunk({
	type: "Statement/reloadReport",
	action: StatementService.reloadReport,
});
export const getReportRevenue: any = commonCreateAsyncThunk({
	type: "Statement/getReportRevenue",
	action: StatementService.getReportRevenue,
});
export const StatementSlice = createSlice({
	name: "Statement",
	initialState,
	reducers: {
		selectItem(state, action) {
			state.item = action.payload;
		},
		selectItemTransaction(state, action) {
			state.itemTransaction = action.payload;
		},
		resetFetchState(state) {
			state.fetchState = { status: "idle" };
		},
		resetActionState(state) {
			state.actionState = { status: "idle" };
		},
		setFiltered(state, action) {
			state.filtered = action.payload;
		},
		filterSearch: (state, action: PayloadAction<{ searchString: string }>) => {
			state.filtered = state.list.filter((item) => {
				const searchString = `${item.totalAmountOrder} ${item.totalAmountPayroll} ${item.totalAmountStore} ${item.totalAmountStoreTip} ${item.totalDiscount} ${item.totalFeeCreditCard} ${item.totalTax}`;
				return isStrContainIgnoreCase(searchString, action.payload.searchString);
			});
		},
	},
	extraReducers: (builder) => {
		builder
			// .addCase(addStatement.fulfilled, (state, _action) => {
			//     state.actionState.status = 'completed'
			// })
			// .addCase(addStatement.pending, (state, _action) => {
			//     state.actionState.status = 'loading'
			// })
			// .addCase(addStatement.rejected, (state, action) => {
			//     const error = parseHttpError(action.payload)
			//     state.actionState = { status: "failed", code: error.statusCode, error: error.message }
			// })
			.addCase(getStatements.fulfilled, (state, action) => {
				state.fetchState.status = "completed";
				state.list = action.payload?.data?.data;
				state.filtered = action.payload?.data?.data;
			})
			.addCase(getStatements.pending, (state, _action) => {
				state.fetchState.status = "loading";
			})
			.addCase(getStatements.rejected, (state, action) => {
				const error = parseHttpError(action.payload);
				state.fetchState = { status: "failed", code: error.statusCode, error: error.message };
			})
			.addCase(reloadReport.fulfilled, (state, _action) => {
				state.fetchState.status = "completed";
			})
			.addCase(reloadReport.pending, (state, _action) => {
				state.fetchState.status = "loading";
			})
			.addCase(reloadReport.rejected, (state, action) => {
				const error = parseHttpError(action.payload);
				state.fetchState = { status: "failed", code: error.statusCode, error: error.message };
			})
			.addCase(getReportRevenue.fulfilled, (state, action) => {
				state.fetchState.status = "completed";
				const data = action.payload.data?.data;
				state.listTransaction = data;
			})
			.addCase(getReportRevenue.pending, (state, _action) => {
				state.fetchState.status = "loading";
			})
			.addCase(getReportRevenue.rejected, (state, action) => {
				const error = parseHttpError(action.payload);
				state.fetchState = { status: "failed", code: error.statusCode, error: error.message };
			});
	},
});
export const { selectItem, resetFetchState, setFiltered, resetActionState, selectItemTransaction, filterSearch } =
	StatementSlice.actions;

export default StatementSlice.reducer;
