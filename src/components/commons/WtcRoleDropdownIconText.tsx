import { useAppSelector } from "../../app/hooks"
import { RoleService } from "../../services/Role.service"
import WtcDropdownIconText from "./WtcDropdownIconText"

type WtcRoleDropdownIconTextProps = {
    options: any[]
    value: any
    placeHolder?: string
    leadingIconImage?: any
    leadingIcon?: string
    field?: string
    optionLabel?: string
    optionValue?: string
    formik?: any
    multiSelect?: boolean
    disabled?: boolean,
    filtler?: boolean,
    inputHeight?: number
    onMultiChange?: (values: any) => void
    onChange?: (value: any) => void
    required?: boolean
    target: string
    code: string
    action: string
    tabIndex?:number
}
export default function WtcRoleDropdownIconText(props: WtcRoleDropdownIconTextProps) {
    const role = useAppSelector(state => state.auth.role)
    const disabled = props.disabled || !RoleService.isAllowAction(role, props.target, props.action)
    return <WtcDropdownIconText tabIndex={props.tabIndex} options={props.options} value={props.value} placeHolder={props.placeHolder} leadingIcon={props.leadingIcon}
        leadingIconImage={props.leadingIconImage} field={props.field} optionLabel={props.optionLabel} optionValue={props.optionValue}
        formik={props.formik} multiSelect={props.multiSelect} disabled={disabled} hide={!RoleService.isAllowField(role, props.target, props.code, props.action)} filtler={props.filtler} inputHeight={props.inputHeight} onMultiChange={props.onMultiChange}
        onChange={props.onChange} required={props.required}
    />
}