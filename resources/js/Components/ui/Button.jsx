import { cn } from "@/lib/utils";

export function Button({
    className,
    variant = "default",
    size = "default",
    children,
    ...props
}) {
    const variants = {
        default:
            "bg-primary-600 text-white hover:bg-primary-700 shadow-md hover:shadow-lg",
        primary:
            "bg-water-500 text-white hover:bg-water-600 shadow-md hover:shadow-lg",
        outline:
            "border-2 border-primary-600 text-primary-600 hover:bg-primary-50",
        ghost: "hover:bg-gray-100 text-gray-700",
        link: "text-primary-600 underline-offset-4 hover:underline",
    };

    const sizes = {
        default: "px-6 py-3 text-base",
        sm: "px-4 py-2 text-sm",
        lg: "px-8 py-4 text-lg",
        icon: "p-2",
    };

    return (
        <button
            className={cn(
                "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
                variants[variant],
                sizes[size],
                className,
            )}
            {...props}
        >
            {children}
        </button>
    );
}
