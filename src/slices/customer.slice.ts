import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { parseHttpError, parseHttpErrorResponse } from "../app/error";
import { RequestState } from "../app/state";
import { commonCreateAsyncThunk } from "../app/thunk";
import { convertISOToDateString, phoneGuestCustomer } from "../const";
import { CustomerModel } from "../models/category/Customer.model";
import { StoreModel } from "../models/category/Store.model";
import { CustomerService } from "../services/Customer.service";
import { StoreService } from "../services/Store.service";
import { isStrContainIgnoreCase } from "../utils/string.ultil";
export interface CustomerState {
	list: CustomerModel[];
	filtered: CustomerModel[];
	item: CustomerModel | undefined;
	dataCreateSuccess: CustomerModel | undefined;
	stores: StoreModel[];
	fetchState: RequestState;
	actionState: RequestState;
	currentPage: number;
	currentRows: number;
	customerOrder: CustomerModel | undefined;
}
const initialState: CustomerState = {
	list: [],
	filtered: [],
	item: undefined,
	dataCreateSuccess: undefined,
	stores: [],
	fetchState: { status: "idle" },
	actionState: { status: "idle" },
	currentPage: 1,
	currentRows: 10,
	customerOrder: undefined,
};
export const fetchStores: any = commonCreateAsyncThunk({
	type: "Customer/fetchStores",
	action: StoreService.fetchStores,
});
export const fetchStoreInCustomer: any = commonCreateAsyncThunk({
	type: "Customer/fetchStoreInCustomer",
	action: StoreService.fetchStoreInCustomers,
});
export const fetchCustomers: any = commonCreateAsyncThunk({
	type: "Customer/fetchCustomers",
	action: CustomerService.fetchCustomers,
});
export const addCustomer: any = commonCreateAsyncThunk({
	type: "Customer/addCustomer",
	action: CustomerService.addCustomer,
});
export const updateCustomer: any = commonCreateAsyncThunk({
	type: "Customer/updateCustomer",
	action: CustomerService.updateCustomer,
});
export const deleteCustomer: any = commonCreateAsyncThunk({
	type: "Customer/deleteCustomer",
	action: CustomerService.deleteCustomer,
});
export const restoreCustomer: any = commonCreateAsyncThunk({
	type: "Customer/restoreCustomer",
	action: CustomerService.restoreCustomer,
});

export const CustomerSlice = createSlice({
	name: "Customer",
	initialState,
	reducers: {
		selectItem(state, action) {
			state.item = action.payload;
		},
		selectCustomerOrder(state, action) {
			if (action.payload?.id) state.customerOrder = state.filtered.find((cus) => cus._id === action.payload.id);
			else state.customerOrder = undefined;
		},
		resetFetchState(state) {
			state.fetchState = { status: "idle" };
		},
		resetActionState(state) {
			state.actionState = { status: "idle" };
		},
		resetActionStateCustomer(state) {
			state.actionState = { status: "idle" };
		},
		setFiltered(state, action) {
			state.filtered = action.payload;
		},
		// filterSearch(state, action) {
		//     state.filtered = state.list.filter((item) => {
		//         const fullName = `${item.lastName} ${item.firstName}`;
		//         const searchString = `${fullName} ${item.address} ${item.phone}` + convertISOToDateString(item.birthday);
		//         return isStrContainIgnoreCase(searchString, action.payload);
		//     });
		//     // state.filtered = state.list.filter((item) => isStrContainIgnoreCase(item.phone, action.payload) || isStrContainIgnoreCase(`${item?.phone} ${item?.firstName} ${item?.middleName} ${item?.address} ${item?.lastName}`, action.payload))
		// },
		filterSearch: (state, action: PayloadAction<{ searchString: string; status: string }>) => {
			state.filtered = state.list.filter((item) => {
				const fullName = `${item.firstName} ${item.lastName}`;
				const searchString =
					`${fullName} ${item.address} ${item.phone}` + convertISOToDateString(item.birthday);
				return (
					(action.payload.status == "ALL" || item.status?.code === action.payload.status) &&
					isStrContainIgnoreCase(searchString, action.payload.searchString) &&
					item.phone != phoneGuestCustomer
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
			.addCase(fetchStores.fulfilled, (state, action) => {
				state.fetchState.status = "completed";
				const data = action.payload.data;
				state.stores = StoreService.storesFromJson(data.data);
			})
			.addCase(fetchStores.pending, (state, _action) => {
				state.fetchState.status = "loading";
			})
			.addCase(fetchStores.rejected, (state, action) => {
				const error = parseHttpError(action.payload);
				state.fetchState = { status: "failed", code: error.statusCode, error: error.message };
			})
			.addCase(fetchStoreInCustomer.fulfilled, (state, action) => {
				// state.actionState.status = 'completed'
				const data = action.payload.data;
				state.stores = StoreService.storesFromJson(data.data);
			})
			.addCase(fetchStoreInCustomer.pending, (_state, _action) => {
				// state.actionState.status = 'loading'
			})
			.addCase(fetchStoreInCustomer.rejected, (_state, _action) => {})
			.addCase(fetchCustomers.fulfilled, (state, action) => {
				state.fetchState.status = "completed";
				const data = action.payload.data;
				state.list = CustomerService.customersFromJson(data.data);
				// state.filtered = state.list
			})
			.addCase(fetchCustomers.pending, (state, _action) => {
				state.fetchState.status = "loading";
			})
			.addCase(fetchCustomers.rejected, (state, action) => {
				const error = parseHttpError(action.payload);
				state.fetchState = { status: "failed", code: error.statusCode, error: error.message };
			})
			.addCase(addCustomer.fulfilled, (state, action) => {
				state.actionState.status = "completed";
				state.dataCreateSuccess = action.payload.data.data;
				state.list.unshift(action.payload.data.data);
				state.filtered.unshift(action.payload.data.data);
			})
			.addCase(addCustomer.pending, (state, _action) => {
				state.actionState.status = "loading";
			})
			.addCase(addCustomer.rejected, (state, action) => {
				const error = parseHttpErrorResponse(action.payload);
				state.actionState = { status: "failed", code: error.statusCode, error: error.message };
			})
			.addCase(updateCustomer.fulfilled, (state, _action) => {
				state.actionState.status = "completed";
			})
			.addCase(updateCustomer.pending, (state, _action) => {
				state.actionState.status = "loading";
			})
			.addCase(updateCustomer.rejected, (state, action) => {
				const error = parseHttpError(action.payload);
				state.actionState = { status: "failed", code: error.statusCode, error: error.message };
			})
			.addCase(deleteCustomer.fulfilled, (state) => {
				state.actionState.status = "completed";
			})
			.addCase(deleteCustomer.pending, (state, _action) => {
				state.actionState.status = "loading";
			})
			.addCase(deleteCustomer.rejected, (state, action) => {
				const error = parseHttpError(action.payload);
				state.actionState = { status: "failed", code: error.statusCode, error: error.message };
			})
			.addCase(restoreCustomer.fulfilled, (state) => {
				state.actionState.status = "completed";
			})
			.addCase(restoreCustomer.pending, (state, _action) => {
				state.actionState.status = "loading";
			})
			.addCase(restoreCustomer.rejected, (state, action) => {
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
	resetActionStateCustomer,
	selectCustomerOrder,
} = CustomerSlice.actions;

export default CustomerSlice.reducer;
