import { c as createComponent } from './astro-component_B40AbR-h.mjs';
import { m as maybeRenderHead, l as renderComponent, h as addAttribute, r as renderTemplate, n as renderSlot, o as renderHead } from './entrypoint_Q9hvsXKR.mjs';
import { jsx, jsxs } from 'react/jsx-runtime';
import { useState, useRef, useId, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import 'clsx';
import { toHTML, mergeComponents, defaultComponents } from '@portabletext/to-html';
import { createClient } from '@sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url';

const LOCALES = ["no", "en", "hr"];
const DEFAULT_LOCALE = "no";
const LOCALE_LABELS = {
  no: "Norsk",
  en: "English",
  hr: "Hrvatski"
};
const LOCALE_HTML_LANG = {
  no: "nb",
  en: "en",
  hr: "hr"
};

const nav$2 = {"blog":"Blogg","about":"Om oss","contact":"Kontakt","home":"Hjem"};
const nav_about_links$2 = {"about":"Om oss","competence":"Kompetanse","quality":"Kvalitet"};
const nav_drawer$2 = {"contact":"Kontakt","visit":"Besøk","locations":"Split, Kroatia\nTrondheim, Norge"};
const mobile$2 = {"open_menu":"Åpne meny","close_menu":"Lukk meny","site_navigation":"Hovednavigasjon","get_in_touch":"Ta kontakt"};
const footer$2 = {"rights":"Alle rettigheter forbeholdt.","cities":"Oslo • Zagreb"};
const home$2 = {"meta_title":"digiDEVS — Seniorutvikling, EU-kvalitet","meta_description":"Norskledet utviklingsstudio i Kroatia. Webapper, mobilapper, AI-produkter og teamforsterkning uten Oslo-tillegg.","hero_img_alt":"Skandinavisk kystby om natten, kaldt blått lys på mørkt vann under stjernehimmel","hero_headline_1":"Seniorutvikling.","hero_headline_2":"EU-kvalitet.","hero_headline_3":"Uten Oslo-prislappen.","hero_body":"Norskledet, EU-basert studio: web, mobil og AI — senior leveranse uten Oslo-prislappen. Tydelige milepæler, ukentlige oppdateringer, kode du eier.","cta_call":"Book en gratis samtale","cta_work":"Se hva vi har bygget","capabilities_heading":"Dette bygger vi","bento_opera_alt":"Operaen i Oslo og havnen om natten, lys som speiler seg i fjorden","bento_guide_label":"Din guide","bento_guide_title":"Norskledet. EU-leveranse.","bento_guide_body":"Ikke en ansiktsløs fabrikk — vi forstår konteksten din og leverer fra Kroatia: seniorarbeid til omtrent 40–60 % under typisk norsk byråpris, GDPR-vennlig, samme tidssone.","bento_ai_title":"AI og automatisering","bento_ai_body":"Agenter, n8n og backends som sparer tid — ikke presentasjoner.","bento_web_title":"Web og apper","bento_web_body":"React, Next.js, Astro, React Native — fra landingssider til hele produkter.","bento_cta_title":"Snakke det gjennom?","bento_outsourced_title":"Outsourcet team","bento_outsourced_body":"Trenger du mer enn én ressurs? Vi leder prosjektet, koordinerer EU-utviklere og holder kommunikasjonen enkel — faste milepæler, ingen overraskelser.","stats_pages":"Sider driftet fullt ut","stats_cutting":"På forkant","stats_bs":"Tull"};
const blog$2 = {"meta_title":"Blogg — digiDEVS","meta_description":"Innsikt og tekniske notater fra digiDEVS — arkitektur, AI, leveranse og kvalitet.","journal_label":"Journal og arkiv","heading_line1":"Innsikt og","heading_line2":"ingeniørkunst","read_full":"Les hele artikkelen","empty_pre":"Ingen innlegg ennå. Legg til ","empty_code":"post","empty_post":"-dokumenter i Sanity Studio, kjør produksjonsbygg (eller koble webhook til vert).","load_more":"Last flere fra arkivet","digest_title":"Seniorutviklerens digest","digest_body":"Ingen fluff. Ingen spam. Bare teknisk dyktighet og sporadiske filosofiske utbrudd — levert månedlig.","subscribe":"Abonner","email_placeholder":"epost@adresse.no"};
const blog_post$2 = {"title_suffix":" — digiDEVS"};
const contact$2 = {"meta_title":"Kontakt — digiDEVS","meta_description":"Ta kontakt med digiDEVS — norskledet utvikling, web- og mobilapper og AI-produkter.","label":"Ta kontakt","heading":"Kontakt","intro":"Fortell oss om prosjektet eller det tekniske perspektivet. Vi svarer så snart vi kan.","placeholder":"Kontaktskjema og detaljer kommer her."};
const about$2 = {"meta_title":"Om oss — digiDEVS","meta_description":"Hvem vi er: norsk presisjon, EU-standard og et distribuert team mellom Oslo og Kroatia.","label":"Om oss","intro":"Vi kombinerer norsk teknisk ledelse med et seniorutviklerteam i Kroatia — slik at du får klarhet, fart og EU-leveranse uten hovedstadspremie.","card1_kicker":"Dette bygger vi","card1_title":"Kompetanse","card1_body":"Webapper, mobil, AI-integrasjon og teamforsterkning — stack, arbeidsmåte og hvordan vi leverer.","card2_kicker":"Hvorfor det er trygt","card2_title":"Kvalitet","card2_body":"Senior håndverk, EU-forventninger, GDPR-bevisst utvikling og tydelig norskledet kommunikasjon.","explore":"Utforsk →"};
const competence$2 = {"meta_title":"Kompetanse — digiDEVS","meta_description":"Hva vi bygger og hvordan: AI-integrasjon, senior kompetanse, norskledet ledelse og moderne stack.","badge":"Teknisk dyktighet","heading":"Kompetanse","intro":"Vår DNA bygger på norsk presisjon og global ingeniørkompetanse. Vi skriver ikke bare kode — vi designer robuste digitale økosystemer.","location_label":"Lokasjon og ledelse","location_value":"Oslo | Global distribusjon","sr_capabilities":"Kjernekompetanser","ai_title":"AI-integrasjon","ai_body":"Vi går lenger enn enkle API-kall. Vi implementerer skreddersydd LLM-orkestrering, vektordatabaser for RAG og prediktiv analyse som glir inn i eksisterende arbeidsflyter.","tag_llm":"LLM finjustering","tag_semantic":"Semantisk søk","tag_models":"OpenAI / Anthropic","team_label":"Teamet","team_title":"Seniorutvikling","team_body":"Hvert prosjekt ledes av utviklere med over ti års erfaring fra høytrafikk-miljøer.","legacy_label":"Kvalitetsarven","legacy_title":"Norskledet ledelse","legacy_body":"Vi tar den kliniske presisjonen fra skandinavisk prosjektledelse med i hvert oppdrag. Åpenhet, punktlighet og kompromissløs kvalitet er utgangspunktet.","stack_title":"Moderne stack","stack_body":"Vi bygger med teknologi som tåler fremtiden: Rust, TypeScript og distribuerte systemer.","stack_toggle":"Full liste over stack ↓","approach_kicker":"Grundig tilnærming","approach_heading":"Bygget for","approach_italic":"varighet","step1_title":"Arkitektur først","step1_body":"Vi prioriterer skalerbarhet og modularitet. Før første linje kode kartlegger seniorarkitekter dataflyt og avhengigheter for å unngå teknisk gjeld.","step2_title":"Sikkerhet fra start","step2_body":"Sikkerhet er ikke en funksjon — det er fundamentet. Fra SOC2-spor til ende-til-ende-kryptering sørger vi for at dataene dine er like robuste som koden.","step3_title":"Kontinuerlig utvikling","step3_body":"Vi har et dedikert FoU-spor som tester nye AI-rammeverk og infrastruktur — slik at kompetansen vi leverer alltid er på forkant.","cta_heading":"La oss snakke om ditt tekniske perspektiv.","cta_button":"Ta kontakt"};
const quality$2 = {"meta_title":"Kvalitet — digiDEVS","meta_description":"Norsk presisjon, EU-standard, GDPR-bevisst leveranse og boutique-håndverk — uten Oslo-tillegg.","label":"Boutique-ingeniørkunst","heading":"Kvalitet","intro":"Vi opererer i skjæringspunktet mellom nordisk presisjon og middelhavs-håndverk — digitale produkter som overgår europeisk standard uten hovedstadspremie.","hero_img_alt":"Arkitektonisk detalj fra Operaen i Oslo","hero_caption":"ETABL. 2024 / TRIPLE-AXIS QUALITY","nordic_kicker":"01 / Det nordiske kjernen","nordic_title":"Norsk presisjon","nordic_body":"Vår DNA er forankret i skandinavisk ingeniørstandard. Vi prioriterer strukturell integritet, ren kodearkitektur og «funksjon først» — for langsiktig skalerbarhet.","tag_strict":"Streng QA","tag_logic":"Logikk først","eu_title":"EU-kvalitetsstandard","eu_body":"Fullt i tråd med GDPR og europeiske retningslinjer for tilgjengelighet (WCAG 2.1). Vi bygger for det globale markedet fra innenfor unionen.","craft_kicker":"02 / Håndverk","craft_title":"Kroatisk håndverk","craft_body":"Digital sjel fra Middelhavet. Vi gir boutique-estetikk og nitid oppmerksomhet på UI — hver interaksjon skal føles meningsfull.","premium_title":"Premium resultat.","premium_subtitle":"Minus Oslo-tillegget.","premium_body":"Vi utnytter effektiviteten i en distribuert boutique-modell. Du får kvalitet på nivå med et Oslo-byrå — levert med kostnadsfleksibiliteten til et slankere, grenseløst team.","stat_transparency":"Åpenhet","stat_fees":"Skjulte gebyrer","protocol_title":"Kvalitetsprotokollen","protocol_intro":"Vår metodikk er en lukket sløyfe med kontinuerlig forbedring.","q1_title":"Teknisk revisjon","q1_body":"Hver kodelinje gjennomgår kollegarevisjon etter norske ingeniørstandarder.","q2_title":"Visuell stresstest","q2_body":"UI-komponenter testes på 12 viewport-skalaer for å sikre absolutt responsivitet.","q3_title":"Tilgjengelighetssjekk","q3_body":"Obligatorisk WCAG 2.1-sjekk av kontrast, skjermlesere og tastaturnavigasjon.","q4_title":"Hastighetsoptimalisering","q4_body":"Optimalisering mot under 2 s lastetid på mobilnett for å redusere flukt.","balance_title":"Opplev balansen","balance_body":"Klar for å heve digital tilstedeværelse med europeisk presisjon og håndverk? La oss diskutere neste prosjekt.","balance_cta":"Ta kontakt"};
const layout$2 = {"default_title":"digiDEVS","default_description":"Norskledet utviklingsstudio. Webapper, mobilapper og AI-produkter — EU-kvalitet uten Oslo-prislappen."};
const no = {
  nav: nav$2,
  nav_about_links: nav_about_links$2,
  nav_drawer: nav_drawer$2,
  mobile: mobile$2,
  footer: footer$2,
  home: home$2,
  blog: blog$2,
  blog_post: blog_post$2,
  contact: contact$2,
  about: about$2,
  competence: competence$2,
  quality: quality$2,
  layout: layout$2,
};

const nav$1 = {"blog":"Blog","about":"About","contact":"Contact","home":"Home"};
const nav_about_links$1 = {"about":"About","competence":"Competence","quality":"Quality"};
const nav_drawer$1 = {"contact":"Contact","visit":"Visit","locations":"Split, Croatia\nTrondheim, Norway"};
const mobile$1 = {"open_menu":"Open menu","close_menu":"Close menu","site_navigation":"Site navigation","get_in_touch":"Get in Touch"};
const footer$1 = {"rights":"All rights reserved.","cities":"Oslo • Zagreb"};
const home$1 = {"meta_title":"digiDEVS — Senior-level development, EU quality","meta_description":"Norwegian-led development studio in Croatia. Web apps, mobile apps, AI-powered products, and team augmentation without Oslo premiums.","hero_img_alt":"Scandinavian coastal city at night, cold blue light on dark water under a starry sky","hero_headline_1":"Senior-level development.","hero_headline_2":"EU quality.","hero_headline_3":"Without the Oslo price tag.","hero_body":"Norwegian-led, EU-based studio: web, mobile, and AI — senior-level delivery without the Oslo price tag. Clear milestones, weekly updates, code you own.","cta_call":"Book a free call","cta_work":"See what we’ve built","capabilities_heading":"What we build","bento_opera_alt":"Oslo Opera House and waterfront at night, lights reflecting on the fjord","bento_guide_label":"Your guide","bento_guide_title":"Norwegian-led. EU delivery.","bento_guide_body":"Not a faceless shop — we speak your context and ship from Croatia: senior work at about 40–60% below typical Norwegian agency rates, GDPR-aligned, same timezone.","bento_ai_title":"AI & automation","bento_ai_body":"Agents, n8n, and backends that save time — not slide decks.","bento_web_title":"Web & apps","bento_web_body":"React, Next.js, Astro, React Native — landing pages to full products.","bento_cta_title":"Talk it through?","bento_outsourced_title":"Outsourced team","bento_outsourced_body":"Need more than one hire? We lead the project, coordinate EU developers, and keep communication plain — fixed milestones, no surprises.","stats_pages":"Pages managed fully","stats_cutting":"Cutting edge","stats_bs":"Bullshit"};
const blog$1 = {"meta_title":"Blog — digiDEVS","meta_description":"Insights and engineering notes from the digiDEVS team — architecture, AI, delivery, and quality.","journal_label":"Journal & Archives","heading_line1":"Insights &","heading_line2":"Engineering","read_full":"Read full article","empty_pre":"No posts yet. Add ","empty_code":"post","empty_post":" documents in Sanity Studio, then run a production deploy (or connect a webhook to your host).","load_more":"Load more archives","digest_title":"The Senior Developer's Digest","digest_body":"No fluff. No spam. Just technical excellence and occasional philosophical rants delivered monthly.","subscribe":"Subscribe","email_placeholder":"email@address.com"};
const blog_post$1 = {"title_suffix":" — digiDEVS"};
const contact$1 = {"meta_title":"Contact — digiDEVS","meta_description":"Get in touch with digiDEVS — Norwegian-led development, web and mobile apps, and AI-powered products.","label":"Get in touch","heading":"Contact","intro":"Tell us about your project or technical horizon. We will respond as soon as we can.","placeholder":"Contact form and details will be added here."};
const about$1 = {"meta_title":"About — digiDEVS","meta_description":"Who we are: Norwegian-led precision, EU delivery standards, and a distributed team across Oslo and Croatia.","label":"About","intro":"We combine Norwegian technical leadership with a senior engineering team in Croatia — so you get clarity, velocity, and EU-grade delivery without the capital-city price tag.","card1_kicker":"What we build","card1_title":"Competence","card1_body":"Web apps, mobile, AI integration, and team augmentation — stack, ways of working, and how we ship.","card2_kicker":"Why it is safe","card2_title":"Quality","card2_body":"Senior-level craft, EU expectations, GDPR-aware development, and transparent Norwegian-led communication.","explore":"Explore →"};
const competence$1 = {"meta_title":"Competence — digiDEVS","meta_description":"What we build and how: AI integration, senior talent, Norwegian-led management, and a modern stack.","badge":"Technical Excellence","heading":"Competence","intro":"Our DNA is built on Norwegian-led precision and global engineering talent. We don't just write code; we architect resilient digital ecosystems.","location_label":"Location & Management","location_value":"Oslo | Global Distribution","sr_capabilities":"Core capabilities","ai_title":"AI Integration","ai_body":"Moving beyond simple API calls. We implement custom LLM orchestration, vector databases for RAG architectures, and predictive analytics that integrate seamlessly into existing enterprise workflows.","tag_llm":"LLM Fine-tuning","tag_semantic":"Semantic Search","tag_models":"OpenAI / Anthropic","team_label":"The Team","team_title":"Senior-Level Development","team_body":"Every project is led by developers with over 10 years of experience in high-traffic environments.","legacy_label":"Legacy of Quality","legacy_title":"Norwegian-Led Management","legacy_body":"We bring the clinical precision of Scandinavian project management to every engagement. Transparency, punctuality, and uncompromising quality are the baselines of our operations.","stack_title":"Modern Stack Mastery","stack_body":"We build with technologies designed for the future: Rust, TypeScript, and distributed systems architecture.","stack_toggle":"Full capability list ↓","approach_kicker":"In-Depth Approach","approach_heading":"Engineered for","approach_italic":"Endurance","step1_title":"Architecture First","step1_body":"We prioritize scalability and modularity. Before the first line of code is written, our senior architects map out data flows and system dependencies to prevent future technical debt.","step2_title":"Security by Design","step2_body":"Security isn't a feature; it's a foundation. From SOC2 compliance pathways to end-to-end encryption, we ensure your data is as resilient as the code that manages it.","step3_title":"Continuous Evolution","step3_body":"We maintain a dedicated R&D wing that tests emerging AI frameworks and infrastructure patterns, ensuring the competence we offer is always on the bleeding edge.","cta_heading":"Discuss your technical horizon.","cta_button":"Get in Touch"};
const quality$1 = {"meta_title":"Quality — digiDEVS","meta_description":"Norwegian precision, EU standards, GDPR-aware delivery, and boutique craftsmanship — without the Oslo markup.","label":"Boutique Engineering","heading":"Quality","intro":"We operate at the intersection of Northern precision and Mediterranean artistry, delivering digital products that exceed European standards without the prohibitive capital city premiums.","hero_img_alt":"Oslo Opera House architectural detail","hero_caption":"EST. 2024 / TRIPLE-AXIS QUALITY","nordic_kicker":"01 / The Nordic Core","nordic_title":"Norwegian Precision","nordic_body":"Our DNA is rooted in the rigorous standards of Scandinavian engineering. We prioritize structural integrity, clean code architecture, and a \"function first\" philosophy that ensures long-term scalability.","tag_strict":"Strict QA","tag_logic":"Logic First","eu_title":"EU Quality Standards","eu_body":"Fully compliant with GDPR and European accessibility guidelines (WCAG 2.1). We build for the global market from within the Union.","craft_kicker":"02 / The Artisan Touch","craft_title":"Croatian Craftsmanship","craft_body":"Digital soul forged in the Mediterranean. We bring a high-end boutique aesthetic and meticulous attention to UI detail, ensuring every interaction feels intentional.","premium_title":"Premium output.","premium_subtitle":"Minus the Oslo markup.","premium_body":"We leverage the efficiency of a distributed boutique model. You get the executive-level quality of a high-end Oslo agency, delivered with the cost-agility of a leaner, borderless team.","stat_transparency":"Transparency","stat_fees":"Hidden Fees","protocol_title":"The Quality Protocol","protocol_intro":"Our methodology is a closed-loop system of refinement.","q1_title":"Technical Audit","q1_body":"Every line of code undergoes a peer-review process based on Norwegian engineering benchmarks.","q2_title":"Visual Stress Test","q2_body":"UI components are tested across 12 different viewport scales to ensure responsiveness is absolute.","q3_title":"Accessibility Check","q3_body":"Mandatory WCAG 2.1 compliance check for color contrast, screen readers, and keyboard navigation.","q4_title":"Speed Optimization","q4_body":"Optimization protocol targeting sub-2s load times on mobile networks to minimize bounce rates.","balance_title":"Experience the Balance","balance_body":"Ready to elevate your digital presence with European precision and craftsmanship? Let's discuss your next project.","balance_cta":"Get in Touch"};
const layout$1 = {"default_title":"digiDEVS","default_description":"Norwegian-led development studio. Web apps, mobile apps, and AI-powered products — EU quality without the Oslo price tag."};
const en = {
  nav: nav$1,
  nav_about_links: nav_about_links$1,
  nav_drawer: nav_drawer$1,
  mobile: mobile$1,
  footer: footer$1,
  home: home$1,
  blog: blog$1,
  blog_post: blog_post$1,
  contact: contact$1,
  about: about$1,
  competence: competence$1,
  quality: quality$1,
  layout: layout$1,
};

const nav = {"blog":"Blog","about":"O nama","contact":"Kontakt","home":"Početna"};
const nav_about_links = {"about":"O nama","competence":"Kompetencija","quality":"Kvaliteta"};
const nav_drawer = {"contact":"Kontakt","visit":"Posjet","locations":"Split, Hrvatska\nTrondheim, Norveška"};
const mobile = {"open_menu":"Otvori izbornik","close_menu":"Zatvori izbornik","site_navigation":"Glavna navigacija","get_in_touch":"Javite nam se"};
const footer = {"rights":"Sva prava pridržana.","cities":"Oslo • Zagreb"};
const home = {"meta_title":"digiDEVS — Razvoj seniorske razine, kvaliteta EU-a","meta_description":"Norveški vođen studio u Hrvatskoj. Web aplikacije, mobilne aplikacije, AI proizviti i proširenje tima bez norveških cijena glavnog grada.","hero_img_alt":"Skandinavski obalni grad noću, hladno plavo svjetlo na tamnoj vodi pod zvjezdanim nebom","hero_headline_1":"Razvoj seniorske razine.","hero_headline_2":"Kvaliteta EU-a.","hero_headline_3":"Bez norveške cijene.","hero_body":"Norveški vođen, EU studio: web, mobilne i AI — seniorska isporuka bez osloške cijene. Jasne prekretnice, tjedna ažuriranja, kod koji je vaš.","cta_call":"Rezervirajte besplatan poziv","cta_work":"Pogledajte što smo gradili","capabilities_heading":"Što gradimo","bento_opera_alt":"Oslo Opera i obala noću, svjetla se reflektiraju na fjordu","bento_guide_label":"Vaš vodič","bento_guide_title":"Norveški vođen. EU isporuka.","bento_guide_body":"Nismo anonimna radionica — razumijemo vaš kontekst i isporučujemo iz Hrvatske: seniorski rad oko 40–60% ispod tipičnih norveških agencija, usklađeno s GDPR-om, isto vrijeme.","bento_ai_title":"AI i automatizacija","bento_ai_body":"Agenti, n8n i pozadinski sustavi koji štede vrijeme — ne slidovi.","bento_web_title":"Web i aplikacije","bento_web_body":"React, Next.js, Astro, React Native — od landing stranica do cijelih proizvoda.","bento_cta_title":"Razgovor?","bento_outsourced_title":"Outsourcani tim","bento_outsourced_body":"Trebate više od jednog najma? Vodimo projekt, koordiniramo EU developere, komunikacija je jednostavna — fiksne prekretnice, bez iznenađenja.","stats_pages":"Stranica u potpunosti upravljanih","stats_cutting":"Na najnovijem","stats_bs":"Gluposti"};
const blog = {"meta_title":"Blog — digiDEVS","meta_description":"Uvidi i tehničke bilješke tima digiDEVS — arhitektura, AI, isporuka i kvaliteta.","journal_label":"Dnevnik i arhiv","heading_line1":"Uvidi i","heading_line2":"inženjerstvo","read_full":"Pročitaj cijeli članak","empty_pre":"Još nema postova. Dodajte ","empty_code":"post","empty_post":" dokumente u Sanity Studio, zatim produkcijski build (ili webhook na host).","load_more":"Učitaj više iz arhiva","digest_title":"Digest senior developera","digest_body":"Bez šupljih riječi. Bez spama. Samo tehnička izvrsnost i povremene filozofije — mjesečno.","subscribe":"Pretplati se","email_placeholder":"email@adresa.com"};
const blog_post = {"title_suffix":" — digiDEVS"};
const contact = {"meta_title":"Kontakt — digiDEVS","meta_description":"Javite se digiDEVS — norveški vođen razvoj, web i mobilne aplikacije i AI proizvodi.","label":"Javite nam se","heading":"Kontakt","intro":"Opišite svoje projektno ili tehničko polje. Odgovorit ćemo čim prije možemo.","placeholder":"Kontakt obrazac i detalji bit će ovdje."};
const about = {"meta_title":"O nama — digiDEVS","meta_description":"Tko smo: norveška preciznost, EU standardi i distribuirani tim između Osloga i Hrvatske.","label":"O nama","intro":"Kombiniramo norveško tehničko vodstvo sa seniorskim timom u Hrvatskoj — jasnoća, brzina i EU isporuka bez cijene glavnog grada.","card1_kicker":"Što gradimo","card1_title":"Kompetencija","card1_body":"Web aplikacije, mobilno, AI integracija i proširenje tima — stack, način rada i kako isporučujemo.","card2_kicker":"Zašto je sigurno","card2_title":"Kvaliteta","card2_body":"Seniorski rad, EU očekivanja, GDPR razvoj i transparentna norveški vođena komunikacija.","explore":"Istraži →"};
const competence = {"meta_title":"Kompetencija — digiDEVS","meta_description":"Što gradimo i kako: AI integracija, senior talent, norveško vodstvo i moderan stack.","badge":"Tehnička izvrsnost","heading":"Kompetencija","intro":"Naš DNA je norveška preciznost i globalni inženjerski talent. Ne samo pišemo kod — arhitekturiramo otporna digitalna ekosustava.","location_label":"Lokacija i vodstvo","location_value":"Oslo | Globalna distribucija","sr_capabilities":"Ključne sposobnosti","ai_title":"AI integracija","ai_body":"Dalje od jednostavnih API poziva. Implementiramo prilagođenu LLM orkestraciju, vektorske baze za RAG i prediktivnu analitiku u postojećim tijekovima.","tag_llm":"LLM Fine-tuning","tag_semantic":"Semantičko pretraživanje","tag_models":"OpenAI / Anthropic","team_label":"Tim","team_title":"Razvoj seniorske razine","team_body":"Svaki projekt vode developeri s više od 10 godina iskustva u visokoprometnim okruženjima.","legacy_label":"Nasljede kvalitete","legacy_title":"Norveški vođeno vodstvo","legacy_body":"Donosimo kliničku preciznost skandinavskog upravljanja projektima u svaki angažman. Transparentnost, točnost i nepopustljiva kvaliteta su osnova.","stack_title":"Modern Stack","stack_body":"Gradimo s tehnologijama za budućnost: Rust, TypeScript i distribuirana arhitektura.","stack_toggle":"Puni popis stacka ↓","approach_kicker":"Detaljan pristup","approach_heading":"Projektirano za","approach_italic":"izdržljivost","step1_title":"Arhitektura prva","step1_body":"Prioritiziramo skalabilnost i modularnost. Prije prvog retka koda senior arhitekti mapiraju tokove podataka i ovisnosti.","step2_title":"Sigurnost po dizajnu","step2_body":"Sigurnost nije značajka — temelj je. Od SOC2 puta do end-to-end šifriranja, podaci su otporni kao kod.","step3_title":"Kontinuirana evolucija","step3_body":"Imamo R&D krilo koje testira nove AI okvire i infrastrukturu — kompetencija uvijek na oštrici.","cta_heading":"Razgovarajmo o vašem tehničkom horizontu.","cta_button":"Javite nam se"};
const quality = {"meta_title":"Kvaliteta — digiDEVS","meta_description":"Norveška preciznost, EU standardi, GDPR isporuka i boutique izrada — bez osloške marže.","label":"Boutique inženjerstvo","heading":"Kvaliteta","intro":"Djelujemo na presjeku sjeverne preciznosti i mediteranskog obrta — digitalni proizvodi koji premašuju europske standarde bez cijene glavnog grada.","hero_img_alt":"Arhitektonski detalj Osle opere","hero_caption":"OSN. 2024 / TRIPLE-AXIS QUALITY","nordic_kicker":"01 / Nordijsko sjeme","nordic_title":"Norveška preciznost","nordic_body":"Naš DNA je ukorijenjen u strogim skandinavskim standardima. Prioritiziramo strukturni integritet, čistu arhitekturu koda i filozofiju «funkcija prva».","tag_strict":"Strogi QA","tag_logic":"Logika prva","eu_title":"EU standardi kvalitete","eu_body":"U skladu s GDPR-om i europskim smjernicama pristupačnosti (WCAG 2.1). Gradimo za globalno tržište iz unije.","craft_kicker":"02 / Zanatski dodir","craft_title":"Hrvatska izrada","craft_body":"Digitalna duša kovana na Mediteranu. Boutique estetika i pažnja na UI detalje — svaka interakcija namjerna.","premium_title":"Premium isporuka.","premium_subtitle":"Minus osloška marža.","premium_body":"Efikasnost distribuiranog boutique modela. Izvršna kvaliteta kao u Oslo agenciji — s agilnošću vitkijeg tima.","stat_transparency":"Transparentnost","stat_fees":"Skrivene naknade","protocol_title":"Protokol kvalitete","protocol_intro":"Naša metodologija je zatvorena petlja usavršavanja.","q1_title":"Tehnički audit","q1_body":"Svaki red koda prolazi peer review prema norveškim inženjerskim mjerilima.","q2_title":"Vizualni test stresa","q2_body":"UI komponente testirane na 12 viewport skala za apsolutnu responzivnost.","q3_title":"Provjera pristupačnosti","q3_body":"Obavezna WCAG 2.1 provjera kontrasta, čitača zaslona i tipkovnice.","q4_title":"Optimizacija brzine","q4_body":"Protokol pod 2 s učitavanja na mobilnim mrežama za manji bounce.","balance_title":"Doživite ravnotežu","balance_body":"Spremni podići digitalnu prisutnost europskom preciznošću i izradom? Razgovarajmo o sljedećem projektu.","balance_cta":"Javite nam se"};
const layout = {"default_title":"digiDEVS","default_description":"Norveški vođen studio. Web, mobilne aplikacije i AI proizvodi — kvaliteta EU-a bez osloške cijene."};
const hr = {
  nav,
  nav_about_links,
  nav_drawer,
  mobile,
  footer,
  home,
  blog,
  blog_post,
  contact,
  about,
  competence,
  quality,
  layout,
};

const translations = { no, en, hr };
function useTranslations(lang) {
  return function t(key) {
    const keys = key.split(".");
    let value = translations[lang];
    for (const k of keys) {
      if (typeof value !== "object" || value === null) break;
      value = value[k];
    }
    if (typeof value !== "string") {
      let fallback = translations[DEFAULT_LOCALE];
      for (const k of keys) {
        if (typeof fallback !== "object" || fallback === null) break;
        fallback = fallback[k];
      }
      return typeof fallback === "string" ? fallback : key;
    }
    return value;
  };
}
function localePath(pathname, currentLocale, targetLocale) {
  let stripped = pathname;
  if (currentLocale !== DEFAULT_LOCALE) {
    stripped = pathname.replace(new RegExp(`^/${currentLocale}`), "") || "/";
  }
  if (targetLocale === DEFAULT_LOCALE) return stripped || "/";
  return `/${targetLocale}${stripped === "/" ? "" : stripped}`;
}
function stripLocalePrefixFromPathname(pathname) {
  for (const loc of ["en", "hr"]) {
    if (pathname === `/${loc}`) return "/";
    if (pathname.startsWith(`/${loc}/`)) return pathname.slice(`/${loc}`.length) || "/";
  }
  return pathname;
}

function stripLangPrefix$1(pathname, lang) {
  if (lang === DEFAULT_LOCALE) return pathname;
  const p = `/${lang}`;
  if (pathname === p) return "/";
  if (pathname.startsWith(`${p}/`)) return pathname.slice(p.length) || "/";
  return pathname;
}
function isActive$1(normalizedPathname, href) {
  if (href === "/") return normalizedPathname === "/";
  return normalizedPathname === href || normalizedPathname.startsWith(`${href}/`);
}
function GlassNavBar({
  pathname,
  lang,
  attachRight = false
}) {
  const t = useTranslations(lang);
  const langPrefix = lang === DEFAULT_LOCALE ? "" : `/${lang}`;
  const normalized = stripLangPrefix$1(pathname, lang);
  const aboutLinks = [
    { path: "/about", label: t("nav_about_links.about") },
    { path: "/about/competence", label: t("nav_about_links.competence") },
    { path: "/about/quality", label: t("nav_about_links.quality") }
  ];
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const panelId = useId();
  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);
  const blogActive = isActive$1(normalized, "/blog");
  const aboutNavActive = isActive$1(normalized, "/about");
  const homeHref = langPrefix || "/";
  const blogHref = `${langPrefix}/blog`;
  return /* @__PURE__ */ jsx("div", { ref: wrapRef, className: "w-full min-w-0", children: /* @__PURE__ */ jsxs(
    "div",
    {
      className: `origin-top scale-[0.945] overflow-hidden backdrop-blur-[10px] transition-transform duration-300 ease-out hover:scale-[0.99225] ${attachRight ? "rounded-[20px] rounded-r-none" : "rounded-[20px]"}`,
      style: { backgroundColor: "rgba(242, 242, 242, 0.45)" },
      children: [
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-[1fr_auto_1fr] items-center gap-4 px-5 py-4 sm:px-8 sm:py-5", children: [
          /* @__PURE__ */ jsx("div", { className: "flex min-w-0 justify-start", children: /* @__PURE__ */ jsx(
            "a",
            {
              href: blogHref,
              className: `font-headline text-xl font-bold tracking-tight transition-colors sm:text-2xl ${blogActive ? "text-secondary" : "text-[#242424] hover:text-secondary"}`,
              "aria-current": blogActive ? "page" : void 0,
              children: t("nav.blog")
            }
          ) }),
          /* @__PURE__ */ jsx(
            "a",
            {
              href: homeHref,
              className: "shrink-0 transition-opacity hover:opacity-80",
              "aria-current": normalized === "/" ? "page" : void 0,
              children: /* @__PURE__ */ jsx(
                "img",
                {
                  src: "/digidevs-logo-dark.svg",
                  alt: "digiDEVS",
                  width: 573,
                  height: 95,
                  className: "block h-7 w-auto sm:h-8",
                  decoding: "async"
                }
              )
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "flex min-w-0 justify-end", children: /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              className: `font-headline text-right text-xl font-bold tracking-tight transition-colors sm:text-2xl ${aboutNavActive ? "text-secondary" : "text-[#242424]/80 hover:text-secondary"} cursor-pointer`,
              "aria-expanded": open,
              "aria-controls": panelId,
              id: `${panelId}-trigger`,
              onClick: () => setOpen((v) => !v),
              children: t("nav.about")
            }
          ) })
        ] }),
        /* @__PURE__ */ jsx(
          "div",
          {
            id: panelId,
            role: "region",
            "aria-labelledby": `${panelId}-trigger`,
            className: `grid transition-[grid-template-rows] duration-300 ease-out ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`,
            children: /* @__PURE__ */ jsx("div", { className: "min-h-0 overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: "border-t border-[#222222]/10 px-5 pb-6 pt-2 sm:px-8 sm:pb-8", children: /* @__PURE__ */ jsxs("div", { className: "grid gap-8 lg:grid-cols-[1fr_auto] lg:gap-12", children: [
              /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-0 divide-y divide-[#222222]/10 sm:grid-cols-2 sm:divide-x sm:divide-y", children: aboutLinks.map((item) => {
                const href = `${langPrefix}${item.path}`;
                const active = isActive$1(normalized, item.path);
                return /* @__PURE__ */ jsx(
                  "a",
                  {
                    href,
                    className: "group px-0 py-4 font-body text-[16px] font-bold leading-snug text-[#111111] transition-colors first:pt-0 hover:text-secondary sm:px-2 sm:py-5 sm:first:pt-5",
                    onClick: () => setOpen(false),
                    "aria-current": active ? "page" : void 0,
                    children: /* @__PURE__ */ jsx("span", { className: "relative inline-block after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-secondary after:transition-[width] group-hover:after:w-full", children: item.label })
                  },
                  item.path
                );
              }) }) }),
              /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-10 lg:max-w-xs lg:pl-4", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("p", { className: "font-headline mb-4 text-[12px] font-bold uppercase tracking-[0.2em] text-secondary", children: t("nav_drawer.contact") }),
                  /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 font-body text-[17px] leading-tight text-[#111111]", children: [
                    /* @__PURE__ */ jsx(
                      "a",
                      {
                        className: "text-center font-bold transition-colors hover:text-secondary lg:text-left",
                        href: "tel:+4790000000",
                        children: "+47 45 39 96 39"
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "a",
                      {
                        className: "text-center font-bold transition-colors hover:text-secondary lg:text-left",
                        href: "mailto:hello@digidevs.no",
                        children: "fredrik@digidevs.no"
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("p", { className: "font-headline mb-2 text-[12px] font-bold uppercase tracking-[0.2em] text-secondary", children: t("nav_drawer.visit") }),
                  /* @__PURE__ */ jsx("p", { className: "font-body text-[17px] font-bold leading-relaxed text-[#111111] whitespace-pre-line", children: t("nav_drawer.locations") })
                ] })
              ] })
            ] }) }) })
          }
        )
      ]
    }
  ) });
}

