import { createContext, useContext, useState, useEffect, type ReactNode, type FC } from 'react';
import type { PortfolioAlbum, PortfolioImage } from '../types/portfolio';
import { initialAlbums } from '../data/defaultPortfolio';

const STORAGE_KEY = 'deepak_dhumak_portfolio_albums_v2';

interface PortfolioContextType {
  albums: PortfolioAlbum[];
  selectedAlbum: PortfolioAlbum | null;
  selectedAlbumId: string | null;
  selectAlbum: (id: string | null) => void;
  isManagerOpen: boolean;
  openManager: (albumIdToEdit?: string) => void;
  closeManager: () => void;
  editingAlbumId: string | null;
  setEditingAlbumId: (id: string | null) => void;
  addAlbum: (album: Omit<PortfolioAlbum, 'id'>) => string;
  updateAlbum: (id: string, updated: Partial<PortfolioAlbum>) => void;
  deleteAlbum: (id: string) => void;
  addImagesToAlbum: (albumId: string, newImages: Omit<PortfolioImage, 'id'>[]) => void;
  removeImageFromAlbum: (albumId: string, imageId: string) => void;
  resetToDefaults: () => void;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [albums, setAlbums] = useState<PortfolioAlbum[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load portfolio from localStorage', e);
    }
    return initialAlbums;
  });

  const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(() => {
    const hash = window.location.hash;
    const match = hash.match(/^#portfolio\/([a-zA-Z0-9_-]+)$/);
    return match ? match[1] : null;
  });

  const [isManagerOpen, setIsManagerOpen] = useState(false);
  const [editingAlbumId, setEditingAlbumId] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(albums));
    } catch (e) {
      console.warn('Unable to persist to localStorage (may exceed quota if large base64)', e);
    }
  }, [albums]);

  // Handle URL hash sync & browser back/forward buttons
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      const match = hash.match(/^#portfolio\/([a-zA-Z0-9_-]+)$/);
      if (match) {
        setSelectedAlbumId(match[1]);
      } else if (selectedAlbumId !== null && !hash.startsWith('#portfolio/')) {
        setSelectedAlbumId(null);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [selectedAlbumId]);

  const selectAlbum = (id: string | null) => {
    setSelectedAlbumId(id);
    if (id) {
      window.location.hash = `#portfolio/${id}`;
      // Scroll smoothly to top of project view
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.location.hash = '#portfolio';
    }
  };

  const openManager = (albumIdToEdit?: string) => {
    if (albumIdToEdit) {
      setEditingAlbumId(albumIdToEdit);
    }
    setIsManagerOpen(true);
  };

  const closeManager = () => {
    setIsManagerOpen(false);
    setEditingAlbumId(null);
  };

  const addAlbum = (newAlbumData: Omit<PortfolioAlbum, 'id'>): string => {
    const id = newAlbumData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || `album-${Date.now()}`;
    
    // Ensure unique ID
    let uniqueId = id;
    let counter = 1;
    while (albums.some(a => a.id === uniqueId)) {
      uniqueId = `${id}-${counter++}`;
    }

    const newAlbum: PortfolioAlbum = {
      ...newAlbumData,
      id: uniqueId,
    };

    setAlbums(prev => [newAlbum, ...prev]);
    return uniqueId;
  };

  const updateAlbum = (id: string, updated: Partial<PortfolioAlbum>) => {
    setAlbums(prev =>
      prev.map(album => (album.id === id ? { ...album, ...updated } : album))
    );
  };

  const deleteAlbum = (id: string) => {
    setAlbums(prev => prev.filter(album => album.id !== id));
    if (selectedAlbumId === id) {
      selectAlbum(null);
    }
  };

  const addImagesToAlbum = (albumId: string, newImages: Omit<PortfolioImage, 'id'>[]) => {
    setAlbums(prev =>
      prev.map(album => {
        if (album.id !== albumId) return album;
        const formattedImages: PortfolioImage[] = newImages.map((img, idx) => ({
          ...img,
          id: `${albumId}-img-${Date.now()}-${idx}`,
        }));
        return {
          ...album,
          images: [...album.images, ...formattedImages],
        };
      })
    );
  };

  const removeImageFromAlbum = (albumId: string, imageId: string) => {
    setAlbums(prev =>
      prev.map(album => {
        if (album.id !== albumId) return album;
        return {
          ...album,
          images: album.images.filter(img => img.id !== imageId),
        };
      })
    );
  };

  const resetToDefaults = () => {
    setAlbums(initialAlbums);
    localStorage.removeItem(STORAGE_KEY);
  };

  const selectedAlbum = albums.find(a => a.id === selectedAlbumId) || null;

  return (
    <PortfolioContext.Provider
      value={{
        albums,
        selectedAlbum,
        selectedAlbumId,
        selectAlbum,
        isManagerOpen,
        openManager,
        closeManager,
        editingAlbumId,
        setEditingAlbumId,
        addAlbum,
        updateAlbum,
        deleteAlbum,
        addImagesToAlbum,
        removeImageFromAlbum,
        resetToDefaults,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
