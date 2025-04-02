import { t } from "i18next";
import { Calendar } from "primereact/calendar";
import { Nullable } from "primereact/ts-helpers";
import { useState } from "react";
import { isMobile, isTablet } from "react-device-detect";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import WtcButton from "./WtcButton";

export type WtcTabsProps = {
	tabs: string[];
	contents: JSX.Element[];
	onChangeTab: (index: number) => void;
	activeTab?: number;
	height?: number;
};

export default function WtcTabsPayroll(props: WtcTabsProps) {
	const [active, setActive] = useState(props.activeTab ?? 0);
	const [startDate, setStartDate] = useState<Nullable<Date>>(new Date());
	const [endDate, setEndDate] = useState<Nullable<Date>>(new Date());
	const deactiveColor = "#E0E4EA";
	const deactiveColorText = "#5B6B86";
	const activeColor = "#FFCA64";
	const activeColorText = "#273672";
	// const fetchListLocal = () => {
	// 	if (startDate && endDate) {
	// 		const data = {
	// 			fromDate: convertToYYYYMMDD(startDate.toString()),
	// 			toDate: convertToYYYYMMDD(endDate.toString()),
	// 		};
	// 		dispatch(getPayrolls(data));
	// 	}
	// };
	// useEffect(() => {
	// 	fetchListLocal();
	// }, []);
	return (
		<Tabs defaultIndex={props.activeTab ?? 0}>
			<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
				<TabList style={{ display: "flex" }}>
					{props.tabs.map((item, index) => (
						<Tab
							key={index}
							style={{
								borderTopLeftRadius: 12,
								borderTopRightRadius: 12,
								background: index == active ? activeColor : deactiveColor,
								color: index == active ? activeColorText : deactiveColorText,
								padding: "10px 20px",
								cursor: "pointer",
							}}
							onClick={() => {
								setActive(index);
								props.onChangeTab(index);
							}}
						>
							{item}
						</Tab>
					))}
				</TabList>

				<div style={{ display: "flex", gap: "10px", justifyContent: "end" }}>
					<Calendar
						maxDate={endDate || new Date()}
						value={startDate}
						onChange={(e) => setStartDate(e.value)}
						style={{ maxHeight: 42, width: "30%" }}
						placeholder="From"
						showIcon
						iconPos="left"
						touchUI={isMobile || isTablet ? true : false}
					/>
					<Calendar
						minDate={startDate || new Date()}
						value={endDate}
						onChange={(e) => setEndDate(e.value)}
						style={{ maxHeight: 42, width: "30%" }}
						placeholder="To"
						showIcon
						iconPos="left"
						touchUI={isMobile || isTablet ? true : false}
					/>
					<WtcButton
						label={t("action.search")}
						className="bg-blue text-white me-2"
						icon="ri-search-line"
						fontSize={14}
						labelStyle={{ fontWeight: "bold" }}
						borderRadius={12}
						height={42}
						onClick={() => {}}
					/>
				</div>
			</div>

			{props.contents.map((item, index) => (
				<TabPanel
					key={index}
					style={{
						height: props.height ? props.height : undefined,
						background: "#F4F4F4",
						borderRadius: 10,
						paddingLeft: "0.5rem",
						paddingRight: "0.5rem",
						paddingTop: "0.5rem",
						paddingBottom: 18,
					}}
				>
					{item}
				</TabPanel>
			))}
		</Tabs>
	);
}
