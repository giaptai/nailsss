export class PayrollItemModel {
	_id: string;
	orderDetailId: string;
	type: string;
	orderId: string;
	amountCash: number;
	amountCheck: number;
	amountCheckBonus: number;
	amountDiscount: number;
	amountService: number;
	amountTip: number;
	orderDetail: any;
	order: any;
	config: {
		compensation?: number;
		check?: number;
		checkAndBonus?: number;
		tipOnCreditCard?: number;
	};
	employeeId: string;
	transDate: string;
	status: {
		code: string;
		value: string;
	};

	constructor(
		_id: string,
		orderDetailId: string,
		type: string,
		orderId: string,
		amountCash: number,
		amountCheck: number,
		amountCheckBonus: number,
		amountDiscount: number,
		amountService: number,
		amountTip: number,
		orderDetail: any,
		order: any,
		config: {
			compensation?: number;
			check?: number;
			checkAndBonus?: number;
			tipOnCreditCard?: number;
		},
		employeeId: string,
		transDate: string,
		status: {
			code: string;
			value: string;
		}
	) {
		this._id = _id;
		this.orderDetailId = orderDetailId;
		this.type = type;
		this.orderId = orderId;
		this.amountCash = amountCash;
		this.amountCheck = amountCheck;
		this.amountCheckBonus = amountCheckBonus;
		this.amountDiscount = amountDiscount;
		this.amountService = amountService;
		this.amountTip = amountTip;
		this.config = config;
		this.employeeId = employeeId;
		this.transDate = transDate;
		this.status = status;
		this.orderDetail = orderDetail;
		this.order = order;
	}
}
