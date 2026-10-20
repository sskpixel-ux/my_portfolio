import { useState, useRef, type FC, type ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import {
  Layers,
  FolderPlus,
  Edit,
  Trash2,
  Upload,
  Plus,
  Save,
  RotateCcw,
  Check,
  AlertCircle,
  LogOut,
  ExternalLink,
  ArrowLeft,
  Image as ImageIcon,
  Camera,
  ShieldCheck,
  Loader2,
  Download
} from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../lib/utils';
import { uploadToImgBB } from '../../services/imgbb';
import type { PortfolioImage } from '../../types/portfolio';

const CATEGORIES = [
  'Portraiture',
  'Celebrations',
  'Documentary',
  'Editorial',
  'Storytelling',
  'Commercial & Concept',
  'Pre-Wedding',
  'Maternity',
  'Fashion'
];

interface AdminPanelProps {
  onBackToSite: () => void;
}

const AdminPanel: FC<AdminPanelProps> = ({ onBackToSite }) => {
  const { logout } = useAuth();
  const {
    albums,
    addAlbum,
    updateAlbum,
    deleteAlbum,
    addImagesToAlbum,
    removeImageFromAlbum,
    resetToDefaults
  } = usePortfolio();

  const [activeTab, setActiveTab] = useState<'manage' | 'create' | 'edit-photos'>('manage');
  const [currentEditId, setCurrentEditId] = useState<string | null>(albums[0]?.id || null);

  // New Album Form
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState(CATEGORIES[0]);
  const [newCover, setNewCover] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newLocation, setNewLocation] = useState('Mumbai, India');
  const [newDate, setNewDate] = useState('October 2026');

  // Single Photo URL input
  const [singlePhotoUrl, setSinglePhotoUrl] = useState('');
  const [singlePhotoTitle, setSinglePhotoTitle] = useState('');
  const [singlePhotoCaption, setSinglePhotoCaption] = useState('');

  // Status message
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const newAlbumCoverFileRef = useRef<HTMLInputElement>(null);

  const showStatus = (text: string, type: 'success' | 'error' = 'success') => {
    setStatusMessage({ text, type });
    setTimeout(() => setStatusMessage(null), 3500);
  };

  const editingAlbum = albums.find((a) => a.id === currentEditId) || null;
  const totalPhotos = albums.reduce((acc, curr) => acc + curr.images.length, 0);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');

  // Handle uploading multiple local files from computer directly to ImgBB CDN
  const handleMultipleFilesUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !editingAlbum) return;

    setIsUploading(true);
    const totalFiles = files.length;
    const currentCount = editingAlbum.images.length;
    const newImages: Omit<PortfolioImage, 'id'>[] = [];

    for (let index = 0; index < totalFiles; index++) {
      const file = files[index];
      setUploadProgress(`Uploading image ${index + 1} of ${totalFiles} to ImgBB CDN...`);

      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      const suggestedTitle = `${editingAlbum.title.split(' ')[0]} ${currentCount + index + 1} (${cleanName})`;

      // Upload to ImgBB
      const res = await uploadToImgBB(file, cleanName);

      if (res.success && res.displayUrl) {
        newImages.push({
          src: res.displayUrl,
          title: suggestedTitle,
          caption: `Hosted on ImgBB CDN`
        });
      } else {
        // Fallback to local data URL if network/API fails
        const fallbackSrc = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (event) => resolve(event.target?.result as string);
          reader.readAsDataURL(file);
        });
        newImages.push({
          src: fallbackSrc,
          title: suggestedTitle,
          caption: `Uploaded image: ${file.name}`
        });
      }
    }

    addImagesToAlbum(editingAlbum.id, newImages);
    if (!editingAlbum.coverImage && newImages[0]?.src) {
      updateAlbum(editingAlbum.id, { coverImage: newImages[0].src });
    }

    setIsUploading(false);
    setUploadProgress('');
    showStatus(`Successfully uploaded ${newImages.length} photographs to ImgBB CDN!`);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Handle cover image file upload to ImgBB
  const handleCoverUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress('Uploading cover photograph to ImgBB CDN...');

    const res = await uploadToImgBB(file, `${newTitle || 'Cover'} Photo`);

    if (res.success && res.displayUrl) {
      setNewCover(res.displayUrl);
      showStatus('Cover photograph uploaded to ImgBB!');
    } else {
      const reader = new FileReader();
      reader.onload = (event) => {
        setNewCover(event.target?.result as string);
        showStatus('Cover photograph loaded locally!');
      };
      reader.readAsDataURL(file);
    }

    setIsUploading(false);
    setUploadProgress('');
  };

  // Add single photo via URL
  const handleAddPhotoByUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!singlePhotoUrl.trim() || !editingAlbum) return;

    const nextNumber = editingAlbum.images.length + 1;
    const title = singlePhotoTitle.trim() || `${editingAlbum.title.split(' ')[0]} ${nextNumber}`;

    addImagesToAlbum(editingAlbum.id, [
      {
        src: singlePhotoUrl.trim(),
        title,
        caption: singlePhotoCaption.trim() || 'Curated portfolio piece'
      }
    ]);

    setSinglePhotoUrl('');
    setSinglePhotoTitle('');
    setSinglePhotoCaption('');
    showStatus('Photograph added successfully!');
  };

  // Handle create album
  const handleCreateAlbum = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      showStatus('Please provide an album title', 'error');
      return;
    }

    const cover =
      newCover.trim() ||
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1200&auto=format&fit=crop';

    const newId = addAlbum({
      title: newTitle.trim(),
      category: newCategory,
      coverImage: cover,
      description:
        newDescription.trim() ||
        `Exclusive ${newTitle} collection by Deepak Dhumak Photography.`,
      location: newLocation.trim(),
      date: newDate.trim(),
      images: [
        {
          id: `img-${Date.now()}-1`,
          src: cover,
          title: `${newTitle} 1 - Opening Frame`,
          caption: 'Featured collection photograph'
        }
      ]
    });

    setNewTitle('');
    setNewCover('');
    setNewDescription('');
    showStatus('New Album created successfully!');
    setCurrentEditId(newId);
    setActiveTab('edit-photos');
  };

  return (
    <div className="min-h-screen bg-[#070C16] text-white flex flex-col">
      {/* Top Admin Header */}
      <header className="bg-[#0B1322] border-b border-luxury-gold/30 sticky top-0 z-50 px-6 py-4">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-sm bg-luxury-gold/20 border border-luxury-gold/40 flex items-center justify-center text-luxury-gold">
              <Camera size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-lg text-white">
                  DEEPAK <span className="text-luxury-gold italic">DHUMAK</span>
                </span>
                <span className="px-2 py-0.5 bg-luxury-gold/20 text-luxury-gold border border-luxury-gold/30 text-[9px] font-mono uppercase tracking-widest rounded">
                  Admin Panel
                </span>
              </div>
              <p className="text-[10px] text-white/50 tracking-wider uppercase font-mono">
                Portfolio Management Studio
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onBackToSite}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-luxury-gold border border-luxury-gold/40 hover:bg-luxury-gold/15 rounded-sm transition-all cursor-pointer"
            >
              <ExternalLink size={14} />
              <span>View Live Website</span>
            </button>

            <button
              onClick={() => {
                logout();
                onBackToSite();
              }}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-red-400 hover:text-white hover:bg-red-500/20 border border-red-500/30 rounded-sm transition-all cursor-pointer"
            >
              <LogOut size={14} />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* ImgBB Uploading Banner */}
      {isUploading && (
        <div className="bg-luxury-gold/20 border-b border-luxury-gold/40 px-6 py-3 flex items-center justify-center gap-3 text-xs font-semibold uppercase tracking-wider text-luxury-gold sticky top-[68px] z-40 backdrop-blur-md">
          <Loader2 size={16} className="animate-spin text-luxury-gold" />
          <span>{uploadProgress || 'Uploading to ImgBB CDN...'}</span>
        </div>
      )}

      {/* Status banner */}
      {statusMessage && !isUploading && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className={cn(
            'px-6 py-3 flex items-center justify-center gap-2 text-xs font-medium sticky top-[68px] z-40',
            statusMessage.type === 'error'
              ? 'bg-red-500/20 text-red-300 border-b border-red-500/30'
              : 'bg-emerald-500/20 text-emerald-300 border-b border-emerald-500/30'
          )}
        >
          {statusMessage.type === 'error' ? <AlertCircle size={15} /> : <Check size={15} />}
          <span>{statusMessage.text}</span>
        </motion.div>
      )}

      {/* Main Body */}
      <main className="flex-1 container mx-auto px-6 py-8 max-w-7xl">
        {/* Statistics Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="p-5 rounded-sm bg-[#0D1626] border border-white/5 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-widest text-luxury-gold block">
                Total Collections
              </span>
              <span className="text-3xl font-serif font-bold text-white mt-1 block">
                {albums.length}
              </span>
            </div>
            <div className="w-12 h-12 rounded-sm bg-luxury-gold/10 flex items-center justify-center text-luxury-gold">
              <Layers size={22} />
            </div>
          </div>

          <div className="p-5 rounded-sm bg-[#0D1626] border border-white/5 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-widest text-luxury-gold block">
                Total Photographs
              </span>
              <span className="text-3xl font-serif font-bold text-white mt-1 block">
                {totalPhotos}
              </span>
            </div>
            <div className="w-12 h-12 rounded-sm bg-luxury-gold/10 flex items-center justify-center text-luxury-gold">
              <ImageIcon size={22} />
            </div>
          </div>

          <div className="p-5 rounded-sm bg-[#0D1626] border border-white/5 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-400 block">
                Access Level
              </span>
              <span className="text-xl font-serif font-bold text-white mt-1 flex items-center gap-1.5">
                <ShieldCheck size={18} className="text-emerald-400" />
                <span>Owner / Admin</span>
              </span>
            </div>
            <button
              onClick={() => setActiveTab('create')}
              className="btn-gold !py-2 !px-4 text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
            >
              <Plus size={14} />
              <span>New Album</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/10 mb-8 bg-[#0B1322] rounded-t-sm text-xs font-semibold uppercase tracking-wider overflow-x-auto">
          <button
            onClick={() => setActiveTab('manage')}
            className={cn(
              'px-6 py-4 flex items-center gap-2 border-b-2 transition-colors cursor-pointer whitespace-nowrap',
              activeTab === 'manage'
                ? 'border-luxury-gold text-luxury-gold bg-luxury-gold/5'
                : 'border-transparent text-white/60 hover:text-white'
            )}
          >
            <Layers size={15} />
            <span>All Portfolio Works ({albums.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('create')}
            className={cn(
              'px-6 py-4 flex items-center gap-2 border-b-2 transition-colors cursor-pointer whitespace-nowrap',
              activeTab === 'create'
                ? 'border-luxury-gold text-luxury-gold bg-luxury-gold/5'
                : 'border-transparent text-white/60 hover:text-white'
            )}
          >
            <FolderPlus size={15} />
            <span>Create New Collection</span>
          </button>

          {editingAlbum && (
            <button
              onClick={() => setActiveTab('edit-photos')}
              className={cn(
                'px-6 py-4 flex items-center gap-2 border-b-2 transition-colors cursor-pointer whitespace-nowrap',
                activeTab === 'edit-photos'
                  ? 'border-luxury-gold text-luxury-gold bg-luxury-gold/5'
                  : 'border-transparent text-white/60 hover:text-white'
              )}
            >
              <Edit size={15} />
              <span>Photos in: {editingAlbum.title} ({editingAlbum.images.length})</span>
            </button>
          )}
        </div>

        {/* TAB 1: ALL ALBUMS */}
        {activeTab === 'manage' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-serif font-bold text-white">
                  Portfolio Works Management
                </h3>
                <p className="text-xs text-white/50 mt-1">
                  Click 'Manage Photos' on any album to add new shoots or upload photographs from your computer.
                </p>
              </div>

              <button
                onClick={() => setActiveTab('create')}
                className="btn-gold !py-2.5 !px-5 text-xs uppercase tracking-wider flex items-center gap-2"
              >
                <Plus size={14} />
                <span>Add New Album</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {albums.map((album) => (
                <div
                  key={album.id}
                  className="rounded-sm border border-white/10 bg-[#0D1626] overflow-hidden hover:border-luxury-gold/40 transition-all flex flex-col justify-between"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-black/40">
                    <img
                      src={album.coverImage}
                      alt={album.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 bg-black/70 backdrop-blur-md text-luxury-gold text-[10px] font-mono uppercase tracking-widest rounded-sm border border-luxury-gold/20">
                        {album.category}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className="px-2.5 py-1 bg-black/70 backdrop-blur-md text-white text-[10px] font-medium tracking-wider rounded-sm flex items-center gap-1 border border-white/10">
                        <Camera size={11} className="text-luxury-gold" />
                        {album.images.length} photos
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-serif font-bold text-lg text-white mb-2">
                        {album.title}
                      </h4>
                      <p className="text-xs text-white/60 line-clamp-2 font-light mb-4">
                        {album.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                      <button
                        onClick={() => {
                          setCurrentEditId(album.id);
                          setActiveTab('edit-photos');
                        }}
                        className="btn-outline !py-1.5 !px-4 text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                      >
                        <Edit size={13} />
                        <span>Manage Photos</span>
                      </button>

                      <button
                        onClick={() => {
                          if (
                            confirm(
                              `Are you sure you want to permanently delete the "${album.title}" album?`
                            )
                          ) {
                            deleteAlbum(album.id);
                            showStatus(`Deleted "${album.title}"`);
                          }
                        }}
                        className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 p-2 cursor-pointer"
                        title="Delete album"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Reset Defaults */}
            <div className="p-6 rounded-sm bg-[#0B1322] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 mt-12">
              <div className="flex items-center gap-3">
                <AlertCircle size={20} className="text-luxury-gold flex-shrink-0" />
                <div>
                  <h5 className="text-sm font-semibold text-white">Default Collections Reset</h5>
                  <p className="text-xs text-white/50">
                    Want to revert all portfolio works back to the initial Deepak Dhumak default set?
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(albums, null, 2));
                    const downloadAnchor = document.createElement('a');
                    downloadAnchor.setAttribute("href", dataStr);
                    downloadAnchor.setAttribute("download", `deepak-portfolio-data-${new Date().toISOString().slice(0, 10)}.json`);
                    document.body.appendChild(downloadAnchor);
                    downloadAnchor.click();
                    downloadAnchor.remove();
                    showStatus('Exported portfolio backup JSON!');
                  }}
                  className="px-4 py-2 text-xs uppercase tracking-wider text-luxury-gold border border-luxury-gold/40 hover:bg-luxury-gold/15 rounded-sm transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Download size={13} />
                  <span>Download Backup JSON</span>
                </button>

                <button
                  onClick={() => {
                    if (
                      confirm(
                        'Are you sure you want to restore the default portfolio? Any custom uploads will be replaced with the default collections.'
                      )
                    ) {
                      resetToDefaults();
                      showStatus('Restored to default portfolio!');
                    }
                  }}
                  className="px-4 py-2 text-xs uppercase tracking-wider text-white/70 hover:text-luxury-gold border border-white/10 hover:border-luxury-gold/40 rounded-sm transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <RotateCcw size={13} />
                  <span>Reset to Defaults</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CREATE ALBUM */}
        {activeTab === 'create' && (
          <div className="max-w-3xl mx-auto p-8 rounded-sm bg-[#0D1626] border border-luxury-gold/30">
            <div className="mb-8 border-b border-white/10 pb-4">
              <h3 className="text-2xl font-serif font-bold text-white">
                Create New Portfolio Collection
              </h3>
              <p className="text-xs text-white/50 mt-1">
                Fill in the details for the new photography shoot or project.
              </p>
            </div>

            <form onSubmit={handleCreateAlbum} className="space-y-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-luxury-gold mb-1.5">
                  Collection Title *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Royal Wedding, Studio Noir, Maternity Glow"
                  className="w-full px-4 py-3 bg-[#070c16] border border-white/10 rounded-sm text-sm text-white focus:outline-none focus:border-luxury-gold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-luxury-gold mb-1.5">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-4 py-3 bg-[#070c16] border border-white/10 rounded-sm text-sm text-white focus:outline-none focus:border-luxury-gold"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-luxury-gold mb-1.5">
                    Shoot Date / Season
                  </label>
                  <input
                    type="text"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    placeholder="e.g. October 2026"
                    className="w-full px-4 py-3 bg-[#070c16] border border-white/10 rounded-sm text-sm text-white focus:outline-none focus:border-luxury-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-luxury-gold mb-1.5">
                  Location
                </label>
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  placeholder="e.g. Mumbai, Goa, Alibaug"
                  className="w-full px-4 py-3 bg-[#070c16] border border-white/10 rounded-sm text-sm text-white focus:outline-none focus:border-luxury-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-luxury-gold mb-1.5">
                  Story & Description
                </label>
                <textarea
                  rows={4}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Describe the aesthetic, vibe, and moments captured in this project..."
                  className="w-full px-4 py-3 bg-[#070c16] border border-white/10 rounded-sm text-sm text-white focus:outline-none focus:border-luxury-gold"
                />
              </div>

              {/* Cover Image Upload / URL */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-luxury-gold mb-1.5">
                  Cover Photograph
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={newCover}
                    onChange={(e) => setNewCover(e.target.value)}
                    placeholder="Paste Image URL or choose file from device ->"
                    className="flex-1 px-4 py-3 bg-[#070c16] border border-white/10 rounded-sm text-sm text-white focus:outline-none focus:border-luxury-gold"
                  />
                  <input
                    type="file"
                    ref={newAlbumCoverFileRef}
                    accept="image/*"
                    onChange={handleCoverUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => newAlbumCoverFileRef.current?.click()}
                    className="btn-outline !py-3 !px-5 text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
                  >
                    <Upload size={14} />
                    <span>Upload from Device</span>
                  </button>
                </div>

                {newCover && (
                  <div className="mt-3 flex items-center gap-4 p-3 bg-[#070c16] border border-white/10 rounded-sm">
                    <img
                      src={newCover}
                      alt="Cover preview"
                      className="w-20 h-20 object-cover rounded-sm border border-luxury-gold/40"
                    />
                    <span className="text-xs text-white/70">Cover photograph preview</span>
                  </div>
                )}
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setActiveTab('manage')}
                  className="px-6 py-2.5 text-xs uppercase tracking-wider text-white/50 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-gold !py-3 !px-8 text-xs uppercase tracking-widest font-bold flex items-center gap-2"
                >
                  <Save size={15} />
                  <span>Create & Proceed to Photos</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 3: EDIT PHOTOS */}
        {activeTab === 'edit-photos' && editingAlbum && (
          <div className="space-y-6">
            {/* Header with quick file upload */}
            <div className="p-6 rounded-sm bg-[#0D1626] border border-luxury-gold/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <img
                  src={editingAlbum.coverImage}
                  alt={editingAlbum.title}
                  className="w-20 h-20 object-cover rounded-sm border border-luxury-gold/40 flex-shrink-0"
                />
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-widest text-luxury-gold">
                    Editing Album
                  </span>
                  <h3 className="text-2xl font-serif font-bold text-white">
                    {editingAlbum.title}
                  </h3>
                  <p className="text-xs text-white/60 mt-0.5">
                    {editingAlbum.category} • {editingAlbum.images.length} Photographs
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  multiple
                  accept="image/*"
                  onChange={handleMultipleFilesUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="btn-gold !py-3 !px-6 text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-xl font-bold"
                >
                  <Upload size={16} />
                  <span>Upload Photos from Device</span>
                </button>
              </div>
            </div>

            {/* Quick URL upload */}
            <div className="p-5 rounded-sm bg-[#0B1322] border border-white/10">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-luxury-gold mb-3 flex items-center gap-1.5">
                <Plus size={14} />
                <span>Or Add Photo by URL</span>
              </h4>
              <form onSubmit={handleAddPhotoByUrl} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <input
                  type="text"
                  required
                  value={singlePhotoUrl}
                  onChange={(e) => setSinglePhotoUrl(e.target.value)}
                  placeholder="Image URL (https://...)"
                  className="sm:col-span-2 px-3 py-2 bg-[#070c16] border border-white/10 rounded-sm text-xs text-white focus:outline-none focus:border-luxury-gold"
                />
                <input
                  type="text"
                  value={singlePhotoTitle}
                  onChange={(e) => setSinglePhotoTitle(e.target.value)}
                  placeholder={`Title (e.g. ${editingAlbum.title.split(' ')[0]} ${editingAlbum.images.length + 1})`}
                  className="px-3 py-2 bg-[#070c16] border border-white/10 rounded-sm text-xs text-white focus:outline-none focus:border-luxury-gold"
                />
                <button
                  type="submit"
                  className="btn-outline !py-2 !px-4 text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus size={14} />
                  <span>Add Photo</span>
                </button>
              </form>
            </div>

            {/* Photographs Grid */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-base font-serif font-bold text-white">
                  Photographs in this Collection ({editingAlbum.images.length})
                </h4>
                <span className="text-xs text-white/50">
                  Hover over any photo to delete or set as album cover
                </span>
              </div>

              {editingAlbum.images.length === 0 ? (
                <div className="text-center py-16 border border-dashed border-white/10 rounded-sm bg-[#0D1626]">
                  <ImageIcon size={36} className="mx-auto text-luxury-gold/50 mb-3" />
                  <p className="text-sm text-white/60 mb-4">No photographs in this collection yet.</p>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="btn-gold !py-2.5 !px-6 text-xs uppercase tracking-wider inline-flex items-center gap-2"
                  >
                    <Upload size={14} />
                    <span>Select Photos from Computer</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {editingAlbum.images.map((photo, index) => (
                    <div
                      key={photo.id || index}
                      className="group relative rounded-sm overflow-hidden border border-white/10 bg-[#0D1626] aspect-square"
                    >
                      <img
                        src={photo.src}
                        alt={photo.title}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono text-luxury-gold">
                            #{index + 1}
                          </span>
                          <button
                            onClick={() => {
                              removeImageFromAlbum(editingAlbum.id, photo.id);
                              showStatus(`Removed "${photo.title}"`);
                            }}
                            className="p-1.5 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-colors cursor-pointer"
                            title="Delete photo"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>

                        <div>
                          <p className="text-white text-xs font-serif font-medium line-clamp-1">
                            {photo.title}
                          </p>
                          {editingAlbum.coverImage !== photo.src ? (
                            <button
                              onClick={() => {
                                updateAlbum(editingAlbum.id, { coverImage: photo.src });
                                showStatus('Set as cover photo!');
                              }}
                              className="text-[10px] text-luxury-gold hover:underline mt-1 block"
                            >
                              Make Cover Photo
                            </button>
                          ) : (
                            <span className="text-[9px] uppercase tracking-wider text-green-400 block mt-1">
                              ✓ Current Cover
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-white/10 flex justify-between items-center">
              <button
                onClick={() => setActiveTab('manage')}
                className="flex items-center gap-2 text-xs uppercase tracking-wider text-white/60 hover:text-luxury-gold transition-colors cursor-pointer"
              >
                <ArrowLeft size={14} />
                <span>Back to All Collections</span>
              </button>

              <button
                onClick={onBackToSite}
                className="btn-gold !py-2.5 !px-6 text-xs uppercase tracking-widest font-bold"
              >
                View on Live Site
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPanel;
