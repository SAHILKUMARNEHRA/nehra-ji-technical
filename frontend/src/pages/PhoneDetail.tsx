import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { IndianRupee, Cpu, Battery, Camera, Monitor, HardDrive, Layers, ChevronLeft, ShieldCheck, Bluetooth, Wifi, Weight, Gauge } from 'lucide-react';
import { fallbackPhoneImage, getCatalogPhoneById } from '../data/phoneCatalog';

const PhoneDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const numericId = Number(id);
  const phone = Number.isNaN(numericId) ? null : getCatalogPhoneById(numericId) || null;
  
  if (!phone) return (
    <div className="text-center py-20">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Phone not found</h2>
      <Link to="/phones" className="text-blue-600 font-bold hover:underline">Back to Catalog</Link>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <Link to="/phones" className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 font-bold mb-8 transition-colors">
        <ChevronLeft size={20} /> Back to Catalog
      </Link>

      <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden border border-gray-100">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Left Side: High Quality Image */}
          <div className="bg-gray-50 p-12 flex items-center justify-center border-r border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-50/50 to-transparent"></div>
            <img 
              src={phone.image || fallbackPhoneImage} 
              alt={phone.name} 
              className="max-h-[600px] w-full object-cover rounded-3xl shadow-2xl transform hover:scale-105 transition-transform duration-700 relative z-10"
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).src = fallbackPhoneImage;
              }}
            />
          </div>

          {/* Right Side: Comprehensive Details */}
          <div className="p-12 md:p-16">
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-blue-100 text-blue-600 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">
                  {phone.brand}
                </span>
                <span className="bg-green-100 text-green-600 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-1">
                  <ShieldCheck size={14} /> Official Specs
                </span>
              </div>
              <h1 className="text-5xl font-black text-gray-900 mb-6 leading-tight">{phone.name}</h1>
              <div className="inline-flex items-center text-4xl font-black text-blue-600 bg-blue-50 px-8 py-4 rounded-3xl border border-blue-100">
                <IndianRupee size={32} />
                <span>{phone.price.toLocaleString()}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
              <SpecDetail icon={<Cpu className="text-blue-500" />} label="Processor" value={phone.processor} />
              <SpecDetail icon={<Gauge className="text-blue-500" />} label="Clock Speed" value={phone.clockSpeed} />
              <SpecDetail icon={<Cpu className="text-blue-500" />} label="CPU Cores" value={phone.cpuCores} />
              <SpecDetail icon={<Layers className="text-purple-500" />} label="RAM Memory" value={phone.ram} />
              <SpecDetail icon={<HardDrive className="text-orange-500" />} label="Internal Storage" value={phone.storage} />
              <SpecDetail icon={<Battery className="text-green-500" />} label="Battery & Charging" value={phone.battery} />
              <SpecDetail icon={<Monitor className="text-cyan-500" />} label="Display Quality" value={phone.display} />
              <SpecDetail icon={<Camera className="text-red-500" />} label="Rear Camera" value={phone.rearCamera} />
              <SpecDetail icon={<Camera className="text-red-500" />} label="Front Camera" value={phone.frontCamera} />
              <SpecDetail icon={<Weight className="text-slate-500" />} label="Weight" value={phone.weight} />
              <SpecDetail icon={<Bluetooth className="text-indigo-500" />} label="Bluetooth" value={phone.bluetoothVersion} />
              <SpecDetail icon={<Wifi className="text-emerald-500" />} label="Wi-Fi" value={phone.wifiVersion} />
            </div>

            <div className="flex flex-wrap gap-4 pt-8 border-t border-gray-100">
              <Link 
                to="/compare" 
                className="flex-grow sm:flex-grow-0 bg-gray-900 hover:bg-black text-white px-10 py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all transform hover:-translate-y-1 shadow-xl shadow-gray-200"
              >
                Compare With Other Phones
              </Link>
              <button 
                onClick={() => window.print()}
                className="flex-grow sm:flex-grow-0 bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-200 px-10 py-5 rounded-2xl font-black text-lg transition-all"
              >
                Download Specs
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SpecDetail: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
  <div className="bg-gray-50/50 p-6 rounded-3xl border border-gray-100 hover:bg-white hover:shadow-lg transition-all group">
    <div className="flex items-center gap-3 mb-3">
      <div className="p-2 bg-white rounded-xl shadow-sm group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <span className="font-black uppercase text-[10px] tracking-widest text-gray-400">{label}</span>
    </div>
    <p className="text-gray-900 font-bold text-lg leading-snug">{value}</p>
  </div>
);

export default PhoneDetail;
