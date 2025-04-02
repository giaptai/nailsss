import { CategoryBaseModel } from "./base.model";
export class PermissionModel extends CategoryBaseModel {
    action: string[]
    field: string[]
    constructor(_id: string, code: string, name: string, action: string[], field: string[]) {
        super(_id, code, name)
        this.action = action
        this.field = field
    }
    static initial() {
        return {
            _id: '',
            code: '',
            name: '',
            action: [],
            field: []
        }
    }
}