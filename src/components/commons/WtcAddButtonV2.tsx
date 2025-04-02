import WtcRoleButton from "./WtcRoleButtonV2";
export type WtcAddButtonProps = {
	target: string;
	action: string;
	label: string;
	onClick: () => void;
	onKeyDown?: (e: React.KeyboardEvent) => void;
	className?: string;
	backgroundColor?: string;
	textColor?: string;
	height?: number;
};
export default function WtcAddButton(props: WtcAddButtonProps) {
	return (
		<WtcRoleButton
			tabIndex={0}
			className={`wtc-bg-white text-blue wtc-hidden`}
			target={props.target}
			action="INS"
			labelStyle={{ fontWeight: "normal" }}
			label={props.label}
			icon={"ri-add-fill"}
			height={props.height ? props.height : 35}
			fontSize={16}
			minWidth={100}
			onClick={props.onClick}
			onKeyDown={props.onKeyDown}
			backgroundColor={props.backgroundColor}
			textColor={props.textColor}
			heightIcon={30}
		/>
	);
}
