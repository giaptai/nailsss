type Props = {
	label: string;
};

export default function WtcHeaderTitle(props: Props) {
	return (
		<div className="d-flex justify-content-between">
			<div className={`d-flex fs-5 fw-bold flex-grow-1`}>
				<div
					className="me-2"
					style={{ width: 11, minHeight: 37, background: "#FFCA64", borderRadius: 6 }}
				></div>
				<div className={`align-self-center w-100`}>{props?.label || "#"}</div>
			</div>
		</div>
	);
}
