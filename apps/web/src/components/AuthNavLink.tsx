import { useAuthSession } from "../lib/useUser";

type AuthNavLinkProps = {
  className: string;
  showAvatar?: boolean;
};

export default function AuthNavLink({ className, showAvatar = false }: AuthNavLinkProps) {
  const { user, loading } = useAuthSession();

  // Reserve the header control's space while Supabase restores the session.
  if (loading) {
    return <span className={className} aria-hidden="true">Account</span>;
  }

  const label = user ? "Profile" : "Log in";
  const displayName = user?.user_metadata?.display_name;
  const avatarText = typeof displayName === "string" && displayName.trim()
    ? displayName.trim()
    : user?.email ?? "A";

  return (
    <a href={user ? "/profile" : "/login"} className={className} aria-label={label}>
      {showAvatar && (
        <span className="legato-profile-avatar" aria-hidden="true">
          {avatarText.charAt(0).toUpperCase()}
        </span>
      )}
      <span>{label}</span>
    </a>
  );
}
