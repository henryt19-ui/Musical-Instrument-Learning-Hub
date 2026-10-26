import Header from "./components/Header";
import HomeScreen from "./components/HomeScreen";
import MyLibraryScreen from "./components/MyLibraryScreen";
import LoginSignupScreen from "./components/LoginSignupScreen";
import RoadmapScreen from "./components/RoadmapScreen";
import RoadmapStepScreen from "./components/RoadmapStepScreen";
import PracticeToolsScreen from "./components/practicetools";
import ResourcesScreen from "./components/resources";
import "./styles/legato-screens.css";

// Vite serves direct access to the app's page paths without a routing dependency.
export default function App() {
  const path = window.location.pathname.replace(/\/$/, "") || "/";

  if (path === "/library") return <MyLibraryScreen />;
  if (path === "/auth" || path === "/login" || path === "/signup") return <LoginSignupScreen />;
  if (path === "/roadmap" || path === "/roadmaps") return <RoadmapScreen />;
  if (path.startsWith("/roadmap/") || path.startsWith("/roadmaps/")) return <RoadmapStepScreen />;
  if (path === "/practice-tools") return <PracticeToolsScreen />;
  if (path === "/resources" || path.startsWith("/resources/")) return <ResourcesScreen />;

  // Preserve the existing home screen built by another team member.
  return (
    <div className="min-h-screen">
      <Header variant="home" />
      <HomeScreen />
    </div>
  );
}
