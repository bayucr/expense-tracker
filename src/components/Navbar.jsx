import { Bell } from "lucide-react";

const NAV_ITEMS = ["Dashboard", "Loans", "Deposits", "Documents", "Reports"];

export default function Navbar({ activePage, setActivePage }) {
  return (
    <header className="flex items-center justify-between px-8 py-4 text-white">
      {/* 1. Logo Kiri */}
      <div className="text-2xl font-black tracking-tighter">Logo</div>

      {/* 2. Menu Tengah */}
      <nav>
        <ul className="flex items-center gap-2">
          {NAV_ITEMS.map((item) => (
            <li key={item}>
              <button
                onClick={() => setActivePage(item)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition cursor-pointer ${
                  activePage === item
                    ? "bg-white/20 text-white"
                    : "text-white/70 hover:text-white"
                }`}
              >
                {item}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* 3. Ikon Kanan */}
      <div className="flex items-center gap-3">
        <button className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition">
          <Bell size={18} />
        </button>
        <div className="w-9 h-9 rounded-full bg-white text-black font-bold flex items-center justify-center text-sm">
          N
        </div>
      </div>
    </header>
  );
}
