import { StatementDetailModel } from "./StatementDetail.model";

export class StatementModel {
	details: StatementDetailModel[];
	totalAmountOrder: number;
	totalAmountPayroll: number;
	totalAmountStore: number;
	totalAmountStoreTip: number;
	totalDiscount: number;
	totalFeeCreditCard: number;
	totalTax: number;
	transDate: string;

	constructor(
		details: StatementDetailModel[],
		totalAmountOrder: number,
		totalAmountPayroll: number,
		totalAmountStore: number,
		totalAmountStoreTip: number,
		totalDiscount: number,
		totalFeeCreditCard: number,
		totalTax: number,
		transDate: string
	) {
		this.details = details;
		this.totalAmountOrder = totalAmountOrder;
		this.totalAmountPayroll = totalAmountPayroll;
		this.totalAmountStore = totalAmountStore;
		this.totalAmountStoreTip = totalAmountStoreTip;
		this.totalDiscount = totalDiscount;
		this.totalFeeCreditCard = totalFeeCreditCard;
		this.totalTax = totalTax;
		this.transDate = transDate;
	}
}
