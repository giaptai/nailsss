import { CategoryBaseModel } from "./base.model";
export class CustomerModel extends CategoryBaseModel {
	firstName: string;
	lastName: string;
	phone: string;
	email: string;
	gender: string;
	status: any;
	address: string;
	city: string;
	state: string;
	zipcode: string;
	birthday: Date | null;
	note: string;
	constructor(
		_id: string,
		code: string,
		firstName: string,
		lastName: string,
		phone: string,
		email: string,
		gender: string,
		status: any,
		address: string,
		city: string,
		state: string,
		zipcode: string,
		birthday: Date,
		note: string
	) {
		super(_id, code, "");
		this.firstName = firstName;
		this.lastName = lastName;
		this.phone = phone;
		this.email = email;
		this.gender = gender;
		this.status = status;
		this.address = address;
		this.city = city;
		this.state = state;
		this.zipcode = zipcode;
		this.birthday = birthday;
		this.note = note;
	}
	static initial() {
		return {
			_id: "",
			code: "",
			firstName: "",
			lastName: "",
			phone: "",
			email: "",
			gender: "",
			status: false,
			street1: "",
			city: "",
			state: "",
			zipcode: "",
			birthday: null,
			note: "",
			address: "",
			name: "",
		};
	}
	static fromJson(json: any) {
		return new CustomerModel(
			json?._id,
			json?.code,
			json?.firstName,
			json?.lastName,
			json?.phone,
			json?.email,
			json?.gender,
			json?.status,
			json?.address,
			json?.city,
			json?.state,
			json?.zipcode,
			json?.birthday,
			json?.note
		);
	}
}
