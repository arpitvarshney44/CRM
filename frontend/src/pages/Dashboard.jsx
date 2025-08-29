import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, DollarSign, Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { analyticsAPI } from '../utils/api';

const Dashboard = () => {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await analyticsAPI.getDashboard();
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { title: 'Total Leads', value: stats.totalLeads || 0, icon: Users, color: 'bg-blue-500', change: stats.leadsGrowth || '0%' },
    { title: 'Active Clients', value: stats.activeClients || 0, icon: TrendingUp, color: 'bg-green-500', change: stats.clientsGrowth || '0%' },
    { title: 'Revenue', value: `₹${(stats.totalRevenue || 0).toLocaleString()}`, icon: DollarSign, color: 'bg-purple-500', change: stats.revenueGrowth || '0%' },
    { title: 'Total Expenses', value: `₹${(stats.totalExpenseAmount || 0).toLocaleString()}`, icon: Calendar, color: 'bg-orange-500', change: stats.expenseGrowth || '0%' }
  ];

  if (loading) return <div className="flex justify-center py-8">Loading dashboard...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-2">Monitor your business performance and key metrics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          const isPositive = card.change.startsWith('+');
          return (
            <div key={card.title} className="bg-white rounded-2xl p-4 md:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 card-hover">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className="text-2xl md:text-3xl font-bold text-gray-900 mt-2">{card.value}</p>
                  <div className="flex items-center mt-2">
                    {isPositive ? (
                      <ArrowUpRight className="h-4 w-4 text-green-500" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 text-red-500" />
                    )}
                    <span className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                      {card.change}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">vs last month</span>
                  </div>
                </div>
                <div className={`${card.color} p-3 rounded-xl`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Lead Overview */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-4 md:p-6 shadow-lg border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Lead Overview</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-xl">
              <p className="text-sm text-blue-600 font-medium">Total Leads</p>
              <p className="text-2xl font-bold text-blue-900">{stats.totalLeads || 0}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-xl">
              <p className="text-sm text-green-600 font-medium">Qualified Leads</p>
              <p className="text-2xl font-bold text-green-900">{stats.qualifiedLeads || 0}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-xl">
              <p className="text-sm text-purple-600 font-medium">Converted Leads</p>
              <p className="text-2xl font-bold text-purple-900">{stats.convertedLeads || 0}</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-xl">
              <p className="text-sm text-orange-600 font-medium">Pending Payments</p>
              <p className="text-2xl font-bold text-orange-900">₹{(stats.pendingPayments || 0).toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Financial Overview */}
        <div className="bg-white rounded-2xl p-4 md:p-6 shadow-lg border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Financial Overview</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Contracts</span>
              <span className="text-lg font-semibold text-gray-900">₹{(stats.totalContracts || 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Revenue Received</span>
              <span className="text-lg font-semibold text-green-600">₹{(stats.totalRevenue || 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Pending Expenses</span>
              <span className="text-lg font-semibold text-orange-600">{stats.pendingExpenses || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Developers</span>
              <span className="text-lg font-semibold text-blue-600">{stats.totalDevelopers || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;