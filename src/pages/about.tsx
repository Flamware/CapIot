import React from 'react';
import {NavLink} from "react-router-dom";

const AboutPage: React.FC = () => {
    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">À Propos de Cap.Iot Monitor</h1>

            <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-700 mb-2">Notre Mission</h2>
                <p className="text-gray-600 leading-relaxed">
                    Cap.Iot Monitor est une application web conçue pour la gestion et la surveillance intelligente de vos équipements. Notre objectif est de fournir une plateforme intuitive et complète permettant aux administrateurs, gestionnaires de sites et installateurs de contrôler, configurer et suivre l'état de leurs installations en temps réel.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-700 mb-2">Fonctionnalités Clés</h2>
                <ul className="list-disc list-inside text-gray-600 leading-relaxed">
                    <li>
                        <strong>Système d’authentification multi-rôles :</strong> Connexion sécurisée pour administrateurs, gestionnaires de sites et installateurs, avec des accès adaptés à leurs responsabilités.
                    </li>
                    <li>
                        <strong>Gestion complète des équipements :</strong> Ajout, configuration, consultation, mise à jour et suppression d'équipements spécifiques à chaque installation (type, localisation, capteurs, plages de fonctionnement, etc.).
                    </li>
                    <li>
                        <strong>Système de notifications intelligent :</strong> Alertes proactives pour la maintenance (notamment pour les lampes atteignant leur durée critique d'utilisation avec des paliers d'alerte), et notifications en cas d'arrêt inattendu d'un équipement.
                    </li>
                    <li>
                        <strong>Visualisation intuitive des données :</strong> Représentation claire des données de fonctionnement via des camemberts de durée d'utilisation des lampes et des diagrammes d'évolution des valeurs pertinentes (température, humidité, etc.).
                    </li>
                    <li>
                        <strong>Monitoring et contrôle en temps réel :</strong> Activation/désactivation des équipements via l'interface, définition de plages horaires et journalières de fonctionnement sur un calendrier épuré, et possibilité de réinitialiser les données d'usure après remplacement de composants.
                    </li>
                    <li>
                        <strong>Détails de fonctionnement par équipement :</strong> Page dédiée à chaque dispositif affichant son état (composants fonctionnels/défaillants), informations courantes (localisation, consommation, tension), et interface de gestion des instructions de fonctionnement.
                    </li>
                    <li>
                        <strong>Gestion des sites installés :</strong> Visualisation, création, assignation d'administrateurs, mise à jour et archivage des sites (bâtiments).
                    </li>
                    <li>
                        <strong>Sécurité et conformité RGPD :</strong> Architecture partitionnée pour la sécurité des données, accès utilisateur limité aux informations pertinentes, et implémentation d'une authentification multi-facteurs.
                    </li>
                    <li>
                        <strong>Données en temps réel :</strong> Réception et affichage des données de fonctionnement des équipements quasiment en temps réel (toutes les 15 secondes).
                    </li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-700 mb-2">Notre Engagement</h2>
                <p className="text-gray-600 leading-relaxed">
                    Nous nous engageons à fournir une solution fiable, sécurisée et facile à utiliser pour optimiser la gestion de vos équipements et améliorer leur efficacité opérationnelle.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-semibold text-gray-700 mb-2">Contact</h2>
                <p className="text-gray-600 leading-relaxed">
                    Pour toute question ou demande d'information, n'hésitez pas à <NavLink to="https://www.technopure.fr/Contact.html" className="text-blue-500 hover:underline">nous contacter</NavLink>.
                </p>
            </section>
        </div>
    );
};

export default AboutPage;