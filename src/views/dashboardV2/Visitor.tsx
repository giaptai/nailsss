import { ChevronDown, X } from "lucide-react";
import { useState } from "react";

const Visitor = ({ showSidebar, setShowSidebar }: { showSidebar: boolean; setShowSidebar: (e: boolean) => void }) => {
	const [activeTab, setActiveTab] = useState("serving");

	const visitorTabs = [
		{ id: "serving", label: "Serving (122)" },
		{ id: "upcoming", label: "Upcoming (23)" },
		{ id: "finished", label: "Finished (23)" },
	];

	const visitors = [
		{
			id: 1,
			name: "Sonia Hoppe",
			phone: "(090) 909 0909",
			employee: "Mia Jones",
			services: ["Luxury Pedicure", "Dipping Powder", "Nail Repair"],
			totalServices: 3,
		},
		{
			id: 2,
			name: "Sophia Helen",
			phone: "(025) 123 4654",
			employee: "Amanda Bynes",
			totalServices: 5,
		},
		{
			id: 3,
			name: "Amanda Seyfried",
			phone: "(043) 342 0432",
			employee: "Cindy Crawford",
			totalServices: 13,
		},
		{
			id: 4,
			name: "Billie Eilish",
			phone: "(023) 193 2319",
			employee: "Cara Delevingne",
			totalServices: 2,
		},
		{
			id: 5,
			name: "Cardi B",
			phone: "(090) 909 0909",
			employee: "Emma Stone",
			totalServices: 4,
		},
	];

	const [expandedVisitor, setExpandedVisitor] = useState<number | null>(1);
	return (
		<div
			className={`h-100 p-2`}
			style={{
				width: "512px",
				zIndex: 0,
				backgroundColor: "#F4F4F4",
				transition: "all 0.3s ease-in-out",
				display: showSidebar ? "block" : "none",
			}}
		>
			<div className="d-flex flex-column h-100 p-2">
				<div className="p-3 d-flex justify-content-between align-items-center">
					<h6 className="m-0 fw-bold" style={{ color: "#696E79", fontSize: "16px", fontWeight: "400" }}>
						VISITOR'S STATUS
					</h6>
					<button
						className="btn btn-link p-0"
						style={{ color: "#3E4451" }}
						onClick={() => setShowSidebar(false)}
					>
						<X size={20} />
					</button>
				</div>
				<div className="bg-white" style={{ borderRadius: "8px", padding: "20px" }}>
					<div className="d-flex gap-2 mb-3" style={{ overflowX: "auto", scrollbarWidth: "none" }}>
						{visitorTabs.map((tab) => (
							<button
								key={tab.id}
								className={`btn flex-grow-1`}
								onClick={() => setActiveTab(tab.id)}
								style={{
									borderRadius: "8px",
									padding: "16px",
									maxHeight: "52px",
									fontSize: "16px",
									textWrap: "nowrap",
									backgroundColor: activeTab === tab.id ? "#E7EFF8" : "#F0F2F4",
									color: activeTab === tab.id ? "#1160B7" : "#2D313B",
									outline: "none",
									border: "none",
								}}
							>
								{tab.label}
							</button>
						))}
					</div>
					<div className="flex-grow-1" style={{ overflowY: "auto", height: "660px", scrollbarWidth: "none" }}>
						{visitors.map((visitor) => (
							<div
								key={visitor.id}
								className="mb-3"
								style={{
									borderRadius: "8px",
									border: "1px solid #DDDFE5",
								}}
							>
								<div
									className="d-flex align-items-center mb-2"
									style={{
										padding: "12px 12px 8px 12px",
										borderBottom: "1px solid #DDDFE5",
									}}
								>
									<div className="me-3">
										<img
											src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
												visitor.name
											)}&background=random`}
											alt={visitor.name}
											className="rounded-circle"
											width="48"
											height="48"
										/>
									</div>
									<div className="flex-grow-1">
										<h6 className="mb-1" style={{ fontSize: "18px", fontWeight: "600" }}>
											{visitor.name}
										</h6>
										<small className="text-muted" style={{ fontSize: "16px", fontWeight: "400" }}>
											{visitor.phone}
										</small>
									</div>
								</div>

								<div
									style={{
										padding: "8px 12px 12px 12px",
									}}
								>
									<div className="d-flex justify-content-between align-items-center mb-2">
										<small
											className="text-muted"
											style={{
												fontSize: "16px",
												fontWeight: "400",
											}}
										>
											Employee:
										</small>
										<span
											className="ms-2"
											style={{
												fontSize: "16px",
												fontWeight: "600",
											}}
										>
											{visitor.employee}
										</span>
									</div>
									<div
										className="w-100 h-100"
										style={{
											padding: "8px 12px",
											backgroundColor: "#F4F4F4",
											borderRadius: "8px",
										}}
									>
										<button
											className="btn btn-link p-0 text-dark d-flex justify-content-between align-items-center w-100 text-decoration-none"
											onClick={() =>
												setExpandedVisitor(expandedVisitor === visitor.id ? null : visitor.id)
											}
										>
											<small
												className="me-2"
												style={{
													fontSize: "16px",
													fontWeight: "400",
												}}
											>
												Total service ({visitor.totalServices})
											</small>
											<ChevronDown
												size={12}
												style={{
													color: "#3E4451",
													transform:
														expandedVisitor === visitor.id ? "rotate(180deg)" : "rotate(0)",
													transition: "transform 0.3s",
												}}
											/>
										</button>
										<div className="d-flex flex-column gap-3">
											{expandedVisitor === visitor.id && visitor.services && (
												<ul className="list-unstyled mb-0">
													{visitor.services.map((service, index) => (
														<li key={index} className="mb-1">
															<small>• {service}</small>
														</li>
													))}
												</ul>
											)}
										</div>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Visitor;
