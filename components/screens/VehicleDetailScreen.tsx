
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Veicolo, Intervento, MessaggioAvviso } from '../../types';
import { api } from '../../services/api';
import { useGPS } from '../../hooks/useGPS';
import { CalendarIcon, WrenchIcon, BellIcon, GPSTrackingIcon } from '../icons/Icons';

const InfoCard: React.FC<{ title: string; value: string; }> = ({ title, value }) => (
    <div className="bg-slate-50 p-3 rounded-lg">
        <p className="text-xs text-gray-500">{title}</p>
        <p className="font-semibold text-gray-800">{value}</p>
    </div>
);

const VehicleDetailScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [veicolo, setVeicolo] = useState<Veicolo | null>(null);
  const [interventi, setInterventi] = useState<Intervento[]>([]);
  const [avvisi, setAvvisi] = useState<MessaggioAvviso[]>([]);
  const [loading, setLoading] = useState(true);
  const { isTracking, distance, error, startTracking, stopTracking, permissionStatus } = useGPS();
  const [initialKm, setInitialKm] = useState(0);

  useEffect(() => {
    if (!id) {
        navigate('/');
        return;
    }
    const loadData = async () => {
      try {
        setLoading(true);
        const [veicoloData, interventiData, avvisiData] = await Promise.all([
          api.getVeicoloById(id),
          api.getInterventiForVeicolo(id),
          api.getAvvisiForVeicolo(id)
        ]);
        if (veicoloData) {
            setVeicolo(veicoloData);
            setInitialKm(veicoloData.kmAttuali);
        } else {
            navigate('/'); // not found
        }
        setInterventi(interventiData);
        setAvvisi(avvisiData);
      } catch (err) {
        console.error("Failed to load vehicle details", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id, navigate]);

  const handleStopTracking = useCallback(async () => {
    stopTracking();
    if(veicolo) {
        const newKm = Math.round(initialKm + distance);
        await api.updateKilometers(veicolo.veicolo_id, newKm);
        setVeicolo(v => v ? { ...v, kmAttuali: newKm } : null);
    }
  }, [stopTracking, distance, initialKm, veicolo]);

  if (loading) {
    return <div className="text-center p-8">Caricamento dettagli veicolo...</div>;
  }

  if (!veicolo) {
    return <div className="text-center p-8">Veicolo non trovato.</div>;
  }
  
  const currentKm = isTracking ? Math.round(initialKm + distance) : veicolo.kmAttuali;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold text-gray-800">{veicolo.modello}</h2>
        <p className="text-lg text-gray-500">{veicolo.targa}</p>
      </div>
      
      <div className="bg-white rounded-lg shadow p-4 space-y-4">
        <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Dettagli Veicolo</h3>
        <div className="grid grid-cols-2 gap-4">
          <InfoCard title="Chilometraggio" value={`${currentKm.toLocaleString('it-IT')} km`} />
          <InfoCard title="Immatricolazione" value={new Date(veicolo.dataImmatricolazione).toLocaleDateString('it-IT')} />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4 space-y-4">
        <h3 className="flex items-center text-lg font-semibold text-gray-700 border-b pb-2">
            <GPSTrackingIcon className="mr-2"/>
            Tracciamento GPS
        </h3>
        {permissionStatus === 'denied' && <p className="text-red-600 text-sm">Accesso alla posizione negato. Controlla le impostazioni del browser.</p>}
        {error && <p className="text-red-600 text-sm">{error}</p>}

        <p className="text-sm text-gray-600">Distanza percorsa in questa sessione: <strong>{distance.toFixed(2)} km</strong></p>
        {!isTracking ? (
            <button onClick={startTracking} disabled={permissionStatus !== 'granted'} className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400">
                Avvia Tracciamento GPS
            </button>
        ) : (
             <button onClick={handleStopTracking} className="w-full bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 transition-colors">
                Ferma e Salva Km
            </button>
        )}
      </div>

      <div className="bg-white rounded-lg shadow p-4 space-y-2">
        <h3 className="flex items-center text-lg font-semibold text-gray-700 border-b pb-2 mb-2"><BellIcon className="mr-2"/> Avvisi Recenti</h3>
        {avvisi.length > 0 ? avvisi.map(avv => (
             <div key={avv.messaggio_id} className="p-3 bg-yellow-100 border-l-4 border-yellow-500 rounded-r-lg">
                <p className="text-sm text-yellow-800">{avv.contenuto}</p>
                <p className="text-xs text-yellow-600 mt-1">{new Date(avv.dataOra).toLocaleString('it-IT')}</p>
            </div>
        )) : <p className="text-sm text-gray-500">Nessun avviso presente.</p>}
      </div>
      
      <div className="bg-white rounded-lg shadow p-4 space-y-2">
        <h3 className="flex items-center text-lg font-semibold text-gray-700 border-b pb-2 mb-2"><WrenchIcon className="mr-2" /> Storico Interventi</h3>
        {interventi.length > 0 ? interventi.map(int => (
            <div key={int.intervento_id} className="flex justify-between items-center p-3 border-b last:border-b-0">
                <div>
                    <p className="font-semibold text-gray-800">{int.descrizioneControllo}</p>
                    <p className="text-sm text-gray-500">{new Date(int.dataOraIntervento).toLocaleDateString('it-IT')} - {int.kmIntervento.toLocaleString('it-IT')} km</p>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${int.eseguito ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
                    {int.descrizioneStato}
                </span>
            </div>
        )) : <p className="text-sm text-gray-500">Nessun intervento registrato.</p>}
      </div>

    </div>
  );
};

export default VehicleDetailScreen;
