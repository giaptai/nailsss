export class AbilityFieldModel {
    _id: string
    key: string
    action: string[]
    constructor(_id: string, key: string, action: string[]) {
        this._id = _id
        this.key = key
        this.action = action
    }
    static fromJson(json: any) {
        return new AbilityFieldModel(json?._id, json?.key, json?.action)
    }
}