import { ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function GlassSelect({
    label,
    value,
    onChange,
    options = [],
    placeholder = "Pilih...",
    disabled = false,
    error = null,
    icon: Icon = null,
}) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectedOption = options.find((opt) => opt.value === value);

    return (
        <div>
            {label && (
                <label className="block text-gray-700 font-medium mb-2">
                    {label}
                </label>
            )}

            <div className="relative" ref={dropdownRef}>
                {/* Select Button */}
                <button
                    type="button"
                    onClick={() => !disabled && setIsOpen(!isOpen)}
                    disabled={disabled}
                    className={`glass-input w-full ${Icon ? "pl-12" : "pl-4"} pr-10 py-3 rounded-xl text-gray-900 text-left focus:outline-none transition-all ${
                        disabled
                            ? "opacity-50 cursor-not-allowed"
                            : "cursor-pointer hover:bg-white/30"
                    } ${error ? "border-red-400" : ""}`}
                >
                    {Icon && (
                        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
                    )}
                    <span
                        className={
                            selectedOption
                                ? "text-gray-900 font-medium"
                                : "text-gray-500"
                        }
                    >
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>
                    <ChevronDown
                        className={`absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 transition-transform ${
                            isOpen ? "rotate-180" : ""
                        }`}
                    />
                </button>

                {/* Dropdown Menu */}
                {isOpen && !disabled && (
                    <div className="absolute z-[100] w-full mt-2 bg-white backdrop-blur-sm rounded-xl shadow-2xl border border-gray-200 max-h-60 overflow-y-auto">
                        {options.length === 0 ? (
                            <div className="px-4 py-3 text-gray-500 text-center">
                                Tidak ada data
                            </div>
                        ) : (
                            options.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => {
                                        onChange(option.value);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full px-4 py-3 text-left transition-colors ${
                                        option.value === value
                                            ? "bg-water-100 text-water-900 font-medium"
                                            : "text-gray-700 hover:bg-gray-100"
                                    } first:rounded-t-xl last:rounded-b-xl`}
                                >
                                    {option.label}
                                </button>
                            ))
                        )}
                    </div>
                )}
            </div>

            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>
    );
}
