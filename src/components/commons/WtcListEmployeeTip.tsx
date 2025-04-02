import { ListServiceSelectedModel } from "../../models/category/ListServiceSelected.model";
import { toFixedRefactor, toLocaleStringRefactor } from "../../utils/string.ultil";
type ListServiceSelected = {
    item:ListServiceSelectedModel
    selected:boolean
    onClick:VoidFunction
}
export default function WtcListEmployeeTip(props: ListServiceSelected) {
    const ListItem = props.item
    return <>
        <div className={`w-100 mb-1 ${props.selected?'border-active':'my-border-left'}  d-flex p-1 py-2 me-order-product`} style={{ fontSize: 18, cursor: "pointer",borderRadius:12 }} onClick={props.onClick}>
            <div className="w-100 flex-grow-1">
                <div className="d-flex w-100 align-items-center">
                    <div className="flex-grow-1">
                        <div className="two-line-ellipsis fs-value" style={{ fontWeight: 500, color: "#242B35" }}>{ListItem.Employee?.profile.firstName} {ListItem.Employee?.profile.lastName}
                        </div>
                    </div>
                    <div className=" px-2" style={{ fontWeight: 600 }}>
                        <div className={"wtc-text-primary fs-title"}>$ {toLocaleStringRefactor(toFixedRefactor(Number(ListItem.tip||0), 2))}</div>
                    </div>
                </div>
            </div>
        </div>
    </>
}