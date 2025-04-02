
import { ProfileModel } from "../models/category/Profile.model"
import { UserModel } from "../models/category/User.model"
import { HttpService } from "./http/HttpService"
import { parseCommonHttpResult } from "./http/parseCommonResult"
export const UserService = {
    usersFromJson(data: any) {
        const list: UserModel[] = []
        const usernameLogin = localStorage.getItem(import.meta.env.VITE_APP_storageUserKey)
        for (let index = 0; index < data.length; index++) {
            const element = data[index]
            const profile = element?.profile
            if (profile && element.username != 'admin'&& element.username != usernameLogin) {
                const item = new UserModel(element?._id, element?.username, element?.password, element?.status?.value, element?.roleId,
                    new ProfileModel(profile?._id, profile?._id, profile?.firstName, profile?.lastName, profile?.middleName, profile?.phone,
                        profile?.address, profile?.email, profile?.gender, '', 'vi', profile?.userId, '',profile?.roleId,profile?.street1,profile?.street2,profile?.state,profile?.city,profile?.zipcode,profile?.emergencyContactName
                        ,profile?.emergencyContactPhone,profile?.openDraw==true?'YES':'NO',profile?.selfGiftCard==true?'YES':'NO',profile?.paymentType,profile?.paymentValue,profile?.compensation,profile?.checkAndBonus,profile?.check,profile?.positionWindow,profile?.positionPoint,profile.color),profile?.gender,element?.role)
                list.push(item)
            }
        }
        return list
    },
    async fetchUsers(data: any) {
        const response = await HttpService.doGetRequest("/users", data);
        const res = parseCommonHttpResult(response)
        return res;
    },
    async addUser(data: any) {
        const response = await HttpService.doPostRequest("/users", data);
        const res = parseCommonHttpResult(response)
        return res;
    },
    async updateUserRole(data: any) {
        const response = await HttpService.doPatchRequest("/users/" + data._id + '/role/' + data.roleId, {});
        const res = parseCommonHttpResult(response)
        return res;
    },
    async deleteUser(id: string) {
        const response = await HttpService.doPatchRequest("/users/" + id + "/soft-delete", {});
        const res = parseCommonHttpResult(response)
        return res;
    },
    async restoreUser(id: string) {
        const response = await HttpService.doPatchRequest("/users/" + id + "/restore", {});
        const res = parseCommonHttpResult(response)
        return res;
    },
    async resetPassUser(id: string) {
        const response = await HttpService.doPatchRequest("/auth/send-password-reset-mail/" + id ,{});
        const res = parseCommonHttpResult(response)
        return res;
    },
    async getAvatarEmployee(id: any) {
        const response = await HttpService.fetchAvatarStreamFromServer(`profiles/${id}/avatar`);
        return response;
    },
}