import { createSlice } from "@reduxjs/toolkit";
import { RequestState } from "../app/state";
import { WindowModel } from "../models/category/Window.model";
import { commonCreateAsyncThunk } from "../app/thunk";
import { WindowService } from "../services/Window.service";
import { parseHttpError } from "../app/error";
import { isStrContainIgnoreCase } from "../utils/string.ultil";
import { actions } from "../types";

export interface WindowState {
	list: WindowModel[];
	filtered: WindowModel[];
	item: WindowModel | undefined;
	fetchState: RequestState;
	actionState: RequestState;
	currentPage: number;
	currentRows: number;
	action: actions;
	successMessage: string;
}
const initialState: WindowState = {
	list: [],
	filtered: [],
	item: undefined,
	fetchState: { status: "idle" },
	actionState: { status: "idle" },
	currentPage: 1,
	currentRows: 10,
	action: "INS",
	successMessage: "",
};
// export const getRole: any = commonCreateAsyncThunk({ type: 'role/getRole', action: RoleService.getRole });
export const addWindow: any = commonCreateAsyncThunk({ type: "window/addWindow", action: WindowService.addWindow });
export const fetchWindow: any = commonCreateAsyncThunk({ type: "window/getWindow", action: WindowService.fetchWindow });
export const updateWindow: any = commonCreateAsyncThunk({
	type: "window/updateWindow",
	action: WindowService.updateWindow,
});
export const deleteWindow: any = commonCreateAsyncThunk({
	type: "window/deleteWindow",
	action: WindowService.deleteWindow,
});
export const restoreWindow: any = commonCreateAsyncThunk({
	type: "window/restoreWindow",
	action: WindowService.restoreWindwos,
});

export const WindowSlice = createSlice({
	name: "window",
	initialState,
	reducers: {
		changeAction: (state, action) => {
			state.action = action.payload;
		},
		selectItem(state, action) {
			state.item = action.payload;
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
		filterSearch(state, action) {
			state.filtered = state.list.filter((item) => {
				const searchString = `${item.name} ${item.type} ${item.code}`;
				return (
					(action.payload.status == "ALL" || item.status.value === action.payload.status) &&
					isStrContainIgnoreCase(searchString, action.payload.searchString)
				);
			});
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
			.addCase(addWindow.fulfilled, (state, _action) => {
				state.successMessage = "Save window successfully";
				state.actionState.status = "completed";
			})
			.addCase(addWindow.pending, (state, _action) => {
				state.actionState.status = "loading";
			})
			.addCase(addWindow.rejected, (state, action) => {
				const error = parseHttpError(action.payload);
				state.actionState = { status: "failed", code: error.statusCode, error: error.message };
			})
			.addCase(fetchWindow.fulfilled, (state, action) => {
				state.fetchState.status = "completed";
				const data = action.payload.data;
				state.list = WindowService.windowFromJson(data.data);
				state.filtered = state.list.filter((it) => it.code != "R0000");
			})
			.addCase(fetchWindow.pending, (state, _action) => {
				state.fetchState.status = "loading";
			})
			.addCase(fetchWindow.rejected, (state, action) => {
				const error = parseHttpError(action.payload);
				state.fetchState = { status: "failed", code: error.statusCode, error: error.message };
			})
			.addCase(updateWindow.fulfilled, (state, _action) => {
				state.successMessage = "Save window successfully";
				state.actionState.status = "completed";
			})
			.addCase(updateWindow.pending, (state, _action) => {
				state.actionState.status = "loading";
			})
			.addCase(updateWindow.rejected, (state, action) => {
				const error = parseHttpError(action.payload);
				state.actionState = { status: "failed", code: error.statusCode, error: error.message };
			})
			.addCase(deleteWindow.fulfilled, (state, _action) => {
				state.actionState.status = "completed";
			})
			.addCase(deleteWindow.pending, (state, _action) => {
				state.actionState.status = "loading";
			})
			.addCase(deleteWindow.rejected, (state, action) => {
				const error = parseHttpError(action.payload);
				state.actionState = { status: "failed", code: error.statusCode, error: error.message };
			})
			.addCase(restoreWindow.fulfilled, (state, _action) => {
				state.actionState.status = "completed";
			})
			.addCase(restoreWindow.pending, (state, _action) => {
				state.actionState.status = "loading";
			})
			.addCase(restoreWindow.rejected, (state, action) => {
				const error = parseHttpError(action.payload);
				state.actionState = { status: "failed", code: error.statusCode, error: error.message };
			});
	},
});
export const {
	selectItem,
	resetFetchState,
	setFiltered,
	resetActionState,
	filterSearch,
	setCurrentPage,
	setCurrentRows,
	changeAction,
} = WindowSlice.actions;

export default WindowSlice.reducer;
