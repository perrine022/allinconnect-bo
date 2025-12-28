import axios from "axios";
import { AUTH_API_URL } from "@/config/api";
import { UserRegistrationRequest, User } from "@/types";

// Créer une instance axios pour l'authentification
const authApi = axios.create({
  baseURL: AUTH_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interface pour le payload de connexion
export interface SigninDto {
  email: string;
  password: string;
}

// Interface pour la réponse de connexion
export interface SigninResponse {
  token?: string;
  user?: User;
  [key: string]: any;
}

// Interface pour le mot de passe oublié
export interface ForgotPasswordDto {
  email: string;
}

// Interface pour la réinitialisation du mot de passe
export interface ResetPasswordDto {
  token: string;
  password: string;
}

export const authSignupService = {
  // Créer un nouvel utilisateur
  signup: async (dto: UserRegistrationRequest) => {
    try {
      console.log("🔵 [AUTH SIGNUP API] Envoi de la requête d'inscription:", {
        email: dto.email,
        firstName: dto.firstName,
        lastName: dto.lastName,
        userType: dto.userType,
        endpoint: "/register",
      });

      const response = await authApi.post("/register", dto);

      console.log("✅ [AUTH SIGNUP API] Inscription réussie:", {
        status: response.status,
        data: response.data,
      });

      return response.data;
    } catch (error: any) {
      console.error(
        "❌ [AUTH SIGNUP API] Erreur lors de l'inscription:",
        error
      );

      if (error.response) {
        console.error("❌ [AUTH SIGNUP API] Réponse d'erreur:", {
          status: error.response.status,
          data: error.response.data,
        });
        throw new Error(
          error.response.data?.message ||
            error.response.data?.error ||
            `Erreur ${error.response.status}: ${error.response.statusText}`
        );
      } else if (error.request) {
        console.error(
          "❌ [AUTH SIGNUP API] Aucune réponse reçue:",
          error.request
        );
        throw new Error("Aucune réponse du serveur. Vérifiez votre connexion.");
      } else {
        console.error(
          "❌ [AUTH SIGNUP API] Erreur de configuration:",
          error.message
        );
        throw new Error(`Erreur de configuration: ${error.message}`);
      }
    }
  },
};

export const authSigninService = {
  // Se connecter
  signin: async (dto: SigninDto): Promise<SigninResponse> => {
    try {
      console.log("🔵 [AUTH SIGNIN API] Envoi de la requête de connexion:", {
        email: dto.email,
        endpoint: "/authenticate",
      });

      const response = await authApi.post<SigninResponse>("/authenticate", {
        email: dto.email,
        password: dto.password,
      });

      console.log("✅ [AUTH SIGNIN API] Connexion réussie:", {
        status: response.status,
        hasToken: !!response.data.token,
        userId: response.data.user?.id,
      });

      return response.data;
    } catch (error: any) {
      console.error("❌ [AUTH SIGNIN API] Erreur lors de la connexion:", error);

      if (error.response) {
        console.error("❌ [AUTH SIGNIN API] Réponse d'erreur:", {
          status: error.response.status,
          data: error.response.data,
        });
        throw new Error(
          error.response.data?.message ||
            error.response.data?.error ||
            `Erreur ${error.response.status}: ${error.response.statusText}`
        );
      } else if (error.request) {
        console.error(
          "❌ [AUTH SIGNIN API] Aucune réponse reçue:",
          error.request
        );
        throw new Error("Aucune réponse du serveur. Vérifiez votre connexion.");
      } else {
        console.error(
          "❌ [AUTH SIGNIN API] Erreur de configuration:",
          error.message
        );
        throw new Error(`Erreur de configuration: ${error.message}`);
      }
    }
  },
};

export const authForgotPasswordService = {
  // Mot de passe oublié
  forgotPassword: async (dto: ForgotPasswordDto) => {
    try {
      const response = await authApi.post("/forgot-password", dto);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(
          error.response.data?.message ||
            error.response.data?.error ||
            `Erreur ${error.response.status}: ${error.response.statusText}`
        );
      } else if (error.request) {
        throw new Error("Aucune réponse du serveur. Vérifiez votre connexion.");
      } else {
        throw new Error(`Erreur de configuration: ${error.message}`);
      }
    }
  },
};

export const authResetPasswordService = {
  // Réinitialisation du mot de passe
  resetPassword: async (dto: ResetPasswordDto) => {
    try {
      const response = await authApi.post("/reset-password", dto);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(
          error.response.data?.message ||
            error.response.data?.error ||
            `Erreur ${error.response.status}: ${error.response.statusText}`
        );
      } else if (error.request) {
        throw new Error("Aucune réponse du serveur. Vérifiez votre connexion.");
      } else {
        throw new Error(`Erreur de configuration: ${error.message}`);
      }
    }
  },
};
