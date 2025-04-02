import { WindowModel } from "./Window.model";

export class ProfileModel {
	_id: string;
	code: string;
	firstName: string;
	lastName: string;
	middleName: string;
	phone: string;
	address: string;
	email: string;
	gender: string;
	avatar: string;
	language: string;
	userId: string;
	roleId: string;
	username: string;
	street1: string;
	street2: string;
	state: string;
	city: string;
	zipcode: string;
	emergencyContactName: string;
	emergencyContactPhone: string;
	openDraw: string;
	selfGiftCard: string;
	paymentType: string;
	paymentValue: number;
	compensation: number;
	checkAndBonus: number;
	check: number;
	positionWindow: WindowModel;
	positionPoint: number;
	color: string;

	constructor(
		_id: string,
		code: string,
		firstName: string,
		lastName: string,
		middleName: string,
		phone: string,
		address: string,
		email: string,
		gender: string,
		avatar: string,
		language: string,
		userId: string,
		username: string,
		roleId: string,
		street1: string,
		street2: string,
		state: string,
		city: string,
		zipcode: string,
		emergencyContactName: string,
		emergencyContactPhone: string,
		openDraw: string,
		selfGiftCard: string,
		paymentType: string,
		paymentValue: number,
		compensation: number,
		checkAndBonus: number,
		check: number,
		positionWindow: WindowModel,
		positionPoint: number,
		color: string
	) {
		this._id = _id;
		this.code = code;
		this.firstName = firstName;
		this.lastName = lastName;
		this.middleName = middleName;
		this.phone = phone;
		this.address = address;
		this.email = email;
		this.gender = gender;
		this.avatar = avatar;
		this.language = language;
		this.userId = userId;
		this.username = username;
		this.roleId = roleId;
		this.street1 = street1;
		this.street2 = street2;
		this.state = state;
		this.city = city;
		this.zipcode = zipcode;
		this.emergencyContactName = emergencyContactName;
		this.emergencyContactPhone = emergencyContactPhone;
		this.openDraw = openDraw;
		this.selfGiftCard = selfGiftCard;
		this.paymentType = paymentType;
		this.paymentValue = paymentValue;
		this.compensation = compensation;
		this.checkAndBonus = checkAndBonus;
		this.check = check;
		this.positionWindow = positionWindow;
		this.positionPoint = positionPoint;
		this.color = color;
	}

	static initial(): ProfileModel {
		return new ProfileModel(
			"",
			"",
			"", // firstName
			"", // lastName
			"", // middleName
			"", // phone
			"", // address
			"", // email
			"", // gender
			"", // avatar
			"", // language
			"", // userId
			"", // username
			"", // roleId
			"", // street1
			"", // street2
			"", // state
			"", // city
			"", // zipcode
			"", // emergencyContactName
			"", // emergencyContactPhone
			"", // openDraw
			"", // selfGiftCard
			"", // paymentType
			0, // paymentValue
			0, // compensation
			0, // checkAndBonus
			0, // check
			WindowModel.initial(), // positionWindow
			0, // positionPoint
			"" // color
		);
	}
}
