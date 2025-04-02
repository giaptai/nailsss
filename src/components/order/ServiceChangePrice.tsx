import { t } from "i18next"
import { ServiceModel } from "../../models/category/Service.model"
import { toFixedRefactor, toLocaleStringRefactor } from "../../utils/string.ultil"
import { useAppSelector } from "../../app/hooks"
type OrderItemProps = {
    data: any
    index: number
    reward?: boolean
    readonly?: boolean
    turn?: boolean
    selected?: boolean
    onClickRemove: VoidFunction
    percentWidth?: string
    updateData?: (newData: ServiceModel) => void;
    onClick?: (item: ServiceModel) => void;
    isOutSide?: boolean
}
export default function ServiceChangePrice(props: OrderItemProps) {
    const storeconfigState = useAppSelector(state => state.storeconfig)
    const getTaxRate = (data: any): number => {
        const taxRateInfo = data.find((item: any) => item.key === "taxRate");
        return taxRateInfo ? Number(taxRateInfo.value) : 0;
    };
    const taxrate = getTaxRate(storeconfigState.list)
    const discount = 0
    const handleClick = (_e: React.MouseEvent) => {
        if (props.onClick) {
            props.onClick(props.data);
        }
    };
    return <div className={`w-100 mb-1 ${props.selected && 'my-border-full'} my-border-left d-flex pb-2 pt-1 px-1 me-order-product ${props.data?.active && !props.readonly ? "active" : ""}`} style={{ fontSize: 18, cursor: "pointer" }} >
        <div className="w-100 flex-grow-1" onClick={props.readonly ? () => { } : () => {
        }}>
            <div className="d-flex w-100 align-items-center" onClick={handleClick}>
                <div className="flex-grow-1">
                    <div className="two-line-ellipsis" style={{ fontWeight: 800, color: "#242B35" }}>{props.data?.displayName}
                    </div>
                    <div className="d-flex pt-1" style={{ fontSize: 17, fontWeight: 500 }}>
                        <span className="me-1" style={{ color: "#5B6B86" }}>{props.data?.unit} x</span>
                        {discount > 0 ? <span className="fw-bold me-1 wtc-text-primary">$ {toLocaleStringRefactor(toFixedRefactor(Number(props.data?.storePrice) * (1 - discount / 100), 2))}</span> : <span className="fw-bold me-1 wtc-text-primary">$ {toLocaleStringRefactor(toFixedRefactor(Number(props.data?.storePrice), 3))}</span>}
                        <span style={{ color: "#5B6B86" }}>/Units</span>
                    </div>
                    <div className="d-flex pt-1" style={{ fontSize: 17, fontWeight: 500 }}>
                        {<span className="me-1">{t('tax')}&ensp;<span className="wtc-text-primary fw-bold">$ {toLocaleStringRefactor(toFixedRefactor(Number(props.data?.tax==='YES'?props.data.storePrice*(taxrate/100):0), 2))}</span></span>}
                    </div>
                </div>
                <div className=" px-2" style={{ fontWeight: 600 }}>
                    <div className={"text-danger fs-4"}>$ {toLocaleStringRefactor(toFixedRefactor(Number(props.data?.storePrice * props.data?.unit), 2))}</div>
                </div>
            </div>
        </div>
    </div>
}