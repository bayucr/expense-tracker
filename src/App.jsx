import { useState } from "react";
import Navbar from "./components/Navbar";

function App() {
  const [activePage, setActivePage] = useState("Dashboard");

  return (
    <div className="h-screen overflow-hidden flex flex-col bg-gradient-to-b from-red-950 via-red-800 to-orange-500">
      <Navbar activePage={activePage} setActivePage={setActivePage} />
      <main className="flex-1 flex items-center justify-center text-white text-2xl font-bold">
        {activePage === "Dashboard" && <p>Ini Halaman Dashboard</p>}
        {activePage === "Loans" && <p>Ini Halaman Loans</p>}
        {activePage === "Deposits" && <p>Ini Halaman Deposits</p>}
        {activePage === "Documents" && <p>Ini Halaman Documents</p>}
        {activePage === "Reports" && <p>Ini Halaman Reports</p>}
      </main>
    </div>
  );
}

export default App;
