import { createSlice } from "@reduxjs/toolkit";
import { parseHttpError } from "../app/error";
import { BussinessInfoState, RequestState } from "../app/state";
import { commonCreateAsyncThunk } from "../app/thunk";
import { AuthService } from "../services/Auth.service";
import { HttpService } from "../services/http/HttpService";

export interface AuthState {
	user: any;
	role: any;
	tokens: any;
	loginState: RequestState;
	actionState: RequestState;
	BusinessInfo: BussinessInfoState;
}
const initialState: AuthState = {
	user: false,
	role: undefined,
	tokens: false,
	loginState: { status: "idle" },
	actionState: { status: "idle" },
	BusinessInfo: {
		city: "",
		dbName: "",
		email: "",
		name: "",
		phone: "",
		state: "",
		street1: "",
		street2: "",
		zipcode: "",
	},
};
export const login: any = commonCreateAsyncThunk({ type: "auth/login", action: AuthService.login });
export const changePassword: any = commonCreateAsyncThunk({
	type: "profile/changePassword",
	action: AuthService.changePassword,
});
export const getDbname: any = commonCreateAsyncThunk({ type: "profile/getDbname", action: AuthService.getDbName });
export const activeAccount: any = commonCreateAsyncThunk({
	type: "auth/activeAccount",
	action: AuthService.activeAccount,
});
// export const createMode: any = commonCreateAsyncThunk({
// 	type: "ath/createMode",
// 	action: CloverService.CreateMode,
// });

export const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		resetLoginState(state) {
			(state.loginState = { status: "idle" }), (state.actionState = { status: "idle" });
		},
		resetActionStateChange(state) {
			state.actionState = { status: "idle" };
		},
		setRole(state, action) {
			state.role = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(login.fulfilled, (state, action) => {
				try {
					state.loginState.status = "completed";
					const data = action.payload.data;
					state.user = data.data;
					if (data?.data?.role) {
						state.role = data?.data?.role;
					}
					HttpService.setToken(data.data.token.accessToken);
					HttpService.setRefreshToken(data.data.token.refreshToken);
					state.tokens = data.data.token;
					console.log(data.data.token);
				} catch (error: any) {
					console.log(error);
					if (error instanceof Error) {
						state.loginState = {
							status: "failed",
							error: error.message,
						};
					} else {
						state.loginState = {
							status: "failed",
							error: String(error),
						};
					}
				}
			})
			.addCase(login.pending, (state, _action) => {
				state.loginState.status = "loading";
			})
			.addCase(login.rejected, (state, action) => {
				try {
					const error = parseHttpError(action.payload);
					state.loginState.status = "failed";
					state.loginState.code = error.statusCode;
					state.loginState.error = action.payload.response.data.message;
					state.loginState = {
						status: "failed",
						code: error.statusCode,
						error: action.payload.response.data.message,
					};
				} catch (error) {
					console.log(error);
					if (error instanceof Error) {
						if (error.message == "Cannot read properties of undefined (reading 'data')") {
							state.loginState = {
								status: "failed",
								error: "Network Error",
							};
						} else
							state.loginState = {
								status: "failed",
								error: error.message,
							};
					} else {
						state.loginState = {
							status: "failed",
							error: String(error),
						};
					}
				}
			})
			.addCase(changePassword.fulfilled, (state, _action) => {
				state.actionState.status = "completed";
			})
			.addCase(changePassword.pending, (state, _action) => {
				state.actionState.status = "loading";
			})
			.addCase(changePassword.rejected, (state, action) => {
				state.actionState = action.payload;
				state.actionState.status = "failed";
			})
			.addCase(getDbname.fulfilled, (state, action) => {
				state.BusinessInfo = action.payload.data.data;
				state.actionState.status = "completed";
			})
			.addCase(getDbname.pending, (state, _action) => {
				state.actionState.status = "loading";
			})
			.addCase(getDbname.rejected, (state, action) => {
				state.actionState = action.payload;
				(state.BusinessInfo = {
					city: "",
					dbName: "",
					email: "",
					name: "",
					phone: "",
					state: "",
					street1: "",
					street2: "",
					zipcode: "",
				}),
					(state.actionState.status = "failed");
			})
			.addCase(activeAccount.fulfilled, (state, _action) => {
				state.actionState.status = "completed";
			})
			.addCase(activeAccount.pending, (state, _action) => {
				state.actionState.status = "loading";
			})
			.addCase(activeAccount.rejected, (state, action) => {
				state.actionState = action.payload;
				state.actionState.status = "failed";
			});
	},
});
export const { resetLoginState, setRole, resetActionStateChange } = authSlice.actions;

export default authSlice.reducer;
