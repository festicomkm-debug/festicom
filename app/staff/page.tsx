"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function StaffRegistrationPage() {
  const [loading, setLoading] = useState(false);
const [photo, setPhoto] = useState<File | null>(null);;

  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    sexe: "",
    date_naissance: "",
    telephone: "",
    email: "",
    adresse: "",
    ville: "",
    pays: "Comores",
    fonction: "",
    departement: "",
    taille_tshirt: "",
    contact_urgence_nom: "",
contact_urgence_lien: "",
contact_urgence_telephone: "",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

 async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();

  setLoading(true);

  let photoUrl = "";

  if (photo) {
    const fileName = `${Date.now()}-${photo.name}`;

    const { error: uploadError } = await supabase.storage
      .from("staff")
      .upload(fileName, photo);

    if (uploadError) {
      setLoading(false);
      alert(uploadError.message);
      return;
    }

    const { data } = supabase.storage
      .from("staff")
      .getPublicUrl(fileName);

    photoUrl = data.publicUrl;
  }

  const { error } = await supabase
    .from("staff")
    .insert([
      {
        ...form,
        photo: photoUrl,
        statut: "En attente",
        role: "Staff",
        actif: true,
      },
    ]);

  setLoading(false);

  if (error) {
    alert(error.message);
    return;
  }

  alert("Votre inscription a été envoyée avec succès.");

  setPhoto(null);

  setForm({
    nom: "",
    prenom: "",
    sexe: "",
    date_naissance: "",
    telephone: "",
    email: "",
    adresse: "",
    ville: "",
    pays: "Comores",
    fonction: "",
    departement: "",
    taille_tshirt: "",
    contact_urgence_nom: "",
    contact_urgence_lien: "",
    contact_urgence_telephone: "",
  });
}
return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl p-8">

        <h1 className="text-3xl font-bold text-center mb-2">
          FESTICOM - STAFF 2026
        </h1>

        <p className="text-center text-gray-500 mb-8">
          Formulaire d'inscription du Staff d'organisation
        </p>

        <form
          onSubmit={handleSubmit}
          className="grid md:grid-cols-2 gap-5"
        >

          <input
            type="text"
            name="nom"
            placeholder="Nom"
            value={form.nom}
            onChange={handleChange}
            required
            className="border rounded-lg p-3"
          />

          <input
            type="text"
            name="prenom"
            placeholder="Prénom"
            value={form.prenom}
            onChange={handleChange}
            required
            className="border rounded-lg p-3"
          />

          <select
            name="sexe"
            value={form.sexe}
            onChange={handleChange}
            required
            className="border rounded-lg p-3"
          >
            <option value="">Sexe</option>
            <option>Homme</option>
            <option>Femme</option>
          </select>

          <input
            type="date"
            name="date_naissance"
            value={form.date_naissance}
            onChange={handleChange}
            className="border rounded-lg p-3"
          />

          <input
            type="tel"
            name="telephone"
            placeholder="Téléphone"
            value={form.telephone}
            onChange={handleChange}
            required
            className="border rounded-lg p-3"
          />

          <input
            type="email"
            name="email"
            placeholder="Adresse e-mail"
            value={form.email}
            onChange={handleChange}
            className="border rounded-lg p-3"
          />

          <input
            type="text"
            name="adresse"
            placeholder="Adresse"
            value={form.adresse}
            onChange={handleChange}
            className="border rounded-lg p-3"
          />

          <input
            type="text"
            name="ville"
            placeholder="Ville"
            value={form.ville}
            onChange={handleChange}
            className="border rounded-lg p-3"
          />

          <input
            type="text"
            name="pays"
            placeholder="Pays"
            value={form.pays}
            onChange={handleChange}
            className="border rounded-lg p-3"
          />

          <input
            type="text"
            name="fonction"
            placeholder="Fonction"
            value={form.fonction}
            onChange={handleChange}
            required
            className="border rounded-lg p-3"
          />

          <input
            type="text"
            name="departement"
            placeholder="Département"
            value={form.departement}
            onChange={handleChange}
            className="border rounded-lg p-3"
          />
          <input
            type="text"
            name="contact_urgence_nom"
            placeholder="Nom du contact d'urgence"
            value={form.contact_urgence_nom}
            onChange={handleChange}
            className="border rounded-lg p-3"
          />
          <input
            type="text"
            name="contact_urgence_lien"
            placeholder="Lien avec le contact d'urgence"
            value={form.contact_urgence_lien}
            onChange={handleChange}
            className="border rounded-lg p-3"
          />
          <input
            type="text"
            name="contact_urgence_telephone"
            placeholder="Téléphone du contact d'urgence"
            value={form.contact_urgence_telephone}
            onChange={handleChange}
            className="border rounded-lg p-3"
          />

          <select
            name="taille_tshirt"
            value={form.taille_tshirt}
            onChange={handleChange}
            className="border rounded-lg p-3"
          >
            <option value="">Taille du T-shirt</option>
            <option>XS</option>
            <option>S</option>
            <option>M</option>
            <option>L</option>
            <option>XL</option>
            <option>XXL</option>
          </select>

<div className="md:col-span-2">
  <label className="block mb-2 font-medium">
    Photo d'identité
  </label>

  <input
    type="file"
    accept="image/*"
    onChange={(e) => {
      if (e.target.files?.[0]) {
        setPhoto(e.target.files[0]);
      }
    }}
    className="border rounded-lg p-3 w-full"
  />
</div>
          <div className="md:col-span-2">

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition"
            >
              {loading
                ? "Enregistrement..."
                : "S'inscrire au Staff"}
            </button>

          </div>

        </form>

      </div>
    </div>
  );
}