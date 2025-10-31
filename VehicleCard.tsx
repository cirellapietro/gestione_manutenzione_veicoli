
import React from 'react';
import type { Veicolo } from './types';
import { CarIcon, RightArrowIcon } from './Icons';

interface VehicleCardProps {
  veicolo: Veicolo;
}

const VehicleCard: React.FC<VehicleCardProps> = ({ veicolo }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex items-center space-x-4 transition-transform hover:scale-105 hover:shadow-lg">
      <div className="flex-shrink-0">
        <div className="p-3 bg-blue-100 rounded-full">
            <CarIcon className="text-blue-600"/>
        </div>
      </div>
      <div className="flex-grow">
        <h3 className="text-lg font-bold text-gray-800">{veicolo.modello}</h3>
        <p className="text-sm text-gray-500">{veicolo.targa}</p>
        <p className="text-md font-semibold text-gray-700 mt-1">
          {veicolo.kmAttuali.toLocaleString('it-IT')} km
        </p>
      </div>
      <div className="flex-shrink-0">
          <RightArrowIcon />
      </div>
    </div>
  );
};

export default VehicleCard;
