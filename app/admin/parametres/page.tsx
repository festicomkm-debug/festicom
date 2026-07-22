"use client";

import AdminSidebar from "@/components/AdminSidebar";

export default function ParamètresPage() {
  return (
    <div className="flex">
      <AdminSidebar />

      <div className="flex-1 bg-gray-100 min-h-screen p-6">
        <h1 className="text-3xl font-bold">
          Paramètres
        </h1>

        <p className="mt-4 text-gray-600">
          Cette page est en cours de développement.
        </p>
      </div>
    </div>
  );
}