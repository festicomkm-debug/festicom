"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menus = [
  {
    title: "🏠 Tableau de bord",
    href: "/admin",
  },
  {
    title: "👥 Participants",
    href: "/admin/participants",
  },
  {
    title: "🚌 Circuits",
    href: "/admin/circuits",
  },
  {
    title: "💳 Paiements",
    href: "/admin/paiements",
  },
  {
  title: "🧑‍💼 Gestion du STAFF",
  href: "/admin/staff",
},
  {
    title: "📊 Statistiques",
    href: "/admin/statistiques",
  },
  {
    title: "📄 Export",
    href: "/admin/export",
  },
  {
    title: "⚙️ Paramètres",
    href: "/admin/parametres",
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen p-5">
      <h2 className="text-2xl font-bold mb-8">
        FESTICOM
      </h2>

      <nav className="space-y-2">
        {menus.map((menu) => (
          <Link
            key={menu.href}
            href={menu.href}
            className={`block px-4 py-3 rounded-lg transition ${
              pathname === menu.href
                ? "bg-blue-600"
                : "hover:bg-gray-700"
            }`}
          >
            {menu.title}
          </Link>
        ))}
      </nav>
    </aside>
  );
}