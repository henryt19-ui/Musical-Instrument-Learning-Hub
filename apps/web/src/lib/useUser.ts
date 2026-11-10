import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "./supabase";

type AuthSessionState = {
  user: User | null;
  loading: boolean;
};

// The initial session check prevents showing a Log in link while a saved session loads.
export function useAuthSession(): AuthSessionState {
  const [auth, setAuth] = useState<AuthSessionState>({ user: null, loading: true });

  useEffect(() => {
    let active = true;
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (active) setAuth({ user: session?.user ?? null, loading: false });
    });

    void supabase.auth.getSession()
      .then(({ data, error }) => {
        if (active) setAuth({ user: error ? null : data.session?.user ?? null, loading: false });
      })
      .catch(() => {
        if (active) setAuth({ user: null, loading: false });
      });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  return auth;
}

export function useUser() {
  return useAuthSession().user;
}
