import { Plus, User } from "lucide-react";
import { TabPanel, TabView } from "primereact/tabview";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import SidebarPosition from "../../../components/listPosition/SidebarPosition";
import { formatCapitalize } from "../../../const";
import { fetchUsers, selectItemPosition } from "../../../slices/user.slice";
import { fetchWindow } from "../../../slices/window.slice";
import "./TabView.css";
import useWindowSize from "../../../app/screen";
import { WindowModel } from "../../../models/category/Window.model";
import { t } from "i18next";
const TabviewComponent = () => {
	const screenSize = useWindowSize();
	const bodyWidth = screenSize.width;
	const bodyHeight = screenSize.height;

	const dispatch = useAppDispatch();
	const windows = useAppSelector((state) => state.window);
	const w = windows.list.filter((item) => item.type == "EMPLOYEE" && item.status.code == "ACTIVE");
	const [windowSelected, setwindowSelected] = useState(w[0]);
	const [activeIndex, setActiveIndex] = useState(0);
	const userState = useAppSelector((state) => state.user);
	const [dialogVisible, setDialogVisible] = useState(false);
	const closeDialog = () => {
		setDialogVisible(false);
	};
	const handleItemClick = (item: any) => {
		setwindowSelected(item);
	};
	const getUserAtPosition = (position: number) => {
		return userState.list
			.filter((user) => user.profile.positionWindow?._id == windowSelected?._id)
			.find((user) => user.profile?.positionPoint === position);
	};
	const handleOpenDialog = (index: number) => {
		const payload = {
			positionPoint: index + 1,
			positionWindow: windowSelected._id,
			positionWindowName: windowSelected?.name,
		};
		dispatch(selectItemPosition(payload));
		setDialogVisible(true);
	};
	useEffect(() => {
		// dispatch(getAvatarEmployee(userState.item?._id));
		dispatch(fetchWindow());
		dispatch(fetchUsers());
	}, []);
	useEffect(() => {
		if (!windowSelected && w.length > 0) {
			setwindowSelected(w[0]);
			// setActiveItem(w[0].name);
		}
	}, [windows]);

	return (
		<>
			<div className="tabview-position">
				<TabView
					activeIndex={activeIndex}
					onTabChange={(e) => {
						setActiveIndex(e.index);
						const activeWindow = windows.list.filter(
							(item) => item.type === "EMPLOYEE" && item.status.code === "ACTIVE"
						)[e.index];
						setwindowSelected(activeWindow);
					}}
				>
					{windows.list
						.filter((item) => item.type == "EMPLOYEE" && item.status.code == "ACTIVE")
						.map((item: WindowModel) => {
							return (
								<TabPanel
									header={<div onClick={() => handleItemClick(item)}>{item.name}</div>}
									key={item._id}
								>
									{windows.list.filter(
										(item) => item.type == "EMPLOYEE" && item.status.code == "ACTIVE"
									).length > 0 ? (
										<div className="row">
											{Array.from({ length: 20 }).map((_, index) => {
												const user = getUserAtPosition(index + 1);

												return (
													<div
														style={{ marginBottom: "20px" }}
														className="col-md-3"
														key={index}
													>
														<div
															className="bg-white position-relative"
															style={{
																width: (bodyWidth - 550) / 4,
																height: (bodyHeight - 272) / 5,
																borderRadius: "8px",
																backgroundColor: "red",
															}}
														>
															<div
																className="position-absolute w-100 d-flex align-items-center"
																style={{
																	height: "32px",
																	padding: "12px",
																	gap: "16px",
																	top: "12px",
																}}
															>
																<User size={25} />
																<span
																	style={{
																		fontSize: "20px",
																		fontWeight: 400,
																		color: "#CCCED5",
																	}}
																>
																	{user
																		? `${formatCapitalize(
																				`${user?.profile.firstName}`
																		  )} ${
																				user?.profile.middleName &&
																				`${formatCapitalize(
																					user?.profile.middleName
																				)} `
																		  } ${formatCapitalize(user?.profile.lastName)}`
																		: "Empty"}
																</span>
															</div>
															<div
																className="position-absolute w-100 d-flex align-items-center justify-content-between"
																style={{
																	height: "32px",
																	padding: "12px",
																	bottom: "12px",
																}}
															>
																<span
																	style={{
																		fontSize: "20px",
																		fontWeight: 400,
																	}}
																>
																	#{index + 1}
																</span>
																{!user && (
																	<button
																		className="d-flex align-items-center"
																		style={{
																			backgroundColor: "transparent",
																			border: "none",
																			outline: "none",
																			color: "#2970BE",
																			gap: "8px",
																		}}
																		onClick={() => handleOpenDialog(index)}
																	>
																		<Plus size={21} /> Add position
																	</button>
																)}
															</div>
														</div>
													</div>
												);
											})}
										</div>
									) : (
										<div className="text-center">{t("windows_empty")}</div>
									)}
								</TabPanel>
							);
						})}
				</TabView>
			</div>
			<SidebarPosition
				closeDialog={closeDialog}
				setDialogVisible={setDialogVisible}
				dialogVisible={dialogVisible}
				action={undefined}
			/>
		</>
	);
};

export default TabviewComponent;
