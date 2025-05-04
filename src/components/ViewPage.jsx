"use client"

import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { getDrawingById } from "../api"
import { ArrowLeft, Download, Loader2, Calendar } from "lucide-react"

export default function ViewPage() {
  const { id } = useParams()
  const [drawing, setDrawing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchDrawing = async () => {
      setLoading(true)
      try {
        const response = await getDrawingById(id)
        setDrawing(response.data)
      } catch (err) {
        console.error("Error fetching drawing:", err)
        setError("Failed to load the drawing. It may have been deleted or doesn't exist.")
      } finally {
        setLoading(false)
      }
    }

    fetchDrawing()
  }, [id])

  const handleDownload = () => {
    if (!drawing) return

    const link = document.createElement("a")
    link.download = `${drawing.title}.png`
    link.href = drawing.data
    link.click()
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/50">
        <h3 className="text-lg font-medium text-red-500 mb-4">{error}</h3>
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-medium rounded-full hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Gallery
        </Link>
      </div>
    )
  }

  if (!drawing) return null

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-medium rounded-full hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Gallery
        </Link>
        <button
          onClick={handleDownload}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-medium rounded-full shadow-sm hover:shadow-md transition-shadow w-fit"
        >
          <Download className="w-4 h-4" />
          Download
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <h1 className="text-xl font-medium text-slate-900 dark:text-white">{drawing.title}</h1>
          <div className="flex items-center text-slate-500 dark:text-slate-400 text-sm mt-2">
            <Calendar className="w-4 h-4 mr-1.5" />
            {formatDate(drawing.created_at)}
          </div>
        </div>

        <div className="bg-slate-100 dark:bg-slate-900 p-6 flex justify-center">
          <img
            src={drawing.data || "/placeholder.svg"}
            alt={drawing.title}
            className="max-w-full max-h-[70vh] rounded-md shadow-sm"
          />
        </div>
      </div>
    </div>
  )
}
