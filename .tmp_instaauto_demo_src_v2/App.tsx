import React, { useState, useCallback, useEffect } from 'react';
import { Coffee, Hotel, Bike, Smartphone, LayoutDashboard } from 'lucide-react';
import { ClientPanel } from './components/ClientPanel';
import { AdminPanel } from './components/AdminPanel';
import { ParticleOverlay } from './components/ParticleOverlay';
import { Order, Notification, ChartData, ScenarioConfig, ScenarioType, MenuItem } from './types';

const SHOWCASE_IMAGE_BASE = 'images';
const showcaseImage = (fileName: string) => `${SHOWCASE_IMAGE_BASE}/${fileName}`;

// Random Data Generators
const NAMES = ["Олександр К.", "Марія В.", "Андрій П.", "Олена С.", "Максим Д.", "Юлія Т."];
const getRandomName = () => NAMES[Math.floor(Math.random() * NAMES.length)];
const getRandomDate = () => {
  const d = new Date();
  d.setDate(d.getDate() + Math.floor(Math.random() * 10));
  return `${d.getDate()}.${d.getMonth() + 1} - ${d.getDate() + 2}.${d.getMonth() + 1}`;
};
const getRandomBattery = () => Math.floor(Math.random() * 20 + 80) + "%";

// Configuration for different business scenarios
const SCENARIOS: Record<ScenarioType, ScenarioConfig> = {
  coffee: {
    id: 'coffee',
    label: 'Кав\'ярня',
    productName: 'Капучино Класік',
    productDesc: 'Меню закладу',
    price: 85,
    currency: 'грн',
    image: showcaseImage('coffee-cappuccino.png'),
    buttonText: 'Замовити',
    colorTheme: 'amber',
    icon: Coffee,
    adminTitle: 'Кабінет Власника',
    botPrefix: 'Нове замовлення',
    menu: [
      { id: 'cappuccino', name: 'Капучино', price: 65, image: showcaseImage('coffee-cappuccino.png') },
      { id: 'croissant', name: 'Круасан', price: 55, image: showcaseImage('coffee-croissant.png') },
      { id: 'latte', name: 'Матча Лате', price: 85, image: showcaseImage('coffee-latte.png') },
      { id: 'cheesecake', name: 'Чізкейк', price: 95, image: showcaseImage('coffee-cheesecake.png') }
    ]
  },
  hotel: {
    id: 'hotel',
    label: 'Готель',
    productName: 'Номер "Делюкс"',
    productDesc: 'Просторий номер з видом на місто, king-size ліжком та сніданком.',
    price: 1500,
    currency: 'грн',
    image: showcaseImage('hotel-room.png'),
    buttonText: 'Забронювати',
    colorTheme: 'rose',
    icon: Hotel,
    adminTitle: 'Система Бронювання',
    botPrefix: 'Нова бронь'
  },
  rental: {
    id: 'rental',
    label: 'Прокат',
    productName: 'Електросамокат Pro',
    productDesc: 'Добова оренда. Запас ходу 45км, швидкість до 25 км/год.',
    price: 350,
    currency: 'грн',
    image: showcaseImage('rental-scooter.png'),
    buttonText: 'Орендувати',
    colorTheme: 'indigo',
    icon: Bike,
    adminTitle: 'Менеджер Прокату',
    botPrefix: 'Оренда почалась'
  }
};

