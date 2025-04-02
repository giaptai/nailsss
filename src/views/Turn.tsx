import TurnTable from "../components/turn/TurnTable";
export default function Turn() {
	return (
		<>
			<div className="row m-0 turn-page h-100">
				<div className="col-12 h-100 my-border-radius">
					<div
						className="my-scrollbar h-100"
						style={{ overflow: "auto", maxHeight: "calc(100vh - 76px - 45px)", borderRadius: 24 }}
					>
						<TurnTable />
					</div>
				</div>
			</div>
		</>
	);
}
