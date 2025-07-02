// app/timetable/layout.tsx
import type { ReactNode } from "react";
import "../globals.css";

export default function TimetableLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body className="min-h-screen bg-white text-black">
        {children}
      </body>
    </html>
  );
}
