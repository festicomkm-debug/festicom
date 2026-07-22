"use client";

import { useEffect, useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import { supabase } from "@/lib/supabase";

type Reservation = {
  reservation_number: string;
  nom: string;
  prenom: string;
  telephone: string;
  email: string;
  circuit: string;
  paiement: string;
  statut: string;
};

export default function PaiementsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [recherche, setRecherche] = useState("");

  useEffect(() => {
    chargerPaiements();
  }, []);

  async function chargerPaiements() {
    const { data } = await supabase
  .from("reservations")
  .select("*")
  .eq("paiement", "Payé")
  .order("nom");

    setReservations(data ?? []);
  }

  async function validerPaiement(
    reservation_number: string
  ) {
    const { error } = await supabase
      .from("reservations")
      .update({
        paiement: "Payé",
      })
      .eq("reservation_number", reservation_number);

    if (error) {
      alert(error.message);
      return;
    }

    await chargerPaiements();
  }

  const liste = reservations.filter((r) => {
    const texte =
      `${r.prenom} ${r.nom} ${r.telephone} ${r.reservation_number}`
        .toLowerCase();

    return texte.includes(recherche.toLowerCase());
  });

  return (
    <div className="flex">

      <AdminSidebar />

      <div className="flex-1 bg-gray-100 min-h-screen p-8">

        <h1 className="text-3xl font-bold mb-8">
          Gestion des paiements
        </h1>

        <div className="grid md:grid-cols-3 gap-6 mb-8">

          <div className="bg-white rounded-xl shadow p-6">
            <p>Total</p>

            <h2 className="text-4xl font-bold">
              {reservations.length}
            </h2>
          </div>

          <div className="bg-green-100 rounded-xl shadow p-6">
            <p>Payés</p>

            <h2 className="text-4xl font-bold">
              {
                reservations.filter(
                  r => r.paiement === "Payé"
                ).length
              }
            </h2>
          </div>

          <div className="bg-yellow-100 rounded-xl shadow p-6">
            <p>En attente</p>

            <h2 className="text-4xl font-bold">
              {
                reservations.filter(
                  r => r.paiement !== "Payé"
                ).length
              }
            </h2>
          </div>

        </div>

        <input
          type="text"
          placeholder="Rechercher..."
          value={recherche}
          onChange={(e) => setRecherche(e.target.value)}
          className="w-full mb-6 p-3 rounded-lg border"
        />
        <div className="bg-white rounded-xl shadow overflow-hidden">

          <table className="w-full">

            <thead className="bg-gray-200">

              <tr>

                <th className="p-3 text-left">Réservation</th>
                <th className="p-3 text-left">Participant</th>
                <th className="p-3 text-left">Téléphone</th>
                <th className="p-3 text-left">Circuit</th>
                <th className="p-3 text-left">Paiement</th>
                <th className="p-3 text-center">Action</th>

              </tr>

            </thead>

            <tbody>

              {liste.map((r) => (

                <tr
                  key={r.reservation_number}
                  className="border-b hover:bg-gray-50"
                >

                  <td className="p-3">
                    {r.reservation_number}
                  </td>

                  <td className="p-3">
                    {r.prenom} {r.nom}
                  </td>

                  <td className="p-3">
                    {r.telephone}
                  </td>

                  <td className="p-3">
                    {r.circuit}
                  </td>

                  <td className="p-3">

                    {r.paiement === "Payé" ? (

                      <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                        Payé
                      </span>

                    ) : (

                      <span className="bg-yellow-400 text-black px-3 py-1 rounded-full text-sm">
                        En attente
                      </span>

                    )}

                  </td>

                  <td className="p-3 text-center">

                    {r.paiement !== "Payé" && (

                      <button
                        onClick={() =>
                          validerPaiement(
                            r.reservation_number
                          )
                        }
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                      >
                        Valider
                      </button>

                    )}

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>

  );
}