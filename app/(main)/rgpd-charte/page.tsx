"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Shield, Eye, Database, UserCheck, Clock, Mail } from "lucide-react"

export default function RgpdCharte() {
  const searchParams = useSearchParams()
  const email = searchParams.get("email")

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader className="text-center border-b">
            <CardTitle className="text-3xl font-bold text-gray-900 mb-2">Charte RGPD - MonitorControl</CardTitle>
            <p className="text-gray-600">Règlement Général sur la Protection des Données</p>
            {email && (
              <p className="text-sm text-gray-500 mt-2">
                Pour : <span className="font-medium">{decodeURIComponent(email)}</span>
              </p>
            )}
          </CardHeader>

          <CardContent className="prose prose-gray max-w-none p-8">
            {/* Introduction */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Shield className="h-5 w-5 mr-2 text-blue-600" />
                Introduction
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                MonitorControl s'engage à protéger la vie privée et les données personnelles de tous ses utilisateurs,
                en particulier les professeurs et les étudiants. Cette charte explique comment nous collectons,
                utilisons et protégeons vos données conformément au RGPD.
              </p>
            </section>

            {/* Données collectées */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Database className="h-5 w-5 mr-2 text-blue-600" />
                Données collectées
              </h2>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h3 className="font-medium text-gray-900 mb-2">Données d'identification :</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Nom et prénom</li>
                  <li>Adresse e-mail professionnelle</li>
                  <li>Identifiant utilisateur</li>
                  <li>Établissement d'affectation</li>
                </ul>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Données d'utilisation :</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Logs de connexion</li>
                  <li>Historique des actions pédagogiques</li>
                  <li>Données de monitoring des sessions</li>
                  <li>Préférences d'utilisation</li>
                </ul>
              </div>
            </section>

            {/* Finalités */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <UserCheck className="h-5 w-5 mr-2 text-blue-600" />
                Finalités du traitement
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-medium text-blue-900 mb-2">Gestion pédagogique</h3>
                  <p className="text-blue-800 text-sm">
                    Faciliter le suivi et l'encadrement des étudiants lors des sessions informatiques
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-medium text-green-900 mb-2">Sécurité</h3>
                  <p className="text-green-800 text-sm">
                    Assurer la sécurité des systèmes et prévenir les usages inappropriés
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-medium text-purple-900 mb-2">Amélioration</h3>
                  <p className="text-purple-800 text-sm">Optimiser les fonctionnalités et l'expérience utilisateur</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h3 className="font-medium text-orange-900 mb-2">Conformité</h3>
                  <p className="text-orange-800 text-sm">Respecter les obligations légales et réglementaires</p>
                </div>
              </div>
            </section>

            {/* Droits */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Eye className="h-5 w-5 mr-2 text-blue-600" />
                Vos droits
              </h2>
              <p className="text-gray-700 mb-4">Conformément au RGPD, vous disposez des droits suivants :</p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-medium text-gray-900">Droit d'accès</h3>
                  <p className="text-gray-600 text-sm">Consulter vos données personnelles</p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="font-medium text-gray-900">Droit de rectification</h3>
                  <p className="text-gray-600 text-sm">Corriger vos données inexactes</p>
                </div>
                <div className="border-l-4 border-red-500 pl-4">
                  <h3 className="font-medium text-gray-900">Droit à l'effacement</h3>
                  <p className="text-gray-600 text-sm">Demander la suppression de vos données</p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4">
                  <h3 className="font-medium text-gray-900">Droit à la portabilité</h3>
                  <p className="text-gray-600 text-sm">Récupérer vos données dans un format structuré</p>
                </div>
              </div>
            </section>

            {/* Conservation */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Clock className="h-5 w-5 mr-2 text-blue-600" />
                Durée de conservation
              </h2>
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                <ul className="text-gray-700 space-y-2">
                  <li><strong>Données d'identification :</strong> Durée de l'affectation + 1 an</li>
                  <li><strong>Logs de connexion :</strong> 12 mois maximum</li>
                  <li><strong>Données pédagogiques :</strong> Durée de l'année scolaire + 3 ans</li>
                  <li><strong>Données de sécurité :</strong> 6 mois après résolution des incidents</li>
                </ul>
              </div>
            </section>

            {/* Contact */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Mail className="h-5 w-5 mr-2 text-blue-600" />
                Contact et réclamations
              </h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-700 mb-4">
                  Pour exercer vos droits ou pour toute question relative à cette charte :
                </p>
                <div className="space-y-2 text-gray-700">
                  <p><strong>Délégué à la Protection des Données (DPO) :</strong></p>
                  <p>📧 dpo@monitorcontrol.edu</p>
                  <p>📞 01 23 45 67 89</p>
                  <p>📍 Service Informatique - Rectorat</p>
                </div>
                <div className="mt-4 p-3 bg-blue-50 rounded border-l-4 border-blue-500">
                  <p className="text-blue-800 text-sm">
                    <strong>Droit de réclamation :</strong> Vous pouvez également saisir la CNIL en cas de litige.
                  </p>
                </div>
              </div>
            </section>

            {/* Footer */}
            <div className="border-t pt-6 mt-8">
              <p className="text-gray-500 text-sm text-center">
                Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")} | Version 2.1
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Boutons d'action */}
        <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
              J'accepte cette charte
            </Button>
          </Link>
          <Button variant="outline" className="w-full sm:w-auto bg-transparent" onClick={() => window.print()}>
            Imprimer cette charte
          </Button>
        </div>
      </div>
    </div>
  )
}