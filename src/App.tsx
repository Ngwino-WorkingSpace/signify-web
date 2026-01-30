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
import { UsersManagement } from "./components/dashboard/Users";
import SmsManagement from "./components/dashboard/SmsManagement";

import { apiService, AuthResponse } from "./services/api";

export default function App() {
  const [appView, setAppView] = useState("landing"); 
  const [activeTab, setActiveTab] = useState("dashboard");

  // session persistence
  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      setAppView("dashboard");
    }
  }, []);

  const handleLogin = (authData: AuthResponse) => {
    // Store user data in signify_session
    localStorage.setItem("signify_session", JSON.stringify({
      admin: authData.admin,
      loginTime: new Date().toISOString()
    }));
    setAppView("dashboard");
  };

  const handleLogout = () => {
    apiService.logout();
    setAppView("landing");
  };

  const renderDashboardContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardHome />;
      case "surveys":
        return <SurveyManagement />;
      case "users":
        return <UsersManagement />;
      case "sms":
        return <SmsManagement />;
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
