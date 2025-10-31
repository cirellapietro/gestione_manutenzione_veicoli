
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../../services/api';

const RegistrationScreen: React.FC = () => {
  const [nominativo, setNominativo] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email && !phone) {
        setError('È necessario fornire un indirizzo email o un numero di cellulare.');
        return;
    }
    if (password !== confirmPassword) {
        setError('Le password non coincidono.');
        return;
    }
    if (password.length < 6) {
        setError('La password deve essere di almeno 6 caratteri.');
        return;
    }

    setLoading(true);

    try {
        const result = await api.register({ 
            nominativo, 
            email: email || undefined, 
            phone: phone || undefined, 
            password 
        });

        if (result.error) {
            setError(result.error);
        } else {
            setSuccess(`Registrazione avvenuta con successo! Controlla ${email ? 'la tua email' : 'il tuo cellulare'} per il messaggio di conferma.`);
            setTimeout(() => navigate('/login'), 5000);
        }
    } catch (e: any) {
        setError(e.message || 'Errore imprevisto durante la registrazione.');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8 space-y-6">
        <h2 className="text-3xl font-bold text-center text-blue-800">
          Crea il tuo Account
        </h2>
        <p className="text-center text-gray-600">Inizia a gestire la manutenzione dei tuoi veicoli.</p>
        <p className="text-center text-gray-500 text-xs px-4">
            Riceverai avvisi via email, notifiche push e presto anche tramite WhatsApp o Telegram.
        </p>

        {error && <p className="bg-red-100 text-red-700 p-3 rounded-md text-center">{error}</p>}
        {success && <p className="bg-green-100 text-green-700 p-3 rounded-md text-center">{success}</p>}
        
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label htmlFor="nominativo" className="text-sm font-medium text-gray-700">Nominativo / Username (per il login)</label>
            <input id="nominativo" type="text" value={nominativo} onChange={(e) => setNominativo(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="MarioRossi85" />
          </div>
          <p className="text-xs text-gray-500 text-center">Usa la tua email o il numero di cellulare per registrarti. Potrai usarli per recuperare il tuo account.</p>
          <div>
            <label htmlFor="email" className="text-sm font-medium text-gray-700">Email (opzionale)</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="tu@email.com" />
          </div>
          <div>
            <label htmlFor="phone" className="text-sm font-medium text-gray-700">Cellulare (opzionale)</label>
            <input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="+393331234567" />
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="••••••••" />
          </div>
           <div>
            <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">Conferma Password</label>
            <input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="••••••••" />
          </div>
          <button type="submit" disabled={loading || !!success} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300">
            {loading ? 'Registrazione in corso...' : 'Registrati'}
          </button>
        </form>
        <p className="text-xs text-gray-500 text-center mt-4">Hai già un account? <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">Accedi</Link></p>
      </div>
    </div>
  );
};

export default RegistrationScreen;
