import { createClient } from '@supabase/supabase-js';

// **KORREKTUR:** Fügen Sie das HTTPS-Protokoll hinzu
const supabaseUrl = 'https://bicomdezthrsvxeilzbn.supabase.co'; 
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJpY29tZGV6dGhyc3Z4ZWlsemJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMyOTU2MDEsImV4cCI6MjA3ODg3MTYwMX0.YeqjojLTZaHKd-uZQoInxHSnwmaT29d_ElfoVzW0BFU'; // Denken Sie daran, diesen auch zu ersetzen!

export const supabase = createClient(supabaseUrl, supabaseKey);

console.log("Supabase Client initialisiert.");