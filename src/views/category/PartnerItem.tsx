// import { useAppDispatch, useAppSelector } from "../../app/hooks"
// import WtcCard from "../../components/commons/WtcCard"
// import { PartnerModel } from "../../models/category/Partner.model"
// import WtcAddButton from "../../components/commons/WtcAddButton"
// import userIcon from '../../assets/svg/user.svg'
// import emailIcon from '../../assets/svg/mail.svg'
// import phoneIcon from '../../assets/svg/phone.svg'
// import { useEffect, useState } from "react"
// import DynamicDialog, { DialogMode } from "../../components/DynamicDialog"
// import { FormikErrors, useFormik } from "formik"
// import { t } from "i18next"
// import WtcButton from "../../components/commons/WtcButton"
// import { fetchStores, resetActionState, updatePartner } from "../../slices/partner.slice"
// import { completed, failed, processing } from "../../utils/alert.util"
// import WtcEmptyBox from "../../components/commons/WtcEmptyBox"
// import useWindowSize from "../../app/screen"
// import { useNavigate } from "react-router-dom"
// import { StoreModel } from "../../models/category/Store.model"
// import { addStore, deleteStore, resetActionState as resetStoreActionState, restoreStore, updateStore } from "../../slices/stores.slice"
// import WtcItemCard from "../../components/commons/WtcItemCard"
// import { itemListStyle, itemsLineSpacing } from "../../components/Theme"
// import LoadingIndicator from "../../components/Loading"
// import WtcRoleButton from "../../components/commons/WtcRoleButton"
// import WtcRoleInputIconText from "../../components/commons/WtcRoleInputIconText"
// import WtcRoleDropdownIconText from "../../components/commons/WtcRoleDropdownIconText"

// export default function PartnerItem() {
//     const dispatch = useAppDispatch()
//     const navigate = useNavigate()
//     const partnerState = useAppSelector(state => state.partner)
//     const storeState = useAppSelector(state => state.store)
//     const [dialogVisible, setDialogVisible] = useState(false)
//     const [storeMode, setStoreMode] = useState<DialogMode>('view')
//     const [selectedId, setSelectedId] = useState('')
//     const screenSize = useWindowSize()
//     const isPhone = screenSize.width < 600
//     const formikPartner = useFormik<any>({
//         initialValues: partnerState.item,
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
//                 _id: data._id,
//                 data: {
//                     "firstName": data.firstName,
//                     "lastName": data.lastName,
//                     "middleName": data.middleName === "" ? null : data.middleName,
//                     "phone": data.phone,
//                     "address": data.address,
//                     "email": data.email === "" ? null : data.email,
//                     "gender": data.gender
//                 }
//             }
//             dispatch(updatePartner(submitData))
//         }
//     });
//     const formikStore = useFormik<any>({
//         initialValues: { ...StoreModel.initial(), 'config.apiUrl': '', 'config.dbName': '' },
//         validate: (data) => {
//             let errors: FormikErrors<any> = {};
//             if (!data.name) {
//                 errors.name = 'y'
//             }
//             if (!data.address) {
//                 errors.address = 'y'
//             }
//             if (!data.config.apiUrl) {
//                 errors['config.apiUrl'] = 'y'
//             }
//             if (!data.config.dbName) {
//                 errors['config.dbName'] = 'y'
//             }
//             return errors;
//         },
//         onSubmit: (data) => {
//             switch (storeMode) {
//                 case "add":
//                     const addData = { ...data, ...{ partnerId: partnerState.item?._id } }
//                     dispatch(addStore(addData))
//                     break;
//                 case "edit":
//                     const editData = {
//                         _id: data._id,
//                         data: {
//                             name: data.name,
//                             address: data.address,
//                             config: data.config
//                         }
//                     }
//                     dispatch(updateStore(editData))
//                     break;
//                 case "restore":
//                     dispatch(restoreStore(data._id))
//                     break;
//             }

//         }
//     });
//     const handleDeleteStore = (id: string) => {
//         dispatch(deleteStore(id))
//     }
//     const closeDialog = () => {
//         formikStore.resetForm()
//         setDialogVisible(false)
//     }
//     useEffect(() => {
//         dispatch(fetchStores(partnerState.item?._id))
//     }, [partnerState.item?._id])
//     useEffect(() => {
//         if (storeState.actionState) {
//             switch (storeState.actionState.status) {
//                 case "completed":
//                     completed()
//                     dispatch(resetStoreActionState())
//                     dispatch(fetchStores(partnerState.item?._id))
//                     closeDialog()
//                     break;
//                 case "loading":
//                     processing()
//                     break;
//                 case "failed":
//                     failed(t(storeState.actionState.error!))
//                     dispatch(resetStoreActionState())
//                     break;
//             }
//         }
//     }, [storeState.actionState])
//     useEffect(() => {
//         if (partnerState.actionState) {
//             switch (partnerState.actionState.status) {
//                 case "completed":
//                     completed()
//                     dispatch(resetActionState())
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
//     return (
//         <>
//             <div className="p-3 wtc-bg-white rounded-4 h-100">
//                 <div className="row h-100">
//                     <div className="col-sm-8">
//                         {storeState.fetchState.status == 'loading' ? <LoadingIndicator /> : <>
//                             <div className="font-title-card wtc-bg-title p-3 rounded-4 d-flex align-items-center w-100">
//                                 <i className="ri-list-check text-blue" style={{ fontSize: 26 }} />
//                                 <div className="flex-grow-1 mx-2"> {t("Stores")}</div>

