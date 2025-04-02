abstract class CategoryBaseModel {
    _id: string
    code: string
    name: string
    constructor(_id: string, code: string, name: string) {
        this._id = _id
        this.code = code
        this.name = name
    }
}
export { CategoryBaseModel }