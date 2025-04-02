import { FormikErrors, useFormik } from "formik";
import { t } from "i18next";
import { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import userIcon from "../../assets/svg/user.svg";
import DynamicDialog, { DialogMode } from "../../components/DynamicDialog";
import { itemListStyle, itemsLineSpacing } from "../../components/Theme";
import WtcAddButton from "../../components/commons/WtcAddButton";
import WtcButton from "../../components/commons/WtcButton";
import WtcCard from "../../components/commons/WtcCard";
import WtcDropdownIconText from "../../components/commons/WtcDropdownIconText";
import WtcEmptyBox from "../../components/commons/WtcEmptyBox";
import WtcItemCard from "../../components/commons/WtcItemCard";
import WtcRoleButton from "../../components/commons/WtcRoleButton";
import WtcRoleInputIconText from "../../components/commons/WtcRoleInputIconText";
import { AbilityModel } from "../../models/category/Ability.model";
import { RoleModel } from "../../models/category/Role.model";
import { addAbility, deleteAbility, resetActionState, updateAbility } from "../../slices/ability.slice";
import {
	deleteRole,
	getRole,
	resetActionState as resetRoleActionStte,
	restoreRole,
	updateRole,
} from "../../slices/role.slice";
import { completed, failed, processing, warningWithConfirm } from "../../utils/alert.util";
import useWindowSize from "../../app/screen";
import { PageTarget } from "../../const";

export default function RoleItem() {
	const dispatch = useAppDispatch();
	const roleState = useAppSelector((state) => state.role);
	const abilityState = useAppSelector((state) => state.ability);
	const masterPermissions = useAppSelector((state) => state.masterdata.permissions);
	const screenSize = useWindowSize();
	const item = roleState.item;
	const abilities = item?.abilities;
	const [dialogVisible, setDialogVisible] = useState(false);
	const [dialogMode, setDialogMode] = useState<DialogMode>("view");
	const [checkSubmitEnter, setCheckSubmitEnter] = useState(false);
	const formikRole = useFormik<any>({
		initialValues: item,
		validate: (data) => {
			const errors: FormikErrors<RoleModel> = {};
			if (!data.name) {
				errors.name = "y";
			}
			return errors;
		},
		onSubmit: (data) => {
			const submitData = {
				_id: data._id,
				data: {
					name: data.name,
					note: data.note === "" ? null : data.note,
				},
			};
			console.log(submitData);
			dispatch(updateRole(submitData));
		},
	});
	const formikAbility = useFormik<AbilityModel>({
		initialValues: { _id: "", permission: { _id: "", code: "", name: "", action: [] }, fields: [] },
		validate: (data) => {
			const errors: FormikErrors<{
				id: string;
				permission: any;
				action: any[];
				field: { key: string; action: any[] }[];
			}> = {};
			if (!data.permission) {
				errors.permission = "y";
			}
			return errors;
		},
		onSubmit: (data) => {
			const submitData: any = {
				roleId: item?._id,
				permission: {
					_id: data.permission._id,
					code: data.permission.code,
					name: data.permission.name,
					action: data.permission.action,
				},
				fields: data.fields,
			};
			if (dialogMode === "add") {
				dispatch(addAbility(submitData));
			} else if (dialogMode == "edit") {
				dispatch(updateAbility({ _id: data._id, data: submitData }));
			}
		},
	});
	const handleDeleteAbility = (id: string) => {
		dispatch(deleteAbility(id));
	};
	const closeDialog = () => {
		formikAbility.resetForm();
		setDialogVisible(false);
	};
	// const selectItem = (item: AbilityModel) => {
	//     if (item._id == formikAbility.values._id)
	//         openItem(item)
	//     else
	//         formikAbility.setValues(item)
	// }
	const openItem = (item: AbilityModel) => {
		formikAbility.setValues(item);
		setDialogMode("edit");
		setDialogVisible(true);
	};
	const handleDeleteRole = (id: string) => {
		dispatch(deleteRole(id));
	};

	const handleRestoreRole = (id: string) => {
		dispatch(restoreRole(id));
	};
	useEffect(() => {
		formikRole.setValues(roleState.item);
	}, [roleState.item]);
	useEffect(() => {
		switch (roleState.fetchState.status) {
			case "completed":
				break;
			case "failed":
				// failed(t(roleState.fetchState.error!))
				break;
		}
	}, [roleState.fetchState.status]);
	useEffect(() => {
		switch (roleState.actionState.status) {
			case "completed":
				completed();
				dispatch(resetRoleActionStte());
				dispatch(getRole(item?._id));
				break;
			case "loading":
				processing();
				break;
			case "failed":
				failed(t(roleState.actionState.error!));
				dispatch(resetRoleActionStte());
				break;
		}
	}, [roleState.actionState]);
	useEffect(() => {
		switch (abilityState.actionState.status) {
			case "completed":
				completed();
				dispatch(getRole(item?._id));
				setDialogVisible(false);
				dispatch(resetActionState());
				break;
			case "loading":
				processing();
				break;
			case "failed":
				failed(t(abilityState.actionState.error!));
				dispatch(resetActionState());
				break;
		}
	}, [abilityState.actionState]);
	const selectedMasterPermission = masterPermissions.find((it) => it._id == formikAbility.values.permission?._id);
	const abilitieIds = abilities?.map((item) => item.permission?._id);
	return (
		<>
			<div className="p-2 wtc-bg-white rounded-4 h-100">
				<div className="row h-100">
					<div className="col-sm-8 h-100">
						<div className="font-title-card wtc-bg-title p-3 rounded-4 d-flex align-items-center w-100">
							<i className=" text-blue" style={{ fontSize: 26 }} />
							<div className="flex-grow-1 mx-2"> {t("Abilities")}</div>
							<div className="ms-2">
								<WtcAddButton
									target={PageTarget.ability}
									action="INS"
									label={t("action.create")}
									onClick={() => {
										setDialogMode("add");
										formikAbility.setFieldValue("permission", undefined);
										setDialogVisible(true);
									}}
									onKeyDown={(e) => {
										if (e.key === "Enter") {
											setDialogMode("add");
											formikAbility.setFieldValue("permission", undefined);
											setDialogVisible(true);
											e.preventDefault();
										}
									}}
								/>
							</div>
						</div>
						<div
							className="row mt-3 d-flex align-content-start"
							style={{ height: screenSize.height - 190, overflowY: "auto" }}
						>
							{abilities && abilities.length > 0 ? (
								abilities.map((item, index) => {
									const permission = item.permission;
									return (
										<div className="my-no-border" key={"ability-" + permission._id}>
											<WtcItemCard
												target={PageTarget.ability}
												index={index}
												hideBorder={false}
												verticalSpacing={itemsLineSpacing}
												selected={permission._id === formikAbility.values?.permission?._id}
												onDbClick={() => {}}
												onClick={() => {
													openItem(item);
												}}
												status={"ACTIVE"}
												onDelete={() => {
													dispatch(deleteAbility(item._id));
												}}
												body={
													<div className="row align-items-center p-3 w-100 ">
														<div className="col-sm-3">
															<div style={itemListStyle}>
																<span>
																	<i className="ri-shield-keyhole-line" />{" "}
																</span>
																{permission.code}
															</div>
														</div>
														<div className="col-sm-9">
															<div style={itemListStyle}>
																<span>
																	<i className="ri-settings-5-line" />{" "}
																</span>
																{permission.name}
															</div>
														</div>
													</div>
												}
											/>
										</div>
									);
								})
							) : (
								<div className="w-100 h-100 d-flex flex-column justify-content-center">
									{" "}
									<WtcEmptyBox />
								</div>
							)}
						</div>
					</div>
					<div
						className="col-sm-4 h-100"
						onKeyDown={(e) => {
							if (e.key === "Enter" && !checkSubmitEnter) {
								formikRole.handleSubmit();
								e.preventDefault();
							}
						}}
					>
						<WtcCard
							title={
								<div className="d-flex justify-content-between align-items-center">
									<div className="one-fill-ellipsis">
										<i className="ri-file-list-fill text-blue" style={{ fontSize: 26 }} />{" "}
										{t("role_info")}{" "}
									</div>
								</div>
							}
							footer={
								<div className="d-flex">
									{formikRole.values.status?.code == "ACTIVE" && (
										<WtcRoleButton
											tabIndex={0}
											target={PageTarget.role}
											action="DEL"
											label={t("action.delete")}
											className="bg-danger text-white px-2"
											icon="fs-5 ri-close-large-fill"
											height={45}
											fontSize={16}
											minWidth={100}
											onFocus={() => setCheckSubmitEnter(true)}
											onBlur={() => setCheckSubmitEnter(false)}
											onClick={() => {
												warningWithConfirm({
													title: t("do_you_delete"),
													text: "",
													confirmButtonText: t("Delete"),
													confirm: () => handleDeleteRole(formikRole.values._id),
												});
											}}
											onKeyDown={(e) => {
												if (e.key === "Enter") {
													warningWithConfirm({
														title: t("do_you_delete"),
														text: "",
														confirmButtonText: t("Delete"),
														confirm: () => handleDeleteRole(formikRole.values._id),
													});
													e.preventDefault();
												}
											}}
										/>
									)}
									{formikRole.values.status?.code == "INACTIVE" && (
										<WtcRoleButton
											tabIndex={0}
											target={PageTarget.role}
											action="RES"
											label={t("action.restore")}
											className="bg-blue text-white px-2"
											icon="fs-5 ri-loop-left-fill"
											height={45}
											fontSize={16}
											minWidth={100}
											onFocus={() => setCheckSubmitEnter(true)}
											onBlur={() => setCheckSubmitEnter(false)}
											onClick={() => {
												warningWithConfirm({
													title: t("do_you_restore"),
													text: "",
													confirmButtonText: t("Restore"),
													confirm: () => handleRestoreRole(formikRole.values._id),
												});
											}}
											onKeyDown={(e) => {
												if (e.key === "Enter") {
													warningWithConfirm({
														title: t("do_you_restore"),
														text: "",
														confirmButtonText: t("Restore"),
														confirm: () => handleRestoreRole(formikRole.values._id),
													});
													e.preventDefault();
												}
											}}
										/>
									)}
									<WtcRoleButton
										tabIndex={0}
										target={PageTarget.role}
										action="UPD"
										label={t("action.UPD")}
										minWidth={100}
										icon="ri-edit-fill fs-5"
										className="wtc-bg-primary text-white px-2 ms-2"
										height={45}
										fontSize={16}
										onClick={formikRole.handleSubmit}
										onKeyDown={(e) => {
											if (e.key === "Enter") {
												formikRole.handleSubmit();
												e.preventDefault();
											}
										}}
									/>
								</div>
							}
							background="#EEF1F9"
							hideBorder={true}
							body={
								<>
									<div className="mt-2">
										<WtcRoleInputIconText
											target={PageTarget.role}
											code="roleCode"
											action="UPD"
											placeHolder={t("role.code")}
											readonly
											leadingIcon={"ri-shield-keyhole-fill"}
											value={formikRole.values.code}
										/>
									</div>
									<div className="mt-2">
										<WtcRoleInputIconText
											target={PageTarget.role}
											code="roleName"
											action="UPD"
											placeHolder={t("role.name")}
											leadingIcon={"ri-shield-keyhole-fill"}
											field="name"
											formik={formikRole}
											value={formikRole.values.name}
										/>
									</div>
									<div className="mt-2">
										<WtcRoleInputIconText
											target={PageTarget.role}
											code="note"
											action="UPD"
											placeHolder={t("note")}
											leadingIcon={"ri-sticky-note-fill"}
											field="note"
											formik={formikRole}
											value={formikRole.values.note}
										/>
									</div>
								</>
							}
							className="h-100"
						/>
					</div>
				</div>
			</div>
			<div
				onKeyDown={(e) => {
					if (e.key === "Enter" && !checkSubmitEnter) {
						formikAbility.handleSubmit();
						e.preventDefault();
					}
				}}
			>
				<DynamicDialog
					width={isMobile ? "90vw" : "75vw"}
					minHeight={"75vh"}
					visible={dialogVisible}
					mode={dialogMode}
					position={"center"}
					title={t("Abilities")}
					okText=""
					cancelText={t("Cancel")}
					onEnter={() => {}}
					draggable={false}
					resizeable={false}
					onClose={closeDialog}
					body={
						<div className="mt-3">
							<div className="row">
								<div
									className="col-sm-12"
									onFocus={() => setCheckSubmitEnter(true)}
									onBlur={() => setCheckSubmitEnter(false)}
								>
									<WtcDropdownIconText
										disabled={dialogMode == "edit"}
										filtler
										options={masterPermissions
											.filter((item) =>
												dialogMode == "add" ? !abilitieIds?.includes(item._id) : true
											)
											.map((item) => {
												return { label: item.name.toUpperCase(), value: item._id };
											})}
										placeHolder={t("Ability")}
										leadingIconImage={userIcon}
										value={formikAbility.values?.permission?._id}
										onChange={(value) => {
											const permission = masterPermissions.find((it) => it._id == value);
											formikAbility.setFieldValue("permission", {
												_id: permission?._id,
												code: permission?.code,
												name: permission?.name,
											});
										}}
									/>
								</div>
								<div
									className="col-sm-12 mt-2"
									onFocus={() => setCheckSubmitEnter(true)}
									onBlur={() => setCheckSubmitEnter(false)}
								>
									<WtcDropdownIconText
										multiSelect
										inputHeight={68}
										options={
											selectedMasterPermission
												? selectedMasterPermission.action.map((item) => {
														return { label: t("action." + item), value: item };
												  })
												: []
										}
										disabled={false}
										placeHolder={t("Actions")}
										leadingIcon="ri-shield-fill"
										value={formikAbility.values?.permission?.action?.map((it: any) => {
											return { label: t("action." + it), value: it };
										})}
										onMultiChange={(values) => {
											formikAbility.setFieldValue(
												"permission.action",
												values.map((it: any) => it.value)
											);
										}}
									/>
								</div>
							</div>
							{selectedMasterPermission && selectedMasterPermission.field.length > 0 && (
								<div
									className="row mt-2"
									style={{
										borderRadius: "20px",
										marginLeft: "0px",
										marginRight: "0px",
										paddingTop: "15px",
										paddingLeft: "8px",
										paddingRight: "8px",
									}}
								>
									<div
										style={{ fontSize: 16, fontWeight: 700, color: "#384252", marginBottom: "5px" }}
									>
										{t("Field")}
									</div>
									{selectedMasterPermission.field.map((item) => {
										const values =
											formikAbility.values.fields.find((i: any) => i.key === item)?.action ?? [];
										return (
											<div
												className="col-sm-6 mb-2"
												onFocus={() => setCheckSubmitEnter(true)}
												onBlur={() => setCheckSubmitEnter(false)}
											>
												{
													<WtcDropdownIconText
														key={item + JSON.stringify(values)}
														multiSelect
														inputHeight={68}
														options={[
															{ label: t("action.not_read"), value: "not_read" },
															{ label: t("action.read"), value: "read" },
															{ label: t("action.update"), value: "update" },
														]}
														disabled={false}
														placeHolder={item}
														leadingIcon="ri-input-field"
														value={values.map((it: any) => {
															return { label: t("action." + it), value: it };
														})}
														onMultiChange={(value: any) => {
															const row = {
																key: item,
																action: value.map((it: any) => it.value),
															};
															const field = JSON.parse(
																JSON.stringify(formikAbility.values.fields)
															);
															const foundIndex = field.findIndex(
																(f: any) => f.key === item
															);
															if (foundIndex >= 0) {
																field[foundIndex].action = value.map(
																	(it: any) => it.value
																);
															} else {
																field.push(row);
															}
															formikAbility.setFieldValue("fields", field);
														}}
													/>
												}
											</div>
										);
									})}
								</div>
							)}
						</div>
					}
					footer={
						<div className=" d-flex wtc-bg-white align-items-center justify-content-between">
							<div className="d-flex">
								{dialogMode == "edit" && (
									<WtcRoleButton
										tabIndex={0}
										target={PageTarget.ability}
										action="DEL"
										label={t("action.delete")}
										className="bg-danger text-white me-2"
										icon="ri-close-large-fill"
										fontSize={16}
										minWidth={100}
										onClick={() => {
											warningWithConfirm({
												title: t("do_you_delete"),
												text: "",
												confirmButtonText: t("Delete"),
												confirm: () => handleDeleteAbility(formikAbility.values._id),
											});
										}}
									/>
								)}
							</div>
							<div className="d-flex">
								<WtcButton
									tabIndex={0}
									label={t("action.close")}
									className="bg-white text-blue me-2"
									borderColor="#283673"
									fontSize={16}
									onClick={closeDialog}
									onKeyDown={(e) => {
										if (e.key === "Enter") {
											closeDialog();
										}
									}}
								/>
								{dialogMode === "edit" && (
									<>
										<WtcRoleButton
											tabIndex={0}
											target={PageTarget.ability}
											action="UPD"
											label={t("action.UPD")}
											minWidth={100}
											icon="ri-edit-fill"
											className="wtc-bg-primary text-white me-2"
											fontSize={16}
											onClick={() => formikAbility.handleSubmit()}
										/>
									</>
								)}
								{dialogMode === "add" && (
									<WtcButton
										tabIndex={0}
										label={t("action.INS")}
										icon="ri-add-fill"
										className="wtc-bg-primary text-white me-2"
										fontSize={16}
										onClick={() => formikAbility.handleSubmit()}
									/>
								)}
							</div>
						</div>
					}
				/>
			</div>
		</>
	);
}
