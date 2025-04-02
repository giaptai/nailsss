import { useEffect, useRef, useState } from "react";
import useWindowSize from "../../app/screen";

type BodyProps = {
	header?: JSX.Element;
	body: JSX.Element;
};
export default function Body(props: BodyProps) {
	const screenSize = useWindowSize();
	const bodyHeight = screenSize.height - 76;
	const ref = useRef<any>(null);
	const [height, setHeight] = useState(0);
	useEffect(() => {
		setHeight(ref.current.clientHeight);
	});
	return (
		<div className="d-flex flex-column">
			<div className="row mb-2" ref={ref}>
				<div className="col-sm-12">{props.header}</div>
			</div>
			<div className="row" style={{ height: bodyHeight - height - 30 }}>
				{props.body}
			</div>
		</div>
	);
}
