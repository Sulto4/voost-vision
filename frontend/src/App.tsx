import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { ThemeProvider } from '@/hooks/useTheme'
import Layout from '@/components/layout/Layout'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

// Lazy load pages for better performance
const Home = lazy(() => import('@/pages/Home'))
const About = lazy(() => import('@/pages/About'))
const Services = lazy(() => import('@/pages/Services'))
const WebDevelopment = lazy(() => import('@/pages/services/WebDevelopment'))
const WebApps = lazy(() => import('@/pages/services/WebApps'))
const Mobile = lazy(() => import('@/pages/services/Mobile'))
const Design = lazy(() => import('@/pages/services/Design'))
const Portfolio = lazy(() => import('@/pages/Portfolio'))
const PortfolioDetail = lazy(() => import('@/pages/portfolio/PortfolioDetail'))
const Blog = lazy(() => import('@/pages/Blog'))
const BlogDetail = lazy(() => import('@/pages/blog/BlogDetail'))
const Booking = lazy(() => import('@/pages/Booking'))
const Contact = lazy(() => import('@/pages/Contact'))
const NotFound = lazy(() => import('@/pages/NotFound'))

// Admin pages
const AdminLogin = lazy(() => import('@/pages/admin/AdminLogin'))
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'))
const AdminPortfolio = lazy(() => import('@/pages/admin/AdminPortfolio'))
const AdminBlog = lazy(() => import('@/pages/admin/AdminBlog'))
const AdminBookings = lazy(() => import('@/pages/admin/AdminBookings'))
const AdminContact = lazy(() => import('@/pages/admin/AdminContact'))

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Suspense fallback={<LoadingSpinner fullScreen />}>
          <Routes>
            {/* Public routes with layout */}
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/despre" element={<About />} />
              <Route path="/about" element={<About />} />
              <Route path="/servicii" element={<Services />} />
              <Route path="/services" element={<Services />} />
              <Route path="/services/web-development" element={<WebDevelopment />} />
              <Route path="/servicii/dezvoltare-web" element={<WebDevelopment />} />
              <Route path="/services/web-apps" element={<WebApps />} />
              <Route path="/servicii/aplicatii-web" element={<WebApps />} />
              <Route path="/services/mobile" element={<Mobile />} />
              <Route path="/servicii/mobile" element={<Mobile />} />
              <Route path="/services/design" element={<Design />} />
              <Route path="/servicii/design" element={<Design />} />
              <Route path="/portofoliu" element={<Portfolio />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/portfolio/:id" element={<PortfolioDetail />} />
              <Route path="/portofoliu/:id" element={<PortfolioDetail />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogDetail />} />
              <Route path="/programare" element={<Booking />} />
              <Route path="/booking" element={<Booking />} />
              <Route path="/contact" element={<Contact />} />
            </Route>

            {/* Admin routes */}
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/portfolio" element={<AdminPortfolio />} />
            <Route path="/admin/blog" element={<AdminBlog />} />
            <Route path="/admin/bookings" element={<AdminBookings />} />
            <Route path="/admin/contact" element={<AdminContact />} />

            {/* Language prefixed routes */}
            <Route path="/en/*" element={<Layout />}>
              <Route path="" element={<Home />} />
              <Route path="about" element={<About />} />
              <Route path="services" element={<Services />} />
              <Route path="services/web-development" element={<WebDevelopment />} />
              <Route path="services/web-apps" element={<WebApps />} />
              <Route path="services/mobile" element={<Mobile />} />
              <Route path="services/design" element={<Design />} />
              <Route path="portfolio" element={<Portfolio />} />
              <Route path="portfolio/:id" element={<PortfolioDetail />} />
              <Route path="blog" element={<Blog />} />
              <Route path="blog/:slug" element={<BlogDetail />} />
              <Route path="booking" element={<Booking />} />
              <Route path="contact" element={<Contact />} />
            </Route>

            <Route path="/ro/*" element={<Layout />}>
              <Route path="" element={<Home />} />
              <Route path="despre" element={<About />} />
              <Route path="servicii" element={<Services />} />
              <Route path="servicii/dezvoltare-web" element={<WebDevelopment />} />
              <Route path="servicii/aplicatii-web" element={<WebApps />} />
              <Route path="servicii/mobile" element={<Mobile />} />
              <Route path="servicii/design" element={<Design />} />
              <Route path="portofoliu" element={<Portfolio />} />
              <Route path="portofoliu/:id" element={<PortfolioDetail />} />
              <Route path="blog" element={<Blog />} />
              <Route path="blog/:slug" element={<BlogDetail />} />
              <Route path="programare" element={<Booking />} />
              <Route path="contact" element={<Contact />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Router>
    </ThemeProvider>
  )
}

export default App
