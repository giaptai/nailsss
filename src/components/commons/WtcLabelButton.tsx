import { Avatar } from 'primereact/avatar';
import { Badge } from 'primereact/badge';
import { Ripple } from 'primereact/ripple';
import { Spinner } from 'react-bootstrap';
type WtcButtonProps = {
    className?: string
    label: string
    height?: number
    width?: number
    minWidth?: number
    icon?: string
    iconImage?: string
    base64Image?: boolean
    bagde?: number
    fontSize?: number
    onClick?: VoidFunction
    rightTools?: JSX.Element
    borderRadius?: number
    borderColor?: string
    loading?: boolean
    disabled?: boolean
    labelStyle?: any,
    ellipsis?:boolean
}
export default function WtcButtonLabel(props: WtcButtonProps) {
    return <div onClick={props.onClick} className={`me-button d-flex justify-content-left px-4 ${props.disabled ? 'disabled' : ''} ${props.className ?? 'bg-white'} p-ripple`} style={{ height: props.height ?? 56,width:props.width, minWidth: props.minWidth, borderRadius: props.borderRadius ?? 12, fontSize: props.fontSize ?? 20, fontWeight: 600, border: props.borderColor ? `1px solid ${props.borderColor}` : undefined, cursor: "pointer" }}>
        {props.loading && <div className='h-100 py-4'><Spinner className="text-white" /></div>}
        {!props.loading && <><div className='d-flex'>
            {props.icon ? <i className={`${props.label !== "" ? "me-2" : ""} align-self-center p-overlay-badge ${props.icon}`}
                style={{ fontSize: props.fontSize ? (props.fontSize + 4) : (props.height ? props.height / 1.6 : 24), fontWeight: 'normal' }}>
                {props.bagde && <Badge size={"normal"} value={props.bagde} severity="danger" style={{ fontSize: '0.5rem' }}></Badge>}
            </i>
                : props.iconImage && <>
                    {props.base64Image && <Avatar className="align-self-center me-2 primary-color fs-6" image={`data:image/jpeg;base64,${props.iconImage}`} shape="circle" />}
                    {!props.base64Image && <img src={props.iconImage} className={`${props.label !== "" ? "me-2" : ""} align-self-center p-overlay-badge`}>
                        {props.bagde && <Badge size={"normal"} value={props.bagde} severity="danger" style={{ fontSize: '0.5rem' }}></Badge>}
                    </img>}
                </>
            }
        </div>
            <div className="d-flex align-self-center"><span className={props.rightTools ? 'me-3' : ''} style={props.labelStyle}>{props.label}</span>{props.rightTools}</div>
        </>
        }
        <Ripple />
    </div>
}