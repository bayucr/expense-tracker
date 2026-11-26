import { ShoppingBag, Shirt, Coffee, Dumbbell } from "lucide-react";
import { formatRupiah } from "../utils/formatCurrency";

const CATEGORIES = [
  { name: "Groceries", icon: ShoppingBag },
  { name: "Clothes and Shoes", icon: Shirt },
  { name: "Cafes and Restaurants", icon: Coffee },
  { name: "Sport", icon: Dumbbell },
];

export default function Category({ transactions }) {
  // Hitung total seluruh pengeluaran sebagai pembagi persentase
  const totalExpenses = transactions
    .filter((trx) => trx.type === "expense")
    .reduce((sum, trx) => sum + trx.amount, 0);

  return (
    <div className="grid grid-cols-2 grid-rows-2 gap-4 h-full">
      {CATEGORIES.map((cat) => {
        const Icon = cat.icon;
        const totalSpent = transactions
          .filter((trx) => trx.type === "expense" && trx.category === cat.name)
          .reduce((sum, trx) => sum + trx.amount, 0);

        const percentage =
          totalExpenses > 0
            ? ((totalSpent / totalExpenses) * 100).toFixed(1)
            : 0;

        return (
          <div
            key={cat.name}
            className="bg-white/95 backdrop-blur-md text-gray-900 rounded-3xl p-6 flex flex-col justify-between shadow-lg"
          >
            {/* Baris Atas: Nama di Kiri, Ikon Basic di Kanan */}
            <div className="flex items-center justify-between">
              <p className="text-base font-medium text-gray-500">{cat.name}</p>
              <div className="p-3 rounded-full bg-gray-100 text-gray-800">
                <Icon size={22} />
              </div>
            </div>

            {/* Baris Bawah: Nominal Besar & Persentase */}
            <div>
              <p className="text-3xl xl:text-4xl font-bold tracking-tight leading-none">
                {formatRupiah(totalSpent)}
              </p>
              <span className="inline-block mt-3 px-3 py-1 rounded-full bg-gray-100 text-xs font-medium text-gray-600">
                {percentage}% of expenses
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
