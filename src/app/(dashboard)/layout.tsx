import { Sidebar } from '@/components/Sidebar'
import { Providers } from '@/components/Providers'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Providers>
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto p-8">
            {children}
          </div>
        </main>
      </div>
    </Providers>
  )
}
