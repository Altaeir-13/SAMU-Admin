import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";

export const metadata: Metadata = {
  title: "SAMU Admin - Sistema de Gestão Administrativa",
  description: "Sistema web de gestão administrativa para o SAMU. Painel centralizado para controle de escalas, frotas, estoques e visualização de métricas operacionais.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased font-sans">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
