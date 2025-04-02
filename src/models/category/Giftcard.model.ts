import { HistoryGiftcardModel } from "./HistoryGiftcard.model"

export class GiftcardModel {
	_id: string
	cardId: string
	amount: number
	remaining: number
	lastName: string
	firstName: string
	phone: string
	zipcode: string
	note: string
	type: string
	status: any
	history: HistoryGiftcardModel[] | undefined
	constructor(_id: string, cardId: string, amount: number, firstName: string, lastName: string, phone: string, zipcode: string, note: string, type: string, status: any, remaining: number, history: HistoryGiftcardModel[] | undefined) {
		this._id = _id,
			this.cardId = cardId,
			this.amount = amount,
			this.firstName = firstName,
			this.lastName = lastName,
			this.phone = phone,
			this.zipcode = zipcode,
			this.note = note,
			this.type = type,
			this.status = status,
			this.remaining = remaining,
			this.history = history
	}
	static initial() {
		return {
			_id: '',
			cardId: '',
			amount: '',
			firstName: '',
			lastName: '',
			phone: '',
			zipcode: '',
			note: '',
			type: '',
			status: false,
			remaining: 0,
			undefined
		}
	}
}