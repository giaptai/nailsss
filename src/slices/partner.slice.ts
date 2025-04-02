import { createSlice } from "@reduxjs/toolkit"
import { PartnerModel } from "../models/category/Partner.model"
import { PartnerService } from "../services/Partner.service"
import { commonCreateAsyncThunk } from "../app/thunk"
import { RequestState } from "../app/state"
import { parseHttpError } from "../app/error"
import { StoreModel } from "../models/category/Store.model"
import { StoreService } from "../services/Store.service"
import { isStrContainIgnoreCase } from "../utils/string.ultil"

export interface PartnerState {
    list: PartnerModel[]
    filtered: PartnerModel[]
    item: PartnerModel | undefined
    stores: StoreModel[]
    fetchState: RequestState
    actionState: RequestState
}
const initialState: PartnerState = {
    list: [],
    filtered: [],
    item: undefined,
    stores: [],
    fetchState: { status: "idle" },
    actionState: { status: "idle" }
}
export const fetchStores: any = commonCreateAsyncThunk({ type: 'partner/fetchStores', action: StoreService.fetchStores });
export const fetchPartners: any = commonCreateAsyncThunk({ type: 'partner/fetchPartners', action: PartnerService.fetchPartners });
export const addPartner: any = commonCreateAsyncThunk({ type: 'partner/addPartner', action: PartnerService.addPartner });
export const updatePartner: any = commonCreateAsyncThunk({ type: 'partner/updatePartner', action: PartnerService.updatePartner });
export const deletePartner: any = commonCreateAsyncThunk({ type: 'partner/deletePartner', action: PartnerService.deletePartner });
export const restorePartner: any = commonCreateAsyncThunk({ type: 'partner/restorePartner', action: PartnerService.restorePartner });
export const partnerSlice = createSlice({
    name: 'partner',
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
        setFiltered(state, action) {
            state.filtered = action.payload
        },
        filterSearch(state, action) {
            state.filtered = state.list.filter((item) => isStrContainIgnoreCase(item.phone, action.payload) || isStrContainIgnoreCase(`${item?.firstName} ${item?.middleName} ${item?.lastName}`, action.payload))
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchStores.fulfilled, (state, action) => {
                state.fetchState.status = 'completed'
                const data = action.payload.data
                state.stores = StoreService.storesFromJson(data.data)
            })
            .addCase(fetchStores.pending, (state, _action) => {
                state.fetchState.status = 'loading'
            })
            .addCase(fetchStores.rejected, (state, action) => {
                const error = parseHttpError(action.payload)
                state.fetchState = { status: "failed", code: error.statusCode, error: error.message }
            })
            .addCase(fetchPartners.fulfilled, (state, action) => {
                state.fetchState.status = 'completed'
                const data = action.payload.data
                state.list = PartnerService.partnersFromJson(data.data)
                state.filtered = state.list
            })
            .addCase(fetchPartners.pending, (state, _action) => {
                state.fetchState.status = 'loading'
            })
            .addCase(fetchPartners.rejected, (state, action) => {
                const error = parseHttpError(action.payload)
                state.fetchState = { status: "failed", code: error.statusCode, error: error.message }
            })
            .addCase(addPartner.fulfilled, (state, _action) => {
                state.actionState.status = 'completed'
            })
            .addCase(addPartner.pending, (state, _action) => {
                state.actionState.status = 'loading'
            })
            .addCase(addPartner.rejected, (state, action) => {
                const error = parseHttpError(action.payload)
                state.actionState = { status: "failed", code: error.statusCode, error: error.message }
            })
            .addCase(updatePartner.fulfilled, (state, _action) => {
                state.actionState.status = 'completed'
            })
            .addCase(updatePartner.pending, (state, _action) => {
                state.actionState.status = 'loading'
            })
            .addCase(updatePartner.rejected, (state, action) => {
                const error = parseHttpError(action.payload)
                state.actionState = { status: "failed", code: error.statusCode, error: error.message }
            })
            .addCase(deletePartner.fulfilled, (state) => {
                state.actionState.status = 'completed'
            })
            .addCase(deletePartner.pending, (state, _action) => {
                state.actionState.status = 'loading'
            })
            .addCase(deletePartner.rejected, (state, action) => {
                const error = parseHttpError(action.payload)
                state.actionState = { status: "failed", code: error.statusCode, error: error.message }
            })
            .addCase(restorePartner.fulfilled, (state) => {
                state.actionState.status = 'completed'
            })
            .addCase(restorePartner.pending, (state, _action) => {
                state.actionState.status = 'loading'
            })
            .addCase(restorePartner.rejected, (state, action) => {
                const error = parseHttpError(action.payload)
                state.actionState = { status: "failed", code: error.statusCode, error: error.message }
            })
    }
})
export const {
    selectItem, resetFetchState, setFiltered, resetActionState, filterSearch
} = partnerSlice.actions;

export default partnerSlice.reducer;