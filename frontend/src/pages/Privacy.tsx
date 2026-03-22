import { useTranslation } from 'react-i18next'
import { Building2, Mail, ShieldCheck } from 'lucide-react'

interface LegalSection {
  title: string
  paragraphs: string[]
  bullets?: string[]
}

interface LegalCard {
  title: string
  value: string
  icon: typeof Building2
}

interface LegalContent {
  title: string
  subtitle: string
  updatedLabel: string
  updatedValue: string
  introTitle: string
  introText: string
  cards: LegalCard[]
  sections: LegalSection[]
  contactTitle: string
  contactText: string
}

const PRIVACY_CONTENT: Record<'ro' | 'en', LegalContent> = {
  ro: {
    title: 'Politica de confidențialitate',
    subtitle:
      'Această politică explică ce date personale colectăm prin site-ul voostvision.ro, de ce le prelucrăm și care sunt drepturile tale conform GDPR.',
    updatedLabel: 'Ultima actualizare',
    updatedValue: '22 martie 2026',
    introTitle: 'Despre această politică',
    introText:
      'VOOST VISION S.R.L. prelucrează date cu caracter personal atunci când ne contactezi, soliciți o ofertă, programezi o discuție sau navighezi pe site. Prelucrăm doar datele necesare pentru comunicare, ofertare, organizarea întâlnirilor și îmbunătățirea serviciilor noastre.',
    cards: [
      {
        title: 'Operator de date',
        value:
          'VOOST VISION S.R.L.\nCUI 53289768\nNr. Reg. Com. J20/2616/2026',
        icon: Building2,
      },
      {
        title: 'Contact GDPR / DPO',
        value:
          'contact@voostvision.ro\n+40 721 819 077\nEUID: ROONRC.J2026002616009',
        icon: ShieldCheck,
      },
      {
        title: 'Sediu',
        value:
          'Municipiul Bucuresti, Sector 3,\nAle Varfu Cu Dor, Nr. 25\nCAEN 6210',
        icon: Mail,
      },
    ],
    sections: [
      {
        title: '1. Ce date colectăm',
        paragraphs: [
          'Colectăm datele pe care ni le furnizezi direct și date tehnice necesare funcționării și analizei site-ului.',
        ],
        bullets: [
          'Formular de contact: nume, email, subiect și mesaj.',
          'Programare / booking: nume, email, companie, descriere proiect, data și ora întâlnirii.',
          'Date tehnice: adresă IP, tip browser, pagini vizitate, durată sesiune și interacțiuni agregate prin Google Analytics.',
          'Comunicări ulterioare: informațiile pe care ni le trimiți prin email, telefon sau în cadrul discuțiilor comerciale.',
        ],
      },
      {
        title: '2. Cum folosim datele',
        paragraphs: [
          'Folosim datele pentru a răspunde solicitărilor, pentru a organiza întâlniri și pentru a putea presta serviciile solicitate.',
        ],
        bullets: [
          'Pentru a răspunde la cereri trimise prin formularul de contact.',
          'Pentru a confirma, organiza și gestiona programările.',
          'Pentru a pregăti oferte comerciale, propuneri tehnice și discuții de vânzare.',
          'Pentru securitate, prevenirea abuzului și limitarea tentativelor automate sau frauduloase.',
          'Pentru analiză statistică și optimizarea site-ului prin Google Analytics.',
          'Pentru îndeplinirea obligațiilor legale, contabile și fiscale atunci când relația evoluează într-un contract.',
        ],
      },
      {
        title: '3. Temeiul legal al prelucrării',
        paragraphs: [
          'Prelucrăm datele în principal în baza art. 6 alin. (1) lit. b), c), f) și, după caz, lit. a) din GDPR.',
        ],
        bullets: [
          'Executarea demersurilor precontractuale la cererea ta, când soliciți ofertă sau programare.',
          'Interes legitim pentru securitatea site-ului, apărarea drepturilor noastre și îmbunătățirea serviciilor.',
          'Obligație legală pentru documente contabile, fiscale sau alte evidențe impuse de lege.',
          'Consimțământ, acolo unde legea îl cere, inclusiv pentru anumite cookie-uri de analiză.',
        ],
      },
      {
        title: '4. Cookie-uri și Google Analytics',
        paragraphs: [
          'Site-ul poate utiliza cookie-uri și tehnologii similare pentru funcționare, măsurarea traficului și înțelegerea modului în care vizitatorii folosesc paginile noastre.',
          'Google Analytics poate colecta informații precum adresa IP, identificatori online, tipul dispozitivului, paginile vizitate și evenimente de navigare. Folosim aceste date în scop statistic, agregat, pentru a îmbunătăți conținutul și performanța site-ului.',
        ],
        bullets: [
          'Cookie-uri esențiale pentru funcționarea tehnică a site-ului.',
          'Cookie-uri de analiză Google Analytics, activate în condițiile permise de legislația aplicabilă.',
          'Poți controla sau șterge cookie-urile din setările browserului tău. Dezactivarea unor cookie-uri poate afecta anumite funcționalități.',
        ],
      },
      {
        title: '5. Cui divulgăm datele',
        paragraphs: [
          'Nu vindem date personale. Putem transmite date doar către furnizori și parteneri necesari pentru operarea site-ului și prestarea serviciilor.',
        ],
        bullets: [
          'Furnizori de hosting, infrastructură cloud și servicii tehnice.',
          'Furnizori de analiză și măsurare trafic, inclusiv Google Analytics.',
          'Furnizori de email, notificări și instrumente folosite pentru gestionarea contactelor și programărilor.',
          'Autorități publice sau consultanți, atunci când avem o obligație legală sau un interes legitim justificat.',
        ],
      },
      {
        title: '6. Transferuri, stocare și securitate',
        paragraphs: [
          'Păstrăm datele doar atât cât este necesar pentru scopurile pentru care au fost colectate sau pentru perioadele impuse de lege.',
          'Aplicăm măsuri tehnice și organizatorice rezonabile pentru a proteja datele împotriva accesului neautorizat, pierderii, modificării sau divulgării.',
        ],
        bullets: [
          'Cereri de contact și booking fără contract: de regulă până la 24 de luni, dacă nu este necesară o perioadă mai lungă pentru apărarea drepturilor noastre.',
          'Documente comerciale, contractuale și fiscale: pe durata cerută de legislația aplicabilă.',
          'Dacă folosim furnizori din afara SEE, ne bazăm pe mecanisme legale adecvate, precum clauzele contractuale standard, acolo unde este necesar.',
        ],
      },
      {
        title: '7. Drepturile tale',
        paragraphs: [
          'Conform GDPR, poți exercita oricând drepturile de mai jos, în condițiile și limitele prevăzute de lege.',
        ],
        bullets: [
          'Dreptul de acces la datele prelucrate.',
          'Dreptul la rectificarea datelor inexacte sau incomplete.',
          'Dreptul la ștergerea datelor, atunci când există temei legal.',
          'Dreptul la restricționarea prelucrării.',
          'Dreptul la portabilitatea datelor.',
          'Dreptul de opoziție la anumite prelucrări bazate pe interes legitim.',
          'Dreptul de a-ți retrage consimțământul, fără a afecta prelucrările anterioare retragerii.',
          'Dreptul de a depune o plângere la ANSPDCP.',
        ],
      },
    ],
    contactTitle: 'Contact pentru protecția datelor',
    contactText:
      'Pentru solicitări privind datele personale, ne poți scrie la contact@voostvision.ro sau la sediul din Municipiul Bucuresti, Sector 3, Ale Varfu Cu Dor, Nr. 25. Vom răspunde într-un termen rezonabil, conform obligațiilor legale aplicabile.',
  },
  en: {
    title: 'Privacy Policy',
    subtitle:
      'This policy explains what personal data we collect through voostvision.ro, why we process it, and what rights you have under the GDPR.',
    updatedLabel: 'Last updated',
    updatedValue: 'March 22, 2026',
    introTitle: 'About this policy',
    introText:
      'VOOST VISION S.R.L. processes personal data when you contact us, request a quote, book a call, or browse the website. We only process data that is necessary for communication, quoting, meeting scheduling, and improving our services.',
    cards: [
      {
        title: 'Data controller',
        value:
          'VOOST VISION S.R.L.\nTax ID 53289768\nTrade Registry J20/2616/2026',
        icon: Building2,
      },
      {
        title: 'GDPR / DPO contact',
        value:
          'contact@voostvision.ro\n+40 721 819 077\nEUID: ROONRC.J2026002616009',
        icon: ShieldCheck,
      },
      {
        title: 'Registered office',
        value:
          'Bucharest, District 3,\nAle Varfu Cu Dor, No. 25\nNACE 6210',
        icon: Mail,
      },
    ],
    sections: [
      {
        title: '1. What data we collect',
        paragraphs: [
          'We collect data you provide directly and technical data required to operate and analyze the website.',
        ],
        bullets: [
          'Contact form: name, email, subject, and message.',
          'Booking flow: name, email, company, project description, meeting date, and meeting time.',
          'Technical data: IP address, browser type, pages visited, session duration, and aggregated interactions through Google Analytics.',
          'Follow-up communications: information you send by email, phone, or during commercial discussions.',
        ],
      },
      {
        title: '2. How we use the data',
        paragraphs: [
          'We use personal data to answer requests, organize meetings, and deliver the services you request.',
        ],
        bullets: [
          'To respond to messages submitted through the contact form.',
          'To confirm, organize, and manage booked meetings.',
          'To prepare proposals, quotes, and technical recommendations.',
          'To secure the website, prevent abuse, and limit automated or fraudulent activity.',
          'To produce analytics and improve the site through Google Analytics.',
          'To comply with legal, accounting, and tax obligations where the relationship develops into a contract.',
        ],
      },
      {
        title: '3. Legal basis for processing',
        paragraphs: [
          'We primarily rely on Article 6(1)(b), (c), (f), and where applicable Article 6(1)(a) of the GDPR.',
        ],
        bullets: [
          'Pre-contractual steps taken at your request when you ask for a quote or book a call.',
          'Legitimate interests related to website security, defending our rights, and improving our services.',
          'Legal obligations for accounting, tax, and record-keeping requirements.',
          'Consent where required by law, including for certain analytics cookies.',
        ],
      },
      {
        title: '4. Cookies and Google Analytics',
        paragraphs: [
          'The website may use cookies and similar technologies for technical operation, traffic measurement, and understanding how visitors use our pages.',
          'Google Analytics may collect information such as IP address, online identifiers, device type, pages visited, and browsing events. We use this information for aggregated statistical analysis to improve site performance and content.',
        ],
        bullets: [
          'Essential cookies required for the technical operation of the website.',
          'Google Analytics cookies, used in accordance with applicable legal requirements.',
          'You can control or delete cookies from your browser settings. Disabling some cookies may affect certain functions of the site.',
        ],
      },
      {
        title: '5. Who we share data with',
        paragraphs: [
          'We do not sell personal data. We only share data with providers and partners needed to operate the website and deliver our services.',
        ],
        bullets: [
          'Hosting, cloud infrastructure, and technical service providers.',
          'Traffic measurement and analytics providers, including Google Analytics.',
          'Email, notification, and tooling providers used to manage contacts and bookings.',
          'Public authorities or professional advisers where required by law or justified by a legitimate interest.',
        ],
      },
      {
        title: '6. Transfers, retention, and security',
        paragraphs: [
          'We keep personal data only for as long as necessary for the purposes described above or for as long as required by law.',
          'We apply reasonable technical and organizational measures to protect data against unauthorized access, loss, alteration, or disclosure.',
        ],
        bullets: [
          'Contact and booking requests without a contract: generally up to 24 months, unless a longer period is needed to protect our rights.',
          'Commercial, contractual, and tax documents: for the retention period required by applicable law.',
          'If we use providers outside the EEA, we rely on appropriate legal safeguards such as standard contractual clauses where required.',
        ],
      },
      {
        title: '7. Your rights',
        paragraphs: [
          'Under the GDPR, you may exercise the following rights, subject to the conditions and limitations provided by law.',
        ],
        bullets: [
          'Right of access to your personal data.',
          'Right to rectification of inaccurate or incomplete data.',
          'Right to erasure where a legal basis exists.',
          'Right to restriction of processing.',
          'Right to data portability.',
          'Right to object to certain processing based on legitimate interests.',
          'Right to withdraw consent without affecting prior processing.',
          'Right to lodge a complaint with the Romanian supervisory authority or another competent authority.',
        ],
      },
    ],
    contactTitle: 'Data protection contact',
    contactText:
      'For requests related to personal data, contact us at contact@voostvision.ro or by post at Bucharest, District 3, Ale Varfu Cu Dor, No. 25. We will respond within a reasonable timeframe, in line with applicable legal obligations.',
  },
}

