import { Button } from "primereact/button";
type IconButtonProps = {
	icon: string;
	className?: string;
	ariaLabel?: string;
	onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
	width?: string | number;
	height?: string | number;
	actived: boolean;
	tooltip?: string;
	tabIndex?: number;
	onKeydown?: VoidFunction;
};
export default function IconButton(props: IconButtonProps) {
	return (
		<Button
			tabIndex={props.tabIndex ? props.tabIndex : -1}
			onKeyDown={(e) => {
				if (e.key === "Enter") {
					props.onKeydown;
				}
			}}
			tooltipOptions={{ position: "bottom" }}
			tooltip={props.tooltip}
			icon={props.icon}
			className={`rounded-circle ${props.className ?? ""} ${props.actived ? "actived" : ""}`}
			aria-label={props.ariaLabel ?? ""}
			style={{ width: props.width, height: props.height }}
			onClick={props.onClick}
		/>
	);
}
