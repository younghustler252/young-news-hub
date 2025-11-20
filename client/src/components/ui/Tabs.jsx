// src/components/ui/Tabs.jsx
import { motion, AnimatePresence } from "framer-motion";
import { Home, Image, Edit, Settings, Sliders } from "lucide-react";

const icons = {
  Overview: Home,
  "My Posts": Image,
  "Edit Profile": Edit,
  "Account Settings": Settings,
  Preferences: Sliders,
};

const Tabs = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <div className="relative flex overflow-x-auto bg-white/80 backdrop-blur-lg border border-gray-200 rounded-2xl shadow-sm p-1 sm:p-2">
      {tabs.map((tab) => {
        const Icon = icons[tab];
        const isActive = activeTab === tab;

        return (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 whitespace-nowrap ${
              isActive
                ? "text-blue-600 bg-blue-50 shadow-sm"
                : "text-gray-600 hover:text-blue-500 hover:bg-gray-50"
            }`}
          >
            {Icon && <Icon size={18} />}
            <span>{tab}</span>
            {isActive && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 rounded-xl bg-blue-100/40 -z-10"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default Tabs;
