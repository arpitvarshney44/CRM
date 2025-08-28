import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, DollarSign, Clock, User, CreditCard } from 'lucide-react';
import { developmentAPI, clientsAPI } from '../utils/api';
import toast from 'react-hot-toast';

const Development = () => {
  const [developers, setDevelopers] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingDeveloper, setEditingDeveloper] = useState(null);
  const [formData, setFormData] = useState({
    developerName: '', email: '', phone: '', projectName: '', client: '',
    totalAmount: '', paidAmount: '', hourlyRate: '', hoursWorked: '',
    startDate: '', endDate: '', paymentMethod: 'bank-transfer',
    lastPaymentDate: '', nextPaymentDue: '', notes: '',
    bankDetails: { accountNumber: '', bankName: '', ifscCode: '' }
  });

  useEffect(() => {
    fetchDevelopers();
    fetchClients();
  }, []);

  const fetchDevelopers = async () => {
    try {
      const response = await developmentAPI.getAll();
      setDevelopers(response.data);
    } catch (error) {
      toast.error('Failed to fetch developers');
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      const response = await clientsAPI.getAll();
      setClients(response.data);
    } catch (error) {
      toast.error('Failed to fetch clients');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingDeveloper) {
        await developmentAPI.update(editingDeveloper._id, formData);
        toast.success('Developer record updated successfully');
      } else {
        await developmentAPI.create(formData);
        toast.success('Developer record created successfully');
      }
      setShowModal(false);
      setEditingDeveloper(null);
      resetForm();
      fetchDevelopers();
    } catch (error) {
      toast.error('Operation failed');
    }
  };

  const resetForm = () => {
    setFormData({
      developerName: '', email: '', phone: '', projectName: '', client: '',
      totalAmount: '', paidAmount: '', hourlyRate: '', hoursWorked: '',
      startDate: '', endDate: '', paymentMethod: 'bank-transfer',
      lastPaymentDate: '', nextPaymentDue: '', notes: '',
      bankDetails: { accountNumber: '', bankName: '', ifscCode: '' }
    });
  };

  const handleEdit = (developer) => {
    setEditingDeveloper(developer);
    setFormData({
      developerName: developer.developerName,
      email: developer.email,
      phone: developer.phone || '',
      projectName: developer.projectName,
      client: developer.client._id,
      totalAmount: developer.totalAmount || '',
      paidAmount: developer.paidAmount || '',
      hourlyRate: developer.hourlyRate || '',
      hoursWorked: developer.hoursWorked || '',
      startDate: developer.startDate ? new Date(developer.startDate).toISOString().split('T')[0] : '',
      endDate: developer.endDate ? new Date(developer.endDate).toISOString().split('T')[0] : '',
      paymentMethod: developer.paymentMethod || 'bank-transfer',
      lastPaymentDate: developer.lastPaymentDate ? new Date(developer.lastPaymentDate).toISOString().split('T')[0] : '',
      nextPaymentDue: developer.nextPaymentDue ? new Date(developer.nextPaymentDue).toISOString().split('T')[0] : '',
      notes: developer.notes || '',
      bankDetails: developer.bankDetails || { accountNumber: '', bankName: '', ifscCode: '' }
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this developer record?')) {
      try {
        await developmentAPI.delete(id);
        toast.success('Developer record deleted successfully');
        fetchDevelopers();
      } catch (error) {
        toast.error('Failed to delete developer record');
      }
    }
  };

  const paymentStatusColors = {
    pending: 'bg-red-100 text-red-800',
    partial: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800'
  };

  // Calculate totals
  const totalAmount = developers.reduce((sum, dev) => sum + (dev.totalAmount || 0), 0);
  const totalPaid = developers.reduce((sum, dev) => sum + (dev.paidAmount || 0), 0);
  const totalPending = developers.reduce((sum, dev) => sum + (dev.pendingAmount || 0), 0);

  if (loading) return <div className="flex justify-center py-8">Loading...</div>;

  return (
    <div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <User className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Developers</dt>
                  <dd className="text-lg font-medium text-gray-900">{developers.length}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Amount</dt>
                  <dd className="text-lg font-medium text-gray-900">${totalAmount.toLocaleString()}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CreditCard className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Amount Paid</dt>
                  <dd className="text-lg font-medium text-green-600">${totalPaid.toLocaleString()}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-6 w-6 text-red-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Pending Amount</dt>
                  <dd className="text-lg font-medium text-red-600">${totalPending.toLocaleString()}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Developer Payment Records</h1>
          <p className="mt-2 text-sm text-gray-700">Track developer payments and project costs</p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Developer
          </button>
        </div>
      </div>

      <div className="mt-8 overflow-x-auto shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Developer</th>
              <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Project</th>
              <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Payment Details</th>
              <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Status</th>
              <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Next Payment</th>
              <th className="relative px-4 md:px-6 py-3 whitespace-nowrap"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {developers.map((developer) => (
              <tr key={developer._id}>
                <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{developer.developerName}</div>
                  <div className="text-sm text-gray-500">{developer.email}</div>
                  <div className="text-xs text-gray-400">{developer.phone}</div>
                </td>
                <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{developer.projectName}</div>
                  <div className="text-sm text-gray-500">{developer.client?.company}</div>
                  {developer.hourlyRate && (
                    <div className="text-xs text-gray-400">${developer.hourlyRate}/hr • {developer.hoursWorked}h</div>
                  )}
                </td>
                <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="font-medium text-gray-900">Total: ${(developer.totalAmount || 0).toLocaleString()}</div>
                  <div className="text-green-600">Paid: ${(developer.paidAmount || 0).toLocaleString()}</div>
                  <div className="text-red-600">Pending: ${(developer.pendingAmount || 0).toLocaleString()}</div>
                </td>
                <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${paymentStatusColors[developer.paymentStatus]}`}>
                    {developer.paymentStatus}
                  </span>
                  <div className="text-xs text-gray-500 mt-1 capitalize">{developer.paymentMethod}</div>
                </td>
                <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {developer.nextPaymentDue ? (
                    <div>
                      <div className="font-medium">{new Date(developer.nextPaymentDue).toLocaleDateString()}</div>
                      {developer.lastPaymentDate && (
                        <div className="text-xs text-gray-400">
                          Last: {new Date(developer.lastPaymentDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="text-gray-400">Not scheduled</span>
                  )}
                </td>
                <td className="px-4 md:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => handleEdit(developer)} className="text-indigo-600 hover:text-indigo-900 mr-3">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button onClick={() => handleDelete(developer._id)} className="text-red-600 hover:text-red-900">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Enhanced Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {editingDeveloper ? 'Edit Developer Record' : 'Add New Developer'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4 max-h-96 overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Developer Name"
                  value={formData.developerName}
                  onChange={(e) => setFormData({ ...formData, developerName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="tel"
                  placeholder="Phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  type="text"
                  placeholder="Project Name"
                  value={formData.projectName}
                  onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <select
                value={formData.client}
                onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              >
                <option value="">Select Client</option>
                {clients.map((client) => (
                  <option key={client._id} value={client._id}>
                    {client.company} - {client.name}
                  </option>
                ))}
              </select>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  placeholder="Total Amount"
                  value={formData.totalAmount}
                  onChange={(e) => setFormData({ ...formData, totalAmount: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
                <input
                  type="number"
                  placeholder="Paid Amount"
                  value={formData.paidAmount}
                  onChange={(e) => setFormData({ ...formData, paidAmount: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  placeholder="Hourly Rate"
                  value={formData.hourlyRate}
                  onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  type="number"
                  placeholder="Hours Worked"
                  value={formData.hoursWorked}
                  onChange={(e) => setFormData({ ...formData, hoursWorked: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="date"
                  placeholder="Start Date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
                <input
                  type="date"
                  placeholder="End Date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="date"
                  placeholder="Last Payment Date"
                  value={formData.lastPaymentDate}
                  onChange={(e) => setFormData({ ...formData, lastPaymentDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  type="date"
                  placeholder="Next Payment Due"
                  value={formData.nextPaymentDue}
                  onChange={(e) => setFormData({ ...formData, nextPaymentDue: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <select
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="bank-transfer">Bank Transfer</option>
                <option value="paypal">PayPal</option>
                <option value="cash">Cash</option>
                <option value="check">Check</option>
              </select>
              <div className="grid grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Account Number"
                  value={formData.bankDetails.accountNumber}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    bankDetails: { ...formData.bankDetails, accountNumber: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  type="text"
                  placeholder="Bank Name"
                  value={formData.bankDetails.bankName}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    bankDetails: { ...formData.bankDetails, bankName: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  type="text"
                  placeholder="IFSC Code"
                  value={formData.bankDetails.ifscCode}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    bankDetails: { ...formData.bankDetails, ifscCode: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <textarea
                placeholder="Notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                rows="3"
              />
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingDeveloper(null);
                    resetForm();
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                >
                  {editingDeveloper ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Development;