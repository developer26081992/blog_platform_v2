import type { ReactNode } from "react";
import "./globals.css";
import SiteHeader from "./components/site-header";
import SiteFooter from "./components/site-footer";

export const metadata = {
  title: "The Journal | Blog Platform",
  description: "Ideas, stories, and perspectives worth spending time with.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
