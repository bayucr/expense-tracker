import { ShoppingBag, Shirt, Coffee, Dumbbell } from "lucide-react";
import { formatRupiah } from "../utils/formatCurrency";

const CATEGORIES = [
  {
    name: "Groceries",
    icon: ShoppingBag,
    color: "bg-orange-100 text-orange-600",
  },
  {
    name: "Clothes and Shoes",
    icon: Shirt,
    color: "bg-blue-100 text-blue-600",
  },
  {
    name: "Cafes and Restaurants",
    icon: Coffee,
    color: "bg-amber-100 text-amber-700",
  },
  { name: "Sport", icon: Dumbbell, color: "bg-emerald-100 text-emerald-600" },
];

export default function Category({ transactions }) {
  return (
    <div className="grid grid-cols-2 grid-rows-2 gap-4 h-full">
      {CATEGORIES.map((cat) => {
        const Icon = cat.icon;
        const categoryTrx = transactions.filter(
          (trx) => trx.type === "expense" && trx.category === cat.name,
        );
        const totalSpent = categoryTrx.reduce(
          (sum, trx) => sum + trx.amount,
          0,
        );

        return (
          <div
            key={cat.name}
            className="bg-white/95 backdrop-blur-md text-gray-900 rounded-3xl p-5 flex flex-col justify-between shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-2xl ${cat.color}`}>
                <Icon size={20} />
              </div>
              <span className="text-xs font-medium text-gray-400">
                {categoryTrx.length} transaksi
              </span>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">{cat.name}</p>
              <p className="text-2xl font-bold tracking-tight mt-0.5">
                {formatRupiah(totalSpent)}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
