
import React, { useState, useEffect } from 'react';
import type { AdMobConfig } from './types';
import { api } from './api';

const AdBanner: React.FC = () => {
  const [config, setConfig] = useState<AdMobConfig | null>(null);
  const [showAd, setShowAd] = useState(false);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const adConfig = await api.getAdMobConfig();
        setConfig(adConfig);
        if (adConfig.adMobIDPublisher && adConfig.adMobIDApp) {
          setShowAd(true);
        }
      } catch (error) {
        console.error("Failed to fetch AdMob config", error);
        setShowAd(false);
      }
    };

    fetchConfig();
  }, []);

  if (!showAd) {
    return null;
  }

  return (
    <div className="fixed bottom-16 left-0 right-0 flex justify-center items-center h-12 bg-gray-200 border-t border-gray-300 z-10">
      <div className="text-gray-600 text-sm">
        Spazio Pubblicitario (AdMob ID: {config?.adMobIDApp?.slice(0,15)}...)
      </div>
    </div>
  );
};

export default AdBanner;
