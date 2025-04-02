import { createSlice } from "@reduxjs/toolkit";
import { commonCreateAsyncThunk } from "../app/thunk";
import { RequestState } from "../app/state";
import { parseHttpError } from "../app/error";
import { MasterdataService } from "../services/Masterdata.service";
import { PermissionModel } from "../models/category/Permission.model";

export interface MasterdataState {
	permissions: PermissionModel[];
	status: any[];
	fetchState: RequestState;
}
const initialState: MasterdataState = {
	permissions: [],
	status: [],
	fetchState: { status: "idle" },
};
export const fetchPermissions: any = commonCreateAsyncThunk({
	type: "masterdata/fetchPermissions",
	action: MasterdataService.fetchPermissions,
});
export const fetchStatus: any = commonCreateAsyncThunk({
	type: "masterdata/fetchStatus",
	action: MasterdataService.fetchStatus,
});
export const masterdataSlice = createSlice({
	name: "masterdata",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchPermissions.fulfilled, (state, action) => {
				state.fetchState.status = "completed";
				const data = action.payload.data;
				state.permissions = MasterdataService.permisionsFromJson(data.data);
			})
			.addCase(fetchPermissions.pending, (state, _action) => {
				state.fetchState.status = "loading";
			})
			.addCase(fetchPermissions.rejected, (state, action) => {
				const error = parseHttpError(action.payload);
				state.fetchState = { status: "failed", code: error.statusCode, error: error.message };
			});
	},
});
export const {} = masterdataSlice.actions;

export default masterdataSlice.reducer;
