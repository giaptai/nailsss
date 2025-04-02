// import { t } from "i18next";
// import WtcCard from "../../components/commons/WtcCard";
// import WtcSearchInput from "../../components/commons/WtcSearchText";
// import WtcSortButton from "../../components/commons/WtcSortButton";
// import WtcAddButton from "../../components/commons/WtcAddButton";
// import { useAppDispatch, useAppSelector } from "../../app/hooks";
// import { useNavigate } from "react-router-dom";
// import useWindowSize from "../../app/screen";
// import WtcEmptyBox from "../../components/commons/WtcEmptyBox";
// import { useEffect, useState } from "react";
// import { Paginator } from "primereact/paginator";
// import DynamicDialog, { DialogMode } from "../../components/DynamicDialog";
// import WtcItemCard from "../../components/commons/WtcItemCard";
// import { itemListStyle, itemsLineSpacing } from "../../components/Theme";
// import { FormikErrors, useFormik } from "formik";
// import emailIcon from '../../assets/svg/mail.svg'
// import userIcon from '../../assets/svg/user.svg'
// import phoneIcon from '../../assets/svg/phone.svg'
// import WtcInputIconText from "../../components/commons/WtcInputIconText";
// import WtcDropdownIconText from "../../components/commons/WtcDropdownIconText";
// import { addPartner, fetchPartners, filterSearch, resetActionState, selectItem } from "../../slices/partner.slice";
// import { PartnerModel } from "../../models/category/Partner.model";
// import { completed, failed, processing } from "../../utils/alert.util";
// export default function Partners() {
//     const dispatch = useAppDispatch()
//     const navigate = useNavigate()
//     const screenSize = useWindowSize()
//     const partnerState = useAppSelector(state => state.partner)
//     const [dialogMode, setDialogMode] = useState<DialogMode>('view')
//     const [selectedId, setSelectedId] = useState('')
//     const [dialogVisible, setDialogVisible] = useState(false)
//     const [first, setFirst] = useState(0)
//     const [rows, setRows] = useState(10)
//     const isPhone = screenSize.width < 600
//     const onPageChange = (event: any) => {
//         //console.log(event)
//         setFirst(event.first);
//         setRows(event.rows);
//         // setTotalPages(event.pageCount);
//         // setPage(event.page+1);
//     };
//     const formikPartner = useFormik<any>({
//         initialValues: PartnerModel.initial(),
//         validate: (data) => {
//             let errors: FormikErrors<PartnerModel> = {};
//             if (!data.lastName) {
//                 errors.lastName = 'y'
//             }
//             if (!data.firstName) {
//                 errors.firstName = 'y'
//             }
//             if (!data.phone) {
//                 errors.phone = 'y'
//             }
//             if (!data.address) {
//                 errors.address = 'y'
//             }
//             return errors;
//         },
//         onSubmit: (data) => {

//             const submitData = {
//                 "firstName": data.firstName,
//                 "lastName": data.lastName,
//                 "middleName": data.middleName === "" ? null : data.middleName,
//                 "phone": data.phone,
//                 "address": data.address,
//                 "email": data.email === "" ? null : data.email,
//                 "gender": data.gender
//             }
//             //console.log(submitData)
//             dispatch(addPartner(submitData))
//         }
//     });

//     const closeDialog = (formik: any) => {
//         setDialogVisible(false)
//         formik.resetForm()
//     }
//     useEffect(() => {
//         if (partnerState.actionState) {
//             switch (partnerState.actionState.status!) {
//                 case "completed":
//                     completed()
//                     dispatch(resetActionState())
//                     dispatch(fetchPartners())
//                     closeDialog(formikPartner)
//                     break;
//                 case "loading":
//                     processing()
//                     break;
//                 case "failed":
//                     failed(t(partnerState.actionState.error!))
//                     dispatch(resetActionState())
//                     break;
//             }
//         }

