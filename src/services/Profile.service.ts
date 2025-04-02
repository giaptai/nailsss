import { ProfileModel } from "../models/category/Profile.model";
import { HttpService } from "./http/HttpService";
import { parseCommonHttpResult } from "./http/parseCommonResult";
export const ProfileService = {
	ProfilesFromJson(data: any) {
		const list: ProfileModel[] = [];
		for (let index = 0; index < data.length; index++) {
			const element = data[index];
			const item = new ProfileModel(
				element?._id,
				element?._id,
				element?.firstName,
				element?.lastName,
				element?.middleName,
				element?.phone,
				element?.address,
				element?.email,
				element?.gender,
				"",
				"vi",
				element?.userId,
				"",
				element?.roleId,
				element?.street1,
				element?.street2,
				element?.state,
				element?.city,
				element?.zipcode,
				element?.emergencyContactName,
				element?.emergencyContactPhone,
				element?.openDraw == true ? "YES" : "NO",
				element?.selfGiftCard == true ? "YES" : "NO",
				element?.paymentType,
				element?.paymentValue,
				element?.compensation,
				element?.checkAndBonus,
				element?.check,
				element?.positionWindow,
				element?.positionPoint,
				element?.color
			);
			list.push(item);
		}
		return list;
	},
	async fetchProfiles(data: any) {
		const response = await HttpService.doGetRequest("/profiles", data);
		const res = parseCommonHttpResult(response);
		return res;
	},
	async updateProfile(data: any) {
		const response = await HttpService.doPatchRequest("/profiles/" + data._id, data.data);
		const res = parseCommonHttpResult(response);
		return res;
	},
	async changeInfoProfile(data: any) {
		const response = await HttpService.doPatchRequest("/profiles/me", data.data);
		const res = parseCommonHttpResult(response);
		return res;
	},
	async changeAvatarProfile(data: any) {
		const response = await HttpService.doPatchRequest("/profiles/change-avatar", data);
		const res = parseCommonHttpResult(response);
		return res;
	},
	async deleteAvatarProfile() {
		const response = await HttpService.doDeleteRequest("/profiles/me/avatar", {});
		const res = parseCommonHttpResult(response);
		return res;
	},
	async getAvatarProfile() {
		const response = await HttpService.fetchAvatarStreamFromServer("profiles/me/avatar");
		return response;
	},

	async updateAvatarProfile(data: File) {
		const response = await HttpService.doPatchRequest("/profiles/me/avatar", data, true, true);
		const res = parseCommonHttpResult(response);
		return res;
	},
	async updateEmpl(data: any) {
		const response = await HttpService.doPatchRequest("/profiles/" + data._id, data.data);
		const res = parseCommonHttpResult(response);
		return res;
	},
	async updateRole(data: any) {
		const response = await HttpService.doPatchRequest("/users/" + data.idEmpl + "/role/" + data.data.roleID, {});
		const res = parseCommonHttpResult(response);
		return res;
	},
	async updatePositionEmpl(data: any) {
		const response = await HttpService.doPatchRequest("/users/profiles/" + data._id, data.data);
		const res = parseCommonHttpResult(response);
		return res;
	},
};
