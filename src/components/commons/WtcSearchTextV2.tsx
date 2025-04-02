import searchIcon from "../../assets/svg/search.svg";
import WtcInputText from "./WtcInputTextV2";
export type WtcSearchInputProps = {
	placeholder: string;
	onChanged: (val: any) => void;
	height?: number;
	radius?: number;
};
export default function WtcSearchInput(props: WtcSearchInputProps) {
	return (
		<WtcInputText
			value={""}
			border="1px solid #DADFF2"
			height={props.height ? props.height : 30}
			borderRadius={props.radius ? props.radius : 12}
			padding="20px 16px 18px 40px"
			leadingIconImage={searchIcon}
			iconStyle={{ top: 10, left: 10, width: "24px", height: "24px" }}
			trailIconStyle={{ top: 3, right: 15 }}
			fontSize={18}
			placeHolder={props.placeholder}
			onChange={props.onChanged}
		/>
	);
}
