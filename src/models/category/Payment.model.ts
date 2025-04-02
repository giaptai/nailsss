export class PaymentModel {
	_id: string;
	amount: number;
	typePayment: "CREDIT_CARD" | "CASH" | "GIFT_CARD" | "";
	optionPayment: string | undefined;
	status: string;
	giftCardId: string | undefined;
	feeCreditCard: number | null;
	constructor(
		_id: string,
		typePayment: "CREDIT_CARD" | "CASH" | "GIFT_CARD" | "",
		amount: number,
		optionPayment: string | undefined,
		status: string,
		giftCardId: string | undefined,
		feeCreditCard: number | null
	) {
		(this._id = _id),
			(this.typePayment = typePayment),
			(this.amount = amount),
			(this.optionPayment = optionPayment),
			(this.status = status),
			(this.giftCardId = giftCardId),
			(this.feeCreditCard = feeCreditCard);
	}
}
