import React, { useState, useEffect } from "react";

/* Landing page components */
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { ProblemSection } from "./components/ProblemSection";
import { SolutionSection } from "./components/SolutionSection";
import { ChannelsSection } from "./components/ChannelsSection";
import { FocusAreasSection } from "./components/FocusAreasSection";
import { ImpactSection } from "./components/ImpactSection";
import { PartnersSection } from "./components/PartnersSection";
import { CTASection } from "./components/CTASection";
import { Footer } from "./components/Footer";

/* Dashboard components */
import { Login } from "./components/dashboard/Login";
import { Layout } from "./components/dashboard/Layout";
import { DashboardHome } from "./components/dashboard/DashboardHome";
import { SurveyManagement } from "./components/dashboard/SurveyManagement";
import { DataMonitoring } from "./components/dashboard/DataMonitoring";
import { Analytics } from "./components/dashboard/Analytics";
import { Notifications } from "./components/dashboard/Notifications";

export default function App() {
  const [appView, setAppView] = useState("landing"); 
  const [activeTab, setActiveTab] = useState("dashboard");

  // session persistence
  useEffect(() => {
    const session = localStorage.getItem("signify_session");
    if (session === "true") {
      setAppView("dashboard");
    }
  }, []);

  const handleLogin = () => {
    localStorage.setItem("signify_session", "true");
    setAppView("dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("signify_session");
    setAppView("landing");
  };

  const renderDashboardContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardHome />;
      case "surveys":
        return <SurveyManagement />;
      case "monitoring":
        return <DataMonitoring />;
      case "analytics":
        return <Analytics />;
      case "notifications":
        return <Notifications />;
      default:
        return <DashboardHome />;
    }
  };

  /* -------- VIEWS -------- */

  if (appView === "login") {
    return <Login onLogin={handleLogin} />;
  }

  if (appView === "dashboard") {
    return (
      <Layout
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
      >
        {renderDashboardContent()}
      </Layout>
    );
  }

  // Landing page (default)
  return (
    <div className="min-h-screen bg-white">
      <Header onSignIn={() => setAppView("login")} />
      <main>
        <Hero />
        <ProblemSection />
        <SolutionSection />
        <ChannelsSection />
        <FocusAreasSection />
        <ImpactSection />
        <PartnersSection />
        <CTASection onSignIn={() => setAppView("login")} />
      </main>
      <Footer />
    </div>
  );
}
