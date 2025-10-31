
export interface User {
  utente_id: string;
  nominativo: string;
  email: string;
}

export interface AdMobConfig {
  adMobIDPublisher: string | null;
  adMobIDApp: string | null;
}

export interface Veicolo {
  veicolo_id: string;
  utente_id: string;
  tipoVeicolo_id: string;
  modello: string;
  targa: string;
  dataImmatricolazione: string;
  kmAttuali: number;
  kmAttualiDataOraInserimento: string;
}

export interface Intervento {
  intervento_id: string;
  veicolo_id: string;
  controlloPeriodico_id: string;
  descrizioneControllo: string;
  descrizioneStato: string;
  eseguito: boolean;
  kmIntervento: number;
  dataOraIntervento: string;
}

export interface MessaggioAvviso {
    messaggio_id: string;
    veicolo_id: string;
    contenuto: string;
    dataOra: string;
}
