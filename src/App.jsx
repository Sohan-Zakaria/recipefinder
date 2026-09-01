import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AppProvider } from './context/AppContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Favorites from './pages/Favorites';
import { useState } from 'react';

const App = () => {
  // Lifted state so Header can trigger a modal open from the random button
  const [pendingModalId, setPendingModalId] = useState(null);
  const [heroSearch, setHeroSearch] = useState('');

  return (
    <AppProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          <Header
            onSearch={setHeroSearch}
            onOpenModal={setPendingModalId}
          />

          <main className="flex-1">
            <Routes>
              <Route
                path="/"
                element={
                  <Home
                    externalSearch={heroSearch}
                    externalModalId={pendingModalId}
                    onModalClose={() => setPendingModalId(null)}
                  />
                }
              />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>

          <Footer />
        </div>

        <Toaster
          position="bottom-right"
          toastOptions={{
            className: 'font-sans text-sm',
            style: {
              background: 'var(--toast-bg, #fff)',
              color: 'var(--toast-color, #1f2937)',
              border: '1px solid var(--toast-border, #f3f4f6)',
              borderRadius: '12px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            },
          }}
        />
      </BrowserRouter>
    </AppProvider>
  );
};

const NotFound = () => (
  <div className="flex flex-col items-center justify-center py-32 text-center px-4">
    <div className="text-8xl mb-4">🍽️</div>
    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Page Not Found</h2>
    <p className="text-gray-500 dark:text-gray-400 mb-6">The recipe page you're looking for doesn't exist.</p>
    <a href="/" className="btn-primary">Back to Home</a>
  </div>
);

export default App;
