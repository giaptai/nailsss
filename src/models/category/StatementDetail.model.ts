export class StatementDetailModel {
	_id: string;
	orderId: string;
	amountOrder: number;
	amountPayroll: number;
	amountStore: number;
	amountStoreTip: number;
	config: { creditCardFeeAmount: number };
	discount: number;
	feeCreditCard: number;
	tax: number;
	transDate: string;

	constructor(
		_id: string,
		orderId: string,
		amountOrder: number,
		amountPayroll: number,
		amountStore: number,
		amountStoreTip: number,
		config: { creditCardFeeAmount: number },
		discount: number,
		feeCreditCard: number,
		tax: number,
		transDate: string
	) {
		this._id = _id;
		this.orderId = orderId;
		this.amountOrder = amountOrder;
		this.amountPayroll = amountPayroll;
		this.amountStore = amountStore;
		this.amountStoreTip = amountStoreTip;
		this.config = config;
		this.discount = discount;
		this.feeCreditCard = feeCreditCard;
		this.tax = tax;
		this.transDate = transDate;
	}
}
