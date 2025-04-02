import { CustomerModel } from "./Customer.model";
import { ServiceModel } from "./Service.model";
import { UserModel } from "./User.model";

interface Status {
	code: string;
	value: string;
}
interface Attributes {
	detail: {
		emoployee: UserModel;
		services: ServiceModel[];
	}[];
}
export class BookingModel {
	_id: string = "";
	bookingDate: string = "";
	code: string = "";
	customer: CustomerModel;
	status: Status = { code: "", value: "" };
	histories: {
		_id: string;
		objectId: string;
		code: string;
		data: any;
		transDate: string;
		userId: string;
		type: string;
		action: string;
	}[];
	attributes: Attributes;
	constructor(
		_id: string = "",
		bookingDate: string = "",
		code: string = "",
		customer: CustomerModel,
		status: Status = { code: "", value: "" },
		histories: {
			_id: string;
			objectId: string;
			code: string;
			data: any;
			transDate: string;
			userId: string;
			type: string;
			action: string;
		}[],
		attributes: Attributes
	) {
		this._id = _id;
		this.bookingDate = bookingDate;
		this.code = code;
		this.customer = customer;
		this.status = status;
		this.histories = histories;
		this.attributes = attributes;
	}

	static initial() {
		return {
			_id: "",
			bookingDate: "",
			code: "",
			customer: CustomerModel.initial(),
			status: { code: "", value: "" },
			histories: [],
			attributes: {
				detail: [],
			},
		};
	}
}
