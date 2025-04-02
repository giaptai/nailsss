type BlockTableProps = {
    classBlock?: string,
    topLeft?: string,
    rightBottom?: string,
    middle?: string,
    middleClass?: string
}

export default function BlockTable(props: BlockTableProps) {
    return (
        <div className="turn-block" style={{}}>
            <div className={`block ${props.classBlock}`}>
                {props.topLeft && <span className='top-left'>{props.topLeft}</span>}
                {props.middle && <span className={`middle ${props.middleClass}`}>{props.middle}</span>}
                {props.rightBottom && <span className='right-bottom'>{props.rightBottom}</span>}
            </div>
        </div>

    )
}