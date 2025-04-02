export class AbilityPermissionModel {
    _id: string
    code: string
    name: string
    action: string[]
    constructor(_id: string, code: string, name: string, action: string[]) {
        this._id = _id
        this.code = code
        this.name = name
        this.action = action
    }
    static fromJson(json: any) {
        return new AbilityPermissionModel(json?._id, json?.code, json?.name, json?.action)
    }
}