function LangSwitcher({
  pathname,
  lang,
  attachLeft = false
}) {
  const outerClass = [
    "origin-top shrink-0 scale-[0.945] overflow-hidden backdrop-blur-[10px] transition-transform duration-300 ease-out hover:scale-[0.99225]",
    attachLeft ? "rounded-[20px] rounded-l-none" : "rounded-[20px]"
  ].join(" ");
  return /* @__PURE__ */ jsx("div", { className: outerClass, style: { backgroundColor: "rgba(242, 242, 242, 0.45)" }, children: /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2 px-[13px] py-[10px] sm:px-[21px] sm:py-[13px]", children: LOCALES.map((locale) => /* @__PURE__ */ jsx(
    "a",
    {
      href: localePath(pathname, lang, locale),
      className: `font-label text-xs uppercase tracking-widest transition-colors ${locale === lang ? "font-bold text-secondary" : "text-[#242424]/80 hover:text-secondary"}`,
      "aria-label": LOCALE_LABELS[locale],
      "aria-current": locale === lang ? "true" : void 0,
      children: locale.toUpperCase()
    },
    locale
  )) }) });
}

function stripLangPrefix(pathname, lang) {
  if (lang === DEFAULT_LOCALE) return pathname;
  const p = `/${lang}`;
  if (pathname === p) return "/";
  if (pathname.startsWith(`${p}/`)) return pathname.slice(p.length) || "/";
  return pathname;
}
function isActive(normalizedPathname, href) {
  if (href === "/") return normalizedPathname === "/";
  return normalizedPathname === href || normalizedPathname.startsWith(`${href}/`);
}
function MobileNav({ pathname, lang }) {
  const t = useTranslations(lang);
  const langPrefix = lang === DEFAULT_LOCALE ? "" : `/${lang}`;
  const normalized = stripLangPrefix(pathname, lang);
  const links = [
    { path: "/", label: t("nav.home") },
    { path: "/blog", label: t("nav.blog") },
    { path: "/about", label: t("nav.about") },
    { path: "/about/competence", label: t("nav_about_links.competence") },
    { path: "/about/quality", label: t("nav_about_links.quality") }
  ];
  const contactHref = `${langPrefix}/contact`;
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const closeRef = useRef(null);
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center md:hidden", children: [
    /* @__PURE__ */ jsxs(
      "button",
      {
        type: "button",
        className: "text-secondary transition-all duration-300 ease-out hover:text-on-surface active:scale-[0.98]",
        "aria-expanded": open,
        "aria-controls": panelId,
        onClick: () => setOpen(true),
        children: [
          /* @__PURE__ */ jsx("span", { className: "sr-only", children: t("mobile.open_menu") }),
          /* @__PURE__ */ jsx(Menu, { className: "size-6", strokeWidth: 1.5, "aria-hidden": true })
        ]
      }
    ),
    open ? /* @__PURE__ */ jsx(
      "div",
      {
        className: "fixed inset-0 z-60 backdrop-blur-3xl",
        style: {
          background: "color-mix(in oklab, var(--color-surface) 92%, transparent)"
        },
        id: panelId,
        role: "dialog",
        "aria-modal": "true",
        "aria-label": t("mobile.site_navigation"),
        children: /* @__PURE__ */ jsxs("div", { className: "relative flex h-full flex-col justify-center px-12 md:px-24", children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              ref: closeRef,
              type: "button",
              className: "absolute right-8 top-8 text-on-surface-variant transition-all hover:text-on-surface",
              onClick: () => setOpen(false),
              children: [
                /* @__PURE__ */ jsx("span", { className: "sr-only", children: t("mobile.close_menu") }),
                /* @__PURE__ */ jsx(X, { className: "size-10", strokeWidth: 1.25, "aria-hidden": true })
              ]
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "mb-12", children: /* @__PURE__ */ jsx(
            "img",
            {
              src: "/digidevs-logo-dark.svg",
              alt: "digiDEVS",
              width: 573,
              height: 95,
              className: "block h-10 w-auto max-w-[min(85vw,420px)]",
              decoding: "async"
            }
          ) }),
          /* @__PURE__ */ jsx("nav", { className: "mb-16 flex flex-col gap-8", "aria-label": "Primary", children: links.map(({ path, label }) => {
            const href = `${langPrefix}${path}`;
            const active = isActive(normalized, path);
            return /* @__PURE__ */ jsx(
              "a",
              {
                href,
                className: `font-headline text-5xl tracking-editorial transition-all md:text-6xl ${active ? "font-bold text-tertiary" : "font-medium text-on-surface-variant hover:text-on-surface"}`,
                onClick: () => setOpen(false),
                children: label
              },
              path
            );
          }) }),
          /* @__PURE__ */ jsx("div", { className: "mt-auto flex flex-col gap-4 py-12", children: /* @__PURE__ */ jsx(
            "a",
            {
              href: contactHref,
              className: "rounded-xl bg-linear-to-br from-primary-soft to-primary-container px-8 py-4 text-center font-label font-semibold uppercase tracking-widest text-on-primary-container transition-transform hover:brightness-105 active:scale-95",
              children: t("mobile.get_in_touch")
            }
          ) })
        ] })
      }
    ) : null
  ] });
}

