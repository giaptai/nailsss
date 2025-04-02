interface InfoCardProps {
    title: string;
    value: any;
    
}

export default function WtcInfoItem(props: InfoCardProps) {
    return (
         (
            <div className={`col-sm-12 w-100 margin-bottom-1`}>
                <div style={{ borderRadius: 11, height: 33, border: '1px solid transparent' }}>
                    <div className={`d-flex w-100 h-100 index-key`} style={{ background: "#FCFCFD", borderRadius: 11, height: '100%', border: '1px solid #F1F3F6' }}>
                        <div className="ms-0 h-100 flex-grow-1" style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                            <div className="d-flex">
                                <div className="fs-value p-1 flex-grow-1">
                                    {props.title} - <span className="wtc-text-primary fw-bold">$ {props.value}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    );
}
