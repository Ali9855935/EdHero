import PageTransition from '../../components/common/PageTransition';
import useCountUp from '../../hooks/useCountUp';
import { motion } from 'framer-motion';
import { 
  Users, 
  Layers, 
  TrendingUp, 
  DollarSign,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const chartData = [
  { date: 'Mon', revenue: 18000, leads: 42 },
  { date: 'Tue', revenue: 22000, leads: 58 },
  { date: 'Wed', revenue: 19500, leads: 49 },
  { date: 'Thu', revenue: 26000, leads: 72 },
  { date: 'Fri', revenue: 32000, leads: 88 },
  { date: 'Sat', revenue: 29000, leads: 64 },
  { date: 'Sun', revenue: 45200, leads: 95 },
];

export const DashboardView = () => {
  const activeLeads = useCountUp(142, 1000);
  const customers = useCountUp(89, 1000);
  const conversionRate = useCountUp(63, 1000);
  const revenue = useCountUp(45200, 1200);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 12 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 24,
      }
    },
  };

  const stats = [
    {
      name: 'Active Leads',
      value: activeLeads,
      suffix: '',
      icon: Layers,
      color: 'text-white bg-brand-500 shadow-lg shadow-brand-500/35 border border-brand-600/20',
      trend: '+12.5%',
      trendUp: true,
    },
    {
      name: 'Total Customers',
      value: customers,
      suffix: '',
      icon: Users,
      color: 'text-white bg-accent-500 shadow-lg shadow-accent-500/35 border border-accent-600/20',
      trend: '+4.3%',
      trendUp: true,
    },
    {
      name: 'Conversion Rate',
      value: conversionRate,
      suffix: '%',
      icon: TrendingUp,
      color: 'text-white bg-emerald-500 shadow-lg shadow-emerald-500/35 border border-emerald-600/20',
      trend: '-1.2%',
      trendUp: false,
    },
    {
      name: 'Monthly Revenue',
      value: revenue,
      prefix: '$',
      suffix: '',
      icon: DollarSign,
      color: 'text-white bg-amber-500 shadow-lg shadow-amber-500/35 border border-amber-600/20',
      trend: '+22.4%',
      trendUp: true,
    },
  ];

  return (
    <PageTransition>
      <div className="space-y-8">
        {/* Title */}
        <div className="flex flex-col gap-1.5">
          <h2 className="text-2xl font-bold text-white tracking-tight sm:text-3xl">
            Welcome to Dashboard
          </h2>
          <p className="text-sm text-neutralDark-400">
            Real-time analytics and overview of your CRM operations.
          </p>
        </div>

        {/* KPI Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.name}
                variants={cardVariants}
                className="bg-gradient-to-br from-neutralDark-900 to-neutralDark-950/40 border border-brand-500/10 rounded-2xl p-6 shadow-xl hover:border-brand-500/20 hover:-translate-y-0.5 hover:shadow-2xl transition-[transform,box-shadow,border-color] duration-150 ease-out group relative overflow-hidden"
              >
                {/* Background flare on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-brand-500/0 via-brand-500/0 to-brand-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none" />
                
                <div className="flex justify-between items-start">
                  <div className={`p-3 rounded-xl ${stat.color}`}>
                    <Icon size={20} />
                  </div>
                  <span 
                    className={`inline-flex items-center gap-0.5 text-xs font-semibold px-2 py-1 rounded-md border animate-slide-up opacity-0 ${
                      stat.trendUp 
                        ? 'text-emerald-400 bg-emerald-500/5 border-emerald-500/10' 
                        : 'text-rose-400 bg-rose-500/5 border-rose-500/10'
                    }`}
                    style={{ animationDelay: '1000ms' }}
                  >
                    {stat.trendUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                    {stat.trend}
                  </span>
                </div>

                <div className="mt-4">
                  <p className="text-xs font-medium text-neutralDark-400 uppercase tracking-wider">
                    {stat.name}
                  </p>
                  <p className="mt-1.5 text-3xl font-extrabold text-white tracking-tight">
                    {stat.prefix}
                    {stat.value.toLocaleString()}
                    {stat.suffix}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Details section chart & activities */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-neutralDark-900 border border-neutralDark-800 rounded-xl p-6 lg:col-span-2 space-y-4">
            <h3 className="text-base font-bold text-white">Performance Matrix</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="date" 
                    stroke="#52527a" 
                    fontSize={11} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <YAxis 
                    stroke="#52527a" 
                    fontSize={11} 
                    tickLine={false} 
                    axisLine={false}
                    tickFormatter={(v) => `$${v / 1000}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0a0b18',
                      borderColor: '#131326',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '12px'
                    }}
                    itemStyle={{ color: '#8b5cf6' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#8b5cf6" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorRevenue)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="bg-neutralDark-900 border border-neutralDark-800 rounded-xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white">Recent Activities</h3>
            <div className="space-y-4">
              {[
                { name: 'John Doe', desc: 'created a new lead', time: '10m ago' },
                { name: 'Sarah Connor', desc: 'converted to customer', time: '1h ago' },
                { name: 'James Sterling', desc: 'scheduled a meeting', time: '4h ago' },
              ].map((item, i) => (
                <div key={i} className="flex justify-between text-xs py-2 border-b border-neutralDark-800/40 last:border-0">
                  <div>
                    <span className="font-semibold text-white">{item.name}</span>
                    <span className="text-neutralDark-400 ml-1">{item.desc}</span>
                  </div>
                  <span className="text-neutralDark-500">{item.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default DashboardView;
