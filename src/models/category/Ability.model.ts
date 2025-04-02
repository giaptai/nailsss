import { AbilityFieldModel } from "./AbilityField.model"
import { AbilityPermissionModel } from "./AbilityPermission.model"

export class AbilityModel {
    _id: string
    permission: AbilityPermissionModel
    fields: AbilityFieldModel[]
    constructor(_id: string, permission: AbilityPermissionModel, field: any[]) {
        this._id = _id
        this.permission = permission
        this.fields = field
    }
    static initial() {
        return {
            _id: '',
            permission: [],
            fields: []
        }
    }
    static fromJson(json: any) {
        const fields: AbilityFieldModel[] = []
        json?.fields?.forEach((field: any) => {
            fields.push(AbilityFieldModel.fromJson(field))
        })
        return new AbilityModel(json?._id, AbilityPermissionModel.fromJson(json?.permission), fields)
    }
}