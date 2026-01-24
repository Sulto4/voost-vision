import { useTranslation } from 'react-i18next'
import { Users, Target, Award, HeartHandshake } from 'lucide-react'

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
    <div className="pt-16 md:pt-20">
      {/* Hero Section */}
      <section className="section">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="heading-1 mb-6">
              <span className="gradient-text">{t('about.pageTitle')}</span>
            </h1>
            <p className="text-xl text-surface-300">
              {t('about.pageSubtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="section bg-surface-950/50">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="heading-3 mb-4">{t('about.story')}</h2>
              <p className="text-surface-300 text-lg mb-6">
                {t('about.storyText')}
              </p>
              <h2 className="heading-3 mb-4">{t('about.mission')}</h2>
              <p className="text-surface-300 text-lg">
                {t('about.missionText')}
              </p>
            </div>
            <div className="glass-card p-8 flex items-center justify-center">
              <Users className="w-48 h-48 text-primary-500/30" />
            </div>
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section className="section">
        <div className="container-custom">
          <h2 className="heading-2 text-center mb-16">{t('about.whyUs')}</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value) => (
              <div key={value.title} className="glass-card p-8 text-center">
                <div className="w-16 h-16 rounded-2xl bg-primary-500/20 flex items-center justify-center mx-auto mb-6">
                  <value.icon className="w-8 h-8 text-primary-400" />
                </div>
                <h3 className="text-xl font-semibold mb-4">{value.title}</h3>
                <p className="text-surface-400">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
