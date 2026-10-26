// מבנה קבוע לכל העמודים: תפריט ניווט למעלה, ותוכן העמוד מתחת
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout() {
  return (
    <>
      <Navbar />
      <main className="container">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
