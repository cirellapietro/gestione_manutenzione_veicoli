
import { createClient } from '@supabase/supabase-js';

// !! ISTRUZIONI IMPORTANTI !!
// Sostituisci i valori qui sotto con l'URL e la chiave Anon del tuo progetto Supabase.
// Li trovi nella dashboard del tuo progetto su Supabase, in "Project Settings" -> "API".
//SUPABASE_URL=https://jamttxwhexlvbkjccrqm.supabase.co
//SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImphbXR0eHdoZXhsdmJramNjcnFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2NTE5MDIsImV4cCI6MjA2OTIyNzkwMn0.MkQarY2dOUuwhFnOdaLHqb6idFocTGSfZKjqVoeDYBs

const supabaseUrl = 'https://jamttxwhexlvbkjccrqm.supabase.co'; // Esempio: 'https://xxxxxxxxxxxxxx.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImphbXR0eHdoZXhsdmJramNjcnFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2NTE5MDIsImV4cCI6MjA2OTIyNzkwMn0.MkQarY2dOUuwhFnOdaLHqb6idFocTGSfZKjqVoeDYBs'; // Esempio: 'ey...'

if (supabaseUrl === 'https://jamttxwhexlvbkjccrqm.supabase.co' || supabaseAnonKey === 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImphbXR0eHdoZXhsdmJramNjcnFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2NTE5MDIsImV4cCI6MjA2OTIyNzkwMn0.MkQarY2dOUuwhFnOdaLHqb6idFocTGSfZKjqVoeDYBs') {
    console.error("ERRORE: Le credenziali di Supabase non sono state impostate nel file 'services/supabaseClient.ts'.");
    alert("Configurazione di Supabase mancante. Controlla la console per i dettagli.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);