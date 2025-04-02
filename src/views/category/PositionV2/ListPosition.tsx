import useWindowSize from "../../../app/screen";
import TabviewComponent from "./TabView";

export default function ListPosition() {
	const screenSize = useWindowSize();
	return (
		<div style={{ height: screenSize.height - 90 }}>
			<TabviewComponent />
			{/* <WtcCard
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
					// <div className="row bg-white" style={{ height: screenSize.height - 183 }}>
					// 	{windows.list.filter((item) => item.type == "EMPLOYEE" && item.status.code == "ACTIVE").length >
					// 	0 ? (
					// 		Array.from({ length: 20 }).map((_, index) => {
					// 			const user = getUserAtPosition(index + 1);
					// 			return (
					// 				<Square
					// 					height={(screenSize.height - 145) / 5}
					// 					isUSer={false}
					// 					key={index}
					// 					index={index}
					// 					selected={null}
					// 					onClick={() => {}}
					// 					user={user?.profile}
					// 				/>
					// 			);
					// 		})
					// 	) : (
					// 		<div className="text-center">{t("windows_empty")}</div>
					// 	)}
					// </div>
					<div className="row bg-white" style={{ height: screenSize.height - 183 }}>
						{Array.from({ length: 20 }).map((_, index) => {
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
						})}
					</div>
				}
				hideBorder={true}
			/> */}
		</div>
	);
}
