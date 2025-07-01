import Link from "next/link";
import {
  Users,
  Building2,
  ClipboardList,
  Monitor,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const features = [
  {
    title: "Classes & Groupes",
    description:
      "Gérez les classes d'étudiants, les groupes et les horaires académiques dans tous les départements.",
    icon: Users,
    href: "/classes",
  },
  {
    title: "Salles",
    description:
      "Configurez les aménagements de salles de classe, la capacité et l'équipement pour une utilisation optimale de l'espace.",
    icon: Building2,
    href: "/rooms",
  },
  {
    title: "Affectations",
    description:
      "Affectez les classes aux salles et gérez les conflits d'horaires et les réservations de salles.",
    icon: ClipboardList,
    href: "/assignments",
  },
  {
    title: "Contrôleurs d'Écran",
    description:
      "Surveillez et contrôlez les écrans numériques dans tout le campus en temps réel.",
    icon: Monitor,
    href: "/centrales",
  },
];

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
          Bienvenue sur MonitorControl
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          MonitorControl est un système centralisé pour gérer les horaires de
          cours, les affectations de salles et l'affichage dans tout le campus.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature) => {
          const IconComponent = feature.icon;
          return (
            <Link key={feature.title} href={feature.href} className="group">
              <Card className="h-full transition-all duration-200 hover:shadow-lg hover:scale-105 cursor-pointer border-2 hover:border-primary/20">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl font-semibold group-hover:text-primary transition-colors">
                      {feature.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
