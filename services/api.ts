import type { User, AdMobConfig, Veicolo, Intervento, MessaggioAvviso } from '../types';
import { supabase } from './supabaseClient';

export const api = {
    login: async (identifier: string, pass: string): Promise<{ user: User | null; error: string | null }> => {
        const isEmail = identifier.includes('@');
        const isPhone = /^\+?[0-9\s-]{7,}$/.test(identifier);
        
        let credentials: { email: string, password: string } | { phone: string, password: string };

        if (isEmail) {
            credentials = { email: identifier, password: pass };
        } else if (isPhone) {
            credentials = { phone: identifier, password: pass };
        } else {
            // This part assumes a Supabase RPC function exists for securely fetching
            // a user's contact info (email/phone) using their nominativo.
            // This is necessary to avoid exposing user data on the client-side.
            // Example PL/pgSQL function in Supabase:
            //
            // CREATE OR REPLACE FUNCTION get_user_contact_by_nominativo(p_nominativo TEXT)
            // RETURNS TABLE(email TEXT, phone TEXT) LANGUAGE plpgsql SECURITY DEFINER AS $$
            // BEGIN
            //   RETURN QUERY
            //   SELECT u.email, u.phone
            //   FROM auth.users u
            //   JOIN public.profiles p ON u.id = p.id
            //   WHERE p.nominativo = p_nominativo;
            // END;
            // $$;
            
            const { data: contacts, error: rpcError } = await supabase.rpc('get_user_contact_by_nominativo', {
                p_nominativo: identifier
            });

            if (rpcError || !contacts || contacts.length === 0) {
                // Return a generic error to prevent user enumeration attacks.
                return { user: null, error: 'Credenziali non valide.' };
            }
            
            const contact = contacts[0];

            if (contact.email) {
                credentials = { email: contact.email, password: pass };
            } else if (contact.phone) {
                 credentials = { phone: contact.phone, password: pass };
            } else {
                 return { user: null, error: 'Credenziali non valide.' };
            }
        }

        // FIX: Use Supabase v2 `signInWithPassword` method and response structure.
        const { data: { user: authUser }, error: authError } = await supabase.auth.signInWithPassword(credentials);

        if (authError || !authUser) {
            return { user: null, error: authError?.message || 'Credenziali non valide.' };
        }

        const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('nominativo')
            .eq('id', authUser.id)
            .single();

        if (profileError) {
             console.warn("Could not fetch user profile, using email as name.", profileError);
        }

        const user: User = {
            utente_id: authUser.id,
            email: authUser.email || '',
            nominativo: profileData?.nominativo || authUser.email || 'Utente',
        };
        
        return { user, error: null };
    },
    
    register: async (details: { nominativo: string; email?: string; phone?: string; password: string }): Promise<{ error: string | null }> => {
        const { nominativo, email, phone, password } = details;

        if (!email && !phone) {
            return { error: 'È necessario fornire un indirizzo email o un numero di cellulare.' };
        }
        
        // Check if nominativo is unique before proceeding
        const { data: existingProfile } = await supabase
            .from('profiles')
            .select('nominativo')
            .eq('nominativo', nominativo)
            .single();

        if (existingProfile) {
            return { error: 'Questo nominativo/username è già in uso. Scegline un altro.' };
        }

        // FIX: Use Supabase v2 `signUp` method signature.
        const { error } = await supabase.auth.signUp(
            {
                email: email || undefined,
                phone: phone || undefined,
                password: password,
                options: {
                    data: {
                        nominativo: nominativo
                    }
                }
            }
        );

        if (error) {
            if (error.message.includes('User already registered')) {
                return { error: 'Questo utente è già registrato.' };
            }
            return { error: error.message };
        }

        return { error: null };
    },

    logout: async (): Promise<{ error: string | null }> => {
        const { error } = await supabase.auth.signOut();
        return { error: error?.message || null };
    },

    getCurrentUser: async (): Promise<User | null> => {
        // FIX: Use Supabase v2 `getSession` method.
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) return null;

        const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('nominativo')
            .eq('id', session.user.id)
            .single();
        
        if (profileError) {
            console.warn("Could not fetch user profile for session, using email as name.", profileError);
        }

        return {
            utente_id: session.user.id,
            email: session.user.email || '',
            nominativo: profileData?.nominativo || session.user.email || 'Utente',
        };
    },

    getAdMobConfig: (): Promise<AdMobConfig> => {
        // Questa configurazione può essere spostata su Supabase in una tabella 'configs'
        const config: AdMobConfig = {
            adMobIDPublisher: 'ca-pub-1234567890123456',
            adMobIDApp: 'ca-app-pub-1234567890123456~1234567890'
        };
        return Promise.resolve(config);
    },

    getVeicoli: async (utente_id: string): Promise<Veicolo[]> => {
        const { data, error } = await supabase
            .from('veicoli')
            .select('*')
            .eq('utente_id', utente_id);
        if (error) throw error;
        return data || [];
    },

    getVeicoloById: async (veicolo_id: string): Promise<Veicolo | undefined> => {
        const { data, error } = await supabase
            .from('veicoli')
            .select('*')
            .eq('veicolo_id', veicolo_id)
            .single();
        if (error) throw error;
        return data || undefined;
    },

    getInterventiForVeicolo: async (veicolo_id: string): Promise<Intervento[]> => {
        const { data, error } = await supabase
            .from('interventi')
            .select('*')
            .eq('veicolo_id', veicolo_id)
            .order('dataOraIntervento', { ascending: false });
        if (error) throw error;
        return data || [];
    },

    getAvvisiForVeicolo: async (veicolo_id: string): Promise<MessaggioAvviso[]> => {
        // Assumendo una tabella 'messaggi_avviso'
        const { data, error } = await supabase
            .from('messaggi_avviso')
            .select('*')
            .eq('veicolo_id', veicolo_id)
            .order('dataOra', { ascending: false });
        if (error) throw error;
        return data || [];
    },

    addVeicolo: async (newVeicoloData: Omit<Veicolo, 'veicolo_id' | 'utente_id'>, utente_id: string): Promise<Veicolo> => {
        const { data, error } = await supabase
            .from('veicoli')
            .insert([{ ...newVeicoloData, utente_id }])
            .select()
            .single();
        if (error) throw error;
        return data;
    },
    
    updateKilometers: async (veicolo_id: string, km: number): Promise<{ success: boolean }> => {
        const { error } = await supabase
            .from('veicoli')
            .update({ 
                kmAttuali: km,
                kmAttualiDataOraInserimento: new Date().toISOString() 
            })
            .eq('veicolo_id', veicolo_id);
        if (error) {
            console.error(error);
            return { success: false };
        }
        return { success: true };
    }
};