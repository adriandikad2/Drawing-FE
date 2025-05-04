import { Routes, Route } from "react-router-dom"
import CanvasPage from "./components/CanvasPage"
import GalleryPage from "./components/GalleryPage"
import ViewPage from "./components/ViewPage"
import Navbar from "./components/Navbar"

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans text-slate-900 dark:text-slate-100">
      {/* Navbar */}
      <Navbar />

      <main className="container mx-auto px-4 sm:px-6 pt-24 pb-16">
        <Routes>
          <Route path="/" element={<GalleryPage />} />
          <Route path="/draw" element={<CanvasPage />} />
          <Route path="/view/:id" element={<ViewPage />} />
        </Routes>
      </main>

      <footer className="border-t border-slate-200 dark:border-slate-800 py-6">
        <div className="container mx-auto px-4 sm:px-6 text-center text-slate-500 dark:text-slate-400 text-sm">
          © {new Date().getFullYear()} ArtCanvas
        </div>
      </footer>
    </div>
  )
}
