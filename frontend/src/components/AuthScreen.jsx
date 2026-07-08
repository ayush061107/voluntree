import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/client';
import { Shield, User, Building2, Lock, Mail, MapPin } from 'lucide-react';

export default function AuthScreen() {
  const { login } = useAuth();
  const [view, setView] = useState('login');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [orgName, setOrgName] = useState('');
  const [location, setLocation] = useState('');

  const resetForm = () => {
    setError(''); setEmail(''); setPassword(''); setName(''); setOrgName(''); setLocation('');
  };

  const validateEmail = (inputEmail) => {
    return String(inputEmail)
      .toLowerCase()
      .match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateEmail(email)) {
      setError('Please provide a valid structured email address (e.g., user@example.com).');
      return;
    }

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

    if (!validateEmail(email)) {
      setError('Pydantic requires a formally validated email layout (e.g., name@domain.com).');
      return;
    }

    setLoading(true);
    try {
      await apiClient.post('/auth/register/volunteer', {
        email: email.trim(),
        password: password,
        full_name: name.trim(),
        location: location.trim()
      });
      await login(email, password);
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Please verify field formatting rules.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterNGO = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateEmail(email)) {
      setError('Pydantic requires a formally validated email layout (e.g., contact@ngo.org).');
      return;
    }

    setLoading(true);
    try {
      await apiClient.post('/auth/register/ngo', {
        email: email.trim(),
        password: password,
        org_name: orgName.trim(),
        location: location.trim()
      });
      await login(email, password);
    } catch (err) {
      setError(err.response?.data?.detail || 'NGO profile registration rejected.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans w-full">
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
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              {view === 'login' && 'Welcome back'}
              {view === 'register_volunteer' && 'Join as a Volunteer'}
              {view === 'register_ngo' && 'Register your Organization'}
            </h1>
          </div>

          {error && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-sm text-rose-600 font-medium">
              {error}
            </div>
          )}

          {view === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm" placeholder="you@domain.com" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm" placeholder="••••••••" />
                </div>
              </div>
              <button type="submit" disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 rounded-xl text-sm">
                {loading ? 'Authenticating...' : 'Sign In'}
              </button>
            </form>
          )}

          {view === 'register_volunteer' && (
            <form onSubmit={handleRegisterVolunteer} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">Full Name</label>
                <input required type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm" placeholder="Jane Doe" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">Location</label>
                <input required type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm" placeholder="Seattle, WA" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">Email Address</label>
                <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm" placeholder="jane@domain.com" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">Password</label>
                <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm" placeholder="••••••••" />
              </div>
              <button type="submit" disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 rounded-xl text-sm">
                Register
              </button>
            </form>
          )}

          {view === 'register_ngo' && (
            <form onSubmit={handleRegisterNGO} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">Organization Name</label>
                <input required type="text" value={orgName} onChange={(e) => setOrgName(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm" placeholder="Red Cross" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">HQ Location</label>
                <input required type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm" placeholder="New York, NY" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">Contact Email</label>
                <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm" placeholder="hq@ngo.org" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">Password</label>
                <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm" placeholder="••••••••" />
              </div>
              <button type="submit" disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 rounded-xl text-sm">
                Register NGO
              </button>
            </form>
          )}

          <div className="pt-4 border-t border-slate-100 text-center text-xs space-y-2">
            {view === 'login' ? (
              <div className="flex justify-center space-x-4 font-semibold text-emerald-600">
                <button onClick={() => { setView('register_volunteer'); resetForm(); }} className="hover:underline">Join as Volunteer</button>
                <button onClick={() => { setView('register_ngo'); resetForm(); }} className="hover:underline">Join as NGO</button>
              </div>
            ) : (
              <button onClick={() => { setView('login'); resetForm(); }} className="font-semibold text-emerald-600 hover:underline">Sign In here</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
