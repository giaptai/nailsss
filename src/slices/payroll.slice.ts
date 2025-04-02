import { createSlice } from "@reduxjs/toolkit";
import { parseHttpError } from "../app/error";
import { RequestState } from "../app/state";
import { commonCreateAsyncThunk } from "../app/thunk";
import { PayrollModel } from "../models/category/Payroll.model";
import { PayrollService } from "../services/Payroll.service";
import { OrderDetailPayrollModel } from "../models/category/OrderDetailPayroll.model";
import { isStrContainIgnoreCase } from "../utils/string.ultil";

export interface PayrollState {
	list: PayrollModel[];
	filtered: PayrollModel[];
	ListPrint: PayrollModel[];
	item: PayrollModel | undefined;
	itemOrderDetail: OrderDetailPayrollModel | undefined;
	fetchState: RequestState;
	actionState: RequestState;
}
const initialState: PayrollState = {
	list: [],
	filtered: [],
	ListPrint: [],
	item: undefined,
	itemOrderDetail: undefined,
	fetchState: { status: "idle" },
	actionState: { status: "idle" },
};
// export const getRole: any = commonCreateAsyncThunk({ type: 'role/getRole', action: RoleService.getRole });
export const getPayrolls: any = commonCreateAsyncThunk({
	type: "payroll/getPayrolls",
	action: PayrollService.fetchPayroll,
});
export const getPayrollsAfterPaymentTip: any = commonCreateAsyncThunk({
	type: "payroll/getPayrollsAfterPaymentTip",
	action: PayrollService.fetchPayroll,
});
export const PayrollSlice = createSlice({
	name: "payroll",
	initialState,
	reducers: {
		selectItem(state, action) {
			state.item = action.payload;
		},
		selectItemOrderDetail(state, action) {
			state.itemOrderDetail = action.payload;
		},
		resetFetchState(state) {
			state.fetchState = { status: "idle" };
		},
		resetActionState(state) {
			state.actionState = { status: "idle" };
		},
		setFiltered(state, action) {
			state.filtered = action.payload;
		},
		updateStatusPaid(state, action) {
			const actionPayment = action.payload.action;
			const employeeId = action.payload.employeeId;
			state.filtered = state.filtered.map((item) => {
				if (item.employeeId === employeeId) {
					const updatedItem = {
						...item,
						details: item.details.map((detail) => {
							return {
								...detail,
								payrolls: detail.payrolls.map((payroll) => {
									if (payroll.type === actionPayment) {
										return {
											...payroll,
											status: {
												code: "PAID",
												value: "PAID",
											},
										};
									}
									return payroll;
								}),
							};
						}),
					};

					state.item = updatedItem;

					return updatedItem;
				}
				return item;
			});
		},
		filterSearch: (state, action) => {
			if (state.item) state.item = undefined;
			state.filtered = state.list.filter((item) => {
				const fullName = `${item.profile.firstName}${
					item.profile.middleName ? " " + item.profile.middleName : ""
				} ${item.profile.lastName}`;

				const searchString = `${fullName}`;
				return isStrContainIgnoreCase(searchString, action.payload.searchString);
			});
		},
	},
	extraReducers: (builder) => {
		builder
			// .addCase(addPayroll.fulfilled, (state, _action) => {
			//     state.actionState.status = 'completed'
			// })
			// .addCase(addPayroll.pending, (state, _action) => {
			//     state.actionState.status = 'loading'
			// })
			// .addCase(addPayroll.rejected, (state, action) => {
			//     const error = parseHttpError(action.payload)
			//     state.actionState = { status: "failed", code: error.statusCode, error: error.message }
			// })
			.addCase(getPayrolls.fulfilled, (state, action) => {
				state.fetchState.status = "completed";
				const data = action.payload?.data?.data;
				const filteredSortedData = data.sort((a: any, b: any) => {
					const totalA = a.details.reduce((sum: any, detail: any) => sum + detail.totalAmountService, 0);
					const totalB = b.details.reduce((sum: any, detail: any) => sum + detail.totalAmountService, 0);
					return totalB - totalA;
				});

				state.list = data;
				state.filtered = filteredSortedData;
				state.ListPrint = state.filtered.filter((i) => i.details.length > 0);
			})
			.addCase(getPayrolls.pending, (state, _action) => {
				state.fetchState.status = "loading";
			})
			.addCase(getPayrolls.rejected, (state, action) => {
				const error = parseHttpError(action.payload);
				state.fetchState = { status: "failed", code: error.statusCode, error: error.message };
			})
			.addCase(getPayrollsAfterPaymentTip.fulfilled, (state, action) => {
				// state.fetchState.status = "completed";
				const data = action.payload?.data?.data;
				const filteredSortedData = data.sort((a: any, b: any) => {
					const totalA = a.details.reduce((sum: any, detail: any) => sum + detail.totalAmountService, 0);
					const totalB = b.details.reduce((sum: any, detail: any) => sum + detail.totalAmountService, 0);
					return totalB - totalA;
				});

				state.list = data;
				state.filtered = filteredSortedData;
				state.ListPrint = state.filtered.filter((i) => i.details.length > 0);
				state.item = data.find((e: any) => e.employeeId == state?.item?.employeeId);
			})
			.addCase(getPayrollsAfterPaymentTip.pending, (_state, _action) => {
				// state.fetchState.status = "loading";
			})
			.addCase(getPayrollsAfterPaymentTip.rejected, (_state, _action) => {
				// const error = parseHttpError(action.payload);
				// state.fetchState = { status: "failed", code: error.statusCode, error: error.message };
			});
	},
});
export const {
	selectItem,
	resetFetchState,
	setFiltered,
	resetActionState,
	updateStatusPaid,
	filterSearch,
	selectItemOrderDetail,
} = PayrollSlice.actions;

export default PayrollSlice.reducer;
