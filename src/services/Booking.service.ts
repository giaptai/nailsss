import { ActionBooking, FormatNumberSubmitData } from "../const";
import { GiftcardModel } from "../models/category/Giftcard.model";
import { ListServiceSelectedModel } from "../models/category/ListServiceSelected.model";
import { ServiceModel } from "../models/category/Service.model";
import { HttpService } from "./http/HttpService";
import { parseCommonHttpResult } from "./http/parseCommonResult";
interface ServiceByEmployee {
	services: ServiceModel[] | undefined;
	giftcards: GiftcardModel[] | undefined;
	tip?: number;
	discount?: number;
	amountStorePrice?: number;
	amountEmployeePrice?: number;
	amountTax?: number;
	tipRate?: number;
}
export const BookingService = {
	convertObjectToServiceByEmployee(
		objectServiceByEmployee: ListServiceSelectedModel[],
		taxRate: number,
		tipRate: number
	) {
		const ListDetails: any[] = [];
		objectServiceByEmployee.forEach((item) => {
			const { Employee, ListService, ListGiftCard, tip, discount } = item;
			const totalAmountStorePrice = ListService
				? ListService.reduce((sum, _) => sum, 0)
				: 0;
			const totalAmountEmployeePrice = ListService
				? ListService.reduce((sum, payment) => sum + payment.totalPriceEmployee, 0)
				: 0;
			const totalAmountWithTax = ListService
				? ListService.reduce((sum, service) => {
						const priceWithTax = service.tax === "YES" ? 1 * (taxRate / 100) : 0;
						return sum + priceWithTax;
				  }, 0)
				: 0;
			if (ListGiftCard != undefined && ListGiftCard.length > 0) {
				const serviceByEmployee: ServiceByEmployee = {
					services: undefined,
					giftcards: ListGiftCard,
				};
				const details = {
					employeeId: Employee?._id || null,
					type: "GIFTCARD",
					attributes: serviceByEmployee,
				};
				ListDetails.push(details);
			} else {
				const serviceByEmployee: ServiceByEmployee = {
					services: ListService,
					giftcards: undefined,
					tip: FormatNumberSubmitData(tip),
					discount: FormatNumberSubmitData(discount),
					amountStorePrice: FormatNumberSubmitData(totalAmountStorePrice),
					amountEmployeePrice: FormatNumberSubmitData(totalAmountEmployeePrice),
					amountTax: FormatNumberSubmitData(totalAmountWithTax),
					tipRate: FormatNumberSubmitData(tipRate / 100),
				};
				const details = {
					employeeId: Employee?._id || null,
					type: "SERVICE",
					attributes: serviceByEmployee,
				};
				ListDetails.push(details);
			}
		});
		return ListDetails;
	},
	convertObjectToServiceByEmployeeEdit(
		objectServiceByEmployee: ListServiceSelectedModel[],
		itemTransfer: any,
		taxRate: number,
		tipRate: number
	) {
		const ListDetails: any[] = [];
		if (itemTransfer && Object.keys(itemTransfer).length > 0) {
			ListDetails.push(itemTransfer);
		}
		objectServiceByEmployee.forEach((item) => {
			const { Employee, ListService, ListGiftCard, tip, discount } = item;
			const totalAmountStorePrice = ListService
				? ListService.reduce((sum, _) => sum + 0, 0)
				: 0;
			const totalAmountEmployeePrice = ListService
				? ListService.reduce((sum, payment) => sum + payment.totalPriceEmployee, 0)
				: 0;
			const totalAmountWithTax = ListService
				? ListService.reduce((sum, service) => {
						const priceWithTax = service.tax === "YES" ? 1 * (taxRate / 100) : 0;
						return sum + priceWithTax;
				  }, 0)
				: 0;
			if (ListGiftCard != undefined && ListGiftCard.length > 0) {
				const serviceByEmployee: ServiceByEmployee = {
					services: undefined,
					giftcards: ListGiftCard,
				};
				const details = {
					action: item.BookingDetailId ? ActionBooking.edit : ActionBooking.add,
					payload: {
						_id: item._id,
						employeeId: Employee?._id || null,
						type: "GIFTCARD",
						attributes: serviceByEmployee,
					},
				};
				ListDetails.push(details);
			} else {
				const serviceByEmployee: ServiceByEmployee = {
					services: ListService,
					giftcards: undefined,
					tip: FormatNumberSubmitData(tip),
					discount: FormatNumberSubmitData(discount),
					amountStorePrice: FormatNumberSubmitData(totalAmountStorePrice),
					amountEmployeePrice: FormatNumberSubmitData(totalAmountEmployeePrice),
					amountTax: FormatNumberSubmitData(totalAmountWithTax),
					tipRate: FormatNumberSubmitData(tipRate / 100),
				};
				const details = {
					action: item.BookingDetailId ? ActionBooking.edit : ActionBooking.add,
					payload: {
						_id: item._id,
						employeeId: Employee?._id || null,
						type: "SERVICE",
						attributes: serviceByEmployee,
					},
				};
				ListDetails.push(details);
			}
		});
		return ListDetails;
	},
	convertObjectToServiceByEmployeeDelete(_id: string) {
		const ListDetails: any[] = [];
		const details = {
			action: ActionBooking.delete,
			payload: {
				_id: _id,
			},
		};
		ListDetails.push(details);
		return ListDetails;
	},
	// async convertData(input: BookingModel) {
	// 	if (input == undefined) return undefined;
	// 	else {
	// 		const convertedData = input.details.map((detail) => ({
	// 			Employee: detail.employee || undefined,
	// 			checkInId: input.checkInId,
	// 			ListService: detail?.attributes.services
	// 				? Object.values(detail?.attributes.services).map((service) => ({
	// 						_id: service._id,
	// 						displayName: service.displayName,
	// 						name: service.name,
	// 						storePrice: service.storePrice,
	// 						employeePrice: service.employeePrice,
	// 						tax: service.tax,
	// 						menu: service.menu,
	// 						totalPriceBooking: service.totalPriceBooking,
	// 						unit: service.unit,
	// 				  }))
	// 				: [],
	// 			ListGiftCard: detail?.attributes.giftcards
	// 				? Object.values(detail?.attributes.giftcards).map((giftcard) => ({
	// 						_id: giftcard._id,
	// 						amount: giftcard.amount,
	// 						cardId: giftcard.cardId,
	// 						firstName: giftcard.firstName,
	// 						lastName: giftcard.lastName,
	// 						note: giftcard.note,
	// 						phone: giftcard.phone,
	// 						status: giftcard.status,
	// 						type: giftcard.type,
	// 						zipcode: giftcard.zipcode,
	// 				  }))
	// 				: [],
	// 			code: input.code,
	// 			tip: detail.attributes.tip,
	// 			discount: detail.attributes.discount,
	// 			status: detail.status,
	// 			BookingDetailId: detail._id,
	// 			_id: detail._id,
	// 		}));
	// 		return convertedData;
	// 	}
	// },
	async fetchBooking(data: any) {
		const response = await HttpService.doGetRequest("/bookings?from=" + data?.fromDate + "&to=" + data?.toDate, {});
		const res = parseCommonHttpResult(response);
		return res;
	},
	async deleteBookingCheckIn(id: string) {
		const response = await HttpService.doDeleteRequest("/check-in/" + id, {});
		const res = parseCommonHttpResult(response);
		return res;
	},
	async deleteBookingSoft(id: string) {
		const response = await HttpService.doPatchRequest("/bookings/" + id + "/soft-delete", {});
		const res = parseCommonHttpResult(response);
		return res;
	},
	async addBooking(data: any) {
		const response = await HttpService.doPostRequest("/bookings", data);
		const res = parseCommonHttpResult(response);
		return res;
	},
	async editBooking(data: any) {
		const response = await HttpService.doPatchRequest("/bookings/" + data._id, data);
		const res = parseCommonHttpResult(response);
		return res;
	},
	async transferBooking(data: any) {
		const req = { details: data.data };
		const response = await HttpService.doPatchRequest("/orders/" + data._id, req);
		const res = parseCommonHttpResult(response);
		return res;
	},
	async deleteBookingDetail(data: any) {
		const req = { details: data.data };
		const response = await HttpService.doPatchRequest("/orders/" + data._id, req);
		const res = parseCommonHttpResult(response);
		return res;
	},
};
