import React, { useState, useEffect } from 'react';
import apiClient from '../api/client';
import { Sparkles, Calendar, MapPin, Briefcase, CheckCircle, AlertCircle } from 'lucide-react';

export default function VolunteerExplorer() {
  const [opportunities, setOpportunities] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applyingId, setApplyingId] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [oppsRes, recsRes] = await Promise.all([
        apiClient.get('/opportunities/'),
        apiClient.get('/ai/match').catch(() => ({ data: [] })) // Fallback if no profile exists yet
      ]);
      setOpportunities(oppsRes.data);
      setRecommendations(recsRes.data);
    } catch (err) {
      console.error("Error fetching opportunities data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (oppId) => {
    setApplyingId(oppId);
    setMessage({ type: '', text: '' });
    try {
      await apiClient.post('/applications/', { opportunity_id: oppId });
      setMessage({ type: 'success', text: 'Application submitted successfully!' });
    } catch (err) {
      setMessage({ 
        type: 'error', 
        text: err.response?.data?.detail || 'You have already applied to this opportunity.' 
      });
    } finally {
      setApplyingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-emerald-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {message.text && (
        <div className={`p-4 rounded-xl border flex items-center space-x-2 text-sm font-medium ${
          message.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
        }`}>
          {message.type === 'success' ? <CheckCircle className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* AI Matches Section */}
      {recommendations.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-amber-500 fill-amber-500" />
            <h3 className="text-lg font-bold text-slate-900">AI Matched For You</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendations.map((opp) => (
              <div key={opp.id} className="bg-gradient-to-br from-amber-50/50 to-orange-50/30 border border-amber-200/60 p-5 rounded-2xl relative overflow-hidden flex flex-col justify-between">
                <div>
                  <span className="absolute top-4 right-4 bg-amber-100 text-amber-900 text-xs font-bold px-2.5 py-1 rounded-full flex items-center space-x-1">
                    <Sparkles className="h-3 w-3 fill-amber-600 text-amber-600" />
                    <span>High Match</span>
                  </span>
                  <h4 className="font-bold text-slate-900 pr-20">{opp.title}</h4>
                  <p className="text-slate-600 text-sm mt-2 line-clamp-2">{opp.description}</p>
                </div>
                <div className="mt-4 pt-4 border-t border-amber-100 flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-xs text-slate-500">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>Remote/On-site</span>
                  </div>
                  <button 
                    onClick={() => handleApply(opp.id)}
                    disabled={applyingId === opp.id}
                    className="bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs px-4 py-2 rounded-xl transition-colors disabled:opacity-50"
                  >
                    {applyingId === opp.id ? 'Applying...' : 'Quick Apply'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* General Directory Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900">All Available Opportunities</h3>
        {opportunities.length === 0 ? (
          <p className="text-slate-500 text-sm italic">No open service opportunities available right now.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {opportunities.map((opp) => (
              <div key={opp.id} className="bg-white border border-slate-200 p-5 rounded-2xl flex flex-col justify-between shadow-sm">
                <div>
                  <h4 className="font-bold text-slate-900">{opp.title}</h4>
                  <p className="text-slate-600 text-sm mt-2 line-clamp-3">{opp.description}</p>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-xs text-slate-500">
                    <div className="flex items-center space-x-1">
                      <Briefcase className="h-3.5 w-3.5" />
                      <span>{opp.category?.name || 'General'}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleApply(opp.id)}
                    disabled={applyingId === opp.id}
                    className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-4 py-2 rounded-xl transition-colors disabled:opacity-50"
                  >
                    {applyingId === opp.id ? 'Applying...' : 'Apply Now'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}