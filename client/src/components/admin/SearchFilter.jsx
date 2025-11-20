const SearchFilter = ({ value, onChange, filterOptions }) => (
  <div className="flex flex-col md:flex-row gap-4 items-center">
    <div className="relative w-full md:w-72">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search..."
        className="pl-3 pr-3 py-2 w-full border rounded-lg focus:ring focus:ring-blue-200 focus:outline-none"
      />
    </div>

    {filterOptions && (
      <select
        onChange={(e) => filterOptions.onChange(e.target.value)}
        value={filterOptions.value}
        className="border rounded-lg px-3 py-2 focus:ring focus:ring-blue-200 focus:outline-none"
      >
        {filterOptions.options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    )}
  </div>
);