//                                 <div className="ms-2">
//                                     <WtcAddButton target='PARTNER' action='INS' label={t("Add")} onClick={() => { setStoreMode('add'); setDialogVisible(true) }} />
//                                 </div>
//                             </div>
//                             <div className="row mt-3">
//                                 {partnerState.stores.length > 0 ?
//                                     partnerState.stores.map((item) => {
//                                         const isInActive = item?.status?.value == 'INACTIVE'
//                                         return <div className="w-100" key={"store-" + item._id}>
//                                             <WtcItemCard
//                                                 verticalSpacing={itemsLineSpacing} selected={item._id === selectedId}
//                                                 onClick={() => setSelectedId(item._id)}
//                                                 onDbClick={() => {

//                                                     if (item.status.code === "ACTIVE") [
//                                                         setStoreMode('edit')
//                                                     ]
//                                                     else {
//                                                         setStoreMode('restore')
//                                                     }
//                                                     formikStore.setValues({ ...item, 'config.apiUrl': item.config?.apiUrl, 'config.dbName': item.config?.dbName })
//                                                     setDialogVisible(true)
//                                                 }}
//                                                 body={
//                                                     <div className="p-3" style={{ position: 'relative' }}>
//                                                         <div className="fw-bold" style={itemListStyle}>{item.code}</div>
//                                                         <div className="row align-items-center">
//                                                             <div className="col-sm-3">
//                                                                 <div style={itemListStyle}>{item.name}</div>
//                                                             </div>
//                                                             <div className="col-sm-9 text-truncate">
//                                                                 <div style={itemListStyle}>{item.address}</div>
//                                                             </div>

//                                                             {<div style={{ position: 'absolute', right: 0, top: 8, textAlign: 'right' }}>
//                                                                 {isInActive && <div className='text-danger'><i className="ri-close-line fw-bold" />
//                                                                     <span className="font-status text-status-active"> INACTIVE</span></div>}
//                                                                 {!isInActive && <div className='icon-status-active'><i className="ri-check-double-line fw-bold" />
//                                                                     <span className="font-status text-status-active"> ACTIVE</span></div>}
//                                                             </div>}
//                                                         </div>
//                                                         <div style={itemListStyle}>{`[`}<span className="text-secondary" style={{ fontSize: 15 }}>Api url:</span> {item.config.apiUrl}, <span className="text-secondary" style={{ fontSize: 15 }}>Db:</span> {item.config.dbName}{`]`}</div>
//                                                     </div>
//                                                 } />
//                                         </div>
//                                     })
//                                     : <div className="w-100 h-100 d-flex flex-column justify-content-center"> <WtcEmptyBox /></div>
//                                 }
//                             </div>
//                         </>}
//                     </div>
//                     <div className="col-sm-4 h-100">
//                         <WtcCard

//                             title={<div className="d-flex justify-content-between align-items-center">
//                                 <div className="one-line-ellipsis"><i className="ri-file-list-line text-blue" style={{ fontSize: 26 }} /> {t("Partner's Infos")} </div>
//                                 <div className="d-flex">
//                                     <WtcButton label={t("Back")} className="bg-white text-blue me-2" borderColor="#283673" height={45} fontSize={16} onClick={() => navigate("/partners")} />
//                                     {/* <WtcButton label={t("Delete")} icon="ri-delete-bin-5-line fs-5" className="bg-white text-danger me-1" borderColor="red" height={45} fontSize={16} onClick={formikPartner.handleSubmit}/> */}
//                                     <WtcRoleButton target="PARTNER" action="UPD" label={t("Update")} icon="ri-edit-fill fs-5" className="wtc-bg-primary text-white" height={45} fontSize={16} onClick={formikPartner.handleSubmit} />
//                                 </div>

