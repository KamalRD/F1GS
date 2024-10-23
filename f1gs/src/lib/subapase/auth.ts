import { supabase } from "./supabase";

export const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    return { data, error };
}

export const signOut = async () => {
    await supabase.auth.signOut();
}