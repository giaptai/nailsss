import { AbilityModel } from "../models/category/Ability.model";
import { RoleModel } from "../models/category/Role.model";
import { HttpService } from "./http/HttpService";
import { parseCommonHttpResult } from "./http/parseCommonResult";

const actionsMap: Record<string, string> = {
	INS: "create",
	UPD: "update",
	DEL: "delete",
	RES: "restore",
	PRI: "print",
	PAY: "payment",
};

const functionsMap: Record<string, string> = {
	ROLE: "F0001",
	USER: "F0002",
	PROFILE: "F0003",
	ABILITY: "F0004",
	CUSTOMER: "F0005",
	SERVICE: "F0007",
	WINDOW: "F0006",
	GIFTCARD: "F0008",
	MENU: "F0009",
	CONFIG: "F0010",
	ORDER: "F0011",
	LANG: "F0012",
	ORDERDETAIL: "F0013",
	TURN: "F0014",
	PAYMENT: "F0015",
	CHECKIN: "F0016",
	REPORT: "F0017",
	PAYROLL: "F0018",
	// SERVICE: "F0051",
	// WINDOW: "F0050",
	// GIFTCARD: "F0052",
	// MENU: "F0053",
	// STORECONFIG: "F0054",
	// TURN: "F0055",
};
const functionsMapTarGet: Record<string, string[]> = {
	F0001: ["/roles", "/role-item"],
	F0002: ["/employees", "/edit-employee"],
	F0003: ["/window"],
	F0005: ["/customers"],
	F0006: ["/window"],
	F0007: ["/service"],
	F0008: ["/giftcard"],
	F0009: ["/menu", "/menu-item"],
	F0010: ["/storeconfig"],
	F0011: ["/order", "/order-list", "/payment", "/refund"],
	F0015: ["/payment"],
	F0017: ["/statement", "/transactions", "/payrolls"],
	F0018: ["/payrolls"],
};
const publicPages = ["/", "/profile", "/change-password", "/setting", "/functions"];
export const RoleService = {
	roleFromJson(data: any) {
		const item = new RoleModel(data._id, data.code, data.name, data.abilities, data.status, data.note);
		return item;
	},
	rolesFromJson(data: any) {
		const list: RoleModel[] = [];
		for (let index = 0; index < data.length; index++) {
			const element = data[index];
			const item = new RoleModel(
				element._id,
				element.code,
				element.name,
				element.abilities.map((item: any) => AbilityModel.fromJson(item)),
				element.status,
				element.note
			);
			list.push(item);
		}
		return list;
	},
	async getRole(_id: string) {
		const response = await HttpService.doGetRequest("/roles/" + _id, {});
		const res = parseCommonHttpResult(response);
		return res;
	},
	async fetchRoles() {
		const response = await HttpService.doGetRequest("/roles", {});
		const res = parseCommonHttpResult(response);
		return res;
	},
	async addRole(data: any) {
		const response = await HttpService.doPostRequest("/roles", data);
		const res = parseCommonHttpResult(response);
		return res;
	},
	async updateRole(data: any) {
		const response = await HttpService.doPatchRequest("/roles/" + data._id, data.data);
		const res = parseCommonHttpResult(response);
		return res;
	},
	async deleteRole(_id: string) {
		const response = await HttpService.doPatchRequest("/roles/" + _id + "/soft-delete", {});
		const res = parseCommonHttpResult(response);
		return res;
	},
	async restoreRole(_id: string) {
		const response = await HttpService.doPatchRequest("/roles/" + _id + "/restore", {});
		const res = parseCommonHttpResult(response);
		return res;
	},
	isAllowAction(role: any, target: string, action: string) {
		if (!role) return false;
		const isAdmin = role.code == "R0000";
		if (isAdmin) return true;
		const ability = role.abilities
			? role.abilities.find((ability: any) => ability?.permission?.code?.toUpperCase() == functionsMap[target])
			: false;
		if (ability) {
			return ability?.permission?.action?.find((item: any) => item == actionsMap[action]);
		}
		return false;
	},
	isAllowField(role: any, target: string, code: string, action: string) {
		//tạm thời chưa check role field nên comment đoạn code dưới lại
		return true;
		if (!role) return false;
		const isAdmin = role.code == "R0000";
		if (isAdmin) return true;
		const ability = role.abilities
			? role.abilities.find((ability: any) => ability?.permission?.code?.toUpperCase() == functionsMap[target])
			: [];
		if (ability) {
			const field = ability?.fields?.find((item: any) => item?.key == code);
			if (field) {
				return field.action?.find((item: any) => item == actionsMap[action]);
			}
		}
		return true;
	},
	isHideField(role: any, target: string, code: string) {
		//tạm thời chưa check role field nên comment đoạn code dưới lại
		return false;
		if (!role) return false;
		const isAdmin = role.code == "R0000";
		if (isAdmin) return false;
		const ability = role.abilities
			? role.abilities.find((ability: any) => ability?.permission?.code?.toUpperCase() == functionsMap[target])
			: [];
		if (ability) {
			const field = ability?.fields?.find((item: any) => item?.key == code);
			if (field) {
				return field.action?.find((item: any) => item == "not_read") != undefined;
			}
		}
		return false;
	},
	isAllowMenu(role: any, target: string) {
		if (!role) return false;
		const isAdmin = role.code == "R0000";
		if (isAdmin) return true;
		const ability = role.abilities
			? role.abilities.find((ability: any) => ability?.permission?.code?.toUpperCase() == functionsMap[target])
			: [];
		return ability != undefined;
	},
	isAllowPage(role: any, target: string) {
		if (publicPages.includes(target)) return true;
		if (!role) return false;
		const isAdmin = role.code === "R0000";
		if (isAdmin) return true;
		const hasPermission = role.abilities
			? role.abilities.some((ability: any) => {
					const allowedPages = functionsMapTarGet[ability?.permission?.code?.toUpperCase()];
					return allowedPages && allowedPages.includes(target);
			  })
			: false;
		return hasPermission;
	},
	isShowSettingLang(role: any, target: string) {
		if (!role) return false;
		const isAdmin = role.code == "R0000";
		if (isAdmin) return true;
		const ability = role.abilities
			? role.abilities.find((ability: any) => ability?.permission?.code?.toUpperCase() == functionsMap[target])
			: [];
		return ability != undefined;
	},
};
