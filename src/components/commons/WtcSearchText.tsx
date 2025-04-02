import searchIcon from "../../assets/svg/search.svg";
import WtcInputText from "./WtcInputText";
export type WtcSearchInputProps = {
	placeholder: string;
	value?: string;
	onChanged: (val: any) => void;
	height?: number;
};
export default function WtcSearchInput(props: WtcSearchInputProps) {
	return (
		<WtcInputText
			value={props.value || ""}
			border="1px solid #DADFF2"
			height={props.height ? props.height : 30}
			borderRadius={12}
			padding="20px 16px 18px 35px"
			leadingIconImage={searchIcon}
			// trailIcon={<img src={filterIcon} />}
			iconStyle={{ top: 0, left: 10 }}
			trailIconStyle={{ top: 3, right: 15 }}
			fontSize={14}
			placeHolder={props.placeholder}
			onChange={props.onChanged}
		/>
	);
}
