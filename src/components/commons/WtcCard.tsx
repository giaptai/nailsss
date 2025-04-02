import { useEffect, useRef, useState } from "react";
type WtcCardProps = {
	title?: JSX.Element;
	icon?: string;
	tools?: JSX.Element;
	body?: JSX.Element;
	footer?: JSX.Element;
	background?: string;
	hideBorder?: boolean;
	className?: string;
	classNameBody?: string;
	classNameFooter?: string;
	isPaging?: boolean;
	boldTitle?: boolean;
	borderRadius?: number;
};
export default function WtcCard(props: WtcCardProps) {
	const [height, setHeight] = useState(0);
	const preference = useRef<any>(null);
	useEffect(() => {
		setHeight(preference.current.clientHeight);
	}, []);

	return (
		<div
			ref={preference}
			className={`p-1 w-100 d-flex flex-column ${props.className}`}
			style={{
				background: props.background ? props.background : "#FFFFFF",
				borderRadius: props.borderRadius ? props.borderRadius : 20,
			}}
		>
			{props.title && (
				<div className="d-flex justify-content-between p-1  pt-1">
					<div className={`d-flex fs-5 fw-bold flex-grow-1`}>
						{!props.hideBorder && (
							<div
								className="me-2"
								style={{ width: 11, minHeight: 37, background: "#FFCA64", borderRadius: 6 }}
							></div>
						)}
						<div className={`align-self-center w-100`}>
							{props.icon && <i className={props.icon} />} {props.title}
						</div>
					</div>
					<div className="align-self-center">{props.tools}</div>
				</div>
			)}
			{props.body && (
				<div
					className={`${props.classNameBody ? props.classNameBody : "flex-grow-1 px-1 pb-2"}`}
					style={{
						height: height - 70 - (props.footer ? 62 : 0),
						overflowY: "auto",
						overflowX: "hidden",
						marginTop: "15px",
					}}
				>
					{props.body}
				</div>
			)}
			{props.footer && (
				<div
					className={`${props.classNameFooter ? props.classNameFooter : "d-flex justify-content-end p-2"}`}
					style={{ borderTop: props.footer ? "1px solid #e5e8f3" : undefined }}
				>
					{props.footer}
				</div>
			)}
		</div>
	);
}
