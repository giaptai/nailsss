import IconButton from "./IconButton"

type WtcMenuItemProps = {
    icon: string
    iconTooltip?: string
    iconWidth?: number
    height?: number
    iconClassName?: string
    iconHeight?: number
    body?: JSX.Element
    button?: JSX.Element
    flexGrow1?: JSX.Element
    content?: JSX.Element
    onClick?: VoidFunction
    padding?: string
    disabled?:boolean

}
export default function WtcMenuItem(props: WtcMenuItemProps) {
    const handleClick = () =>{
        if(props.disabled!=true&&props.onClick)
        {
            props.onClick()
        }
    }
    return (
        <>
            <div className="menu-item-2 my-1 w-100 f-flex" onClick={handleClick} style={{height:props.height,alignItems:'center'}}>
                <div className='col-sm-12'>
                    <div className={`d-flex align-items-center ${props.padding ? props.padding : 'p-3'} my-1 ${props.disabled?'disabled':''}`} style={{placeContent:"center"}}>
                        <div className='d-flex align-items-center ' onClick={() => { }}>
                            <IconButton icon={props.icon} tooltip={props.iconTooltip} width={props.iconWidth || 35} height={props.iconHeight || 35} onClick={() => { }} actived={false} className={`${props.iconClassName}`} />
                            <div className="flex-grow-1 ps-1 fw-bold hide-button-size" style={{ color: "#30363F" }}>
                                {props.body && props.body}
                            </div>
                            
                        </div>
                        {props.flexGrow1&&<div className='flex-grow-1 ps-2 fw-bold' style={{ color: "#30363F" }}>{props.content??''}</div>}
                        {props.flexGrow1&&<div className="fw-bold">
                            {props.flexGrow1}
                        </div>}
                        {props.button &&<div>
                            { props.button}
                        </div>}
                    </div>
                </div>
            </div>
        </>
    )
}