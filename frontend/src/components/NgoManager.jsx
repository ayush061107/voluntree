import React, { useState, useEffect } from 'react';
import apiClient from '../api/client';
import { PlusCircle, FileText, CheckCircle, Award, Users, AlertCircle } from 'lucide-react';

export default function NgoManager() {
  const [tab, setTab] = useState('create'); // create | applications
  const [categories, setCategories] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');

  // Hours logging modal state
  const [selectedAppId, setSelectedAppId] = useState(null);
  const [hoursLogged, setHoursLogged] = useState(10);

  useEffect(() => {
    fetchData();
  }, [tab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (tab === 'create') {
        const res = await apiClient.get('/categories/');
        setCategories(res.data);
      } else {
        const res = await apiClient.get('/applications/ngo');
        setApplications(res.data);
      }
    } catch (err) {
      console.error("Data fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOpportunity = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    try {
      await apiClient.post('/opportunities/', {
        title,
        description,
        category_id: parseInt(categoryId)
      });
      setMessage({ type: 'success', text: 'Opportunity posted successfully!' });
      setTitle('');
      setDescription('');
      setCategoryId('');
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to post opportunity. Verify inputs.' });
    }
  };

  const handleLogHours = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    try {
      await apiClient.post('/certificates/log-hours', {
        application_id: selectedAppId,
        hours_logged: parseInt(hoursLogged)
      });
      setMessage({ type: 'success', text: 'Hours logged and certificate issued!' });
      setSelectedAppId(null);
      fetchData(); // Refresh list
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.detail || 'Failed to issue certificate.' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Sub tabs */}
      <div className="flex border-b border-slate-200 space-x-6">
        <button 
          onClick={() => { setTab('create'); setMessage({type:'',text:''}); }}
          className={`pb-3 text-sm font-semibold border-b-2 transition-colors flex items-center space-x-2 ${
            tab === 'create' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <PlusCircle className="h-4 w-4" />
          <span>Create Listing</span>
        </button>
        <button 
          onClick={() => { setTab('applications'); setMessage({type:'',text:''}); }}
          className={`pb-3 text-sm font-semibold border-b-2 transition-colors flex items-center space-x-2 ${
            tab === 'applications' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="h-4 w-4" />
          <span>Applicant Pipeline</span>
        </button>
      </div>

      {message.text && (
        <div className={`p-4 rounded-xl border flex items-center space-x-2 text-sm font-medium ${
          message.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
        }`}>
          {message.type === 'success' ? <CheckCircle className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
          <span>{message.text}</span>
        </div>
      )}

      {loading && !selectedAppId && (
        <div className="flex justify-center py-6">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-emerald-600 border-t-transparent"></div>
        </div>
      )}

      {/* CREATE FORM */}
      {!loading && tab === 'create' && (
        <form onSubmit={handleCreateOpportunity} className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 shadow-sm">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">Opportunity Title</label>
            <input required type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-emerald-500 transition-all text-sm" placeholder="e.g. Remote Python Mentor" />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">Category Core</label>
            <select required value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white outline-none focus:border-emerald-500 transition-all text-sm">
              <option value="">Select an operating category...</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">Task Description</label>
            <textarea required value={description} onChange={(e) => setDescription(e.target.value)} rows="4" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-emerald-500 transition-all text-sm resize-none" placeholder="Detail the duties, weekly commitment hours, and impact objectives..." />
          </div>

          <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 px-6 rounded-xl transition-colors text-sm">
            Publish Opportunity
          </button>
        </form>
      )}

      {/* PIPELINES VIEW */}
      {!loading && tab === 'applications' && (
        <div className="space-y-4">
          {applications.length === 0 ? (
            <p className="text-slate-500 text-sm italic bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">No active applications have been submitted to your listings yet.</p>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-600 uppercase tracking-wider">
                    <th className="p-4">Opportunity</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                  {applications.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 font-semibold text-slate-900">{app.opportunity?.title}</td>
                      <td className="p-4">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                          app.status === 'Completed' ? 'bg-slate-100 text-slate-600' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        {app.status !== 'Completed' ? (
                          <button 
                            onClick={() => setSelectedAppId(app.id)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-3 py-1.5 rounded-lg transition-colors inline-flex items-center space-x-1"
                          >
                            <Award className="h-3.5 w-3.5" />
                            <span>Log Hours</span>
                          </button>
                        ) : (
                          <span className="text-xs text-slate-400 font-medium italic">Certificate Issued</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Hours Modal Overlay */}
      {selectedAppId && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <form onSubmit={handleLogHours} className="bg-white p-6 rounded-2xl max-w-sm w-full border border-slate-200 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="font-bold text-slate-900 text-lg">Verify Volunteer Hours</h3>
            <p className="text-xs text-slate-500 leading-relaxed">Input the total verified hours. Submitting updates the pipeline status to completed and issues a permanent cryptographically tracked impact block.</p>
            
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Hours Spent</label>
              <input required type="number" min="1" value={hoursLogged} onChange={(e) => setHoursLogged(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-emerald-500 transition-all text-sm" />
            </div>

            <div className="flex space-x-3 pt-2">
              <button type="button" onClick={() => setSelectedAppId(null)} className="flex-1 border border-slate-200 text-slate-600 font-medium py-2 rounded-xl text-sm hover:bg-slate-50 transition-colors">
                Cancel
              </button>
              <button type="submit" className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 rounded-xl text-sm transition-colors shadow-sm">
                Confirm & Sign
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}