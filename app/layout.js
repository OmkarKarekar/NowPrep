import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import JsonLd from "../components/JsonLd";
import { EXAMS, loadBank } from "../lib/bank";
import { SITE_URL, SITE_NAME } from "../lib/site";

const DESCRIPTION = "Free ServiceNow certification practice exams for CSA, CAD, CIS-DF, CIS-ITSM and CIS-CSM. Practise at your own pace, check answers as you go and review your score.";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "NowPrep | Free ServiceNow practice exams", template: "%s | NowPrep" },
  description: DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: ["ServiceNow practice exam", "ServiceNow CSA practice questions", "ServiceNow CAD practice questions", "CIS-ITSM practice exam", "CIS-CSM practice exam", "CIS-DF practice exam", "ServiceNow certification"],
  openGraph: { type: "website", siteName: SITE_NAME, title: "NowPrep | Free ServiceNow practice exams", description: DESCRIPTION, locale: "en_US" },
  twitter: { card: "summary_large_image", title: "NowPrep | Free ServiceNow practice exams", description: DESCRIPTION },
  robots: { index: true, follow: true },
};

export const viewport = { themeColor: "#001f30", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }) {
  const exams = Object.values(EXAMS).map(({ code, name }) => ({ code, name, count: loadBank(code).length }));
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('nowprep-theme');if(t)document.documentElement.setAttribute('data-theme',t);}catch(e){}`,
          }}
        />
      </head>
      <body>
        <JsonLd data={{ "@context": "https://schema.org", "@graph": [
          { "@type": "WebSite", "@id": `${SITE_URL}/#website`, url: SITE_URL, name: SITE_NAME, description: DESCRIPTION, inLanguage: "en" },
          { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL, logo: `${SITE_URL}/icon.svg` },
        ] }} />
        <Header exams={exams} />
        <div className="page">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
