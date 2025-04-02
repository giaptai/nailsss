export class MenuModel {
    _id: string
    name:string
    code:string
    color:string
    status:any
    constructor(_id: string, name: string,code: string,color: string,status:any) {
        this._id=_id,
        this.name = name,
        this.code = code,
        this.color=color,
        this.status = status
    }
    static initial() {
        return {
            _id: '',
            name: '',
            code: '',
            color: '#283673',
            status:false
        }
    }
}