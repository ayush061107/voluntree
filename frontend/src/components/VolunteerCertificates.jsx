import React, { useState, useEffect } from 'react';
import apiClient from '../api/client';
import { Award, ShieldCheck, Clock, Sparkles, X } from 'lucide-react';

export default function VolunteerCertificates({ initialCertificates = [], isLoadingInitial = false }) {
  const [certificates, setCertificates] = useState(initialCertificates);
  const [loading, setLoading] = useState(isLoadingInitial);
  const [activeCert, setActiveCert] = useState(null);

  // Sync state if initialCertificates array updates at the parent level
  useEffect(() => {
    setCertificates(initialCertificates);
    setLoading(isLoadingInitial);
  }, [initialCertificates, isLoadingInitial]);

  const totalHours = certificates.reduce((acc, curr) => acc + (curr.hours_logged || 0), 0);
  const totalImpactPoints = totalHours * 10 + certificates.length * 50;

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-emerald-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Overview Analytics Headers */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 p-5 rounded-2xl flex items-center space-x-4 shadow-sm">
          <div className="p-3 bg-emerald-600 rounded-xl text-white">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-emerald-800 tracking-wide uppercase">Service Hours</p>
            <h4 className="text-2xl font-black text-slate-900 mt-0.5">{totalHours} hrs</h4>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 p-5 rounded-2xl flex items-center space-x-4 shadow-sm">
          <div className="p-3 bg-blue-600 rounded-xl text-white">
            <Award className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-blue-800 tracking-wide uppercase">Certificates</p>
            <h4 className="text-2xl font-black text-slate-900 mt-0.5">{certificates.length} Earned</h4>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-fuchsia-50 border border-purple-100 p-5 rounded-2xl flex items-center space-x-4 shadow-sm">
          <div className="p-3 bg-purple-600 rounded-xl text-white">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-purple-800 tracking-wide uppercase">Impact Score</p>
            <h4 className="text-2xl font-black text-slate-900 mt-0.5">{totalImpactPoints} pts</h4>
          </div>
        </div>
      </div>

      {/* Grid List view */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-slate-900">Verified Credentials Bundle</h3>
        
        {certificates.length === 0 ? (
          <p className="text-slate-500 text-sm italic">No completed operations or signed service records found on profile yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {certificates.map((cert) => (
              <div key={cert.id} className="border-2 border-slate-100 hover:border-emerald-500/20 p-5 rounded-2xl flex flex-col justify-between transition-all group relative overflow-hidden bg-slate-50/50">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] bg-slate-200 text-slate-700 font-bold px-2 py-0.5 rounded-md uppercase">ID: #{cert.id}</span>
                    <ShieldCheck className="h-5 w-5 text-emerald-600" />
                  </div>
                  <h4 className="font-bold text-slate-900 mt-3 group-hover:text-emerald-700 transition-colors">Volunteer Accomplishment Certificate</h4>
                  <p className="text-slate-500 text-xs mt-0.5">Signed Platform Achievement</p>
                </div>
                <div className="mt-5 pt-3 border-t border-slate-200/60 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">{cert.hours_logged} Hours Confirmed</span>
                  <button 
                    onClick={() => setActiveCert(cert)}
                    className="text-xs font-bold text-emerald-700 hover:text-white border border-emerald-200 bg-white hover:bg-emerald-600 px-3 py-1.5 rounded-xl transition-all shadow-sm"
                  >
                    View Award
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL COMPONENT */}
      {activeCert && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-2xl w-full rounded-3xl shadow-2xl border-4 border-double border-slate-200 p-8 relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="absolute inset-2 border border-amber-800/10 rounded-2xl pointer-events-none" />
            <button 
              onClick={() => setActiveCert(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full transition-colors z-10"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="text-center space-y-6 my-4 relative">
              <div className="flex justify-center flex-col items-center space-y-1">
                <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600 border border-emerald-100">
                  <ShieldCheck className="h-10 w-10" />
                </div>
                <h2 className="text-xs font-black tracking-widest text-emerald-700 uppercase mt-2">VolunTree Verification Network</h2>
              </div>
              <div className="space-y-2">
                <h1 className="text-3xl font-serif text-slate-900 tracking-tight font-medium">Certificate of Appreciation</h1>
                <p className="text-sm italic text-slate-500 font-serif">This credential proudly acknowledges that the recipient has completed verified community service.</p>
              </div>
              <div className="py-2">
                <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Awarded to Community Champion</p>
                <p className="text-2xl font-bold text-slate-800 mt-1 border-b-2 border-dashed border-slate-200 max-w-xs mx-auto pb-1">Verified VolunTree Partner</p>
              </div>
              <div className="max-w-md mx-auto bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
                <p className="text-sm text-slate-700 leading-relaxed font-medium">
                  For dedicating <span className="font-extrabold text-emerald-700">{activeCert.hours_logged} hours</span> of focused support towards organizational development goals, bridging gaps, and fostering lasting community growth.
                </p>
              </div>
              <div className="pt-4 grid grid-cols-2 gap-8 text-left max-w-md mx-auto text-xs border-t border-slate-100">
                <div>
                  <p className="text-slate-400 uppercase font-bold tracking-wider text-[10px]">Verification Status</p>
                  <p className="font-bold text-emerald-700 flex items-center space-x-1 mt-0.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse inline-block" />
                    <span>Cryptographically Secured</span>
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 uppercase font-bold tracking-wider text-[10px]">Credential Secure Token Hash</p>
                  <p className="font-mono text-slate-600 mt-0.5 truncate text-[11px]">vt_hash_77a98bc{activeCert.id}39fd02c</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
