"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import AdminSidebar from "@/components/AdminSidebar";

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

export default function ParticipantsPage() {
  const router = useRouter();

  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);

const [participantSelectionne, setParticipantSelectionne] =
  useState<Reservation | null>(null);

const [nom, setNom] = useState("");
const [prenom, setPrenom] = useState("");
const [telephone, setTelephone] = useState("");
const [email, setEmail] = useState("");
const [circuit, setCircuit] = useState("");

  useEffect(() => {
    verifierConnexion();
  }, []);

  async function verifierConnexion() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      router.push("/login");
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", session.user.id)
      .single();

    if (!profile || profile.role !== "admin") {
      router.push("/scanner");
      return;
    }

    chargerParticipants();
  }

  async function chargerParticipants() {
    const { data, error } = await supabase
      .from("reservations")
      .select("*")
      .order("reservation_number", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    setReservations(data ?? []);
  }

  async function validerPaiement(reservation: Reservation) {
    const { error } = await supabase
      .from("reservations")
      .update({ paiement: "Payé" })
      .eq("reservation_number", reservation.reservation_number);

    if (error) {
      alert(error.message);
      return;
    }

    chargerParticipants();
  }

  async function validerBillet(reservation: Reservation) {
    const { error } = await supabase
      .from("reservations")
      .update({ statut: "Utilisé" })
      .eq("reservation_number", reservation.reservation_number);

    if (error) {
      alert(error.message);
      return;
    }

    chargerParticipants();
  }
  function ouvrirModification(r: Reservation) {
  setParticipantSelectionne(r);

  setNom(r.nom);
  setPrenom(r.prenom);
  setTelephone(r.telephone);
  setEmail(r.email);
  setCircuit(r.circuit);

  setOpenModal(true);
}
async function enregistrerModification() {
  if (!participantSelectionne) return;

  const { error } = await supabase
    .from("reservations")
    .update({
      nom,
      prenom,
      telephone,
      email,
      circuit,
    })
    .eq(
      "reservation_number",
      participantSelectionne.reservation_number
    );

  if (error) {
    alert(error.message);
    return;
  }

  setOpenModal(false);
  chargerParticipants();

  alert("Participant modifié avec succès !");
}


  const participantsFiltres = reservations.filter((r) =>
    `${r.prenom} ${r.nom} ${r.reservation_number}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="flex">
      <AdminSidebar />

      <div className="flex-1 bg-gray-100 min-h-screen p-6">

        <h1 className="text-3xl font-bold mb-6">
          👥 Participants
        </h1>

        <input
          type="text"
          placeholder="Rechercher un participant..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-96 p-3 border rounded-lg mb-6"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

          <div className="bg-white rounded-lg shadow p-5">
            <p className="text-gray-500">Total</p>
            <h2 className="text-3xl font-bold">
              {participantsFiltres.length}
            </h2>
          </div>

          <div className="bg-green-100 rounded-lg shadow p-5">
            <p>Paiements validés</p>
            <h2 className="text-3xl font-bold">
              {
                participantsFiltres.filter(
                  (r) => r.paiement === "Payé"
                ).length
              }
            </h2>
          </div>

          <div className="bg-yellow-100 rounded-lg shadow p-5">
            <p>En attente</p>
            <h2 className="text-3xl font-bold">
              {
                participantsFiltres.filter(
                  (r) => r.paiement !== "Payé"
                ).length
              }
            </h2>
          </div>

        </div>

        <div className="overflow-x-auto bg-white rounded-lg shadow">

          <table className="w-full">

            <thead className="bg-gray-200">

              <tr>

                <th className="p-3 text-left">Réservation</th>
                <th className="p-3 text-left">Nom</th>
                <th className="p-3 text-left">Téléphone</th>
                <th className="p-3 text-left">Circuit</th>
                <th className="p-3 text-left">Paiement</th>
                <th className="p-3 text-left">Billet</th>
                <th className="p-3 text-center">Actions</th>

              </tr>

            </thead>

            <tbody>
              {participantsFiltres.map((r) => (
                <tr
                  key={r.reservation_number}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="p-3">{r.reservation_number}</td>

                  <td className="p-3">
                    {r.prenom} {r.nom}
                  </td>

                  <td className="p-3">{r.telephone}</td>

                  <td className="p-3">{r.circuit}</td>

                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-white ${
                        r.paiement === "Payé"
                          ? "bg-green-600"
                          : "bg-yellow-500"
                      }`}
                    >
                      {r.paiement}
                    </span>
                  </td>

                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-white ${
                        r.statut === "Utilisé"
                          ? "bg-red-600"
                          : "bg-green-600"
                      }`}
                    >
                      {r.statut}
                    </span>
                  </td>

                  <td className="p-3">
                    <div className="flex flex-wrap gap-2 justify-center">

                      <button
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                        onClick={() => ouvrirModification(r)}
                      >
                        ✏️
                      </button>

                      <button
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                        onClick={() => validerPaiement(r)}
                        disabled={r.paiement === "Payé"}
                      >
                        💳
                      </button>

                      <button
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded"
                        onClick={() => validerBillet(r)}
                        disabled={r.statut === "Utilisé"}
                      >
                        🎫
                      </button>


                    </div>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>

        </div>
        {openModal && participantSelectionne && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

    <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg">

      <h2 className="text-2xl font-bold mb-5">
        Modifier le participant
      </h2>

      <input
        className="w-full border rounded-lg p-3 mb-3"
        placeholder="Nom"
        value={nom}
        onChange={(e) => setNom(e.target.value)}
      />

      <input
        className="w-full border rounded-lg p-3 mb-3"
        placeholder="Prénom"
        value={prenom}
        onChange={(e) => setPrenom(e.target.value)}
      />

      <input
        className="w-full border rounded-lg p-3 mb-3"
        placeholder="Téléphone"
        value={telephone}
        onChange={(e) => setTelephone(e.target.value)}
      />

      <input
        className="w-full border rounded-lg p-3 mb-3"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="w-full border rounded-lg p-3 mb-5"
        placeholder="Circuit"
        value={circuit}
        onChange={(e) => setCircuit(e.target.value)}
      />

      <div className="flex justify-end gap-3">

        <button
          onClick={() => setOpenModal(false)}
          className="bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 rounded-lg"
        >
          Annuler
        </button>

        <button
          onClick={enregistrerModification}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
        >
          Enregistrer
        </button>

      </div>

    </div>

  </div>
)}

      </div>

    </div>
  );
}