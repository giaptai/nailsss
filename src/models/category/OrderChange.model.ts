import { ServiceModel } from "./Service.model";

interface ServiceByEmployee {
    service: ServiceModel;
}
interface ListDetails {
    action:string
    payload:payload
}
interface payload {
    _id:string
    employeeId: string;
    type:string
    attributes:ServiceByEmployee[]
}
export class OrderChangeModel {
    customerId?: string | undefined;
    transDate: string;
    details:ListDetails[]|undefined;
    totalMoney: number;
    constructor(
        customerId: string | undefined,
        details: ListDetails[]|undefined,
        transDate: string,
        totalMoney: number,
    ) {
        this.customerId = customerId;
        this.transDate = transDate;
        this.details = details;
        this.totalMoney = totalMoney;
    }

    static initial(): OrderChangeModel {
        return new OrderChangeModel(
            undefined,
            // null,
            undefined,
            '',
            0,
        );
    }
}
