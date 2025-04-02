// import { itemListStyle, itemsLineSpacing } from "../../components/Theme";
// import WtcItemCard from "../../components/commons/WtcItemCard";
// import { CustomerModel } from "../../models/category/Customer.model";
// import logo from "../../assets/images/logo.png"
// export type StoreModelViewProps = {
//     item: CustomerModel
//     selected: boolean
//     onClick: () => void
//     onDbClick: () => void
// }
// export default function CustomerModelView(props: StoreModelViewProps) {
//     return <WtcItemCard
//         verticalSpacing={itemsLineSpacing} selected={props.selected}
//         onClick={props.onClick}
//         onDbClick={props.onDbClick}
//         body={<div className="row align-items-center">

//             <div className="col-sm-2">
//                 <div className="d-flex align-items-center">
//                     <img src={logo} className="rounded" style={{ width: '60px', height: '60px', marginRight: 10, objectFit: "contain" }} />
//                     <div style={itemListStyle}>{props.item.code}</div>
//                 </div>
//             </div>
//             <div className="col-sm-2">
//                 <div style={itemListStyle}>{`${props.item.lastName} ${props.item.middleName} ${props.item.firstName}`}</div>
//             </div>
//             <div className="col-sm-2">
//                 <div style={itemListStyle}>{props.item.phone}</div>
//             </div>
//             <div className="col-sm-2">
//                 <div style={itemListStyle}>{props.item.address}</div>
//             </div>
//             <div className="col-sm-2">
//                 <div style={itemListStyle}>{props.item.email}</div>
//             </div>
//         </div>
//         } />
// } 