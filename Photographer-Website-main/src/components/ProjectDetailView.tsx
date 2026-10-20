import { useState, useEffect, type FC } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  X,
  Maximize2,
  Calendar,
  MapPin,
  Sparkles,
  Share2,
  Check
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import type { PortfolioImage } from '../types/portfolio';

const ProjectDetailView: FC = () => {
  const { selectedAlbum, selectAlbum, albums } = usePortfolio();
  
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    // Keyboard navigation for lightbox
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeImageIndex === null || !selectedAlbum) return;

      if (e.key === 'Escape') {
        setActiveImageIndex(null);
      } else if (e.key === 'ArrowRight') {
        setActiveImageIndex((prev) =>
          prev !== null ? (prev + 1) % selectedAlbum.images.length : null
        );
      } else if (e.key === 'ArrowLeft') {
        setActiveImageIndex((prev) =>
          prev !== null
            ? (prev - 1 + selectedAlbum.images.length) % selectedAlbum.images.length
            : null
        );
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeImageIndex, selectedAlbum]);

  if (!selectedAlbum) return null;

  const currentLightboxImage: PortfolioImage | null =
    activeImageIndex !== null ? selectedAlbum.images[activeImageIndex] : null;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Find next and previous albums for easy browsing
  const currentIndex = albums.findIndex(a => a.id === selectedAlbum.id);
  const nextAlbum = albums[(currentIndex + 1) % albums.length];
  const prevAlbum = albums[(currentIndex - 1 + albums.length) % albums.length];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-luxury-bg text-luxury-text pt-24 pb-28 selection:bg-luxury-gold selection:text-white"
    >
      {/* Sticky Project Sub-Bar */}
      <div className="sticky top-20 z-40 bg-luxury-bg/90 backdrop-blur-md border-b border-luxury-border py-3 px-6 transition-colors duration-500">
        <div className="container mx-auto flex items-center justify-between">
          <button
            onClick={() => selectAlbum(null)}
            className="flex items-center gap-2 text-sm font-medium text-luxury-gold hover:text-luxury-gold-light transition-colors group cursor-pointer"
          >
            <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
            <span>Back to All Works</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-luxury-text-sec hover:text-luxury-gold border border-luxury-border rounded-sm transition-colors cursor-pointer"
              title="Copy link to this portfolio"
            >
              {copiedLink ? <Check size={14} className="text-green-500" /> : <Share2 size={14} />}
              <span className="hidden sm:inline">{copiedLink ? 'Copied Link' : 'Share'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 max-w-7xl mt-8">
        {/* Project Header */}
        <div className="mb-14 border-b border-luxury-border pb-12">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-luxury-gold/15 text-luxury-gold text-xs font-semibold tracking-widest uppercase rounded-sm border border-luxury-gold/25">
              {selectedAlbum.category}
            </span>
            <span className="text-xs uppercase tracking-wider text-luxury-text-sec flex items-center gap-1">
              <Sparkles size={12} className="text-luxury-gold" />
              {selectedAlbum.images.length} Photographs
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold tracking-tight mb-6 text-luxury-text">
            {selectedAlbum.title}
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <p className="lg:col-span-2 text-luxury-text-sec text-base sm:text-lg font-light leading-relaxed">
              {selectedAlbum.description}
            </p>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-4 text-xs tracking-wider uppercase text-luxury-text-sec/80 pt-2 border-t lg:border-t-0 lg:border-l border-luxury-border lg:pl-8">
              {selectedAlbum.location && (
                <div className="flex items-center gap-2">
                  <MapPin size={15} className="text-luxury-gold flex-shrink-0" />
                  <span>{selectedAlbum.location}</span>
                </div>
              )}
              {selectedAlbum.date && (
                <div className="flex items-center gap-2">
                  <Calendar size={15} className="text-luxury-gold flex-shrink-0" />
                  <span>{selectedAlbum.date}</span>
                </div>
              )}
              <div className="text-[11px] text-luxury-gold-light/90 italic font-serif">
                Deepak Dhumak Original Collection
              </div>
            </div>
          </div>
        </div>

        {/* Project Image Gallery Grid */}
        <div className="mb-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl sm:text-2xl font-serif font-semibold text-luxury-text">
              Project Gallery
            </h2>
            <span className="text-xs text-luxury-text-sec">
              Click any photograph to view in full resolution
            </span>
          </div>

          {selectedAlbum.images.length === 0 ? (
            <div className="text-center py-20 border border-luxury-border rounded-sm bg-luxury-bg-sec/50">
              <p className="text-luxury-text-sec text-sm">Photographs for this collection are currently being curated and will be published shortly.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {selectedAlbum.images.map((img, index) => (
                <motion.div
                  key={img.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.06 }}
                  onClick={() => setActiveImageIndex(index)}
                  className="group relative cursor-pointer overflow-hidden rounded-sm bg-luxury-bg-sec border border-luxury-border shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
                >
                  {/* Photo Display */}
                  <div className="relative aspect-[4/5] sm:aspect-[3/4] w-full overflow-hidden bg-black/10">
                    <img
                      src={img.src}
                      alt={img.title || `Photograph ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      loading="lazy"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-luxury-gold text-xs font-mono tracking-widest uppercase block mb-1">
                            {String(index + 1).padStart(2, '0')} / {String(selectedAlbum.images.length).padStart(2, '0')}
                          </span>
                          <h3 className="text-white font-serif text-lg font-medium leading-snug">
                            {img.title || `Portrait ${index + 1}`}
                          </h3>
                          {img.caption && (
                            <p className="text-white/70 text-xs mt-1 line-clamp-2 font-light">
                              {img.caption}
                            </p>
                          )}
                        </div>
                        <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20 group-hover:scale-110 transition-transform">
                          <Maximize2 size={16} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Caption beneath card */}
                  <div className="p-4 border-t border-luxury-border/50 bg-luxury-bg-sec flex items-center justify-between">
                    <div>
                      <h4 className="font-serif text-sm font-semibold text-luxury-text group-hover:text-luxury-gold transition-colors">
                        {img.title || `Photograph ${index + 1}`}
                      </h4>
                      {img.caption && (
                        <p className="text-[11px] text-luxury-text-sec line-clamp-1 mt-0.5">
                          {img.caption}
                        </p>
                      )}
                    </div>
                    <span className="text-[10px] font-mono text-luxury-text-sec px-2 py-0.5 rounded bg-luxury-bg border border-luxury-border">
                      #{index + 1}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Previous / Next Project Navigation Bar */}
        <div className="border-t border-luxury-border pt-12 flex flex-col sm:flex-row items-center justify-between gap-6">
          <button
            onClick={() => selectAlbum(prevAlbum.id)}
            className="group flex items-center gap-4 text-left p-4 rounded-sm border border-luxury-border hover:border-luxury-gold/40 hover:bg-luxury-bg-sec transition-all w-full sm:w-auto cursor-pointer"
          >
            <ChevronLeft size={24} className="text-luxury-gold transition-transform group-hover:-translate-x-1" />
            <div>
              <span className="text-[10px] tracking-widest uppercase text-luxury-text-sec block">
                Previous Project
              </span>
              <span className="font-serif font-bold text-base text-luxury-text group-hover:text-luxury-gold transition-colors">
                {prevAlbum.title}
              </span>
            </div>
          </button>

          <button
            onClick={() => selectAlbum(null)}
            className="btn-outline !py-2.5 !px-6 text-xs uppercase tracking-widest"
          >
            View All Portfolios
          </button>

          <button
            onClick={() => selectAlbum(nextAlbum.id)}
            className="group flex items-center justify-end gap-4 text-right p-4 rounded-sm border border-luxury-border hover:border-luxury-gold/40 hover:bg-luxury-bg-sec transition-all w-full sm:w-auto cursor-pointer"
          >
            <div>
              <span className="text-[10px] tracking-widest uppercase text-luxury-text-sec block">
                Next Project
              </span>
              <span className="font-serif font-bold text-base text-luxury-text group-hover:text-luxury-gold transition-colors">
                {nextAlbum.title}
              </span>
            </div>
            <ChevronRight size={24} className="text-luxury-gold transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activeImageIndex !== null && currentLightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[3000] bg-black/95 backdrop-blur-xl flex flex-col justify-between"
          >
            {/* Lightbox Top Bar */}
            <div className="flex items-center justify-between p-6 z-10 text-white">
              <div>
                <span className="text-xs uppercase tracking-widest text-luxury-gold font-mono block">
                  {selectedAlbum.title} • {activeImageIndex + 1} of {selectedAlbum.images.length}
                </span>
                <h3 className="font-serif text-lg font-medium text-white/95 mt-0.5">
                  {currentLightboxImage.title}
                </h3>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    const win = window.open(currentLightboxImage.src, '_blank');
                    win?.focus();
                  }}
                  className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                  title="Open full image in new tab"
                >
                  <Maximize2 size={18} />
                </button>
                <button
                  onClick={() => setActiveImageIndex(null)}
                  className="p-2.5 rounded-full bg-luxury-gold/20 hover:bg-luxury-gold/40 text-luxury-gold transition-colors cursor-pointer"
                  title="Close (Esc)"
                >
                  <X size={22} />
                </button>
              </div>
            </div>

            {/* Lightbox Main Image Stage */}
            <div className="relative flex-1 flex items-center justify-center p-4 sm:p-12 overflow-hidden select-none">
              {/* Prev Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImageIndex(
                    (activeImageIndex - 1 + selectedAlbum.images.length) %
                      selectedAlbum.images.length
                  );
                }}
                className="absolute left-4 sm:left-8 z-20 p-3 sm:p-4 rounded-full bg-black/50 hover:bg-luxury-gold/80 text-white transition-all backdrop-blur-md cursor-pointer border border-white/10"
                aria-label="Previous image"
              >
                <ChevronLeft size={28} />
              </button>

              <motion.img
                key={currentLightboxImage.src}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                src={currentLightboxImage.src}
                alt={currentLightboxImage.title}
                className="max-h-[78vh] max-w-[90vw] object-contain rounded-sm shadow-2xl"
              />

              {/* Next Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImageIndex((activeImageIndex + 1) % selectedAlbum.images.length);
                }}
                className="absolute right-4 sm:right-8 z-20 p-3 sm:p-4 rounded-full bg-black/50 hover:bg-luxury-gold/80 text-white transition-all backdrop-blur-md cursor-pointer border border-white/10"
                aria-label="Next image"
              >
                <ChevronRight size={28} />
              </button>
            </div>

            {/* Lightbox Caption Bottom Bar */}
            <div className="p-6 bg-black/70 backdrop-blur-md border-t border-white/10 text-center">
              {currentLightboxImage.caption ? (
                <p className="text-white/80 text-sm font-light max-w-2xl mx-auto">
                  {currentLightboxImage.caption}
                </p>
              ) : (
                <p className="text-white/40 text-xs italic">
                  Photographed by Deepak Dhumak Photography
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProjectDetailView;
