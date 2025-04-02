import { UserModel } from "./User.model";

export class DiscountModel {
	_id: string;
	DiscountBy: "storeDiscount" | "coupons" | "storeEmployees" | "Empl" | "storeEmployee";
	DiscountType: string | undefined;
	TotalDisscount: number;
	IsPercent: boolean | false;
	ValuePercent: string;
	Employee: UserModel | undefined;
	Coupon: string | undefined;
	constructor(
		_id: string,
		DiscountBy: "storeDiscount" | "coupons" | "storeEmployees" | "Empl" | "storeEmployee",
		DiscountType: string,
		TotalDisscount: number,
		isPercent: boolean,
		ValuePercent: string,
		Employee: UserModel | undefined,
		Coupon: string | undefined
	) {
		(this._id = _id),
			(this.DiscountBy = DiscountBy),
			(this.DiscountType = DiscountType),
			(this.TotalDisscount = TotalDisscount),
			(this.IsPercent = isPercent),
			(this.ValuePercent = ValuePercent),
			(this.Employee = Employee),
			(this.Coupon = Coupon);
	}
}
