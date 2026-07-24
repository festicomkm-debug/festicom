"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Staff = {
  id: string;
  nom: string;
  prenom: string;
  sexe: string;
  date_naissance: string;
  telephone: string;
  email: string;
  adresse: string;
  ville: string;
  pays: string;
  fonction: string;
  departement: string;
  taille_tshirt: string;
  photo: string;
  statut: string;
  matricule: string;
  contact_urgence_nom: string;
  contact_urgence_lien: string;
  contact_urgence_telephone: string;
};

export default function StaffDetailsPage() {
  const params = useParams();
  const id = params.id as string;

  const [staff, setStaff] = useState<Staff | null>(null);

  useEffect(() => {
    chargerStaff();
  }, []);

  async function chargerStaff() {
    const { data, error } = await supabase
      .from("staff")
      .select("*")
      .eq("id", id)
      .single();

    if (!error) {
      setStaff(data);
    }
  }

  if (!staff) {
    return <div className="p-8">Chargement...</div>;
  }

  return (
    <div className="p-8">
      <div className="bg-white rounded-xl shadow p-8">

       <div className="flex justify-center mb-6">
  <img
    src={staff.photo}
    alt={`${staff.prenom} ${staff.nom}`}
    className="w-40 h-40 rounded-full object-cover border-[5px] border-green-600 shadow-2xl"
  />
</div>
        <h1 className="text-3xl font-bold">
          {staff.prenom} {staff.nom}
        </h1>

        <p className="mt-2 text-gray-600">
          {staff.fonction}
        </p>

        <div className="mt-8 space-y-3">

  <p><strong>Nom :</strong> {staff.nom}</p>

  <p><strong>Prénom :</strong> {staff.prenom}</p>

  <p><strong>Sexe :</strong> {staff.sexe}</p>

  <p><strong>Date de naissance :</strong> {staff.date_naissance}</p>

  <p><strong>Téléphone :</strong> {staff.telephone}</p>

  <p><strong>Email :</strong> {staff.email}</p>

  <p><strong>Adresse :</strong> {staff.adresse}</p>

  <p><strong>Ville :</strong> {staff.ville}</p>

  <p><strong>Pays :</strong> {staff.pays}</p>

  <p><strong>Fonction :</strong> {staff.fonction}</p>

  <p><strong>Département :</strong> {staff.departement}</p>

  <p><strong>Taille T-shirt :</strong> {staff.taille_tshirt}</p>

  <p><strong>Matricule :</strong> {staff.matricule}</p>

  <p><strong>Statut :</strong> {staff.statut}</p>

  <hr className="my-4" />

  <h2 className="text-lg font-bold">
    Contact d'urgence
  </h2>

  <p>
    <strong>Nom :</strong> {staff.contact_urgence_nom}
  </p>

  <p>
    <strong>Lien :</strong> {staff.contact_urgence_lien}
  </p>

  <p>
    <strong>Téléphone :</strong> {staff.contact_urgence_telephone}
  </p>

</div>
      </div>
    </div>
  );
}