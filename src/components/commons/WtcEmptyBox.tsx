import emptyBox from "../../assets/images/empty/empty_box_1.svg";
import { i18Get } from "../../utils/string.ultil";
export default function WtcEmptyBox() {
	return (
		<div className=" d-flex justify-content-center">
			<div className="text-center" style={{ height: 150, padding: 20 }}>
				<img src={emptyBox} style={{ width: 70, height: 70 }} alt="" />
				<div className="mt-2" style={{ opacity: 0.5 }}>
					{i18Get("no_data")}
				</div>
			</div>
		</div>
	);
}
