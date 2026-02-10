
import "./globals.css";

export const metadata = {
  title: "Decide Simples",
  description: "Calculadora de operações matematicas e financeiras para ajudar a tomar decisões simples",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
      </body>
    </html>
  );
}
