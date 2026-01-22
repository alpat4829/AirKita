import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "@inertiajs/react";

export default function Pagination({ links, from, to, total }) {
    if (!links || links.length <= 3) {
        // Don't show pagination if there's only one page
        return null;
    }

    return (
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Info text */}
            <div className="text-sm text-gray-600">
                Menampilkan <span className="font-semibold">{from}</span> -{" "}
                <span className="font-semibold">{to}</span> dari{" "}
                <span className="font-semibold">{total}</span> depot
            </div>

            {/* Pagination buttons */}
            <div className="flex items-center space-x-2">
                {links.map((link, index) => {
                    // Skip if no URL (disabled state)
                    if (!link.url) {
                        return (
                            <button
                                key={index}
                                disabled
                                className="px-4 py-2 rounded-xl bg-gray-100 text-gray-400 cursor-not-allowed"
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        );
                    }

                    // Active state
                    if (link.active) {
                        return (
                            <button
                                key={index}
                                className="px-4 py-2 rounded-xl glass-button text-white font-medium"
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        );
                    }

                    // Regular link
                    return (
                        <Link
                            key={index}
                            href={link.url}
                            preserveScroll
                            className="px-4 py-2 rounded-xl bg-white/50 hover:bg-white/80 text-gray-700 hover:text-gray-900 transition-all duration-200 font-medium"
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    );
                })}
            </div>
        </div>
    );
}
