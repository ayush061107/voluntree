import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/client';
import { Shield, User, Building2, Lock, Mail, Globe, MapPin, Eye, EyeOff } from 'lucide-react';

export default function AuthScreen() {
  const { login } = useAuth();
  const [view, setView] = useState('login'); // login | register_volunteer | register_ngo
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [skills, setSkills] = useState('');
  const [orgName, setOrgName] = useState('');
  const [description, setDescription] = useState('');
  const [website, setWebsite] = useState('');
  const [location, setLocation] = useState('');

  const resetForm = () => {
    setError('');
    setEmail('');
    setPassword('');
    setName('');
    setSkills('');
    setOrgName('');
    setDescription('');
    setWebsite('');
    setLocation('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterVolunteer = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // Register via our volunteer endpoint
      await apiClient.post('/auth/register/volunteer', {
        email,
        password,
        name,
        skills: skills.split(',').map(s => s.trim()).filter(Boolean)
      });
      // Automatically log them in after registration
      await login(email, password);
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Check inputs.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterNGO = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // Register via our NGO endpoint
      await apiClient.post('/auth/register/ngo', {
        email,
        password,
        org_name: orgName,
        description,
        website,
        location
      });
      // Automatically log them in after registration
      await login(email, password);
    } catch (err) {
      setError(err.response?.data?.detail || 'NGO registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans">
      {/* Left panel - Marketing banner */}
      <div className="hidden lg:flex lg:w-1/2 bg-emerald-600 justify-center items-center text-white p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-700 opacity-90" />
        <div className="relative z-10 max-w-md space-y-6">
          <div className="flex items-center space-x-3">
            <div className="bg-white/10 p-3 rounded-xl backdrop-blur-md">
              <Shield className="h-8 w-8 text-emerald-300" />
            </div>
            <span className="text-3xl font-extrabold tracking-tight">VolunTree</span>
          </div>
          <h2 className="text-4xl font-bold leading-tight">Grow Community Roots, Branch Out Your Impact.</h2>
          <p className="text-emerald-100/90 text-lg">
            Connect directly with verified non-profits, leverage automated skill matching, and securely log your impact hours all under one ecosystem.
          </p>
        </div>
      </div>

      {/* Right panel - Dynamic forms */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-6">
          
          {/* Header State Titles */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              {view === 'login' && 'Welcome back'}
              {view === 'register_volunteer' && 'Join as a Volunteer'}
              {view === 'register_ngo' && 'Register your Organization'}
            </h1>
            <p className="text-sm text-slate-500">
              {view === 'login' && 'Enter your account credentials below'}
              {view !== 'login' && 'Fill out the form to build your account'}
            </p>
          </div>

          {error && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-sm text-rose-600 font-medium">
              {error}
            </div>
          )}

          {/* LOGIN VIEW */}
          {view === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-emerald-500 transition-all text-sm text-slate-800" placeholder="you@domain.com" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input required type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-emerald-500 transition-all text-sm text-slate-800" placeholder="••••••••" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 rounded-xl transition-colors text-sm shadow-sm shadow-emerald-600/10 disabled:opacity-50">
                {loading ? 'Authenticating...' : 'Sign In'}
              </button>
            </form>
          )}

          {/* VOLUNTEER REGISTRATION VIEW */}
          {view === 'register_volunteer' && (
            <form onSubmit={handleRegisterVolunteer} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input required type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-emerald-500 transition-all text-sm text-slate-800" placeholder="Jane Doe" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-emerald-500 transition-all text-sm text-slate-800" placeholder="jane@domain.com" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-emerald-500 transition-all text-sm text-slate-800" placeholder="••••••••" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">Skills (Comma separated)</label>
                <input type="text" value={skills} onChange={(e) => setSkills(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-emerald-500 transition-all text-sm text-slate-800" placeholder="Python, Teaching, Graphic Design" />
              </div>

              <button type="submit" disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 rounded-xl transition-colors text-sm disabled:opacity-50">
                {loading ? 'Creating account...' : 'Create Volunteer Account'}
              </button>
            </form>
          )}

          {/* NGO REGISTRATION VIEW */}
          {view === 'register_ngo' && (
            <form onSubmit={handleRegisterNGO} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">Organization Name</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input required type="text" value={orgName} onChange={(e) => setOrgName(e.target.value)} className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 outline-none focus:border-emerald-500 transition-all text-sm text-slate-800" placeholder="Red Cross Section" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">HQ Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input required type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 outline-none focus:border-emerald-500 transition-all text-sm text-slate-800" placeholder="New York, NY" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">Contact Email</label>
                  <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-emerald-500 transition-all text-sm text-slate-800" placeholder="contact@ngo.org" />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">Password</label>
                  <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-emerald-500 transition-all text-sm text-slate-800" placeholder="••••••••" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">Website URL</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input type="url" value={website} onChange={(e) => setWebsite(e.target.value)} className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 outline-none focus:border-emerald-500 transition-all text-sm text-slate-800" placeholder="https://ngo.org" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">Mission Description</label>
                <textarea required value={description} onChange={(e) => setDescription(e.target.value)} rows="2" className="w-full px-4 py-2 rounded-xl border border-slate-200 outline-none focus:border-emerald-500 transition-all text-sm text-slate-800 resize-none" placeholder="Brief statement about your community goals..." />
              </div>

              <button type="submit" disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 rounded-xl transition-colors text-sm disabled:opacity-50">
                {loading ? 'Creating profile...' : 'Register NGO'}
              </button>
            </form>
          )}

          {/* Footer View Switchers */}
          <div className="pt-4 border-t border-slate-100 text-center text-xs space-y-2">
            {view === 'login' ? (
              <>
                <p className="text-slate-500">Don't have an account?</p>
                <div className="flex justify-center space-x-4 font-semibold text-emerald-600">
                  <button onClick={() => { setView('register_volunteer'); resetForm(); }} className="hover:underline">Join as Volunteer</button>
                  <span className="text-slate-300">•</span>
                  <button onClick={() => { setView('register_ngo'); resetForm(); }} className="hover:underline">Join as NGO</button>
                </div>
              </>
            ) : (
              <p className="text-slate-500">
                Already registered?{' '}
                <button onClick={() => { setView('login'); resetForm(); }} className="font-semibold text-emerald-600 hover:underline">Sign In here</button>
              </p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}