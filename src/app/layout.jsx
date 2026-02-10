
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Providers } from "@/components/Providers";

export const metadata = {
  title: "Decide Simples",
  description: "Calculadora de operações matematicas e financeiras para ajudar a tomar decisões simples",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body>
        <Providers>
          <Header />
          <main className="main">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
