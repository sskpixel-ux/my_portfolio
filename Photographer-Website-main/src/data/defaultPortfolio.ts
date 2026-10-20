import type { PortfolioAlbum } from '../types/portfolio';

import imgGroomPortrait from '../assets/drive-download-20260827T173643Z-1-001/0U8A8365.JPG';
import imgRings from '../assets/drive-download-20260827T173643Z-1-001/746A0496.JPG';
import imgGarland from '../assets/drive-download-20260827T173643Z-1-001/IMG_5817.JPG';
import imgCoupleWarm from '../assets/drive-download-20260827T173643Z-1-001/IMG_6011.JPG';
import imgCandidSmile from '../assets/drive-download-20260827T173643Z-1-001/IMG_9380.JPG';
import imgTraditionalCouple from '../assets/drive-download-20260827T173643Z-1-001/IMG_9692.JPG';
import imgCandidAdditional from '../assets/drive-download-20260827T173643Z-1-001/IMG_20240321_222515_575.jpg';

export const initialAlbums: PortfolioAlbum[] = [
  {
    id: 'portrait-session',
    title: 'Portrait Session',
    category: 'Portraiture',
    coverImage: imgGroomPortrait,
    description: 'A study in character, dignity, and natural emotion. Every frame captures the unique persona through sculpted light and authentic expressions.',
    date: 'March 2026',
    location: 'Mumbai, India',
    images: [
      {
        id: 'ps-1',
        src: imgGroomPortrait,
        title: 'Portrait 1 - Royal Heritage',
        caption: 'Traditional attire highlighted by gentle directional studio lighting.'
      },
      {
        id: 'ps-2',
        src: imgCandidAdditional,
        title: 'Portrait 2 - Candid Gaze',
        caption: 'Natural contrast capturing raw expression and quiet poise.'
      },
      {
        id: 'ps-3',
        src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1200&auto=format&fit=crop',
        title: 'Portrait 3 - Golden Hour Radiance',
        caption: 'Warm ambient sunset glow illuminating soft facial contours.'
      },
      {
        id: 'ps-4',
        src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1200&auto=format&fit=crop',
        title: 'Portrait 4 - Executive Character',
        caption: 'Structured editorial portrait with dramatic monochrome shadows.'
      },
      {
        id: 'ps-5',
        src: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1200&auto=format&fit=crop',
        title: 'Portrait 5 - Natural Simplicity',
        caption: 'Serene outdoor portraiture emphasizing genuine warmth.'
      },
      {
        id: 'ps-6',
        src: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1200&auto=format&fit=crop',
        title: 'Portrait 6 - Depth & Focus',
        caption: 'Close-range telephoto lens portrait with creamy cinematic bokeh.'
      }
    ]
  },
  {
    id: 'event-coverage',
    title: 'Event Coverage',
    category: 'Celebrations',
    coverImage: imgRings,
    description: 'Documenting the sacred vows, grand milestones, and intimate details that make life-changing occasions unforgettable.',
    date: 'February 2026',
    location: 'Pune & Alibaug',
    images: [
      {
        id: 'ec-1',
        src: imgRings,
        title: 'Event 1 - The Sacred Rings',
        caption: 'Macro luxury detail of bespoke wedding bands resting on velvet.'
      },
      {
        id: 'ec-2',
        src: imgGarland,
        title: 'Event 2 - Varmala Ritual',
        caption: 'Handcrafted floral garlands marking the auspicious union.'
      },
      {
        id: 'ec-3',
        src: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop',
        title: 'Event 3 - Grand Venue Ambience',
        caption: 'Fairy lights and golden chandeliers cascading across the reception hall.'
      },
      {
        id: 'ec-4',
        src: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=1200&auto=format&fit=crop',
        title: 'Event 4 - Walk to Mandap',
        caption: 'Emotionally charged walkway framed by close friends and family.'
      },
      {
        id: 'ec-5',
        src: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1200&auto=format&fit=crop',
        title: 'Event 5 - Evening Toast',
        caption: 'Glasses raised under twilight skies celebrating enduring love.'
      }
    ]
  },
  {
    id: 'candid-moments',
    title: 'Candid Moments',
    category: 'Documentary',
    coverImage: imgGarland,
    description: 'Unposed, unfiltered, and deeply felt. The laughter between words, tears of happiness, and spontaneous glances captured as they truly happened.',
    date: 'January 2026',
    location: 'Thane',
    images: [
      {
        id: 'cm-1',
        src: imgGarland,
        title: 'Candid 1 - Shared Vows',
        caption: 'A quiet, reverent moment during traditional sacred vows.'
      },
      {
        id: 'cm-2',
        src: imgCandidSmile,
        title: 'Candid 2 - Uncontainable Joy',
        caption: 'The bride laughing heartily at an inside joke during rituals.'
      },
      {
        id: 'cm-3',
        src: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1200&auto=format&fit=crop',
        title: 'Candid 3 - Whispers of Love',
        caption: 'Spontaneous tender moment behind the bridal curtain.'
      },
      {
        id: 'cm-4',
        src: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?q=80&w=1200&auto=format&fit=crop',
        title: 'Candid 4 - The Happy Tear',
        caption: 'A parent watching with eyes brimming with pride and love.'
      },
      {
        id: 'cm-5',
        src: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=1200&auto=format&fit=crop',
        title: 'Candid 5 - Midnight Dancing',
        caption: 'High energy celebration under spinning strobe lights.'
      }
    ]
  },
  {
    id: 'fashion-shoot',
    title: 'Fashion Shoot',
    category: 'Editorial',
    coverImage: imgCoupleWarm,
    description: 'Where textile artistry meets creative direction. Dramatic angles, curated styling, and bespoke color grading for modern lookbooks.',
    date: 'December 2025',
    location: 'Studio & Heritage Fort',
    images: [
      {
        id: 'fs-1',
        src: imgCoupleWarm,
        title: 'Fashion 1 - Velvet & Silk Elegance',
        caption: 'Rich crimson sherwani paired with an intricately embroidered zari saree.'
      },
      {
        id: 'fs-2',
        src: imgTraditionalCouple,
        title: 'Fashion 2 - Heritage Textures',
        caption: 'High fashion couture shoot against textured rustic stone architecture.'
      },
      {
        id: 'fs-3',
        src: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1200&auto=format&fit=crop',
        title: 'Fashion 3 - Avant-Garde Draping',
        caption: 'Contemporary silhouetting celebrating modern Indian fashion.'
      },
      {
        id: 'fs-4',
        src: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop',
        title: 'Fashion 4 - High Glamour Minimalist',
        caption: 'Clean lines, tailored silhouettes, and high contrast lighting.'
      },
      {
        id: 'fs-5',
        src: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1200&auto=format&fit=crop',
        title: 'Fashion 5 - Haute Streetwear',
        caption: 'Bold outdoor editorial bringing runway aesthetics to urban landscapes.'
      }
    ]
  },
  {
    id: 'lifestyle',
    title: 'Lifestyle',
    category: 'Storytelling',
    coverImage: imgCandidSmile,
    description: 'Authentic daily narratives captured with warm cinematic depth. Celebrating the beauty of ordinary moments turned into art.',
    date: 'November 2025',
    location: 'Goa Coastline',
    images: [
      {
        id: 'ls-1',
        src: imgCandidSmile,
        title: 'Lifestyle 1 - Spontaneous Delight',
        caption: 'Real laughter in golden sunlight reflecting natural chemistry.'
      },
      {
        id: 'ls-2',
        src: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1200&auto=format&fit=crop',
        title: 'Lifestyle 2 - Serene Waterways',
        caption: 'A tranquil boat ride under misty morning sunlight.'
      },
      {
        id: 'ls-3',
        src: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1200&auto=format&fit=crop',
        title: 'Lifestyle 3 - Road Ahead',
        caption: 'Scenic road trip memories captured with vintage warmth.'
      },
      {
        id: 'ls-4',
        src: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=1200&auto=format&fit=crop',
        title: 'Lifestyle 4 - Sunset Conversations',
        caption: 'Coffee and reflection as the sun dips beneath the horizon.'
      }
    ]
  },
  {
    id: 'editorial',
    title: 'Editorial',
    category: 'Commercial & Concept',
    coverImage: imgTraditionalCouple,
    description: 'Concept-driven photographic campaigns with cinematic storytelling, bespoke styling, and fine-art color science.',
    date: 'October 2025',
    location: 'Mumbai Art District',
    images: [
      {
        id: 'ed-1',
        src: imgTraditionalCouple,
        title: 'Editorial 1 - Royal Romance',
        caption: 'Timeless elegance balancing formal posture with intimate tenderness.'
      },
      {
        id: 'ed-2',
        src: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1200&auto=format&fit=crop',
        title: 'Editorial 2 - Noir & Light',
        caption: 'Studio chiaroscuro lighting sculpting dramatic cheekbones.'
      },
      {
        id: 'ed-3',
        src: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=1200&auto=format&fit=crop',
        title: 'Editorial 3 - Vivid Gaze',
        caption: 'High resolution commercial beauty shot emphasizing soulful eyes.'
      },
      {
        id: 'ed-4',
        src: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1200&auto=format&fit=crop',
        title: 'Editorial 4 - Magazine Cover Study',
        caption: 'Sleek luxury framing tailored for editorial print spreads.'
      }
    ]
  }
];
