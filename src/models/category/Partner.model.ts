import { CategoryBaseModel } from "./base.model";
export class PartnerModel extends CategoryBaseModel {
    firstName: string
    lastName: string
    middleName: string
    phone: string
    address: string
    email: string
    gender: string
    status: any
    constructor(_id: string, code: string, firstName: string, lastName: string, middleName: string,
        phone: string, address: string, email: string, gender: string, status: any) {
        super(_id, code, '')
        this.firstName = firstName
        this.lastName = lastName
        this.middleName = middleName
        this.phone = phone
        this.address = address
        this.email = email
        this.gender = gender
        this.status = status
    }
    static initial() {
        return {
            _id: '',
            code: '',
            firstName: '',
            lastName: '',
            middleName: '',
            phone: '',
            address: '',
            email: '',
            gender: 'MALE',
            status: false
        }
    }
}