import { useForm } from "@inertiajs/react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { Upload, Image as ImageIcon } from "lucide-react";

export default function UploadDepotPhotoForm({ mitra, className = "" }) {
    const [preview, setPreview] = useState(
        mitra.Foto_Depot ? `/storage/${mitra.Foto_Depot}` : null,
    );

    const { data, setData, post, processing, errors } = useForm({
        foto_depot: null,
    });

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData("foto_depot", file);

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const submit = (e) => {
        e.preventDefault();

        post(route("profile.uploadDepotPhoto"), {
            onSuccess: () => {
                toast.success("Foto depot berhasil diupload");
                window.location.reload();
            },
            onError: () => {
                toast.error("Gagal upload foto depot");
            },
        });
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">
                    Foto Depot
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                    Upload foto depot Anda untuk ditampilkan di dashboard
                    pelanggan.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                <div>
                    {preview ? (
                        <div className="relative w-full h-64 rounded-xl overflow-hidden border-2 border-gray-200">
                            <img
                                src={preview}
                                alt="Depot Preview"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                                <label
                                    htmlFor="foto_depot"
                                    className="cursor-pointer px-4 py-2 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                                >
                                    Ganti Foto
                                </label>
                            </div>
                        </div>
                    ) : (
                        <label
                            htmlFor="foto_depot"
                            className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                        >
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <ImageIcon className="w-12 h-12 text-gray-400 mb-3" />
                                <p className="mb-2 text-sm text-gray-500">
                                    <span className="font-semibold">
                                        Klik untuk upload
                                    </span>{" "}
                                    atau drag and drop
                                </p>
                                <p className="text-xs text-gray-500">
                                    PNG, JPG atau JPEG (MAX. 2MB)
                                </p>
                            </div>
                        </label>
                    )}

                    <input
                        id="foto_depot"
                        type="file"
                        className="hidden"
                        accept="image/jpeg,image/png,image/jpg"
                        onChange={handleFileChange}
                    />

                    {errors.foto_depot && (
                        <p className="mt-2 text-sm text-red-600">
                            {errors.foto_depot}
                        </p>
                    )}
                </div>

                {data.foto_depot && (
                    <div className="flex items-center gap-4">
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center px-4 py-2 bg-water-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-water-700 focus:bg-water-700 active:bg-water-900 focus:outline-none focus:ring-2 focus:ring-water-500 focus:ring-offset-2 transition ease-in-out duration-150 disabled:opacity-50"
                        >
                            <Upload className="w-4 h-4 mr-2" />
                            {processing ? "Uploading..." : "Upload Foto"}
                        </button>
                    </div>
                )}
            </form>
        </section>
    );
}
