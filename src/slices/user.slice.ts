import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { commonCreateAsyncThunk } from "../app/thunk";
import { RequestState } from "../app/state";
import { parseHttpError, parseHttpErrorResponse } from "../app/error";
import { UserService } from "../services/User.service";
import { UserModel } from "../models/category/User.model";
import { isStrContainIgnoreCase } from "../utils/string.ultil";
import { actions } from "../types";
export interface UserState {
	list: UserModel[];
	avatar: any;
	filtered: UserModel[];
	item: UserModel | undefined;
	profile: UserModel | undefined;
	fetchState: RequestState;
	actionState: RequestState;
	currentPage: number;
	currentRows: number;
	roleId: string;
	getAvtState: RequestState;
	action: actions;
	successMessage: string;
	itemPosition: {
		positionPoint: number;
		positionWindow: string;
		positionWindowName: string;
	};
}
const initialState: UserState = {
	list: [],
	avatar: null,
	filtered: [],
	profile: undefined,
	item: undefined,
	fetchState: { status: "idle" },
	actionState: { status: "idle" },
	getAvtState: { status: "idle" },
	currentPage: 1,
	currentRows: 10,
	roleId: "",
	action: "INS",
	successMessage: "",
	itemPosition: {
		positionPoint: 0,
		positionWindow: "",
		positionWindowName: "",
	},
};
export const fetchUsers: any = commonCreateAsyncThunk({ type: "user/fetchUsers", action: UserService.fetchUsers });
export const addUser: any = commonCreateAsyncThunk({ type: "user/addUser", action: UserService.addUser });
export const updateUserRole: any = commonCreateAsyncThunk({
	type: "user/updateUserRole",
	action: UserService.updateUserRole,
});
export const deleteUser: any = commonCreateAsyncThunk({ type: "user/deleteUser", action: UserService.deleteUser });
export const restoreUser: any = commonCreateAsyncThunk({ type: "user/restoreUser", action: UserService.restoreUser });
export const getAvatarEmployee: any = createAsyncThunk("profile/getAvatarEmployee", UserService.getAvatarEmployee);
export const resetPassUser: any = commonCreateAsyncThunk({
	type: "user/resetPassUser",
	action: UserService.resetPassUser,
});
export const UserSlice = createSlice({
	name: "User",
	initialState,
	reducers: {
		changeAction: (state, action) => {
			state.action = action.payload;
		},
		selectItem(state, action) {
			state.item = action.payload;
		},
		setProfileToUpdate(state, action) {
			if (state.item) {
				state.item.profile = action.payload;
			}
		},
		setRoleToUpdate(state, action) {
			if (state.item) {
				state.item.roleId = action.payload;
			}
		},
		resetFetchState(state) {
			state.fetchState = { status: "idle" };
		},
		resetActionState(state) {
			state.actionState = { status: "idle" };
		},
		resetActionStateUser(state) {
			state.actionState = { status: "idle" };
		},
		resetAvatarState(state) {
			state.getAvtState = { status: "idle" };
		},
		selectItemPosition(state, action) {
			state.itemPosition = action.payload;
		},
		// filterSearch(state, action) {
		//     state.filtered = state.list.filter((item) => {
		//         const fullName = `${item.profile.lastName}${item.profile.middleName ? ' ' + item.profile.middleName : ''} ${item.profile.firstName}`;
		//         const searchString = `${fullName} ${item.profile.phone} ${item.profile.street1} ${item?.role} ${item?.username}`;
		//         return isStrContainIgnoreCase(searchString, action.payload);
		//     });
		// },
		filterSearch: (state, action: PayloadAction<{ searchString: string; status: string }>) => {
			state.filtered = state.list.filter((item) => {
				const fullName = `${item.profile.firstName}${
					item.profile.middleName ? " " + item.profile.middleName : ""
				} ${item.profile.lastName}`;
				const searchString = `${fullName} ${item.profile.phone} ${item.profile.street1} ${item?.role} ${item?.username}`;
				return (
					(action.payload.status == "ALL" || item.status === action.payload.status) &&
					isStrContainIgnoreCase(searchString, action.payload.searchString)
				);
			});
		},
		filterSearchEmpl: (state, action: PayloadAction<{ searchString: string; status: string }>) => {
			state.filtered = state.list.filter((item) => {
				const fullName = `${item.profile.lastName}${
					item.profile.middleName ? " " + item.profile.middleName : ""
				} ${item.profile.firstName}`;
				const searchString = `${fullName} ${item.profile.phone} ${item.profile.street1} ${item?.role} ${item?.username}`;
				return (
					(action.payload.status == "ALL" || item.status === action.payload.status) &&
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
			.addCase(fetchUsers.fulfilled, (state, action) => {
				state.fetchState.status = "completed";
				const data = action.payload.data;
				const users = UserService.usersFromJson(data.data);
				state.list = users;
				// state.filtered = users
			})
			.addCase(fetchUsers.pending, (state, _action) => {
				state.fetchState.status = "loading";
			})
			.addCase(fetchUsers.rejected, (state, action) => {
				const error = parseHttpError(action.payload);
				state.fetchState = { status: "failed", code: error.statusCode, error: error.message };
			})
			.addCase(addUser.fulfilled, (state, _action) => {
				state.actionState.status = "completed";
				state.successMessage = "Add the employee’s information successfully!";
			})
			.addCase(addUser.pending, (state, _action) => {
				state.actionState.status = "loading";
			})
			.addCase(addUser.rejected, (state, action) => {
				const error = parseHttpErrorResponse(action.payload);
				state.actionState = { status: "failed", code: error.statusCode, error: error.message };
			})
			.addCase(updateUserRole.fulfilled, (state, _action) => {
				state.actionState.status = "completed";
			})
			.addCase(updateUserRole.pending, (state, _action) => {
				state.actionState.status = "loading";
			})
			.addCase(updateUserRole.rejected, (state, action) => {
				const error = parseHttpError(action.payload);
				state.actionState = { status: "failed", code: error.statusCode, error: error.message };
			})
			.addCase(deleteUser.fulfilled, (state, _action) => {
				state.actionState.status = "completed";
				state.item = _action.payload.data.data;
				state.successMessage = _action.payload.data.message;
			})
			.addCase(deleteUser.pending, (state, _action) => {
				state.actionState.status = "loading";
			})
			.addCase(deleteUser.rejected, (state, action) => {
				const error = parseHttpError(action.payload);
				state.actionState = { status: "failed", code: error.statusCode, error: error.message };
			})
			.addCase(restoreUser.fulfilled, (state, _action) => {
				state.actionState.status = "completed";
				state.item = _action.payload.data.data;
			})
			.addCase(restoreUser.pending, (state, _action) => {
				state.actionState.status = "loading";
			})
			.addCase(restoreUser.rejected, (state, action) => {
				const error = parseHttpError(action.payload);
				state.actionState = { status: "failed", code: error.statusCode, error: error.message };
			})
			.addCase(resetPassUser.fulfilled, (state, _action) => {
				state.actionState.status = "completed";
			})
			.addCase(resetPassUser.pending, (state, _action) => {
				state.actionState.status = "loading";
			})
			.addCase(resetPassUser.rejected, (state, action) => {
				const error = parseHttpError(action.payload);
				state.actionState = { status: "failed", code: error.statusCode, error: error.message };
			})
			.addCase(getAvatarEmployee.fulfilled, (state, action) => {
				state.avatar = action.payload;
				state.getAvtState.status = "completed";
			})
			.addCase(getAvatarEmployee.pending, (state, _action) => {
				state.getAvtState.status = "loading";
			})
			.addCase(getAvatarEmployee.rejected, (state, _action) => {
				const error = parseHttpError(_action.payload);
				state.avatar = null;
				// const error = parseHttpError(action.payload)
				state.getAvtState = { status: "failed", code: error.statusCode, error: error.message };
			});
	},
});
export const {
	selectItem,
	resetFetchState,
	resetActionState,
	filterSearch,
	setCurrentPage,
	setCurrentRows,
	resetActionStateUser,
	filterSearchEmpl,
	setProfileToUpdate,
	setRoleToUpdate,
	changeAction,
	selectItemPosition,
} = UserSlice.actions;

export default UserSlice.reducer;
