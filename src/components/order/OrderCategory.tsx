import { t } from "i18next";
import { DataView } from "primereact/dataview";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../app/hooks";
import useWindowSize from "../../app/screen";
import { phoneGuestCustomer } from "../../const";
import { MenuModel } from "../../models/category/Menu.model";
import { ServiceModel } from "../../models/category/Service.model";
import { getHistoryCustomer } from "../../slices/newOder.slice";
import { filterListMenuActive, selectorderItem, setListServiceWithOrder } from "../../slices/menu.slice";
import { filterSearchOrder, setSelectedService } from "../../slices/service.slice";
import WtcButton from "../commons/WtcButton";
import WtcCard from "../commons/WtcCard";
import WtcEmptyBox from "../commons/WtcEmptyBox";
import WtcProduct from "../commons/WtcProduct";
import LoadingIndicator from "../Loading";
import DialogHistoryCustomer from "./DialogHistoryCustomer";

export default function OrderCategory() {
	const screenSize = useWindowSize();
	const dispatch = useDispatch();
	const serviceState = useAppSelector((state) => state.service);
	const menuState = useAppSelector((state) => state.menu);
	const newOderState = useAppSelector((state) => state.newOder);
	const [searchString, _setSearchString] = useState("");
	const [selectedService, setselectedService] = useState<ServiceModel[]>([]);
	const [selectedType, _setSelectedType] = useState<string[]>([]);
	const bodyHeight = screenSize.height;
	const [showHistoryCustomer, setShowHistoryCustomer] = useState(false);

	const itemTemplate = (item: any, _layout: "grid" | "list") => {
		if (!item) {
			return;
		}
		return gridItem(item);
	};
	const gridItem = (item: MenuModel) => {
		return (
			<WtcProduct
				active={(menuState.orderItem && menuState?.orderItem._id === item._id) || false}
				data={item}
				index={item._id}
				onClick={() => {
					// handleClickService(item)
					handleClickMenu(item);
				}}
			/>
		);
	};
	const handleClickMenu = (item: MenuModel) => {
		dispatch(selectorderItem(item));
		dispatch(
			setListServiceWithOrder(serviceState.list.filter((a) => a.menuId == item?._id && a.status.code == "ACTIVE"))
		);
	};
	const handleClickHistoryCustomer = () => {
		dispatch(getHistoryCustomer(newOderState.customer?._id));
		setShowHistoryCustomer(true);
	};
	useEffect(() => {
		dispatch(filterSearchOrder({ searchString, selectedType }));
	}, [selectedType, searchString]);
	useEffect(() => {
		dispatch(setSelectedService(selectedService));
	}, [selectedService]);
	useEffect(() => {
		setselectedService(serviceState.selectedService);
	}, [serviceState]);
	useEffect(() => {
		dispatch(filterListMenuActive());
	}, [menuState.list]);
	useEffect(() => {
		dispatch(selectorderItem(undefined));
		dispatch(setListServiceWithOrder(undefined));
	}, []);
	useEffect(() => {
		if (serviceState.fetchState) {
			switch (serviceState.fetchState.status!) {
				case "completed":
					handleClickMenu(menuState?.filtered?.[0]);
					break;
			}
		}
	}, [serviceState.fetchState]);
	return (
		<>
			<div className="my-background-order" style={{ borderRadius: "12px", height: bodyHeight - 196 }}>
				<WtcCard
					borderRadius={12}
					classNameBody="flex-grow-1 px-0 my-0 "
					body={
						<div className={`d-flex flex-column`}>
							<div
								className="p-2"
								style={{ height: bodyHeight - 225, overflowY: "auto", overflowX: "hidden" }}
							>
								{serviceState.fetchState.status == "loading" ? (
									<div className="w-100 h-100 d-flex flex-column justify-content-center text-center">
										<LoadingIndicator />
									</div>
								) : menuState.filteredActiveOrder.length > 0 ? (
									<DataView
										value={menuState.filteredActiveOrder}
										itemTemplate={itemTemplate}
										layout={"grid"}
										header={<></>}
									/>
								) : (
									<div className="w-100 h-100 d-flex flex-column justify-content-center text-center">
										<WtcEmptyBox />
									</div>
								)}
							</div>
						</div>
					}
					className="h-100"
				/>
			</div>
			<div className="row mt-1" style={{ height: 50 }}>
				<div className="col-sm-12 mt-1">
					<WtcButton
						disabled={newOderState.customer?.phone == phoneGuestCustomer}
						label={t("cus_his")}
						className="fs-value w-100 text-white wtc-bg-primary"
						height={40}
						onClick={handleClickHistoryCustomer}
					/>
				</div>
			</div>
			{showHistoryCustomer == true && (
				<DialogHistoryCustomer
					onClose={() => setShowHistoryCustomer(false)}
					item={newOderState.historyCustomer}
				/>
			)}
		</>
	);
}
