import { useState, useEffect, type FC } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Process from './components/Process';
import Portfolio from './components/Portfolio';
import PhotographerProfile from './components/PhotographerProfile';
import BookingUI from './components/BookingUI';
import ContactForm from './components/ContactForm';
import Footer from './components/Footer';
import ProjectDetailView from './components/ProjectDetailView';
import AdminLogin from './components/admin/AdminLogin';
import AdminPanel from './components/admin/AdminPanel';
import { ThemeProvider } from './context/ThemeContext';
import { PortfolioProvider, usePortfolio } from './context/PortfolioContext';
import { AuthProvider, useAuth } from './context/AuthContext';

const AppContent: FC = () => {
  const { selectedAlbumId } = usePortfolio();
  const { isAuthenticated } = useAuth();
  const [isAdminRoute, setIsAdminRoute] = useState(() => {
    return window.location.hash === '#admin';
  });

  useEffect(() => {
    const handleHashChange = () => {
      setIsAdminRoute(window.location.hash === '#admin');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleBackToSite = () => {
    window.location.hash = '#portfolio';
    setIsAdminRoute(false);
  };

  // Dedicated Protected Admin Section
  if (isAdminRoute) {
    if (!isAuthenticated) {
      return <AdminLogin onBackToSite={handleBackToSite} />;
    }
    return <AdminPanel onBackToSite={handleBackToSite} />;
  }

  // Public Client-Facing Website
  return (
    <div className="min-h-screen bg-luxury-bg selection:bg-luxury-gold selection:text-white transition-colors duration-500">
      <Navbar />
      <main>
        {selectedAlbumId ? (
          <ProjectDetailView />
        ) : (
          <>
            <Hero />
            <About />
            <Process />
            <PhotographerProfile />
            <Portfolio />
            <BookingUI />
            <ContactForm />
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

const App: FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <PortfolioProvider>
          <AppContent />
        </PortfolioProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
