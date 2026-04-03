import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { CalendarDays, Cpu, Gauge, Gamepad2, Layers, Microchip, Sparkles, Zap } from 'lucide-react';
import { getProcessorBySlug } from '../data/processors';

const ProcessorDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const processor = slug ? getProcessorBySlug(slug) : undefined;

  if (!processor) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-black text-gray-900 mb-4">Processor not found</h1>
        <Link to="/" className="text-blue-600 font-bold hover:underline">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="rounded-[36px] overflow-hidden border border-gray-100 shadow-2xl bg-gradient-to-br from-black via-gray-900 to-black text-white">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center">
          <div className="p-8 md:p-14">
            <p className="text-[10px] tracking-[0.3em] uppercase font-black text-yellow-300 mb-4">
              {processor.platform} Chipset
            </p>
            <h1 className="text-4xl md:text-5xl font-black leading-tight mb-4">{processor.name}</h1>
            <p className="text-gray-300 text-lg mb-8">{processor.summary}</p>
            <div className="grid grid-cols-2 gap-4">
              <Metric label="Antutu Score" value={processor.antutuScore.toLocaleString()} icon={<Gauge size={16} />} />
              <Metric label="Gaming Score" value={`${processor.gamingScore}/100`} icon={<Gamepad2 size={16} />} />
              <Metric label="Multitasking" value={`${processor.multitaskingScore}/100`} icon={<Layers size={16} />} />
              <Metric label="Max Clock" value={processor.clockSpeed} icon={<Zap size={16} />} />
            </div>
          </div>

          <div className="relative h-full min-h-[420px] flex items-center justify-center p-10">
            <div className="absolute h-72 w-72 rounded-full bg-yellow-400/20 blur-3xl animate-pulse"></div>
            <div className="absolute h-52 w-52 rounded-full border border-yellow-300/30 animate-spin-slow"></div>
            <img
              src={processor.image}
              alt={processor.name}
              className="relative z-10 w-56 h-56 object-contain animate-float drop-shadow-[0_20px_40px_rgba(255,204,0,0.35)]"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  `https://via.placeholder.com/700x700?text=${encodeURIComponent(processor.name)}`;
              }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-10">
        <SpecCard title="Launch Date" value={new Date(processor.launchDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} icon={<CalendarDays size={18} className="text-blue-600" />} />
        <SpecCard title="Fabrication" value={processor.fabrication} icon={<Microchip size={18} className="text-blue-600" />} />
        <SpecCard title="CPU Cores" value={processor.cpuCores} icon={<Cpu size={18} className="text-blue-600" />} />
        <SpecCard title="GPU" value={processor.gpu} icon={<Sparkles size={18} className="text-blue-600" />} />
        <SpecCard title="AI Engine" value={processor.aiEngine} icon={<Layers size={18} className="text-blue-600" />} />
        <SpecCard title="Brand / Platform" value={`${processor.brand} / ${processor.platform}`} icon={<Gauge size={18} className="text-blue-600" />} />
      </div>

      <div className="mt-10 flex flex-wrap gap-4">
        <Link to="/compare" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-black">
          Compare Smartphones
        </Link>
        <Link to="/" className="bg-gray-900 hover:bg-black text-white px-6 py-3 rounded-2xl font-black">
          Back to Home
        </Link>
      </div>
    </div>
  );
};

const Metric: React.FC<{ label: string; value: string; icon: React.ReactNode }> = ({ label, value, icon }) => (
  <div className="bg-white/10 backdrop-blur border border-white/10 rounded-2xl p-4">
    <p className="text-[10px] uppercase tracking-[0.2em] font-black text-gray-300 mb-2 flex items-center gap-2">
      {icon}
      {label}
    </p>
    <p className="text-xl font-black text-yellow-300">{value}</p>
  </div>
);

const SpecCard: React.FC<{ title: string; value: string; icon: React.ReactNode }> = ({ title, value, icon }) => (
  <div className="bg-white border border-gray-100 shadow-sm rounded-3xl p-6">
    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3 flex items-center gap-2">
      {icon}
      {title}
    </p>
    <p className="text-gray-900 text-lg font-bold">{value}</p>
  </div>
);

export default ProcessorDetail;
