import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { t } from "i18next";
import { Nullable } from "primereact/ts-helpers";
import { parseHttpError } from "../app/error";
import { orderStatus, RequestState } from "../app/state";
import { commonCreateAsyncThunk } from "../app/thunk";
import { ActionSocket, endOfDay, startOfDay, Status } from "../const";
import { BookingModel } from "../models/category/Booking.model";
import { BookingService } from "../services/Booking.service";
import { showMessageToast } from "../utils/alert.util";
import { isStrContainIgnoreCase } from "../utils/string.ultil";
import { actions } from "../types";

export interface BookingState {
	list: BookingModel[];
	item: BookingModel | undefined;
	filtered: BookingModel[];
	fetchState: RequestState;
	actionState: RequestState;
	action: actions;
	successMessage: string;
}
const initialState: BookingState = {
	list: [],
	filtered: [],
	item: undefined,
	fetchState: { status: "idle" },
	actionState: { status: "idle" },
	action: "INS",
	successMessage: "",
};
export const fetchBookings: any = commonCreateAsyncThunk({
	type: "booking/fetchBooking",
	action: BookingService.fetchBooking,
});
export const deleteBooking: any = commonCreateAsyncThunk({
	type: "booking/deleteBooking",
	action: BookingService.deleteBookingCheckIn,
});
export const deleteBookingSoft: any = commonCreateAsyncThunk({
	type: "booking/deleteBookingSoft",
	action: BookingService.deleteBookingSoft,
});
export const addBooking: any = commonCreateAsyncThunk({
	type: "booking/addBooking",
	action: BookingService.addBooking,
});
export const editBooking: any = commonCreateAsyncThunk({
	type: "booking/editBooking",
	action: BookingService.editBooking,
});

