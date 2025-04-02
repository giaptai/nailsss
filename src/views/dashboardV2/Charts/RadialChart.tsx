import React from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import useWindowSize from "../../../app/screen";

interface RadialBarChartProps {
	percentage: number;
}

const RadialBarChart: React.FC<RadialBarChartProps> = ({ percentage }) => {
	const screenSize = useWindowSize();
	const chartOptions: ApexOptions = {
		chart: {
			type: "radialBar",
			height: 250,
		},
		plotOptions: {
			radialBar: {
				hollow: {
					size: "70%",
				},
				dataLabels: {
					name: {
						show: false,
					},
					value: {
						color: "#283673",
						fontWeight: "bold",
						fontSize: "35px",
						show: true,
						formatter: function (val) {
							return `${val}%`;
						},
						offsetY: 15,
					},
				},
				track: {
					show: true,
					background: "#e7e7e7",
					strokeWidth: "200%",
					margin: 5, // margin is in pixels
				},
			},
		},
		fill: {
			colors: ["#283673"],
		},
		stroke: {
			lineCap: "round",
		},
		labels: ["Progress"],
	};

	const chartSeries = [percentage];

	return (
		<Chart
			options={chartOptions}
			series={chartSeries}
			type="radialBar"
			height={screenSize.height - 500 < 180 ? 180 : screenSize.height - 500}
		/>
	);
};

export default RadialBarChart;
