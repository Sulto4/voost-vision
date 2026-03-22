import { useTranslation } from 'react-i18next'
import { Target, Award, HeartHandshake } from 'lucide-react'

export default function About() {
  const { t } = useTranslation()

  const values = [
    {
      icon: Award,
      title: t('about.expertise'),
      description: t('about.expertiseDesc'),
    },
    {
      icon: Target,
      title: t('about.quality'),
      description: t('about.qualityDesc'),
    },
    {
      icon: HeartHandshake,
      title: t('about.support'),
      description: t('about.supportDesc'),
    },
  ]

  return (
    <div className="page-shell">
      <section className="section relative overflow-hidden pb-14 pt-28 md:pt-32">
        <div className="hero-backdrop" />
        <div className="container-custom">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="heading-1 mt-3 mb-6">
              <span className="gradient-text">{t('about.pageTitle')}</span>
            </h1>
            <p className="text-xl text-surface-300">
              {t('about.pageSubtitle')}
            </p>
          </div>
        </div>
      </section>

      <section className="section border-y border-white/[0.08] bg-surface-950/[0.45]">
        <div className="container-custom">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div>
              <h2 className="heading-3 mb-4">{t('about.story')}</h2>
              <p className="mb-6 text-lg text-surface-300">
                {t('about.storyText')}
              </p>
              <h2 className="heading-3 mb-4">{t('about.mission')}</h2>
              <p className="text-lg text-surface-300">
                {t('about.missionText')}
              </p>
            </div>
            <div className="glass-card flex items-center justify-center p-8">
              <img src="/thumbnails/voost-vision-logo.svg" alt="Voost Vision" className="w-full max-w-md rounded-xl" loading="lazy" />
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-custom">
          <div className="mb-14 text-center">
            <h2 className="heading-2 mt-3">{t('about.whyUs')}</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {values.map((value) => (
              <div key={value.title} className="glass-card p-8 text-center">
                <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-primary-500/30 bg-primary-500/[0.12]">
                  <value.icon className="h-7 w-7 text-primary-300" />
                </div>
                <h3 className="mb-4 text-xl font-semibold">{value.title}</h3>
                <p className="text-surface-400">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
