import { t } from "i18next";
import IconButton from "./commons/IconButton";

type StatusProps = {
    inactive: boolean
    className?:string
    width?:number
    height?:number
}
export default function StatusItemList(props: StatusProps) {
    return <IconButton icon={props.inactive ? 'ri-close-line fs-icon-action' : 'ri-check-double-line fs-icon-action'} tooltip={props.inactive ? t('deleted') : t('active')} width={props.width||40} height={props.height||40} onClick={() => { }} actived={false} className={`${props.className}  ${props.inactive ? 'custom-danger-button' : 'custom-primary-button'}`} />

}