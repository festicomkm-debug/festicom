"use client";

import Link from "next/link";

const circuits = [
  {
    nom: "🚌 Circuit Bus",
    slug: "🚌 Circuit Bus",
    couleur: "bg-blue-500",
  },
  {
    nom: "🏍️ Circuit Moto",
    slug: "🏍️ Circuit Moto",
    couleur: "bg-green-500",
  },
  {
  nom: "🌴 Beach Party",
  slug: "🌴 Beach Party",
  couleur: "bg-yellow-500",
},
{
  nom: "🏢 Exposant / Prestataire",
  slug: "🏢 Exposant / Prestataire",
  couleur: "bg-purple-500",
},
];

export default function CircuitsPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">
        Gestion des circuits
      </h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {circuits.map((circuit) => (
          <Link
            key={circuit.slug}
            href={`/admin/circuits/${encodeURIComponent(circuit.slug)}`}
          >
            <div
              className={`${circuit.couleur} text-white rounded-xl p-6 hover:scale-105 transition cursor-pointer shadow-lg`}
            >
              <h2 className="text-2xl font-bold">
                {circuit.nom}
              </h2>

              <p className="mt-4">
                Voir les participants →
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}