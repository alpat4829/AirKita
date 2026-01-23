import { Head, usePage } from "@inertiajs/react";
import Sidebar from "@/Components/Sidebar";
import MitraSidebar from "@/Components/MitraSidebar";
import DeleteUserForm from "./Partials/DeleteUserForm";
import UpdatePasswordForm from "./Partials/UpdatePasswordForm";
import UpdateProfileInformationForm from "./Partials/UpdateProfileInformationForm";
import UploadDepotPhotoForm from "./Partials/UploadDepotPhotoForm";
import DepotManagement from "./Partials/DepotManagement";
import DepotLocationForm from "./Partials/DepotLocationForm";

export default function Edit({ auth, mustVerifyEmail, status, mitra, isOpen }) {
    // Determine if user is mitra or pelanggan
    const isMitra = !!mitra;
    const { props } = usePage();
    const googleMapsApiKey = props.googleMapsApiKey || "";

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <Head title="Profile" />

            {/* Sidebar - Different for Mitra vs Pelanggan */}
            {isMitra ? (
                <MitraSidebar
                    currentRoute="profile"
                    isOpen={isOpen}
                    depotName={mitra.Nama_Mitra}
                />
            ) : (
                <Sidebar currentRoute="profile" />
            )}

            {/* Main Content */}
            <div className="flex-1 overflow-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-brush text-gray-900 mb-2">
                            Profile
                        </h1>
                        <p className="text-gray-600">
                            Kelola informasi profil dan keamanan akun Anda
                        </p>
                    </div>

                    {/* Profile Forms */}
                    <div className="space-y-6">
                        <div className="glass-card rounded-2xl p-6">
                            <UpdateProfileInformationForm
                                mustVerifyEmail={mustVerifyEmail}
                                status={status}
                                className="max-w-xl"
                            />
                        </div>

                        {mitra && (
                            <>
                                <div className="glass-card rounded-2xl p-6">
                                    <UploadDepotPhotoForm
                                        mitra={mitra}
                                        className="max-w-xl"
                                    />
                                </div>

                                <div className="glass-card rounded-2xl p-6">
                                    <DepotLocationForm
                                        mitra={mitra}
                                        apiKey={googleMapsApiKey}
                                        className="max-w-xl"
                                    />
                                </div>

                                <div className="glass-card rounded-2xl p-6">
                                    <DepotManagement
                                        mitra={mitra}
                                        isOpen={isOpen}
                                        className="max-w-xl"
                                    />
                                </div>
                            </>
                        )}

                        <div className="glass-card rounded-2xl p-6">
                            <UpdatePasswordForm className="max-w-xl" />
                        </div>

                        <div className="glass-card rounded-2xl p-6">
                            <DeleteUserForm className="max-w-xl" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
