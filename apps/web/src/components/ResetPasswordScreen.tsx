import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "../lib/supabase";
// checking = reading the link, ready = show the form,
// invalid = link expired or already used, done = password changed
type Status = "checking" | "ready" | "invalid" | "done";
const MIN_LENGTH = 8; // keep the same as Supabase's "Minimum password length"
export default function ResetPasswordScreen() {
    const [status, setStatus] = useState<Status>("checking");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState(""); const [message, setMessage] = useState("");
    const [saving, setSaving] = useState(false);
    useEffect(() => {
        // The link in the email logs the user in for this one purpose. Supabase reads
        // the link from the address bar as the page loads, then tells us what it found.
        const { data } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === "PASSWORD_RECOVERY") setStatus("ready");
            if (event === "INITIAL_SESSION") setStatus(session ? "ready" : "invalid");
        });
        return () => data.subscription.unsubscribe();
    }, []);
    async function saveNewPassword(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (password !== confirmPassword) {
            setMessage("The two passwords don't match.");
            return;
        }
        setSaving(true);
        setMessage("Saving...");
        const { error } = await supabase.auth.updateUser({ password });
        setSaving(false);
        if (error) {
            setMessage(error.message);
            return;
        }
        // Log out any other devices, in case someone else knew the old password.
        await supabase.auth.signOut({ scope: "others" });
        setMessage("");
        setStatus("done");
    }
    return (
        <div className="legato-ui legato-auth">
            <main className="legato-auth-main">
                <a className="legato-auth-logo legato-brand" href="/" aria-label="Legato home">
                    <img src="/legato-logo.png" alt="Legato" />
                </a>
                <section className="legato-auth-card" aria-labelledby="reset-heading">
                    <h1 id="reset-heading">Choose a new password</h1>
                    {status === "checking" && <p className="legato-auth-description">Checking your reset link...</p>}
                    {status === "invalid" && (
                        <p className="legato-auth-description">
                            This reset link has expired or was already used.{" "}
                            <a className="legato-text-link" href="/forgot-password">Send a new link</a>.
                        </p>
                    )}
                        {status === "done" && (
                            <p className="legato-auth-description">
                                Your password is changed and you're logged in.{" "}
                                <a className="legato-text-link" href="/">Go to Home</a>.
                            </p>
                        )}
                        {status === "ready" && (
                            <form className="legato-auth-form" onSubmit={saveNewPassword}>
                                <label className="legato-field">
                                    <span className="legato-field-label">New password</span>
                                    <input
                                        type="password"
                                        autoComplete="new-password"
                                        value={password}
                                        onChange={(event) => setPassword(event.target.value)}
                                        minLength={MIN_LENGTH}
                                        required
                                    />
                                </label>
                                <label className="legato-field">
                                    <span className="legato-field-label">Type it again</span>
                                    <input
                                        type="password"
                                        autoComplete="new-password"
                                        value={confirmPassword}
                                        onChange={(event) => setConfirmPassword(event.target.value)}
                                        minLength={MIN_LENGTH}
                                        required
                                    />
                                </label>
                                <span className="legato-password-hint">Use at least {MIN_LENGTH} characters.</span>
                                    <button type="submit" className="legato-primary-button" disabled={saving}>
                                    Save new password

                                </button>
                            </form>
                        )}
                        <p className="legato-auth-message" role="status" aria-live="polite">{message}</p>
                </section>
            </main>
        </div>
    );
}