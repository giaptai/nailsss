import { RoleService } from "../services/Role.service";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RoleModel } from "../models/category/Role.model";
import { commonCreateAsyncThunk } from "../app/thunk";
import { RequestState } from "../app/state";
import { parseHttpError } from "../app/error";
import { isStrContainIgnoreCase } from "../utils/string.ultil";
import { actions } from "../types";

export interface RoleState {
	list: RoleModel[];
	filtered: RoleModel[];
	item: RoleModel | undefined;
	fetchState: RequestState;
	actionState: RequestState;
	currentPage: number;
	currentRows: number;
	action: actions;
	successMessage: string;
}
const initialState: RoleState = {
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
export const getRole: any = commonCreateAsyncThunk({ type: "role/getRole", action: RoleService.getRole });
export const fetchRoles: any = commonCreateAsyncThunk({ type: "role/fetchRoles", action: RoleService.fetchRoles });
export const addRole: any = commonCreateAsyncThunk({ type: "role/addRole", action: RoleService.addRole });
export const updateRole: any = commonCreateAsyncThunk({ type: "role/updateRole", action: RoleService.updateRole });
export const deleteRole: any = commonCreateAsyncThunk({ type: "role/deleteRole", action: RoleService.deleteRole });
export const restoreRole: any = commonCreateAsyncThunk({ type: "role/restoreRole", action: RoleService.restoreRole });
export const RoleSlice = createSlice({
	name: "role",
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
		resetActionStateRole(state) {
			state.actionState = { status: "idle" };
		},
		setFiltered(state, action) {
			state.filtered = action.payload;
		},
		filterSearch: (state, action: PayloadAction<{ searchString: string; status: string }>) => {
			state.filtered = state.list.filter((item) => {
				const searchString = `${item.name} ${item.note}`;
				return (
					(action.payload.status == "ALL" || item.status.code === action.payload.status) &&
					isStrContainIgnoreCase(searchString, action.payload.searchString) &&
					item.code != "R0000"
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
			.addCase(getRole.fulfilled, (state, action) => {
				state.fetchState.status = "completed";
				const data = action.payload.data;
				state.item = RoleService.roleFromJson(data.data);
			})
			.addCase(getRole.pending, (state, _action) => {
				state.fetchState.status = "loading";
			})
			.addCase(getRole.rejected, (state, action) => {
				const error = parseHttpError(action.payload);
				state.fetchState = { status: "failed", code: error.statusCode, error: error.message };
			})
			.addCase(fetchRoles.fulfilled, (state, action) => {
				const data = action.payload.data;
				state.list = RoleService.rolesFromJson(data.data);
				// state.filtered = state.list.filter((it) => it.code != "R0000");
				state.fetchState.status = "completed";
			})
			.addCase(fetchRoles.pending, (state, _action) => {
				state.fetchState.status = "loading";
			})
			.addCase(fetchRoles.rejected, (state, action) => {
				const error = parseHttpError(action.payload);
				state.fetchState = { status: "failed", code: error.statusCode, error: error.message };
			})
			.addCase(addRole.fulfilled, (state, _action) => {
				state.successMessage = "Add the role successfully!";
				state.actionState.status = "completed";
			})
			.addCase(addRole.pending, (state, _action) => {
				state.actionState.status = "loading";
			})
			.addCase(addRole.rejected, (state, action) => {
				const error = parseHttpError(action.payload);
				state.actionState = { status: "failed", code: error.statusCode, error: error.message };
			})
			.addCase(updateRole.fulfilled, (state, _action) => {
				state.actionState.status = "completed";
			})
			.addCase(updateRole.pending, (state, _action) => {
				state.actionState.status = "loading";
			})
			.addCase(updateRole.rejected, (state, action) => {
				const error = parseHttpError(action.payload);
				state.actionState = { status: "failed", code: error.statusCode, error: error.message };
			})
			.addCase(deleteRole.fulfilled, (state, _action) => {
				state.actionState.status = "completed";
				state.successMessage = "Deleted role successfully";
				state.item = _action.payload.data.data;
			})
			.addCase(deleteRole.pending, (state, _action) => {
				state.actionState.status = "loading";
			})
			.addCase(deleteRole.rejected, (state, action) => {
				const error = parseHttpError(action.payload);
				state.actionState = { status: "failed", code: error.statusCode, error: error.message };
			})
			.addCase(restoreRole.fulfilled, (state, action) => {
				state.actionState.status = "completed";
				state.item = action.payload.data.data;
			})
			.addCase(restoreRole.pending, (state, _action) => {
				state.actionState.status = "loading";
			})
			.addCase(restoreRole.rejected, (state, action) => {
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
	resetActionStateRole,
	changeAction,
} = RoleSlice.actions;

export default RoleSlice.reducer;
