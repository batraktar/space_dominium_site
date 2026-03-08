import React, { useState, useEffect } from 'react';
import { ShoppingBag, Star, MapPin, Calendar, Clock, Menu, Search, Home, Heart, User, Loader2, Check, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScenarioConfig, MenuItem } from '../types';

interface ClientPanelProps {
  onOrder: (item?: MenuItem) => void;
  config: ScenarioConfig;
  isMobileView?: boolean;
}

export const ClientPanel: React.FC<ClientPanelProps> = ({ onOrder, config, isMobileView = false }) => {
  const [buttonState, setButtonState] = useState<'idle' | 'loading' | 'success'>('idle');
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const fallbackImage = 'images/fallback-product.svg';

  // Reset button state when scenario changes
  useEffect(() => {
    setButtonState('idle');
    setActiveItemId(null);
  }, [config.id]);

  const handleOrderClick = (item?: MenuItem) => {
    if (buttonState !== 'idle') return;

    if (item) {
      setActiveItemId(item.id);
    }

    setButtonState('loading');
    
    // Trigger the particle animation immediately
    onOrder(item);

    // Simulate processing time slightly decoupled from the particle
    setTimeout(() => {
      setButtonState('success');
      
      // Reset back to idle after showing success message
      setTimeout(() => {
        setButtonState('idle');
        setActiveItemId(null);
      }, 2000);
    }, 600);
  };

  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement>) => {
    const image = event.currentTarget;
    if (image.dataset.fallbackApplied === '1') return;
    image.dataset.fallbackApplied = '1';
    image.src = fallbackImage;
  };

  // Dynamic color classes based on theme
  const getThemeColors = () => {
    switch (config.colorTheme) {
      case 'rose': return { bg: 'bg-rose-600', text: 'text-rose-700', blur: 'bg-rose-100', badge: 'text-rose-600', light: 'bg-rose-50' };
      case 'indigo': return { bg: 'bg-indigo-600', text: 'text-indigo-700', blur: 'bg-indigo-100', badge: 'text-indigo-600', light: 'bg-indigo-50' };
      default: return { bg: 'bg-amber-600', text: 'text-amber-700', blur: 'bg-amber-100', badge: 'text-yellow-400', light: 'bg-amber-50' };
    }
  };

  const theme = getThemeColors();

  const renderSingleProduct = () => (
    <motion.div 
      className="flex flex-col items-center w-full px-4 pb-20 pt-2"
    >
      <motion.div 
        className="relative group w-full aspect-square mb-6 rounded-2xl overflow-hidden shadow-lg"
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <img 
          src={config.image} 
          alt={config.productName} 
          className="w-full h-full object-cover"
          onError={handleImageError}
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg shadow-sm z-20 flex items-center gap-1">
          <Star size={12} className={theme.badge} />
          <span className="text-xs font-bold text-gray-800">4.9</span>
        </div>
      </motion.div>

      <div className="w-full space-y-3">
        <div className="flex justify-between items-start">
          <h2 className="text-2xl font-bold text-gray-900 leading-tight">{config.productName}</h2>
          <div className={`text-xl font-bold ${theme.text}`}>
            {config.price} <span className="text-sm font-normal text-gray-500">{config.currency}</span>
          </div>
        </div>

        <p className="text-gray-500 text-sm leading-relaxed">{config.productDesc}</p>
        
        {/* Contextual Pills */}
        <div className="flex flex-wrap gap-2 pt-1">
          {config.id === 'hotel' && (
            <>
              <span className={`flex items-center gap-1 text-[10px] ${theme.text} ${theme.light} px-2 py-1 rounded-md font-medium`}>
                <Calendar size={10} /> 1 Ніч
              </span>
              <span className={`flex items-center gap-1 text-[10px] ${theme.text} ${theme.light} px-2 py-1 rounded-md font-medium`}>
                <MapPin size={10} /> Центр
              </span>
            </>
          )}
          {config.id === 'rental' && (
             <span className={`flex items-center gap-1 text-[10px] ${theme.text} ${theme.light} px-2 py-1 rounded-md font-medium`}>
                <Clock size={10} /> 1 Доба
              </span>
          )}
        </div>
      </div>
    </motion.div>
  );

  const renderMenuGrid = () => (
    <div className="w-full px-4 pb-20 pt-2">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-900">Меню</h2>
        <p className="text-xs text-gray-500">Оберіть смаколик до кави</p>
      </div>
      {/* Perspective container for 3D effect */}
      <div className="grid grid-cols-2 gap-3" style={{ perspective: '1000px' }}>
        {config.menu?.map((item) => (
          <motion.div
            key={item.id}
            onClick={() => handleOrderClick(item)}
            /* 3D Flip Animation Logic */
            animate={{ 
              rotateY: activeItemId === item.id ? 360 : 0,
              scale: activeItemId === item.id ? 1.05 : 1,
              zIndex: activeItemId === item.id ? 10 : 0
            }}
            transition={{ 
              duration: 0.8, 
              ease: "easeInOut",
              type: "spring",
              stiffness: 260,
              damping: 20
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 flex flex-col gap-2 relative overflow-hidden cursor-pointer"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 relative">
               <img
                 src={item.image}
                 alt={item.name}
                 className="w-full h-full object-cover"
                 onError={handleImageError}
               />
               <button 
                className={`absolute bottom-1 right-1 p-1.5 rounded-full ${theme.bg} text-white shadow-md transition-transform`}
                disabled={buttonState !== 'idle'}
               >
                 {activeItemId === item.id && buttonState === 'loading' ? <Loader2 size={14} className="animate-spin" /> : 
                  activeItemId === item.id && buttonState === 'success' ? <Check size={14} /> : <Plus size={14} />}
               </button>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-800 leading-tight">{item.name}</h3>
              <p className={`text-xs font-bold ${theme.text} mt-0.5`}>{item.price} {config.currency}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  return (
    <div className={`w-full h-full ${isMobileView ? 'bg-white' : 'bg-gray-50 p-4 md:p-8'} flex flex-col items-center justify-center relative border-b md:border-b-0 md:border-r border-gray-200 transition-colors duration-500 overflow-hidden`}>
      
      {/* Mobile Simulation Frame */}
      <div className={`w-full ${isMobileView ? 'h-full rounded-none shadow-none border-none' : 'max-w-[360px] bg-white rounded-3xl shadow-xl border border-gray-200 h-[600px] md:h-[650px]'} overflow-hidden flex flex-col relative transition-all duration-300`}>
        
        {/* Mobile Status Bar Simulation - Hide on actual mobile view */}
        {!isMobileView && (
          <div className="h-6 bg-white border-b border-gray-50 flex justify-between items-center px-4 text-[10px] text-gray-800 font-medium select-none">
            <span>09:41</span>
            <div className="flex gap-1">
               <div className="w-3 h-2 bg-gray-800 rounded-[1px]"></div>
               <div className="w-0.5 h-2 bg-gray-800/30 rounded-[1px]"></div>
            </div>
          </div>
        )}

        {/* Mobile App Header */}
        <div className="flex justify-between items-center px-4 py-3 sticky top-0 bg-white/90 backdrop-blur-sm z-10">
          <Menu size={20} className="text-gray-600" />
          <span className="font-bold text-lg tracking-tight text-gray-900">{config.id === 'coffee' ? 'CoffeeHouse' : config.id === 'hotel' ? 'GrandHotel' : 'RentPro'}</span>
          <div className="relative">
            <ShoppingBag size={20} className="text-gray-600" />
            <div className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${theme.bg}`}></div>
          </div>
        </div>

        {/* Content Scroll Area */}
        <div className="flex-1 overflow-y-auto hide-scrollbar relative">
          <AnimatePresence mode="wait">
            <motion.div 
              key={config.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {config.menu ? renderMenuGrid() : renderSingleProduct()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Floating Action Button Area (Only for non-menu scenarios) */}
        {!config.menu && (
          <div
            className={`absolute left-0 right-0 p-4 bg-gradient-to-t from-white via-white to-transparent pt-10 ${
              isMobileView ? 'bottom-14' : 'bottom-0'
            }`}
          >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleOrderClick()}
                disabled={buttonState !== 'idle'}
                className={`w-full ${buttonState === 'success' ? 'bg-green-500' : theme.bg} text-white py-3.5 rounded-xl font-semibold text-base shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 relative overflow-hidden`}
              >
                <AnimatePresence mode="wait">
                  {buttonState === 'loading' ? (
                     <motion.div
                       key="loading"
                       initial={{ opacity: 0, y: 10 }}
                       animate={{ opacity: 1, y: 0 }}
                       exit={{ opacity: 0, y: -10 }}
                       className="flex items-center gap-2"
                     >
                       <Loader2 className="animate-spin" size={20} />
                       <span>Обробка...</span>
                     </motion.div>
                  ) : buttonState === 'success' ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex items-center gap-2"
                    >
                      <Check size={20} />
                      <span>Готово!</span>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="idle"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center gap-2"
                    >
                      <span>{config.buttonText}</span>
                      <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
          </div>
        )}

        {/* Fake Bottom Navigation */}
        <div className="h-14 border-t border-gray-100 flex justify-around items-center bg-white text-gray-400">
             <Home size={20} className={theme.text} />
             <Search size={20} />
             <Heart size={20} />
             <User size={20} />
        </div>
        
        {/* Mobile Home Indicator - Hide on actual mobile view */}
        {!isMobileView && (
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-gray-200 rounded-full"></div>
        )}
      </div>
      
      {!isMobileView && (
        <p className="text-xs text-gray-400 mt-4 text-center md:hidden">
          Симуляція мобільного екрану
        </p>
      )}
    </div>
  );
};
