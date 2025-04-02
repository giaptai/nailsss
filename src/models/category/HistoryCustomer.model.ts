import { Status } from "../../const";
import { CustomerModel } from "./Customer.model";
import { ServiceModel } from "./Service.model";
import { UserModel } from "./User.model";
export interface PaidCustomer {
	orders: Order[];
	totalMoney: number;
	totalTax: number;
	totalDiscount: number;
	totalTip: number;
	totalStoreDiscount: number;
	customer: CustomerModel;
}
export interface Order {
	_id: string;
	checkInId: string | null;
	customerId: string;
	totalMoney: number;
	totalTax: number;
	totalDiscount: number;
	totalTip: number;
	storeDiscount: number;
	attributes: Record<string, unknown>;
	transDate: string; // ISO 8601 date string
	note: string | null;
	createdUserId: string;
	updatedUserId: string;
	code: string;
	status: Status;
	details: OrderDetail[];
}
export interface OrderDetail {
	_id: string;
	type: string;
	employeeId: string;
	attributes: DetailAttributes;
	employee: UserModel;
	status: Status;
}
export interface DetailAttributes {
	services: ServiceModel[];
	tip: number;
	discount: number;
	amountStorePrice: number;
	amountEmployeePrice: number;
	amountTax: number;
	tipRate: number;
}
export class HistoryCustomer {
	result: PaidCustomer[];
	total: number;

	constructor(data: { result: PaidCustomer[]; total: number }) {
		this.result = data.result.map((item) => ({
			...item,
			orders: item.orders.map((order) => ({
				...order,
				details: order.details.map((detail) => ({
					...detail,
					attributes: {
						...detail.attributes,
						services: detail.attributes.services.map((service) => ({
							...service,
						})),
					},
				})),
			})),
		}));
		this.total = data.total;
	}
}
