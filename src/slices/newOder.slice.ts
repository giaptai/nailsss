import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { parseHttpError, parseHttpErrorResponse } from "../app/error";
import { RequestState } from "../app/state";
import { commonCreateAsyncThunk } from "../app/thunk";
import { CheckinModel } from "../models/category/CheckIn.model";
import { CustomerModel } from "../models/category/Customer.model";
import { DiscountModel } from "../models/category/Discount.model";
import { GiftcardModel } from "../models/category/Giftcard.model";
import { ListServiceSelectedModel } from "../models/category/ListServiceSelected.model";
import { OrderChangeModel } from "../models/category/OrderChange.model";
import { OrderService } from "../services/Order.service";
import { Status } from "../const";
import { HistoryCustomer } from "../models/category/HistoryCustomer.model";
import { CustomerService } from "../services/Customer.service";

export interface NewOrderState {
	item: CheckinModel;
	itemEdit: OrderChangeModel;
	actionState: RequestState;
	updateListService: RequestState;
	updateItem: RequestState;
	actionUpdateEmployee: RequestState;
	tempService: ListServiceSelectedModel[];
	ListDiscount: DiscountModel[] | [];
	ListGiftCard: GiftcardModel[];
	ListServiceClick: ListServiceSelectedModel | undefined;
	ListServiceEditEmployee: ListServiceSelectedModel | undefined;
	customer: CustomerModel | undefined;
	_id: string;
	code: string | undefined;
	storeDiscount: number;
	tax: number;
	tip: number;
	totalAmount: number;
	totalAll: number;
	isEdit: boolean;
	actionOrder: "add" | "edit";
	isTransfer: boolean;
	itemTransfer: any;
	status: Status;
	historyCustomer: HistoryCustomer | undefined;
	actionHistoryState: RequestState;
	_idSave: string;
	saveDrag: boolean;
	draftNew: boolean;
}