const $$SiteNavbar = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$SiteNavbar;
  const { pathname, lang } = Astro2.props;
  const langPrefix = lang === "no" ? "" : `/${lang}`;
  const homeHref = langPrefix || "/";
  return renderTemplate`${maybeRenderHead()}<header class="pointer-events-none fixed inset-x-0 top-0 z-50"> <div class="pointer-events-auto mx-auto flex w-full max-w-2xl items-start justify-center gap-3 px-4 pt-5 md:px-6 md:pt-6"> <div class="hidden w-full min-w-0 flex-1 items-center justify-center md:flex md:max-w-none"> <div class="flex min-w-0 max-w-full items-center justify-center gap-0"> ${renderComponent($$result, "GlassNavBar", GlassNavBar, { "client:load": true, "pathname": pathname, "lang": lang, "attachRight": true, "client:component-hydration": "load", "client:component-path": "/Users/fredrikaarvold/Documents/digiDEVS/digiweb-v3/astro-project/src/components/layout/GlassNavBar", "client:component-export": "default" })} <div class="relative z-10 shrink-0 -ml-px"> ${renderComponent($$result, "LangSwitcher", LangSwitcher, { "client:load": true, "pathname": pathname, "lang": lang, "attachLeft": true, "client:component-hydration": "load", "client:component-path": "/Users/fredrikaarvold/Documents/digiDEVS/digiweb-v3/astro-project/src/components/layout/LangSwitcher", "client:component-export": "default" })} </div> </div> </div> <div class="flex w-full items-center justify-between rounded-[20px] px-5 py-4 backdrop-blur-[10px] md:hidden" style="background-color: rgba(242, 242, 242, 0.45);"> <a${addAttribute(homeHref, "href")} class="shrink-0 transition-opacity hover:opacity-80"> <img src="/digidevs-logo-dark.svg" alt="digiDEVS" width="573" height="95" class="block h-7 w-auto" decoding="async"> </a> <div class="flex items-center gap-3 text-[#242424] [&_button]:text-[#242424] [&_svg]:text-current"> ${renderComponent($$result, "LangSwitcher", LangSwitcher, { "client:idle": true, "pathname": pathname, "lang": lang, "client:component-hydration": "idle", "client:component-path": "/Users/fredrikaarvold/Documents/digiDEVS/digiweb-v3/astro-project/src/components/layout/LangSwitcher", "client:component-export": "default" })} ${renderComponent($$result, "MobileNav", MobileNav, { "client:idle": true, "pathname": pathname, "lang": lang, "client:component-hydration": "idle", "client:component-path": "/Users/fredrikaarvold/Documents/digiDEVS/digiweb-v3/astro-project/src/components/layout/MobileNav", "client:component-export": "default" })} </div> </div> </div> </header>`;
}, "/Users/fredrikaarvold/Documents/digiDEVS/digiweb-v3/astro-project/src/components/layout/SiteNavbar.astro", void 0);

