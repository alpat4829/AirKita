import InputError from "@/Components/InputError";
import { Head, Link, useForm } from "@inertiajs/react";
import { Droplets, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        post(route("login"), {
            onFinish: () => reset("password"),
        });
    };

    return (
        <>
            <Head title="Login - Airkita" />

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
                <div className="relative w-full max-w-md">
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
                        <p className="mt-2 text-white/90 drop-shadow">
                            Distribusi Air Minum Isi Ulang Terpercaya
                        </p>
                    </div>

                    {/* Login Form Card */}
                    <div className="glass-card rounded-3xl p-8 shadow-2xl">
                        <h2 className="text-3xl font-brush text-white text-center mb-2">
                            Selamat Datang
                        </h2>
                        <p className="text-white/80 text-center mb-8">
                            Masuk ke akun Anda
                        </p>

                        {status && (
                            <div className="mb-4 text-sm font-medium text-green-300 bg-green-500/20 p-3 rounded-lg border border-green-300/30">
                                {status}
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-6">
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
                                        autoFocus
                                    />
                                </div>
                                <InputError
                                    message={errors.email}
                                    className="mt-2 text-red-300"
                                />
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
                                        autoComplete="current-password"
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

                            {/* Remember Me */}
                            <div className="flex items-center justify-between">
                                <label className="flex items-center cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={data.remember}
                                        onChange={(e) =>
                                            setData(
                                                "remember",
                                                e.target.checked,
                                            )
                                        }
                                        className="w-4 h-4 rounded border-white/30 bg-white/20 text-water-500 focus:ring-water-500 focus:ring-offset-0 cursor-pointer"
                                    />
                                    <span className="ml-2 text-white/80 group-hover:text-white transition-colors">
                                        Ingat saya
                                    </span>
                                </label>

                                {canResetPassword && (
                                    <Link
                                        href={route("password.request")}
                                        className="text-white/80 hover:text-white transition-colors text-sm"
                                    >
                                        Lupa password?
                                    </Link>
                                )}
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="glass-button w-full py-3 rounded-xl text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {processing ? "Memproses..." : "Masuk"}
                            </button>
                        </form>

                        {/* Register Link */}
                        <div className="mt-6 text-center">
                            <p className="text-white/80">
                                Belum punya akun?{" "}
                                <Link
                                    href={route("register")}
                                    className="text-white font-semibold hover:underline"
                                >
                                    Daftar Sekarang
                                </Link>
                            </p>
                        </div>
                    </div>

                    {/* Back to Home */}
                    <div className="mt-6 text-center">
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
