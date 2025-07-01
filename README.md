# 📚 School Planner — Next.js + Prisma + Supabase

Application de gestion d'emploi du temps et de ressources pour établissements scolaires.

## 🚀 Fonctionnalités

- ✅ **Backend avec Prisma** connecté à **Supabase (PostgreSQL)**
- ✅ **API REST** pour `Centrale`, `Salle`, `Classe`, `Affectation`, `Information`
- ✅ **CRUD complet** sur toutes les entités
- ✅ **Pages Front** :
  - `/centrales` : gestion des centrales MQTT
  - `/rooms` : gestion des salles (nom, capacité, statut)
  - `/classes` : visualisation des classes
  - `/timetable` : affichage filtrable de l’emploi du temps
  - `/` : page d’accueil illustrative
  - `/profile` : page de profil statique

## 🛠️ Stack Technique

- [Next.js 15](https://nextjs.org/)
- [Prisma ORM](https://www.prisma.io/)
- [Supabase](https://supabase.com/) (hébergement PostgreSQL)
- [shadcn/ui](https://ui.shadcn.com/) pour l’UI
- [Sonner](https://sonner.emilkowal.ski/) pour les toasts

## 🔧 Installation

```bash
git clone https://github.com/votre-utilisateur/school-planner.git
cd school-planner

# Installe les dépendances
npm install

# Remplis .env avec l'URL et le token de Supabase
cp .env.example .env
