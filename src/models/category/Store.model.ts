import { CustomerModel } from "./Customer.model";
import { CategoryBaseModel } from "./base.model";
export type hostConfig = {
    apiUrl: string
    dbName: string
}

export class StoreModel extends CategoryBaseModel {
    status: any
    street1: string
    street2: string
    city: string
    state: string
    zipcode: string
    phone: string
    email: string
    config: hostConfig
    customer: CustomerModel
    constructor(_id: string, code: string, name: string, status: any, street1: string, street2: string, city: string, state: string, zipcode: string,
        phone: string, email: string, config: hostConfig, customer: CustomerModel) {
        super(_id, code, name)
        this.status = status
        this.street1 = street1
        this.street2 = street2
        this.city = city
        this.state = state
        this.zipcode = zipcode
        this.phone = phone
        this.email = email
        this.config = config
        this.customer = customer
    }
    static initial() {
        return {
            _id: '',
            code: '',
            name: '',
            status: false,
            street1: '',
            street2: '',
            city: '',
            state: '',
            zipcode: '',
            phone: '',
            email: '',
            config: {
                apiUrl: '',
                dbName: ''
            },
            customer: CustomerModel.initial()
        }
    }
}
