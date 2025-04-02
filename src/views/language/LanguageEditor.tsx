import { FormikErrors, useFormik } from "formik";
import { t } from "i18next";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import useWindowSize from "../../app/screen";
import iconEdit from "../../assets/svg/edit.svg";
import DynamicDialog, { DialogMode } from "../../components/DynamicDialog";
import HeaderList from "../../components/HeaderList";
import WtcCard from "../../components/commons/WtcCard";
import WtcEmptyBox from "../../components/commons/WtcEmptyBox";
import WtcInputIconText from "../../components/commons/WtcInputIconText";
import { LanguageModel } from "../../models/category/Language.model";
import { createSentence, fetchLangs, resetActionState } from "../../slices/language.slice";
import { failed, processing } from "../../utils/alert.util";
import { isStrContainIgnoreCase } from "../../utils/string.ultil";
import LoadingIndicator from "../../components/Loading";

export default function LanguageEditor() {
	const screenSize = useWindowSize();
	const languageState = useAppSelector((state) => state.language);
	// const role = useAppSelector(state => state.auth.role)
	const dispatch = useAppDispatch();
	// const [editNode, setEditNode] = useState<any[]>(['', ''])
	const [dialogMode, setDialogMode] = useState<DialogMode>("add");
	const [searchText, setSearchText] = useState("");
	const [list, setList] = useState<any[]>([]);
	const [dialogVisible, setDialogVisible] = useState(false);

	const formik = useFormik<any>({
		initialValues: { code: "", value: "" },
		validate: (_data) => {
			const errors: FormikErrors<Record<string, any>> = {};
			if (!_data.code) errors.code = "y";
			if (!_data.value) errors.value = "y";
			return errors;
		},
		onSubmit: (_data) => {
			switch (dialogMode) {
				case "add":
					dispatch(
						createSentence({ lang: "en", data: { code: formik.values?.code, value: formik.values?.en } })
					);
					break;
			}
		},
	});
	const closeDialog = () => {
		formik.resetForm();
		setDialogVisible(false);
	};
	// const applyChangeText = (value: string) => {
	//     dispatch(updateSentence({ lang: editNode[0], data: { code: editNode[1], value: value } }))
	//     setEditNode(['', ''])
	// }
	const findVieKey = (key: string) => {
		if (!languageState.list?.vi) return undefined;
		const res = languageState.list?.vi.find((it: LanguageModel) => it.code == key);
		return res ?? undefined;
	};
	// const handleEditNode = (role: any, lang: string, value: string) => {
	//     if (RoleService.isAllowAction(role, 'LANGUAGE', 'UPD')) setEditNode([lang, value])
	// }
	const buildNode = (node: any) => {
		if (typeof node[1] == "string") {
			return [
				<></>,
				//     <WtcItemCard
				//         hideStatusAction
				//         key={node[1]}
				//         verticalSpacing={itemsLineSpacing} selected={false}
				//         onClick={() => { }}
				//         onDbClick={() => { }}
				//         onDelete={() => { }}
				//         onRestore={() => { }}
				//         status=''
				//         body={<div className="row align-items-center p-3">
				//             <div className="col-sm-3">
				//                 <div style={itemListStyle}>{node[0]}</div>
				//             </div>
				//             <div className="col-sm-5 d-flex" onClick={() => { handleEditNode(role, 'en', node[0]) }}>
				//                 {editNode[0] == 'en' && editNode[1] == node[0] ?
				//                     <WtcInputIconText leadingIconImage={iconEdit} placeHolder='Value-en' value={node[1]} focused
				//                         onEnter={(value) => applyChangeText(value)} /> : <>
				//                         <i className='my-grid-icon ri-edit-line me-2 clickable text-blue'></i>
				//                         <div style={itemListStyle}>{node[1]}</div>
				//                     </>
				//                 }
				//             </div>
				//             <div className="col-sm-4 d-flex" onClick={() => handleEditNode(role, 'vi', node[0])}>
				//                 {editNode[0] == 'vi' && editNode[1] == node[0] ? <WtcInputIconText leadingIconImage={iconEdit} placeHolder='Value-vi' focused
				//                     value={node[2]} onEnter={(value) => applyChangeText(value)} /> : <>
				//                     <i className='my-grid-icon ri-edit-line me-2 clickable text-blue'></i>
				//                     <div style={itemListStyle}>{node[2]}</div>
				//                 </>}
				//             </div>
				//         </div>
				//         } />
			];
		} else {
			return [<></>];
		}
	};

	const fetchLanguages = () => {
		dispatch(fetchLangs("en"));
		dispatch(fetchLangs("vi"));
	};
	useEffect(() => {
		fetchLanguages();
	}, []);
	useEffect(() => {
		if (languageState.list.en) {
			const lst: any = [];
			languageState.list.en.forEach((it: LanguageModel) => {
				const vi = findVieKey(it.code);
				lst.push([it.code, it.value, vi ? vi.value : ""]);
			});
			setList(lst);
		}
	}, [languageState.list]);
	useEffect(() => {
		if (languageState.actionState) {
			switch (languageState.actionState.status!) {
				case "completed":
					// completed()
					dispatch(resetActionState());
					fetchLanguages();
					closeDialog();
					break;
				case "loading":
					processing();
					break;
				case "failed":
					failed(t(languageState.actionState.error!));
					dispatch(resetActionState());
					break;
			}
		}
	}, [languageState.actionState]);
	const filtered = searchText
		? list.filter((it: any) => isStrContainIgnoreCase(`${it[0]} ${it[1]} ${it[2]}`, searchText))
		: list;
	return (
		<>
			<WtcCard
				title={
					<HeaderList
						callback={fetchLanguages}
						target="LANGUAGE"
						onSearchText={(text) => setSearchText(text)}
						onAddNew={() => {
							setDialogMode("add");
							setDialogVisible(true);
						}}
					/>
				}
				hideBorder={true}
				body={
					<div className="d-flex flex-column h-100">
						<div
							className="flex-grow-1"
							style={{ maxHeight: screenSize.height - 220, overflowX: "hidden", overflowY: "auto" }}
						>
							{languageState.fetchState.status == "loading" ? (
								<LoadingIndicator />
							) : filtered.length == 0 ? (
								<div className="w-100 h-100 d-flex flex-column justify-content-center">
									{" "}
									<WtcEmptyBox />
								</div>
							) : (
								filtered.map((node: any) => buildNode(node))
							)}
						</div>
					</div>
				}
				className="h-100"
			/>
			<DynamicDialog
				width={"35vw"}
				minHeight={"50vh"}
				visible={dialogVisible}
				mode={dialogMode}
				position={"center"}
				title={"Key"}
				okText=""
				cancelText="Hủy"
				onEnter={() => {
					formik.handleSubmit();
				}}
				draggable={false}
				resizeable={false}
				onClose={() => closeDialog()}
				body={
					<>
						<WtcInputIconText
							focused
							placeHolder="Key"
							required
							readonly={dialogMode == "edit"}
							leadingIconImage={iconEdit}
							field="code"
							formik={formik}
							value={formik.values.key}
						/>
						<div className="mt-2">
							<WtcInputIconText
								placeHolder="Value-En"
								required
								leadingIconImage={iconEdit}
								field="value"
								formik={formik}
							/>
						</div>
					</>
				}
				closeIcon
			/>
		</>
	);
}
