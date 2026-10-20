import { useState, type FormEvent } from "react";

type Mode = "login" | "signup";

export default function LoginSignupScreen() {
  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  function changeMode(nextMode: Mode) {
    setMode(nextMode);
    setMessage("");
    setPassword("");
  }

  function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // Intentionally no fake login, credential persistence, or external requests.
    // Replace this message with the real auth API integration when available.
    setMessage(mode === "login"
      ? "Login form validated. Connect the authentication API to sign in."
      : "Sign-up form validated. Connect the authentication API to create an account.");
  }

  return (
    <div className="legato-ui legato-auth">
      <main className="legato-auth-main">
        <a className="legato-auth-logo legato-brand" href="/" aria-label="Legato home">Legato</a>
        <section className="legato-auth-card" aria-labelledby="legato-auth-heading">
          <div className="legato-auth-tabs" role="tablist" aria-label="Account access">
            <button
              type="button"
              role="tab"
              aria-selected={mode === "login"}
              className={mode === "login" ? "selected" : ""}
              onClick={() => changeMode("login")}
            >Log in</button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === "signup"}
              className={mode === "signup" ? "selected" : ""}
              onClick={() => changeMode("signup")}
            >Sign up</button>
          </div>
          <h1 id="legato-auth-heading">{mode === "login" ? "Welcome back" : "Join Legato"}</h1>
          <p className="legato-auth-description">
            {mode === "login"
              ? "Log in to pick up your roadmap where you left off."
              : "Create an account to save your musical progress."}
          </p>

          <form className="legato-auth-form" onSubmit={submitForm}>
            <label className="legato-field">
              <span className="legato-field-label">Name</span>
              <span className="legato-field-hint">(sign up only)</span>
              <input
                type="text"
                autoComplete="name"
                placeholder="Your name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required={mode === "signup"}
                disabled={mode === "login"}
                aria-label="Name (sign up only)"
              />
            </label>
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
            <label className="legato-field">
              <span className="legato-field-label">Password</span>
              <input
                type="password"
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                placeholder="••••••••"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                minLength={8}
                required
              />
            </label>
            <div className="legato-forgot-row">
              {mode === "login" ? (
                <button
                  type="button"
                  className="legato-text-link"
                  onClick={() => setMessage("Password recovery will be available when the authentication service is connected.")}
                >Forgot password?</button>
              ) : <span className="legato-password-hint">Use at least 8 characters.</span>}
            </div>
            <button type="submit" className="legato-primary-button">
              {mode === "login" ? "Log in" : "Sign up"}
            </button>
          </form>

          <div className="legato-divider"><span>or</span></div>
          <button
            type="button"
            className="legato-provider-button"
            onClick={() => setMessage("Third-party sign-in is not configured yet. The team needs to select an identity provider.")}
          >
            <span className="legato-provider-symbol" aria-hidden="true">G</span>
            Continue with [Provider]
          </button>
          <p className="legato-auth-terms">
            By signing up you agree to our{" "}
            <button type="button" onClick={() => setMessage("Terms of Service have not been added by the project team yet.")}>Terms</button>
            {" "}and{" "}
            <button type="button" onClick={() => setMessage("The Privacy Policy has not been added by the project team yet.")}>Privacy Policy</button>.
          </p>
          <p className="legato-auth-message" role="status" aria-live="polite">{message}</p>
        </section>
        <a href="/" className="legato-back-link">← Back to home</a>
      </main>
    </div>
  );
}
