import { allSmartphones, upcomingSmartphones } from './SMARTPHONE.js';
import { phoneImageById } from './phoneImages';
import { getProcessorByText } from './processors';

export interface CatalogPhone {
  id: number;
  name: string;
  brand: string;
  model: string;
  processor: string;
  ram: string;
  storage: string;
  battery: string;
  display: string;
  camera: string;
  rearCamera: string;
  frontCamera: string;
  weight: string;
  cpuCores: string;
  clockSpeed: string;
  bluetoothVersion: string;
  wifiVersion: string;
  price: number;
  image: string;
  isUpcoming: boolean;
  status: string;
  launch: string | null;
  note?: string;
}

interface RawPhone {
  id: number;
  brand: string;
  model: string;
  processor: string;
  ram: string;
  storage: string;
  battery: string;
  display: string;
  camera: string;
  price: number;
  isUpcoming?: boolean;
  status?: string;
  launch?: string;
  expectedLaunch?: string;
  note?: string;
}

const PHONE_PLACEHOLDER_IMAGE =
  'https://placehold.co/640x640/0b1220/ffffff/png?text=Smartphone+Image';

const brandFallbackImage: Record<string, string> = {
  apple: 'https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-16-pro-max.jpg',
  samsung: 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s25-ultra-sm-s938.jpg',
  oneplus: 'https://fdn2.gsmarena.com/vv/bigpic/oneplus-13.jpg',
  vivo: 'https://fdn2.gsmarena.com/vv/bigpic/vivo-x200-pro.jpg',
  oppo: 'https://fdn2.gsmarena.com/vv/bigpic/oppo-find-x8-pro.jpg',
  realme: 'https://fdn2.gsmarena.com/vv/bigpic/realme-gt7-pro.jpg',
  xiaomi: 'https://fdn2.gsmarena.com/vv/bigpic/xiaomi-15-ultra.jpg',
  redmi: 'https://fdn2.gsmarena.com/vv/bigpic/xiaomi-redmi-note-14-pro-plus-5g.jpg',
  iqoo: 'https://fdn2.gsmarena.com/vv/bigpic/vivo-iqoo-13.jpg',
  motorola: 'https://fdn2.gsmarena.com/vv/bigpic/motorola-razr-50-ultra.jpg',
  google: 'https://fdn2.gsmarena.com/vv/bigpic/google-pixel-9-pro-xl.jpg',
  nothing: 'https://fdn2.gsmarena.com/vv/bigpic/nothing-phone-2a-plus.jpg',
  cmf: 'https://fdn2.gsmarena.com/vv/bigpic/cmf-phone-1.jpg',
  poco: 'https://fdn2.gsmarena.com/vv/bigpic/xiaomi-poco-x7-pro.jpg',
  honor: 'https://fdn2.gsmarena.com/vv/bigpic/honor-magic-v3.jpg',
};

const trustedImageDomains = [
  'gsmarena.com',
  'apple.com',
  'samsung.com',
  'mi.com',
  'xiaomi.com',
  'oneplus.com',
  'vivo.com',
  'oppo.com',
  'nothing.tech',
  'motorola.com',
  'google.com',
  'gstatic.com',
  'imgur.com',
  'unsplash.com',
  'dummyjson.com',
  'cdn',
];

const isTrustedImage = (url: string): boolean => trustedImageDomains.some((domain) => url.toLowerCase().includes(domain));

const getFallbackImage = (phone: RawPhone): string => {
  const byBrand = brandFallbackImage[phone.brand.toLowerCase()];
  if (byBrand) return byBrand;
  return `https://placehold.co/640x640/0b1220/ffffff/png?text=${encodeURIComponent(`${phone.brand} ${phone.model}`)}`;
};

const parseRearCamera = (camera: string): string => {
  const cleaned = camera.trim();
  if (!cleaned) return 'N/A';
  return cleaned;
};

const deriveFrontCamera = (phone: RawPhone): string => {
  const rearMP = Number((phone.camera.match(/\d+/) || ['0'])[0]);
  if (rearMP >= 180) return '32MP';
  if (rearMP >= 90) return '20MP';
  if (rearMP >= 48) return '16MP';
  return '12MP';
};

const deriveWeight = (phone: RawPhone): string => {
  const battery = Number((phone.battery.match(/\d+/) || ['5000'])[0]);
  const approx = Math.max(168, Math.min(245, Math.round(170 + (battery - 4000) / 80)));
  return `${approx} g`;
};

const deriveWireless = (price: number) => {
  if (price >= 80000) return { bluetoothVersion: 'Bluetooth 5.4', wifiVersion: 'Wi-Fi 7' };
  if (price >= 35000) return { bluetoothVersion: 'Bluetooth 5.3', wifiVersion: 'Wi-Fi 6E' };
  return { bluetoothVersion: 'Bluetooth 5.2', wifiVersion: 'Wi-Fi 6' };
};

const toCatalogPhone = (phone: RawPhone): CatalogPhone => {
  const name = `${phone.brand} ${phone.model}`;
  const fallbackImage = getFallbackImage(phone);
  const mappedImage = phoneImageById[phone.id] || '';
  const suspectImage =
    !mappedImage ||
    mappedImage.includes('dummyimage.com') ||
    mappedImage.includes('via.placeholder') ||
    mappedImage.includes('placehold.co') ||
    mappedImage.includes('loremflickr.com') ||
    mappedImage.toLowerCase().includes('fruit') ||
    mappedImage.toLowerCase().includes('logo') ||
    !/\.(jpg|jpeg|png|webp|gif|avif|svg)(\?|$)/i.test(mappedImage) ||
    (Boolean(phone.isUpcoming) && !isTrustedImage(mappedImage));
  const processorSpec = getProcessorByText(phone.processor);
  const wireless = deriveWireless(phone.price);

  return {
    id: phone.id,
    name,
    brand: phone.brand,
    model: phone.model,
    processor: phone.processor,
    ram: phone.ram,
    storage: phone.storage,
    battery: phone.battery,
    display: phone.display,
    camera: phone.camera,
    rearCamera: parseRearCamera(phone.camera),
    frontCamera: deriveFrontCamera(phone),
    weight: deriveWeight(phone),
    cpuCores: processorSpec?.cpuCores || '8-core',
    clockSpeed: processorSpec?.clockSpeed || 'Up to 3.0 GHz',
    bluetoothVersion: wireless.bluetoothVersion,
    wifiVersion: wireless.wifiVersion,
    price: phone.price,
    image: suspectImage ? fallbackImage : mappedImage,
    isUpcoming: Boolean(phone.isUpcoming),
    status: phone.status || (phone.isUpcoming ? 'Rumored' : 'Available'),
    launch: phone.launch || phone.expectedLaunch || null,
    note: phone.note,
  };
};

export const allCatalogPhones: CatalogPhone[] = (allSmartphones as RawPhone[]).map(toCatalogPhone);

export const releasedCatalogPhones: CatalogPhone[] = allCatalogPhones.filter((phone) => !phone.isUpcoming);

export const upcomingCatalogPhones: CatalogPhone[] = (upcomingSmartphones as RawPhone[]).map(toCatalogPhone);

export const getCatalogPhoneById = (id: number): CatalogPhone | undefined =>
  allCatalogPhones.find((phone) => phone.id === id);

export const fallbackPhoneImage = PHONE_PLACEHOLDER_IMAGE;
