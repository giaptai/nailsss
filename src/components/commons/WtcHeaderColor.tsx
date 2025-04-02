type PropsColor = {
    color: string
    height?: number
    width?: number
    onclick?: VoidFunction
    className?: string
}
export default function WtcHeaderColor(props: PropsColor) {
    return <div className={props.className} onClick={props.onclick}>
        <div style={{ borderRadius: 16, height: props.height || 8, width: props.width || 50, backgroundColor: props.color }}></div>
    </div>
}