const $$DigiDevsWordmark = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$DigiDevsWordmark;
  const { class: className } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<span${addAttribute(["digi-wordmark", className], "class:list")}> <span class="digi-wordmark__digi">digi</span><span class="digi-wordmark__devs">DEVS</span> </span>`;
}, "/Users/fredrikaarvold/Documents/digiDEVS/digiweb-v3/astro-project/src/components/brand/DigiDevsWordmark.astro", void 0);

const $$SiteFooter = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$SiteFooter;
  const { lang } = Astro2.props;
  const t = useTranslations(lang);
  const year = (/* @__PURE__ */ new Date()).getFullYear();
  return renderTemplate`${maybeRenderHead()}<footer class="bg-surface-container-low px-8 py-20"> <div class="mx-auto flex max-w-7xl flex-col items-center gap-12 md:flex-row md:justify-between"> <div class="flex flex-col gap-3 text-center md:text-left"> <div class="text-xl text-on-surface"> ${renderComponent($$result, "DigiDevsWordmark", $$DigiDevsWordmark, {})} </div> <p class="font-label text-xs uppercase tracking-widest text-on-surface-variant">
© ${year}${" "} ${renderComponent($$result, "DigiDevsWordmark", $$DigiDevsWordmark, { "class": "inline align-baseline" })}. ${t("footer.rights")} </p> </div> <div class="flex flex-wrap justify-center gap-10"> <a class="font-label text-xs uppercase tracking-widest text-on-surface-variant transition-colors hover:text-secondary" href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
LinkedIn
</a> <a class="font-label text-xs uppercase tracking-widest text-on-surface-variant transition-colors hover:text-secondary" href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
Instagram
</a> <a class="font-label text-xs uppercase tracking-widest text-on-surface-variant transition-colors hover:text-secondary" href="https://twitter.com" target="_blank" rel="noopener noreferrer">
Twitter
</a> </div> <div class="text-center md:text-right"> <p class="font-label text-[10px] uppercase tracking-[0.3em] text-on-surface-variant/60">${t("footer.cities")}</p> </div> </div> </footer>`;
}, "/Users/fredrikaarvold/Documents/digiDEVS/digiweb-v3/astro-project/src/components/layout/SiteFooter.astro", void 0);

const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Layout;
  const {
    title = "digiDEVS",
    description = "Norwegian-led development studio. Web apps, mobile apps, and AI-powered products — EU quality without the Oslo price tag.",
    lang = "no",
    canonicalUrl,
    ogImage,
    ogType = "website",
    twitterCard = "summary_large_image",
    noIndex = false
  } = Astro2.props;
  const pathname = Astro2.url.pathname;
  const siteBase = "https://digidevs.no".replace(/\/$/, "");
  const canonical = canonicalUrl ?? `${siteBase}${pathname}`;
  const ogImageAbsolute = ogImage && (ogImage.startsWith("http://") || ogImage.startsWith("https://")) ? ogImage : ogImage ? `${siteBase}${ogImage.startsWith("/") ? "" : "/"}${ogImage}` : void 0;
  const strippedPath = stripLocalePrefixFromPathname(pathname);
  const pathSuffix = strippedPath === "/" ? "" : strippedPath;
  const ogLocale = { no: "nb_NO", en: "en_GB", hr: "hr_HR" }[lang] ?? "nb_NO";
  const htmlLang = LOCALE_HTML_LANG[lang] ?? lang;
  return renderTemplate`<html class="dark"${addAttribute(htmlLang, "lang")}> <head><meta charset="utf-8"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><link rel="icon" href="/favicon.ico"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="generator"${addAttribute(Astro2.generator, "content")}><meta name="description"${addAttribute(description, "content")}>${noIndex && renderTemplate`<meta name="robots" content="noindex, nofollow">`}<link rel="canonical"${addAttribute(canonical, "href")}><meta property="og:title"${addAttribute(title, "content")}><meta property="og:description"${addAttribute(description, "content")}><meta property="og:url"${addAttribute(canonical, "content")}><meta property="og:type"${addAttribute(ogType, "content")}><meta property="og:site_name" content="digiDEVS"><meta property="og:locale"${addAttribute(ogLocale, "content")}>${ogImageAbsolute && renderTemplate`<meta property="og:image"${addAttribute(ogImageAbsolute, "content")}>`}<meta name="twitter:card"${addAttribute(twitterCard, "content")}><meta name="twitter:title"${addAttribute(title, "content")}><meta name="twitter:description"${addAttribute(description, "content")}>${ogImageAbsolute && renderTemplate`<meta name="twitter:image"${addAttribute(ogImageAbsolute, "content")}>`}<title>${title}</title><link rel="alternate" hreflang="nb"${addAttribute(`${siteBase}${pathSuffix || "/"}`, "href")}><link rel="alternate" hreflang="en"${addAttribute(`${siteBase}/en${pathSuffix}`, "href")}><link rel="alternate" hreflang="hr"${addAttribute(`${siteBase}/hr${pathSuffix}`, "href")}><link rel="alternate" hreflang="x-default"${addAttribute(`${siteBase}${pathSuffix || "/"}`, "href")}><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Jost:wght@400;500;600;700&family=Manrope:wght@200..800&family=Space+Grotesk:wght@300..700&display=swap" rel="stylesheet">${renderSlot($$result, $$slots["head"])}${renderHead()}</head> <body class="selection:bg-primary-container/90 selection:text-on-primary-container"> ${renderComponent($$result, "SiteNavbar", $$SiteNavbar, { "pathname": pathname, "lang": lang })} ${renderSlot($$result, $$slots["default"])} ${renderComponent($$result, "SiteFooter", $$SiteFooter, { "lang": lang })} </body></html>`;
}, "/Users/fredrikaarvold/Documents/digiDEVS/digiweb-v3/astro-project/src/layouts/Layout.astro", void 0);

