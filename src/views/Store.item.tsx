// import { useAppSelector } from "../app/hooks"
// import WtcCard from "../components/commons/WtcCard"
// import { PartnerModel } from "../models/category/Partner.model"
// import WtcInputIconText from "../components/commons/WtcInputIconText"
// import userIcon from '../assets/svg/user.svg'
// export default function StoreItem() {
//     const item = useAppSelector(state => state.partner.item) as PartnerModel

//     return (
//         <>
//             <div className="p-3 wtc-bg-white rounded-4">
//                 <div className="row">
//                     <div className="col-sm-3">
//                         <WtcCard title={<><i className="ri-file-list-line text-blue" style={{ fontSize: 26 }} /> Thông tin cửa hàng</>} background="#EEF1F9" hideBorder={true}
//                             body={<>
//                                 <div className="mt-2">
//                                     <WtcInputIconText placeHolder="Tên" leadingIconImage={userIcon} value={item?.name} />
//                                 </div>
//                                 <div className="mt-2">
//                                     <WtcInputIconText placeHolder="Địa chỉ" leadingIconImage={userIcon} value={item?.address} />
//                                 </div>
//                             </>}
//                         />
//                     </div>
//                 </div>
//             </div >
//             \
//         </>
//     )
// }