const initialState: NewOrderState = {
	item: CheckinModel.initial(),
	itemEdit: OrderChangeModel.initial(),
	ListServiceClick: undefined,
	ListDiscount: [],
	ListGiftCard: [],
	ListServiceEditEmployee: undefined,
	actionState: { status: "idle" },
	updateItem: { status: "idle" },
	updateListService: { status: "idle" },
	actionUpdateEmployee: { status: "idle" },
	actionHistoryState: { status: "idle" },
	tempService: [],
	customer: undefined,
	_id: "",
	code: undefined,
	storeDiscount: 0,
	tax: 0,
	tip: 0,
	totalAmount: 0,
	totalAll: 0,
	isEdit: false,
	actionOrder: "add",
	isTransfer: false,
	itemTransfer: {},
	status: { code: "", value: "" },
	historyCustomer: undefined,
	_idSave: "",
	saveDrag: false,
	draftNew: false,
};
export const AddOrder: any = commonCreateAsyncThunk({ type: "newOder/AddCheckIn", action: OrderService.addOrder });
export const EditOrder: any = commonCreateAsyncThunk({ type: "newOder/editCheckin", action: OrderService.editOrder });
export const DeleteOrderDetails: any = commonCreateAsyncThunk({
	type: "newOder/deleteOrderDetail",
	action: OrderService.deleteOrderDetail,
});
export const getHistoryCustomer: any = commonCreateAsyncThunk({
	type: "Customer/getHistoryCustomer",
	action: CustomerService.getHistoryCustomer,
});
export const CheckinSlice = createSlice({
	name: "Checkin",
	initialState,
	reducers: {
		selectItem(state, action: PayloadAction<CheckinModel>) {
			state.item = action.payload;
		},
		updateStoreDiscount(state, action) {
			state.storeDiscount = action.payload;
		},
		updateListDiscount(state, action: PayloadAction<DiscountModel[]>) {
			state.ListDiscount = action.payload;
		},
		updateValueTax(state, action) {
			state.tax = action.payload;
		},
		updateValueTip(state, action) {
			state.tip = action.payload;
		},
		updateValuetotalAmount(state, action) {
			state.totalAmount = action.payload;
		},
		updateValuetotalAll(state, action) {
			state.totalAll = action.payload;
		},
		updateItem(state, action: PayloadAction<Partial<CheckinModel>>) {
			state.item = { ...state.item, ...action.payload };
			state.updateItem.status = "completed";
		},
		updateItemEdit(state, action) {
			state.itemEdit = { ...state.itemEdit, ...action.payload };
			state.updateItem.status = "completed";
		},
		updateListService(state, action) {
			const { selected, taxRate, tipRate } = action.payload;

			if (!selected) {
				state.item.details = undefined;
			} else {
				state.item.details = OrderService.convertObjectToServiceByEmployee(selected, taxRate, tipRate);
			}
			state.updateListService.status = "completed";
		},
		updateListServiceEdit(state, action) {
			const { selected, taxRate, tipRate, detailDelete } = action.payload;
			if (action.payload == undefined) {
				state.itemEdit.details = undefined;
				state.updateListService.status = "completed";
			} else {
				state.itemEdit.details = OrderService.convertObjectToServiceByEmployeeEdit(
					selected,
					state.itemTransfer || undefined,
					taxRate,
					tipRate
				);
				if (detailDelete) {
					state.itemEdit.details = state.itemEdit.details.concat(detailDelete);
				}
				state.updateListService.status = "completed";
			}
		},
		updateListServiceDelete(state, action) {
			if (action.payload == undefined) {
				state.itemEdit.details = undefined;
				state.updateListService.status = "completed";
			} else {
				state.itemEdit.details = OrderService.convertObjectToServiceByEmployeeDelete(action.payload);
				state.updateListService.status = "completed";
			}
		},
		resetActionState(state) {
			state.actionState = { status: "idle" };
			state.actionUpdateEmployee = { status: "idle" };
		},
		resetUpdateState(state) {
			state.updateItem = { status: "idle" };
			state.updateListService = { status: "idle" };
		},
		resetState(state) {
			state.item = CheckinModel.initial();
		},
		updatetempService(state, action) {
			state.tempService = action.payload;
		},
		updateListGiftCard(state, action: PayloadAction<ListServiceSelectedModel>) {
			const existingItem = state.tempService.find(
				(item) => item?.ListGiftCard !== undefined && item?.ListGiftCard.length > 0
			);
			if (existingItem) {
				existingItem.ListGiftCard = [
					...(existingItem.ListGiftCard || []),
					...(action.payload.ListGiftCard || []),
				];
			} else {
				state.tempService = [...state.tempService, action.payload];
			}
		},
		UpdateListServiceClick(state, action) {
			state.ListServiceClick = action.payload;
		},
		UpdateListServiceEditEmployee(state, action) {
			state.ListServiceEditEmployee = action.payload;
		},
		deleteListServiceInArray(state, action) {
			const arr = state.tempService.filter((item) => item._id !== action.payload);
			if (state.ListServiceClick?._id === action.payload) {
				state.ListServiceClick = undefined;
			}
			state.tempService = arr;
		},
		deleteAServiceInListservice(state, action) {
			state.tempService = deleteServiceFromTempService(
				state.tempService,
				action.payload.idlist,
				action.payload.idservice,
				action.payload.storeprice
			);
			// if (state.ListServiceClick) state.ListServiceClick = undefined;
		},
		updateCustomer(state, action) {
			state.customer = action.payload;
		},
		update_id(state, action) {
			state._id = action.payload;
			state._idSave = action.payload;
		},
		update_idSave(state, action) {
			state._idSave = action.payload;
		},
		update_code(state, action) {
			state.code = action.payload;
		},
		clearState(state) {
			Object.assign(state, initialState);
		},
		updateDiscountInTempService(state, action) {
			state.tempService.forEach((item) => {
				item.discount = action.payload;
			});
		},
		updateActionOrder(state, action) {
			state.actionOrder = action.payload;
		},
		updateIsEdit(state, action) {
			state.isEdit = action.payload;
		},
		calculatorDiscount(state, action: PayloadAction<DiscountModel[]>) {
			state.storeDiscount = 0;
			state.tempService.forEach((item) => {
				item.discount = 0;
			});
			action.payload.forEach((item) => {
				if (!item.IsPercent) {
					if (item.DiscountBy === "storeDiscount" || item.DiscountBy === "coupons") {
						state.storeDiscount += item.TotalDisscount;
					} else if (item.DiscountBy == "Empl") {
						state.tempService.forEach((service) => {
							if (service.Employee?._id == item.Employee?._id) service.discount += item.TotalDisscount;
						});
					} else if (item.DiscountBy == "storeEmployee") {
						const valuePerPerson = item.TotalDisscount / 2;
						state.storeDiscount += Number(valuePerPerson.toFixed(2));
						state.tempService.forEach((service) => {
							if (service.Employee?._id == item.Employee?._id) service.discount += valuePerPerson;
						});
					} else {
						const tempSrv = state.tempService.filter(
							(item) =>
								item.Employee != null &&
								(item.ListGiftCard?.length == 0 || item.ListGiftCard == undefined)
						);
						const valuePerPerson = item.TotalDisscount / (tempSrv.length + 1);
						state.storeDiscount += Number(valuePerPerson.toFixed(2));
						state.tempService
							.filter(
								(item) =>
									item.Employee != null &&
									(item.ListGiftCard?.length == 0 || item.ListGiftCard == undefined)
							)
							.forEach((service) => {
								service.discount += valuePerPerson;
							});
					}
				} else {
					const value = state.totalAmount * Number(item.ValuePercent);

					if (item.DiscountBy === "storeDiscount" || item.DiscountBy === "coupons") {
						state.storeDiscount += value;
					} else if (item.DiscountBy == "Empl") {
						state.tempService.forEach((service) => {
							if (service.Employee?._id == item.Employee?._id && service.ListService) {
								const totalStorePrice = service.ListService.reduce((total, service) => {
									return total + service.storePrice * service.unit;
								}, 0);
								service.discount += totalStorePrice * Number(item.ValuePercent);
							}
						});
					} else if (item.DiscountBy == "storeEmployee") {
						var valueDiscountPercent = 0;
						state.tempService.forEach((service) => {
							if (service.Employee?._id == item.Employee?._id && service.ListService) {
								valueDiscountPercent = service.ListService.reduce((total, service) => {
									return total + service.storePrice * service.unit;
								}, 0);
								valueDiscountPercent = (valueDiscountPercent * Number(item.ValuePercent)) / 2;
								service.discount += valueDiscountPercent;
							}
						});
						state.storeDiscount += valueDiscountPercent;
					} else {
						const tempSrv = state.tempService.filter(
							(item) =>
								item.Employee != null &&
								(item.ListGiftCard?.length == 0 || item.ListGiftCard == undefined)
						);
						let valueDiscountAll = 0;
						state.tempService.forEach((service) => {
							if (service.Employee?._id == item.Employee?._id && service.ListService) {
								valueDiscountAll = service.ListService.reduce((total, service) => {
									return total + service.storePrice;
								}, 0);
								valueDiscountAll = (valueDiscountPercent * Number(item.ValuePercent)) / 2;
							}
						});
						const valuePerPerson = valueDiscountAll / (tempSrv.length + 1);
						state.storeDiscount += valuePerPerson;
						state.tempService
							.filter(
								(item) =>
									item.Employee != null &&
									(item.ListGiftCard?.length == 0 || item.ListGiftCard == undefined)
							)
							.forEach((service) => {
								if (service.Employee) service.discount += valuePerPerson;
							});
					}
				}
			});
		},
		updateIsTransfer(state, action) {
			state.isTransfer = action.payload;
		},
		updateItemTransfer(state, action) {
			state.itemTransfer = action.payload;
		},
		updateStatusOrder(state, action) {
			state.status = action.payload;
		},
		updateNewOrderState(state, action: PayloadAction<NewOrderState>) {
			return { ...state, ...action.payload };
		},
		updateSaveDrag(state, action) {
			state.saveDrag = action.payload;
		},
		updateDraftNew(state, action) {
			state.draftNew = action.payload;
		},
		deleteEmployee(state, action) {
			const _id = action.payload;
			const item = state.tempService.find((item) => item?._id === _id);
			if (item) {
				item.Employee = undefined;
			}
			if (state.ListServiceClick) {
				state.ListServiceClick.Employee = undefined;
			}
		},
		initOrder(state, _action) {
			state.item = CheckinModel.initial();
			state.itemEdit = OrderChangeModel.initial();
			state.ListServiceClick = undefined;
			state.ListDiscount = [];
			state.ListGiftCard = [];
			state.ListServiceEditEmployee = undefined;
			state.actionState = { status: "idle" };
			state.updateItem = { status: "idle" };
			state.updateListService = { status: "idle" };
			state.actionUpdateEmployee = { status: "idle" };
			state.actionHistoryState = { status: "idle" };
			state.tempService = [];
			state.customer = undefined;
			state._id = "";
			state.code = undefined;
			state.storeDiscount = 0;
			state.tax = 0;
			state.tip = 0;
			state.totalAmount = 0;
			state.totalAll = 0;
			state.isEdit = false;
			state.actionOrder = "add";
			state.isTransfer = false;
			state.itemTransfer = {};
			state.status = { code: "", value: "" };
			state.historyCustomer = undefined;
			state._idSave = "";
			state.saveDrag = false;
			state.draftNew = false;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(AddOrder.fulfilled, (state, action) => {
				try {
					state.actionState.status = "completed";
					state.code = action.payload.data.data.code;
					state._id = action.payload.data.data._id;
					state.customer = action.payload.data.data.customer;
					state.ListServiceClick = undefined;
					const res = action.payload.data.data.details;
					state.tempService = [];
					res.map((item: any) => {
						const i = new ListServiceSelectedModel(
							item?.employee,
							item?.attributes?.services ? Object.values(item.attributes.services) : undefined,
							item?.attributes?.giftcards ? Object.values(item.attributes.giftcards) : undefined,
							item?._id,
							item?.code,
							item?.attributes?.tip,
							item?.attributes?.discount,
							item?.status,
							item?._id,
							item?.bookingDate
						);
						state.tempService.push(i);
					});
				} catch (error) {
					console.log(error);
					state.actionState.status = "failed";
				}
			})
			.addCase(AddOrder.pending, (state, _action) => {
				state.actionState.status = "loading";
			})
			.addCase(AddOrder.rejected, (state, action) => {
				const error = parseHttpError(action.payload);
				state.actionState = { status: "failed", code: error.statusCode, error: error.message };
			})
			.addCase(EditOrder.fulfilled, (state, action) => {
				state.actionState.status = "completed";
				state.status = action.payload.data.data.status;
				const res = action.payload.data.data.details.filter((item: any) => item.attributes.isCheckIn != true);
				state.tempService = [];
				res.map((item: any) => {
					const i = new ListServiceSelectedModel(
						item?.employee,
						item?.attributes?.services ? Object.values(item.attributes.services) : undefined,
						item?.attributes?.giftcards ? Object.values(item.attributes.giftcards) : undefined,
						item?._id,
						item?.code,
						item?.attributes?.tip,
						item?.attributes?.discount,
						item?.status,
						item?._id,
						item?.bookingDate
					);

					state.tempService.push(i);
				});
				state.itemEdit = OrderChangeModel.initial();
				if (state.isTransfer) {
					state.isTransfer = false;
					state.itemTransfer = {};
				}
			})
			.addCase(EditOrder.pending, (state, _action) => {
				state.actionState.status = "loading";
			})
			.addCase(EditOrder.rejected, (state, action) => {
				const error = parseHttpErrorResponse(action.payload);
				state.actionState = { status: "failed", code: error.statusCode, error: error.message };
				if (state.isTransfer) {
					state.isTransfer = false;
					state.itemTransfer = {};
				}
			})
			.addCase(DeleteOrderDetails.fulfilled, (state, _action) => {
				state.isEdit = true;
			})
			.addCase(DeleteOrderDetails.pending, (state, _action) => {
				state.actionState.status = "loading";
			})
			.addCase(DeleteOrderDetails.rejected, (state, action) => {
				const error = parseHttpError(action.payload);
				state.actionState = { status: "failed", code: error.statusCode, error: error.message };
			})
			.addCase(getHistoryCustomer.fulfilled, (state, action) => {
				state.actionHistoryState.status = "completed";
				const data = action.payload.data?.data;
				state.historyCustomer = new HistoryCustomer(data);
			})
			.addCase(getHistoryCustomer.pending, (state, _action) => {
				state.actionHistoryState.status = "loading";
			})
			.addCase(getHistoryCustomer.rejected, (state, action) => {
				const error = parseHttpError(action.payload);
				state.actionHistoryState = { status: "failed", code: error.statusCode, error: error.message };
			});
	},
});
export const {
	updateIsTransfer,
	updateItemTransfer,
	updateActionOrder,
	selectItem,
	update_id,
	updateListGiftCard,
	calculatorDiscount,
	updateListDiscount,
	update_code,
	updateValueTax,
	updateValueTip,
	updateDiscountInTempService,
	updateItem,
	updateValuetotalAmount,
	updateValuetotalAll,
	deleteListServiceInArray,
	deleteAServiceInListservice,
	updateListService,
	resetActionState,
	resetState,
	clearState,
	updatetempService,
	UpdateListServiceClick,
	UpdateListServiceEditEmployee,
	updateCustomer,
	resetUpdateState,
	updateStoreDiscount,
	updateItemEdit,
	updateListServiceEdit,
	updateListServiceDelete,
	updateStatusOrder,
	updateIsEdit,
	updateNewOrderState,
	update_idSave,
	deleteEmployee,
	updateSaveDrag,
	updateDraftNew,
	initOrder,
} = CheckinSlice.actions;
export default CheckinSlice.reducer;
function deleteServiceFromTempService(
	tempService: ListServiceSelectedModel[],
	tempServiceId: string,
	serviceId: string,
	storeprice: number
): ListServiceSelectedModel[] {
	return tempService.map((item) => {
		if (item._id === tempServiceId && item?.ListService) {
			let serviceDeleted = false;
			const updatedListService = item?.ListService.filter((service) => {
				if (serviceDeleted || service._id !== serviceId || service.storePrice !== storeprice) {
					return true;
				} else {
					serviceDeleted = true;
					return false;
				}
			});
			return { ...item, ListService: updatedListService };
		}
		return item;
	});
}
