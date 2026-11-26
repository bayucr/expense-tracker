import { useState } from "react";
import Navbar from "./components/Navbar";
import { initialTransactions } from "./data/dummyTransactions";

const totalBalance = initialTransactions.reduce((total, item) => {
  return item.type === "income" ? total + item.amount : total - item.amount;
}, 0);

function App() {
  const [activePage, setActivePage] = useState("Dashboard");

  return (
    <div className="h-screen overflow-hidden flex flex-col bg-gradient-to-b from-red-950 via-red-800 to-orange-500">
      <Navbar activePage={activePage} setActivePage={setActivePage} />
      <main className="flex-1 flex flex-col px-8 pb-6 overflow-hidden text-white">
        {activePage === "Dashboard" && (
          <p>Saldo Saat Ini: ${totalBalance.toFixed(2)}</p>
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
