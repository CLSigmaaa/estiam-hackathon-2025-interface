# 🖥️ MonitorControl — Interface Web  
**Hackathon E3/E4/E5 - Metz - Juin 2025**

## 🎯 Objectif  
Le projet MonitorControl vise à concevoir une interface web permettant la **gestion centralisée des emplois du temps** dans un établissement scolaire, avec diffusion sur plusieurs écrans. Cette application facilite l’**assignation de salles**, la **planification de cours**, la **diffusion d’informations**, et la **conformité RGPD**.

---

## 🛠️ Stack Technique

- **Frontend** : [Next.js 15](https://nextjs.org/), TypeScript, TailwindCSS  
- **Backend** : API REST Java Spring Boot (hébergée séparément)  
- **Base de données** : PostgreSQL (via API Java)  
- **Authentification / RGPD** : Email de consentement + charte RGPD dédiée  
- **Déploiement** : Compatible Azure App Service ou conteneur Docker

---

## 🚀 Fonctionnalités principales

### 1. Gestion des entités pédagogiques
- Création/modification de **classes** et **groupes**
- Définition du type (`ENTIERE` ou `GROUPE`) et de l’effectif

### 2. Gestion des salles
- Ajout, édition, suppression des **salles**
- Capacité d’accueil et statut (active/inactive)

### 3. Planification des affectations
- Interface de **drag & drop** pour affecter des classes à des salles
- Popover pour configurer les cours (enseignant, salle, période)

### 4. Affichage dynamique des plannings
- Page `/timetable` avec :
  - Filtres par jour, salle, créneau
  - Affichage coloré des classes assignées
  - Affichage des **informations d’alerte** (panne, indisponibilité…)

### 5. RGPD & consentement
- Lors de l’ajout d’un professeur :
  - Envoi automatique d’un **email de consentement RGPD**
  - Lien vers une **charte de confidentialité** hébergée sur `/rgpd`

### 6. Import / Export
- Système d’export et d’import des données de configuration (JSON chiffré)

---

## 🔌 Configuration

### Variables d’environnement (`.env`)

```env
API_JAVA_URL=https://monitorcontrol-api.example.com
SMTP_USER=
SMTP_PASS=
```

---

## ▶️ Lancer l’application localement

```bash
# Installer les dépendances
npm i

# Lancer le serveur de développement
npm run dev
```

---

## 📄 Pages importantes

| URL                        | Description                                      |
|---------------------------|--------------------------------------------------|
| `/affectations`           | Interface admin (drag & drop + popover cours)   |
| `/timetable`              | Vue publique des plannings + filtres            |
| `/rgpd`                   | Affichage de la charte RGPD                      |
| `/api/informations`       | CRUD des annonces ou alertes                     |
| `/api/classes`            | Création/lecture des classes et groupes         |
| `/api/salles`             | Gestion des salles (filtrées par statut)        |
| `/api/sendmail`           | Envoi de mail de consentement RGPD              |

---

## 🔒 RGPD & Sécurité

- Enregistrement minimal des données personnelles
- Consentement explicite requis pour les enseignants
- Données chiffrées côté API (SHA-256 + sel/poivre)
- Accès aux écrans et données sécurisé via token/API Gateway si nécessaire
