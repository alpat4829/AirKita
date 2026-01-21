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
                <label className="block text-white/60 font-medium mb-2">
                    {label}
                </label>
            )}

            <div className="relative" ref={dropdownRef}>
                {/* Select Button */}
                <button
                    type="button"
                    onClick={() => !disabled && setIsOpen(!isOpen)}
                    disabled={disabled}
                    className={`glass-input w-full ${Icon ? "pl-12" : "pl-4"} pr-10 py-3 rounded-xl text-white text-left focus:outline-none transition-all ${
                        disabled
                            ? "opacity-50 cursor-not-allowed"
                            : "cursor-pointer hover:bg-white/25"
                    } ${error ? "border-red-400" : ""}`}
                >
                    {Icon && (
                        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
                    )}
                    <span
                        className={
                            selectedOption ? "text-white" : "text-white/50"
                        }
                    >
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>
                    <ChevronDown
                        className={`absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black/60 transition-transform ${
                            isOpen ? "rotate-180" : ""
                        }`}
                    />
                </button>

                {/* Dropdown Menu */}
                {isOpen && !disabled && (
                    <div className="absolute z-50 w-full mt-2 bg-water-900/30 text-white backdrop-blur-sm  rounded-xl shadow-xl max-h-60 overflow-y-auto">
                        {options.length === 0 ? (
                            <div className="px-4 py-3 text-white/60 text-center">
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
                                            ? "bg-water-700/30 text-white"
                                            : "text-white/80 hover:bg-white/10"
                                    } first:rounded-t-xl last:rounded-b-xl`}
                                >
                                    {option.label}
                                </button>
                            ))
                        )}
                    </div>
                )}
            </div>

            {error && <p className="mt-2 text-sm text-red-300">{error}</p>}
        </div>
    );
}
