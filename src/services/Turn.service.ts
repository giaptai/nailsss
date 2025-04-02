import { TurnModel } from "../models/category/Turn.model";
import { HttpService } from "./http/HttpService";
import { parseCommonHttpResult } from "./http/parseCommonResult";
export const TurnService = {
	TurnFromJson(data: any) {
		const list: TurnModel[] = [];
		for (let index = 0; index < data.length; index++) {
			const element = data[index];
			const turns = element?.turns?.map((turn: any) => ({
				transDate: new Date(turn.transDate),
				totalTurn: turn.totalTurn,
				details:
					turn?.details?.map((detail: any) => ({
						employeeId: detail?.employeeId || "",
						turn: detail?.turn || 0,
						transDate: new Date(detail?.createdAt || ""),
						service: detail.service,
					})) || [],
			}));
			const item = new TurnModel(element?._id || "", turns, element?.profile);
			list.push(item);
		}
		return list;
	},
	async fetchTurn(date: string) {
		const response = await HttpService.doGetRequest("/turns?transDate=" + date, {});
		const res = parseCommonHttpResult(response);
		return res;
	},
};
