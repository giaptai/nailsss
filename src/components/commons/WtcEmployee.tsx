
import WtcAvatar from "./WtcAvartar"
import { Tooltip } from 'primereact/tooltip'
import { ProfileModel } from "../../models/category/Profile.model"
type WtcEmployeeProps={
   info:ProfileModel,
   className?:string,
   isManager?: boolean,
   bookingCount?: number,
   toolTips?: JSX.Element,
   onClick?:VoidFunction,
   base64Image?:boolean,
   height?:number,
   radius?:number
}
export default function WtcEmployee(props:WtcEmployeeProps){
    return <div className={`w-100 bg-white d-flex align-items-center p-2 ${props.className}`} style={{height:props.height ?? 64,borderRadius:props.radius ?? 10,cursor:"pointer"}} onClick={props.onClick}>
            <WtcAvatar name={props.info.firstName} className="me-2" base64={false} src={""}/>
            <div className="align-self-center">
                <div className="fw-bold one-line-ellipsis">{props.info.firstName}</div>
                <div className="text-secondary">{props.info.phone}</div>
            </div>
            <div className="flex-grow-1"><Tooltip target=".wtc-present-tooltip" /><Tooltip target=".wtc-absent-tooltip" /></div>
        </div>
}