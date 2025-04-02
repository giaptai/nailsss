export interface PaymentAttributeResponse {
	optionPayment?: string;
	isCreditCardFee?: boolean;
	creditCardFeeAmount?: number;
}

export interface PaymentDetailResponse {
	method: string;
	amount: number;
	attributes?: PaymentAttributeResponse | null;
}

export interface PaymentResponseModel {
	_id: string;
	orderId: string;
	amount: number;
	details: PaymentDetailResponse[];
	code: string;
	transDate: string;
}
