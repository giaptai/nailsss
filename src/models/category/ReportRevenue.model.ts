import { Status } from "../../const";
import { CustomerModel } from "./Customer.model";
import { OrderModel } from "./Order.model";
import { PaymentDetailResponse } from "./PaymentRespone.model";

interface Payment {
	_id: string;
	orderId: string;
	code: string;
	amount: number;
	transDate: string;
	details: PaymentDetailResponse[];
}

export class ReportTransactionsModel extends OrderModel {
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
		details: [],
		customer: CustomerModel,
		status: Status = { code: "", value: "" },
		attributes: any = null,
		payment: Payment = {
			_id: "",
			orderId: "",
			code: "",
			amount: 0,
			transDate: "",
			details: [],
		}
	) {
		super(
			_id,
			checkInId,
			totalMoney,
			totalDiscount,
			totalTax,
			totalTip,
			storeDiscount,
			transDate,
			code,
			details,
			customer,
			status,
			attributes,
			payment
		);
		this.payment = payment;
	}
}