const MOCK_DATA = {
  coffee: [
    { id: '1244', product: 'Еспресо', amount: 45, time: '10:42', status: 'Completed' },
    { id: '1243', product: 'Лате', amount: 65, time: '10:30', status: 'Completed' },
    { id: '1242', product: 'Американо', amount: 40, time: '10:15', status: 'Completed' },
    { id: '1241', product: 'Круасан', amount: 55, time: '09:50', status: 'Completed' },
    { id: '1240', product: 'Чай', amount: 35, time: '09:45', status: 'Completed' },
  ],
  hotel: [
    { id: '204', product: 'Люкс', amount: 2500, time: '10:15', status: 'Booked', customerName: 'Іван Д.', meta: '24.10 - 27.10' },
    { id: '203', product: 'Стандарт', amount: 1200, time: '09:30', status: 'Booked', customerName: 'Ольга М.', meta: '25.10 - 26.10' },
    { id: '101', product: 'Стандарт', amount: 1200, time: 'Вчора', status: 'Completed', customerName: 'Петро С.', meta: '23.10 - 24.10' },
  ],
  rental: [
    { id: '892', product: 'Самокат Xiaomi', amount: 350, time: '10:10', status: 'Rented', meta: '98%' },
    { id: '891', product: 'Велосипед', amount: 200, time: '09:55', status: 'Rented', meta: 'N/A' },
    { id: '890', product: 'GoPro Hero', amount: 400, time: '09:00', status: 'Rented', meta: '100%' },
  ]
};

