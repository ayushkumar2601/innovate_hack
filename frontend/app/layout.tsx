"use client";

import { WalletConnectionProvider } from "./providers";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col antialiased" style={{ background: "#050505" }}>
        <WalletConnectionProvider>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </WalletConnectionProvider>
      </body>
    </html>
  );
}