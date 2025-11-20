// components/ui/TabbedLayout.jsx
import React from 'react';

const TabbedLayout = ({ tabs, activeTab, onTabChange }) => {
	return (
		<nav className="border-b border-gray-300 flex space-x-8" role="tablist">
			{tabs.map((tab) => (
				<button
					key={tab}
					className={`pb-3 ${
						activeTab === tab
							? 'border-b-4 border-green-600 text-green-700 font-semibold'
							: 'text-gray-600 hover:text-green-600'
					}`}
					onClick={() => onTabChange(tab)}
					role="tab"
					aria-selected={activeTab === tab}
				>
					{tab}
				</button>
			))}
		</nav>
	);
};

export default TabbedLayout;
