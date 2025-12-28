'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Tag, DollarSign, Wallet, LogOut, Search, Edit, X, BarChart3 } from 'lucide-react';
import { statisticsService, MonthlyStatistics, DetailedStatistics, DashboardStatsResponse } from '@/services/statisticsApi';
import { usersService } from '@/services/usersApi';
import { offersService } from '@/services/offersApi';
import { walletService, WalletTransaction, WalletRequest } from '@/services/walletApi';
import { subscriptionsService } from '@/services/subscriptionsApi';
import { User, Offer, SubscriptionPlan, Payment, UpdateProfileDto } from '@/types';

export default function DashboardPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState<'statistiques' | 'users' | 'offres' | 'prix' | 'cagnotte'>('statistiques');
  const [searchTerm, setSearchTerm] = useState('');
  const [userTypeFilter, setUserTypeFilter] = useState<'ALL' | 'CLIENT' | 'PROFESSIONAL' | 'MEGA_ADMIN'>('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<{
    current: MonthlyStatistics | null;
    history: MonthlyStatistics[];
  }>({
    current: null,
    history: [],
  });
  const [dashboardStats, setDashboardStats] = useState<DashboardStatsResponse | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editFormData, setEditFormData] = useState<UpdateProfileDto>({});
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [editOfferFormData, setEditOfferFormData] = useState<Partial<Offer>>({});
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [editPlanFormData, setEditPlanFormData] = useState<Partial<SubscriptionPlan>>({});
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);
  const [editPaymentFormData, setEditPaymentFormData] = useState<Partial<Payment>>({});
  const [saving, setSaving] = useState(false);
  const [isCreatingPlan, setIsCreatingPlan] = useState(false);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [offersLoading, setOffersLoading] = useState(false);
  const [offersError, setOffersError] = useState<string | null>(null);
  const [walletHistory, setWalletHistory] = useState<WalletTransaction[]>([]);
  const [walletRequests, setWalletRequests] = useState<WalletRequest[]>([]);
  const [walletLoading, setWalletLoading] = useState(false);
  const [walletError, setWalletError] = useState<string | null>(null);
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [subscriptionsLoading, setSubscriptionsLoading] = useState(false);
  const [subscriptionsError, setSubscriptionsError] = useState<string | null>(null);
  const [detailedStats, setDetailedStats] = useState<DetailedStatistics | null>(null);
  const [detailedStatsLoading, setDetailedStatsLoading] = useState(false);
  const [detailedStatsError, setDetailedStatsError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedIsLoggedIn = localStorage.getItem('finalIsLoggedIn') === 'true';
      const storedAuthToken = localStorage.getItem('authToken');
      const actuallyLoggedIn = storedIsLoggedIn || !!storedAuthToken;
      
      if (!actuallyLoggedIn) {
        router.push('/');
      } else {
        setIsAuthenticated(true);
        loadDashboardData();
      }
    }
  }, [router]);

  useEffect(() => {
    if (!isAuthenticated) return;
    
    if (activeTab === 'statistiques') {
      loadDetailedStatistics();
    } else if (activeTab === 'users') {
      loadUsers();
    } else if (activeTab === 'offres') {
      loadOffers();
    } else if (activeTab === 'cagnotte') {
      loadWalletData();
    } else if (activeTab === 'prix') {
      loadSubscriptions();
    }
  }, [activeTab, isAuthenticated]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      // Charger les nouvelles statistiques du dashboard
      const stats = await statisticsService.getDashboard();
      setDashboardStats(stats);
      
      // Charger aussi les données complètes avec historique si nécessaire
      try {
        const fullData = await statisticsService.getDashboardFull();
        setDashboardData({
          current: fullData.current,
          history: fullData.history,
        });
      } catch (err) {
        // Si l'endpoint /dashboard/full n'existe pas, on continue sans historique
        console.warn('Endpoint /dashboard/full non disponible, utilisation des stats simplifiées uniquement');
      }
    } catch (err: any) {
      console.error('Erreur lors du chargement des données:', err);
      setError(err.message || 'Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      setUsersLoading(true);
      setUsersError(null);
      // Récupérer tous les utilisateurs
      const usersData = await usersService.getAllUsers();
      setUsers(usersData);
    } catch (err: any) {
      console.error('Erreur lors du chargement des utilisateurs:', err);
      setUsersError(err.message || 'Erreur lors du chargement des utilisateurs');
    } finally {
      setUsersLoading(false);
    }
  };

  const loadOffers = async () => {
    try {
      setOffersLoading(true);
      setOffersError(null);
      const offersData = await offersService.getAll();
      setOffers(offersData);
    } catch (err: any) {
      console.error('Erreur lors du chargement des offres:', err);
      setOffersError(err.message || 'Erreur lors du chargement des offres');
    } finally {
      setOffersLoading(false);
    }
  };

  const loadWalletData = async () => {
    try {
      setWalletLoading(true);
      setWalletError(null);
      // Utiliser les endpoints admin pour le backoffice
      const [history, requests] = await Promise.all([
        walletService.getAdminHistory(),
        walletService.getAdminRequests(),
      ]);
      setWalletHistory(history);
      setWalletRequests(requests);
    } catch (err: any) {
      console.error('Erreur lors du chargement de la cagnotte:', err);
      setWalletError(err.message || 'Erreur lors du chargement de la cagnotte');
    } finally {
      setWalletLoading(false);
    }
  };

  const handleUpdateRequestStatus = async (requestId: number, status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED') => {
    try {
      setSaving(true);
      await walletService.updateRequestStatus(requestId, status);
      // Recharger les données
      await loadWalletData();
    } catch (err: any) {
      console.error('Erreur lors de la mise à jour du statut:', err);
      alert(err.message || 'Erreur lors de la mise à jour du statut');
    } finally {
      setSaving(false);
    }
  };

  const loadSubscriptions = async () => {
    try {
      setSubscriptionsLoading(true);
      setSubscriptionsError(null);
      const [plans, paymentsData] = await Promise.all([
        subscriptionsService.getPlans(),
        subscriptionsService.getMyPayments(),
      ]);
      setSubscriptionPlans(plans);
      setPayments(paymentsData);
    } catch (err: any) {
      console.error('Erreur lors du chargement des abonnements:', err);
      setSubscriptionsError(err.message || 'Erreur lors du chargement des abonnements');
    } finally {
      setSubscriptionsLoading(false);
    }
  };

  const loadDetailedStatistics = async () => {
    try {
      setDetailedStatsLoading(true);
      setDetailedStatsError(null);
      const stats = await statisticsService.getDetailedStatistics();
      setDetailedStats(stats);
    } catch (err: any) {
      console.error('Erreur lors du chargement des statistiques détaillées:', err);
      setDetailedStatsError(err.message || 'Erreur lors du chargement des statistiques');
    } finally {
      setDetailedStatsLoading(false);
    }
  };

  const handleSearch = () => {
    if (activeTab === 'users') {
      loadUsers();
    } else if (activeTab === 'offres') {
      loadOffers();
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setEditFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      address: user.address,
      city: user.city,
      latitude: user.latitude,
      longitude: user.longitude,
      birthDate: user.birthDate,
      userType: user.userType,
      subscriptionType: user.subscriptionType,
      subscriptionDate: user.subscriptionDate,
      renewalDate: user.renewalDate,
      subscriptionAmount: user.subscriptionAmount,
      profession: user.profession ?? undefined,
      category: user.category ?? undefined,
      establishmentName: user.establishmentName ?? undefined,
      establishmentDescription: user.establishmentDescription ?? undefined,
      website: user.website ?? undefined,
      instagram: user.instagram ?? undefined,
      openingHours: user.openingHours ?? undefined,
      referralCode: user.referralCode,
      walletBalance: user.walletBalance,
      hasConnectedBefore: user.hasConnectedBefore,
    });
  };

  const handleEditOffer = (offer: Offer) => {
    setEditingOffer(offer);
    setEditOfferFormData({
      title: offer.title,
      description: offer.description,
      price: offer.price,
      startDate: offer.startDate,
      endDate: offer.endDate,
      imageUrl: offer.imageUrl,
      type: offer.type,
      status: offer.status,
      isFeatured: offer.isFeatured,
    });
  };

  const handleEditPlan = (plan: SubscriptionPlan) => {
    setEditingPlan(plan);
    setEditPlanFormData({
      title: plan.title,
      description: plan.description,
      price: plan.price,
      category: plan.category,
      duration: plan.duration,
      referralReward: plan.referralReward,
    });
  };

  const handleEditPayment = (payment: Payment) => {
    setEditingPayment(payment);
    setEditPaymentFormData({
      amount: payment.amount,
      paymentDate: payment.paymentDate,
      status: payment.status,
      stripePaymentIntentId: payment.stripePaymentIntentId,
    });
  };

  const handleCreatePlan = () => {
    setIsCreatingPlan(true);
    setEditingPlan(null);
    setEditPlanFormData({
      title: '',
      description: '',
      price: 0,
      category: 'INDIVIDUAL',
      duration: 'MONTHLY',
      referralReward: 0,
    });
  };

  const handleSavePlan = async () => {
    if (!editingPlan && !isCreatingPlan) return;
    
    try {
      setSaving(true);
      if (isCreatingPlan) {
        // Créer un nouveau plan
        await subscriptionsService.createPlan(editPlanFormData);
      } else if (editingPlan) {
        // Modifier un plan existant
        await subscriptionsService.updatePlan(editingPlan.id, editPlanFormData);
      }
      // Recharger la liste des plans
      await loadSubscriptions();
      setEditingPlan(null);
      setIsCreatingPlan(false);
      setEditPlanFormData({});
    } catch (err: any) {
      console.error('Erreur lors de la sauvegarde du plan:', err);
      alert(err.message || 'Erreur lors de la sauvegarde du plan');
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePlan = async (planId: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce plan d\'abonnement ?')) {
      return;
    }
    
    try {
      setSaving(true);
      await subscriptionsService.deletePlan(planId);
      // Recharger la liste des plans
      await loadSubscriptions();
    } catch (err: any) {
      console.error('Erreur lors de la suppression du plan:', err);
      alert(err.message || 'Erreur lors de la suppression du plan');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveUser = async () => {
    if (!editingUser) return;
    
    try {
      setSaving(true);
      await usersService.updateProfile(editFormData);
      // Recharger la liste des utilisateurs
      await loadUsers();
      setEditingUser(null);
      setEditFormData({});
    } catch (err: any) {
      console.error('Erreur lors de la sauvegarde:', err);
      alert(err.message || 'Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveOffer = async () => {
    if (!editingOffer) return;
    
    try {
      setSaving(true);
      // TODO: Implémenter la mise à jour de l'offre via l'API
      // await offersService.updateOffer(editingOffer.id, editOfferFormData);
      await loadOffers();
      setEditingOffer(null);
      setEditOfferFormData({});
    } catch (err: any) {
      console.error('Erreur lors de la sauvegarde de l\'offre:', err);
      setOffersError(err.message || 'Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('finalIsLoggedIn');
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    window.dispatchEvent(new Event('storage'));
    router.push('/');
  };

  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatDate = (year: number, month: number) => {
    const date = new Date(year, month - 1);
    return date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' });
  };

  const formatDateString = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const filteredUsers = users.filter(user => {
    // Filtre par type d'utilisateur
    if (userTypeFilter !== 'ALL' && user.userType !== userTypeFilter) {
      return false;
    }
    // Filtre par recherche textuelle
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      return (
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchLower) ||
        user.email?.toLowerCase().includes(searchLower) ||
        user.city?.toLowerCase().includes(searchLower) ||
        user.establishmentName?.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold text-gray-900">Backoffice AllinConnect</h1>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        {dashboardStats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Utilisateurs</p>
                  <p className="text-2xl font-bold text-gray-900">{dashboardStats.totalUsers}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {dashboardStats.activeUsers} actifs, {dashboardStats.totalUsers - dashboardStats.activeUsers} inactifs
                  </p>
                </div>
                <Users className="w-8 h-8 text-red-500" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Professionnels</p>
                  <p className="text-2xl font-bold text-gray-900">{dashboardStats.totalProfessionals}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {Object.keys(dashboardStats.professionalsByCategory).length} catégories
                  </p>
                </div>
                <Users className="w-8 h-8 text-red-500" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Offres</p>
                  <p className="text-2xl font-bold text-gray-900">{dashboardStats.totalOffers}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Total des offres disponibles
                  </p>
                </div>
                <Tag className="w-8 h-8 text-red-500" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Revenus (mois)</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(dashboardStats.currentMonthRevenue)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {dashboardStats.usersBySubscriptionType.PREMIUM} Premium, {dashboardStats.usersBySubscriptionType.FREE} Gratuits
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-red-500" />
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('statistiques')}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-medium transition-colors ${
                activeTab === 'statistiques'
                  ? 'text-red-600 border-b-2 border-red-600 bg-red-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <BarChart3 className="w-5 h-5" />
              Statistiques
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-medium transition-colors ${
                activeTab === 'users'
                  ? 'text-red-600 border-b-2 border-red-600 bg-red-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Users className="w-5 h-5" />
              Utilisateurs
            </button>
            <button
              onClick={() => setActiveTab('offres')}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-medium transition-colors ${
                activeTab === 'offres'
                  ? 'text-red-600 border-b-2 border-red-600 bg-red-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Tag className="w-5 h-5" />
              Offres
            </button>
            <button
              onClick={() => setActiveTab('prix')}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-medium transition-colors ${
                activeTab === 'prix'
                  ? 'text-red-600 border-b-2 border-red-600 bg-red-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <DollarSign className="w-5 h-5" />
              Prix
            </button>
            <button
              onClick={() => setActiveTab('cagnotte')}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-medium transition-colors ${
                activeTab === 'cagnotte'
                  ? 'text-red-600 border-b-2 border-red-600 bg-red-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Wallet className="w-5 h-5" />
              Cagnotte
            </button>
          </div>
        </div>

        {/* Search Bar - Only show for users and offres tabs */}
        {(activeTab === 'users' || activeTab === 'offres') && (
          <div className="mb-6 space-y-4">
            <div className="relative flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder={
                    activeTab === 'users' ? 'Rechercher par nom, email, ville...' :
                    activeTab === 'offres' ? 'Rechercher par titre, description...' :
                    'Rechercher...'
                  }
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                />
              </div>
              <button
                onClick={handleSearch}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Rechercher
              </button>
            </div>
            {/* Filtre par type d'utilisateur - Seulement pour l'onglet utilisateurs */}
            {activeTab === 'users' && (
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-gray-700">Filtrer par type :</label>
                <select
                  value={userTypeFilter}
                  onChange={(e) => setUserTypeFilter(e.target.value as 'ALL' | 'CLIENT' | 'PROFESSIONAL' | 'MEGA_ADMIN')}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                >
                  <option value="ALL">Tous les utilisateurs</option>
                  <option value="CLIENT">Clients</option>
                  <option value="PROFESSIONAL">Professionnels</option>
                  <option value="MEGA_ADMIN">Administrateurs</option>
                </select>
              </div>
            )}
          </div>
        )}

        {/* Statistiques Tab Content */}
        {activeTab === 'statistiques' && (
          <>
            {loading && !dashboardStats && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Chargement des statistiques...</p>
              </div>
            )}

            {error && !loading && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
                <p className="text-red-600">{error}</p>
                <button
                  onClick={loadDashboardData}
                  className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Réessayer
                </button>
              </div>
            )}

            {/* Nouveau Dashboard Stats */}
            {dashboardStats && (
              <div className="space-y-6 mb-8">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                    <BarChart3 className="w-6 h-6 text-red-500" />
                    Vue d'ensemble
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Utilisateurs par type d'abonnement */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-700 mb-4">Utilisateurs par type d'abonnement</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-700">Gratuit (FREE)</span>
                          <span className="text-xl font-bold text-gray-900">{dashboardStats.usersBySubscriptionType.FREE}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                          <span className="text-gray-700">Premium (PREMIUM)</span>
                          <span className="text-xl font-bold text-red-600">{dashboardStats.usersBySubscriptionType.PREMIUM}</span>
                        </div>
                      </div>
                    </div>
                    {/* Professionnels par catégorie */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-700 mb-4">Professionnels par catégorie</h3>
                      <div className="space-y-3 max-h-64 overflow-y-auto">
                        {Object.keys(dashboardStats.professionalsByCategory).length === 0 ? (
                          <p className="text-gray-500 text-sm">Aucune catégorie disponible</p>
                        ) : (
                          Object.entries(dashboardStats.professionalsByCategory).map(([category, count]) => (
                            <div key={category} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                              <span className="text-gray-700">{category.replace(/_/g, ' ')}</span>
                              <span className="text-xl font-bold text-gray-900">{count}</span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {detailedStatsLoading && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Chargement des statistiques détaillées...</p>
              </div>
            )}

            {detailedStatsError && !detailedStatsLoading && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
                <p className="text-red-600">{detailedStatsError}</p>
                <button
                  onClick={loadDetailedStatistics}
                  className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Réessayer
                </button>
              </div>
            )}

            {!detailedStatsLoading && !detailedStatsError && detailedStats && (
              <div className="space-y-6">
                {/* Statistiques Abonnements */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                    <DollarSign className="w-6 h-6 text-green-500" />
                    Statistiques Abonnements
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-700 mb-4">Par Type</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-700">Gratuit (FREE)</span>
                          <span className="text-xl font-bold text-gray-900">{detailedStats.subscriptions.byType.FREE}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                          <span className="text-gray-700">Premium (PREMIUM)</span>
                          <span className="text-xl font-bold text-red-600">{detailedStats.subscriptions.byType.PREMIUM}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-700 mb-4">Par Catégorie</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-700">Individuel</span>
                          <span className="text-xl font-bold text-gray-900">{detailedStats.subscriptions.byCategory.INDIVIDUAL}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-pink-50 rounded-lg">
                          <span className="text-gray-700">Famille</span>
                          <span className="text-xl font-bold text-pink-600">{detailedStats.subscriptions.byCategory.FAMILY}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                          <span className="text-gray-700">Professionnel</span>
                          <span className="text-xl font-bold text-purple-600">{detailedStats.subscriptions.byCategory.PROFESSIONAL}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Total abonnements actifs:</span>{' '}
                      <span className="text-lg font-bold text-green-600">
                        {detailedStats.subscriptions.totalActive}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Statistiques Offres */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                    <Tag className="w-6 h-6 text-yellow-500" />
                    Statistiques Offres
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600 mb-1">Total Offres</p>
                      <p className="text-3xl font-bold text-gray-900">{detailedStats.offers.total}</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600 mb-1">Offres Actives</p>
                      <p className="text-3xl font-bold text-green-600">{detailedStats.offers.active}</p>
                    </div>
                    <div className="bg-red-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600 mb-1">Offres Inactives</p>
                      <p className="text-3xl font-bold text-red-600">{detailedStats.offers.inactive}</p>
                    </div>
                    <div className="bg-red-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600 mb-1">Événements</p>
                      <p className="text-3xl font-bold text-red-600">{detailedStats.offers.byType.EVENEMENT}</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        <span className="font-semibold">Offres:</span> {detailedStats.offers.byType.OFFRE}
                      </span>
                      <span className="text-sm text-gray-600">
                        <span className="font-semibold">Événements:</span> {detailedStats.offers.byType.EVENEMENT}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Statistiques Revenus */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                    <DollarSign className="w-6 h-6 text-green-500" />
                    Statistiques Revenus
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-green-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600 mb-1">Revenus Totaux</p>
                      <p className="text-3xl font-bold text-green-600">{formatCurrency(detailedStats.revenue.total)}</p>
                    </div>
                    <div className="bg-red-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600 mb-1">Revenus du Mois</p>
                      <p className="text-3xl font-bold text-red-600">{formatCurrency(detailedStats.revenue.monthly)}</p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600 mb-1">Revenus des Pros</p>
                      <p className="text-3xl font-bold text-purple-600">{formatCurrency(detailedStats.revenue.fromProfessionals)}</p>
                    </div>
                  </div>
                </div>

                {/* Statistiques Cagnotte */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                    <Wallet className="w-6 h-6 text-purple-500" />
                    Statistiques Cagnotte
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-purple-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600 mb-1">Solde Total</p>
                      <p className="text-3xl font-bold text-purple-600">{formatCurrency(detailedStats.wallet.totalBalance)}</p>
                    </div>
                    <div className="bg-red-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600 mb-1">Total Transactions</p>
                      <p className="text-3xl font-bold text-red-600">{detailedStats.wallet.totalTransactions}</p>
                    </div>
                    <div className="bg-yellow-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600 mb-1">Demandes en Attente</p>
                      <p className="text-3xl font-bold text-yellow-600">{detailedStats.wallet.pendingRequests}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Users Tab Content */}
        {activeTab === 'users' && (
          <>
            {usersLoading && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Chargement des utilisateurs...</p>
              </div>
            )}

            {usersError && !usersLoading && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
                <p className="text-red-600">{usersError}</p>
                <button
                  onClick={loadUsers}
                  className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Réessayer
                </button>
              </div>
            )}

            {!usersLoading && !usersError && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Liste des utilisateurs ({filteredUsers.length})
                  </h2>
                </div>
                <div className="overflow-x-auto w-full">
                  <table className="w-full min-w-max">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prénom</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Adresse</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ville</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Latitude</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Longitude</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date naissance</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type utilisateur</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type abonnement</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date abonnement</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date renouvellement</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant abonnement</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profession</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catégorie</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom établissement</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description établissement</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Téléphone</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Site web</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Instagram</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Horaires</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code parrainage</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Solde cagnotte</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Déjà connecté</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredUsers.length === 0 ? (
                        <tr>
                          <td colSpan={25} className="px-6 py-8 text-center text-gray-500">
                            Aucun utilisateur trouvé
                          </td>
                        </tr>
                      ) : (
                        filteredUsers.map((user) => (
                          <tr 
                            key={user.id} 
                            className="hover:bg-gray-50 cursor-pointer"
                            onClick={() => handleEditUser(user)}
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.firstName}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.lastName}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.address || 'N/A'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.city || 'N/A'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.latitude ?? 'N/A'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.longitude ?? 'N/A'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDateString(user.birthDate)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.userType || 'N/A'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.subscriptionType || 'N/A'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDateString(user.subscriptionDate)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDateString(user.renewalDate)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.subscriptionAmount ? formatCurrency(user.subscriptionAmount) : 'N/A'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.profession || 'N/A'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.category || 'N/A'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.establishmentName || 'N/A'}</td>
                            <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">{user.establishmentDescription || 'N/A'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.phoneNumber || 'N/A'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.website || 'N/A'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.instagram || 'N/A'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.openingHours || 'N/A'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.referralCode || 'N/A'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.walletBalance ? formatCurrency(user.walletBalance) : 'N/A'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {user.hasConnectedBefore !== undefined ? (user.hasConnectedBefore ? 'Oui' : 'Non') : 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm" onClick={(e) => e.stopPropagation()}>
                              <button
                                onClick={() => handleEditUser(user)}
                                className="text-red-600 hover:text-red-900 flex items-center gap-1"
                              >
                                <Edit className="w-4 h-4" />
                                Modifier
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}

        {/* Offres Tab Content */}
        {activeTab === 'offres' && (
          <>
            {offersLoading && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Chargement des offres...</p>
              </div>
            )}

            {offersError && !offersLoading && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
                <p className="text-red-600">{offersError}</p>
                <button
                  onClick={loadOffers}
                  className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Réessayer
                </button>
              </div>
            )}

            {!offersLoading && !offersError && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Liste des offres ({offers.length})
                  </h2>
                </div>
                <div className="overflow-x-auto w-full">
                  <table className="w-full min-w-max">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titre</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prix</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date début</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date fin</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image URL</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">En vedette</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {offers.length === 0 ? (
                        <tr>
                          <td colSpan={10} className="px-6 py-8 text-center text-gray-500">
                            Aucune offre trouvée
                          </td>
                        </tr>
                      ) : (
                        offers
                          .filter(offer =>
                            offer.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            offer.description?.toLowerCase().includes(searchTerm.toLowerCase())
                          )
                          .map((offer) => (
                            <tr 
                              key={offer.id} 
                              className="hover:bg-gray-50 cursor-pointer"
                              onClick={() => handleEditOffer(offer)}
                            >
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{offer.id}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{offer.title}</td>
                              <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">{offer.description}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(offer.price)}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDateString(offer.startDate)}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDateString(offer.endDate)}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {offer.imageUrl ? (
                                  <a href={offer.imageUrl} target="_blank" rel="noopener noreferrer" className="text-red-600 hover:underline truncate max-w-xs block">
                                    {offer.imageUrl}
                                  </a>
                                ) : 'N/A'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                  offer.type === 'OFFRE' ? 'bg-red-100 text-red-800' :
                                  offer.type === 'EVENEMENT' ? 'bg-purple-100 text-purple-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {offer.type || 'N/A'}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                  offer.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                                  offer.status === 'INACTIVE' ? 'bg-red-100 text-red-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {offer.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {offer.isFeatured !== undefined ? (offer.isFeatured ? 'Oui' : 'Non') : 'N/A'}
                              </td>
                            </tr>
                          ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}

        {/* Cagnotte Tab Content */}
        {activeTab === 'cagnotte' && (
          <>
            {walletLoading && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Chargement de la cagnotte...</p>
              </div>
            )}

            {walletError && !walletLoading && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
                <p className="text-red-600">{walletError}</p>
                <button
                  onClick={loadWalletData}
                  className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Réessayer
                </button>
              </div>
            )}

            {!walletLoading && !walletError && (
              <div className="space-y-6">
                {/* Historique */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Historique de la cagnotte</h2>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilisateur</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {walletHistory.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                              Aucune transaction
                            </td>
                          </tr>
                        ) : (
                          walletHistory.map((transaction) => {
                            const isCredit = transaction.amount > 0;
                            return (
                              <tr key={transaction.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {transaction.user ? `${transaction.user.email} (ID: ${transaction.user.id})` : 'N/A'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                    isCredit ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                  }`}>
                                    {isCredit ? 'CREDIT' : 'DEBIT'}
                                  </span>
                                </td>
                                <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                                  isCredit ? 'text-green-600' : 'text-red-600'
                                }`}>
                                  {isCredit ? '+' : ''}{formatCurrency(Math.abs(transaction.amount))}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900">{transaction.description || 'N/A'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDateString(transaction.date)}</td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Demandes */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Demandes de cagnotte</h2>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilisateur</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Professionnels</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date création</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {walletRequests.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                              Aucune demande
                            </td>
                          </tr>
                        ) : (
                          walletRequests.map((request) => (
                            <tr key={request.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{request.id}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {request.user ? `${request.user.email} (ID: ${request.user.id})` : 'N/A'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {formatCurrency(request.totalAmount)}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-900">{request.professionals || 'N/A'}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                  request.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                                  request.status === 'APPROVED' ? 'bg-red-100 text-red-800' :
                                  request.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                                  'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {request.status === 'PENDING' ? 'EN ATTENTE' :
                                   request.status === 'APPROVED' ? 'APPROUVÉ' :
                                   request.status === 'REJECTED' ? 'REFUSÉ' :
                                   request.status === 'COMPLETED' ? 'TERMINÉ' : request.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDateString(request.createdAt)}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm" onClick={(e) => e.stopPropagation()}>
                                {request.status === 'PENDING' && (
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => handleUpdateRequestStatus(request.id, 'APPROVED')}
                                      disabled={saving}
                                      className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors disabled:opacity-50"
                                    >
                                      Approuver
                                    </button>
                                    <button
                                      onClick={() => handleUpdateRequestStatus(request.id, 'REJECTED')}
                                      disabled={saving}
                                      className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors disabled:opacity-50"
                                    >
                                      Refuser
                                    </button>
                                  </div>
                                )}
                                {request.status === 'APPROVED' && (
                                  <button
                                    onClick={() => handleUpdateRequestStatus(request.id, 'COMPLETED')}
                                    disabled={saving}
                                    className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors disabled:opacity-50"
                                  >
                                    Marquer terminé
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Prix Tab Content - Abonnements et Revenus */}
        {activeTab === 'prix' && (
          <>
            {subscriptionsLoading && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Chargement des abonnements...</p>
              </div>
            )}

            {subscriptionsError && !subscriptionsLoading && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
                <p className="text-red-600">{subscriptionsError}</p>
                <button
                  onClick={loadSubscriptions}
                  className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Réessayer
                </button>
              </div>
            )}

            {!subscriptionsLoading && !subscriptionsError && (
              <div className="space-y-6">
                {/* Plans d'abonnement */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-900">Plans d'abonnement disponibles</h2>
                    <button
                      onClick={handleCreatePlan}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Créer un plan
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prix</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durée</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {subscriptionPlans.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                              Aucun plan disponible
                            </td>
                          </tr>
                        ) : (
                          subscriptionPlans.map((plan) => (
                            <tr key={plan.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{plan.id}</td>
                              <td 
                                className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 cursor-pointer"
                                onClick={() => handleEditPlan(plan)}
                              >
                                {plan.title}
                              </td>
                              <td 
                                className="px-6 py-4 text-sm text-gray-900 cursor-pointer"
                                onClick={() => handleEditPlan(plan)}
                              >
                                {plan.description || 'N/A'}
                              </td>
                              <td 
                                className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 cursor-pointer"
                                onClick={() => handleEditPlan(plan)}
                              >
                                {formatCurrency(plan.price)}
                              </td>
                              <td 
                                className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 cursor-pointer"
                                onClick={() => handleEditPlan(plan)}
                              >
                                {plan.duration}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm" onClick={(e) => e.stopPropagation()}>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleEditPlan(plan)}
                                    className="text-red-600 hover:text-red-900 flex items-center gap-1"
                                  >
                                    <Edit className="w-4 h-4" />
                                    Modifier
                                  </button>
                                  <button
                                    onClick={() => handleDeletePlan(plan.id)}
                                    disabled={saving}
                                    className="text-red-600 hover:text-red-900 flex items-center gap-1 disabled:opacity-50"
                                  >
                                    <X className="w-4 h-4" />
                                    Supprimer
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Paiements */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Historique des paiements</h2>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date paiement</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Période</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {payments.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                              Aucun paiement
                            </td>
                          </tr>
                        ) : (
                          payments.map((payment) => (
                            <tr key={payment.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleEditPayment(payment)}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.id}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">N/A</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{formatCurrency(payment.amount)}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                  payment.status === 'SUCCEEDED' ? 'bg-green-100 text-green-800' :
                                  payment.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                  payment.status === 'FAILED' ? 'bg-red-100 text-red-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {payment.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDateString(payment.paymentDate)}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                N/A
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Historique des revenus */}
                {!loading && !error && dashboardData.history.length > 0 && (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-4 border-b border-gray-200">
                      <h2 className="text-lg font-semibold text-gray-900">Historique des revenus par mois</h2>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Période</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenus</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilisateurs actifs</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total utilisateurs</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {dashboardData.history.map((stat) => (
                            <tr key={`${stat.year}-${stat.month}`} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {formatDate(stat.year, stat.month)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {stat.revenue ? formatCurrency(stat.revenue) : 'N/A'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {stat.users?.activeUsers ?? stat.users?.active ?? 0}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {stat.users?.totalUsers ?? stat.users?.total ?? 0}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {stat.frozen ? (
                                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                                    Figé
                                  </span>
                                ) : (
                                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                                    Actif
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* Edit User Modal */}
        {editingUser && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="bg-red-600 text-white px-6 py-4 flex items-center justify-between rounded-t-lg">
                <h2 className="text-lg font-semibold">Modifier l'utilisateur</h2>
                <button
                  onClick={() => {
                    setEditingUser(null);
                    setEditFormData({});
                  }}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={editFormData.email || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Prénom</label>
                    <input
                      type="text"
                      value={editFormData.firstName || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, firstName: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
                    <input
                      type="text"
                      value={editFormData.lastName || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, lastName: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                    <input
                      type="tel"
                      value={editFormData.phoneNumber || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, phoneNumber: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Adresse</label>
                  <input
                    type="text"
                    value={editFormData.address || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ville</label>
                    <input
                      type="text"
                      value={editFormData.city || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, city: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Latitude</label>
                    <input
                      type="number"
                      step="any"
                      value={editFormData.latitude ?? ''}
                      onChange={(e) => setEditFormData({ ...editFormData, latitude: e.target.value ? parseFloat(e.target.value) : undefined })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Longitude</label>
                    <input
                      type="number"
                      step="any"
                      value={editFormData.longitude ?? ''}
                      onChange={(e) => setEditFormData({ ...editFormData, longitude: e.target.value ? parseFloat(e.target.value) : undefined })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date de naissance</label>
                  <input
                    type="date"
                    value={editFormData.birthDate ? new Date(editFormData.birthDate).toISOString().split('T')[0] : ''}
                    onChange={(e) => setEditFormData({ ...editFormData, birthDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type utilisateur</label>
                    <select
                      value={editFormData.userType || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, userType: e.target.value as any })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                    >
                      <option value="CLIENT">Client</option>
                      <option value="PROFESSIONAL">Professionnel</option>
                      <option value="MEGA_ADMIN">Mega Admin</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type abonnement</label>
                    <select
                      value={editFormData.subscriptionType || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, subscriptionType: e.target.value as any })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                    >
                      <option value="FREE">Gratuit</option>
                      <option value="PREMIUM">Premium</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date abonnement</label>
                    <input
                      type="datetime-local"
                      value={editFormData.subscriptionDate ? new Date(editFormData.subscriptionDate).toISOString().slice(0, 16) : ''}
                      onChange={(e) => setEditFormData({ ...editFormData, subscriptionDate: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date renouvellement</label>
                    <input
                      type="datetime-local"
                      value={editFormData.renewalDate ? new Date(editFormData.renewalDate).toISOString().slice(0, 16) : ''}
                      onChange={(e) => setEditFormData({ ...editFormData, renewalDate: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Montant abonnement</label>
                    <input
                      type="number"
                      step="0.01"
                      value={editFormData.subscriptionAmount ?? ''}
                      onChange={(e) => setEditFormData({ ...editFormData, subscriptionAmount: e.target.value ? parseFloat(e.target.value) : undefined })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Profession</label>
                    <input
                      type="text"
                      value={editFormData.profession || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, profession: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
                    <input
                      type="text"
                      value={editFormData.category || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nom établissement</label>
                  <input
                    type="text"
                    value={editFormData.establishmentName || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, establishmentName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description établissement</label>
                  <textarea
                    value={editFormData.establishmentDescription || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, establishmentDescription: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Site web</label>
                    <input
                      type="url"
                      value={editFormData.website || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, website: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Instagram</label>
                    <input
                      type="text"
                      value={editFormData.instagram || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, instagram: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Horaires</label>
                  <input
                    type="text"
                    value={editFormData.openingHours || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, openingHours: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Code parrainage</label>
                    <input
                      type="text"
                      value={editFormData.referralCode || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, referralCode: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Solde cagnotte</label>
                    <input
                      type="number"
                      step="0.01"
                      value={editFormData.walletBalance ?? ''}
                      onChange={(e) => setEditFormData({ ...editFormData, walletBalance: e.target.value ? parseFloat(e.target.value) : undefined })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={editFormData.hasConnectedBefore || false}
                      onChange={(e) => setEditFormData({ ...editFormData, hasConnectedBefore: e.target.checked })}
                      className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Déjà connecté</span>
                  </label>
                </div>
                <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setEditingUser(null);
                      setEditFormData({});
                    }}
                    className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleSaveUser}
                    disabled={saving}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? 'Enregistrement...' : 'Enregistrer'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Offer Modal */}
        {editingOffer && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="bg-red-600 text-white px-6 py-4 flex items-center justify-between rounded-t-lg">
                <h2 className="text-lg font-semibold">Modifier l'offre</h2>
                <button
                  onClick={() => {
                    setEditingOffer(null);
                    setEditOfferFormData({});
                  }}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Titre</label>
                  <input
                    type="text"
                    value={editOfferFormData.title || ''}
                    onChange={(e) => setEditOfferFormData({ ...editOfferFormData, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={editOfferFormData.description || ''}
                    onChange={(e) => setEditOfferFormData({ ...editOfferFormData, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Prix</label>
                    <input
                      type="number"
                      step="0.01"
                      value={editOfferFormData.price || 0}
                      onChange={(e) => setEditOfferFormData({ ...editOfferFormData, price: parseFloat(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                    <select
                      value={editOfferFormData.type || 'OFFRE'}
                      onChange={(e) => setEditOfferFormData({ ...editOfferFormData, type: e.target.value as any })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                    >
                      <option value="OFFRE">Offre</option>
                      <option value="EVENEMENT">Événement</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date début</label>
                    <input
                      type="datetime-local"
                      value={editOfferFormData.startDate ? new Date(editOfferFormData.startDate).toISOString().slice(0, 16) : ''}
                      onChange={(e) => setEditOfferFormData({ ...editOfferFormData, startDate: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date fin</label>
                    <input
                      type="datetime-local"
                      value={editOfferFormData.endDate ? new Date(editOfferFormData.endDate).toISOString().slice(0, 16) : ''}
                      onChange={(e) => setEditOfferFormData({ ...editOfferFormData, endDate: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">URL Image</label>
                  <input
                    type="url"
                    value={editOfferFormData.imageUrl || ''}
                    onChange={(e) => setEditOfferFormData({ ...editOfferFormData, imageUrl: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
                    <select
                      value={editOfferFormData.status || 'ACTIVE'}
                      onChange={(e) => setEditOfferFormData({ ...editOfferFormData, status: e.target.value as any })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                    >
                      <option value="ACTIVE">Actif</option>
                      <option value="INACTIVE">Inactif</option>
                      <option value="DRAFT">Brouillon</option>
                    </select>
                  </div>
                  <div className="flex items-center pt-8">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={editOfferFormData.isFeatured || false}
                        onChange={(e) => setEditOfferFormData({ ...editOfferFormData, isFeatured: e.target.checked })}
                        className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">En vedette</span>
                    </label>
                  </div>
                </div>
                <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setEditingOffer(null);
                      setEditOfferFormData({});
                    }}
                    className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleSaveOffer}
                    disabled={saving}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? 'Enregistrement...' : 'Enregistrer'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Plan Modal */}
        {(editingPlan || isCreatingPlan) && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="bg-red-600 text-white px-6 py-4 flex items-center justify-between rounded-t-lg">
                <h2 className="text-lg font-semibold">
                  {isCreatingPlan ? 'Créer un nouveau plan' : 'Modifier le plan'}
                </h2>
                <button
                  onClick={() => {
                    setEditingPlan(null);
                    setIsCreatingPlan(false);
                    setEditPlanFormData({});
                  }}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                {!isCreatingPlan && editingPlan && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ID</label>
                    <input
                      type="text"
                      value={editingPlan.id}
                      disabled
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Titre</label>
                  <input
                    type="text"
                    value={editPlanFormData.title || ''}
                    onChange={(e) => setEditPlanFormData({ ...editPlanFormData, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={editPlanFormData.description || ''}
                    onChange={(e) => setEditPlanFormData({ ...editPlanFormData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Prix</label>
                    <input
                      type="number"
                      step="0.01"
                    value={editPlanFormData.price ?? 0}
                    onChange={(e) => setEditPlanFormData({ ...editPlanFormData, price: parseFloat(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
                    <select
                    value={editPlanFormData.category || 'INDIVIDUAL'}
                    onChange={(e) => setEditPlanFormData({ ...editPlanFormData, category: e.target.value as any })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                    >
                      <option value="INDIVIDUAL">Individuel</option>
                      <option value="FAMILY">Famille</option>
                      <option value="PROFESSIONAL">Professionnel</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Durée</label>
                    <select
                    value={editPlanFormData.duration || 'MONTHLY'}
                    onChange={(e) => setEditPlanFormData({ ...editPlanFormData, duration: e.target.value as any })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                    >
                      <option value="MONTHLY">Mensuel</option>
                      <option value="ANNUAL">Annuel</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Récompense parrainage</label>
                    <input
                      type="number"
                      step="0.01"
                    value={editPlanFormData.referralReward ?? 0}
                    onChange={(e) => setEditPlanFormData({ ...editPlanFormData, referralReward: parseFloat(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setEditingPlan(null);
                      setIsCreatingPlan(false);
                      setEditPlanFormData({});
                    }}
                    className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleSavePlan}
                    disabled={saving}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? 'Enregistrement...' : 'Enregistrer'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Payment Modal */}
        {editingPayment && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="bg-red-600 text-white px-6 py-4 flex items-center justify-between rounded-t-lg">
                <h2 className="text-lg font-semibold">Modifier le paiement</h2>
                <button
                  onClick={() => setEditingPayment(null)}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ID</label>
                  <input
                    type="text"
                    value={editingPayment.id}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Montant</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editPaymentFormData.amount ?? 0}
                    onChange={(e) => setEditPaymentFormData({ ...editPaymentFormData, amount: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date paiement</label>
                  <input
                    type="datetime-local"
                    value={editPaymentFormData.paymentDate ? new Date(editPaymentFormData.paymentDate).toISOString().slice(0, 16) : ''}
                    onChange={(e) => setEditPaymentFormData({ ...editPaymentFormData, paymentDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
                  <select
                    value={editPaymentFormData.status || 'PENDING'}
                    onChange={(e) => setEditPaymentFormData({ ...editPaymentFormData, status: e.target.value as any })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                  >
                    <option value="PENDING">En attente</option>
                    <option value="SUCCEEDED">Réussi</option>
                    <option value="FAILED">Échoué</option>
                    <option value="CANCELLED">Annulé</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Stripe Payment Intent ID</label>
                  <input
                    type="text"
                    value={editingPayment.stripePaymentIntentId || ''}
                    onChange={(e) => setEditingPayment({ ...editingPayment, stripePaymentIntentId: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                  />
                </div>
                <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setEditingPayment(null)}
                    className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={() => {
                      // TODO: Implémenter la sauvegarde du paiement
                      setEditingPayment(null);
                    }}
                    disabled={saving}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? 'Enregistrement...' : 'Enregistrer'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
