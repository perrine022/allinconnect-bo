/**
 * Configuration centralisée de l'API
 * 
 * Cette configuration définit l'URL de base de l'API backend.
 * Elle peut être surchargée via la variable d'environnement NEXT_PUBLIC_API_URL.
 * 
 * Production: https://allinconnect-back-1.onrender.com
 * Local (commenté): http://localhost:8080
 */
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://allinconnect-back-1.onrender.com";
// Pour le développement local, décommenter la ligne ci-dessous et commenter celle du dessus:
// export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

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