export default function App() {
  const [activeScenario, setActiveScenario] = useState<ScenarioType>('coffee');
  const [isMobile, setIsMobile] = useState(false);
  const [isEmbedMode, setIsEmbedMode] = useState(false);
  const [mobileView, setMobileView] = useState<'client' | 'admin'>('client');
  const config = SCENARIOS[activeScenario];

  const [activeParticles, setActiveParticles] = useState<number[]>([]);
  const [revenue, setRevenue] = useState(12450);
  const [orderCounter, setOrderCounter] = useState(1245);
  const [orders, setOrders] = useState<Order[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([
    { name: '1', value: 12000 },
    { name: '2', value: 12100 },
    { name: '3', value: 12150 },
    { name: '4', value: 12300 },
    { name: '5', value: 12450 },
  ]);
  
  const [pendingItem, setPendingItem] = useState<MenuItem | undefined>(undefined);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    setIsEmbedMode(params.get('embed') === '1');
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      const visualWidth = window.visualViewport?.width ?? Number.POSITIVE_INFINITY;
      const cssViewportWidth = document.documentElement.clientWidth || Number.POSITIVE_INFINITY;
      const viewportWidth = Math.min(window.innerWidth, visualWidth, cssViewportWidth);
      setIsMobile(viewportWidth < 768);
    };
    const visualViewport = window.visualViewport;

    checkMobile();
    window.addEventListener('resize', checkMobile);
    visualViewport?.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
      visualViewport?.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Reset/Load data when scenario changes
  useEffect(() => {
    setOrders(MOCK_DATA[activeScenario] as Order[]);
    if (activeScenario === 'rental') {
      setRevenue(12);
    } else {
      setRevenue(activeScenario === 'hotel' ? 45000 : 12450);
    }
    setNotifications([{ id: 'init', title: 'System', message: 'Система готова до роботи', time: '09:00' }]);
    setOrderCounter(parseInt(MOCK_DATA[activeScenario][0].id));
  }, [activeScenario]);

  const handleOrderClick = useCallback((item?: MenuItem) => {
    setPendingItem(item);
    const particleId = Date.now();
    setActiveParticles((prev) => [...prev, particleId]);
  }, []);

  const handleParticleComplete = useCallback((id: number) => {
    setActiveParticles((prev) => prev.filter((p) => p !== id));

    const now = new Date();
    const timeString = now.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' });
    const newOrderId = (orderCounter + 1).toString();
    
    const orderAmount = pendingItem ? pendingItem.price : config.price;

    setOrderCounter(prev => prev + 1);
    
    let newRevenue = revenue;
    if (activeScenario === 'rental') {
      newRevenue = revenue + 1;
    } else {
      newRevenue = revenue + orderAmount;
    }
    setRevenue(newRevenue);

    setChartData(prev => {
      const newData = [...prev, { name: newOrderId, value: newRevenue }];
      return newData.slice(-15);
    });

    const newGuest = activeScenario === 'hotel' ? getRandomName() : undefined;
    const newMeta = activeScenario === 'hotel' ? getRandomDate() : activeScenario === 'rental' ? getRandomBattery() : undefined;
    const newProduct = pendingItem ? pendingItem.name : (activeScenario === 'hotel' ? 'Люкс #305' : activeScenario === 'rental' ? 'Ninebot Max' : 'Капучино');

    const newOrder: Order = {
      id: newOrderId,
      product: newProduct,
      amount: orderAmount,
      time: timeString,
      status: activeScenario === 'hotel' ? 'Booked' : activeScenario === 'rental' ? 'Rented' : 'Processing',
      customerName: newGuest,
      meta: newMeta
    };
    setOrders(prev => [newOrder, ...prev]);

    // Notifications logic
    const randomEvent = Math.random();
    let notifsToAdd: Notification[] = [];

    let botMsg = '';
    if (activeScenario === 'hotel') {
      botMsg = `Bot: 🛎️ ${config.botPrefix}: ${newGuest} • ${newProduct} • Дати: ${newMeta}`;
    } else if (activeScenario === 'rental') {
      botMsg = `Bot: 🛴 ${config.botPrefix}: ${newProduct} (ID: #${Math.floor(Math.random() * 900) + 100}) • 🔋 ${newMeta}`;
    } else {
      botMsg = `Bot: ☕ ${config.botPrefix}: ${newProduct} (1 шт) • Сума: ${orderAmount} грн`;
    }

    notifsToAdd.push({
      id: `n-${Date.now()}`,
      title: 'Telegram Bot',
      message: botMsg,
      time: timeString
    });

    if (activeScenario === 'coffee' && randomEvent > 0.3) {
       const staffNames = ['Офіціант Андрій', 'Бариста Оля', 'Офіціант Максим'];
       const staffAction = [
         `Продав десерт до кави (+${Math.floor(Math.random() * 50 + 40)} грн)`,
         `Отримав чайові через QR`,
         `Закрив стіл №4`
       ];
       notifsToAdd.push({
         id: `s-${Date.now()}`,
         title: 'Staff Monitor',
         message: `🔔 ${staffNames[Math.floor(Math.random() * staffNames.length)]}: ${staffAction[Math.floor(Math.random() * staffAction.length)]}`,
         time: timeString
       });
    } else if (activeScenario === 'hotel' && randomEvent > 0.5) {
       notifsToAdd.push({
         id: `h-${Date.now()}`,
         title: 'Reception',
         message: `📒 Хостес Ірина: Забронювала столик у ресторані (№7, 19:00)`,
         time: timeString
       });
    }

    setNotifications(prev => [...notifsToAdd, ...prev]);

  }, [revenue, orderCounter, activeScenario, config, pendingItem]);

  const embedTopPaddingClass = isEmbedMode && isMobile ? 'pt-12' : ''
  const rootClassName = isEmbedMode
    ? `h-full w-full flex flex-col bg-gray-100 font-sans overflow-hidden ${embedTopPaddingClass}`
    : 'min-h-screen flex flex-col items-center justify-start md:justify-center p-0 md:p-8 bg-gray-100 font-sans pb-20 md:pb-8 overflow-x-hidden';

  const frameClassName = isEmbedMode
    ? 'w-full flex-1 min-h-0 bg-white overflow-hidden border-0 rounded-none shadow-none flex flex-col relative transition-all duration-300'
    : `w-full max-w-6xl bg-white md:rounded-xl md:shadow-2xl overflow-hidden border-y md:border border-gray-300/50 flex flex-col relative transition-all duration-300 ${
        isMobile ? 'h-auto min-h-[calc(100vh-80px)] border-x-0' : 'h-[800px] max-h-[90vh]'
      }`;

  return (
    <div className={rootClassName}>

      {/* Browser Window Frame (Desktop) / Full Screen (Mobile) */}
      <div className={frameClassName}>
        <div
          className={`w-full overflow-x-auto no-scrollbar bg-white p-2 border-b border-gray-200 z-[90] shrink-0 sticky top-0 ${
            isEmbedMode && isMobile ? 'shadow-md' : ''
          }`}
        >
          <div className="flex justify-start gap-2 px-2 min-w-max">
            <div className="bg-white p-1 rounded-xl shadow-sm border border-gray-200 flex gap-1">
              {(Object.keys(SCENARIOS) as ScenarioType[]).map((key) => {
                const s = SCENARIOS[key];
                const Icon = s.icon;
                const isActive = activeScenario === key;
                return (
                  <button
                    key={key}
                    onClick={() => setActiveScenario(key)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all whitespace-nowrap ${
                      isActive
                        ? 'bg-gray-900 text-white shadow-md'
                        : 'text-gray-500 hover:bg-gray-100'
                    }`}
                  >
                    <Icon size={16} />
                    {s.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        
        {/* Browser Header (Desktop Only) */}
        <div className="hidden md:flex bg-gray-100 border-b border-gray-200 px-4 py-3 items-center gap-4 shrink-0">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400 border border-red-500/20"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-400 border border-yellow-500/20"></div>
            <div className="w-3 h-3 rounded-full bg-green-400 border border-green-500/20"></div>
          </div>
          
          <div className="flex-1 bg-white border border-gray-200 rounded-md px-3 py-1.5 text-xs text-gray-500 flex items-center justify-center font-mono relative shadow-sm">
            <span className="absolute left-3 opacity-50">🔒</span>
            business.ua/{activeScenario}/demo
          </div>
          <div className="w-16"></div> 
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col md:flex-row relative overflow-hidden">
          {/* Mobile View Switching Logic */}
          <div className={`w-full md:w-1/2 h-full flex flex-col ${isMobile && mobileView !== 'client' ? 'hidden' : 'flex'}`}>
             <ClientPanel onOrder={handleOrderClick} config={config} isMobileView={isMobile} />
          </div>
          
          <div className={`w-full md:w-1/2 h-full flex flex-col ${isMobile && mobileView !== 'admin' ? 'hidden' : 'flex'}`}>
            <AdminPanel 
              orders={orders} 
              notifications={notifications} 
              revenue={revenue} 
              chartData={chartData} 
              config={config}
            />
          </div>
          
          <ParticleOverlay 
            activeParticles={activeParticles} 
            onComplete={handleParticleComplete} 
            isVertical={isMobile}
          />
        </div>
      </div>

      {!isEmbedMode && (
        <div className="fixed bottom-20 text-center w-full pointer-events-none opacity-50 px-4 hidden md:block">
          <p className="text-sm text-gray-500">
            Оберіть індустрію зверху та натисніть кнопку дії, щоб побачити автоматизацію.
          </p>
        </div>
      )}

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <div
          className={`${
            isEmbedMode ? 'absolute' : 'fixed'
          } bottom-0 left-0 right-0 w-full max-w-full box-border bg-white border-t border-gray-200 px-6 py-1 flex justify-around z-[60] shadow-[0_-4px_20px_rgba(0,0,0,0.05)] pb-2`}
          style={isEmbedMode ? { paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' } : undefined}
        >
          <button 
            onClick={() => setMobileView('client')} 
            className={`flex flex-col items-center gap-0.5 p-1.5 rounded-xl transition-colors w-20 ${mobileView === 'client' ? 'text-blue-600 bg-blue-50' : 'text-gray-400 hover:bg-gray-50'}`}
          >
            <Smartphone size={20} strokeWidth={mobileView === 'client' ? 2.5 : 2} />
            <span className="text-[9px] font-semibold">Клієнт</span>
          </button>
          
          {/* Action Button in Middle (Optional, maybe for quick order?) */}
          
          <button 
            onClick={() => setMobileView('admin')} 
            className={`flex flex-col items-center gap-0.5 p-1.5 rounded-xl transition-colors w-20 relative ${
              mobileView === 'admin' 
                ? 'text-slate-800 bg-slate-100' 
                : activeParticles.length > 0 
                  ? 'text-red-500 bg-red-50 animate-pulse' 
                  : 'text-gray-400 hover:bg-gray-50'
            }`}
          >
            <LayoutDashboard size={20} strokeWidth={mobileView === 'admin' ? 2.5 : 2} />
            <span className="text-[9px] font-semibold">Адмін</span>
            
            {/* Notification Dot */}
            {activeParticles.length > 0 && mobileView !== 'admin' && (
              <span className="absolute top-1 right-4 w-2 h-2 bg-red-600 rounded-full animate-ping"></span>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
