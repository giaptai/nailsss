import { Spinner } from "react-bootstrap";

export default function LoadingIndicator() {
	return (
		<div className="w-100 h-100 text-blue d-flex align-items-center justify-content-center">
			<Spinner />
		</div>
	);
}