export const bookingSlice = createSlice({
	name: "booking",
	initialState,
	reducers: {
		changeAction: (state, action) => {
			state.action = action.payload;
		},
		selectItem(state, action) {
			state.item = action.payload;
		},
		filterSearch: (state, action: PayloadAction<{ searchString: string; status: string }>) => {
			state.filtered = state.list.filter((item) => {
				const searchString = `${item.code} ${item.customer?.firstName} ${item.customer?.lastName}`;
				return (
					(action.payload.status == "ALL" || item.status.code === action.payload.status) &&
					isStrContainIgnoreCase(searchString, action.payload.searchString)
				);
			});
		},
		actionSearchData: (
			state,
			action: PayloadAction<{ _idEmployee: string | null; fromDate: Nullable<Date>; toDate: Nullable<Date> }>
		) => {
			state.fetchState.status = "loading";
			const { _idEmployee, fromDate, toDate } = action.payload;
			state.filtered = state.list.filter((item) => {
				const employeeMatch = _idEmployee
					? item.attributes.detail.some((detail) => detail.emoployee && detail.emoployee._id === _idEmployee)
					: true;
				const itemDate = new Date(item.bookingDate);
				const fromDateMatch = fromDate ? itemDate >= startOfDay(fromDate) : true;
				const toDateMatch = toDate ? itemDate <= endOfDay(toDate) : true;
				return employeeMatch && fromDateMatch && toDateMatch;
			});
		},
		resetActionState(state) {
			state.actionState = { status: "idle" };
		},
		resetFetchState(state) {
			state.fetchState = { status: "idle" };
		},
		BookingRealTimeAction(state, action) {
			const { toast, dataSend } = action.payload;
			const actionActive = dataSend.action;
			const data = dataSend.data;
			if (actionActive == ActionSocket.create) {
				const existsInList = state.list.some((item) => item._id === data._id);
				if (!existsInList) {
					switch (data.status.code) {
						case orderStatus.waiting:
							showMessageToast(
								toast,
								"success",
								(data?.customer?.firstName || "#") +
									" " +
									(data?.customer?.lastName || "#") +
									" " +
									t("checkin_noti")
							);
							state.list.unshift(data);
							state.filtered.unshift(data);
							break;
						case orderStatus.inprocessing:
							showMessageToast(toast, "success", data.code + " " + t("ordercreate_noti"));
							state.list.unshift(data);
							state.filtered.unshift(data);
							break;
					}
					// notification(data.code + " " + t("ordercreate_noti"));
				}
			} else if (actionActive == ActionSocket.update) {
				const indexInList = state.list.findIndex((item) => item._id === data._id);
				if (indexInList !== -1) {
					state.list[indexInList] = data;
					const indexInFiltered = state.filtered.findIndex((item) => item._id === data._id);
					if (indexInFiltered !== -1) {
						state.filtered[indexInFiltered] = data;
					}
					switch (data.status.code) {
						case orderStatus.waiting:
						case orderStatus.inprocessing:
							showMessageToast(
								toast,
								"success",
								t("order") + " " + data.code + " " + t("orderupdate_inprocess")
							);
							break;
						case orderStatus.done:
							// notification(t("order") + " " + data.code + " " + t("orderdone_noti"));
							showMessageToast(
								toast,
								"success",
								t("order") + " " + data.code + " " + t("orderdone_noti")
							);
							break;
						case orderStatus.paid:
							// notification(t("order") + " " + data.code + " " + t("orderpaid_noti"));
							showMessageToast(
								toast,
								"success",
								t("order") + " " + data.code + " " + t("orderpaid_noti")
							);
							break;
						default:
							break;
					}
				}
			}
		},

		updateBookingStatus: (state, action: PayloadAction<{ id: string; status: Status }>) => {
			const { id, status } = action.payload;
			const orderIndex = state.filtered.findIndex((item) => item._id === id);

			if (orderIndex !== -1) {
				const updatedItem = { ...state.filtered[orderIndex], status };
				const listIndex = state.list.findIndex((item) => item._id === id);
				if (listIndex !== -1) {
					state.list[listIndex].status = status;
				}
				state.filtered.splice(orderIndex, 1);

				if (status.code === orderStatus.inprocessing) {
					state.filtered.unshift(updatedItem);
				} else {
					state.filtered.push(updatedItem);
				}
			}
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchBookings.fulfilled, (state, action) => {
				state.fetchState.status = "completed";
				state.list = action.payload.data.data;
				state.filtered = action.payload.data.data;
				// state.stores = StoreService.storesFromJson(data.data)
			})
			.addCase(fetchBookings.pending, (state, _action) => {
				state.fetchState.status = "loading";
			})
			.addCase(fetchBookings.rejected, (state, action) => {
				const error = parseHttpError(action.payload);
				state.fetchState = { status: "failed", code: error.statusCode, error: error.message };
			})
			.addCase(deleteBooking.fulfilled, (state, _action) => {
				state.actionState.status = "completed";
			})
			.addCase(deleteBooking.pending, (state, _action) => {
				state.actionState.status = "loading";
			})
			.addCase(deleteBooking.rejected, (state, action) => {
				const error = parseHttpError(action.payload);
				state.actionState = { status: "failed", code: error.statusCode, error: error.message };
			})

			.addCase(deleteBookingSoft.fulfilled, (state, action) => {
				state.actionState.status = "completed";
				const deletedId = action.payload.data.data;
				state.list = state.list.filter((item) => item._id !== deletedId);
				state.filtered = state.filtered.filter((item) => item._id !== deletedId);
				state.successMessage = "Deleted booking successfully.";
			})
			.addCase(deleteBookingSoft.pending, (state, _action) => {
				state.actionState.status = "loading";
			})
			.addCase(deleteBookingSoft.rejected, (state, action) => {
				const error = parseHttpError(action.payload);
				state.actionState = { status: "failed", code: error.statusCode, error: error.message };
			})

			.addCase(addBooking.fulfilled, (state, action) => {
				state.actionState.status = "completed";
				state.list = [action.payload.data.data];
				state.successMessage = "Created booking successfully.";
			})
			.addCase(addBooking.pending, (state, _action) => {
				state.actionState.status = "loading";
			})
			.addCase(addBooking.rejected, (state, action) => {
				const error = parseHttpError(action.payload);
				state.actionState = { status: "failed", code: error.statusCode, error: error.message };
			})
			//EDIT
			.addCase(editBooking.fulfilled, (state, action) => {
				state.actionState.status = "completed";
				state.list = [action.payload.data.data];
				state.successMessage = "Updated booking successfully.";
			})
			.addCase(editBooking.pending, (state, _action) => {
				state.actionState.status = "loading";
			})
			.addCase(editBooking.rejected, (state, action) => {
				const error = parseHttpError(action.payload);
				state.actionState = { status: "failed", code: error.statusCode, error: error.message };
			});
	},
});
export const {
	filterSearch,
	actionSearchData,
	resetActionState,
	updateBookingStatus,
	// BookingRealTimeAction,
	selectItem,
	resetFetchState,
	changeAction,
} = bookingSlice.actions;

export default bookingSlice.reducer;
