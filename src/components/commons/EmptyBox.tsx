type EmptyBoxProps = {
	description: JSX.Element;
	image: string;
	disabled: boolean;
};
export default function EmptyBox(props: EmptyBoxProps) {
	return (
		<div className="text-center" style={{ pointerEvents: props.disabled ? "none" : "unset" }}>
			<img src={props.image} height={90} />
			<div style={{ opacity: 0.5 }}>{props.description}</div>
		</div>
	);
}
