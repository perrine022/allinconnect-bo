/**
 * Configuration centralisée de l'API
 * 
 * Cette configuration définit l'URL de base de l'API backend.
 * Elle peut être surchargée via la variable d'environnement NEXT_PUBLIC_API_URL.
 * 
 * Par défaut, l'API est configurée pour pointer vers localhost:8080
 */
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

/**
 * URL complète pour les endpoints d'authentification
 */
export const AUTH_API_URL = `${API_BASE_URL}/api/v1/auth`;

/**
 * URL complète pour les endpoints de statistiques
 */
export const STATISTICS_API_URL = `${API_BASE_URL}/api/v1/statistics`;

/**
 * URL complète pour les endpoints généraux de l'API
 */
export const API_URL = `${API_BASE_URL}/api`;


