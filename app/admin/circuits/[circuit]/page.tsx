"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Reservation = {
  reservation_number: string;
  nom: string;
  prenom: string;
  telephone: string;
  paiement: string;
  statut: string;
  circuit: string;
};

export default function CircuitPage() {
  const params = useParams();
  const circuit = decodeURIComponent(params.circuit as string);

  const [reservations, setReservations] = useState<Reservation[]>([]);
  const tarifs: Record<string, number> = {
  "🚌 Circuit Bus": 25000,
  "🏍️ Circuit Moto": 40000,
  "🌴 Beach Party": 3000,
  "🏢 Exposant / Prestataire": 0,
};

const totalEncaisse =
  reservations.filter((r) => r.paiement === "Payé").length *
  (tarifs[circuit] ?? 0);
  useEffect(() => {
    chargerParticipants();
  }, []);

  async function chargerParticipants() {
  console.log("Circuit recherché :", circuit);

  const { data, error } = await supabase
    .from("reservations")
    .select("*")
    .eq("circuit", circuit)
    .order("nom");

  console.log("Résultat :", data);
  console.log("Erreur :", error);

  setReservations(data ?? []);
}
  return (
    <div className="p-8">

      <h1 className="text-3xl font-bold mb-6">
        {circuit}
      </h1>

      <div className="grid grid-cols-5 gap-4 mb-8">

        <div className="bg-white shadow rounded-xl p-5">
          <h2>Total</h2>
          <p className="text-3xl font-bold">
            {reservations.length}
          </p>
        </div>

        <div className="bg-green-100 shadow rounded-xl p-5">
          <h2>Payés</h2>
          <p className="text-3xl font-bold">
            {
              reservations.filter(
                r => r.paiement === "Payé"
              ).length
            }
          </p>
        </div>

        <div className="bg-yellow-100 shadow rounded-xl p-5">
          <h2>En attente</h2>
          <p className="text-3xl font-bold">
            {
              reservations.filter(
                r => r.paiement !== "Payé"
              ).length
            }
          </p>
        </div>

        <div className="bg-blue-100 shadow rounded-xl p-5">
  <h2>Billets utilisés</h2>

  <p className="text-3xl font-bold">
    {
      reservations.filter(
        r => r.statut === "Utilisé"
      ).length
    }
  </p>
</div>

<div className="bg-green-600 text-white shadow rounded-xl p-5">
  <h2>Montant encaissé</h2>

  <p className="text-3xl font-bold">
    {totalEncaisse.toLocaleString()} KMF
  </p>
</div>
      </div>

      <table className="w-full bg-white rounded shadow">

        <thead>

          <tr className="bg-gray-200">

            <th className="p-3">Réservation</th>
            <th className="p-3">Nom</th>
            <th className="p-3">Téléphone</th>
            <th className="p-3">Paiement</th>
            <th className="p-3">Billet</th>

          </tr>

        </thead>

        <tbody>

          {reservations.map((r) => (

            <tr
              key={r.reservation_number}
              className="border-b"
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
                {r.paiement}
              </td>

              <td className="p-3">
                {r.statut}
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}