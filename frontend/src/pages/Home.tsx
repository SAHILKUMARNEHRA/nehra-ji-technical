import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Smartphone, Youtube, Newspaper, ThumbsUp, Layers, CalendarClock, MessageSquareText, BellRing, Users, Cpu, Gauge, Gamepad2 } from 'lucide-react';
import { allCatalogPhones, fallbackPhoneImage, upcomingCatalogPhones } from '../data/phoneCatalog';
import { getBrandLogo } from '../data/brandLogos';
import { latestAndroidProcessors, appleProcessors, processorCatalog } from '../data/processors';
import { osDataLastChecked, osUpdates } from '../data/osUpdates';
import api from '../services/api';

import heroBg from '../assets/home page .jpg';

interface LiveNewsItem {
  title: string;
  link: string;
  pubDate: string;
}

interface LiveUpdatesResponse {
  generated_at: string;
  os_updates: Record<string, LiveNewsItem[]>;
  processor_updates: Record<string, LiveNewsItem[]>;
  leaks: LiveNewsItem[];
}

const Home: React.FC = () => {
  const allBrands = Array.from(new Set(allCatalogPhones.map((phone) => phone.brand))).sort();
  const brandLogos = allBrands.map((brand) => ({ brand, logo: getBrandLogo(brand) }));
  const featuredAndroidProcessors = latestAndroidProcessors.slice(0, 8);
  const featuredAppleProcessors = appleProcessors.slice(0, 4);
  const topGamingProcessors = [...processorCatalog].sort((a, b) => b.gamingScore - a.gamingScore).slice(0, 10);
  const topMultitaskingProcessors = [...processorCatalog].sort((a, b) => b.multitaskingScore - a.multitaskingScore).slice(0, 10);
  const [showSubscribePopup, setShowSubscribePopup] = useState(false);
  const [liveUpdates, setLiveUpdates] = useState<LiveUpdatesResponse | null>(null);

  useEffect(() => {
    const key = 'ytSubscribePopupLastShown';
    const last = localStorage.getItem(key);
    const now = Date.now();
    const oneDayMs = 24 * 60 * 60 * 1000;
    if (last && now - Number(last) < oneDayMs) return;

    const timer = setTimeout(() => setShowSubscribePopup(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let mounted = true;
    const fetchLive = async () => {
      try {
        const response = await api.get<LiveUpdatesResponse>('/updates/live');
        if (mounted) setLiveUpdates(response.data);
      } catch {
        if (mounted) setLiveUpdates(null);
      }
    };

    fetchLive();
    const interval = setInterval(fetchLive, 1000 * 60 * 30);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const closeSubscribePopup = () => {
    localStorage.setItem('ytSubscribePopupLastShown', String(Date.now()));
    setShowSubscribePopup(false);
  };

  return (
    <div className="bg-gray-50">
      <style>{marqueeStyles}</style>
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center animate-hero-pan"
          style={{ backgroundImage: `url(${heroBg})` }}
        >
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        <div className="relative z-10 text-center px-4 animate-fade-up">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
            Welcome to <span className="text-blue-500">Nehra Ji Technical</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto">
            Unboxing The Future with trusted smartphone reviews, comparison, and recommendations.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/recommendation"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-3xl text-lg font-black transition-all transform hover:scale-105 shadow-xl shadow-blue-200"
            >
              Get Recommendation
            </Link>
            <Link
              to="/phones"
              className="bg-white hover:bg-gray-50 text-gray-900 px-8 py-4 rounded-3xl text-lg font-black transition-all transform hover:scale-105 shadow-xl"
            >
              Browse All Phones
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-up">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard icon={<Smartphone size={24} className="text-blue-600" />} label="Smartphones Covered" value={`${allCatalogPhones.length}+`} />
          <StatCard icon={<CalendarClock size={24} className="text-amber-600" />} label="Upcoming Leaks" value={`${upcomingCatalogPhones.length}+`} />
          <StatCard icon={<Users size={24} className="text-green-600" />} label="Brands in Dataset" value={`${allBrands.length}+`} />
        </div>
      </section>

      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-up">
        <h2 className="text-3xl font-bold text-center mb-16 text-gray-900">What We Offer</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <FeatureCard icon={<Layers className="text-blue-500" size={40} />} title="Free Comparison" description="Compare any two smartphones side-by-side with official technical specs." link="/compare" />
          <FeatureCard icon={<Smartphone className="text-blue-500" size={40} />} title="Browse All Phones" description="Detailed specifications of the latest smartphones in the Indian market." link="/phones" />
          <FeatureCard icon={<Youtube className="text-red-500" size={40} />} title="Video Reviews" description="Daily unboxing and review videos in Hindi for easy understanding." link="/videos" />
          <FeatureCard icon={<Newspaper className="text-green-500" size={40} />} title="Tech News" description="Stay updated with the latest happenings in the tech world." link="/news" />
          <FeatureCard icon={<ThumbsUp className="text-yellow-500" size={40} />} title="Personalized Recommendations" description="Find the best phone for your budget and usage needs." link="/recommendation" />
        </div>
      </section>

      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-up">
        <div className="flex items-end justify-between gap-4 mb-10 flex-wrap">
          <div>
            <h2 className="text-3xl font-black text-gray-900">Latest Android Processors</h2>
            <p className="text-gray-500 font-medium">Launch date, cores, max clock speed, gaming and Antutu performance.</p>
          </div>
          <Link to="/compare" className="inline-flex items-center gap-2 bg-gray-900 text-white px-5 py-3 rounded-2xl font-bold hover:bg-blue-600 transition-all">
            Compare Processor Power
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {featuredAndroidProcessors.map((processor) => (
            <Link
              to={`/processors/${processor.slug}`}
              key={processor.slug}
              className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm hover:shadow-xl transition-all group"
            >
              <div className="h-28 w-full rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-4">
                <img
                  src={processor.image}
                  alt={processor.name}
                  className="h-20 w-20 object-contain group-hover:scale-110 transition-transform"
                  loading="lazy"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = `https://via.placeholder.com/260x260?text=${encodeURIComponent(processor.name)}`;
                  }}
                />
              </div>
              <p className="text-[10px] uppercase tracking-[0.2em] font-black text-blue-600 mb-1">{processor.brand}</p>
              <h3 className="text-lg font-black text-gray-900 mb-3 line-clamp-2">{processor.name}</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p className="flex items-center gap-2"><CalendarClock size={14} /> {new Date(processor.launchDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                <p className="flex items-center gap-2"><Cpu size={14} /> {processor.cpuCores}</p>
                <p className="flex items-center gap-2"><Gauge size={14} /> Antutu: {processor.antutuScore.toLocaleString()}</p>
                <p className="flex items-center gap-2"><Gamepad2 size={14} /> Gaming: {processor.gamingScore}/100</p>
                <p className="font-bold text-gray-900">Max Clock: {processor.clockSpeed}</p>
              </div>
            </Link>
          ))}
        </div>
        {liveUpdates && (
          <div className="mt-8 bg-gray-50 border border-gray-100 rounded-3xl p-6">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-500 mb-4">Live Processor Headlines</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {Object.entries(liveUpdates.processor_updates)
                .map(([family, items]) => ({ family, item: items?.[0] }))
                .filter((entry) => entry.item)
                .map((entry) => (
                  <a
                    key={entry.family}
                    href={entry.item!.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white border border-gray-100 rounded-2xl p-3 hover:shadow-md transition-all"
                  >
                    <p className="text-[10px] uppercase tracking-[0.2em] font-black text-blue-600 mb-1">{entry.family}</p>
                    <p className="text-sm font-bold text-gray-900 line-clamp-2">{entry.item!.title}</p>
                  </a>
                ))}
            </div>
          </div>
        )}
      </section>

      <section className="py-20 bg-white border-y border-gray-100 animate-fade-up">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-4 mb-10 flex-wrap">
            <div>
              <h2 className="text-3xl font-black text-gray-900">Apple Processors (A-Series Chips)</h2>
              <p className="text-gray-500 font-medium">Tap any chip card to open animated processor details page.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {featuredAppleProcessors.map((processor) => (
              <Link
                to={`/processors/${processor.slug}`}
                key={processor.slug}
                className="bg-gray-900 text-white rounded-3xl p-5 shadow-sm hover:shadow-xl transition-all group"
              >
                <div className="h-28 w-full rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center mb-4">
                  <img
                    src={processor.image}
                    alt={processor.name}
                    className="h-20 w-20 object-contain group-hover:scale-110 group-hover:-translate-y-1 transition-transform"
                    loading="lazy"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = `https://via.placeholder.com/260x260?text=${encodeURIComponent(processor.name)}`;
                    }}
                  />
                </div>
                <p className="text-[10px] uppercase tracking-[0.2em] font-black text-yellow-300 mb-1">Apple Silicon</p>
                <h3 className="text-lg font-black mb-3">{processor.name}</h3>
                <div className="space-y-2 text-sm text-gray-200">
                  <p className="flex items-center gap-2"><CalendarClock size={14} /> {new Date(processor.launchDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                  <p className="flex items-center gap-2"><Cpu size={14} /> {processor.cpuCores}</p>
                  <p className="flex items-center gap-2"><Gauge size={14} /> Antutu: {processor.antutuScore.toLocaleString()}</p>
                  <p className="font-bold text-yellow-300">Max Clock: {processor.clockSpeed}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-up">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-[32px] border border-gray-100 shadow-xl p-6">
            <h3 className="text-2xl font-black text-gray-900 mb-1">Top 10 Gaming Processors</h3>
            <p className="text-gray-500 text-sm mb-5">Ranked by gaming score with Antutu reference.</p>
            <div className="space-y-3">
              {topGamingProcessors.map((processor, index) => (
                <Link
                  to={`/processors/${processor.slug}`}
                  key={`gaming-${processor.slug}`}
                  className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 hover:bg-white hover:shadow-md transition-all"
                >
                  <div>
                    <p className="text-xs text-gray-400 font-black tracking-widest">#{index + 1}</p>
                    <p className="font-bold text-gray-900">{processor.name}</p>
                    <p className="text-xs text-gray-500">{processor.platform} • Antutu {processor.antutuScore.toLocaleString()}</p>
                  </div>
                  <CountUpOnView end={processor.gamingScore} suffix="/100" className="text-lg font-black text-blue-600" />
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-[32px] border border-gray-100 shadow-xl p-6">
            <h3 className="text-2xl font-black text-gray-900 mb-1">Top 10 Multitasking Processors</h3>
            <p className="text-gray-500 text-sm mb-5">Ranked by multitasking score for heavy usage.</p>
            <div className="space-y-3">
              {topMultitaskingProcessors.map((processor, index) => (
                <Link
                  to={`/processors/${processor.slug}`}
                  key={`multi-${processor.slug}`}
                  className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 hover:bg-white hover:shadow-md transition-all"
                >
                  <div>
                    <p className="text-xs text-gray-400 font-black tracking-widest">#{index + 1}</p>
                    <p className="font-bold text-gray-900">{processor.name}</p>
                    <p className="text-xs text-gray-500">{processor.platform} • Cores: {processor.cpuCores}</p>
                  </div>
                  <CountUpOnView end={processor.multitaskingScore} suffix="/100" className="text-lg font-black text-blue-600" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white border-y border-gray-100 animate-fade-up">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-4 mb-8 flex-wrap">
            <div>
              <h2 className="text-3xl font-black text-gray-900">Latest OS Updates</h2>
              <p className="text-gray-500 font-medium">Google, Apple, OnePlus, OPPO, Vivo and realme software updates with hidden tips.</p>
            </div>
            <span className="text-xs font-black uppercase tracking-widest bg-blue-50 text-blue-700 px-3 py-2 rounded-full">
              Last checked: {liveUpdates?.generated_at ? new Date(liveUpdates.generated_at).toLocaleString('en-IN') : osDataLastChecked}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {osUpdates.map((item) => (
              <div key={item.brand} className="bg-gray-50 border border-gray-100 rounded-3xl p-6">
                <p className="text-[10px] uppercase tracking-[0.2em] font-black text-blue-600 mb-1">{item.brand}</p>
                <h3 className="text-xl font-black text-gray-900">{item.osName} {item.latestVersion}</h3>
                <p className="text-xs text-gray-500 mt-1 mb-4">{item.basedOn ? `Based on ${item.basedOn} • ` : ''}{item.releaseWindow}</p>
                <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">What&apos;s New</p>
                <ul className="space-y-1 mb-4">
                  {item.whatsNew.map((feature) => (
                    <li key={feature} className="text-sm text-gray-700">• {feature}</li>
                  ))}
                </ul>
                <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Hidden Features</p>
                <ul className="space-y-1">
                  {item.hiddenFeatures.map((feature) => (
                    <li key={feature} className="text-sm text-gray-700">• {feature}</li>
                  ))}
                </ul>
                <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl mt-4 p-2">{item.note}</p>
              </div>
            ))}
          </div>
          {liveUpdates && (
            <div className="mt-8 bg-blue-50 border border-blue-100 rounded-3xl p-6">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-700 mb-3">Live OS Headlines</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(liveUpdates.os_updates)
                  .map(([brandKey, items]) => ({ brandKey, item: items?.[0] }))
                  .filter((entry) => entry.item)
                  .map((entry) => (
                    <a
                      key={entry.brandKey}
                      href={entry.item!.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block bg-white border border-blue-100 rounded-2xl p-3 hover:shadow-md transition-all"
                    >
                      <p className="text-[10px] uppercase tracking-[0.2em] font-black text-blue-600 mb-1">{entry.brandKey}</p>
                      <p className="text-sm font-bold text-gray-900 line-clamp-2">{entry.item!.title}</p>
                    </a>
                  ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-up">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <h2 className="text-3xl font-black text-gray-900">Upcoming Smartphones (Leaks)</h2>
            <p className="text-gray-500 font-medium">Rumored and leaked devices from your attached upcoming dataset.</p>
          </div>
          <span className="inline-flex items-center gap-2 bg-amber-50 text-amber-700 border border-amber-200 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest">
            <CalendarClock size={14} /> Predicted Data
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {upcomingCatalogPhones.slice(0, 12).map((phone) => (
            <div key={phone.id} className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all">
              <div className="h-44 w-full rounded-2xl bg-gray-50 border border-gray-100 overflow-hidden mb-4">
                <img
                  src={phone.image}
                  alt={phone.name}
                  className="h-full w-full object-contain"
                  loading="lazy"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = fallbackPhoneImage;
                  }}
                />
              </div>
              <p className="text-[10px] uppercase tracking-[0.2em] font-black text-blue-600 mb-2">{phone.brand}</p>
              <h3 className="text-lg font-black text-gray-900 mb-3 line-clamp-2">{phone.name}</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p><span className="font-bold text-gray-900">Status:</span> {phone.status}</p>
                <p><span className="font-bold text-gray-900">Launch:</span> {phone.launch || 'TBA'}</p>
                <p><span className="font-bold text-gray-900">Price:</span> ₹{phone.price.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>

        {liveUpdates?.leaks?.length ? (
          <div className="mt-8 bg-amber-50 border border-amber-200 rounded-3xl p-6">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-700 mb-4">Live Latest Leaks</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {liveUpdates.leaks.slice(0, 6).map((item, idx) => (
                <a
                  key={`${item.link}-${idx}`}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white border border-amber-200 rounded-2xl p-3 hover:shadow-md transition-all"
                >
                  <p className="text-sm font-bold text-gray-900 line-clamp-2">{item.title}</p>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-1">{item.pubDate}</p>
                </a>
              ))}
            </div>
          </div>
        ) : null}

        <div className="mt-8">
          <Link to="/compare" className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-600 transition-all">
            Compare Upcoming and Current Phones
          </Link>
        </div>
      </section>

      <section className="py-20 bg-white border-y border-gray-100 animate-fade-up">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-6">
            <MessageSquareText size={14} /> Suggest Video Topic
          </div>
          <h2 className="text-4xl font-black text-gray-900 mb-4">Want Video On Your Topic?</h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto mb-8">
            Share your requested video topic and we will try to cover it in upcoming content.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/suggestions" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-black transition-all">
              Suggest a Topic
            </Link>
            <Link to="/contact" className="bg-gray-900 hover:bg-black text-white px-8 py-4 rounded-2xl font-black transition-all">
              Contact Team
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-up">
        <h2 className="text-3xl font-black text-gray-900 text-center mb-10">All Covered Smartphone Brands</h2>
        <div className="space-y-4">
          <div className="overflow-hidden rounded-3xl bg-white border border-gray-200 py-5">
            <div className="brand-marquee flex items-center gap-10 w-max">
              {[...brandLogos, ...brandLogos].map((item, index) => (
                <img
                  key={`${item.brand}-left-${index}`}
                  src={item.logo}
                  alt={item.brand}
                  title={item.brand}
                  className="h-10 w-auto object-contain saturate-125 brightness-105 hover:scale-110 transition-all"
                  loading="lazy"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(item.brand)}&background=111111&color=FFDD00&size=128&bold=true`;
                  }}
                />
              ))}
            </div>
          </div>
          <div className="overflow-hidden rounded-3xl bg-white border border-gray-200 py-5">
            <div className="brand-marquee-reverse flex items-center gap-10 w-max">
              {[...brandLogos.slice().reverse(), ...brandLogos.slice().reverse()].map((item, index) => (
                <img
                  key={`${item.brand}-right-${index}`}
                  src={item.logo}
                  alt={item.brand}
                  title={item.brand}
                  className="h-10 w-auto object-contain saturate-125 brightness-105 hover:scale-110 transition-all"
                  loading="lazy"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(item.brand)}&background=111111&color=FFDD00&size=128&bold=true`;
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-900 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">About Nehra Ji Technical</h2>
          <p className="text-gray-400 text-lg leading-relaxed mb-8">
            Created on 13th June 2021, our motive is to make easy-to-understand Tech Videos in Hindi.
            We want everyone interested in technology to understand it in the easiest way possible.
          </p>
          <Link to="/about" className="text-blue-400 hover:text-blue-300 font-semibold text-lg inline-flex items-center gap-2">
            Learn More <span>&rarr;</span>
          </Link>
        </div>
      </section>

      <section className="bg-black text-white py-14">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h3 className="text-2xl font-black mb-4">Stay Connected</h3>
          <p className="text-gray-400 mb-8">Subscribe for daily videos and join the WhatsApp channel for instant updates.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://youtube.com/@NEHRAJITECHNICAL"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-2xl font-black"
            >
              <BellRing size={18} /> Subscribe Channel
            </a>
            <a
              href="https://chat.whatsapp.com/HvQx2ALIYE8K9dnF6oeFs5?mode=gi_t"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-2xl font-black"
            >
              Join WhatsApp Group
            </a>
          </div>
        </div>
      </section>

      {showSubscribePopup && (
        <div className="fixed inset-0 z-[70] bg-black/55 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-up">
          <div className="w-full max-w-md bg-white rounded-3xl border border-gray-100 shadow-2xl p-6 animate-soft-pop">
            <p className="text-[10px] uppercase tracking-[0.2em] font-black text-blue-600 mb-2">Nehra Ji Technical</p>
            <h3 className="text-2xl font-black text-gray-900 mb-2">Subscribe For Daily Tech Updates</h3>
            <p className="text-gray-600 mb-6">Get latest videos, smartphone leaks and comparison content directly on YouTube.</p>
            <div className="flex gap-3">
              <a
                href="https://youtube.com/@NEHRAJITECHNICAL"
                target="_blank"
                rel="noopener noreferrer"
                onClick={closeSubscribePopup}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl text-center font-black"
              >
                Subscribe Now
              </a>
              <button
                onClick={closeSubscribePopup}
                className="px-4 py-3 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50"
              >
                Later
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Lightweight marquee animation for brand logos.
const marqueeStyles = `
@keyframes brand-scroll-left {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
@keyframes brand-scroll-right {
  0% { transform: translateX(-50%); }
  100% { transform: translateX(0); }
}
.brand-marquee {
  animation: brand-scroll-left 28s linear infinite;
}
.brand-marquee-reverse {
  animation: brand-scroll-right 28s linear infinite;
}
`;

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string; link: string }> = ({ icon, title, description, link }) => (
  <Link
    to={link}
    className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col items-center text-center group"
  >
    <div className="mb-6 transform group-hover:scale-110 transition-transform">{icon}</div>
    <h3 className="text-xl font-bold mb-3 text-gray-900">{title}</h3>
    <p className="text-gray-600 leading-relaxed">{description}</p>
  </Link>
);

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
  <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm text-center">
    <div className="w-12 h-12 rounded-2xl bg-gray-50 mx-auto mb-4 flex items-center justify-center">{icon}</div>
    <p className="text-3xl font-black text-gray-900">{value}</p>
    <p className="text-gray-500 font-medium">{label}</p>
  </div>
);

const CountUpOnView: React.FC<{ end: number; suffix?: string; className?: string }> = ({ end, suffix = '', className = '' }) => {
  const [value, setValue] = useState(0);
  const [started, setStarted] = useState(false);
  const elementRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const node = elementRef.current;
    if (!node || started) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setStarted(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;

    let frameId = 0;
    const duration = 900;
    const startTime = performance.now();

    const tick = (time: number) => {
      const progress = Math.min((time - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(end * eased));
      if (progress < 1) {
        frameId = requestAnimationFrame(tick);
      }
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [end, started]);

  return (
    <span ref={elementRef} className={className}>
      {value}
      {suffix}
    </span>
  );
};

export default Home;
