type WtcAvatarProps={
    base64:boolean
    src:string
    name?:string
    className?:string
}
import { Avatar } from "primereact/avatar"
import { Image } from "primereact/image"
import { createShortName } from "../../utils/string.ultil"
export default function WtcAvatar(props:WtcAvatarProps){
    const imageType=props.src?["i","/"].includes(props.src.charAt(0))?"jpeg":"svg+xml":"name"
    return <>
        {imageType!=="name"&&<Image src={props.base64?`data:image/${imageType};base64,${props.src}`:props.src} className={`me-avatar ${props.className}`}/>}
        {imageType==="name"&&<Avatar label={props.name?createShortName(props.name):'M'} className={`bg-success mx-2 me-text-avatar ${props.className}`} size="normal" shape="circle" />}
    </>
}