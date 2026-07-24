"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import QRCode from "qrcode";
import BadgeStaffPDF from "@/components/BadgeStaffPDF";
import dynamic from "next/dynamic";

const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  { ssr: false }
);
const PDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
  { ssr: false }
);

type Staff = {
  id: string;
  nom: string;
  prenom: string;
  telephone: string;
  email: string;
  fonction: string;
  departement: string;
  photo: string;
  statut: string;
  matricule: string | null;
  qrCode: string;
};

export default function BadgePage() {
  const { id } = useParams();
  const [staff, setStaff] = useState<Staff | null>(null);
  const [bgImageBase64, setBgImageBase64] = useState<string>("");
  const [isClient, setIsClient] = useState(false);
  const [afficherBadge, setAfficherBadge] = useState(false);

  useEffect(() => {
    setIsClient(true);
    chargerDonnees();
  }, []);

  async function chargerDonnees() {
    try {
      const response = await fetch("/images/badge-staff.png");
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onloadend = () => {
        setBgImageBase64(reader.result as string);
      };
      reader.readAsDataURL(blob);
    } catch (e) {
      console.error("Erreur chargement image de fond", e);
    }

    const { data, error } = await supabase
      .from("staff")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error(error);
      return;
    }

    const matriculeFinal = data.matricule ?? `STF-${data.id.slice(0, 6).toUpperCase()}`;
    const qrCode = await QRCode.toDataURL(matriculeFinal);

    setStaff({
      ...data,
      matricule: matriculeFinal,
      qrCode,
    });
  }

  if (!staff || !isClient || !bgImageBase64) {
    return (
      <div className="p-10 text-center text-gray-600">
        Chargement des données du membre...
      </div>
    );
  }

  const staffData = {
    ...staff,
    matricule: staff.matricule || "",
    bgImage: bgImageBase64,
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
        Gestion du Badge STAFF
      </h1>

      {/* Bouton pour déclencher l'affichage */}
      <div className="flex justify-center mb-6">
        <button
          onClick={() => setAfficherBadge(!afficherBadge)}
          className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition font-semibold shadow-md flex items-center gap-2"
        >
          {afficherBadge ? "🙈 Masquer les détails & le badge" : "👁️ Afficher les informations & le badge"}
        </button>
      </div>

      {/* Zone d'affichage conditionnelle (Infos du membre + Aperçu PDF) */}
      {afficherBadge && (
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 transition-all">
          
          {/* Bloc d'informations textuelles du membre */}
          <div className="bg-white p-6 rounded-xl shadow-md border flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
                Informations du Membre
              </h2>
              <ul className="space-y-3 text-gray-700 text-sm">
                <li>
                  <span className="font-semibold text-gray-900">Nom complet :</span> {staff.prenom} {staff.nom}
                </li>
                <li>
                  <span className="font-semibold text-gray-900">Matricule :</span> {staff.matricule}
                </li>
                <li>
                  <span className="font-semibold text-gray-900">Fonction :</span> {staff.fonction}
                </li>
                <li>
                  <span className="font-semibold text-gray-900">Département :</span> {staff.departement}
                </li>
                <li>
                  <span className="font-semibold text-gray-900">Email :</span> {staff.email}
                </li>
                <li>
                  <span className="font-semibold text-gray-900">Téléphone :</span> {staff.telephone}
                </li>
                <li>
                  <span className="font-semibold text-gray-900">Statut :</span>{" "}
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                    {staff.statut || "Actif"}
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bloc de l'aperçu PDF du badge */}
          <div className="bg-white p-4 rounded-xl shadow-md border flex justify-center items-center h-[500px]">
            <PDFViewer width="100%" height="100%" className="border-none rounded-lg">
              <BadgeStaffPDF staff={staffData} />
            </PDFViewer>
          </div>

        </div>
      )}

      {/* Boutons d'actions globaux */}
      <div className="flex justify-center gap-4 mt-8 border-t pt-8 max-w-2xl mx-auto">
        <PDFDownloadLink
          document={<BadgeStaffPDF staff={staffData} />}
          fileName={`Badge-${staff.nom}-${staff.prenom}.pdf`}
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition inline-block text-center shadow-sm"
        >
          {({ loading }) =>
            loading ? "Génération..." : "📥 Télécharger PDF"
          }
        </PDFDownloadLink>

        <button
          onClick={() => window.print()}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition shadow-sm"
        >
          🖨️ Imprimer
        </button>

        <button className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition shadow-sm">
          📧 Envoyer par Email
        </button>
      </div>
    </div>
  );
}