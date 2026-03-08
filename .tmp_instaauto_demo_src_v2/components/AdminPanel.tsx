import React, { useEffect, useRef, useState } from 'react';
import { Database, Send, Calendar, User, Printer, CheckCircle, MapPin, Zap, Terminal, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, ResponsiveContainer, YAxis } from 'recharts';
import { Order, Notification, ChartData, ScenarioConfig } from '../types';

interface AdminPanelProps {
  orders: Order[];
  notifications: Notification[];
  revenue: number;
  chartData: ChartData[];
  config: ScenarioConfig;
}

// Sound effect logic
const playNotificationSound = () => {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(880, audioContext.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(440, audioContext.currentTime + 0.1);
  gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.1);
};

interface FloatingProfit {
  id: number;
  value: number;
}

interface LogEntry {
  id: number;
  text: string;
  color: string;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ orders, notifications, revenue, chartData, config }) => {
  const prevOrdersLen = useRef(orders.length);
  const [floatingProfits, setFloatingProfits] = useState<FloatingProfit[]>([]);
  const [systemLogs, setSystemLogs] = useState<LogEntry[]>([
    { id: 1, text: 'Система ініціалізована...', color: 'text-green-400' },
    { id: 2, text: 'Очікування подій...', color: 'text-slate-500' }
  ]);
  const logsEndRef = useRef<HTMLDivElement>(null);
  const logsContainerRef = useRef<HTMLDivElement>(null);
  const fallbackImage = 'images/fallback-product.svg';

  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement>) => {
    const image = event.currentTarget;
    if (image.dataset.fallbackApplied === '1') return;
    image.dataset.fallbackApplied = '1';
    image.src = fallbackImage;
  };

  // Auto-scroll logs only inside terminal container.
  useEffect(() => {
    const el = logsContainerRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [systemLogs]);

  useEffect(() => {
    if (orders.length > prevOrdersLen.current) {
      playNotificationSound();
      
      // 1. Trigger Floating Profit Animation
      const latestOrder = orders[0];
      const amount = config.id === 'rental' ? 1 : (latestOrder ? latestOrder.amount : config.price);
      
      const newProfit = { id: Date.now() + Math.random(), value: amount };
      setFloatingProfits(prev => [...prev, newProfit]);
      
      // Remove after animation
      setTimeout(() => {
        setFloatingProfits(prev => prev.filter(p => p.id !== newProfit.id));
      }, 2000);

      // 2. Trigger System Logs
      addSystemLogs();

      prevOrdersLen.current = orders.length;
    }
  }, [orders, config.price, config.id]);

  const addSystemLogs = () => {
    const actions = [
      { text: `> Отримано запит: ${config.id.toUpperCase()}_ORDER`, color: 'text-white' },
      { text: `> Платіжний шлюз: Перевірка... ОК`, color: 'text-green-400' },
      { text: `> Склад: Резерв ресурсу ID #${Math.floor(Math.random() * 9000)}`, color: 'text-blue-400' },
      { text: `> SMM-робот: Відправка "дякую" та знижки`, color: 'text-purple-400' },
      { text: `> CRM: Синхронізація клієнтської бази... ОК`, color: 'text-green-400' },
    ];

    let delay = 0;
    actions.forEach((action, index) => {
      setTimeout(() => {
        setSystemLogs(prev => [...prev.slice(-6), { id: Date.now() + index, ...action }]);
      }, delay);
      delay += 300; // Staggered typing effect
    });
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'Processing': return 'Готується';
      case 'Booked': return 'Підтверджено';
      case 'Rented': return 'В оренді';
      case 'Completed': return 'Видано';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Processing': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'Booked': return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
      case 'Rented': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
    }
  };

  // --- WIDGETS ---

  // 1. Hotel Floor Plan Widget
  const renderHotelWidget = () => {
    const floors = [
      { level: 2, rooms: ['201', '202', '203', '204'] },
      { level: 1, rooms: ['101', '102', '103', '104'] },
    ];

    return (
      <div className="h-full flex flex-col">
        <div className="flex justify-between items-end mb-3">
          <span className="text-xs text-slate-400 uppercase font-semibold flex items-center gap-1">
            <MapPin size={12} />
            Карта Готелю
          </span>
          <div className="flex gap-3">
             <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-rose-500 rounded-full shadow-[0_0_5px_rgba(244,63,94,0.8)] animate-pulse"></div>
              <span className="text-[10px] text-rose-300 font-medium">Зайнято</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
              <span className="text-[10px] text-slate-400">Вільно</span>
            </div>
          </div>
        </div>
        
        <div className="flex-1 flex flex-col justify-around relative">
          <div className="absolute left-0 top-2 bottom-2 w-px bg-slate-700/50"></div>

          {floors.map((floor) => (
            <div key={floor.level} className="flex flex-col gap-1 pl-3">
               <span className="text-[9px] text-slate-500 font-mono tracking-widest">ПОВЕРХ 0{floor.level}</span>
               <div className="grid grid-cols-4 gap-2">
                 {floor.rooms.map((roomNum) => {
                   let isOccupied = orders.some(o => o.id === roomNum && o.status !== 'Completed');
                   
                   // Demo visualization logic
                   if (!isOccupied) {
                      isOccupied = orders.some(o => {
                          const idNum = parseInt(o.id);
                          return !isNaN(idNum) && o.status !== 'Completed' && idNum > 204 && floor.level === 2 && (idNum % 4 + 1).toString() === roomNum.slice(-1);
                      });
                   }
                   if (['102', '201'].includes(roomNum)) isOccupied = true;

                   return (
                     <motion.div
                       key={roomNum}
                       layout
                       initial={{ opacity: 0, scale: 0.8 }}
                       animate={{ 
                         opacity: 1, 
                         scale: 1,
                         backgroundColor: isOccupied ? 'rgba(244, 63, 94, 0.15)' : 'rgba(30, 41, 59, 0.4)',
                         borderColor: isOccupied ? 'rgba(244, 63, 94, 0.4)' : 'rgba(51, 65, 85, 0.4)'
                       }}
                       transition={{ duration: 0.5 }}
                       className={`
                         relative h-10 rounded-md border flex flex-col items-center justify-center cursor-default overflow-hidden
                         ${isOccupied ? 'shadow-[inset_0_0_10px_rgba(244,63,94,0.1)]' : 'hover:border-slate-500'}
                       `}
                     >
                       <span className={`text-[10px] font-bold z-10 ${isOccupied ? 'text-rose-300' : 'text-slate-500'}`}>
                         {roomNum}
                       </span>
                       
                       {isOccupied && (
                           <motion.div 
                             initial={{ opacity: 0, y: 5 }}
                             animate={{ opacity: 1, y: 0 }}
                             className="absolute bottom-0.5 right-1"
                           >
                             <User size={8} className="text-rose-500/80" />
                           </motion.div>
                       )}
                       
                       <div className={`absolute top-0 left-0 bottom-0 w-0.5 ${isOccupied ? 'bg-rose-500' : 'bg-emerald-500/30'}`}></div>
                     </motion.div>
                   );
                 })}
               </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // 2. Rental Fleet Status
  const renderRentalWidget = () => (
    <div className="h-full flex flex-col justify-center gap-4 min-h-[120px]">
      <div>
        <div className="flex justify-between text-xs mb-1">
          <span className="text-slate-400">В оренді</span>
          <span className="text-indigo-400 font-bold">{revenue} шт</span>
        </div>
        <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${(revenue / 20) * 100}%` }}
            className="h-full bg-indigo-500"
          />
        </div>
      </div>
      <div>
        <div className="flex justify-between text-xs mb-1">
          <span className="text-slate-400">На зарядці</span>
          <span className="text-yellow-400 font-bold">4 шт</span>
        </div>
        <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
          <div className="h-full bg-yellow-400 w-1/4"></div>
        </div>
      </div>
      <div>
        <div className="flex justify-between text-xs mb-1">
          <span className="text-slate-400">Доступно</span>
          <span className="text-green-400 font-bold">8 шт</span>
        </div>
        <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
          <div className="h-full bg-green-500 w-2/5"></div>
        </div>
      </div>
    </div>
  );

  // 3. Automation Terminal
  const renderTerminalWidget = () => (
    <div className="h-full w-full bg-black/40 rounded-lg p-3 font-mono text-[10px] md:text-xs overflow-hidden flex flex-col border border-slate-700/50 min-h-[120px]">
      <div className="flex items-center gap-2 border-b border-slate-700/50 pb-2 mb-2">
        <Terminal size={12} className="text-slate-400" />
        <span className="text-slate-400 font-semibold">LIVE_LOGS</span>
        <Activity size={12} className="text-green-500 ml-auto animate-pulse" />
      </div>
      <div ref={logsContainerRef} className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden crm-scroll pr-1">
        <div className="min-h-full flex flex-col justify-end gap-1">
          <AnimatePresence>
            {systemLogs.map((log) => (
              <motion.div 
                key={log.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={`${log.color} break-words`}
              >
                {log.text}
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={logsEndRef} />
        </div>
      </div>
    </div>
  );

  // --- TABLE RENDERING ---
  const renderTableHeaders = () => {
    switch (config.id) {
      case 'hotel':
        return (
          <>
            <th className="py-3 pl-5 font-medium w-16">Кімната</th>
            <th className="py-3 font-medium">Гість / Дати</th>
            <th className="py-3 font-medium text-right pr-4">Дія</th>
          </>
        );
      case 'rental':
        return (
          <>
            <th className="py-3 pl-5 font-medium w-16">ID</th>
            <th className="py-3 font-medium">Транспорт</th>
            <th className="py-3 font-medium text-right pr-4">Локація</th>
          </>
        );
      default: // coffee
        return (
          <>
            <th className="py-3 pl-5 font-medium w-16">№</th>
            <th className="py-3 font-medium">Замовлення</th>
            <th className="py-3 font-medium text-right pr-4">Друк</th>
          </>
        );
    }
  };

  const renderTableRows = (order: Order) => {
    const themeColor = config.colorTheme === 'rose' ? 'text-rose-400' : config.colorTheme === 'indigo' ? 'text-indigo-400' : 'text-amber-400';
    
    switch (config.id) {
      case 'hotel':
        return (
          <>
            <td className={`py-3 pl-5 font-mono text-xs ${themeColor}`}>#{order.id}</td>
            <td className="py-3 min-w-0">
              <div className="flex flex-col min-w-0">
                <span className="text-slate-200 text-sm font-medium flex items-center gap-2">
                   <User size={12} className="text-slate-500" /> {order.customerName}
                </span>
                <span className="text-slate-500 text-[10px] flex items-center gap-1 mt-0.5 break-words">
                   <Calendar size={10} /> {order.meta}
                </span>
              </div>
            </td>
            <td className="py-3 pr-4 text-right">
               <button className="p-1.5 hover:bg-slate-700 rounded text-slate-400 hover:text-white transition-colors" title="Check-in">
                 <CheckCircle size={14} />
               </button>
            </td>
          </>
        );
      case 'rental':
        return (
          <>
            <td className={`py-3 pl-5 font-mono text-xs ${themeColor}`}>#{order.id}</td>
            <td className="py-3 min-w-0">
               <div className="flex flex-col min-w-0">
                 <span className="text-slate-200 text-sm break-words">{order.product}</span>
                 <div className="flex items-center gap-1.5 mt-0.5">
                    <div className="w-8 h-1 bg-slate-700 rounded-full overflow-hidden">
                       <div 
                         className={`h-full ${parseInt(order.meta || '0') > 50 ? 'bg-green-400' : 'bg-yellow-400'}`} 
                         style={{ width: order.meta || '100%' }}
                       ></div>
                    </div>
                    <span className="text-[10px] text-slate-400"><Zap size={8} className="inline" /> {order.meta}</span>
                 </div>
               </div>
            </td>
            <td className="py-3 pr-4 text-right">
               <button className="p-1.5 hover:bg-slate-700 rounded text-slate-400 hover:text-indigo-400 transition-colors" title="GPS Track">
                 <MapPin size={14} />
               </button>
            </td>
          </>
        );
      default: // coffee
        return (
          <>
            <td className={`py-3 pl-5 font-mono text-xs ${themeColor}`}>#{order.id}</td>
            <td className="py-3 min-w-0">
              <div className="flex flex-col min-w-0">
                 <span className="text-slate-200 text-sm break-words">{order.product}</span>
                 <span className="text-slate-500 text-[10px]">{order.amount} грн • {order.time}</span>
              </div>
            </td>
            <td className="py-3 pr-4 text-right">
               <button className="p-1.5 hover:bg-slate-700 rounded text-slate-400 hover:text-amber-400 transition-colors" title="Print Check">
                 <Printer size={14} />
               </button>
            </td>
          </>
        );
    }
  };

  return (
    <div className="w-full h-full bg-slate-900 text-slate-100 flex flex-col p-4 md:p-8 relative overflow-y-auto overflow-x-hidden border-l border-transparent">
      {/* Background Decor */}
      <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none opacity-20 transition-colors duration-500
        ${config.colorTheme === 'rose' ? 'bg-rose-500' : config.colorTheme === 'indigo' ? 'bg-indigo-500' : 'bg-amber-500'}`}>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center mb-6 md:mb-8 pb-4 border-b border-slate-800 z-10 shrink-0">
        <div className="flex items-center gap-2">
          <Database className={config.colorTheme === 'rose' ? 'text-rose-400' : config.colorTheme === 'indigo' ? 'text-indigo-400' : 'text-amber-400'} size={20} />
          <span className="font-semibold tracking-wide uppercase text-sm md:text-base">{config.adminTitle}</span>
        </div>
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                ОНЛАЙН
            </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-6 z-10 min-h-0 pb-20 md:pb-0">
        
        {/* Top Section - Stacks on mobile */}
        <div className="flex flex-col md:flex-row gap-6 md:h-80 h-auto shrink-0">
          
          {/* Smartphone */}
          <div className="w-full md:w-1/2 bg-black rounded-3xl border-4 border-slate-700 shadow-2xl relative overflow-hidden flex flex-col h-64 md:h-auto">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 bg-black rounded-b-xl z-20"></div>
            
            <div className="flex-1 bg-slate-900 pt-8 px-3 relative overflow-hidden">
              <img 
                src="images/coffee-hero.svg"
                className="absolute inset-0 w-full h-full object-cover opacity-20"
                alt="Wallpaper"
                onError={handleImageError}
              />
              
              <div className="relative z-10 space-y-3">
                <div className="text-center text-white/50 text-xs font-medium mb-4">
                  {new Date().toLocaleTimeString('uk-UA', {hour: '2-digit', minute:'2-digit'})}
                </div>
                
                <AnimatePresence>
                  {notifications.slice(0, 3).map((notif) => (
                    <motion.div
                      key={notif.id}
                      initial={{ x: 50, opacity: 0, filter: 'blur(10px)' }}
                      animate={{ x: 0, opacity: 1, filter: 'blur(0px)' }}
                      exit={{ x: -50, opacity: 0 }}
                      className={`
                        backdrop-blur-md border p-3 rounded-xl shadow-lg
                        bg-white/10 border-white/20
                      `}
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-1.5 rounded-full shrink-0 flex items-center justify-center bg-sky-500">
                          <Send size={12} className="text-white fill-white pr-0.5 pt-0.5" />
                        </div>
                        <div className="overflow-hidden w-full">
                          <div className="flex justify-between items-baseline">
                            <h4 className="text-xs font-bold text-white">{notif.title}</h4>
                            <span className="text-[9px] text-slate-400 ml-2">now</span>
                          </div>
                          <p className="text-[10px] text-slate-200 leading-tight mt-0.5 opacity-90 break-words">
                            {notif.message}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Business Specific Widget Card */}
          <div className="w-full md:w-1/2 bg-slate-800/50 rounded-2xl border border-slate-700 hover:border-slate-600 p-5 flex flex-col backdrop-blur-sm h-48 md:h-auto transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
             <div className="mb-4">
               <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">
                 {config.id === 'coffee' ? 'Каса (Готівка + Карта)' : config.id === 'hotel' ? 'Статус Готелю' : 'Стан Флоту'}
               </h3>
               {config.id === 'coffee' && (
                 <div className="flex items-baseline gap-1 relative">
                   <span className="text-2xl font-bold text-white transition-all">{revenue.toLocaleString('uk-UA')}</span>
                   <span className="text-sm text-slate-400">грн</span>
                   
                   {/* Floating Profit Animation */}
                   <AnimatePresence>
                    {floatingProfits.map(p => (
                      <motion.div
                        key={p.id}
                        initial={{ opacity: 0, y: 10, scale: 0.5 }}
                        animate={{ opacity: 1, y: -20, scale: 1.2 }}
                        exit={{ opacity: 0, y: -40 }}
                        transition={{ duration: 1 }}
                        className="absolute left-0 -top-8 text-green-400 font-bold text-lg"
                      >
                        +{p.value}
                      </motion.div>
                    ))}
                   </AnimatePresence>
                 </div>
               )}
             </div>

             <div className="flex-1 min-h-0">
                {config.id === 'hotel' ? renderHotelWidget() : config.id === 'rental' ? renderRentalWidget() : renderTerminalWidget()}
             </div>
          </div>
        </div>

        {/* Bottom Section: CRM Table */}
        <div className="flex-1 bg-slate-800/50 rounded-2xl border border-slate-700 overflow-hidden flex flex-col backdrop-blur-sm h-64 md:h-auto min-h-0 transition-colors duration-300">
          <div className="px-5 py-3 border-b border-slate-700 bg-slate-800/80 flex justify-between items-center shrink-0">
             <span className="text-xs font-semibold text-slate-300 uppercase">
               {config.id === 'coffee' ? 'Черга замовлень' : config.id === 'hotel' ? 'Графік заїздів' : 'Активні сесії'}
             </span>
             <div className="flex gap-2">
               <div className="w-2 h-2 rounded-full bg-red-400"></div>
               <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
               <div className="w-2 h-2 rounded-full bg-green-400"></div>
             </div>
          </div>
          
          <div className="flex-1 overflow-y-auto overflow-x-hidden crm-scroll p-0">
            <table className="w-full text-left border-collapse table-fixed">
              <thead className="sticky top-0 bg-slate-800/95 backdrop-blur-sm z-10 shadow-sm">
                <tr className="text-xs text-slate-500 border-b border-slate-700/50">
                  {renderTableHeaders()}
                  <th className="py-3 pr-5 text-right font-medium">Стан</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <AnimatePresence initial={false} mode="popLayout">
                  {orders.map((order) => (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0, y: -20, backgroundColor: "rgba(255, 255, 255, 0.05)" }}
                      animate={{ opacity: 1, y: 0, backgroundColor: "transparent" }}
                      transition={{ duration: 0.4 }}
                      layout
                      className="border-b border-slate-700/30 group hover:bg-slate-700/30 transition-colors"
                    >
                      {renderTableRows(order)}
                      <td className="py-3 pr-5 text-right whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${getStatusColor(order.status)}`}>
                          {getStatusLabel(order.status)}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
