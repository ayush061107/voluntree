import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import AuthScreen from './components/AuthScreen';
import VolunteerExplorer from './components/VolunteerExplorer';
import NgoManager from './components/NgoManager';
import { LogOut, Layout, Award, FileText, Sparkles, Building, Settings, MapPin } from 'lucide-react';

export default function App() {
  const { user, loading, logout } = useAuth();
  const [currentTab, setCurrentTab] = useState('overview'); // overview | explorer | certificates | ngo_panel

  // Show a clean loading state while restoring tokens from localStorage
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-emerald-600 border-t-transparent"></div>
          <p className="text-sm font-medium text-slate-500">Syncing ecosystem profile...</p>
        </div>
      </div>
    );
  }

  // If no user session is validated, drop them onto the auth grid
  if (!user) {
    return <AuthScreen />;
  }

  // Detect role profiles matching our FastAPI model structures
  const isNGO = Object.prototype.hasOwnProperty.call(user, 'org_name');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Navigation Bar */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-2">
          <div className="bg-emerald-600 text-white p-2 rounded-lg">
            <Sparkles className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold text-slate-900 tracking-tight">VolunTree</span>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${isNGO ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
            {isNGO ? 'NGO Workspace' : 'Volunteer Portal'}
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-slate-800">{isNGO ? user.org_name : user.name}</p>
            <p className="text-xs text-slate-500">{user.email}</p>
          </div>
          <button 
            onClick={logout} 
            className="flex items-center space-x-2 px-3 py-2 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-rose-600 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </nav>

      {/* Main Core View Area */}
      <main className="flex-1 p-6 max-w-7xl w-full mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Left Sidebar Menu */}
        <div className="md:col-span-1 space-y-2">
          <button 
            onClick={() => setCurrentTab('overview')}
            className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
              currentTab === 'overview' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Layout className="h-5 w-5" />
            <span>Overview Console</span>
          </button>
          
          {!isNGO && (
            <>
              <button 
                onClick={() => setCurrentTab('explorer')}
                className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  currentTab === 'explorer' ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Sparkles className="h-5 w-5" />
                <span>AI Recommendations</span>
              </button>
              <button 
                onClick={() => setCurrentTab('certificates')}
                className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  currentTab === 'certificates' ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Award className="h-5 w-5" />
                <span>My Certificates</span>
              </button>
            </>
          )}

          {isNGO && (
            <button 
              onClick={() => setCurrentTab('ngo_panel')}
              className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                currentTab === 'ngo_panel' ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Building className="h-5 w-5" />
              <span>Operations Center</span>
            </button>
          )}
        </div>

        {/* Right Dashboard Content Shell */}
        <div className="md:col-span-3 space-y-6">
          {currentTab === 'overview' && (
            <>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Hello, {isNGO ? user.org_name : user.name}! 👋
                </h2>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {isNGO 
                    ? "Welcome to your operations workspace. Here you can generate new target volunteer tasks, verify candidate pipelines, and securely sign digital hours certificates."
                    : "Welcome to your service command base. Explore open global opportunities, rely on tailored AI category match suggestions, and track your active impact history."
                  }
                </p>
                
                {isNGO && user.location && (
                  <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg w-max">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>HQ: {user.location}</span>
                  </div>
                )}
              </div>

              {/* Feature placeholder cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-2">
                  <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Active Assignments</h3>
                  <p className="text-2xl font-extrabold text-slate-900">0</p>
                </div>
                <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-2">
                  <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">
                    {isNGO ? 'Total Dispatched Hours' : 'Verified Hours Logged'}
                  </h3>
                  <p className="text-2xl font-extrabold text-emerald-600">0 hrs</p>
                </div>
              </div>
            </>
          )}

          {currentTab === 'explorer' && !isNGO && <VolunteerExplorer />}

          {currentTab === 'certificates' && !isNGO && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-2">My Impact Certificates</h3>
              <p className="text-sm text-slate-500 italic">No validated service certificates found on profile yet.</p>
            </div>
          )}

          {currentTab === 'ngo_panel' && isNGO && <NgoManager />}
        </div>
      </main>
    </div>
  );
}