import { combineReducers } from "@reduxjs/toolkit";
import appSLice from "../slices/app.slice";
import authSlice from "../slices/auth.slice";
import customerSlice from "../slices/customer.slice";
import storesSlice from "../slices/stores.slice";
import profileSlice from "../slices/profile.slice";
import roleSlice from "../slices/role.slice";
import masterdataSlice from "../slices/masterdata.slice";
import abilitySlice from "../slices/ability.slice";
import userSlice from "../slices/user.slice";
import languageSlice from "../slices/language.slice";
import windowSlice from "../slices/window.slice";
import menuSlice from "../slices/menu.slice";
import storeconfigSlice from "../slices/storeconfig.slice";
import giftcardSlice from "../slices/giftcard.slice";
import serviceSlice from "../slices/service.slice";
import paymentSlice from "../slices/payment.slice";
import orderSlice from "../slices/order.slice";
import turnSlice from "../slices/turn.slice";
import payrollSlice from "../slices/payroll.slice";
import statementSlice from "../slices/statement.slice";
import refundSlice from "../slices/refund.slice";
import cloverSlice from "../slices/clover.slice";
import newOderSlice from "../slices/newOder.slice";
import bookingSlice from "../slices/booking.slice";
const rootReducer = combineReducers({
	app: appSLice,
	auth: authSlice,
	customer: customerSlice,
	store: storesSlice,
	user: userSlice,
	profile: profileSlice,
	role: roleSlice,
	masterdata: masterdataSlice,
	ability: abilitySlice,
	language: languageSlice,
	window: windowSlice,
	menu: menuSlice,
	storeconfig: storeconfigSlice,
	giftcard: giftcardSlice,
	service: serviceSlice,
	payment: paymentSlice,
	newOder: newOderSlice,
	order: orderSlice,
	booking: bookingSlice,
	turn: turnSlice,
	payroll: payrollSlice,
	statement: statementSlice,
	refund: refundSlice,
	clover: cloverSlice,
});

export default rootReducer;
