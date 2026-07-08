import React, { useState, useEffect } from 'react';
import apiClient from '../api/client';
import { PlusCircle, Users, Award, Check, X, Clock } from 'lucide-react';

export default function NgoManager() {
  const [tab, setTab] = useState('applications');
  const [applications, setApplications] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [interestsCategory, setInterestsCategory] = useState('');
  const [requiredSkills, setRequiredSkills] = useState('');
  const [location, setLocation] = useState('');
  const [selectedAppId, setSelectedAppId] = useState(null);
  const [hoursLogged, setHoursLogged] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const appRes = await apiClient.get('/applications/ngo/my-applications');
      setApplications(Array.isArray(appRes.data) ? appRes.data : []);
    } catch (err) {
      console.error("Data fetch error:", err);
    }
  };

  const handleCreateOpportunity = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    try {
      await apiClient.post('/opportunities/', {
        title,
        description,
        interests_category: interestsCategory,
        required_skills: requiredSkills,
        location
      });
      setMessage({ type: 'success', text: 'Opportunity posted successfully!' });
      setTitle('');
      setDescription('');
      setInterestsCategory('');
      setRequiredSkills('');
      setLocation('');
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to create opportunity.' });
    }
  };

  const handleUpdateStatus = async (appId, status) => {
    setMessage({ type: '', text: '' });
    try {
      await apiClient.put(`/applications/${appId}/status`, { status });
      setMessage({ type: 'success', text: `Application updated to ${status}!` });
      fetchData();
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update application status.' });
    }
  };

  const handleLogHours = async (e) => {
    e.preventDefault();
    if (!hoursLogged || isNaN(hoursLogged) || Number(hoursLogged) <= 0) return;
    setMessage({ type: '', text: '' });
    try {
      await apiClient.post('/certificates/log-hours', {
        application_id: Number(selectedAppId),
        hours_logged: Number(hoursLogged)
      });
      setMessage({ type: 'success', text: 'Hours logged successfully and status marked Completed!' });
      setSelectedAppId(null);
      setHoursLogged('');
      fetchData();
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to log hours. Ensure application is Accepted first.' });
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {message.text && (
        <div className={`p-4 mb-6 rounded-lg border ${message.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'}`}>
          {message.text}
        </div>
      )}

      <div className="flex border-b border-slate-200 mb-8 gap-4">
        <button onClick={() => setTab('applications')} className={`flex items-center gap-2 pb-3 px-1 text-sm font-medium border-b-2 transition-all ${tab === 'applications' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
          <Users className="w-4 h-4" /> Applications Pipeline
        </button>
        <button onClick={() => setTab('create')} className={`flex items-center gap-2 pb-3 px-1 text-sm font-medium border-b-2 transition-all ${tab === 'create' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
          <PlusCircle className="w-4 h-4" /> Post Opportunity
        </button>
      </div>

      {tab === 'create' ? (
        <form onSubmit={handleCreateOpportunity} className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 max-w-2xl shadow-sm">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Opportunity Title</label>
            <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-lg border border-slate-200 p-2.5 outline-none focus:border-emerald-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea required value={description} onChange={(e) => setDescription(e.target.value)} className="w-full rounded-lg border border-slate-200 p-2.5 outline-none focus:border-emerald-500 h-28" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Category / Interest</label>
              <input type="text" required value={interestsCategory} onChange={(e) => setInterestsCategory(e.target.value)} className="w-full rounded-lg border border-slate-200 p-2.5 outline-none focus:border-emerald-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
              <input type="text" required value={location} onChange={(e) => setLocation(e.target.value)} className="w-full rounded-lg border border-slate-200 p-2.5 outline-none focus:border-emerald-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Required Skills (Comma separated)</label>
            <input type="text" required value={requiredSkills} onChange={(e) => setRequiredSkills(e.target.value)} className="w-full rounded-lg border border-slate-200 p-2.5 outline-none focus:border-emerald-500" placeholder="e.g. Communication, Tutoring" />
          </div>
          <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-5 py-2.5 rounded-lg transition-colors">Publish Posting</button>
        </form>
      ) : (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  <th className="px-6 py-4">Volunteer</th>
                  <th className="px-6 py-4">Opportunity Title</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {applications.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-10 text-center text-slate-400">No applications received yet.</td>
                  </tr>
                ) : (
                  applications.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-900">{app.volunteer?.full_name || 'Anonymous User'}</td>
                      <td className="px-6 py-4 text-slate-600">{app.opportunity?.title}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                          app.status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                          app.status === 'Accepted' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                          app.status === 'Completed' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                          'bg-slate-50 text-slate-700 border-slate-200'
                        }`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        {app.status === 'Pending' && (
                          <>
                            <button onClick={() => handleUpdateStatus(app.id, 'Accepted')} className="p-1.5 bg-emerald-50 text-emerald-600 rounded-md hover:bg-emerald-100 transition-colors" title="Accept"><Check className="w-4 h-4" /></button>
                            <button onClick={() => handleUpdateStatus(app.id, 'Rejected')} className="p-1.5 bg-rose-50 text-rose-600 rounded-md hover:bg-rose-100 transition-colors" title="Reject"><X className="w-4 h-4" /></button>
                          </>
                        )}
                        {app.status === 'Accepted' && (
                          <button onClick={() => setSelectedAppId(app.id)} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-md font-medium text-xs transition-colors"><Clock className="w-3.5 h-3.5" /> Log Hours</button>
                        )}
                        {app.status === 'Completed' && (
                          <span className="text-xs text-slate-400 flex items-center justify-end gap-1"><Award className="w-3.5 h-3.5 text-blue-500" /> Hours Verified</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {selectedAppId && (
            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <form onSubmit={handleLogHours} className="bg-white rounded-xl border border-slate-200 p-6 w-full max-w-sm shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
                <h3 className="font-semibold text-slate-900 text-base flex items-center gap-2"><Clock className="w-5 h-5 text-emerald-500" /> Log Volunteer Service Hours</h3>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1 uppercase tracking-wider">Number of Hours Worked</label>
                  <input type="number" min="1" required value={hoursLogged} onChange={(e) => setHoursLogged(e.target.value)} className="w-full rounded-lg border border-slate-200 p-2.5 outline-none focus:border-emerald-500 text-sm" placeholder="e.g. 10" />
                </div>
                <div className="flex justify-end gap-2 text-sm pt-2">
                  <button type="button" onClick={() => { setSelectedAppId(null); setHoursLogged(''); }} className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors">Submit & Complete</button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
