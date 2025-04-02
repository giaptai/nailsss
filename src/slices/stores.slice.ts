import { createSlice } from "@reduxjs/toolkit"
import { StoreModel } from "../models/category/Store.model"
import { StoreService } from "../services/Store.service"
import { commonCreateAsyncThunk } from "../app/thunk"
import { RequestState } from "../app/state"
import { parseHttpError } from "../app/error"
import { isStrContainIgnoreCase } from "../utils/string.ultil"

export interface StoreState {
    list: StoreModel[]
    filtered: StoreModel[]
    item: StoreModel | undefined
    fetchState: RequestState
    actionState: RequestState
    currentPage: number
    currentRows: number
}
const initialState: StoreState = {
    list: [],
    filtered: [],
    item: undefined,
    fetchState: { status: "idle" },
    actionState: { status: "idle" },
    currentPage: 1,
    currentRows: 10
}
export const fetchStores: any = commonCreateAsyncThunk({ type: 'Store/fetchStores', action: StoreService.fetchStores });
export const addStore: any = commonCreateAsyncThunk({ type: 'Store/addStore', action: StoreService.addStore });
export const updateStore: any = commonCreateAsyncThunk({ type: 'Store/updateStore', action: StoreService.updateStore });
export const deleteStore: any = commonCreateAsyncThunk({ type: 'Store/deleteStore', action: StoreService.deleteStore });
export const restoreStore: any = commonCreateAsyncThunk({ type: 'Store/restoreStore', action: StoreService.restoreStore });
export const storeSlice = createSlice({
    name: 'store',
    initialState,
    reducers: {
        selectItem(state, action) {
            state.item = action.payload
        },
        resetFetchState(state) {
            state.fetchState = { status: "idle" }
        },
        resetActionState(state) {
            state.actionState = { status: "idle" }
        },
        filterSearch(state, action) {
            state.filtered = state.list.filter((item) => {
                const fullName = `${item.customer.lastName} ${item.customer.firstName}`;
                const searchString = `${fullName} ${item.name} ${item.city} ${item.phone}`;
                return isStrContainIgnoreCase(searchString, action.payload);
            });
         },
        setCurrentPage: (state, action) => {
            state.currentPage = action.payload;
        },
        setCurrentRows: (state, action) => {
            state.currentRows = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchStores.fulfilled, (state, action) => {
                state.fetchState.status = 'completed'
                const data = action.payload.data
                state.list = StoreService.storesFromJson(data.data)
                state.filtered = state.list
            })
            .addCase(fetchStores.pending, (state, _action) => {
                state.fetchState.status = 'loading'
            })
            .addCase(fetchStores.rejected, (state, action) => {
                const error = parseHttpError(action.payload)
                state.fetchState = { status: "failed", code: error.statusCode, error: error.message }
            })
            .addCase(addStore.fulfilled, (state) => {
                state.actionState.status = 'completed'
            })
            .addCase(addStore.pending, (state, _action) => {
                state.actionState.status = 'loading'
            })
            .addCase(addStore.rejected, (state, action) => {
                const error = parseHttpError(action.payload)
                state.actionState = { status: "failed", code: error.statusCode, error: error.message }
            })
            .addCase(updateStore.fulfilled, (state) => {
                state.actionState.status = 'completed'
            })
            .addCase(updateStore.pending, (state, _action) => {
                state.actionState.status = 'loading'
            })
            .addCase(updateStore.rejected, (state, action) => {
                const error = parseHttpError(action.payload)
                state.actionState = { status: "failed", code: error.statusCode, error: error.message }
            })
            .addCase(deleteStore.fulfilled, (state) => {
                state.actionState.status = 'completed'
            })
            .addCase(deleteStore.pending, (state, _action) => {
                state.actionState.status = 'loading'
            })
            .addCase(deleteStore.rejected, (state, action) => {
                const error = parseHttpError(action.payload)
                state.actionState = { status: "failed", code: error.statusCode, error: error.message }
            })
            .addCase(restoreStore.fulfilled, (state) => {
                state.actionState.status = 'completed'
            })
            .addCase(restoreStore.pending, (state, _action) => {
                state.actionState.status = 'loading'
            })
            .addCase(restoreStore.rejected, (state, action) => {
                const error = parseHttpError(action.payload)
                state.actionState = { status: "failed", code: error.statusCode, error: error.message }
            })
    }
})
export const {
    selectItem, resetFetchState, resetActionState, setCurrentPage, setCurrentRows, filterSearch
} = storeSlice.actions;

export default storeSlice.reducer;