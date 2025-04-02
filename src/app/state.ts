
export type requestStatus = 'idle' | 'loading' | 'completed' | 'failed'
export type TypePayment = 'bank' | 'cash' | 'gift'
export interface RequestState {
    status: requestStatus
    error?: string
    code?: string
    data?: any
    message?:string
}
export interface BussinessInfoState {
    city: string
    dbName: string
    email: string
    name: string
    phone:string
    state:string
    street1:string
    street2:string
    zipcode:string
}
export type paymentStatusValue = 'INPROCESSING' | 'PAID'
export const paymentStatus = {
    inprocessing:'INPROCESSING',
    paid:'PAID'
}


export const orderStatus = {
    waiting:'WAITING',
    inprocessing:'INPROCESSING',
    done:'DONE',
    paid:'PAID'
}

