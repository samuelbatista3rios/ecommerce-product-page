const VariantSelector = ({ name, options, selectedValue, onChange }) => {
  const formattedName = name.charAt(0).toUpperCase() + name.slice(1);

  return (
    <div>
      <h3 className="text-sm font-medium text-gray-900 mb-2">
        {formattedName}
      </h3>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`px-4 py-2 border rounded-md text-sm font-medium ${
              selectedValue === option
                ? "bg-blue-100 border-blue-500 text-blue-700"
                : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default VariantSelector;
