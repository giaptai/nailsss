import { createSlice } from "@reduxjs/toolkit";
import { parseHttpError } from "../app/error";
import { RequestState } from "../app/state";
import { commonCreateAsyncThunk } from "../app/thunk";
import { MenuModel } from "../models/category/Menu.model";
import { ServiceModel } from "../models/category/Service.model";
import { MenusService } from "../services/Menu.service";
import { isStrContainIgnoreCase } from "../utils/string.ultil";
import { ServiceService } from "../services/Service.service";
export interface MenuState {
	list: MenuModel[];
	filtered: MenuModel[];
	filteredActiveOrder: MenuModel[];
	item: MenuModel | undefined;
	orderItem: MenuModel | undefined;
	fetchState: RequestState;
	actionState: RequestState;
	currentPage: number;
	currentRows: number;
	ListServiceWithItem: ServiceModel[];
	ListServiceWithOrder: ServiceModel[];
}
const initialState: MenuState = {
	list: [],
	filtered: [],
	filteredActiveOrder: [],
	item: undefined,
	orderItem: undefined,
	fetchState: { status: "idle" },
	actionState: { status: "idle" },
	currentPage: 1,
	currentRows: 10,
	ListServiceWithItem: [],
	ListServiceWithOrder: [],
};
export const addMenus: any = commonCreateAsyncThunk({ type: "menu/addMenus", action: MenusService.addMenus });
export const fetchMenus: any = commonCreateAsyncThunk({ type: "Menus/getMenus", action: MenusService.fetchMenus });
export const updateMenus: any = commonCreateAsyncThunk({ type: "Menus/updateMenus", action: MenusService.updateMenus });
export const deleteMenus: any = commonCreateAsyncThunk({ type: "Menus/deleteMenus", action: MenusService.deleteMenus });
export const restoreMenus: any = commonCreateAsyncThunk({
	type: "Menus/restoreMenus",
	action: MenusService.restoreMenus,
});
export const addServicesMenu: any = commonCreateAsyncThunk({
	type: "Menus/addServiceMenu",
	action: ServiceService.addService,
});
export const deleteServiceInMenu: any = commonCreateAsyncThunk({
	type: "Menus/deleteService",
	action: ServiceService.deleteService,
});
export const MenuSlice = createSlice({
	name: "menu",
	initialState,
	reducers: {
		selectItem(state, action) {
			state.item = action.payload;
		},
		selectorderItem(state, action) {
			state.orderItem = action.payload;
		},
		resetFetchState(state) {
			state.fetchState = { status: "idle" };
		},
		resetActionState(state) {
			state.actionState = { status: "idle" };
		},
		resetActionStateMenu(state) {
			state.actionState = { status: "idle" };
		},
		setFiltered(state, action) {
			state.filtered = action.payload;
		},
		filterSearch(state, action) {
			state.filtered = state.list.filter((item) =>
				isStrContainIgnoreCase(`${item.name} ${item.code}`, action.payload)
			);
		},
		setCurrentPage: (state, action) => {
			state.currentPage = action.payload;
		},
		setCurrentRows: (state, action) => {
			state.currentRows = action.payload;
		},
		setListServiceWithItem: (state, action) => {
			state.ListServiceWithItem = action.payload;
		},
		setListServiceWithOrder: (state, action) => {
			state.ListServiceWithOrder = action.payload;
		},
		addServiceMenu: (state, action) => {
			state.ListServiceWithItem.push(action.payload);
		},
		UpdatePosition: (state, action) => {
			state.ListServiceWithItem[
				state.ListServiceWithItem.findIndex((service) => service._id === action.payload._id)
			].position = action.payload.position;
		},
		updateServiceEditState: (state, action) => {
			const index = state.ListServiceWithItem.findIndex((service) => service._id === action.payload._id);
			if (index !== -1) {
				state.ListServiceWithItem[index] = {
					...state.ListServiceWithItem[index],
					...action.payload.data,
				};
			}
		},
		filterListMenuActive: (state) => {
			state.filteredActiveOrder = state.list.filter((item) => item.status?.code == "ACTIVE");
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(addMenus.fulfilled, (state, _action) => {
				state.actionState.status = "completed";
			})
			.addCase(addMenus.pending, (state, _action) => {
				state.actionState.status = "loading";
			})
			.addCase(addMenus.rejected, (state, action) => {
				const error = parseHttpError(action.payload);
				state.actionState = { status: "failed", code: error.statusCode, error: error.message };
			})
			.addCase(fetchMenus.fulfilled, (state, action) => {
				state.fetchState.status = "completed";
				const data = action.payload.data;
				state.list = MenusService.MenusFromJson(data.data);
				state.filtered = state.list.filter((it) => it.code != "R0000");
			})
			.addCase(fetchMenus.pending, (state, _action) => {
				state.fetchState.status = "loading";
			})
			.addCase(fetchMenus.rejected, (state, action) => {
				const error = parseHttpError(action.payload);
				state.fetchState = { status: "failed", code: error.statusCode, error: error.message };
			})
			.addCase(updateMenus.fulfilled, (state, action) => {
				state.actionState.status = "completed";
				state.item = action.payload.data.data;
			})
			.addCase(updateMenus.pending, (state, _action) => {
				state.actionState.status = "loading";
			})
			.addCase(updateMenus.rejected, (state, action) => {
				const error = parseHttpError(action.payload);
				state.actionState = { status: "failed", code: error.statusCode, error: error.message };
			})
			.addCase(deleteMenus.fulfilled, (state, action) => {
				state.actionState.status = "completed";
				state.item = action.payload.data.data;
				// console.log("🚀 ~ .addCase ~ action.payload.data.data:", action.payload.data.data);
				// state.ListServiceWithItem = state.ListServiceWithItem.filter(
				// 	(i) => i._id != action.payload.data.data?._id
				// );
			})
			.addCase(deleteMenus.pending, (state, _action) => {
				state.actionState.status = "loading";
			})
			.addCase(deleteMenus.rejected, (state, action) => {
				const error = parseHttpError(action.payload);
				state.actionState = { status: "failed", code: error.statusCode, error: error.message };
			})
			.addCase(deleteServiceInMenu.fulfilled, (state, action) => {
				state.actionState.status = "completed";
				state.ListServiceWithItem = state.ListServiceWithItem.filter(
					(i) => i._id != action.payload.data.data?._id
				);
			})
			.addCase(deleteServiceInMenu.pending, (state, _action) => {
				state.actionState.status = "loading";
			})
			.addCase(deleteServiceInMenu.rejected, (state, action) => {
				const error = parseHttpError(action.payload);
				state.actionState = { status: "failed", code: error.statusCode, error: error.message };
			})
			.addCase(restoreMenus.fulfilled, (state, action) => {
				state.actionState.status = "completed";
				state.item = action.payload.data.data;
			})
			.addCase(restoreMenus.pending, (state, _action) => {
				state.actionState.status = "loading";
			})
			.addCase(restoreMenus.rejected, (state, action) => {
				const error = parseHttpError(action.payload);
				state.actionState = { status: "failed", code: error.statusCode, error: error.message };
			})
			.addCase(addServicesMenu.fulfilled, (state, action) => {
				state.actionState.status = "completed";
				// addServiceMenu(action.payload.data.data);
				const data = {
					...action.payload.data.data,
					askForPrice: action.payload.data.data.askForPrice == true ? "YES" : "NO",
					tax: action.payload.data.data.tax == true ? "YES" : "NO",
					turn: action.payload.data.data.turn.toString(),
				};
				state.ListServiceWithItem.push(data);
			})
			.addCase(addServicesMenu.pending, (state, _action) => {
				state.actionState.status = "loading";
			})
			.addCase(addServicesMenu.rejected, (state, action) => {
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
	setListServiceWithItem,
	UpdatePosition,
	selectorderItem,
	updateServiceEditState,
	addServiceMenu,
	setListServiceWithOrder,
	filterListMenuActive,
	resetActionStateMenu,
} = MenuSlice.actions;

export default MenuSlice.reducer;
