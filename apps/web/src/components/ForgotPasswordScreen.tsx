
import { useState, type FormEvent } from "react";
import { supabase } from "../lib/supabase";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  async function sendResetEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSending(true);
    setMessage("Sending...");
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      // Where the link in the email takes the user. Must be on Supabase's Redirect URLs list
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setSending(false);
    if (error) {
      // Only things like "too many requests" or a network problem end up here.
      setMessage(error.message);
      return;
    }
    // Same message whether or not the email has an account, so nobody can use
    // this form to find out who has signed up.
    setMessage("If that email has a Legato account, a reset link is on its way. Check your inbox and spam folder.");
  }
  return (
    <div className="legato-ui legato-auth">
      <main className="legato-auth-main">
        <a className="legato-auth-logo legato-brand" href="/" aria-label="Legato home">
          <img src="/legato-logo.png" alt="Legato" />
        </a>
        <section className="legato-auth-card" aria-labelledby="forgot-heading">
          <h1 id="forgot-heading">Forgot your password?</h1>
          <p className="legato-auth-description">
            Enter the email you signed up with and we'll send you a link to choose a new one.
          </p>
          <form className="legato-auth-form" onSubmit={sendResetEmail}>
            <label className="legato-field">
              <span className="legato-field-label">Email</span>
              <input
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </label>
            <button type="submit" className="legato-primary-button" disabled={sending}>
              Send reset link
            </button>
          </form>
          <p className="legato-auth-message" role="status" aria-live="polite">{message}</p>
        </section>
        <a href="/login" className="legato-back-link">← Back to log in</a>
      </main>
    </div>
  );
}
//await supabase.auth.updateUser({ password: newPassword });
//placeholder for after user clicks the email link