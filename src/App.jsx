import { Routes, Route } from "react-router-dom"
import CanvasPage from "./components/CanvasPage"
import GalleryPage from "./components/GalleryPage"
import ViewPage from "./components/ViewPage"
import Navbar from "./components/Navbar"
import FloatingShapes from "./components/FloatingShapes"

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 font-sans text-white overflow-hidden">
      {/* Floating background shapes */}
      <FloatingShapes />

      {/* Navbar */}
      <Navbar />

      <main className="container mx-auto px-4 sm:px-6 pt-24 pb-16 relative z-10">
        <Routes>
          <Route path="/" element={<GalleryPage />} />
          <Route path="/draw" element={<CanvasPage />} />
          <Route path="/view/:id" element={<ViewPage />} />
        </Routes>
      </main>

      <footer className="border-t border-purple-800/30 py-6 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 text-center text-purple-300 text-sm">
          © {new Date().getFullYear()} ArtCanvas - Create, Share, Inspire
        </div>
      </footer>
    </div>
  )
}
