import { Status } from "../../const";
import { GiftcardModel } from "./Giftcard.model";
import { ServiceModel } from "./Service.model";
import { UserModel } from "./User.model";

export class ListServiceSelectedModel {
	Employee: UserModel | undefined;
	ListService: ServiceModel[] | undefined;
	ListGiftCard: GiftcardModel[] | undefined;
	_id: string;
	code: string | undefined;
	tip: number;
	discount: number;
	status: Status;
	OrderDetailId: string | undefined;
	BookingDetailId: string | undefined;
	constructor(
		Employee: UserModel | undefined,
		ListService: ServiceModel[] | undefined,
		ListGiftCard: GiftcardModel[] | undefined,
		_id: string,
		code: string | undefined,
		tip: number,
		discount: number,
		status: Status,
		OrderDetailId: string | undefined,
		BookingDetailId: string | undefined
	) {
		(this.Employee = Employee),
			(this.ListService = ListService),
			(this.ListGiftCard = ListGiftCard),
			(this._id = _id),
			(this.code = code),
			(this.tip = tip),
			(this.discount = discount),
			(this.status = status),
			(this.OrderDetailId = OrderDetailId);
		this.BookingDetailId = BookingDetailId;
	}

	static initial(Employee: UserModel | undefined) {
		return new ListServiceSelectedModel(
			Employee,
			[],
			[],
			"",
			undefined,
			0,
			0,
			{ code: "INPROCESSING", value: "INPROCESSING" }, // need changing
			undefined,
			undefined
		);
	}
}
