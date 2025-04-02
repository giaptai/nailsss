import { createSlice } from "@reduxjs/toolkit";
export interface AppState {
	refreshToken: string;
	logined: boolean;
	expired: boolean;
	language: string;
	user: any;
}
const initialState: AppState = {
	refreshToken: "",
	logined: false,
	expired: false,
	user: false,
	language: "en",
};
export const appSlice = createSlice({
	name: "app",
	initialState,
	reducers: {
		setLogined(state, action) {
			state.logined = action.payload;
		},
		setUser(state, action) {
			state.user = action.payload;
		},
		setExpired(state, action) {
			state.expired = action.payload;
		},
		setProfile(state, action) {
			state.user.profile = action.payload;
		},
		setLanguage(state, action) {
			state.user.profile.language = action.payload;
		},
		setRefreshToken(state, action) {
			state.refreshToken = action.payload;
		},
	},
});
export const { setLogined, setUser, setLanguage, setProfile, setRefreshToken, setExpired } = appSlice.actions;

export default appSlice.reducer;
