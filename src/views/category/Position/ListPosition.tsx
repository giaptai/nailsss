import { t } from "i18next";
import WtcCard from "../../../components/commons/WtcCard";
import { useAppSelector } from "../../../app/hooks";
import Square from "../Window/Square";
import { WindowModel } from "../../../models/category/Window.model";
import { useEffect, useState } from "react";
import { fetchWindow } from "../../../slices/window.slice";
import { useDispatch } from "react-redux";
import { fetchUsers } from "../../../slices/user.slice";
import useWindowSize from "../../../app/screen";

export default function ListPosition() {
	const windows = useAppSelector((state) => state.window);
	const userState = useAppSelector((state) => state.user);
	const screenSize = useWindowSize();
	const dispatch = useDispatch();
	const w = windows.list.filter((item) => item.type == "EMPLOYEE" && item.status.code == "ACTIVE");
	const [windowSelected, setwindowSelected] = useState(w[0]);
	const [activeItem, setActiveItem] = useState(windowSelected?.name);
	const handleItemClick = (item: any) => {
		setActiveItem(item.name);
		setwindowSelected(item);
	};
	const getUserAtPosition = (position: number) => {
		return userState.list
			.filter((user) => user.profile.positionWindow?._id == windowSelected?._id)
			.find((user) => user.profile?.positionPoint === position);
	};
	useEffect(() => {
		// dispatch(getAvatarEmployee(userState.item?._id));
		dispatch(fetchWindow());
		dispatch(fetchUsers());
	}, []);
	useEffect(() => {
		if (!windowSelected && w.length > 0) {
			setwindowSelected(w[0]);
			setActiveItem(w[0].name);
		}
	}, [windows]);

	return (
		<div style={{ height: screenSize.height - 90 }}>
			<WtcCard
				className="h-100"
				borderRadius={12}
				classNameBody="flex-grow-1 px-2 pb-0 my-0"
				title={
					<div className="row bg-white boxContainer" style={{ textAlign: "center" }}>
						{windows.list
							.filter((item) => item.type == "EMPLOYEE" && item.status.code == "ACTIVE")
							.map((item: WindowModel, index) => {
								return (
									<div key={index} className="col boxItem">
										<div
											tabIndex={index + 1}
											key={item.code}
											onClick={() => handleItemClick(item)}
											className={`col clickable ${
												activeItem === item.name ? "my-active-title" : ""
											}`}
											onKeyDown={(e) => {
												if (e.key === "Enter") {
													e.preventDefault();
													handleItemClick(item);
												}
											}}
										>
											<span
												className={` rounded-circle d-inline-block text-center circle-rounded ${
													activeItem === item.name ? "my-active-index" : ""
												}`}
											>
												{index + 1}
											</span>
											&ensp;<span className="text-color-gray">{item.name}</span>
										</div>
									</div>
								);
							})}
					</div>
				}
				tools={<></>}
				body={
					<div className="row bg-white" style={{ height: screenSize.height - 183 }}>
						{windows.list.filter((item) => item.type == "EMPLOYEE" && item.status.code == "ACTIVE").length >
						0 ? (
							Array.from({ length: 20 }).map((_, index) => {
								const user = getUserAtPosition(index + 1);
								return (
									<Square
										height={(screenSize.height - 145) / 5}
										isUSer={false}
										key={index}
										index={index}
										selected={null}
										onClick={() => {}}
										user={user?.profile}
									/>
								);
							})
						) : (
							<div className="text-center">{t("windows_empty")}</div>
						)}
					</div>
				}
				hideBorder={true}
			/>
		</div>
	);
}