export default function Privacy() {
  const { i18n } = useTranslation()
  const currentLang = i18n.language === 'en' ? 'en' : 'ro'
  const content = PRIVACY_CONTENT[currentLang]

  return (
    <div className="page-shell">
      <section className="section relative overflow-hidden pb-14 pt-28 md:pt-32">
        <div className="hero-backdrop" />
        <div className="container-custom">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary-300">
              {content.updatedLabel}: {content.updatedValue}
            </p>
            <h1 className="heading-1 mt-3 mb-6">
              <span className="gradient-text">{content.title}</span>
            </h1>
            <p className="text-xl text-surface-300">{content.subtitle}</p>
          </div>
        </div>
      </section>

      <section className="section border-y border-white/[0.08] bg-surface-950/[0.45]">
        <div className="container-custom">
          <div className="mx-auto max-w-5xl">
            <div className="glass-card p-6 md:p-8">
              <h2 className="heading-3 mb-4">{content.introTitle}</h2>
              <p className="text-lg leading-8 text-surface-300">{content.introText}</p>
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-3">
              {content.cards.map((card) => (
                <div key={card.title} className="glass-card p-6">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-primary-500/30 bg-primary-500/[0.12]">
                    <card.icon className="h-6 w-6 text-primary-300" />
                  </div>
                  <h3 className="mb-3 text-lg font-semibold text-white">{card.title}</h3>
                  <p className="whitespace-pre-line text-sm leading-7 text-surface-300">{card.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-custom">
          <div className="mx-auto max-w-5xl space-y-6">
            {content.sections.map((section) => (
              <div key={section.title} className="glass-card p-6 md:p-8">
                <h2 className="heading-3 mb-4">{section.title}</h2>
                <div className="space-y-4">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph} className="leading-8 text-surface-300">
                      {paragraph}
                    </p>
                  ))}
                </div>
                {section.bullets && (
                  <ul className="mt-5 space-y-3 text-surface-300">
                    {section.bullets.map((bullet) => (
                      <li key={bullet} className="flex gap-3 leading-7">
                        <span className="mt-2 h-2 w-2 rounded-full bg-primary-300" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section pt-0">
        <div className="container-custom">
          <div className="panel-shell mx-auto max-w-5xl p-6 md:p-8">
            <h2 className="heading-3 mb-4">{content.contactTitle}</h2>
            <p className="max-w-4xl leading-8 text-surface-300">{content.contactText}</p>
          </div>
        </div>
      </section>
    </div>
  )
}
