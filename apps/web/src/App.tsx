import Header from "./components/Header";
import HomeScreen from "./components/HomeScreen";
import MyLibraryScreen from "./components/MyLibraryScreen";
import LoginSignupScreen from "./components/LoginSignupScreen";
import "./styles/legato-screens.css";

// No routing dependency is needed for these two new pages.
// Your development server (Vite) supports direct access to /library and /auth.
export default function App() {
  const path = window.location.pathname.replace(/\/$/, "") || "/";

  if (path === "/library") return <MyLibraryScreen />;
  if (path === "/auth" || path === "/login" || path === "/signup") return <LoginSignupScreen />;

  // Preserve the existing home screen built by another team member.
  return (
    <div className="min-h-screen">
      <Header />
      <HomeScreen />
    </div>
  );
}
