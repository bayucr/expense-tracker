import { ArrowDownLeft, ArrowUpRight } from "lucide-react";

export default function Hero({ totalBalance }) {
  // Ubah angka mentah jadi format ribuan dengan 2 angka di belakang koma
  const formatRupiah = (amount) => {
    return amount.toLocaleString("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    });
  };

  return (
    <section className="flex items-center justify-between py-3 text-white">
      {/* Bagian Kiri: Teks Sapaan & Tombol Aksi */}
      <div>
        <p className="text-sm text-white/80 mb-1">
          Track your balance, recent activity, and financial goals all in one
          place.
        </p>
        <h1 className="text-4xl font-semibold tracking-tight mb-5">
          Welcome Back, Nixtio!
        </h1>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-white text-gray-900 px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-white/90 transition cursor-pointer">
            <ArrowDownLeft size={16} />
            Deposit
          </button>
          <button className="flex items-center gap-2 bg-white text-gray-900 px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-white/90 transition cursor-pointer">
            <ArrowUpRight size={16} />
            Withdraw
          </button>
        </div>
      </div>

      {/* Bagian Kanan: Kartu Saldo Transparan */}
      <div className="relative w-80 bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl p-5 shadow-lg">
        <div className="flex items-center justify-between text-xs text-white/80 mb-6">
          <div className="flex items-center gap-3">
            <span>•••• 9286</span>
            <span>08/32</span>
          </div>
          <span className="font-bold italic text-base text-white">VISA</span>
        </div>

        <div className="text-center pb-2">
          <p className="text-3xl font-bold tracking-tight">
            {formatRupiah(totalBalance)}
          </p>
          <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full bg-white/15 text-[11px] text-white/90">
            ↗ 2.46% this month
          </span>
        </div>
      </div>
    </section>
  );
}
