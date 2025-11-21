import React from 'react';
import { NavLink } from "react-router-dom";

const CheckIcon = () => (
    <svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
);

const AboutPage: React.FC = () => {
    return (
        <div className=" min-h-screen p-4 sm:p-8 font-sans">
            <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-6 sm:p-10">


                <section className="mb-10">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 pb-2 border-b-4 border-green-200">
                        Notre Mission
                    </h2>
                    <p className="text-gray-700 text-lg leading-relaxed">
                        Cap.Iot Monitor est une application web conçue pour la gestion et la surveillance intelligente de vos équipements. Notre objectif est de fournir une plateforme intuitive et complète permettant aux administrateurs, gestionnaires de sites et installateurs de contrôler, configurer et suivre l'état de leurs installations en temps réel.
                    </p>
                </section>

                <section className="mb-10">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 pb-2 border-b-4 border-green-200">
                        Fonctionnalités Principales
                    </h2>
                    <ul className="space-y-4 text-lg">
                        <li className="flex items-start">
                            <CheckIcon />
                            <span><strong>Système d'authentification multi-rôles :</strong> Connexion sécurisée pour les administrateurs, gestionnaires de sites et installateurs, avec des accès adaptés à leurs responsabilités.</span>
                        </li>
                        <li className="flex items-start">
                            <CheckIcon />
                            <span><strong>Gestion complète des équipements :</strong> Ajout, configuration, consultation, mise à jour et suppression d'équipements spécifiques à chaque installation.</span>
                        </li>
                        <li className="flex items-start">
                            <CheckIcon />
                            <span><strong>Système de notifications intelligent :</strong> Alertes proactives pour la maintenance et notifications en cas d'arrêt inattendu d'un équipement.</span>
                        </li>
                        <li className="flex items-start">
                            <CheckIcon />
                            <span><strong>Visualisation intuitive des données :</strong> Représentation claire des données de fonctionnement via des graphiques et diagrammes pertinents.</span>
                        </li>
                        <li className="flex items-start">
                            <CheckIcon />
                            <span><strong>Surveillance et contrôle en temps réel :</strong> Activation/désactivation des équipements, définition de plages horaires et journalières de fonctionnement.</span>
                        </li>
                        <li className="flex items-start">
                            <CheckIcon />
                            <span><strong>Détails de fonctionnement par équipement :</strong> Page dédiée à chaque dispositif affichant son état, ses informations et la gestion des instructions.</span>
                        </li>
                        <li className="flex items-start">
                            <CheckIcon />
                            <span><strong>Gestion des sites installés :</strong> Visualisation, création, assignation d'administrateurs, mise à jour et archivage des sites.</span>
                        </li>
                        <li className="flex items-start">
                            <CheckIcon />
                            <span><strong>Sécurité et conformité :</strong> Architecture partitionnée, accès limité et authentification multi-facteurs.</span>
                        </li>
                        <li className="flex items-start">
                            <CheckIcon />
                            <span><strong>Données en temps réel :</strong> Réception et affichage des données de fonctionnement quasiment en temps réel (toutes les 15 secondes).</span>
                        </li>
                    </ul>
                </section>

                <section className="mb-10">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 pb-2 border-b-4 border-green-200">
                        Notre Engagement
                    </h2>
                    <p className="text-gray-700 text-lg leading-relaxed">
                        Nous nous engageons à fournir une solution fiable et conviviale qui répond aux besoins de nos clients tout en respectant les normes les plus élevées en matière de sécurité et de confidentialité des données.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 pb-2 border-b-4 border-green-200">
                        Contact
                    </h2>
                    <p className="text-gray-700 text-lg leading-relaxed">
                        Pour toute question ou demande d'information, n'hésitez pas à <NavLink to="https://www.technopure.fr/Contact.html" className="text-green-600 font-semibold hover:underline">nous contacter</NavLink>.
                    </p>
                </section>
            </div>
        </div>
    );
};

export default AboutPage;