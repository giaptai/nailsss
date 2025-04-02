import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { parseHttpError } from "../app/error";
import { RequestState } from "../app/state";
import { commonCreateAsyncThunk } from "../app/thunk";
import { ServiceModel } from "../models/category/Service.model";
import { UserModel } from "../models/category/User.model";
import { ServiceService } from "../services/Service.service";
import { isStrContainIgnoreCase } from "../utils/string.ultil";
export interface ServiceState {
	list: ServiceModel[];
	filtered: ServiceModel[];
	selectedService: ServiceModel[];
	item: ServiceModel | undefined;
	fetchState: RequestState;
	actionState: RequestState;
	actionStatePosition: RequestState;
	currentPage: number;
	currentRows: number;
}
const initialState: ServiceState = {
	list: [],
	filtered: [],
	selectedService: [],
	item: undefined,
	fetchState: { status: "idle" },
	actionState: { status: "idle" },
	actionStatePosition: { status: "idle" },
	currentPage: 1,
	currentRows: 10,
};
export const addServices: any = commonCreateAsyncThunk({
	type: "services/addService",
	action: ServiceService.addService,
});
export const fetchServices: any = commonCreateAsyncThunk({
	type: "services/getService",
	action: ServiceService.fetchService,
});
export const updateServices: any = commonCreateAsyncThunk({
	type: "services/updateService",
	action: ServiceService.updateService,
});
export const updatePosition: any = commonCreateAsyncThunk({
	type: "services/updatePosition",
	action: ServiceService.updateService,
});
export const deleteServices: any = commonCreateAsyncThunk({
	type: "services/deleteService",
	action: ServiceService.deleteService,
});
export const restoreService: any = commonCreateAsyncThunk({
	type: "services/restoreService",
	action: ServiceService.restoreService,
});
export const ServiceSlice = createSlice({
	name: "service",
	initialState,
	reducers: {
		selectItem(state, action) {
			state.item = action.payload;
		},
		resetFetchState(state) {
			state.fetchState = { status: "idle" };
		},
		resetActionState(state) {
			state.actionState = { status: "idle" };
		},
		resetActionStateService(state) {
			state.actionState = { status: "idle" };
		},
		setFiltered(state, action) {
			state.filtered = action.payload;
		},
		setSelectedService(state, action) {
			state.selectedService = action.payload;
		},
		removeSelectedService(state, action) {
			state.selectedService = state.selectedService.filter(
				(service) => service.idOrder !== action.payload.idOrder
			);
		},
		updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
			const updatedService = state.selectedService.map((service) => {
				if (service.idOrder === action.payload.id) {
					return { ...service, unit: action.payload.quantity };
				}
				return service;
			});
			state.selectedService = updatedService;
			const updatedItem = state.selectedService.find((service) => service.idOrder === action.payload.id);
			if (updatedItem) {
				state.item = updatedItem;
			}
		},
		updateEmployeeService: (state, action: PayloadAction<{ id: string; employee: UserModel | undefined }>) => {
			const updatedService = state.selectedService.map((service) => {
				if (service.idOrder === action.payload.id) {
					return { ...service, employeeSelect: action.payload.employee };
				}
				return service;
			});
			state.selectedService = updatedService;
			const updatedItem = state.selectedService.find((service) => service.idOrder === action.payload.id);
			if (updatedItem) {
				state.item = updatedItem;
			}
		},
		EditServiceSelect: (state, action) => {
			const updatedService = state.selectedService.map((service) => {
				if (service.idOrder === action.payload.idOrder) {
					return { ...service, ...action.payload };
				}
				return service;
			});

			state.selectedService = updatedService;
			const updatedItem = state.selectedService.find((service) => service.idOrder === action.payload.idOrder);
			if (updatedItem) {
				state.item = updatedItem;
			}
		},
		filterSearch: (state, action: PayloadAction<{ searchString: string; status: string }>) => {
			state.filtered = state.list.filter((item) => {
				const searchString = `${item.displayName} ${item.storePrice} ${item.employeePrice} ${item.turn} ${item.menu?.name}`;
				return (
					(action.payload.status == "ALL" || item.status.code === action.payload.status) &&
					isStrContainIgnoreCase(searchString, action.payload.searchString)
				);
			});
		},
		filterSearchOrder(state, action: PayloadAction<{ searchString: string; selectedType: string[] }>) {
			const { searchString, selectedType } = action.payload;
			state.filtered = state.list.filter((item) => {
				if (selectedType.length > 0 && selectedType) {
					const isMatchedType = selectedType.length === 0 || selectedType.includes(item.type);
					const isTemp = isStrContainIgnoreCase(`${item.displayName} ${item.storePrice}`, searchString);
					return isTemp && isMatchedType;
				} else {
					const isTemp = isStrContainIgnoreCase(`${item.displayName} ${item.storePrice}`, searchString);
					return isTemp;
				}
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
			.addCase(addServices.fulfilled, (state, _action) => {
				state.actionState.status = "completed";
				// console.log(action.payload.data);
				// addServiceMenu(action.payload.data.data);
			})
			.addCase(addServices.pending, (state, _action) => {
				state.actionState.status = "loading";
			})
			.addCase(addServices.rejected, (state, action) => {
				const error = parseHttpError(action.payload);
				state.actionState = { status: "failed", code: error.statusCode, error: error.message };
			})
			.addCase(fetchServices.fulfilled, (state, action) => {
				state.fetchState.status = "completed";
				const data = action.payload.data;
				state.list = ServiceService.ServiceFromJson(data.data);
				state.filtered = state.list;
			})
			.addCase(fetchServices.pending, (state, _action) => {
				state.fetchState.status = "loading";
			})
			.addCase(fetchServices.rejected, (state, action) => {
				const error = parseHttpError(action.payload);
				state.fetchState = { status: "failed", code: error.statusCode, error: error.message };
			})
			.addCase(updateServices.fulfilled, (state, _action) => {
				state.actionState.status = "completed";
			})
			.addCase(updateServices.pending, (state, _action) => {
				state.actionState.status = "loading";
			})
			.addCase(updateServices.rejected, (state, action) => {
				const error = parseHttpError(action.payload);
				state.actionState = { status: "failed", code: error.statusCode, error: error.message };
			})
			.addCase(updatePosition.fulfilled, (state, _action) => {
				state.actionStatePosition.status = "completed";
			})
			.addCase(updatePosition.pending, (state, _action) => {
				state.actionStatePosition.status = "loading";
			})
			.addCase(updatePosition.rejected, (state, action) => {
				const error = parseHttpError(action.payload);
				state.actionStatePosition = { status: "failed", code: error.statusCode, error: error.message };
			})
			.addCase(deleteServices.fulfilled, (state, _action) => {
				state.actionState.status = "completed";
			})
			.addCase(deleteServices.pending, (state, _action) => {
				state.actionState.status = "loading";
			})
			.addCase(deleteServices.rejected, (state, action) => {
				const error = parseHttpError(action.payload);
				state.actionState = { status: "failed", code: error.statusCode, error: error.message };
			})
			.addCase(restoreService.fulfilled, (state, _action) => {
				state.actionState.status = "completed";
			})
			.addCase(restoreService.pending, (state, _action) => {
				state.actionState.status = "loading";
			})
			.addCase(restoreService.rejected, (state, action) => {
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
	resetActionStateService,
	setCurrentPage,
	setCurrentRows,
	filterSearchOrder,
	setSelectedService,
	removeSelectedService,
	updateQuantity,
	updateEmployeeService,
	EditServiceSelect,
} = ServiceSlice.actions;

export default ServiceSlice.reducer;
