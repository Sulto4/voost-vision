import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { ArrowRight, Check, Smartphone, Apple, PlayCircle, Zap } from 'lucide-react'

export default function Mobile() {
  const { t, i18n } = useTranslation()
  const currentLang = i18n.language

  const features = [
    'iOS app development',
    'Android app development',
    'Cross-platform apps',
    'App Store deployment',
    'Push notifications',
    'Offline functionality',
  ]

  const technologies = ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Firebase', 'Expo']

  return (
    <div className="page-shell">
      <section className="section relative overflow-hidden pb-16 pt-28 md:pt-32">
        <div className="hero-backdrop" />
        <div className="container-custom">
          <div className="mx-auto mb-14 max-w-3xl text-center">
            <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-2xl border border-primary-500/[0.35] bg-primary-500/[0.12]">
              <Smartphone className="h-10 w-10 text-primary-300" />
            </div>
            <h1 className="heading-1 mb-6">
              <span className="gradient-text">{t('services.mobile')}</span>
            </h1>
            <p className="text-xl text-surface-300">
              {t('services.mobileDesc')}
            </p>
          </div>

          <div className="grid items-start gap-6 lg:grid-cols-2">
            <div className="glass-card p-8">
              <h2 className="heading-3 mb-6"{currentLang === "en" ? "What We Offer" : "Ce oferim"}</h2>
              <ul className="space-y-4">
                {features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="mt-1 h-5 w-5 flex-shrink-0 text-primary-300" />
                    <span className="text-surface-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="glass-card p-8">
              <h2 className="heading-3 mb-6"{currentLang === "en" ? "Technologies" : "Tehnologii"}</h2>
              <div className="flex flex-wrap gap-3">
                {technologies.map((tech) => (
                  <span
                    key={tech}
                    className="pill-chip border-primary-500/[0.25] bg-primary-500/[0.12] text-primary-200"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="mt-8 border-t border-white/10 pt-8">
                <h3 className="font-semibold mb-4">Platforms</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-surface-400">
                    <Apple className="h-4 w-4 text-primary-300" />
                    iOS (iPhone/iPad)
                  </div>
                  <div className="flex items-center gap-2 text-surface-400">
                    <PlayCircle className="h-4 w-4 text-primary-300" />
                    Android
                  </div>
                  <div className="flex items-center gap-2 text-surface-400">
                    <Zap className="h-4 w-4 text-primary-300" />
                    Fast performance
                  </div>
                  <div className="flex items-center gap-2 text-surface-400">
                    <Smartphone className="h-4 w-4 text-primary-300" />
                    Native feel
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link
              to={currentLang === 'en' ? '/booking' : '/programare'}
              className="btn-primary text-lg"
            >
              {t('hero.cta')}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
