import "./globals.css";
import Header from "../components/Header";

export const metadata = {
  title: "NowPrep | ServiceNow practice exams",
  description: "ServiceNow practice exams for CAD and CIS-CSM.",
};

export default function RootLayout({ children }) {
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
        <Header />
        {children}
      </body>
    </html>
  );
}
