"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

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
};

export default function StaffPage() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    chargerStaff();
  }, []);

  async function chargerStaff() {
    const { data } = await supabase
      .from("staff")
      .select("*")
      .order("nom");

    setStaff(data ?? []);
  }
 async function validerStaff(id: string) {
  // Validation dans Supabase
  const { error } = await supabase
    .from("staff")
    .update({ statut: "Validé" })
    .eq("id", id);

  if (error) {
    alert(error.message);
    return;
  }

  try {
    // Envoi automatique du badge
    const response = await fetch("/api/send-staff-badge", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    const result = await response.json();

    console.log("Réponse API :", result);

    if (!response.ok) {
      alert(result.error || "Erreur lors de l'envoi du badge.");
      chargerStaff();
      return;
    }

    alert("Membre validé et badge envoyé !");
  } catch (err) {
    console.error(err);
    alert("Erreur lors de l'appel à l'API.");
  }

  chargerStaff();
}

async function refuserStaff(id: string) {
  const { data, error } = await supabase
    .from("staff")
    .update({ statut: "Refusé" })
    .eq("id", id)
    .select();

  console.log(data, error);

  if (error) {
    alert(error.message);
    return;
  }

  alert("Staff refusé");
  chargerStaff();
}
async function supprimerStaff(id: string) {
  const confirmation = confirm(
    "Voulez-vous vraiment supprimer ce membre ?"
  );

  if (!confirmation) return;

  const { error } = await supabase
    .from("staff")
    .delete()
    .eq("id", id);

  if (error) {
    alert(error.message);
    return;
  }

  alert("Membre supprimé");
  chargerStaff();
}

async function modifierStatut(
  id: string,
  statut: string
) {
  const { error } = await supabase
    .from("staff")
    .update({ statut })
    .eq("id", id);

  if (error) {
    alert(error.message);
    return;
  }

  chargerStaff();
}

  const liste = staff.filter((membre) =>
    `${membre.nom} ${membre.prenom}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );
  const total = staff.length;

const enAttente = staff.filter(
  (m) => m.statut === "En attente"
).length;

const valides = staff.filter(
  (m) => m.statut === "Validé"
).length;

const refuses = staff.filter(
  (m) => m.statut === "Refusé"
).length;

return (
  <div className="p-8">

    <h1 className="text-3xl font-bold mb-8">
      👥 Staff d'organisation
    </h1>

    <div className="grid grid-cols-4 gap-5 mb-8">

      <div className="bg-white rounded-xl shadow p-5">
        <p className="text-gray-500">Total</p>
        <h2 className="text-3xl font-bold">
          {total}
        </h2>
      </div>

      <div className="bg-yellow-100 rounded-xl shadow p-5">
        <p>En attente</p>
        <h2 className="text-3xl font-bold">
          {enAttente}
        </h2>
      </div>

      <div className="bg-green-100 rounded-xl shadow p-5">
        <p>Validés</p>
        <h2 className="text-3xl font-bold">
          {valides}
        </h2>
      </div>

      <div className="bg-red-100 rounded-xl shadow p-5">
        <p>Refusés</p>
        <h2 className="text-3xl font-bold">
          {refuses}
        </h2>
      </div>

    </div>

    <input
      type="text"
      placeholder="🔍 Rechercher un membre..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="w-full border rounded-lg p-3 mb-6"
    />
    <div className="bg-white rounded-xl shadow overflow-x-auto">

  <table className="w-full">

    <thead className="bg-gray-100">

      <tr>

        <th className="text-left p-4">Nom</th>
        <th className="text-left p-4">Fonction</th>
        <th className="text-left p-4">Téléphone</th>
        <th className="text-left p-4">Statut</th>
        <th className="text-center p-4">Actions</th>

      </tr>

    </thead>

    <tbody>

      {liste.map((membre) => (

        <tr
          key={membre.id}
          className="border-t hover:bg-gray-50"
        >

          <td className="p-4">
  <div className="flex items-center gap-3">

    <img
  src={membre.photo || "/avatar.png"}
  alt={`${membre.prenom} ${membre.nom}`}
  className="w-12 h-12 rounded-full object-cover border border-gray-300"
  onError={(e) => {
    e.currentTarget.src = "/avatar.png";
  }}
/>

    <div>
      <div className="font-semibold">
        {membre.prenom} {membre.nom}
      </div>

      <div className="text-sm text-gray-500">
        {membre.email}
      </div>
    </div>

  </div>
</td>

          <td className="p-4">
            {membre.fonction}
          </td>

          <td className="p-4">
            {membre.telephone}
          </td>

          <td className="p-4">

            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold
                ${
                  membre.statut === "Validé"
                    ? "bg-green-100 text-green-700"
                    : membre.statut === "Refusé"
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
            >
              {membre.statut}
            </span>

          </td>

          <td className="p-4">

            <div className="flex gap-2 justify-center">

              <div className="flex gap-2">

  <div className="flex flex-wrap gap-2">

  <Link
    href={`/admin/staff/${membre.id}`}
    className="bg-blue-600 text-white px-3 py-1 rounded"
  >
    Voir
  </Link>

  <Link
    href={`/admin/staff/${membre.id}/badge`}
    className="bg-purple-600 text-white px-3 py-1 rounded"
  >
    Badge
  </Link>

  <Link
  href={`/admin/staff/${membre.id}/badge`}
  className="bg-indigo-600 text-white px-3 py-1 rounded"
>
  Télécharger
</Link>
</div>

  <button
  onClick={() => validerStaff(membre.id)}
  className="bg-green-600 text-white px-3 py-1 rounded"
>
  Valider
</button>

  <button
    onClick={() => refuserStaff(membre.id)}
    className="bg-orange-500 text-white px-3 py-1 rounded"
  >
    Refuser
  </button>

<Link
  href={`/admin/staff/${membre.id}/edit`}
  className="bg-yellow-500 text-white px-3 py-1 rounded"
>
  Modifier
</Link>

  <button
  onClick={() => supprimerStaff(membre.id)}
  className="bg-red-600 text-white px-3 py-1 rounded"
>
  Supprimer
</button>


</div>

            </div>

          </td>

        </tr>

      ))}

    </tbody>

  </table>

</div>

</div>
);
}
