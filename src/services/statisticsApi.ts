import api from "./api";

// Interface pour les statistiques du dashboard
export interface DashboardStatistics {
  current: MonthlyStatistics;
  history: MonthlyStatistics[];
}

// Interface pour les statistiques mensuelles
export interface MonthlyStatistics {
  year: number;
  month: number;
  users: {
    total: number;
    new: number;
    active: number;
    activeUsers?: number; // Utilisateurs avec abonnement actif
    totalUsers?: number; // Total des utilisateurs
  };
  offers: {
    total: number;
    active: number;
    inactive: number;
  };
  prices: {
    total: number;
    average: number;
    changes: number;
  };
  cagnotte: {
    total: number;
    transactions: number;
    average: number;
  };
  revenue?: number; // Montant total des paiements pour le mois
  frozen?: boolean;
  frozenAt?: string;
}

// Interface pour la réponse du dashboard complet
export interface DashboardResponse {
  current: MonthlyStatistics;
  history: MonthlyStatistics[];
}

// Interface pour figer un mois
export interface FreezeMonthParams {
  year: number;
  month: number;
}

// Interface pour la réponse du nouveau dashboard (DashboardStatsResponse)
export interface DashboardStatsResponse {
  totalUsers: number;
  activeUsers: number;
  totalProfessionals: number;
  totalOffers: number;
  currentMonthRevenue: number;
  usersBySubscriptionType: {
    FREE: number;
    PREMIUM: number;
  };
  professionalsByCategory: {
    [key: string]: number; // BEAUTE_ESTHETIQUE, FOOD_PLAISIRS, SERVICE_PRATIQUES, ENTRE_PROS, etc.
  };
}

// Interface pour les statistiques détaillées du dashboard
export interface DetailedStatistics {
  // Utilisateurs
  users: {
    total: number;
    active: number; // Utilisateurs avec abonnement actif
    professionals: number; // Nombre de professionnels
    clients: number; // Nombre de clients
    totalRevenue: number; // Montant total des abonnements pros
  };
  // Abonnements par type
  subscriptions: {
    byType: {
      FREE: number;
      PREMIUM: number;
    };
    byCategory: {
      INDIVIDUAL: number;
      FAMILY: number;
      PROFESSIONAL: number;
    };
    totalActive: number;
  };
  // Offres
  offers: {
    total: number;
    active: number;
    inactive: number;
    byType: {
      OFFRE: number;
      EVENEMENT: number;
    };
  };
  // Revenus
  revenue: {
    total: number; // Revenus totaux
    monthly: number; // Revenus du mois en cours
    fromProfessionals: number; // Montant total des abonnements pros
  };
  // Cagnotte
  wallet: {
    totalBalance: number; // Solde total de toutes les cagnottes
    totalTransactions: number;
    pendingRequests: number;
  };
}

// Service pour les statistiques
export const statisticsService = {
  // Récupérer le dashboard avec les nouvelles statistiques globales
  getDashboard: async (): Promise<DashboardStatsResponse> => {
    try {
      const response = await api.get<DashboardStatsResponse>('/v1/statistics/dashboard');
      return response.data;
    } catch (error: any) {
      console.error("❌ [STATISTICS API] Erreur lors de la récupération du dashboard:", error);
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

  // Récupérer le dashboard complet avec historique (ancien format)
  getDashboardFull: async (): Promise<DashboardResponse> => {
    try {
      const response = await api.get<DashboardResponse>('/v1/statistics/dashboard/full');
      return response.data;
    } catch (error: any) {
      console.error("❌ [STATISTICS API] Erreur lors de la récupération du dashboard complet:", error);
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

  // Récupérer les statistiques du mois en cours
  getCurrent: async (): Promise<MonthlyStatistics> => {
    try {
      const response = await api.get<MonthlyStatistics>('/v1/statistics/current');
      return response.data;
    } catch (error: any) {
      console.error("❌ [STATISTICS API] Erreur lors de la récupération des stats actuelles:", error);
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

  // Récupérer l'historique des statistiques
  getHistory: async (): Promise<MonthlyStatistics[]> => {
    try {
      const response = await api.get<MonthlyStatistics[]>('/v1/statistics/history');
      return response.data;
    } catch (error: any) {
      console.error("❌ [STATISTICS API] Erreur lors de la récupération de l'historique:", error);
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

  // Figer les stats du mois précédent
  freezePrevious: async (): Promise<void> => {
    try {
      await api.post('/v1/statistics/freeze-previous');
    } catch (error: any) {
      console.error("❌ [STATISTICS API] Erreur lors du figement du mois précédent:", error);
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

  // Figer un mois spécifique
  freezeMonth: async (params: FreezeMonthParams): Promise<void> => {
    try {
      await api.post('/v1/statistics/freeze', null, {
        params: {
          year: params.year,
          month: params.month,
        },
      });
    } catch (error: any) {
      console.error("❌ [STATISTICS API] Erreur lors du figement du mois:", error);
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

  // Récupérer les statistiques détaillées du dashboard
  getDetailedStatistics: async (): Promise<DetailedStatistics> => {
    try {
      const response = await api.get<DetailedStatistics>('/v1/statistics/detailed');
      return response.data;
    } catch (error: any) {
      console.error("❌ [STATISTICS API] Erreur lors de la récupération des statistiques détaillées:", error);
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

