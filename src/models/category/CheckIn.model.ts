import { ServiceModel } from "./Service.model";

interface ServiceByEmployee {
	service: ServiceModel;
}
interface ListDetails {
	employeeId: string;
	type: string;
	attributes: ServiceByEmployee[];
	_id: string | undefined;
}
export class CheckinModel {
	customerId?: string | undefined;
	transDate: string;
	details: ListDetails[] | undefined;
	paymentDetails: any[] | undefined;
	totalMoney: number;
	constructor(
		customerId: string | undefined,
		details: ListDetails[] | undefined,
		transDate: string,
		totalMoney: number
	) {
		this.customerId = customerId;
		this.transDate = transDate;
		this.details = details;
		this.totalMoney = totalMoney;
	}

	static initial(): CheckinModel {
		return new CheckinModel(
			undefined,
			// null,
			undefined,
			"",
			0
		);
	}
}
