import { useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Category from "./components/Category";
import { initialTransactions } from "./data/dummyTransactions";

function App() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [transactions, setTransactions] = useState(initialTransactions);

  const totalBalance = initialTransactions.reduce((total, item) => {
    return item.type === "income" ? total + item.amount : total - item.amount;
  }, 0);

  return (
    <div className="h-screen overflow-hidden flex flex-col bg-gradient-to-b from-red-950 via-red-800 to-orange-500">
      <Navbar activePage={activePage} setActivePage={setActivePage} />
      <main className="flex-1 flex flex-col px-8 pb-6 overflow-hidden text-white">
        {activePage === "Dashboard" && (
          <>
            <Hero totalBalance={totalBalance} />
            <div className="flex-1 grid grid-cols-12 gap-5 mt-2 min-h-0">
              <div className="col-span-7">
                <Category transactions={transactions} />
              </div>
              {/* Area kanan (col-span-5) kita isi Riwayat Transaksi di Misi #5 */}
            </div>
          </>
        )}
        {activePage === "Loans" && <p>Ini Halaman Loans</p>}
        {activePage === "Deposits" && <p>Ini Halaman Deposits</p>}
        {activePage === "Documents" && <p>Ini Halaman Documents</p>}
        {activePage === "Reports" && <p>Ini Halaman Reports</p>}
      </main>
    </div>
  );
}

export default App;
