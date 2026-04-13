'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'motion/react'
import { Upload, CheckCircle, AlertCircle, FileUp } from 'lucide-react'
import { Card } from '@/components/Card'
import { api } from '@/api/client'

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error'

export default function UploadPage() {
  const [status, setStatus] = useState<UploadStatus>('idle')
  const [message, setMessage] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const router = useRouter()

  const handleFile = useCallback(async (file: File) => {
    if (!file.name.endsWith('.csv')) {
      setStatus('error')
      setMessage('Please upload a CSV file.')
      return
    }

    setStatus('uploading')
    setMessage('Uploading...')

    try {
      const result = await api.uploadCSV(file)
      setStatus('success')
      setMessage(`Uploaded ${result.row_count} posts successfully!`)
      setTimeout(() => router.push('/analysis'), 1500)
    } catch (e: any) {
      setStatus('error')
      setMessage(e.message || 'Upload failed')
    }
  }, [router])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }, [handleFile])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }, [handleFile])

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <div className="mb-8">
        <h2 className="text-2xl font-light tracking-tight">Upload Data</h2>
        <p className="text-white/40 text-sm mt-1">Upload your Twitter analytics CSV export</p>
      </div>

      <Card className="max-w-xl mx-auto">
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`relative rounded-lg border-2 border-dashed p-12 text-center transition-all duration-200 ${
            dragOver ? 'border-accent/50 bg-accent/[0.03]' : 'border-white/10 hover:border-white/20'
          }`}
        >
          {status === 'idle' && (
            <>
              <FileUp className="w-10 h-10 text-white/20 mx-auto mb-4" />
              <p className="text-sm text-white/50 mb-4">Drag and drop your CSV file here, or click to browse</p>
              <label className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent/10 text-accent rounded-lg text-sm cursor-pointer hover:bg-accent/20 transition-colors">
                <Upload className="w-4 h-4" />
                Choose File
                <input type="file" accept=".csv" onChange={handleInputChange} className="hidden" />
              </label>
            </>
          )}

          {status === 'uploading' && (
            <div className="py-4">
              <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-sm text-white/50">{message}</p>
            </div>
          )}

          {status === 'success' && (
            <div className="py-4">
              <CheckCircle className="w-10 h-10 text-accent mx-auto mb-4" />
              <p className="text-sm text-accent">{message}</p>
              <p className="text-xs text-white/30 mt-2">Redirecting to analysis...</p>
            </div>
          )}

          {status === 'error' && (
            <div className="py-4">
              <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-4" />
              <p className="text-sm text-red-400 mb-4">{message}</p>
              <button onClick={() => { setStatus('idle'); setMessage('') }} className="text-sm text-white/50 hover:text-white/80 underline">
                Try again
              </button>
            </div>
          )}
        </div>

        <div className="mt-6 p-4 rounded-lg bg-white/[0.02]">
          <p className="text-xs text-white/30 mb-2">Required CSV columns:</p>
          <div className="flex flex-wrap gap-2">
            {['Post text', 'Impressions', 'Likes'].map((col) => (
              <span key={col} className="text-xs px-2 py-1 rounded bg-white/[0.05] text-white/40 font-mono">{col}</span>
            ))}
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
