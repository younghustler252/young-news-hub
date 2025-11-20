// components/profile/PreferencesTab.jsx
const PreferencesTab = ({ preferences, onTogglePreference }) => {
  const handleChange = (key) => {
    onTogglePreference(key, !preferences[key]);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Preferences</h2>

      {Object.keys(preferences).length === 0 && <p>No preferences set.</p>}

      {Object.entries(preferences).map(([key, value]) => (
        <div key={key} className="flex items-center justify-between">
          <span className="capitalize">{key.replace(/_/g, " ")}</span>
          <input
            type="checkbox"
            checked={value}
            onChange={() => handleChange(key)}
          />
        </div>
      ))}
    </div>
  );
};

export default PreferencesTab;
