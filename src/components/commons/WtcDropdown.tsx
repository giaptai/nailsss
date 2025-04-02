
import { Dropdown } from "primereact/dropdown"
type WtcDropdownProps={
    options:any[]
    value:any
    className?:string
}
export default function WtcDropdown(props:WtcDropdownProps){
    return <Dropdown
    options={props.options}
    value={props.value}
    className={props.className}
    style={{fontSize:16}}
/>
}