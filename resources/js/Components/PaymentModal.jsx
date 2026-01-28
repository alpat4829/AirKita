import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { CreditCard, Wallet, X } from "lucide-react";

export default function PaymentModal({
    isOpen,
    onClose,
    onSelectPayment,
    saldo,
    totalPrice,
}) {
    const canPayWithSaldo = saldo >= totalPrice;

    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
            {/* The backdrop, rendered as a fixed sibling to the panel container */}
            <div
                className="fixed inset-0 bg-black/30 backdrop-blur-sm"
                aria-hidden="true"
            />

            {/* Full-screen scrollable container */}
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <DialogPanel className="relative bg-white rounded-2xl max-w-md w-full p-6 shadow-xl mx-auto">
                    <div className="flex justify-between items-center mb-6">
                        <DialogTitle className="text-xl font-bold text-gray-900">
                            Pilih Pembayaran
                        </DialogTitle>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-500 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="space-y-4">
                        {/* Summary */}
                        <div className="bg-gray-50 p-4 rounded-xl mb-4">
                            <p className="text-sm text-gray-500">
                                Total Pembayaran
                            </p>
                            <p className="text-2xl font-bold text-gray-900">
                                Rp{" "}
                                {new Intl.NumberFormat("id-ID").format(
                                    totalPrice,
                                )}
                            </p>
                        </div>

                        {/* Saldo Option */}
                        <button
                            onClick={() =>
                                canPayWithSaldo && onSelectPayment("Saldo")
                            }
                            disabled={!canPayWithSaldo}
                            className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                                canPayWithSaldo
                                    ? "border-purple-200 bg-purple-50 hover:border-purple-500 cursor-pointer"
                                    : "border-gray-100 bg-gray-50 opacity-60 cursor-not-allowed"
                            }`}
                        >
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                                    <Wallet className="w-6 h-6" />
                                </div>
                                <div className="text-left">
                                    <p className="font-semibold text-gray-900">
                                        Saldo Akun
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Saldo: Rp{" "}
                                        {new Intl.NumberFormat("id-ID").format(
                                            saldo,
                                        )}
                                    </p>
                                    {!canPayWithSaldo && (
                                        <p className="text-xs text-red-500 mt-1">
                                            Saldo tidak mencukupi
                                        </p>
                                    )}
                                </div>
                            </div>
                        </button>

                        {/* Digital Payment Option */}
                        <button
                            onClick={() => onSelectPayment("Digital")}
                            className="w-full flex items-center justify-between p-4 rounded-xl border-2 border-blue-200 bg-blue-50 hover:border-blue-500 transition-all cursor-pointer"
                        >
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                                    <CreditCard className="w-6 h-6" />
                                </div>
                                <div className="text-left">
                                    <p className="font-semibold text-gray-900">
                                        Pembayaran Digital
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        QRIS, E-Wallet, Transfer Bank
                                    </p>
                                </div>
                            </div>
                        </button>
                    </div>
                </DialogPanel>
            </div>
        </Dialog>
    );
}
