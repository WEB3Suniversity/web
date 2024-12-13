"use client";


interface FilterOption {
  id: string;
  label: string;
}

interface FilterBarProps {
  options: FilterOption[];
  activeFilter: string;
  className?: string;
  onFilterChange: (id: string) => void;
}

const FilterBar = ({
  options,
  activeFilter,
  onFilterChange,
  className = '',
}: FilterBarProps) => {
  return (
    <div
      className={`flex flex-wrap gap-3 p-4 bg-white rounded-xl shadow-sm ${className}`}
    >
      {options.map((option) => (
        <button
          key={option.id}
          className={`
                px-6 py-2.5 rounded-lg font-medium transition-all duration-200
                ${
                  activeFilter === option.id
                    ? "bg-gradient-to-r from-[#2563EB] to-[#7C3AED] text-white"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                }
              `}
          onClick={() => onFilterChange(option.id)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default FilterBar;
