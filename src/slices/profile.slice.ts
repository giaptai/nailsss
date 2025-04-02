import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { parseHttpError, parseHttpErrorResponse } from "../app/error";
import { RequestState } from "../app/state";
import { commonCreateAsyncThunk } from "../app/thunk";
import { ProfileModel } from "../models/category/Profile.model";
import { ProfileService } from "../services/Profile.service";
export interface ProfileState {
	list: ProfileModel[];
	avatar: any;
	item: ProfileModel | undefined;
	fetchState: RequestState;
	actionState: RequestState;
	getAvtState: string;
}
const initialState: ProfileState = {
	list: [],
	avatar: null,
	item: undefined,
	fetchState: { status: "idle" },
	getAvtState: "",
	actionState: { status: "idle" },
};
export const fetchProfiles: any = commonCreateAsyncThunk({
	type: "profile/fetchProfiles",
	action: ProfileService.fetchProfiles,
});
export const updateProfile: any = commonCreateAsyncThunk({
	type: "profile/updateProfile",
	action: ProfileService.updateProfile,
});
export const changeInfoProfile: any = commonCreateAsyncThunk({
	type: "profile/changeInfoProfile",
	action: ProfileService.changeInfoProfile,
});
export const changeAvatarProfile: any = commonCreateAsyncThunk({
	type: "profile/changeAvatarProfile",
	action: ProfileService.changeAvatarProfile,
});
export const deleteAvatarProfile: any = commonCreateAsyncThunk({
	type: "profile/deleteAvatarProfile",
	action: ProfileService.deleteAvatarProfile,
});
// export const getAvatarProfile: any = commonCreateAsyncThunk({ type: 'profile/getAvatarProfile', action: ProfileService.getAvatarProfile });
export const updateAvatarProfile: any = commonCreateAsyncThunk({
	type: "profile/updateAvatarProfile",
	action: ProfileService.updateAvatarProfile,
});
export const updateEmpl: any = commonCreateAsyncThunk({ type: "empl/updateEmpl", action: ProfileService.updateEmpl });
export const updateRoleEmpl: any = commonCreateAsyncThunk({
	type: "empl/updateRole",
	action: ProfileService.updateRole,
});
export const updatePositionEmpl: any = commonCreateAsyncThunk({
	type: "empl/updatePositionEmpl",
	action: ProfileService.updatePositionEmpl,
});
export const fetchAvatarStream: any = createAsyncThunk("profile/fetchAvatarStream", ProfileService.getAvatarProfile);

export const ProfileSlice = createSlice({
	name: "Profile",
	initialState,
	reducers: {
		resetFetchState(state) {
			state.fetchState = { status: "idle" };
		},
		resetActionState(state) {
			state.actionState = { status: "idle" };
		},
		resetActionStateProfile(state) {
			state.actionState = { status: "idle" };
		},
		resetAvatar(state) {
			state.avatar = null;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchProfiles.fulfilled, (state, action) => {
				state.fetchState.status = "completed";
				const data = action.payload.data;
				state.list = ProfileService.ProfilesFromJson(data.data);
			})
			.addCase(fetchProfiles.pending, (state, _action) => {
				state.fetchState.status = "loading";
			})
			.addCase(fetchProfiles.rejected, (state, action) => {
				const error = parseHttpError(action.payload);
				state.fetchState = { status: "failed", code: error.statusCode, error: error.message };
			})
			.addCase(updateProfile.fulfilled, (state, _action) => {
				state.actionState.status = "completed";
			})
			.addCase(updateProfile.pending, (state, _action) => {
				state.actionState.status = "loading";
			})
			.addCase(updateProfile.rejected, (state, action) => {
				const error = parseHttpError(action.payload);
				state.actionState = { status: "failed", code: error.statusCode, error: error.message };
			})
			.addCase(changeInfoProfile.fulfilled, (state, _action) => {
				state.actionState.status = "completed";
			})
			.addCase(changeInfoProfile.pending, (state, _action) => {
				state.actionState.status = "loading";
			})
			.addCase(changeInfoProfile.rejected, (state, action) => {
				const error = parseHttpError(action.payload);
				state.actionState = { status: "failed", code: error.statusCode, error: error.message };
			})
			.addCase(changeAvatarProfile.fulfilled, (state, _action) => {
				state.actionState.status = "completed";
			})
			.addCase(changeAvatarProfile.pending, (state, _action) => {
				state.actionState.status = "loading";
			})
			.addCase(changeAvatarProfile.rejected, (state, action) => {
				const error = parseHttpError(action.payload);
				state.actionState = { status: "failed", code: error.statusCode, error: error.message };
			})
			.addCase(updateAvatarProfile.fulfilled, (state, _action) => {
				state.actionState.status = "completed";
			})
			.addCase(updateAvatarProfile.pending, (state, _action) => {
				state.actionState.status = "loading";
			})
			.addCase(updateAvatarProfile.rejected, (state, action) => {
				const error = parseHttpError(action.payload);
				state.actionState = { status: "failed", code: error.statusCode, error: error.message };
			})
			.addCase(deleteAvatarProfile.fulfilled, (state, _action) => {
				state.actionState.status = "completed";
				state.avatar = "";
			})
			.addCase(deleteAvatarProfile.pending, (state, _action) => {
				state.actionState.status = "loading";
			})
			.addCase(deleteAvatarProfile.rejected, (state, action) => {
				const error = parseHttpError(action.payload);
				state.actionState = { status: "failed", code: error.statusCode, error: error.message };
			})
			.addCase(fetchAvatarStream.fulfilled, (state, action) => {
				state.avatar = action.payload;
				state.getAvtState = "completed";
			})
			.addCase(fetchAvatarStream.pending, (state, _action) => {
				state.getAvtState = "loading";
			})
			.addCase(fetchAvatarStream.rejected, (state, _action) => {
				state.getAvtState = "failed";
				state.avatar = undefined;

				// const error = parseHttpError(action.payload)
				// state.actionState = { status: "failed", code: error.statusCode, error: error.message }
			})

			.addCase(updateEmpl.fulfilled, (state, _action) => {
				state.actionState.status = "completed";
			})
			.addCase(updateEmpl.pending, (state, _action) => {
				state.actionState.status = "loading";
			})
			.addCase(updateEmpl.rejected, (state, action) => {
				const error = parseHttpErrorResponse(action.payload);
				state.actionState = { status: "failed", code: error.statusCode, error: error.message };
			})
			.addCase(updateRoleEmpl.fulfilled, (state, _action) => {
				state.actionState.status = "completed";
			})
			.addCase(updateRoleEmpl.pending, (state, _action) => {
				state.actionState.status = "loading";
			})
			.addCase(updateRoleEmpl.rejected, (state, action) => {
				const error = parseHttpErrorResponse(action.payload);
				state.actionState = { status: "failed", code: error.statusCode, error: error.message };
			})
			.addCase(updatePositionEmpl.fulfilled, (state, _action) => {
				state.actionState.status = "completed";
			})
			.addCase(updatePositionEmpl.pending, (state, _action) => {
				state.actionState.status = "loading";
			})
			.addCase(updatePositionEmpl.rejected, (state, action) => {
				const error = parseHttpErrorResponse(action.payload);
				state.actionState = { status: "failed", code: error.statusCode, error: error.message };
			});
	},
});
export const { resetFetchState, resetActionState, resetActionStateProfile } = ProfileSlice.actions;

export default ProfileSlice.reducer;
