import { createSlice } from "@reduxjs/toolkit"
import { parseHttpError } from "../app/error"
import { RequestState } from "../app/state"
import { commonCreateAsyncThunk } from "../app/thunk"
import { StoreConfigService } from "../services/StoreConfig.service"
export interface StoreConfigState {
    list: any[]
    fetchState: RequestState
    actionState: RequestState
}
const initialState: StoreConfigState = {
    list: [],
    fetchState: { status: "idle" },
    actionState: { status: "idle" }
}
export const getStoreConfig: any = commonCreateAsyncThunk({ type: 'profile/getStoireConfig', action: StoreConfigService.getStoreConfig });
export const getStoreConfigNoShowPopUp: any = commonCreateAsyncThunk({ type: 'profile/getStoireConfig', action: StoreConfigService.getStoreConfig });
export const updateStoreSetting: any = commonCreateAsyncThunk({ type: 'storeconfig/updateStoreSetting', action: StoreConfigService.updateStoreConfig });
export const updateStoreSettingNoShowPopUp: any = commonCreateAsyncThunk({ type: 'storeconfig/updateStoreSetting', action: StoreConfigService.updateStoreConfig });
export const StoreConfigSlice = createSlice({
    name: 'StoreConfig',
    initialState,
    reducers: {
        resetFetchState(state) {
            state.fetchState = { status: "idle" }
        },
        resetActionState(state) {
            state.actionState = { status: "idle" }
        },
        resetFetchStateStoreconfig(state) {
            state.fetchState = { status: "idle" }
        },
        resetActionStateStoreconfig(state) {
            state.actionState = { status: "idle" }
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(getStoreConfig.fulfilled, (state, action) => {
            state.fetchState.status = 'completed'
            const data = action.payload.data
            state.list = StoreConfigService.StoreConfigFromJson(data.data)
            // state.list = getStoreConfig.profilesFromJson(data.data)
        })
        .addCase(getStoreConfig.pending, (state, _action) => {
            state.fetchState.status = 'loading'
        })
        .addCase(getStoreConfig.rejected, (state, action) => {
            const error = parseHttpError(action.payload)
            state.fetchState = { status: "failed", code: error.statusCode, error: error.message }
        })
            .addCase(updateStoreSetting.fulfilled, (state) => {
                state.actionState.status = 'completed'
            })
            .addCase(updateStoreSetting.pending, (state, _action) => {
                state.actionState.status = 'loading'
            })
            .addCase(updateStoreSetting.rejected, (state, action) => {
                const error = parseHttpError(action.payload)
                state.actionState = { status: "failed", code: error.statusCode, error: error.message }
            })
    }
})
export const {
    resetFetchState, resetActionState,resetFetchStateStoreconfig,resetActionStateStoreconfig
} = StoreConfigSlice.actions;

export default StoreConfigSlice.reducer;