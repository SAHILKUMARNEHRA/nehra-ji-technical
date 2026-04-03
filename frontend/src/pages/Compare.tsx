import React, { useMemo, useState } from 'react';
import { IndianRupee, Cpu, Battery, Camera, Monitor, HardDrive, Layers, Check, Search, Gauge, Gamepad2, BrainCircuit } from 'lucide-react';
import { allCatalogPhones, type CatalogPhone } from '../data/phoneCatalog';
import { appleProcessors, getProcessorByText, processorCatalog, type ProcessorSpec } from '../data/processors';

const Compare: React.FC = () => {
  const [selectedPhone1, setSelectedPhone1] = useState<CatalogPhone | null>(null);
  const [selectedPhone2, setSelectedPhone2] = useState<CatalogPhone | null>(null);
  const [comparedPhone1, setComparedPhone1] = useState<CatalogPhone | null>(null);
  const [comparedPhone2, setComparedPhone2] = useState<CatalogPhone | null>(null);

  const [search1, setSearch1] = useState('');
  const [search2, setSearch2] = useState('');
  const [showDropdown1, setShowDropdown1] = useState(false);
  const [showDropdown2, setShowDropdown2] = useState(false);
  const [processorLeftSlug, setProcessorLeftSlug] = useState(processorCatalog[0]?.slug || '');
  const [processorRightSlug, setProcessorRightSlug] = useState(processorCatalog[1]?.slug || '');
  const [appleLeftSlug, setAppleLeftSlug] = useState(appleProcessors[0]?.slug || '');
  const [appleRightSlug, setAppleRightSlug] = useState(appleProcessors[1]?.slug || appleProcessors[0]?.slug || '');
  const [showProcessorResult, setShowProcessorResult] = useState(false);
  const [showAppleResult, setShowAppleResult] = useState(false);

  const phones = allCatalogPhones;
  const processorLeft = processorCatalog.find((processor) => processor.slug === processorLeftSlug) || null;
  const processorRight = processorCatalog.find((processor) => processor.slug === processorRightSlug) || null;
  const appleLeft = appleProcessors.find((processor) => processor.slug === appleLeftSlug) || null;
  const appleRight = appleProcessors.find((processor) => processor.slug === appleRightSlug) || null;

  const handleCompare = () => {
    if (!selectedPhone1 || !selectedPhone2) return;
    setComparedPhone1(selectedPhone1);
    setComparedPhone2(selectedPhone2);
  };

  const filteredPhones1 = useMemo(
    () =>
      phones
        .filter(
          (p) =>
            p.name.toLowerCase().includes(search1.toLowerCase()) ||
            p.brand.toLowerCase().includes(search1.toLowerCase())
        )
        .slice(0, 60),
    [phones, search1]
  );

  const filteredPhones2 = useMemo(
    () =>
      phones
        .filter(
          (p) =>
            p.name.toLowerCase().includes(search2.toLowerCase()) ||
            p.brand.toLowerCase().includes(search2.toLowerCase())
        )
        .slice(0, 60),
    [phones, search2]
  );

  const getBetter = (val1: string | number, val2: string | number, type: 'price' | 'number') => {
    if (!val1 || !val2) return null;
    if (type === 'price') return Number(val1) < Number(val2) ? 'left' : 'right';

    const n1 = parseFloat(val1.toString().replace(/[^0-9.]/g, '')) || 0;
    const n2 = parseFloat(val2.toString().replace(/[^0-9.]/g, '')) || 0;

    if (n1 === n2) return null;
    return n1 > n2 ? 'left' : 'right';
  };

  const getProcessorBattleWinner = (left: ProcessorSpec, right: ProcessorSpec) => {
    const leftTotal = left.gamingScore + left.multitaskingScore + left.antutuScore / 100000;
    const rightTotal = right.gamingScore + right.multitaskingScore + right.antutuScore / 100000;
    if (leftTotal === rightTotal) return 'tie';
    return leftTotal > rightTotal ? 'left' : 'right';
  };

  const mappedProcessor1 = comparedPhone1 ? getProcessorByText(comparedPhone1.processor) : undefined;
  const mappedProcessor2 = comparedPhone2 ? getProcessorByText(comparedPhone2.processor) : undefined;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tight mb-4">Free Smartphone Comparison</h1>
        <p className="text-gray-500 font-medium">Search and select two phones to see a detailed side-by-side spec comparison</p>
      </div>

      <div className="bg-white p-8 md:p-12 rounded-[40px] shadow-xl border border-gray-100 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-11 gap-6 items-center">
          <div className="md:col-span-5 relative">
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 ml-2">Select Phone 1</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search phone 1 (e.g. iPhone 16)"
                className="w-full p-5 bg-gray-50 border border-gray-100 rounded-3xl focus:ring-4 focus:ring-blue-100 outline-none font-bold transition-all"
                value={selectedPhone1 ? selectedPhone1.name : search1}
                onChange={(e) => {
                  setSearch1(e.target.value);
                  if (selectedPhone1) {
                    setSelectedPhone1(null);
                  }
                  setComparedPhone1(null);
                  setComparedPhone2(null);
                  setShowDropdown1(true);
                }}
                onFocus={() => setShowDropdown1(true)}
              />
              <Search className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
            </div>
            {showDropdown1 && filteredPhones1.length > 0 && !selectedPhone1 && (
              <div className="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-3xl shadow-2xl max-h-60 overflow-y-auto">
                {filteredPhones1.map((p) => (
                  <div
                    key={p.id}
                    className="p-4 hover:bg-blue-50 cursor-pointer font-bold text-gray-700 transition-colors flex justify-between items-center"
                    onClick={() => {
                      setSelectedPhone1(p);
                      setComparedPhone1(null);
                      setComparedPhone2(null);
                      setShowDropdown1(false);
                      setSearch1(p.name);
                    }}
                  >
                    <span>{p.name}</span>
                    <span className="text-xs text-gray-400 uppercase tracking-widest">{p.brand}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="md:col-span-1 flex justify-center">
            <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-black shadow-lg shadow-blue-200 shrink-0">VS</div>
          </div>

          <div className="md:col-span-5 relative">
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 ml-2">Select Phone 2</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search phone 2 (e.g. Galaxy S24)"
                className="w-full p-5 bg-gray-50 border border-gray-100 rounded-3xl focus:ring-4 focus:ring-blue-100 outline-none font-bold transition-all"
                value={selectedPhone2 ? selectedPhone2.name : search2}
                onChange={(e) => {
                  setSearch2(e.target.value);
                  if (selectedPhone2) {
                    setSelectedPhone2(null);
                  }
                  setComparedPhone1(null);
                  setComparedPhone2(null);
                  setShowDropdown2(true);
                }}
                onFocus={() => setShowDropdown2(true)}
              />
              <Search className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
            </div>
            {showDropdown2 && filteredPhones2.length > 0 && !selectedPhone2 && (
              <div className="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-3xl shadow-2xl max-h-60 overflow-y-auto">
                {filteredPhones2.map((p) => (
                  <div
                    key={p.id}
                    className="p-4 hover:bg-blue-50 cursor-pointer font-bold text-gray-700 transition-colors flex justify-between items-center"
                    onClick={() => {
                      setSelectedPhone2(p);
                      setComparedPhone1(null);
                      setComparedPhone2(null);
                      setShowDropdown2(false);
                      setSearch2(p.name);
                    }}
                  >
                    <span>{p.name}</span>
                    <span className="text-xs text-gray-400 uppercase tracking-widest">{p.brand}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="md:col-span-11 mt-4">
            <button
              onClick={handleCompare}
              disabled={!selectedPhone1 || !selectedPhone2}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-3xl font-black text-xl shadow-xl shadow-blue-100 transition-all transform hover:scale-[1.01] disabled:opacity-50"
            >
              Compare These Phones
            </button>
          </div>
        </div>
      </div>

      {comparedPhone1 && comparedPhone2 && (
        <div className="space-y-8">
          <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden border border-gray-100 animate-fade-in overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="p-8 border-b border-gray-100 w-1/4">
                    <span className="text-sm font-black uppercase tracking-[0.2em] text-gray-400">Specifications</span>
                  </th>
                  <th className="p-8 border-b border-gray-100 border-x w-3/8 text-center">
                    <div className="flex flex-col items-center">
                      <div className="h-48 w-full mb-6 rounded-2xl overflow-hidden bg-white">
                        <img
                          src={comparedPhone1.image}
                          alt={comparedPhone1.name}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://via.placeholder.com/600x600?text=${encodeURIComponent(comparedPhone1.name)}`;
                          }}
                        />
                      </div>
                      <p className="text-blue-600 font-black uppercase text-xs tracking-widest mb-1">{comparedPhone1.brand}</p>
                      <h3 className="text-xl font-black text-gray-900">{comparedPhone1.name}</h3>
                    </div>
                  </th>
                  <th className="p-8 border-b border-gray-100 w-3/8 text-center">
                    <div className="flex flex-col items-center">
                      <div className="h-48 w-full mb-6 rounded-2xl overflow-hidden bg-white">
                        <img
                          src={comparedPhone2.image}
                          alt={comparedPhone2.name}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://via.placeholder.com/600x600?text=${encodeURIComponent(comparedPhone2.name)}`;
                          }}
                        />
                      </div>
                      <p className="text-blue-600 font-black uppercase text-xs tracking-widest mb-1">{comparedPhone2.brand}</p>
                      <h3 className="text-xl font-black text-gray-900">{comparedPhone2.name}</h3>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <CompareTableRow icon={<IndianRupee size={18} />} label="Price (India)" val1={comparedPhone1.price.toLocaleString()} val2={comparedPhone2.price.toLocaleString()} highlight={getBetter(comparedPhone1.price, comparedPhone2.price, 'price')} prefix="₹" />
                <CompareTableRow icon={<Cpu size={18} />} label="Processor" val1={comparedPhone1.processor} val2={comparedPhone2.processor} />
                <CompareTableRow icon={<Layers size={18} />} label="RAM" val1={comparedPhone1.ram} val2={comparedPhone2.ram} highlight={getBetter(comparedPhone1.ram, comparedPhone2.ram, 'number')} />
                <CompareTableRow icon={<HardDrive size={18} />} label="Storage" val1={comparedPhone1.storage} val2={comparedPhone2.storage} highlight={getBetter(comparedPhone1.storage, comparedPhone2.storage, 'number')} />
                <CompareTableRow icon={<Battery size={18} />} label="Battery" val1={comparedPhone1.battery} val2={comparedPhone2.battery} highlight={getBetter(comparedPhone1.battery, comparedPhone2.battery, 'number')} />
                <CompareTableRow icon={<Monitor size={18} />} label="Display" val1={comparedPhone1.display} val2={comparedPhone2.display} />
                <CompareTableRow icon={<Camera size={18} />} label="Camera" val1={comparedPhone1.camera} val2={comparedPhone2.camera} />
              </tbody>
            </table>
          </div>

          <div className="bg-white rounded-[32px] border border-gray-100 shadow-xl p-6 md:p-8">
            <h2 className="text-2xl font-black text-gray-900 mb-2">Processor Intelligence</h2>
            <p className="text-gray-500 mb-6">Gaming and multitasking comparison from mapped chipset benchmark profiles.</p>

            {mappedProcessor1 && mappedProcessor2 ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
                <ProcessorScoreCard
                  title={mappedProcessor1.name}
                  platform={mappedProcessor1.platform}
                  antutu={mappedProcessor1.antutuScore}
                  gaming={mappedProcessor1.gamingScore}
                  multitasking={mappedProcessor1.multitaskingScore}
                  isWinner={getProcessorBattleWinner(mappedProcessor1, mappedProcessor2) === 'left'}
                />
                <div className="rounded-3xl border border-gray-200 bg-gray-50 p-6 flex flex-col justify-center">
                  <p className="text-xs uppercase tracking-[0.2em] text-gray-400 font-black mb-3">Battle Result</p>
                  <p className="text-2xl font-black text-gray-900">
                    {getProcessorBattleWinner(mappedProcessor1, mappedProcessor2) === 'tie'
                      ? 'Both are closely matched'
                      : getProcessorBattleWinner(mappedProcessor1, mappedProcessor2) === 'left'
                        ? `${mappedProcessor1.name} is stronger overall`
                        : `${mappedProcessor2.name} is stronger overall`}
                  </p>
                  <p className="text-sm text-gray-500 mt-3">
                    Gaming is weighted for GPU and peak output, multitasking is weighted for sustained multi-core and RAM-heavy usage.
                  </p>
                </div>
                <ProcessorScoreCard
                  title={mappedProcessor2.name}
                  platform={mappedProcessor2.platform}
                  antutu={mappedProcessor2.antutuScore}
                  gaming={mappedProcessor2.gamingScore}
                  multitasking={mappedProcessor2.multitaskingScore}
                  isWinner={getProcessorBattleWinner(mappedProcessor1, mappedProcessor2) === 'right'}
                />
              </div>
            ) : (
              <p className="text-amber-700 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 font-medium">
                Processor mapping is not available for one of the selected phones yet. Base phone comparison still works.
              </p>
            )}
          </div>
        </div>
      )}

      <div className="bg-white rounded-[32px] border border-gray-100 shadow-xl p-6 md:p-8 mt-12" id="processor-lab">
        <h2 className="text-2xl font-black text-gray-900 mb-2">Processor Compare Lab (Apple vs Android)</h2>
        <p className="text-gray-500 mb-6">Directly compare any two processors, including Apple chips and Android chipsets.</p>
        <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
          <select
            value={processorLeftSlug}
            onChange={(e) => {
              setProcessorLeftSlug(e.target.value);
              setShowProcessorResult(false);
            }}
            className="md:col-span-5 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-4 font-bold outline-none focus:ring-2 focus:ring-blue-500"
          >
            {processorCatalog.map((processor) => (
              <option key={processor.slug} value={processor.slug}>
                {processor.name} ({processor.platform})
              </option>
            ))}
          </select>

          <div className="md:col-span-1 flex justify-center">
            <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-black">VS</div>
          </div>

          <select
            value={processorRightSlug}
            onChange={(e) => {
              setProcessorRightSlug(e.target.value);
              setShowProcessorResult(false);
            }}
            className="md:col-span-5 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-4 font-bold outline-none focus:ring-2 focus:ring-blue-500"
          >
            {processorCatalog.map((processor) => (
              <option key={processor.slug} value={processor.slug}>
                {processor.name} ({processor.platform})
              </option>
            ))}
          </select>
        </div>
        <div className="mt-5">
          <button
            onClick={() => setShowProcessorResult(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-black"
          >
            Compare Processors
          </button>
        </div>

        {showProcessorResult && processorLeft && processorRight && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            <ProcessorSpecCard processor={processorLeft} highlight={getProcessorBattleWinner(processorLeft, processorRight) === 'left'} />
            <div className="rounded-3xl border border-gray-200 bg-gray-50 p-6 flex flex-col justify-center">
              <p className="text-xs uppercase tracking-[0.2em] text-gray-400 font-black mb-3">Winner</p>
              <p className="text-2xl font-black text-gray-900">
                {getProcessorBattleWinner(processorLeft, processorRight) === 'tie'
                  ? 'Tie'
                  : getProcessorBattleWinner(processorLeft, processorRight) === 'left'
                    ? processorLeft.name
                    : processorRight.name}
              </p>
              <p className="text-sm text-gray-500 mt-3">Scoring uses Antutu + gaming + multitasking to provide a balanced performance view.</p>
            </div>
            <ProcessorSpecCard processor={processorRight} highlight={getProcessorBattleWinner(processorLeft, processorRight) === 'right'} />
          </div>
        )}
      </div>

      <div className="bg-white rounded-[32px] border border-gray-100 shadow-xl p-6 md:p-8 mt-10">
        <h2 className="text-2xl font-black text-gray-900 mb-2">Apple Processor Comparison (A-Series)</h2>
        <p className="text-gray-500 mb-6">Compare Apple chips directly to check performance jump generation to generation.</p>
        <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
          <select
            value={appleLeftSlug}
            onChange={(e) => {
              setAppleLeftSlug(e.target.value);
              setShowAppleResult(false);
            }}
            className="md:col-span-5 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-4 font-bold outline-none focus:ring-2 focus:ring-blue-500"
          >
            {appleProcessors.map((processor) => (
              <option key={processor.slug} value={processor.slug}>{processor.name}</option>
            ))}
          </select>
          <div className="md:col-span-1 flex justify-center">
            <div className="bg-gray-900 text-white rounded-full w-10 h-10 flex items-center justify-center font-black">VS</div>
          </div>
          <select
            value={appleRightSlug}
            onChange={(e) => {
              setAppleRightSlug(e.target.value);
              setShowAppleResult(false);
            }}
            className="md:col-span-5 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-4 font-bold outline-none focus:ring-2 focus:ring-blue-500"
          >
            {appleProcessors.map((processor) => (
              <option key={processor.slug} value={processor.slug}>{processor.name}</option>
            ))}
          </select>
        </div>
        <div className="mt-5">
          <button
            onClick={() => setShowAppleResult(true)}
            className="bg-gray-900 hover:bg-black text-white px-6 py-3 rounded-xl font-black"
          >
            Compare Apple Chips
          </button>
        </div>
        {showAppleResult && appleLeft && appleRight && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            <ProcessorSpecCard processor={appleLeft} highlight={getProcessorBattleWinner(appleLeft, appleRight) === 'left'} />
            <div className="rounded-3xl border border-gray-200 bg-gray-50 p-6 flex flex-col justify-center">
              <p className="text-xs uppercase tracking-[0.2em] text-gray-400 font-black mb-3">Winner</p>
              <p className="text-2xl font-black text-gray-900">
                {getProcessorBattleWinner(appleLeft, appleRight) === 'tie'
                  ? 'Tie'
                  : getProcessorBattleWinner(appleLeft, appleRight) === 'left'
                    ? appleLeft.name
                    : appleRight.name}
              </p>
              <p className="text-sm text-gray-500 mt-3">This compares Apple chips across Antutu, gaming and multitasking scores.</p>
            </div>
            <ProcessorSpecCard processor={appleRight} highlight={getProcessorBattleWinner(appleLeft, appleRight) === 'right'} />
          </div>
        )}
      </div>
    </div>
  );
};

const ProcessorScoreCard: React.FC<{
  title: string;
  platform: string;
  antutu: number;
  gaming: number;
  multitasking: number;
  isWinner: boolean;
}> = ({ title, platform, antutu, gaming, multitasking, isWinner }) => (
  <div className={`rounded-3xl border p-5 ${isWinner ? 'border-green-300 bg-green-50/40' : 'border-gray-200 bg-gray-50'}`}>
    <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-black mb-1">{platform}</p>
    <h3 className="text-xl font-black text-gray-900 mb-4">{title}</h3>
    <div className="space-y-3 text-sm text-gray-600">
      <p className="flex items-center gap-2"><Gauge size={16} className="text-blue-600" /> Antutu: {antutu.toLocaleString()}</p>
      <p className="flex items-center gap-2"><Gamepad2 size={16} className="text-blue-600" /> Gaming: {gaming}/100</p>
      <p className="flex items-center gap-2"><BrainCircuit size={16} className="text-blue-600" /> Multitasking: {multitasking}/100</p>
    </div>
    {isWinner && (
      <span className="inline-flex mt-4 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wide">
        Winner
      </span>
    )}
  </div>
);

const ProcessorSpecCard: React.FC<{ processor: ProcessorSpec; highlight: boolean }> = ({ processor, highlight }) => (
  <div className={`rounded-3xl border p-6 ${highlight ? 'border-green-300 bg-green-50/30' : 'border-gray-200 bg-white'}`}>
    <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-black mb-1">{processor.platform}</p>
    <h3 className="text-2xl font-black text-gray-900 mb-4">{processor.name}</h3>
    <div className="space-y-2 text-sm text-gray-600">
      <p><span className="font-bold text-gray-900">Launch:</span> {new Date(processor.launchDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
      <p><span className="font-bold text-gray-900">Fabrication:</span> {processor.fabrication}</p>
      <p><span className="font-bold text-gray-900">Cores:</span> {processor.cpuCores}</p>
      <p><span className="font-bold text-gray-900">Max Clock:</span> {processor.clockSpeed}</p>
      <p><span className="font-bold text-gray-900">GPU:</span> {processor.gpu}</p>
      <p><span className="font-bold text-gray-900">AI Engine:</span> {processor.aiEngine}</p>
      <p><span className="font-bold text-gray-900">Antutu:</span> {processor.antutuScore.toLocaleString()}</p>
      <p><span className="font-bold text-gray-900">Gaming Score:</span> {processor.gamingScore}/100</p>
      <p><span className="font-bold text-gray-900">Multitasking Score:</span> {processor.multitaskingScore}/100</p>
    </div>
  </div>
);

const CompareTableRow: React.FC<{
  icon: React.ReactNode;
  label: string;
  val1: string;
  val2: string;
  highlight?: 'left' | 'right' | null;
  prefix?: string;
}> = ({ icon, label, val1, val2, highlight, prefix }) => (
  <tr className="group hover:bg-gray-50/50 transition-colors border-b border-gray-50 last:border-0">
    <td className="p-8 border-r border-gray-50 bg-gray-50/20">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-white rounded-2xl shadow-sm text-gray-400 group-hover:text-blue-600 transition-colors shrink-0">{icon}</div>
        <span className="font-black text-xs uppercase tracking-widest text-gray-500">{label}</span>
      </div>
    </td>
    <td className={`p-8 text-center border-r border-gray-50 ${highlight === 'left' ? 'bg-green-50/40' : ''}`}>
      <div className="flex flex-col items-center gap-2">
        <span className={`text-lg font-bold ${highlight === 'left' ? 'text-green-700 scale-105' : 'text-gray-900'} transition-transform`}>
          {prefix}
          {val1}
        </span>
        {highlight === 'left' && (
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-1 shadow-sm shadow-green-100">
            <Check size={12} /> Winner
          </span>
        )}
      </div>
    </td>
    <td className={`p-8 text-center ${highlight === 'right' ? 'bg-green-50/40' : ''}`}>
      <div className="flex flex-col items-center gap-2">
        <span className={`text-lg font-bold ${highlight === 'right' ? 'text-green-700 scale-105' : 'text-gray-900'} transition-transform`}>
          {prefix}
          {val2}
        </span>
        {highlight === 'right' && (
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-1 shadow-sm shadow-green-100">
            <Check size={12} /> Winner
          </span>
        )}
      </div>
    </td>
  </tr>
);

export default Compare;
