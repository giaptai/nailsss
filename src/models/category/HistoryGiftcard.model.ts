import { GiftcardModel } from "./Giftcard.model"

export class HistoryGiftcardModel {
	_id: string
	cardId: string
	amount: number
	card: GiftcardModel[]
	transDate: string
	constructor(_id: string, cardId: string, amount: number, card: GiftcardModel[], transDate: string) {
		this._id = _id,
			this.cardId = cardId,
			this.amount = amount,
			this.card = card,
			this.transDate = transDate
	}
}