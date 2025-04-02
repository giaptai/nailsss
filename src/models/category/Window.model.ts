export class WindowModel {
    _id: string
    name:string
    code:string
    type:string
    status:any
    constructor(_id: string, name: string,code: string, type: string,status:any) {
        this._id=_id,
        this.name = name,
        this.code = code,
        this.type = type,
        this.status = status

        
    }
    static initial() {
        return {
            _id: '',
            name: '',
            code: '',
            type: '',
            status:false
        }
    }
}