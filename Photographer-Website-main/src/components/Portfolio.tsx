import type { FC } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Camera } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

const Portfolio: FC = () => {
    const { albums, selectAlbum } = usePortfolio();

    return (
        <section id="portfolio" className="py-20 sm:py-32 bg-luxury-bg relative transition-colors duration-500">
            <div className="container mx-auto px-6">
                <div className="flex flex-col items-center text-center mb-16 sm:mb-20">
                    <span className="section-subtitle">Selected Works</span>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6 transition-colors duration-500 text-luxury-text">
                        Portfolio
                    </h2>
                    <div className="section-divider"></div>
                    <p className="max-w-3xl mx-auto text-luxury-text-sec mt-2 text-base sm:text-lg font-light leading-relaxed transition-colors duration-500">
                        Explore a curated selection of recent photography projects, showcasing a diverse range of styles and subjects. Click any collection to explore all photographs.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {albums.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: index * 0.1 }}
                            onClick={() => selectAlbum(item.id)}
                            className="group relative overflow-hidden bg-luxury-bg-sec rounded-sm shadow-lg border border-luxury-border hover:border-luxury-gold/50 cursor-pointer transition-all duration-500 hover:-translate-y-1.5"
                        >
                            <div className="relative h-88 sm:h-96 w-full overflow-hidden">
                                <img 
                                    src={item.coverImage} 
                                    alt={item.title} 
                                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" 
                                />

                                {/* Badge */}
                                <div className="absolute top-4 left-4 z-10">
                                    <span className="px-3 py-1 bg-black/60 backdrop-blur-md text-luxury-gold text-[10px] font-mono tracking-widest uppercase rounded-sm border border-luxury-gold/20">
                                        {item.category}
                                    </span>
                                </div>

                                <div className="absolute top-4 right-4 z-10">
                                    <span className="px-2.5 py-1 bg-black/60 backdrop-blur-md text-white/90 text-[10px] font-medium tracking-wider rounded-sm flex items-center gap-1 border border-white/10">
                                        <Camera size={11} className="text-luxury-gold" />
                                        {item.images.length}
                                    </span>
                                </div>

                                {/* Dark Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent sm:opacity-80 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6 sm:p-8">
                                    <div className="translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                                        <div className="flex items-center gap-2 mb-2 text-luxury-gold text-xs font-mono tracking-widest uppercase">
                                            <Sparkles size={12} />
                                            <span>Explore Album</span>
                                        </div>

                                        <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-2 leading-tight">
                                            {item.title}
                                        </h3>

                                        <p className="text-white/70 text-xs sm:text-sm line-clamp-2 font-light mb-4">
                                            {item.description}
                                        </p>

                                        <div className="inline-flex items-center gap-2 text-luxury-gold text-xs font-semibold uppercase tracking-wider group/link">
                                            <span>View All Photographs</span>
                                            <ArrowRight size={14} className="transition-transform group-hover/link:translate-x-1" />
                                        </div>
                                    </div>

                                    <div className="w-12 h-px bg-luxury-gold mt-4 group-hover:w-full transition-all duration-700"></div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Portfolio;
