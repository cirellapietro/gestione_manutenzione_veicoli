
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import type { Veicolo } from '../../types';
import { api } from '../../services/api';
import VehicleCard from '../VehicleCard';

const DashboardScreen: React.FC = () => {
  const { user } = useAuth();
  const [veicoli, setVeicoli] = useState<Veicolo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadVeicoli = async () => {
      if (user) {
        try {
          const data = await api.getVeicoli(user.utente_id);
          setVeicoli(data);
        } catch (error) {
          console.error("Failed to fetch vehicles", error);
        } finally {
          setLoading(false);
        }
      }
    };
    loadVeicoli();
  }, [user]);

  if (loading) {
    return <div className="text-center p-8">Caricamento veicoli...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800">Ciao, {user?.nominativo}!</h2>

      {veicoli.length === 0 ? (
        <div className="text-center bg-white p-8 rounded-lg shadow">
          <p className="text-gray-600">Non hai ancora aggiunto nessun veicolo.</p>
          <Link 
            to="/add-vehicle" 
            className="mt-4 inline-block bg-blue-700 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-800 transition-colors"
          >
            Aggiungi il tuo primo veicolo
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {veicoli.map((veicolo) => (
            <Link to={`/vehicle/${veicolo.veicolo_id}`} key={veicolo.veicolo_id}>
              <VehicleCard veicolo={veicolo} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardScreen;
