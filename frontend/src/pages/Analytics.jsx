import React, { useState, useEffect } from 'react';
import { BarChart3, PieChart, TrendingUp, Target, DollarSign, CreditCard, AlertCircle, CheckCircle } from 'lucide-react';
import { analyticsAPI } from '../utils/api';

const Analytics = () => {
  const [analytics, setAnalytics] = useState({});
  const [dashboardStats, setDashboardStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const [analyticsData, dashboardData] = await Promise.all([
        analyticsAPI.getData(),
        analyticsAPI.getDashboard()
      ]);
      setAnalytics(analyticsData.data);
      setDashboardStats(dashboardData.data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderChart = (data, title, icon) => {
    const Icon = icon;
    const entries = Object.entries(data);
    const maxValue = Math.max(...entries.map(([, value]) => value));

    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          <Icon className="h-6 w-6 text-indigo-500" />
        </div>
        <div className="space-y-4">
          {entries.map(([key, value]) => (
            <div key={key} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700 capitalize">{key}</span>
                <span className="text-sm font-semibold text-gray-900">{value}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(value / maxValue) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics & Reports</h1>
        <p className="text-gray-600 mt-2">Analyze your business performance and trends</p>
      </div>

      {/* Financial Overview */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Financial Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto mb-3">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <p className="text-sm font-medium text-gray-600">Total Revenue</p>
            <p className="text-2xl font-bold text-green-600">₹{(dashboardStats.totalRevenue || 0).toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">{dashboardStats.revenueGrowth || '0%'} from last month</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-3">
              <CreditCard className="h-6 w-6 text-red-600" />
            </div>
            <p className="text-sm font-medium text-gray-600">Total Expenses</p>
            <p className="text-2xl font-bold text-red-600">₹{(dashboardStats.totalExpenseAmount || 0).toLocaleString()}</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mx-auto mb-3">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
            <p className="text-sm font-medium text-gray-600">Net Profit</p>
            <p className="text-2xl font-bold text-blue-600">
              ₹{((dashboardStats.totalRevenue || 0) - (dashboardStats.totalExpenseAmount || 0)).toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {dashboardStats.totalRevenue > 0 ? (((dashboardStats.totalRevenue - dashboardStats.totalExpenseAmount) / dashboardStats.totalRevenue) * 100).toFixed(1) : 0}% margin
            </p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-full mx-auto mb-3">
              <AlertCircle className="h-6 w-6 text-yellow-600" />
            </div>
            <p className="text-sm font-medium text-gray-600">Pending Payments</p>
            <p className="text-2xl font-bold text-yellow-600">₹{(dashboardStats.pendingPayments || 0).toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Key Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Clients</p>
              <p className="text-2xl font-bold text-green-600">{dashboardStats.totalClients || 0}</p>
              <p className="text-xs text-gray-500 mt-1">{dashboardStats.clientsGrowth || '0%'} growth</p>
            </div>
            <Target className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Developers</p>
              <p className="text-2xl font-bold text-blue-600">{dashboardStats.totalDevelopers || 0}</p>
              <p className="text-xs text-gray-500 mt-1">Development team</p>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Clients</p>
              <p className="text-2xl font-bold text-purple-600">{dashboardStats.activeClients || 0}</p>
              <p className="text-xs text-gray-500 mt-1">{dashboardStats.clientsGrowth || '0%'} growth</p>
            </div>
            <CheckCircle className="h-8 w-8 text-purple-500" />
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Contract Value</p>
              <p className="text-2xl font-bold text-orange-600">₹{(dashboardStats.totalContracts || 0).toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-1">Total contracts</p>
            </div>
            <PieChart className="h-8 w-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Business Health Indicators */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Business Health</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-600 mb-2">Revenue vs Expenses</p>
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-green-600 bg-green-200">
                    Revenue
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-green-600">
                    ₹{(dashboardStats.totalRevenue || 0).toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-green-200">
                <div style={{ width: "100%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"></div>
              </div>
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-red-600 bg-red-200">
                    Expenses
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-red-600">
                    ₹{(dashboardStats.totalExpenseAmount || 0).toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-red-200">
                <div 
                  style={{ width: `${dashboardStats.totalRevenue > 0 ? (dashboardStats.totalExpenseAmount / dashboardStats.totalRevenue) * 100 : 0}%` }} 
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-500"
                ></div>
              </div>
            </div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-600 mb-2">Project Status</p>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-xs text-gray-600">Active</span>
                <span className="text-xs font-semibold">{dashboardStats.activeProjects || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-600">Completed</span>
                <span className="text-xs font-semibold">{dashboardStats.completedProjects || 0}</span>
              </div>
              <div className="flex justify-between font-semibold border-t pt-2">
                <span className="text-xs">Total</span>
                <span className="text-xs">{(dashboardStats.activeProjects || 0) + (dashboardStats.completedProjects || 0)}</span>
              </div>
            </div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-600 mb-2">Expense Status</p>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-xs text-gray-600">Pending</span>
                <span className="text-xs font-semibold">{dashboardStats.pendingExpenses || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-600">Approved</span>
                <span className="text-xs font-semibold">{dashboardStats.approvedExpenses || 0}</span>
              </div>
              <div className="flex justify-between font-semibold border-t pt-2">
                <span className="text-xs">Total</span>
                <span className="text-xs">{(dashboardStats.pendingExpenses || 0) + (dashboardStats.approvedExpenses || 0)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">Loading analytics...</div>
      ) : (
        <>
          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {renderChart(analytics.leadsBySource || {}, 'Leads by Source', BarChart3)}
            {renderChart(analytics.leadsByStatus || {}, 'Leads by Status', PieChart)}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {renderChart(analytics.clientsByIndustry || {}, 'Clients by Industry', TrendingUp)}
            {renderChart(analytics.expensesByCategory || {}, 'Expenses by Category', BarChart3)}
          </div>

          {/* Financial Trends */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Revenue Chart */}
            {analytics.monthlyRevenue && analytics.monthlyRevenue.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">Monthly Revenue Trend</h3>
                  <TrendingUp className="h-6 w-6 text-indigo-500" />
                </div>
                <div className="space-y-4">
                  {analytics.monthlyRevenue.map((item, index) => {
                    const maxRevenue = Math.max(...analytics.monthlyRevenue.map(m => m.revenue));
                    return (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-700">{item.month}</span>
                          <span className="text-sm font-semibold text-gray-900">₹{item.revenue.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${maxRevenue > 0 ? (item.revenue / maxRevenue) * 100 : 0}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            
            {/* Profit Margin Analysis */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Profit Analysis</h3>
                <DollarSign className="h-6 w-6 text-green-500" />
              </div>
              <div className="space-y-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-600">
                    {dashboardStats.totalRevenue > 0 ? (((dashboardStats.totalRevenue - dashboardStats.totalExpenseAmount) / dashboardStats.totalRevenue) * 100).toFixed(1) : 0}%
                  </p>
                  <p className="text-sm text-gray-600">Profit Margin</p>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="text-sm font-medium text-green-700">Gross Revenue</span>
                    <span className="text-sm font-bold text-green-700">₹{(dashboardStats.totalRevenue || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                    <span className="text-sm font-medium text-red-700">Total Expenses</span>
                    <span className="text-sm font-bold text-red-700">-₹{(dashboardStats.totalExpenseAmount || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border-t-2 border-blue-200">
                    <span className="text-sm font-bold text-blue-700">Net Profit</span>
                    <span className="text-sm font-bold text-blue-700">₹{((dashboardStats.totalRevenue || 0) - (dashboardStats.totalExpenseAmount || 0)).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          
        </>
      )}
    </div>
  );
};

export default Analytics;