import { useState } from "react";
import Header from "./Header";
import { supabase } from "../lib/supabase";
import { useAuthSession } from "../lib/useUser";

export default function ProfileScreen() {
  const { user, loading } = useAuthSession();
  const [signingOut, setSigningOut] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const metadataName = user?.user_metadata?.display_name;
  const displayName = typeof metadataName === "string" && metadataName.trim()
    ? metadataName.trim()
    : "Legato learner";

  async function signOut() {
    setSigningOut(true);
    setErrorMessage("");
    const { error } = await supabase.auth.signOut();

    if (error) {
      setErrorMessage(error.message);
      setSigningOut(false);
      return;
    }

    window.location.assign("/");
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="mx-auto max-w-2xl px-5 py-12 sm:px-8">
        <section className="rounded-2xl bg-white p-6 shadow-md sm:p-8" aria-labelledby="profile-heading">
          <h1 id="profile-heading" className="text-3xl font-bold text-slate-900">My Profile</h1>

          {loading ? (
            <p className="mt-5 text-slate-600" role="status">Loading your profile...</p>
          ) : !user ? (
            <div className="mt-5">
              <p className="text-slate-600">Log in to view your profile.</p>
              <a href="/login" className="mt-5 inline-block rounded-full bg-pink-700 px-5 py-3 font-semibold text-white hover:bg-pink-800">
                Log in
              </a>
            </div>
          ) : (
            <div className="mt-6 space-y-5">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">{displayName}</h2>
                <p className="mt-1 text-sm text-slate-600">{user.email ?? "No email address available"}</p>
              </div>
              <button
                type="button"
                className="rounded-full bg-pink-700 px-5 py-3 font-semibold text-white hover:bg-pink-800 disabled:cursor-not-allowed disabled:opacity-50"
                onClick={() => void signOut()}
                disabled={signingOut}
              >
                {signingOut ? "Signing out..." : "Sign out"}
              </button>
              {errorMessage && <p role="alert" className="text-sm text-red-700">{errorMessage}</p>}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
