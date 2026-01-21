import { Head, Link } from "@inertiajs/react";
import { Droplets, Users, ShoppingBag } from "lucide-react";

export default function Register() {
    return (
        <>
            <Head title="Daftar - Airkita" />

            {/* Full screen background */}
            <div
                className="min-h-screen flex items-center justify-center p-4"
                style={{
                    backgroundImage: "url(/images/water-bubbles.jpg)",
                    className: "w-full h-full object ",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                }}
            >
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-water-500/30 to-primary-500/30"></div>

                {/* Content */}
                <div className="relative w-full max-w-5xl">
                    {/* Logo */}
                    <div className="text-center mb-12">
                        <Link
                            href="/"
                            className="inline-flex items-center space-x-3 group"
                        >
                            <Droplets className="w-12 h-12 text-white drop-shadow-lg group-hover:scale-110 transition-transform" />
                            <span className="text-5xl font-brush text-white drop-shadow-lg">
                                Airkita
                            </span>
                        </Link>
                        <h2 className="mt-4 text-3xl font-brush text-white drop-shadow-lg">
                            Pilih Jenis Akun
                        </h2>
                        <p className="mt-2 text-white/90 drop-shadow">
                            Daftar sebagai pelanggan atau mitra depot
                        </p>
                    </div>

                    {/* Role Selection Cards */}
                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {/* User/Pelanggan Card */}
                        <Link href={route("register.user")}>
                            <div className="glass-card rounded-3xl p-8 hover:scale-105 transition-all duration-300 cursor-pointer group">
                                <div className="text-center">
                                    <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-water-400 to-primary-400 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <ShoppingBag className="w-12 h-12 text-white" />
                                    </div>
                                    <h3 className="text-3xl font-brush text-white mb-4">
                                        Pelanggan
                                    </h3>
                                    <p className="text-white/80 leading-relaxed mb-6">
                                        Daftar sebagai pelanggan untuk memesan
                                        air minum isi ulang dengan mudah dan
                                        cepat
                                    </p>
                                    <ul className="space-y-3 text-left mb-8">
                                        <li className="flex items-center text-white/90">
                                            <div className="w-2 h-2 bg-water-300 rounded-full mr-3"></div>
                                            Pesan air minum online
                                        </li>
                                        <li className="flex items-center text-white/90">
                                            <div className="w-2 h-2 bg-water-300 rounded-full mr-3"></div>
                                            Lacak pesanan real-time
                                        </li>
                                        <li className="flex items-center text-white/90">
                                            <div className="w-2 h-2 bg-water-300 rounded-full mr-3"></div>
                                            Riwayat pembelian lengkap
                                        </li>
                                    </ul>
                                    <div className="glass-button w-full py-3 rounded-xl text-white font-semibold text-center">
                                        Daftar sebagai Pelanggan
                                    </div>
                                </div>
                            </div>
                        </Link>

                        {/* Mitra Card */}
                        <Link href={route("register.mitra")}>
                            <div className="glass-card rounded-3xl p-8 hover:scale-105 transition-all duration-300 cursor-pointer group">
                                <div className="text-center">
                                    <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-primary-400 to-water-400 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <Users className="w-12 h-12 text-white" />
                                    </div>
                                    <h3 className="text-3xl font-brush text-white mb-4">
                                        Mitra Depot
                                    </h3>
                                    <p className="text-white/80 leading-relaxed mb-6">
                                        Daftar sebagai mitra untuk mengelola
                                        depot air minum dan menjangkau lebih
                                        banyak pelanggan
                                    </p>
                                    <ul className="space-y-3 text-left mb-8">
                                        <li className="flex items-center text-white/90">
                                            <div className="w-2 h-2 bg-primary-300 rounded-full mr-3"></div>
                                            Dashboard manajemen depot
                                        </li>
                                        <li className="flex items-center text-white/90">
                                            <div className="w-2 h-2 bg-primary-300 rounded-full mr-3"></div>
                                            Kelola produk & pesanan
                                        </li>
                                        <li className="flex items-center text-white/90">
                                            <div className="w-2 h-2 bg-primary-300 rounded-full mr-3"></div>
                                            Statistik penjualan
                                        </li>
                                    </ul>
                                    <div className="glass-button w-full py-3 rounded-xl text-white font-semibold text-center">
                                        Daftar sebagai Mitra
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>

                    {/* Login Link */}
                    <div className="mt-8 text-center">
                        <p className="text-white/90 drop-shadow">
                            Sudah punya akun?{" "}
                            <Link
                                href={route("login")}
                                className="text-white font-semibold hover:underline"
                            >
                                Masuk Sekarang
                            </Link>
                        </p>
                    </div>

                    {/* Back to Home */}
                    <div className="mt-4 text-center">
                        <Link
                            href="/"
                            className="text-white/80 hover:text-white transition-colors inline-flex items-center space-x-2"
                        >
                            <span>← Kembali ke Beranda</span>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
