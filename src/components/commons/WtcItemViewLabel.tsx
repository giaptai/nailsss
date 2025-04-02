type WtcItemViewLabelProps = {
	icon?: string;
	label?: string;
	value: string;
	classNameValue?: string;
};

export default function WtcItemViewLabel(props: WtcItemViewLabelProps) {
	return (
		<div className={"mt-2 p-2 wtc-bg-white rounded-4 w-100 position-relative"}>
			<div className="d-flex align-items-center">
				{props?.icon && <i className={`${props?.icon || "#"} p-2 wtc-text-primary fs-3`}></i>}
				<div className="flex flex-column ms-0 gap-2 w-100">
					{props.label && (
						<div>
							<label className="fs-value" htmlFor="inputtext" style={{ color: "#5B6B86" }}>
								{props.label}
							</label>
						</div>
					)}
					<div>
						<label
							className={props?.classNameValue || undefined}
							htmlFor="inputtext"
							style={{ color: "#5B6B86" }}
						>
							{props?.value || "#"}
						</label>
					</div>
				</div>
			</div>
		</div>
	);
}
