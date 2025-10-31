
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { api } from './api';
import type { Veicolo } from './types';

const InputField: React.FC<{ label: string; id: string; type: string; value: string | number; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; required?: boolean; }> = 
({ label, id, type, value, onChange, required = false }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
        <input
            type={type}
            id={id}
            value={value}
            onChange={onChange}
            required={required}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
    </div>
);

const AddVehicleScreen: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [modello, setModello] = useState('');
    const [targa, setTarga] = useState('');
    const [dataImmatricolazione, setDataImmatricolazione] = useState('');
    const [kmAttuali, setKmAttuali] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            setError('Devi essere loggato per aggiungere un veicolo.');
            return;
        }
        setLoading(true);
        setError('');

        const newVeicoloData: Omit<Veicolo, 'veicolo_id' | 'utente_id'> = {
            modello,
            targa: targa.toUpperCase(),
            dataImmatricolazione,
            kmAttuali: Number(kmAttuali),
            kmAttualiDataOraInserimento: new Date().toISOString(),
            tipoVeicolo_id: 'auto' // Mocked
        };

        try {
            await api.addVeicolo(newVeicoloData, user.utente_id);
            navigate('/');
        } catch (err) {
            setError('Si è verificato un errore. Riprova.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Aggiungi un Nuovo Veicolo</h2>
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-4">
                {error && <p className="text-red-500 bg-red-100 p-3 rounded-md">{error}</p>}
                
                <InputField label="Modello" id="modello" type="text" value={modello} onChange={e => setModello(e.target.value)} required />
                <InputField label="Targa" id="targa" type="text" value={targa} onChange={e => setTarga(e.target.value)} required />
                <InputField label="Data di Immatricolazione" id="dataImmatricolazione" type="date" value={dataImmatricolazione} onChange={e => setDataImmatricolazione(e.target.value)} required />
                <InputField label="Chilometri Attuali" id="kmAttuali" type="number" value={kmAttuali} onChange={e => setKmAttuali(e.target.value)} required />
                
                <div className="pt-4">
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-blue-700 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-800 transition-colors disabled:bg-blue-300"
                    >
                        {loading ? 'Salvataggio...' : 'Salva Veicolo'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddVehicleScreen;
