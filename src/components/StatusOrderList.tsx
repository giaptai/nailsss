import { t } from "i18next";
import IconButton from "./commons/IconButton";

type StatusProps = {
    final: boolean
    className?:string
    width?:number
    height?:number
}
export default function StatusOrderlist(props: StatusProps) {
    return <IconButton icon={props.final ? 'ri-check-line' : 'ri-loader-2-line'} tooltip={props.final ? t('status_final') : t('status_processing')} width={props.width||48} height={props.height||48} onClick={() => { }} actived={false} className={`${props.className}  ${props.final ? 'custom-final-button' : 'custom-processing-button'}`} />

}