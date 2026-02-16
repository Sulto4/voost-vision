import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'

export default function Layout() {
  return (
    <div className="relative min-h-screen overflow-x-clip bg-surface-950 text-white">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(196,30,58,0.18),transparent_45%),radial-gradient(circle_at_bottom_right,rgba(196,30,58,0.14),transparent_45%)]" />
      <Header />
      <main className="relative z-10 flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
