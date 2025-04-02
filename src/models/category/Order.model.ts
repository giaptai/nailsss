import { CustomerModel } from "./Customer.model";
import { GiftcardModel } from "./Giftcard.model";
import { PaymentDetailResponse } from "./PaymentRespone.model";
import { ServiceModel } from "./Service.model";
import { UserModel } from "./User.model";

interface Status {
	code: string;
	value: string;
}
interface Attributes {
	services: ServiceModel[];
	giftcards: Record<string, GiftcardModel>[];
	tip: number;
	discount: number;
	money: number;
	isCheckIn: boolean;
}

interface Detail {
	_id: string;
	attributes: Attributes;
	type: string;
	employee: UserModel;
	status: Status;
}
interface Payment {
	_id: string;
	orderId: string;
	code: string;
	amount: number;
	transDate: string;
	details: PaymentDetailResponse[];
}
export class OrderModel {
	_id: string = "";
	checkIn: any;
	checkInId: string = "";
	totalMoney: number = 0;
	totalDiscount: number = 0;
	totalTax: number = 0;
	totalTip: number = 0;
	storeDiscount: number = 0;
	transDate: string = "";
	code: string = "";
	details: Detail[];
	customer: CustomerModel;
	status: Status = { code: "", value: "" };
	attributes: any;
	payment: Payment;
	constructor(
		_id: string = "",
		checkInId: string = "",
		totalMoney: number = 0,
		totalDiscount: number = 0,
		totalTax: number = 0,
		totalTip: number = 0,
		storeDiscount: number = 0,
		transDate: string = "",
		code: string = "",
		details: Detail[],
		customer: CustomerModel,
		status: Status = { code: "", value: "" },
		attributes: any,
		payment: Payment
	) {
		this._id = _id;
		this.checkInId = checkInId;
		this.totalMoney = totalMoney;
		this.totalDiscount = totalDiscount;
		this.totalTax = totalTax;
		this.totalTip = totalTip;
		this.transDate = transDate;
		this.code = code;
		this.details = details;
		this.customer = customer;
		this.status = status;
		this.attributes = attributes;
		this.storeDiscount = storeDiscount;
		this.payment = payment;
	}
}
