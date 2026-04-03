import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { IndianRupee, Cpu, Battery, Camera, Monitor, HardDrive, Layers, Search, Filter } from 'lucide-react';
import { releasedCatalogPhones } from '../data/phoneCatalog';

const Phones: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 170000]);

  const brands = useMemo(
    () => Array.from(new Set(releasedCatalogPhones.map((phone) => phone.brand))).sort(),
    []
  );

  const priceRanges = [
    { label: 'All', value: [0, 170000] },
    { label: 'Under 20k', value: [0, 20000] },
    { label: '20k - 40k', value: [20000, 40000] },
    { label: '40k - 70k', value: [40000, 70000] },
    { label: '70k - 1L', value: [70000, 100000] },
    { label: 'Above 1L', value: [100000, 170000] },
  ];

  const filteredPhones = useMemo(() => {
    const search = searchTerm.toLowerCase();
    return releasedCatalogPhones.filter((phone) => {
      const matchesBrand = !selectedBrand || phone.brand === selectedBrand;
      const matchesPrice = phone.price >= priceRange[0] && phone.price <= priceRange[1];
      const matchesSearch =
        phone.name.toLowerCase().includes(search) ||
        phone.model.toLowerCase().includes(search) ||
        phone.brand.toLowerCase().includes(search);
      return matchesBrand && matchesPrice && matchesSearch;
    });
  }, [priceRange, searchTerm, selectedBrand]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tight">Smartphone Catalog</h1>
          <p className="text-gray-500 font-medium">Explore all latest smartphones with full technical specs</p>
        </div>

        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search for models..."
            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 white-glow-card">
          <div className="flex items-center gap-2 mb-4 text-blue-600 font-bold uppercase tracking-widest text-xs">
            <Filter size={16} /> Filter By Brand
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedBrand('')}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${selectedBrand === '' ? 'bg-blue-600 text-white shadow-lg shadow-blue-100 white-glow-pill' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
            >
              All Brands
            </button>
            {brands.map((brand) => (
              <button
                key={brand}
                onClick={() => setSelectedBrand(brand)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${selectedBrand === brand ? 'bg-blue-600 text-white shadow-lg shadow-blue-100 white-glow-pill' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
              >
                {brand}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 white-glow-card">
          <div className="flex items-center gap-2 mb-4 text-green-600 font-bold uppercase tracking-widest text-xs">
            <IndianRupee size={16} /> Budget Range
          </div>
          <div className="flex flex-wrap gap-2">
            {priceRanges.map((range) => (
              <button
                key={range.label}
                onClick={() => setPriceRange(range.value as [number, number])}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${priceRange[0] === range.value[0] && priceRange[1] === range.value[1] ? 'bg-green-600 text-white shadow-lg shadow-green-100 white-glow-pill' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredPhones.map((phone) => (
          <div key={phone.id} className="bg-white rounded-[32px] shadow-sm overflow-hidden hover:shadow-2xl transition-all duration-500 border border-gray-100 group flex flex-col h-full white-glow-card">
            <Link to={`/phones/${phone.id}`} className="flex-grow">
              <div className="h-64 overflow-hidden bg-gray-50 relative group">
                <img
                  src={phone.image}
                  alt={phone.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://via.placeholder.com/600x600?text=${encodeURIComponent(phone.name)}`;
                  }}
                />
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-2xl text-blue-600 font-black flex items-center shadow-lg border border-blue-50">
                  <IndianRupee size={16} />
                  <span className="text-lg">{phone.price.toLocaleString()}</span>
                </div>
              </div>
              <div className="p-8">
                <div className="mb-6">
                  <p className="text-[10px] text-blue-500 font-black uppercase tracking-[0.2em] mb-2">{phone.brand}</p>
                  <h3 className="text-xl font-bold text-gray-900 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">{phone.name}</h3>
                </div>

                <div className="space-y-4 text-gray-500 text-sm font-medium">
                  <div className="flex items-center gap-3"><Cpu size={18} className="text-blue-400 shrink-0" /><span className="line-clamp-1">{phone.processor}</span></div>
                  <div className="flex items-center gap-3"><Layers size={18} className="text-purple-400 shrink-0" /><span>{phone.ram} RAM</span></div>
                  <div className="flex items-center gap-3"><HardDrive size={18} className="text-orange-400 shrink-0" /><span>{phone.storage} Storage</span></div>
                  <div className="flex items-center gap-3"><Battery size={18} className="text-green-400 shrink-0" /><span className="line-clamp-1">{phone.battery}</span></div>
                  <div className="flex items-center gap-3"><Monitor size={18} className="text-cyan-400 shrink-0" /><span className="line-clamp-1">{phone.display}</span></div>
                  <div className="flex items-center gap-3"><Camera size={18} className="text-red-400 shrink-0" /><span className="line-clamp-1">{phone.camera}</span></div>
                </div>
              </div>
            </Link>
            <div className="px-8 pb-8 mt-auto">
              <Link to={`/phones/${phone.id}`} className="w-full flex items-center justify-center bg-gray-900 hover:bg-blue-600 text-white py-4 rounded-2xl font-bold transition-all transform group-hover:scale-[1.02]">
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>

      {filteredPhones.length === 0 && (
        <div className="text-center py-20 bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-200 mt-8">
          <p className="text-gray-400 text-lg font-medium">No smartphones found matching your filters.</p>
        </div>
      )}
    </div>
  );
};

export default Phones;
