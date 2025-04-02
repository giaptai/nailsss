import { ProfileModel } from "./Profile.model";

export class UserModel {
	_id: string;
	username: string;
	password: string;
	status: any;
	roleId: string;
	profile: ProfileModel;
	gender: string;
	role: string;
	firstName?: string;
	middleName?: string;
	lastName?: string;
	constructor(
		_id: string,
		username: string,
		password: string,
		status: any,
		roleId: string,
		profile: ProfileModel,
		gender: string,
		role: string
	) {
		(this._id = _id),
			(this.username = username),
			(this.password = password),
			(this.status = status),
			(this.roleId = roleId),
			(this.profile = profile),
			(this.gender = gender),
			(this.role = role);
	}
}
