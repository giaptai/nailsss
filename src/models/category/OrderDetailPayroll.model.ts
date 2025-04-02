import { PayrollItemModel } from "./PayrollItemModel.model";

export class OrderDetailPayrollModel {
	payrolls: PayrollItemModel[];
	totalAmountService: number;
	totalAmountCash: number;
	totalAmountCheck: number;
	totalAmountCheckBonus: number;
	totalAmountDiscount: number;
	totalAmountServiceOrder: number;
	totalTip: number;
	transDate: string;
	totalAmountCreditCardFee: number;
	totalAmountTax: number;
	totalAmountGiftCard: number;
	totalAmountEmployeePrice: number;

	constructor(
		payrolls: PayrollItemModel[],
		totalAmountService: number,
		totalAmountCash: number,
		totalAmountCheck: number,
		totalAmountCheckBonus: number,
		totalAmountDiscount: number,
		totalAmountServiceOrder: number,
		totalTip: number,
		transDate: string,
		totalAmountCreditCardFee: number,
		totalAmountTax: number,
		totalAmountGiftCard: number,
		totalAmountEmployeePrice: number
	) {
		this.payrolls = payrolls;
		this.totalAmountService = totalAmountService;
		this.totalAmountCash = totalAmountCash;
		this.totalAmountCheck = totalAmountCheck;
		this.totalAmountCheckBonus = totalAmountCheckBonus;
		this.totalAmountDiscount = totalAmountDiscount;
		this.totalAmountServiceOrder = totalAmountServiceOrder;
		this.totalTip = totalTip;
		this.transDate = transDate;
		this.totalAmountCreditCardFee = totalAmountCreditCardFee;
		this.totalAmountTax = totalAmountTax;
		this.totalAmountGiftCard = totalAmountGiftCard;
		this.totalAmountEmployeePrice = totalAmountEmployeePrice;
	}
}
