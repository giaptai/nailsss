import { MenuModel } from "./Menu.model";
import { UserModel } from "./User.model";

export class ServiceModel {
	_id: string;
	displayName: string;
	name: string;
	storePrice: number;
	employeePrice: number;
	tax: string;
	menu: MenuModel;
	menuId: string;
	type: string;
	askForPrice: string;
	turn: number;
	sortOrder: number;
	note: string;
	status: any;
	unit: number;
	position: number;
	employeeSelect: UserModel | undefined;
	idOrder: string;
	totalPriceOrder: number;
	totalPriceEmployee: number;
	color: string;
	isShowCheckin: string;
	constructor(
		_id: string,
		displayName: string,
		name: string,
		storePrice: number,
		employeePrice: number,
		tax: string,
		menu: MenuModel,
		menuId: string,
		askForPrice: string,
		note: string,
		type: string,
		turn: number,
		sortOrder: number,
		status: any,
		unit: number,
		position: number,
		employeeSelect: UserModel,
		idOrder: string,
		totalPriceOrder: number,
		totalPriceEmployee: number,
		color: string,
		isShowCheckin: string
	) {
		(this._id = _id),
			(this.displayName = displayName),
			(this.name = name),
			(this.storePrice = storePrice),
			(this.employeePrice = employeePrice),
			(this.tax = tax),
			(this.askForPrice = askForPrice),
			(this.menu = menu),
			(this.menuId = menuId),
			(this.turn = turn),
			(this.sortOrder = sortOrder),
			(this.note = note),
			(this.type = type),
			(this.status = status),
			(this.unit = unit),
			(this.position = position),
			(this.employeeSelect = employeeSelect),
			(this.idOrder = idOrder),
			(this.totalPriceOrder = totalPriceOrder),
			(this.totalPriceEmployee = totalPriceEmployee),
			(this.color = color),
			(this.isShowCheckin = isShowCheckin);
	}
	static initial() {
		return {
			_id: "",
			displayName: "",
			name: "",
			storePrice: 0,
			employeePrice: 0,
			tax: "",
			askForPrice: "NO",
			note: "",
			menu: "",
			menuId: "",
			turn: 0,
			sortOrder: 0,
			type: "",
			status: { code: "ACTIVE", value: "ACTIVE" },
			unit: 0,
			position: null,
			employeeSelect: undefined,
			idOrder: "",
			totalPriceOrder: 0,
			totalPriceEmployee: 0,
			color: "#283673",
			isShowCheckin: "YES",
		};
	}
	static initialOtherCharges() {
		return {
			_id: "",
			displayName: "Other Charges",
			name: "Other Charges",
			storePrice: 0,
			employeePrice: 0,
			tax: "",
			askForPrice: "NO",
			note: "",
			menu: "",
			menuId: "",
			turn: 0,
			sortOrder: 0,
			type: "",
			status: { code: "ACTIVE", value: "ACTIVE" },
			unit: 0,
			position: null,
			employeeSelect: undefined,
			idOrder: "",
			totalPriceOrder: 0,
			totalPriceEmployee: 0,
			color: "#283673",
			isShowCheckin: "YES",
		};
	}
}
