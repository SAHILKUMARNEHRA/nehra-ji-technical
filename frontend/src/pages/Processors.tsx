import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Cpu, Gauge, CalendarDays, Layers, Gamepad2 } from 'lucide-react';
import { processorCatalog } from '../data/processors';

type SortKey = 'newest' | 'antutu' | 'gaming' | 'multitasking';

const Processors: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [platformFilter, setPlatformFilter] = useState<'All' | 'Android' | 'Apple'>('All');
  const [sortBy, setSortBy] = useState<SortKey>('newest');

  const brands = useMemo(
    () => Array.from(new Set(processorCatalog.map((processor) => processor.brand))).sort(),
    []
  );
  const [brandFilter, setBrandFilter] = useState<string>('All');

  const filteredProcessors = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    const base = processorCatalog.filter((processor) => {
      const matchesPlatform = platformFilter === 'All' || processor.platform === platformFilter;
      const matchesBrand = brandFilter === 'All' || processor.brand === brandFilter;
      const matchesSearch =
        !search ||
        processor.name.toLowerCase().includes(search) ||
        processor.brand.toLowerCase().includes(search) ||
        processor.gpu.toLowerCase().includes(search);

      return matchesPlatform && matchesBrand && matchesSearch;
    });

    const sorted = [...base];
    if (sortBy === 'newest') {
      sorted.sort((a, b) => new Date(b.launchDate).getTime() - new Date(a.launchDate).getTime());
    } else if (sortBy === 'antutu') {
      sorted.sort((a, b) => b.antutuScore - a.antutuScore);
    } else if (sortBy === 'gaming') {
      sorted.sort((a, b) => b.gamingScore - a.gamingScore);
    } else {
      sorted.sort((a, b) => b.multitaskingScore - a.multitaskingScore);
    }

    return sorted;
  }, [brandFilter, platformFilter, searchTerm, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tight">Processor Catalog</h1>
          <p className="text-gray-500 font-medium">Compare latest Android and Apple chipsets with full benchmark-focused specs.</p>
        </div>

        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search chipset..."
            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <p className="text-xs font-black uppercase tracking-widest text-blue-600 mb-4">Platform</p>
          <div className="flex flex-wrap gap-2">
            {(['All', 'Android', 'Apple'] as const).map((platform) => (
              <button
                key={platform}
                onClick={() => setPlatformFilter(platform)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${platformFilter === platform ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
              >
                {platform}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <p className="text-xs font-black uppercase tracking-widest text-blue-600 mb-4">Brand</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setBrandFilter('All')}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${brandFilter === 'All' ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
            >
              All
            </button>
            {brands.map((brand) => (
              <button
                key={brand}
                onClick={() => setBrandFilter(brand)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${brandFilter === brand ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
              >
                {brand}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <label className="block text-xs font-black uppercase tracking-widest text-blue-600 mb-4">Sort By</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortKey)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="newest">Newest Launch</option>
            <option value="antutu">Highest Antutu</option>
            <option value="gaming">Best Gaming Score</option>
            <option value="multitasking">Best Multitasking Score</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {filteredProcessors.map((processor) => (
          <Link
            to={`/processors/${processor.slug}`}
            key={processor.slug}
            className="bg-white border border-gray-100 rounded-[30px] p-5 shadow-sm hover:shadow-2xl transition-all group"
          >
            <div className="h-28 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-4">
              <img
                src={processor.image}
                alt={processor.name}
                className="h-20 w-20 object-contain group-hover:scale-110 transition-transform"
                loading="lazy"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = `https://via.placeholder.com/240x240?text=${encodeURIComponent(processor.name)}`;
                }}
              />
            </div>
            <p className="text-[10px] uppercase tracking-[0.2em] font-black text-blue-600 mb-1">{processor.brand} • {processor.platform}</p>
            <h3 className="text-xl font-black text-gray-900 line-clamp-2 mb-3">{processor.name}</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p className="flex items-center gap-2"><CalendarDays size={14} /> {new Date(processor.launchDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
              <p className="flex items-center gap-2"><Cpu size={14} /> {processor.cpuCores}</p>
              <p className="flex items-center gap-2"><Gauge size={14} /> Antutu: {processor.antutuScore.toLocaleString()}</p>
              <p className="flex items-center gap-2"><Gamepad2 size={14} /> Gaming: {processor.gamingScore}/100</p>
              <p className="flex items-center gap-2"><Layers size={14} /> Multitasking: {processor.multitaskingScore}/100</p>
            </div>
          </Link>
        ))}
      </div>

      {filteredProcessors.length === 0 && (
        <div className="text-center py-20 bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-200 mt-8">
          <p className="text-gray-400 text-lg font-medium">No processors found matching your filters.</p>
        </div>
      )}
    </div>
  );
};

export default Processors;
