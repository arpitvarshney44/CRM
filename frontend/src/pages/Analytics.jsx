import React, { useState, useEffect } from 'react';
import { BarChart3, PieChart, TrendingUp, Target } from 'lucide-react';
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

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
              <p className="text-2xl font-bold text-green-600">
                {dashboardStats.totalLeads > 0 ? ((dashboardStats.qualifiedLeads / dashboardStats.totalLeads) * 100).toFixed(1) : 0}%
              </p>
            </div>
            <Target className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Pipeline Value</p>
              <p className="text-2xl font-bold text-blue-600">
                ${dashboardStats.totalLeads > 0 ? Math.round(dashboardStats.pipelineValue / dashboardStats.totalLeads).toLocaleString() : 0}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Expenses</p>
              <p className="text-2xl font-bold text-purple-600">${(dashboardStats.totalExpenseAmount || 0).toLocaleString()}</p>
            </div>
            <BarChart3 className="h-8 w-8 text-purple-500" />
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Probability</p>
              <p className="text-2xl font-bold text-orange-600">{(dashboardStats.avgProbability || 0).toFixed(1)}%</p>
            </div>
            <PieChart className="h-8 w-8 text-orange-500" />
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
                        <span className="text-sm font-semibold text-gray-900">${item.revenue.toLocaleString()}</span>
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
        </>
      )}
    </div>
  );
};

export default Analytics;