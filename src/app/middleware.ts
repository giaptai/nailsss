import { Action, Dispatch, MiddlewareAPI } from "@reduxjs/toolkit";
import { setExpired, setLogined } from "../slices/app.slice";
import { RootState } from "./store";
import { resetActionState, resetActionStateCustomer } from "../slices/customer.slice";
import { resetActionStateMenu } from "../slices/menu.slice";
import { resetActionStateUser } from "../slices/user.slice";
import { resetActionStateProfile } from "../slices/profile.slice";
import { resetActionStateStoreconfig } from "../slices/storeconfig.slice";
import { resetActionStateRole } from "../slices/role.slice";
export const customMiddleware: any =
	({ dispatch, getState }: MiddlewareAPI<Dispatch<Action>, RootState>) =>
	(next: Dispatch<Action>) =>
	(action: any) => {
		// Access the state
		const state = getState();
		//console.log("Current state:", state);
		if (action.payload) {
			if (action.payload.code !== 200 && !action.payload.app) {
				//console.log("Midleware exception", action.payload);
				const { response } = action.payload;
				if (response) {
					//console.log(response);
					const { message } = response.data;
					if (
						message &&
						(["Invalid refresh token!", "Database name is required!", "Session expired"].includes(
							message
						) ||
							(message === "Unauthorized" && !state.app.refreshToken))
					) {
						dispatch(setLogined(false));
						dispatch(setExpired(true));
						//reset action state
						dispatch(resetActionState());
						dispatch(resetActionStateMenu());
						dispatch(resetActionStateUser());
						dispatch(resetActionStateCustomer());
						dispatch(resetActionStateProfile());
						dispatch(resetActionStateStoreconfig());
						dispatch(resetActionStateRole());
						return;
					}
				}
			}
		}
		// Continue with the next middleware or reducer
		return next(action);
	};
// export const customMiddleware =
// 	({ dispatch }: { dispatch: Dispatch<Action> }) =>
// 	(next: (arg0: any) => void) =>
// 	(action: any) => {
// 		if (action.payload) {
// 			if (action.payload.code !== 200 && !action.payload.app) {
// 				//console.log("Midleware exception", action.payload);
// 				const { response } = action.payload;
// 				if (response) {
// 					//console.log(response);
// 					const { message } = response.data;
// 					if (
// 						message &&
// 						["Invalid refresh token!", "Database name is required!", "Session expired"].includes(message)
// 					) {
// 						dispatch(setLogined(false));
// 						dispatch(setExpired(true));
// 						return;
// 					}
// 				}
// 			}
// 		}
// 		next(action);
// 	};
