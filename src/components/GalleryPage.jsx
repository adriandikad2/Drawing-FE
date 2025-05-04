"use client"

import { useEffect, useState } from "react"
import { getDrawings, deleteDrawing } from "../api"
import { Link } from "react-router-dom"
import { Trash2, Eye, Loader2, ImageIcon, PlusCircle } from "lucide-react"

export default function GalleryPage() {
  const [drawings, setDrawings] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchDrawings = async () => {
    setLoading(true)
    try {
      const res = await getDrawings()
      setDrawings(res.data)
    } catch (error) {
      console.error("Error fetching drawings:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDrawings()
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this drawing?")) return

    try {
      await deleteDrawing(id)
      fetchDrawings()
    } catch (error) {
      console.error("Error deleting drawing:", error)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-medium text-slate-900 dark:text-white">Your Artwork</h1>
        <Link
          to="/draw"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-medium rounded-full shadow-sm hover:shadow-md transition-shadow"
        >
          <PlusCircle className="w-4 h-4" />
          New Drawing
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        </div>
      ) : drawings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/50">
          <ImageIcon className="w-12 h-12 text-slate-400 dark:text-slate-500 mb-4" />
          <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No artwork yet</h3>
          <p className="text-slate-500 dark:text-slate-400 mb-6 text-center max-w-md">
            Create your first masterpiece and it will appear here.
          </p>
          <Link
            to="/draw"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-medium rounded-full shadow-sm hover:shadow-md transition-shadow"
          >
            <PlusCircle className="w-4 h-4" />
            Create Drawing
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {drawings.map((drawing) => (
            <div
              key={drawing.id}
              className="group bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="aspect-square overflow-hidden bg-slate-100 dark:bg-slate-700 relative">
                <img
                  src={drawing.data || "/placeholder.svg"}
                  alt={drawing.title}
                  className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-4">
                  <div className="flex gap-2">
                    <Link
                      to={`/view/${drawing.id}`}
                      className="flex items-center justify-center w-9 h-9 bg-white text-indigo-500 rounded-full hover:bg-indigo-50 transition-colors shadow-sm"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(drawing.id)}
                      className="flex items-center justify-center w-9 h-9 bg-white text-red-500 rounded-full hover:bg-red-50 transition-colors shadow-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-medium text-slate-900 dark:text-white truncate">{drawing.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{formatDate(drawing.created_at)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
