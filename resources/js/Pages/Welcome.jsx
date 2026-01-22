import { Head, Link } from "@inertiajs/react";
import { Button } from "@/Components/ui/Button";
import { useEffect, useRef } from "react";
import {
    Droplets,
    MapPin,
    Clock,
    Shield,
    TrendingUp,
    Users,
    CheckCircle,
} from "lucide-react";

// Custom hook for scroll animations
function useScrollAnimation() {
    const elementRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: "0px 0px -50px 0px",
            },
        );

        if (elementRef.current) {
            observer.observe(elementRef.current);
        }

        return () => {
            if (elementRef.current) {
                observer.unobserve(elementRef.current);
            }
        };
    }, []);

    return elementRef;
}

export default function Welcome({ auth }) {
    // Initialize scroll animation refs
    const featuresHeaderRef = useScrollAnimation();
    const feature1Ref = useScrollAnimation();
    const feature2Ref = useScrollAnimation();
    const feature3Ref = useScrollAnimation();
    const aboutWaterImageRef = useScrollAnimation();
    const aboutWaterContentRef = useScrollAnimation();
    const ctaSectionRef = useScrollAnimation();
    const cta1Ref = useScrollAnimation();
    const cta2Ref = useScrollAnimation();

    return (
        <>
            <Head title="Airkita - Sistem Distribusi Air Minum Isi Ulang" />

            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-water-50 to-primary-50">
                {/* Navigation */}
                <nav className="fixed top-0 left-0 right-0 z-50 glass backdrop-blur-md">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16">
                            <Link
                                href="/"
                                className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
                            >
                                <Droplets className="w-8 h-8 text-water-500" />
                                <span className="text-3xl font-brush text-white tracking-wide">
                                    Airkita
                                </span>
                            </Link>

                            <div className="hidden md:flex items-center space-x-8">
                                <a
                                    href="#home"
                                    className="text-gray-700 hover:text-water-200 transition-colors font-medium"
                                >
                                    Home
                                </a>
                                <a
                                    href="#about"
                                    className="text-gray-700 hover:text-water-200 transition-colors font-medium"
                                >
                                    Tentang
                                </a>
                                <a
                                    href="#features"
                                    className="text-gray-700 hover:text-water-200 transition-colors font-medium"
                                >
                                    Fitur
                                </a>
                                <a
                                    href="#contact"
                                    className="text-gray-700 hover:text-water-200 transition-colors font-medium"
                                >
                                    Kontak
                                </a>
                            </div>

                            <div className="flex items-center space-x-4">
                                {auth.user ? (
                                    <Link href={route("dashboard")}>
                                        <Button variant="primary">
                                            Dashboard
                                        </Button>
                                    </Link>
                                ) : (
                                    <>
                                        <Link href={route("login")}>
                                            <Button variant="ghost">
                                                Masuk
                                            </Button>
                                        </Link>
                                        <Link href={route("register")}>
                                            <Button variant="primary">
                                                Daftar
                                            </Button>
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <section
                    id="home"
                    className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden"
                >
                    {/* Background Image with Overlay */}
                    <div className="absolute inset-0 z-0">
                        <img
                            src="/images/water-bg.jpg"
                            alt="Water Background"
                            className="w-full h-full object-cover"
                        />
                        {/* Dark overlay for better text readability */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/70 via-water-900/60 to-primary-900/70"></div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full opacity-40 animate-pulse-slow z-10"></div>
                    <div
                        className="absolute top-40 right-20 w-32 h-32 bg-white/10 rounded-full opacity-40 animate-pulse-slow z-10"
                        style={{ animationDelay: "1s" }}
                    ></div>
                    <div
                        className="absolute bottom-20 left-1/4 w-24 h-24 bg-white/10 rounded-full opacity-40 animate-pulse-slow z-10"
                        style={{ animationDelay: "2s" }}
                    ></div>

                    <div className="max-w-7xl mx-auto relative z-10">
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            {/* Left Content */}
                            <div className="animate-slide-up">
                                <h1 className="text-5xl lg:text-6xl font-brush text-white leading-relaxed mb-6">
                                    Distribusi Air Minum
                                    <span className="block bg-gradient-to-r font-brush from-water-300 to-blue-300 bg-clip-text text-transparent pb-6">
                                        Isi Ulang Terpercaya
                                    </span>
                                </h1>
                                <p className="text-xl text-gray-100 mb-8  leading-relaxed">
                                    Airkita menghubungkan Anda dengan depot air
                                    minum isi ulang terpercaya di sekitar Anda.
                                    Pesan air minum berkualitas dengan mudah,
                                    cepat, dan aman.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <Link href={route("register")}>
                                        <Button
                                            variant="primary"
                                            size="lg"
                                            className="w-full sm:w-auto shadow-xl hover:shadow-2xl"
                                        >
                                            Mulai Sekarang
                                        </Button>
                                    </Link>
                                    <a href="#features">
                                        <Button
                                            variant="outline"
                                            size="lg"
                                            className="w-full sm:w-auto border-white text-white hover:bg-white/10"
                                        >
                                            Pelajari Lebih Lanjut
                                        </Button>
                                    </a>
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-3 gap-6 mt-12">
                                    <div className="glass-dark p-4 rounded-xl">
                                        <div className="text-3xl font-brush text-water-300">
                                            100+
                                        </div>
                                        <div className="text-sm text-gray-300">
                                            Depot Mitra
                                        </div>
                                    </div>
                                    <div className="glass-dark p-4 rounded-xl">
                                        <div className="text-3xl font-brush text-water-300">
                                            5000+
                                        </div>
                                        <div className="text-sm text-gray-300">
                                            Pelanggan
                                        </div>
                                    </div>
                                    <div className="glass-dark p-4 rounded-xl">
                                        <div className="text-3xl font-brush text-water-300">
                                            24/7
                                        </div>
                                        <div className="text-sm text-gray-300">
                                            Layanan
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Illustration */}
                            <div className="relative animate-fade-in">
                                {/* Invisible container */}
                                <div className="relative p-12">
                                    {/* Water Droplet Image with glass effect overlay */}
                                    <div className="relative">
                                        {/* Glass overlay effect */}
                                        <div className="absolute -inset-y-8 inset-x-0 bg-white/8 backdrop-blur-md rounded-full border border-white/30 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] aspect-square"></div>
                                        {/* Droplet Image */}
                                        <img
                                            src="/images/water-droplet.png"
                                            alt="Airkita Water Droplet"
                                            className="relative w-full h-auto max-w-md mx-auto rounded-full drop-shadow-[5_35px_70px_rgba(8,112,184,0.6)] opacity-70 aspect-square object-cover hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Wave Divider */}
                    <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10">
                        <svg
                            className="relative block w-full h-20"
                            viewBox="0 0 1440 120"
                            preserveAspectRatio="none"
                        >
                            <path
                                d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
                                fill="white"
                            ></path>
                        </svg>
                    </div>
                </section>

                {/* Features Section */}
                <section
                    id="features"
                    className="py-20 px-4 sm:px-6 lg:px-8 bg-white"
                >
                    <div className="max-w-7xl mx-auto">
                        <div
                            ref={featuresHeaderRef}
                            className="text-center mb-16 fade-in-up"
                        >
                            <h2 className="text-4xl font-brush text-gray-900 mb-4">
                                Mengapa Memilih Airkita?
                            </h2>
                            <p className="text-xl text-gray-600">
                                Platform terpercaya untuk kebutuhan air minum
                                Anda
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {/* Feature 1 */}
                            <div
                                ref={feature1Ref}
                                className="group p-8 rounded-2xl bg-gradient-to-br from-water-50 to-primary-50 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 fade-in-up"
                            >
                                <div className="w-16 h-16 bg-gradient-to-br from-water-500 to-primary-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <MapPin className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-2xl font-brush text-gray-900 mb-4">
                                    Depot Terdekat
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    Temukan depot air minum isi ulang terdekat
                                    di sekitar lokasi Anda dengan mudah dan
                                    cepat.
                                </p>
                            </div>

                            {/* Feature 2 */}
                            <div
                                ref={feature2Ref}
                                className="group p-8 rounded-2xl bg-gradient-to-br from-water-50 to-primary-50 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 fade-in-up"
                            >
                                <div className="w-16 h-16 bg-gradient-to-br from-water-500 to-primary-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <Shield className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-2xl font-brush text-gray-900 mb-4">
                                    Kualitas Terjamin
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    Semua depot mitra kami telah terverifikasi
                                    dan menjamin kualitas air minum yang bersih
                                    dan sehat.
                                </p>
                            </div>

                            {/* Feature 3 */}
                            <div
                                ref={feature3Ref}
                                className="group p-8 rounded-2xl bg-gradient-to-br from-water-50 to-primary-50 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 fade-in-up"
                            >
                                <div className="w-16 h-16 bg-gradient-to-br from-water-500 to-primary-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <TrendingUp className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-2xl font-brush text-gray-900 mb-4">
                                    Harga Transparan
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    Lihat harga yang jelas dan transparan dari
                                    setiap depot tanpa biaya tersembunyi.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* About Water Section */}
                <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            {/* Left - Gallon Image */}
                            <div
                                ref={aboutWaterImageRef}
                                className="relative fade-in-up order-2 lg:order-1"
                            >
                                <div className="relative">
                                    {/* Decorative background circle */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-water-100 to-primary-100 rounded-full opacity-30 blur-3xl"></div>

                                    {/* Gallon Image */}
                                    <img
                                        src="/images/gallon-water.png"
                                        alt="Gallon Air Minum"
                                        className="relative w-full h-auto max-w-lg mx-auto drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                                        style={{
                                            mixBlendMode: "multiply",
                                            filter: "contrast(1.1) brightness(1.05)",
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Right - Content */}
                            <div
                                ref={aboutWaterContentRef}
                                className="fade-in-up order-1 lg:order-2"
                            >
                                <h2 className="text-4xl lg:text-5xl font-brush text-gray-900 leading-relaxed mb-6">
                                    Air Minum Bersih adalah Kebutuhan Utama
                                    Kehidupan
                                </h2>

                                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                                    Kami menyediakan layanan distribusi air
                                    minum isi ulang yang higienis, terjamin
                                    kualitasnya, dan siap memenuhi kebutuhan
                                    harian rumah tangga maupun usaha. Dengan
                                    proses penyaringan berstandar dan pengiriman
                                    tepat waktu, kami memastikan setiap tetes
                                    air yang Anda konsumsi aman dan menyehatkan.
                                </p>

                                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                    Keunggulan kami:
                                </h3>

                                <ul className="space-y-4">
                                    <li className="flex items-start">
                                        <CheckCircle className="w-6 h-6 text-water-500 mr-3 flex-shrink-0 mt-0.5" />
                                        <span className="text-gray-700 text-lg">
                                            Air minum teruji dan higienis
                                        </span>
                                    </li>
                                    <li className="flex items-start">
                                        <CheckCircle className="w-6 h-6 text-water-500 mr-3 flex-shrink-0 mt-0.5" />
                                        <span className="text-gray-700 text-lg">
                                            Proses pengisian sesuai standar
                                            kesehatan
                                        </span>
                                    </li>
                                    <li className="flex items-start">
                                        <CheckCircle className="w-6 h-6 text-water-500 mr-3 flex-shrink-0 mt-0.5" />
                                        <span className="text-gray-700 text-lg">
                                            Pengantaran cepat dan terpercaya
                                        </span>
                                    </li>
                                    <li className="flex items-start">
                                        <CheckCircle className="w-6 h-6 text-water-500 mr-3 flex-shrink-0 mt-0.5" />
                                        <span className="text-gray-700 text-lg">
                                            Harga terjangkau untuk kebutuhan
                                            rutin
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                
                

                {/* Role Selection Section */}
                <section
                    id="about"
                    className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-50 to-water-50"
                >
                    <div className="max-w-7xl mx-auto">
                        <div
                            ref={ctaSectionRef}
                            className="text-center mb-16 fade-in-up"
                        >
                            <h2 className="text-4xl font-brush text-gray-900 mb-4">
                                Bergabung Bersama Kami
                            </h2>
                            <p className="text-xl text-gray-600">
                                Pilih peran yang sesuai dengan kebutuhan Anda
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                            {/* Mitra Card */}
                            <div
                                ref={cta1Ref}
                                className="group relative overflow-hidden rounded-3xl bg-white p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 fade-in-up"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-water-200 to-primary-200 rounded-full -mr-16 -mt-16 opacity-50"></div>
                                <div className="relative">
                                    <div className="w-20 h-20 bg-gradient-to-br from-water-500 to-primary-500 rounded-2xl flex items-center justify-center mb-6">
                                        <Users className="w-10 h-10 text-white" />
                                    </div>
                                    <h3 className="text-3xl font-brush text-gray-900 mb-4">
                                        Untuk Mitra Depot
                                    </h3>
                                    <p className="text-gray-600 mb-6 leading-relaxed">
                                        Kembangkan bisnis depot air Anda dengan
                                        bergabung sebagai mitra. Dapatkan akses
                                        ke ribuan pelanggan potensial.
                                    </p>
                                    <ul className="space-y-3 mb-8">
                                        <li className="flex items-center text-gray-700">
                                            <div className="w-2 h-2 bg-water-500 rounded-full mr-3"></div>
                                            Dashboard manajemen pesanan
                                        </li>
                                        <li className="flex items-center text-gray-700">
                                            <div className="w-2 h-2 bg-water-500 rounded-full mr-3"></div>
                                            Statistik penjualan real-time
                                        </li>
                                        <li className="flex items-center text-gray-700">
                                            <div className="w-2 h-2 bg-water-500 rounded-full mr-3"></div>
                                            Kelola produk dengan mudah
                                        </li>
                                    </ul>
                                    <Link href={route("register")}>
                                        <Button
                                            variant="primary"
                                            className="w-full"
                                        >
                                            Daftar Sebagai Mitra
                                        </Button>
                                    </Link>
                                </div>
                            </div>

                            {/* Pelanggan Card */}
                            <div
                                ref={cta2Ref}
                                className="group relative overflow-hidden rounded-3xl bg-white p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 fade-in-up"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-200 to-water-200 rounded-full -mr-16 -mt-16 opacity-50"></div>
                                <div className="relative">
                                    <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-water-500 rounded-2xl flex items-center justify-center mb-6">
                                        <Droplets className="w-10 h-10 text-white" />
                                    </div>
                                    <h3 className="text-3xl font-brush text-gray-900 mb-4">
                                        Untuk Pelanggan
                                    </h3>
                                    <p className="text-gray-600 mb-6 leading-relaxed">
                                        Pesan air minum isi ulang berkualitas
                                        dengan mudah dan cepat. Nikmati
                                        kemudahan berbelanja online.
                                    </p>
                                    <ul className="space-y-3 mb-8">
                                        <li className="flex items-center text-gray-700">
                                            <div className="w-2 h-2 bg-primary-500 rounded-full mr-3"></div>
                                            Cari depot terdekat
                                        </li>
                                        <li className="flex items-center text-gray-700">
                                            <div className="w-2 h-2 bg-primary-500 rounded-full mr-3"></div>
                                            Lacak status pesanan
                                        </li>
                                        <li className="flex items-center text-gray-700">
                                            <div className="w-2 h-2 bg-primary-500 rounded-full mr-3"></div>
                                            Riwayat pemesanan lengkap
                                        </li>
                                    </ul>
                                    <Link href={route("register")}>
                                        <Button
                                            variant="default"
                                            className="w-full"
                                        >
                                            Daftar Sebagai Pelanggan
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer
                    id="contact"
                    className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8"
                >
                    <div className="max-w-7xl mx-auto">
                        <div className="grid md:grid-cols-3 gap-8">
                            <div>
                                <div className="flex items-center space-x-2 mb-4">
                                    <Droplets className="w-8 h-8 text-water-400" />
                                    <span className="text-2xl font-brush">
                                        Airkita
                                    </span>
                                </div>
                                <p className="text-gray-400">
                                    Platform distribusi air minum isi ulang
                                    terpercaya di Indonesia.
                                </p>
                            </div>
                            <div>
                                <h4 className="text-lg font-semibold mb-4">
                                    Tautan
                                </h4>
                                <ul className="space-y-2">
                                    <li>
                                        <a
                                            href="#home"
                                            className="text-gray-400 hover:text-water-400 transition-colors"
                                        >
                                            Home
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#about"
                                            className="text-gray-400 hover:text-water-400 transition-colors"
                                        >
                                            Tentang
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#features"
                                            className="text-gray-400 hover:text-water-400 transition-colors"
                                        >
                                            Fitur
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="text-lg font-semibold mb-4">
                                    Kontak
                                </h4>
                                <ul className="space-y-2 text-gray-400">
                                    <li>Email: airkita@gmail.com</li>
                                    <li>Telepon: 085263404655</li>
                                    <li>
                                        Alamat: Padang, Sumatera Barat,
                                        Indonesia
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                            <p>&copy; 2026 Airkita. All rights reserved.</p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
