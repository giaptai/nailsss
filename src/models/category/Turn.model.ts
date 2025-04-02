import { ProfileModel } from "./Profile.model";
import { ServiceModel } from "./Service.model";
interface turns {
	transDate: Date;
	totalTurn: number;
	details: details[];
}
interface details {
	employeeId: string;
	turn: number;
	transDate: Date;
	service: ServiceModel;
}
export class TurnModel {
	_id: string;
	turns: turns[];
	profile: ProfileModel;

	constructor(_id: string, turns: turns[], profile: ProfileModel) {
		(this._id = _id), (this.turns = turns), (this.profile = profile);
	}
	static initial() {
		return {
			_id: "",
			turns: [],
			profile: "",
		};
	}
}
