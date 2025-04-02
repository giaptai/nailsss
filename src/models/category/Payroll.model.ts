import { OrderDetailPayrollModel } from "./OrderDetailPayroll.model";
import { ProfileModel } from "./Profile.model";

export class PayrollModel {
	details: OrderDetailPayrollModel[];
	employeeId: string;
	profile: ProfileModel;

	constructor(details: OrderDetailPayrollModel[], employeeId: string, profile: ProfileModel) {
		this.details = details;
		this.employeeId = employeeId;
		this.profile = profile;
	}
}
