import { useTranslation } from 'react-i18next'
import { CreditCard, FileText, Scale } from 'lucide-react'

interface TermsSection {
  title: string
  paragraphs: string[]
  bullets?: string[]
}

interface TermsCard {
  title: string
  value: string
  icon: typeof FileText
}

interface TermsContent {
  title: string
  subtitle: string
  updatedLabel: string
  updatedValue: string
  cards: TermsCard[]
  sections: TermsSection[]
  footerTitle: string
  footerText: string
}

const TERMS_CONTENT: Record<'ro' | 'en', TermsContent> = {
  ro: {
    title: 'Termeni și condiții',
    subtitle:
      'Acești termeni reglementează utilizarea site-ului voostvision.ro și condițiile generale aplicabile serviciilor oferite de VOOST VISION S.R.L.',
    updatedLabel: 'Ultima actualizare',
    updatedValue: '22 martie 2026',
    cards: [
      {
        title: 'Furnizor',
        value:
          'VOOST VISION S.R.L.\nCUI 53289768\nJ20/2616/2026',
        icon: FileText,
      },
      {
        title: 'Servicii',
        value:
          'Web development\nWeb apps\nDesign UI/UX\nConsultanță digitală',
        icon: Scale,
      },
      {
        title: 'Facturare',
        value:
          'IBAN Revolut Business\nRO76BREL0005555817440100\ncontact@voostvision.ro',
        icon: CreditCard,
      },
    ],
    sections: [
      {
        title: '1. Aplicabilitate',
        paragraphs: [
          'Prin accesarea site-ului sau prin solicitarea unei oferte, confirmi că ai citit și accepți acești termeni. Pentru fiecare proiect, termenii de față pot fi completați de o ofertă, propunere comercială, statement of work sau contract separat.',
        ],
      },
      {
        title: '2. Descrierea serviciilor',
        paragraphs: [
          'VOOST VISION S.R.L. furnizează servicii de dezvoltare software și servicii conexe pentru clienți business, inclusiv analiză, consultanță, web design, dezvoltare site-uri, aplicații web, aplicații mobile, mentenanță și optimizare.',
        ],
        bullets: [
          'Serviciile concrete, livrabilele, termenele și costurile se stabilesc într-o ofertă sau într-un contract.',
          'Orice funcționalitate suplimentară solicitată după acceptarea ofertei poate necesita costuri și termene noi.',
          'Nu garantăm compatibilitatea cu sisteme, servicii sau integrări terțe care nu sunt incluse explicit în ofertă.',
        ],
      },
      {
        title: '3. Obligațiile clientului',
        paragraphs: [
          'Clientul trebuie să furnizeze la timp informațiile, materialele, aprobările și accesul necesare pentru desfășurarea proiectului.',
        ],
        bullets: [
          'Clientul răspunde pentru legalitatea conținutului, materialelor și instrucțiunilor transmise.',
          'Întârzierile cauzate de lipsa feedback-ului sau a materialelor pot duce la decalarea calendarului de livrare.',
          'Clientul trebuie să verifice și să aprobe livrabilele într-un termen rezonabil comunicat între părți.',
        ],
      },
      {
        title: '4. Oferte, acceptare și termene',
        paragraphs: [
          'Ofertele noastre au caracter informativ și pot avea o perioadă limitată de valabilitate. Proiectul începe după acceptarea ofertei și, dacă este cazul, după plata avansului convenit.',
          'Termenele de execuție sunt estimative dacă nu se prevede expres altfel și depind de complexitatea proiectului, disponibilitatea resurselor și colaborarea clientului.',
        ],
      },
      {
        title: '5. Plăți și facturare',
        paragraphs: [
          'Prețurile, moneda, tranșele de plată și scadențele sunt cele menționate în ofertă, contract sau factură. În lipsa unei prevederi diferite, facturile trebuie plătite până la termenul înscris pe factură.',
        ],
        bullets: [
          'Putem solicita avans înainte de începerea proiectului sau înaintea unor etape de livrare.',
          'În caz de întârziere la plată, putem suspenda lucrările, livrarea sau accesul la anumite materiale până la regularizarea sumelor restante.',
          'Comisioanele bancare, taxele și obligațiile fiscale aplicabile plății revin clientului, dacă nu se stabilește altfel în scris.',
        ],
      },
      {
        title: '6. Proprietate intelectuală',
        paragraphs: [
          'Drepturile asupra materialelor preexistente, bibliotecilor, componentelor interne, șabloanelor, know-how-ului și instrumentelor utilizate de VOOST VISION S.R.L. rămân ale noastre sau ale licențiatorilor noștri.',
          'Drepturile patrimoniale asupra livrabilelor finale create specific pentru client se transferă, de regulă, după plata integrală a sumelor datorate și numai în limitele stabilite contractual.',
        ],
        bullets: [
          'Elementele open-source sau terțe rămân supuse licențelor lor proprii.',
          'Ne rezervăm dreptul de a prezenta proiectul în portofoliul nostru, cu excepția situației în care părțile convin altfel în scris.',
          'Clientul nu poate revinde, sublicenția sau reutiliza componentele noastre preexistente separat de livrabilul convenit, fără acordul nostru scris.',
        ],
      },
      {
        title: '7. Acceptanță, garanții și suport',
        paragraphs: [
          'După livrare, clientul trebuie să semnaleze neconformitățile într-un termen rezonabil. Vom corecta erorile care reprezintă abateri față de specificațiile convenite.',
          'Cu excepția garanțiilor obligatorii prevăzute de lege sau asumate expres în contract, serviciile și livrabilele sunt furnizate în forma convenită, fără garanții suplimentare implicite.',
        ],
      },
      {
        title: '8. Limitarea răspunderii',
        paragraphs: [
          'În măsura permisă de lege, VOOST VISION S.R.L. nu răspunde pentru pierderi indirecte, profit nerealizat, pierdere de oportunitate, pierdere de date sau prejudicii cauzate de terți, de furnizori externi, de întreruperi de infrastructură sau de utilizarea necorespunzătoare a livrabilelor de către client.',
        ],
        bullets: [
          'Răspunderea totală a VOOST VISION S.R.L. pentru un proiect nu poate depăși sumele efectiv încasate pentru acel proiect, dacă legea nu prevede altfel.',
          'Nu răspundem pentru conținutul furnizat de client sau pentru consecințele utilizării unor materiale asupra cărora clientul nu deține drepturi.',
          'Clientul este responsabil de backup, continuitate operațională și securitatea conturilor sau infrastructurilor pe care le administrează direct.',
        ],
      },
      {
        title: '9. Confidențialitate și date personale',
        paragraphs: [
          'Părțile vor trata cu confidențialitate informațiile comerciale și tehnice primite în cadrul colaborării, cu excepția situațiilor în care divulgarea este cerută de lege sau necesară pentru executarea contractului.',
          'Prelucrarea datelor personale efectuată prin site sau în cadrul relației comerciale este descrisă în Politica de confidențialitate.',
        ],
      },
      {
        title: '10. Forță majoră',
        paragraphs: [
          'Niciuna dintre părți nu răspunde pentru neexecutarea obligațiilor cauzată de un eveniment de forță majoră, dacă acesta este notificat într-un termen rezonabil și sunt depuse eforturi pentru limitarea efectelor.',
        ],
      },
      {
        title: '11. Legea aplicabilă și litigii',
        paragraphs: [
          'Acești termeni sunt guvernați de legea română. Orice neînțelegere va fi soluționată cu prioritate pe cale amiabilă.',
          'Dacă soluționarea amiabilă nu este posibilă, competența aparține instanțelor competente din București.',
        ],
      },
    ],
    footerTitle: 'Contact comercial și juridic',
    footerText:
      'Pentru întrebări legate de acești termeni, ne poți contacta la contact@voostvision.ro, telefon +40 721 819 077, sau la sediul din Municipiul Bucuresti, Sector 3, Ale Varfu Cu Dor, Nr. 25.',
  },
  en: {
    title: 'Terms & Conditions',
    subtitle:
      'These terms govern the use of voostvision.ro and the general conditions applicable to the services provided by VOOST VISION S.R.L.',
    updatedLabel: 'Last updated',
    updatedValue: 'March 22, 2026',
    cards: [
      {
        title: 'Provider',
        value:
          'VOOST VISION S.R.L.\nTax ID 53289768\nJ20/2616/2026',
        icon: FileText,
      },
      {
        title: 'Services',
        value:
          'Web development\nWeb apps\nUI/UX design\nDigital consulting',
        icon: Scale,
      },
      {
        title: 'Billing',
        value:
          'Revolut Business IBAN\nRO76BREL0005555817440100\ncontact@voostvision.ro',
        icon: CreditCard,
      },
    ],
    sections: [
      {
        title: '1. Scope',
        paragraphs: [
          'By accessing the website or requesting a quote, you confirm that you have read and accepted these terms. For each project, these terms may be supplemented by a proposal, statement of work, or separate contract.',
        ],
      },
      {
        title: '2. Description of services',
        paragraphs: [
          'VOOST VISION S.R.L. provides software development and related services for business clients, including analysis, consulting, web design, website development, web applications, mobile applications, maintenance, and optimization.',
        ],
        bullets: [
          'Specific services, deliverables, timelines, and fees are set out in a proposal or contract.',
          'Any additional functionality requested after acceptance may require revised pricing and revised timelines.',
          'We do not guarantee compatibility with third-party systems, services, or integrations unless expressly included in the agreed scope.',
        ],
      },
      {
        title: '3. Client obligations',
        paragraphs: [
          'The client must provide the information, materials, approvals, and access required for the project in a timely manner.',
        ],
        bullets: [
          'The client is responsible for the legality of the content, materials, and instructions it provides.',
          'Delays caused by missing feedback or missing materials may shift delivery dates.',
          'The client must review and approve deliverables within a reasonable timeframe agreed by the parties.',
        ],
      },
      {
        title: '4. Proposals, acceptance, and timelines',
        paragraphs: [
          'Our proposals are informational and may have a limited validity period. The project starts after acceptance of the proposal and, where applicable, payment of the agreed advance.',
          'Delivery timelines are estimates unless expressly agreed otherwise and depend on project complexity, resource availability, and client cooperation.',
        ],
      },
      {
        title: '5. Payments and invoicing',
        paragraphs: [
          'Prices, currency, payment milestones, and due dates are those stated in the proposal, contract, or invoice. Unless otherwise agreed, invoices must be paid by the due date specified on the invoice.',
        ],
        bullets: [
          'We may request an advance payment before starting the project or before specific delivery stages.',
          'In case of late payment, we may suspend work, delivery, or access to certain materials until overdue amounts are settled.',
          'Bank fees, taxes, and payment-related charges are borne by the client unless otherwise agreed in writing.',
        ],
      },
      {
        title: '6. Intellectual property',
        paragraphs: [
          'Rights in pre-existing materials, libraries, internal components, templates, know-how, and tools used by VOOST VISION S.R.L. remain ours or those of our licensors.',
          'Economic rights in final deliverables created specifically for the client are generally transferred only after full payment and only within the contractual limits agreed by the parties.',
        ],
        bullets: [
          'Open-source and third-party elements remain subject to their own licenses.',
          'We reserve the right to showcase the project in our portfolio unless the parties agree otherwise in writing.',
          'The client may not resell, sublicense, or reuse our pre-existing components separately from the agreed deliverable without our written consent.',
        ],
      },
      {
        title: '7. Acceptance, warranties, and support',
        paragraphs: [
          'After delivery, the client must notify us of any non-conformities within a reasonable timeframe. We will correct errors that represent deviations from the agreed specifications.',
          'Except for mandatory legal warranties or warranties expressly assumed in a contract, services and deliverables are provided as agreed without additional implied warranties.',
        ],
      },
      {
        title: '8. Limitation of liability',
        paragraphs: [
          'To the extent permitted by law, VOOST VISION S.R.L. is not liable for indirect losses, lost profits, loss of opportunity, loss of data, or damages caused by third parties, external providers, infrastructure outages, or improper use of the deliverables by the client.',
        ],
        bullets: [
          'Our total liability for a project may not exceed the amounts actually paid to us for that project, unless the law requires otherwise.',
          'We are not responsible for content provided by the client or for the consequences of using materials for which the client does not hold adequate rights.',
          'The client remains responsible for backups, business continuity, and the security of accounts or infrastructure it directly administers.',
        ],
      },
      {
        title: '9. Confidentiality and personal data',
        paragraphs: [
          'Both parties must treat commercial and technical information received during the collaboration as confidential, except where disclosure is required by law or necessary to perform the contract.',
          'The processing of personal data carried out through the website or in the business relationship is described in the Privacy Policy.',
        ],
      },
      {
        title: '10. Force majeure',
        paragraphs: [
          'Neither party is liable for failure to perform obligations caused by force majeure events, provided that the other party is informed within a reasonable timeframe and reasonable efforts are made to mitigate the impact.',
        ],
      },
      {
        title: '11. Governing law and disputes',
        paragraphs: [
          'These terms are governed by Romanian law. Any dispute should first be addressed amicably.',
          'If an amicable resolution is not possible, the competent courts in Bucharest shall have jurisdiction.',
        ],
      },
    ],
    footerTitle: 'Commercial and legal contact',
    footerText:
      'If you have questions about these terms, contact us at contact@voostvision.ro, phone +40 721 819 077, or by post at Bucharest, District 3, Ale Varfu Cu Dor, No. 25.',
  },
}

export default function Terms() {
  const { i18n } = useTranslation()
  const currentLang = i18n.language === 'en' ? 'en' : 'ro'
  const content = TERMS_CONTENT[currentLang]

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
          <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
            {content.cards.map((card) => (
              <div key={card.title} className="glass-card p-6">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-primary-500/30 bg-primary-500/[0.12]">
                  <card.icon className="h-6 w-6 text-primary-300" />
                </div>
                <h2 className="mb-3 text-lg font-semibold text-white">{card.title}</h2>
                <p className="whitespace-pre-line text-sm leading-7 text-surface-300">{card.value}</p>
              </div>
            ))}
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
            <h2 className="heading-3 mb-4">{content.footerTitle}</h2>
            <p className="max-w-4xl leading-8 text-surface-300">{content.footerText}</p>
          </div>
        </div>
      </section>
    </div>
  )
}
