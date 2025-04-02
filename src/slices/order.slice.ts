import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { t } from "i18next";
import { Nullable } from "primereact/ts-helpers";
import { parseHttpError } from "../app/error";
import { orderStatus, RequestState } from "../app/state";
import { commonCreateAsyncThunk } from "../app/thunk";
import { ActionSocket, endOfDay, startOfDay, Status } from "../const";
import { OrderModel } from "../models/category/Order.model";
import { OrderService } from "../services/Order.service";
import { showMessageToast } from "../utils/alert.util";
import { isStrContainIgnoreCase } from "../utils/string.ultil";

export interface OrderState {
	list: OrderModel[];
	filtered: OrderModel[];
	fetchState: RequestState;
	actionState: RequestState;
}
const initialState: OrderState = {
	list: [],
	filtered: [],
	fetchState: { status: "idle" },
	actionState: { status: "idle" },
};
export const fetchOrders: any = commonCreateAsyncThunk({ type: "order/fetchOrder", action: OrderService.fetchOrder });
export const deleteOrder: any = commonCreateAsyncThunk({
	type: "order/deleteOrder",
	action: OrderService.deleteOrderCheckIn,
});
export const deleteOrderSoft: any = commonCreateAsyncThunk({
	type: "order/deleteOrderSoft",
	action: OrderService.deleteOrderSoft,
});

export const OrderSlice = createSlice({
	name: "order",
	initialState,
	reducers: {
		filterSearch: (state, action: PayloadAction<{ searchString: string; status: string }>) => {
			state.filtered = state.list.filter((item) => {
				const searchString = `${item.code} ${item.customer?.firstName} ${item.customer?.lastName} ${item.details?.[0]?.employee?.profile?.firstName} ${item.details?.[0]?.employee?.profile?.middleName} ${item.details?.[0]?.employee?.profile?.lastName}`;
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
					? item.details.some((detail) => detail.employee && detail.employee._id === _idEmployee)
					: true;
				const itemDate = new Date(item.transDate);
				const fromDateMatch = fromDate ? itemDate >= startOfDay(fromDate) : true;
				const toDateMatch = toDate ? itemDate <= endOfDay(toDate) : true;
				return employeeMatch && fromDateMatch && toDateMatch;
			});
		},
		resetActionState(state) {
			state.actionState = { status: "idle" };
		},
		OrderRealTimeAction(state, action) {
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
							// notification(t("order") + " " + data.code + " " + t("orderupdate_inprocess"));
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
		updateOrderStatus: (state, action: PayloadAction<{ id: string; status: Status }>) => {
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
			.addCase(fetchOrders.fulfilled, (state, action) => {
				state.fetchState.status = "completed";
				state.list = action.payload.data.data;
				state.filtered = action.payload.data.data;
				// state.stores = StoreService.storesFromJson(data.data)
			})
			.addCase(fetchOrders.pending, (state, _action) => {
				state.fetchState.status = "loading";
			})
			.addCase(fetchOrders.rejected, (state, action) => {
				const error = parseHttpError(action.payload);
				state.fetchState = { status: "failed", code: error.statusCode, error: error.message };
			})
			.addCase(deleteOrder.fulfilled, (state, _action) => {
				state.actionState.status = "completed";
			})
			.addCase(deleteOrder.pending, (state, _action) => {
				state.actionState.status = "loading";
			})
			.addCase(deleteOrder.rejected, (state, action) => {
				const error = parseHttpError(action.payload);
				state.actionState = { status: "failed", code: error.statusCode, error: error.message };
			})
			.addCase(deleteOrderSoft.fulfilled, (state, action) => {
				state.actionState.status = "completed";
				const deletedId = action.payload.data._id;
				state.list = state.list.filter((item) => item._id !== deletedId);
				state.filtered = state.filtered.filter((item) => item._id !== deletedId);
			})
			.addCase(deleteOrderSoft.pending, (state, _action) => {
				state.actionState.status = "loading";
			})
			.addCase(deleteOrderSoft.rejected, (state, action) => {
				const error = parseHttpError(action.payload);
				state.actionState = { status: "failed", code: error.statusCode, error: error.message };
			});
	},
});
export const { filterSearch, actionSearchData, resetActionState, updateOrderStatus, OrderRealTimeAction } =
	OrderSlice.actions;

export default OrderSlice.reducer;
