import { configureStore } from "@reduxjs/toolkit";
import {
	//   FLUSH,
	//   PAUSE,
	//   PERSIST,
	persistStore,
	//   PURGE,
	//   REGISTER,
	//   REHYDRATE,
} from "redux-persist";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import rootReducer from "./reducers";
import { customMiddleware } from "./middleware";

const persistConfig = {
	key: "wtcroot",
	storage,
	whitelist: [
		"app",
		"partner",
		"customer",
		"role",
		"user",
		"profile",
		"masterdata",
		"language",
		"auth",
		"menu",
		"storeconfig",
		"clover",
	],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = configureStore({
	reducer: persistedReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: false,
		}).concat(customMiddleware),
});

export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
