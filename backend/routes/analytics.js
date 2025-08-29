const express = require('express');
const Lead = require('../models/Lead');
const Client = require('../models/Client');
const Expense = require('../models/Expense');
const Development = require('../models/Development');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get dashboard stats
router.get('/dashboard', auth, async (req, res) => {
  try {
    const [leads, clients, expenses, projects] = await Promise.all([
      Lead.find(),
      Client.find(),
      Expense.find(),
      Development.find()
    ]);

    // Calculate date ranges
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    // Current month data
    const currentLeads = leads.filter(lead => new Date(lead.createdAt) >= currentMonthStart);
    const currentClients = clients.filter(client => new Date(client.createdAt) >= currentMonthStart);
    const currentRevenue = currentClients.reduce((sum, client) => sum + (client.paymentReceived || 0), 0);
    const currentProjects = projects.filter(proj => new Date(proj.createdAt) >= currentMonthStart);
    const currentExpenses = expenses.filter(exp => new Date(exp.createdAt) >= currentMonthStart);
    const currentExpenseAmount = currentExpenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);

    // Last month data
    const lastMonthLeads = leads.filter(lead => {
      const date = new Date(lead.createdAt);
      return date >= lastMonthStart && date <= lastMonthEnd;
    });
    const lastMonthClients = clients.filter(client => {
      const date = new Date(client.createdAt);
      return date >= lastMonthStart && date <= lastMonthEnd;
    });
    const lastMonthRevenue = lastMonthClients.reduce((sum, client) => sum + (client.paymentReceived || 0), 0);
    const lastMonthProjects = projects.filter(proj => {
      const date = new Date(proj.createdAt);
      return date >= lastMonthStart && date <= lastMonthEnd;
    });
    const lastMonthExpenses = expenses.filter(exp => {
      const date = new Date(exp.createdAt);
      return date >= lastMonthStart && date <= lastMonthEnd;
    });
    const lastMonthExpenseAmount = lastMonthExpenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);

    // Calculate growth rates
    const calculateGrowth = (current, previous) => {
      if (previous === 0) return current > 0 ? '+100%' : '0%';
      const growth = ((current - previous) / previous) * 100;
      return `${growth >= 0 ? '+' : ''}${growth.toFixed(1)}%`;
    };

    const stats = {
      totalLeads: leads.length,
      qualifiedLeads: leads.filter(lead => lead.status === 'qualified').length,
      convertedLeads: leads.filter(lead => lead.status === 'converted').length,
      totalClients: clients.length,
      activeClients: clients.filter(client => client.status === 'active').length,
      totalRevenue: clients.reduce((sum, client) => sum + (client.paymentReceived || 0), 0),
      pendingPayments: clients.reduce((sum, client) => sum + (client.paymentPending || 0), 0),
      totalContracts: clients.reduce((sum, client) => sum + (client.contractValue || 0), 0),
      pendingExpenses: expenses.filter(exp => exp.status === 'pending').length,
      approvedExpenses: expenses.filter(exp => exp.status === 'approved').length,
      totalExpenseAmount: expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0),
      totalDevelopers: projects.length,
      // Growth rates
      leadsGrowth: calculateGrowth(currentLeads.length, lastMonthLeads.length),
      clientsGrowth: calculateGrowth(currentClients.length, lastMonthClients.length),
      revenueGrowth: calculateGrowth(currentRevenue, lastMonthRevenue),
      expenseGrowth: calculateGrowth(currentExpenseAmount, lastMonthExpenseAmount)
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get analytics data
router.get('/data', auth, async (req, res) => {
  try {
    const [leads, clients, expenses] = await Promise.all([
      Lead.find(),
      Client.find(),
      Expense.find()
    ]);

    // Leads by source
    const leadsBySource = leads.reduce((acc, lead) => {
      acc[lead.source] = (acc[lead.source] || 0) + 1;
      return acc;
    }, {});

    // Leads by status
    const leadsByStatus = leads.reduce((acc, lead) => {
      acc[lead.status] = (acc[lead.status] || 0) + 1;
      return acc;
    }, {});

    // Clients by industry
    const clientsByIndustry = clients.reduce((acc, client) => {
      const industry = client.industry || 'Other';
      acc[industry] = (acc[industry] || 0) + 1;
      return acc;
    }, {});

    // Expenses by category
    const expensesByCategory = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {});

    // Monthly revenue (last 6 months)
    const monthlyRevenue = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const nextMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      
      const monthlyClients = clients.filter(client => {
        const createdAt = new Date(client.createdAt);
        return createdAt >= month && createdAt < nextMonth;
      });
      
      const revenue = monthlyClients.reduce((sum, client) => sum + (client.paymentReceived || 0), 0);
      monthlyRevenue.push({
        month: month.toLocaleDateString('en-US', { month: 'short' }),
        revenue
      });
    }

    res.json({
      leadsBySource,
      leadsByStatus,
      clientsByIndustry,
      expensesByCategory,
      monthlyRevenue
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;