//                             </div>
//                             }
//                             background="#EEF1F9"
//                             hideBorder={true}
//                             body={<div className="h-100">
//                                 <div className="mt-2">
//                                     <WtcRoleInputIconText target="PARTNER" code="code" action="UPD" placeHolder={t("Code")} readonly leadingIconImage={userIcon} field="code" formik={formikPartner} value={formikPartner.values.code} />
//                                 </div>
//                                 <div className="mt-2">
//                                     <WtcRoleInputIconText target='PARTNER' code='lastName' action="UPD" placeHolder={t("Last Name")} required leadingIconImage={userIcon} field="lastName" formik={formikPartner} value={formikPartner.values.lastName} />
//                                 </div>
//                                 <div className="mt-2">
//                                     <WtcRoleInputIconText target='middleName' code='phone' action="UPD" placeHolder={t("Middle Name")} leadingIconImage={userIcon} field="middleName" formik={formikPartner} value={formikPartner.values.middleName} />
//                                 </div>
//                                 <div className="mt-2">
//                                     <WtcRoleInputIconText target='PARTNER' code='firstName' action="UPD" placeHolder={t("First Name")} required leadingIconImage={userIcon} field="firstName" formik={formikPartner} value={formikPartner.values.firstName} />
//                                 </div>
//                                 <div className="mt-2">
//                                     <WtcRoleDropdownIconText target='PARTNER' code='gender' action="UPD" filtler={false} disabled={false} placeHolder={t("Gender")} leadingIconImage={userIcon}
//                                         options={[{ label: t("Male"), value: 'MALE' }, { label: t("Female"), value: 'FEMALE' }]}
//                                         field="gender" formik={formikPartner} value={formikPartner.values.gender} />
//                                 </div>
//                                 <div className="mt-2">
//                                     <WtcRoleInputIconText target='PARTNER' code='phone' action="UPD" placeHolder={t("Phone")} required leadingIconImage={phoneIcon} field="phone" formik={formikPartner} value={formikPartner.values.phone} />
//                                 </div>
//                                 <div className="mt-2">
//                                     <WtcRoleInputIconText target='PARTNER' code='email' action="UPD" placeHolder="Email" leadingIconImage={emailIcon} field="email" formik={formikPartner} value={formikPartner.values.email} />
//                                 </div>
//                                 <div className="mt-2">
//                                     <WtcRoleInputIconText target='PARTNER' code='address' action="UPD" placeHolder={t("Address")} required leadingIcon={"ri-home-4-fill"} field="address" formik={formikPartner} value={formikPartner.values.address} />
//                                 </div>

//                             </div>}
//                             className="h-100"
//                         />
//                     </div>
//                 </div>
//             </div >
//             <DynamicDialog
//                 width={isPhone ? '90vw' : '75vw'}
//                 minHeight={"75vh"}
//                 visible={dialogVisible}
//                 mode={storeMode}
//                 position={'center'}
//                 title={t("Store")}
//                 okText=""
//                 cancelText={t("Cancel")}
//                 onEnter={() => { formikStore.handleSubmit() }}
//                 draggable={false}
//                 resizeable={false}
//                 onClose={closeDialog}
//                 status={formikStore.values.status.code}
//                 body={<div className="pt-3">
//                     <div className="row">
//                         <div className="col-sm-12">
//                             <WtcRoleInputIconText target='PARTNER' code='name' action="UPD" readonly={storeMode === 'restore'} placeHolder={t("Name")} required leadingIconImage={userIcon} field="name" formik={formikStore} value={formikStore.values.name} />
//                         </div>

//                     </div>
//                     <div className="row mt-3">
//                         <div className="col-md-12">
//                             <WtcRoleInputIconText target='PARTNER' code='address' action="UPD" readonly={storeMode === 'restore'} placeHolder={t("Address")} required leadingIcon={"ri-home-4-fill"} field="address" formik={formikStore} value={formikStore.values.address} />
//                         </div>
//                     </div>
//                     <div className="row mt-3">
//                         <div className="col-md-12">
//                             <WtcRoleInputIconText target='PARTNER' required code='apiUrl' action="UPD" readonly={storeMode === 'restore'} placeHolder={t("Api Url")} leadingIcon={"ri-links-line"} field="config.apiUrl" formik={formikStore} value={formikStore.values.config.apiUrl} />
//                         </div>
//                     </div>
//                     <div className="row mt-3">
//                         <div className="col-md-12">
//                             <WtcRoleInputIconText target='PARTNER' required code='dbName' action="UPD" readonly={storeMode === 'restore'} placeHolder={t("Database")} leadingIcon={"ri-database-2-fill"} field="config.dbName" formik={formikStore} value={formikStore.values.config.dbName} />
//                         </div>
//                     </div>
//                 </div>}
//                 footer={<div className=' d-flex wtc-bg-white align-items-center justify-content-end'>
//                     <WtcButton label={t("Cancel")} className="bg-white text-blue me-2" borderColor="#283673" fontSize={16} onClick={closeDialog} />
//                     {storeMode === 'restore' && <WtcRoleButton target='PARTNER' action='RES' icon="ri-restart-line" label={t("Restore")} className="wtc-bg-primary text-white me-2" fontSize={16} onClick={() => formikStore.handleSubmit()} />}
//                     {storeMode === 'edit' && <><WtcRoleButton target='PARTNER' action='DEL' icon="ri-delete-bin-5-line" label={t("Delete")} className="bg-white text-danger  me-2" borderColor="red" fontSize={16} onClick={() => handleDeleteStore(formikStore.values._id)} />
//                         <WtcRoleButton target='PARTNER' action='UPD' label={t("Edit")} icon="ri-edit-line" className="wtc-bg-primary text-white me-2" fontSize={16} onClick={() => formikStore.handleSubmit()} /></>}
//                     {storeMode === 'add' && <WtcRoleButton target='PARTNER' action='INS' label={t("Add")} icon="ri-add-line" className="wtc-bg-primary text-white me-2" fontSize={16} onClick={() => formikStore.handleSubmit()} />}
//                 </div>}
//             />
//         </>
//     )
// }