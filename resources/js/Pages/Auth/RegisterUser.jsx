import InputError from "@/Components/InputError";
import { Head, Link, useForm } from "@inertiajs/react";
import GlassSelect from "@/Components/GlassSelect";
import {
    Droplets,
    User,
    Mail,
    Lock,
    Eye,
    EyeOff,
    Phone,
    MapPin,
} from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";

export default function RegisterUser() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        no_hp: "",
        alamat: "",
        id_provinsi: "",
        id_kabupaten: "",
        id_kecamatan: "",
        id_kelurahan: "",
        password: "",
        password_confirmation: "",
        role: "pelanggan",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Location data
    const [provinsiList, setProvinsiList] = useState([]);
    const [kabupatenList, setKabupatenList] = useState([]);
    const [kecamatanList, setKecamatanList] = useState([]);
    const [kelurahanList, setKelurahanList] = useState([]);

    // Load provinsi on mount
    useEffect(() => {
        axios
            .get("/api/provinsi")
            .then((response) => setProvinsiList(response.data))
            .catch((error) => console.error("Error loading provinsi:", error));
    }, []);

    // Load kabupaten when provinsi changes
    useEffect(() => {
        if (data.id_provinsi) {
            axios
                .get(`/api/kabupaten/${data.id_provinsi}`)
                .then((response) => {
                    setKabupatenList(response.data);
                    setKecamatanList([]);
                    setKelurahanList([]);
                    setData((prev) => ({
                        ...prev,
                        id_kabupaten: "",
                        id_kecamatan: "",
                        id_kelurahan: "",
                    }));
                })
                .catch((error) =>
                    console.error("Error loading kabupaten:", error),
                );
        }
    }, [data.id_provinsi]);

    // Load kecamatan when kabupaten changes
    useEffect(() => {
        if (data.id_kabupaten) {
            axios
                .get(`/api/kecamatan/${data.id_kabupaten}`)
                .then((response) => {
                    setKecamatanList(response.data);
                    setKelurahanList([]);
                    setData((prev) => ({
                        ...prev,
                        id_kecamatan: "",
                        id_kelurahan: "",
                    }));
                })
                .catch((error) =>
                    console.error("Error loading kecamatan:", error),
                );
        }
    }, [data.id_kabupaten]);

    // Load kelurahan when kecamatan changes
    useEffect(() => {
        if (data.id_kecamatan) {
            axios
                .get(`/api/kelurahan/${data.id_kecamatan}`)
                .then((response) => {
                    setKelurahanList(response.data);
                    setData((prev) => ({ ...prev, id_kelurahan: "" }));
                })
                .catch((error) =>
                    console.error("Error loading kelurahan:", error),
                );
        }
    }, [data.id_kecamatan]);

    const submit = (e) => {
        e.preventDefault();
        post(route("register.user.store"), {
            onFinish: () => reset("password", "password_confirmation"),
        });
    };

    return (
        <>
            <Head title="Daftar Pelanggan - Airkita" />

            {/* Full screen background */}
            <div
                className="min-h-screen flex items-center justify-center p-4"
                style={{
                    backgroundImage: "url(/images/water-bubbles.jpg)",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                }}
            >
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-water-500/30 to-primary-500/30"></div>

                {/* Glass Card */}
                <div className="relative w-full max-w-2xl">
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <Link
                            href="/"
                            className="inline-flex items-center space-x-3 group"
                        >
                            <Droplets className="w-12 h-12 text-white drop-shadow-lg group-hover:scale-110 transition-transform" />
                            <span className="text-5xl font-brush text-white drop-shadow-lg">
                                Airkita
                            </span>
                        </Link>
                    </div>

                    {/* Register Form Card */}
                    <div className="glass-card rounded-3xl p-8 shadow-2xl max-h-[80vh] overflow-y-auto">
                        {"\n"}{" "}
                        <h2 className="text-3xl font-brush text-white text-center mb-2">
                            Daftar Pelanggan
                        </h2>
                        <p className="text-white/80 text-center mb-8">
                            Buat akun untuk mulai memesan
                        </p>
                        <form onSubmit={submit} className="space-y-5">
                            {/* Name */}
                            <div>
                                <label
                                    htmlFor="name"
                                    className="block text-white/90 font-medium mb-2"
                                >
                                    Nama Lengkap
                                </label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
                                    <input
                                        id="name"
                                        type="text"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData("name", e.target.value)
                                        }
                                        className="glass-input w-full pl-12 pr-4 py-3 rounded-xl text-white placeholder-white/50 focus:outline-none"
                                        placeholder="Nama Anda"
                                        autoComplete="name"
                                        autoFocus
                                        required
                                    />
                                </div>
                                <InputError
                                    message={errors.name}
                                    className="mt-2 text-red-300"
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-white/90 font-medium mb-2"
                                >
                                    Email
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
                                    <input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) =>
                                            setData("email", e.target.value)
                                        }
                                        className="glass-input w-full pl-12 pr-4 py-3 rounded-xl text-white placeholder-white/50 focus:outline-none"
                                        placeholder="nama@email.com"
                                        autoComplete="username"
                                        required
                                    />
                                </div>
                                <InputError
                                    message={errors.email}
                                    className="mt-2 text-red-300"
                                />
                            </div>

                            {/* No HP */}
                            <div>
                                <label
                                    htmlFor="no_hp"
                                    className="block text-white/90 font-medium mb-2"
                                >
                                    No. HP
                                </label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
                                    <input
                                        id="no_hp"
                                        type="tel"
                                        value={data.no_hp}
                                        onChange={(e) =>
                                            setData("no_hp", e.target.value)
                                        }
                                        className="glass-input w-full pl-12 pr-4 py-3 rounded-xl text-white placeholder-white/50 focus:outline-none"
                                        placeholder="08123456789"
                                        required
                                    />
                                </div>
                                <InputError
                                    message={errors.no_hp}
                                    className="mt-2 text-red-300"
                                />
                            </div>

                            {/* Alamat */}
                            <div>
                                <label
                                    htmlFor="alamat"
                                    className="block text-white/90 font-medium mb-2"
                                >
                                    Alamat Lengkap
                                </label>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-4 w-5 h-5 text-white/60" />
                                    <textarea
                                        id="alamat"
                                        value={data.alamat}
                                        onChange={(e) =>
                                            setData("alamat", e.target.value)
                                        }
                                        className="glass-input w-full pl-12 pr-4 py-3 rounded-xl text-white placeholder-white/50 focus:outline-none resize-none"
                                        placeholder="Jl. Contoh No. 123"
                                        rows="2"
                                        required
                                    />
                                </div>
                                <InputError
                                    message={errors.alamat}
                                    className="mt-2 text-red-300"
                                />
                            </div>

                            {/* Location Cascading Dropdowns */}
                            <div className="grid md:grid-cols-2 gap-4">
                                {/* Provinsi */}
                                <div>
                                    <GlassSelect
                                        label="Provinsi"
                                        value={data.id_provinsi}
                                        onChange={(val) =>
                                            setData("id_provinsi", val)
                                        }
                                        options={provinsiList.map((p) => ({
                                            value: p.ID_Provinsi,
                                            label: p.Nama_Provinsi,
                                        }))}
                                        placeholder="Pilih Provinsi"
                                        error={errors.id_provinsi}
                                    />
                                </div>

                                {/* Kabupaten */}
                                <div>
                                    <GlassSelect
                                        label="Kabupaten/Kota"
                                        value={data.id_kabupaten}
                                        onChange={(val) =>
                                            setData("id_kabupaten", val)
                                        }
                                        options={kabupatenList.map((k) => ({
                                            value: k.ID_Kabupaten,
                                            label: k.Nama_Kab,
                                        }))}
                                        placeholder="Pilih Kabupaten"
                                        disabled={!data.id_provinsi}
                                        error={errors.id_kabupaten}
                                    />
                                </div>

                                {/* Kecamatan */}
                                <div>
                                    <GlassSelect
                                        label="Kecamatan"
                                        value={data.id_kecamatan}
                                        onChange={(val) =>
                                            setData("id_kecamatan", val)
                                        }
                                        options={kecamatanList.map((k) => ({
                                            value: k.ID_Kecamatan,
                                            label: k.Nama_Kec,
                                        }))}
                                        placeholder="Pilih Kecamatan"
                                        disabled={!data.id_kabupaten}
                                        error={errors.id_kecamatan}
                                    />
                                </div>

                                {/* Kelurahan */}
                                <div>
                                    <GlassSelect
                                        label="Kelurahan"
                                        value={data.id_kelurahan}
                                        onChange={(val) =>
                                            setData("id_kelurahan", val)
                                        }
                                        options={kelurahanList.map((k) => ({
                                            value: k.ID_KELURAHAN,
                                            label: k.Nama_Kel,
                                        }))}
                                        placeholder="Pilih Kelurahan"
                                        disabled={!data.id_kecamatan}
                                        error={errors.id_kelurahan}
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-white/90 font-medium mb-2"
                                >
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
                                    <input
                                        id="password"
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        value={data.password}
                                        onChange={(e) =>
                                            setData("password", e.target.value)
                                        }
                                        className="glass-input w-full pl-12 pr-12 py-3 rounded-xl text-white placeholder-white/50 focus:outline-none"
                                        placeholder="••••••••"
                                        autoComplete="new-password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-5 h-5" />
                                        ) : (
                                            <Eye className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                                <InputError
                                    message={errors.password}
                                    className="mt-2 text-red-300"
                                />
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label
                                    htmlFor="password_confirmation"
                                    className="block text-white/90 font-medium mb-2"
                                >
                                    Konfirmasi Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
                                    <input
                                        id="password_confirmation"
                                        type={
                                            showConfirmPassword
                                                ? "text"
                                                : "password"
                                        }
                                        value={data.password_confirmation}
                                        onChange={(e) =>
                                            setData(
                                                "password_confirmation",
                                                e.target.value,
                                            )
                                        }
                                        className="glass-input w-full pl-12 pr-12 py-3 rounded-xl text-white placeholder-white/50 focus:outline-none"
                                        placeholder="••••••••"
                                        autoComplete="new-password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowConfirmPassword(
                                                !showConfirmPassword,
                                            )
                                        }
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="w-5 h-5" />
                                        ) : (
                                            <Eye className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                                <InputError
                                    message={errors.password_confirmation}
                                    className="mt-2 text-red-300"
                                />
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="glass-button w-full py-3 rounded-xl text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                            >
                                {processing
                                    ? "Mendaftar..."
                                    : "Daftar Sekarang"}
                            </button>
                        </form>
                        {/* Login Link */}
                        <div className="mt-6 text-center">
                            <p className="text-white/80">
                                Sudah punya akun?{" "}
                                <Link
                                    href={route("login")}
                                    className="text-white font-semibold hover:underline"
                                >
                                    Masuk
                                </Link>
                            </p>
                        </div>
                    </div>

                    {/* Back Link */}
                    <div className="mt-6 text-center">
                        <Link
                            href={route("register")}
                            className="text-white/80 hover:text-white transition-colors inline-flex items-center space-x-2"
                        >
                            <span>← Pilih jenis akun lain</span>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
