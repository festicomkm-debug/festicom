"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function ModifierStaffPage() {
  const { id } = useParams();
  const router = useRouter();

  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    telephone: "",
    email: "",
    fonction: "",
    departement: "",
    statut: "",
  });

  useEffect(() => {
    chargerStaff();
  }, []);

  async function chargerStaff() {
    const { data, error } = await supabase
      .from("staff")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      alert(error.message);
      return;
    }

    setForm({
      nom: data.nom || "",
      prenom: data.prenom || "",
      telephone: data.telephone || "",
      email: data.email || "",
      fonction: data.fonction || "",
      departement: data.departement || "",
      statut: data.statut || "",
    });
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function enregistrer() {
    const { error } = await supabase
      .from("staff")
      .update(form)
      .match({ id: id });

    if (error) {
      alert(error.message);
      return;
    }

    alert("Modification enregistrée.");

    router.push("/admin/staff");
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">

      <h1 className="text-3xl font-bold mb-8">
        Modifier un membre
      </h1>

      <div className="bg-white rounded-xl shadow p-8 space-y-5">

        <input
          name="nom"
          value={form.nom}
          onChange={handleChange}
          placeholder="Nom"
          className="w-full border rounded-lg p-3"
        />

        <input
          name="prenom"
          value={form.prenom}
          onChange={handleChange}
          placeholder="Prénom"
          className="w-full border rounded-lg p-3"
        />

        <input
          name="telephone"
          value={form.telephone}
          onChange={handleChange}
          placeholder="Téléphone"
          className="w-full border rounded-lg p-3"
        />

        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full border rounded-lg p-3"
        />

        <input
          name="fonction"
          value={form.fonction}
          onChange={handleChange}
          placeholder="Fonction"
          className="w-full border rounded-lg p-3"
        />

        <input
          name="departement"
          value={form.departement}
          onChange={handleChange}
          placeholder="Département"
          className="w-full border rounded-lg p-3"
        />

        <select
          name="statut"
          value={form.statut}
          onChange={handleChange}
          className="w-full border rounded-lg p-3"
        >
          <option value="En attente">En attente</option>
          <option value="Validé">Validé</option>
          <option value="Refusé">Refusé</option>
        </select>

        <button
          onClick={enregistrer}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold"
        >
          Enregistrer les modifications
        </button>

      </div>

    </div>
  );
}