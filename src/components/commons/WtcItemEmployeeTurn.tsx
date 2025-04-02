import { format } from "date-fns-tz";
import { t } from "i18next";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import useWindowSize from "../../app/screen";
import { TurnModel } from "../../models/category/Turn.model";
import { fetchTurn, filterSearch, selectItemTurn } from "../../slices/turn.slice";
import HeaderList from "../HeaderList";
import LoadingIndicator from "../Loading";
import { itemListStyleInfo, itemsLineSpacing } from "../Theme";
import WtcEmptyBox from "./WtcEmptyBox";
import WtcItemCard from "./WtcItemCard";
const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
export default function WtcItemEmployeeTurn() {
	const turnState = useAppSelector((state) => state.turn);
	const dispatch = useAppDispatch();
	const screenSize = useWindowSize();
	const bodyHeight = screenSize.height;

	const handleClick = (item: TurnModel) => {
		if (turnState.item?._id === item._id) {
			dispatch(selectItemTurn(undefined));
		} else {
			dispatch(selectItemTurn(item));
		}
	};
	const menuItemService = (item: any) => {
		return (
			<div key={item._id} className={`row px-1`}>
				<div className="col-md-3 border-right-turn py-2 text-center">
					{format(item?.transDate, "hh:mm a", { timeZone })}
				</div>
				<div className="col-md-6 border-right-turn py-1" style={{ alignSelf: "center" }}>
					{item?.service?.displayName || "#"}
				</div>
				<div className="col-md-3 py-1 text-end" style={{ alignSelf: "center" }}>
					{item.turn}
				</div>
			</div>
		);
	};
	const fetchListLocal = () => {
		dispatch(fetchTurn(format(new Date(), "yyyy-MM-dd")));
		// dispatch(fetchTurn("2024-09-24"));
	};
	useEffect(() => {
		fetchListLocal();
	}, []);
	return (
		<>
			<div className="col-md-8 wtc-bg-turn px-0" style={{ borderRadius: 12, paddingTop: 9 }}>
				<div
					className="font-title-card wtc-bg-title d-flex align-items-center w-100 pb-1"
					style={{ maxHeight: 45 }}
				>
					<div className="flex-grow-1 mx-1">
						<HeaderList
							maxWidthSearch={"100%"}
							callback={fetchListLocal}
							hideAdd
							target=""
							placeHolderSearch={t("action.search_empl")}
							onSearchText={(text) => {
								dispatch(filterSearch({ searchString: text }));
							}}
							onAddNew={() => {}}
						/>
					</div>
				</div>
				<div className="m-0 h-100">
					{turnState.fetchState.status === "loading" ? (
						<div className="w-100 h-100 d-flex flex-column justify-content-center text-center">
							<LoadingIndicator />
						</div>
					) : (!turnState.filtered || turnState?.filtered.length) == 0 ? (
						<div className="w-100 h-100 d-flex flex-column justify-content-center">
							<WtcEmptyBox />
						</div>
					) : (
						<>
							<div className="pb-1 mb-1" style={{ height: bodyHeight - 285, overflowY: "auto" }}>
								<div className="row m-0 mb-1" style={{ overflowX: "hidden" }}>
									{turnState.filtered.map((item, index) => (
										<div key={index} className="bg-white m-0 p-0">
											<WtcItemCard
												target="USER"
												index={index}
												verticalSpacing={itemsLineSpacing}
												selected={item._id === turnState.item?._id}
												onDbClick={() => {}}
												onClick={() => {
													handleClick(item);
												}}
												uniqueId={item._id}
												status={"ACTIVE"}
												hideDeleteSwiper
												// onDelete={() => dispatch(deleteCustomer(item._id))}
												// onRestore={() => dispatch(restoreCustomer(item._id))}
												body={
													<div className="row align-items-center p-2">
														<div className="col-sm-6">
															<div style={itemListStyleInfo}>
																{item?.profile?.firstName} {item?.profile?.middleName}{" "}
																{item?.profile?.lastName}
															</div>
														</div>
														<div className="col-sm-6 text-truncate">
															<div className="w-100" style={itemListStyleInfo}>
																{t("total_turns")}: {item?.turns?.[0]?.totalTurn || 0}
															</div>
														</div>
													</div>
												}
											/>
										</div>
										// <div
										// 	className={`col-md-6 ${index % 2 == 0 ? "ps-2" : "pe-2"}`}
										// 	onClick={() => handleClick(item)}
										// 	style={{ backgroundColor: "#F4F4F4" }}
										// 	key={index}
										// >
										// 	{menuitem(item, index)}
										// </div>
									))}
								</div>
							</div>
						</>
					)}
				</div>
			</div>
			<div className="col-md-4 pt-0 wtc-bg-turn ps-1" style={{ borderLeft: "5px solid #fff", borderRadius: 12 }}>
				<div className="ps-1 h-100 mt-2">
					<>
						<div
							className="row header-list-employee-turn mx-0"
							style={{ alignItems: "center", border: "1px solid #dadff2" }}
						>
							<div className="col-md-3">{t("time")}</div>
							<div className="col-md-6">{t("service")}</div>
							<div className="col-md-3">{t("turn")}</div>
						</div>
						<div
							className="content-list-employee-turn"
							style={{
								height: bodyHeight - 285,
								overflowY: "auto",
								overflowX: "hidden",
								border: "1px solid #dadff2",
								borderRadius: "0 0 12px 12px",
							}}
						>
							{!turnState.item ||
							!turnState.item.turns[0] ||
							!turnState.item.turns[0].details ||
							turnState.item.turns[0].details.length === 0 ? (
								<div className="w-100 h-100 d-flex flex-column justify-content-center">
									<WtcEmptyBox />
								</div>
							) : (
								turnState.item.turns[0].details.map((item, index) => (
									<div style={{ backgroundColor: index % 2 == 0 ? "#f1f1f138" : "#FFF" }} key={index}>
										{menuItemService(item)}
									</div>
								))
							)}
						</div>
					</>
				</div>
			</div>
		</>
	);
}
