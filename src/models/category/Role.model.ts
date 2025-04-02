import { AbilityModel } from "./Ability.model";
import { CategoryBaseModel } from "./base.model";
export class RoleModel extends CategoryBaseModel {
    abilities: AbilityModel[]
    status: any
    note: string
    constructor(_id: string, code: string, name: string, abilities: any[], status: any, note: string) {
        super(_id, code, name)
        this.abilities = abilities,
            this.status = status,
            this.note = note
    }
    static initial() {
        return {
            _id: '',
            code: '',
            name: '',
            abilities: [],
            status: false,
            note: ''
        }
    }
}