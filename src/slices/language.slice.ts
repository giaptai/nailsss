import { createSlice } from "@reduxjs/toolkit"
import { LanguageService } from "../services/Language.service"
import { commonCreateAsyncThunk } from "../app/thunk"
import { RequestState } from "../app/state"
import { parseHttpError } from "../app/error"
import { LanguageModel } from "../models/category/Language.model"

export interface ProfileState {
    list: Record<string, LanguageModel[]>
    fetchState: RequestState
    actionState: RequestState
}
const initialState: ProfileState = {
    list: {},
    fetchState: { status: "idle" },
    actionState: { status: "idle" }
}
export const fetchLangs: any = commonCreateAsyncThunk({ type: 'lang/fetchLangs', action: LanguageService.fetchLanguages });
export const updateSentence: any = commonCreateAsyncThunk({ type: 'lang/updateSentence', action: LanguageService.updateSentence });
export const createSentence: any = commonCreateAsyncThunk({ type: 'lang/createSentence', action: LanguageService.createSentence });
export const LanguageSlice = createSlice({
    name: 'Language',
    initialState,
    reducers: {
        resetFetchState(state) {
            state.fetchState = { status: "idle" }
        },
        resetActionState(state) {
            state.actionState = { status: "idle" }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchLangs.fulfilled, (state, action) => {
                state.fetchState.status = 'completed'
                const data = action.payload.data.data
                const lang = action?.meta?.arg ?? 'en'
                state.list = { ...state.list }
                state.list[lang] = LanguageService.LanguagesFromJson(data)

            })
            .addCase(fetchLangs.pending, (state, _action) => {
                state.fetchState.status = 'loading'
            })
            .addCase(fetchLangs.rejected, (state, action) => {
                const error = parseHttpError(action.payload)
                state.fetchState = { status: "failed", code: error.statusCode, error: error.message }
            })
            .addCase(updateSentence.fulfilled, (state, _action) => {
                state.actionState.status = 'completed'
            })
            .addCase(updateSentence.pending, (state, _action) => {
                state.actionState.status = 'loading'
            })
            .addCase(updateSentence.rejected, (state, action) => {
                const error = parseHttpError(action.payload)
                state.actionState = { status: "failed", code: error.statusCode, error: error.message }
            })
            .addCase(createSentence.fulfilled, (state, _action) => {
                state.actionState.status = 'completed'
            })
            .addCase(createSentence.pending, (state, _action) => {
                state.actionState.status = 'loading'
            })
            .addCase(createSentence.rejected, (state, action) => {
                const error = parseHttpError(action.payload)
                state.actionState = { status: "failed", code: error.statusCode, error: error.message }
            })
    }
})
export const {
    resetFetchState, resetActionState
} = LanguageSlice.actions;

export default LanguageSlice.reducer;