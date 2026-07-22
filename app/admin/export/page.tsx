"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { jsPDF } from "jspdf";
import * as XLSX from "xlsx";
import autoTable from "jspdf-autotable";

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

export default function ExportPage() {

  const [reservations, setReservations] = useState<Reservation[]>([]);

  useEffect(() => {
    chargerParticipants();
  }, []);

  async function chargerParticipants() {
    const { data } = await supabase
      .from("reservations")
      .select("*")
      .order("nom");

    setReservations(data ?? []);
  }

  function filtrer(type: string) {

    switch (type) {

      case "participants":
        return reservations;

      case "bus":
        return reservations.filter(
          r => r.circuit === "🚌 Circuit Bus"
        );

      case "moto":
        return reservations.filter(
          r => r.circuit === "🏍️ Circuit Moto"
        );

      case "beach":
        return reservations.filter(
          r => r.circuit === "🌴 Beach Party"
        );

      case "exposants":
        return reservations.filter(
          r => r.circuit === "🏢 Exposant / Prestataire"
        );

      case "payes":
        return reservations.filter(
          r => r.paiement === "Payé"
        );

      case "attente":
        return reservations.filter(
          r => r.paiement === "En attente"
        );

      case "utilises":
        return reservations.filter(
          r => r.statut === "Utilisé"
        );

      default:
        return reservations;

    }

  }
  function exporterExcel(type: string) {

    const data = filtrer(type).map((r) => ({
      Réservation: r.reservation_number,
      Nom: r.nom,
      Prénom: r.prenom,
      Téléphone: r.telephone,
      Email: r.email,
      Circuit: r.circuit,
      Paiement: r.paiement,
      Billet: r.statut,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Participants"
    );

    XLSX.writeFile(
      workbook,
      `${type}.xlsx`
    );

  }
  function nettoyerCircuit(circuit: string) {
  return circuit
    .replace("🚌 ", "")
    .replace("🏍️ ", "")
    .replace("🌴 ", "")
    .replace("🏢 ", "");
}

  function exporterPDF(type: string) {

    const data = filtrer(type);

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text(
      "FESTICOM - SAFARIKOM 2026",
      14,
      20
    );

    doc.setFontSize(12);
    doc.text(
      `Liste : ${type}`,
      14,
      30
    );

    let y = 45;

    autoTable(doc, {
  head: [[
    "N°",
    "Nom",
    "Prénom",
    "Téléphone",
    "Circuit",
    "Paiement",
  ]],
  body: data.map((r, index) => [
    index + 1,
    r.nom,
    r.prenom,
    r.telephone,
    nettoyerCircuit(r.circuit),
    r.paiement,
  ]),
  startY: 30,
});
    doc.save(`${type}.pdf`);

  }

  return (
    <div className="p-8">

      <h1 className="text-3xl font-bold mb-8">
        Export des données
      </h1>
      <div className="grid md:grid-cols-2 gap-8">

        <div className="bg-white rounded-xl shadow p-6">

          <h2 className="text-2xl font-bold mb-6 text-red-600">
            📄 Export PDF
          </h2>

          <div className="grid gap-3">

            <button onClick={() => exporterPDF("participants")} className="bg-red-600 text-white p-3 rounded-lg">
              📋 Tous les participants
            </button>

            <button onClick={() => exporterPDF("bus")} className="bg-red-600 text-white p-3 rounded-lg">
              🚌 Circuit Bus
            </button>

            <button onClick={() => exporterPDF("moto")} className="bg-red-600 text-white p-3 rounded-lg">
              🏍️ Circuit Moto
            </button>

            <button onClick={() => exporterPDF("beach")} className="bg-red-600 text-white p-3 rounded-lg">
              🌴 Beach Party
            </button>

            <button onClick={() => exporterPDF("exposants")} className="bg-red-600 text-white p-3 rounded-lg">
              🏢 Exposant / Prestataire
            </button>

            <button onClick={() => exporterPDF("payes")} className="bg-red-600 text-white p-3 rounded-lg">
              💳 Paiements validés
            </button>

            <button onClick={() => exporterPDF("attente")} className="bg-red-600 text-white p-3 rounded-lg">
              ⏳ Paiements en attente
            </button>

            <button onClick={() => exporterPDF("utilises")} className="bg-red-600 text-white p-3 rounded-lg">
              🎫 Billets utilisés
            </button>

          </div>

        </div>

        <div className="bg-white rounded-xl shadow p-6">

          <h2 className="text-2xl font-bold mb-6 text-green-700">
            📊 Export Excel
          </h2>

          <div className="grid gap-3">

            <button onClick={() => exporterExcel("participants")} className="bg-green-600 text-white p-3 rounded-lg">
              📋 Tous les participants
            </button>

            <button onClick={() => exporterExcel("bus")} className="bg-green-600 text-white p-3 rounded-lg">
              🚌 Circuit Bus
            </button>

            <button onClick={() => exporterExcel("moto")} className="bg-green-600 text-white p-3 rounded-lg">
              🏍️ Circuit Moto
            </button>

            <button onClick={() => exporterExcel("beach")} className="bg-green-600 text-white p-3 rounded-lg">
              🌴 Beach Party
            </button>

            <button onClick={() => exporterExcel("exposants")} className="bg-green-600 text-white p-3 rounded-lg">
              🏢 Exposant / Prestataire
            </button>

            <button onClick={() => exporterExcel("payes")} className="bg-green-600 text-white p-3 rounded-lg">
              💳 Paiements validés
            </button>

            <button onClick={() => exporterExcel("attente")} className="bg-green-600 text-white p-3 rounded-lg">
              ⏳ Paiements en attente
            </button>

            <button onClick={() => exporterExcel("utilises")} className="bg-green-600 text-white p-3 rounded-lg">
              🎫 Billets utilisés
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}