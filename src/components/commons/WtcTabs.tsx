import { useState } from "react";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";

export type WtcTabsProps = {
	tabs: string[];
	contents: JSX.Element[];
	onChangeTab: (index: number) => void;
	activeTab?: number;
	classNameTabs?: string;
	backgroundPanel?: string;
};

export default function WtcTabs(props: WtcTabsProps) {
	const [active, setActive] = useState(props.activeTab ?? 0);
	const deactiveColor = "#E0E4EA";
	const deactiveColorText = "#5B6B86";
	const activeColor = "#FFCA64";
	const activeColorText = "#273672";
	return (
		<Tabs className={props.classNameTabs} defaultIndex={props.activeTab ?? 0}>
			<TabList>
				{props.tabs.map((item, index) => (
					<Tab
						key={index}
						style={{
							borderTopLeftRadius: 12,
							borderTopRightRadius: 12,
							background: index == active ? activeColor : deactiveColor,
							color: index == active ? activeColorText : deactiveColorText,
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

			{props.contents.map((item, index) => (
				<TabPanel
					key={index}
					style={{
						background: props.backgroundPanel,
						borderTopRightRadius: "10px",
						borderBottomLeftRadius: "10px",
						borderBottomRightRadius: "10px",
					}}
				>
					{item}
				</TabPanel>
			))}
		</Tabs>
	);
}