const __vite_import_meta_env__ = {"ASSETS_PREFIX": undefined, "BASE_URL": "/", "DEV": false, "MODE": "production", "PROD": true, "PUBLIC_SITE_URL": "https://digidevs.no", "SITE": "https://digidevs.no", "SSR": true};
function requireEnv(name) {
  const value = Object.assign(__vite_import_meta_env__, { SANITY_PROJECT_ID: "6lhefj7r", SANITY_DATASET: "production", SANITY_API_VERSION: "2024-01-01" })[name];
  if (!value || typeof value !== "string") {
    throw new Error(
      `${name} is not set. Add it to astro-project/.env (see .env.example). Builds need Sanity credentials.`
    );
  }
  return value;
}
let client = null;
let imageBuilder = null;
function getSanityClient() {
  if (!client) {
    client = createClient({
      projectId: requireEnv("SANITY_PROJECT_ID"),
      dataset: "production",
      apiVersion: "2024-01-01",
      useCdn: true,
      token: Object.assign(__vite_import_meta_env__, { SANITY_PROJECT_ID: "6lhefj7r", SANITY_DATASET: "production", SANITY_API_VERSION: "2024-01-01" }).SANITY_API_READ_TOKEN || void 0
    });
  }
  return client;
}
function getImageUrlBuilder() {
  if (!imageBuilder) {
    imageBuilder = createImageUrlBuilder({
      projectId: requireEnv("SANITY_PROJECT_ID"),
      dataset: "production"
    });
  }
  return imageBuilder;
}
function urlForImage(source) {
  if (!source) return null;
  try {
    return getImageUrlBuilder().image(source).width(1600).fit("max").auto("format").url();
  } catch {
    return null;
  }
}

