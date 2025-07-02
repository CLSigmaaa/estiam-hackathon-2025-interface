"use client"

import { CalendarDays, Upload, Download, Check } from "lucide-react"
import { Button } from "./ui/button"
import { useRef, useState } from "react"

export const TempNavbar = () => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [message, setMessage] = useState<string | null>(null)

  const handleExport = async () => {
    try {
      const res = await fetch("/api/export-config")
      if (!res.ok) throw new Error("Erreur lors de l’export")
      const blob = await res.blob()

      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "config_backup.json.enc"
      a.click()

      setMessage("Export réussi.")
    } catch (error) {
      setMessage("Échec de l’export.")
    }
  }

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await fetch("/api/import-config", {
        method: "POST",
        body: formData,
      })
      if (!res.ok) throw new Error("Échec lors de l’import")
      setMessage("✅ Import réussi.")
    } catch (error) {
      setMessage("❌ Échec de l’import.")
    }
  }

  return (
    <div className="bg-background border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">MonitorControl</h1>
          <p className="text-sm text-muted-foreground">Gestion des affectations</p>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="file"
            accept=".json,.enc"
            ref={fileInputRef}
            onChange={handleImport}
            className="hidden"
          />
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Exporter la config
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-4 w-4 mr-2" />
            Importer une config
          </Button>
        </div>
      </div>
      {message && (
        <div className="mt-2 text-sm text-muted-foreground">{message}</div>
      )}
    </div>
  )
}