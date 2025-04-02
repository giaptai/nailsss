import { FormikErrors, useFormik } from "formik";
import { Dropdown } from "primereact/dropdown";
import { Sidebar } from "primereact/sidebar";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { actions } from "../../types";
import "./SidebarPosition.css";
import { resetActionStateProfile, updatePositionEmpl } from "../../slices/profile.slice";
import { fetchWindow } from "../../slices/window.slice";
import { fetchUsers } from "../../slices/user.slice";
import { completed, failed, processing } from "../../utils/alert.util";
type PositionProps = {
	positionWindow: string;
	positionWindowName: string;
	positionPoint: number;
	userId: string;
};
const SidebarPosition = ({
	dialogVisible,
	closeDialog,
}: {
	dialogVisible: boolean;
	setDialogVisible: (e: boolean) => void;
	closeDialog: VoidFunction;
	action: actions | undefined;
}) => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();
	const profileState = useAppSelector((state) => state.profile);
	const userState = useAppSelector((state) => state.user);
	const formik = useFormik<PositionProps>({
		initialValues: {
			positionWindowName: "",
			positionWindow: "",
			positionPoint: 0,
			userId: "",
		},
		validate: (data) => {
			const errors: FormikErrors<PositionProps> = {};
			if (!data.userId) {
				errors.userId = "";
			}
			return errors;
		},
		onSubmit: async (data) => {
			const payload = {
				_id: data.userId,
				data: {
					positionWindow: data.positionWindow,
					positionPoint: data.positionPoint,
				},
			};
			dispatch(updatePositionEmpl(payload));
		},
	});
	useEffect(() => {
		if (userState.itemPosition) {
			formik.setValues({
				positionWindowName: userState.itemPosition?.positionWindowName ?? "",
				positionWindow: userState.itemPosition?.positionWindow ?? "",
				positionPoint: userState.itemPosition?.positionPoint ?? 0,
				userId: "",
			});
		}
	}, [userState.itemPosition]);
	useEffect(() => {
		// dispatch(getAvatarEmployee(userState.item?._id));
		dispatch(fetchWindow());
		dispatch(fetchUsers());
	}, []);
	useEffect(() => {
		if (profileState.actionState) {
			switch (profileState.actionState.status) {
				case "completed":
					completed();
					dispatch(fetchWindow());
					dispatch(fetchUsers());
					dispatch(resetActionStateProfile());
					break;
				case "loading":
					processing();
					closeDialog();
					break;
				case "failed":
					failed(t(profileState.actionState.error!));
					dispatch(resetActionStateProfile());
					break;
			}
		}
	}, [profileState.actionState]);
	return (
		<>
			<Sidebar
				visible={dialogVisible}
				onHide={() => closeDialog()}
				position="right"
				style={{ width: "881px" }}
				header={
					<>
						<div className="d-flex justify-content-between align-items-center">
							<h2
								style={{
									fontSize: "24px",
									fontWeight: "400",
								}}
							>
								Select employees
							</h2>
						</div>
					</>
				}
			>
				<div className="d-flex align-items-center flex-column" style={{ padding: "10px 20px", gap: "20px" }}>
					<div className="d-flex flex-column w-100" style={{ gap: "4px" }}>
						<label
							className="form-label"
							style={{
								fontSize: "16px",
								fontWeight: "600",
							}}
						>
							Floor name
						</label>
						<input
							type="text"
							className="form-control"
							placeholder={t("firstName")}
							required
							value={formik.values.positionWindowName}
							onChange={() => {}}
							disabled
							maxLength={20}
							style={{
								border: "1px solid #CCCED5",
								borderRadius: "4px",
								padding: "12px",
								height: "60px",
							}}
						/>
					</div>
					<div className="d-flex flex-column w-100" style={{ gap: "4px" }}>
						<label
							className="form-label"
							style={{
								fontSize: "16px",
								fontWeight: "600",
							}}
						>
							Slot
						</label>
						<input
							type="text"
							className="form-control"
							placeholder={t("firstName")}
							required
							value={`#${userState.itemPosition?.positionPoint ?? 1}`}
							onChange={() => {}}
							disabled
							maxLength={20}
							style={{
								border: "1px solid #CCCED5",
								borderRadius: "4px",
								padding: "12px",
								height: "60px",
							}}
						/>
					</div>
					<div className="d-flex flex-column w-100" style={{ gap: "4px" }}>
						<label
							className="form-label"
							style={{
								fontSize: "16px",
								fontWeight: "600",
							}}
						>
							<span
								style={{
									color: "#FF3C32",
									fontSize: "16px",
									fontWeight: "600",
								}}
							>
								*
							</span>
							Select employees
						</label>
						<Dropdown
							className="w-100"
							placeholder={"Select employees"}
							options={userState.list
								.filter(
									(item) =>
										item.profile.positionPoint === null &&
										item.profile.positionWindow === null &&
										item.status === "ACTIVE"
								)
								.map((item) => ({
									label:
										item.profile.firstName +
										" " +
										item.profile.middleName +
										" " +
										item.profile.lastName,
									value: item.profile._id,
								}))}
							style={{
								border: "1px solid #CCCED5",
								borderRadius: "4px",
								padding: "6px",
								height: "60px",
							}}
							value={formik.values.userId}
							onChange={(e) => formik.setFieldValue("userId", e.value)}
						/>
					</div>
				</div>
				<div className="position-absolute bottom-0 end-0 p-3 bg-white border-top w-100">
					<div className="d-flex justify-content-end gap-2">
						<button
							onClick={() => closeDialog()}
							style={{
								padding: "16px 20px",
								backgroundColor: "white",
								border: "1px solid #CCCED5",
								borderRadius: "8px",
								color: "#21242B",
							}}
						>
							Cancel
						</button>
						<button
							onClick={() => formik.handleSubmit()}
							style={{
								padding: "16px 20px",
								backgroundColor: "#1160B7",
								border: "1px solid #8FAFF6",
								borderRadius: "8px",
								color: "white",
							}}
						>
							Save
						</button>
					</div>
				</div>
			</Sidebar>
		</>
	);
};

export default SidebarPosition;