const SINGLE_POST_BY_SLUG_QUERY = `*[
  _type == "post" &&
  !(_id in path("drafts.**")) &&
  defined(slug.current) &&
  defined(publishedAt) &&
  slug.current == $slug &&
  (language == $lang || (!defined(language) && $lang == "no"))
][0] {
  _id,
  title,
  "slug": slug.current,
  excerpt,
  publishedAt,
  updatedAt,
  author,
  categories,
  category,
  readTime,
  featured,
  coverImage,
  body,
  seo,
  language
}`;

function portableTextToHtml(blocks) {
  if (!blocks?.length) return "";
  return toHTML(blocks, {
    components: mergeComponents(defaultComponents, {
      marks: {
        link: ({ value, children }) => {
          const href = value?.href ?? "#";
          const isExternal = /^https?:\/\//.test(href);
          const rel = isExternal ? ' rel="noopener noreferrer"' : "";
          const target = isExternal ? ' target="_blank"' : "";
          return `<a href="${href}"${rel}${target}>${children}</a>`;
        }
      }
    })
  });
}
function normalizeCategories(doc) {
  const raw = doc.categories;
  if (Array.isArray(raw)) {
    const list = raw.filter((c) => typeof c === "string" && Boolean(c));
    if (list.length) return list;
  }
  if (typeof doc.category === "string" && doc.category.trim()) {
    return [doc.category.trim()];
  }
  return [];
}
function formatCategories(categories) {
  return (categories ?? []).filter(Boolean).join(" · ");
}
function mapDocToPost(doc) {
  const coverUrl = urlForImage(doc.coverImage);
  if (!coverUrl) {
    throw new Error(
      `Post "${doc.slug}" is missing a usable cover image. Add coverImage in Sanity.`
    );
  }
  const seo = doc.seo;
  return {
    slug: doc.slug,
    title: doc.title,
    description: doc.excerpt,
    date: doc.publishedAt,
    categories: normalizeCategories(doc),
    readTime: doc.readTime,
    author: doc.author,
    featured: doc.featured,
    bodyHtml: portableTextToHtml(doc.body),
    coverImageUrl: coverUrl,
    coverImageAlt: doc.coverImage?.alt?.trim() || doc.title,
    updatedAt: doc.updatedAt,
    seoTitle: seo?.seoTitle,
    seoDescription: seo?.seoDescription,
    noIndex: seo?.noIndex,
    canonicalUrl: seo?.canonicalUrl
  };
}
async function fetchPostBySlug(lang, slug) {
  const client = getSanityClient();
  const doc = await client.fetch(SINGLE_POST_BY_SLUG_QUERY, { lang, slug });
  if (!doc) return void 0;
  return mapDocToPost(doc);
}

export { $$Layout as $, formatCategories as a, fetchPostBySlug as f };