//     }, [partnerState.actionState])
//     useEffect(() => {
//         dispatch(fetchPartners())
//     }, [])
//     return <>
//         <WtcCard
//             title={<div className="font-title-card wtc-bg-title p-3 rounded-3 d-flex align-items-center w-100">
//                 <i className="ri-list-check text-blue" style={{ fontSize: 26 }} />
//                 <div className="flex-grow-1 mx-2">{t("Partners")}</div>
//                 <div className="flex-grow-1 mx-2" style={{ maxWidth: 400 }}>
//                     <WtcSearchInput placeholder={`${t("Search")} ${t("Partners").toLowerCase()}...`} onChanged={(text) => { dispatch(filterSearch(text)) }} />
//                 </div>
//                 <WtcSortButton label={t('Sort')} onClick={() => { }} />
//                 <div className="ms-2">
//                     <WtcAddButton target='PARTNER' action='INS' label={t("action.add")} onClick={() => { setDialogMode('add'); setDialogVisible(true) }} />
//                 </div>
//             </div>}
//             hideBorder={true}
//             body={<div className="d-flex flex-column h-100">
//                 <div className="flex-grow-1" style={{ maxHeight: screenSize.height - 290, overflowX: "hidden", overflowY: "auto" }}>
//                     {!partnerState.filtered || partnerState?.filtered.length == 0 ?
//                         <div className="w-100 h-100 d-flex flex-column justify-content-center"> <WtcEmptyBox /></div> :
//                         partnerState?.filtered.map((item) => {
//                             return <div className="w-100" key={"partner-" + item._id}>
//                                 <WtcItemCard
//                                     verticalSpacing={itemsLineSpacing} selected={item._id === selectedId}
//                                     onClick={() => setSelectedId(item._id)}
//                                     onDbClick={() => {
//                                         dispatch(selectItem(item))
//                                         navigate('/partner-item')
//                                     }}
//                                     body={<div className="row align-items-center p-3">
//                                         <div className="col-sm-2">
//                                             <div style={itemListStyle}>{item.code}</div>
//                                         </div>
//                                         <div className="col-sm-2">
//                                             <div style={itemListStyle}>{`${item.lastName} ${item.middleName ?? ''} ${item.firstName}`}</div>
//                                         </div>
//                                         <div className="col-sm-2">
//                                             <div style={itemListStyle}>{item.phone}</div>
//                                         </div>
//                                         <div className="col-sm-2">
//                                             <div style={itemListStyle}>{item.address}</div>
//                                         </div>
//                                         <div className="col-sm-2">
//                                             <div style={itemListStyle}>{item.email}</div>
//                                         </div>
//                                     </div>
//                                     } />
//                             </div>
//                         })}
//                 </div>

//                 <div>
//                     {isPhone ?
//                         <Paginator
//                             first={first}
//                             rows={rows}
//                             totalRecords={partnerState?.filtered?.length}
//                             rowsPerPageOptions={[5, 10, 15, 20]}
//                             onPageChange={onPageChange}
//                             template={{ layout: 'PrevPageLink CuryrentPageReport NextPageLink' }}
//                             currentPageReportTemplate={` ${1}/${10}`} /> :
//                         <Paginator
//                             first={first}
//                             rows={rows}
//                             totalRecords={partnerState?.filtered?.length}
//                             rowsPerPageOptions={[5, 10, 15, 20]}
//                             onPageChange={onPageChange} />}
//                 </div>

//             </div>}
//             className="h-100"
//         />
//         <DynamicDialog
//             width={isPhone ? '90vw' : '75vw'}
//             minHeight={"75vh"}
//             visible={dialogVisible}
//             mode={dialogMode}
//             position={'center'}
//             title={t('Partner')}
//             okText={t("Submit")}
//             cancelText={t("Cancel")}
//             onEnter={
//                 formikPartner.handleSubmit
//             }
//             draggable={false}
//             resizeable={false}
//             onClose={() => closeDialog(formikPartner)}
//             body={<div className="pt-3">
//                 <div className="row">
//                     <div className="col-sm-6">
//                         <WtcInputIconText placeHolder={t("Last Name")} required leadingIconImage={userIcon} field="lastName" formik={formikPartner} value={formikPartner.values.lastName} />
//                     </div>
//                     <div className="col-sm-6">
//                         <WtcInputIconText placeHolder={t("Middle Name")} leadingIconImage={userIcon} field="middlemame" formik={formikPartner} value={formikPartner.values.middleName} />
//                     </div>
//                 </div>
//                 <div className="row mt-3">
//                     <div className="col-sm-12">
//                         <WtcInputIconText placeHolder={t("First Name")} required leadingIconImage={userIcon} field="firstName" formik={formikPartner} value={formikPartner.values.firstName} />
//                     </div>

//                 </div>
//                 <div className="row mt-3">
//                     <div className="col-sm-6">
//                         <WtcInputIconText placeHolder={t("Phone")} required leadingIconImage={phoneIcon} field="phone" formik={formikPartner} value={formikPartner.values.phone} />
//                     </div>
//                     <div className="col-sm-6">
//                         <WtcDropdownIconText filtler={false} disabled={false} placeHolder={t("Gender")} leadingIconImage={userIcon}
//                             options={[{ label: t("Male"), value: 'MALE' }, { label: t("Female"), value: 'FEMALE' }]}
//                             field="gender" formik={formikPartner} value={formikPartner.values.gender} />
//                     </div>
//                 </div>
//                 <div className="row mt-3">
//                     <div className="col-md-12">
//                         <WtcInputIconText placeHolder="Email" leadingIconImage={emailIcon} field="email" formik={formikPartner} value={formikPartner.values.email} />
//                     </div>
//                 </div>
//                 <div className="row mt-3">
//                     <div className="col-md-12">
//                         <WtcInputIconText placeHolder={t("Address")} required leadingIcon={"ri-home-4-fill"} field="address" formik={formikPartner} value={formikPartner.values.address} />
//                     </div>
//                 </div>
//             </div>}
//             closeIcon />
//     </>
// }