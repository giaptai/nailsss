import React from "react";

interface ProgressBarProps {
	percentage: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ percentage }) => {
	const progressBarHeight = 32;

	return (
		<div style={{ width: "100%", display: "flex", flexDirection: "column", marginTop: "12px" }}>
			<div
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					marginBottom: "-10px",
				}}
			>
				<p style={{ fontSize: "16px", color: "#212529" }}>
					Total reach:{" "}
					<span style={{ color: "#000000", fontSize: "18px", fontWeight: "400" }}>{percentage}%</span>
				</p>
				<p style={{ color: "#696E79", fontSize: "16px" }}>{100 - percentage}% to reach 100%</p>
			</div>
			<div
				style={{
					width: "100%",
					backgroundColor: "#e7e7e7",
					borderRadius: "10px",
					overflow: "hidden",
					position: "relative",
					height: `${progressBarHeight}px`,
				}}
			>
				<div
					style={{
						width: `${percentage}%`,
						backgroundColor: "#0056b3",
						height: "100%",
						transition: "width 0.3s ease-in-out",
						borderRadius: "10px 0 0 10px",
					}}
				></div>
			</div>
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					marginTop: "8px",
					fontSize: "12px",
					color: "#666",
				}}
			>
				<span>Achieved</span>
				<span>Remaining target</span>
			</div>
		</div>
	);
};

export default ProgressBar;
