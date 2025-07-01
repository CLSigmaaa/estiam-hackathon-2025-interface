import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import "../globals.css";
import { AdminNavbar } from "@/components/admin-navbar";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

const user = {
  name: "Admin User",
  email: "admin@school.edu",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <AdminNavbar user={user} />
        <main className="min-h-screen bg-background">{children}</main>
        <Toaster />
      </body>
    </html>
  );
}