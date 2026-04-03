import { allSmartphones, upcomingSmartphones } from './SMARTPHONE.js';
import { phoneImageById } from './phoneImages';

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

const toCatalogPhone = (phone: RawPhone): CatalogPhone => {
  const name = `${phone.brand} ${phone.model}`;
  const fallbackImage = `https://loremflickr.com/640/640/${encodeURIComponent(`${phone.brand} smartphone`) }?lock=${phone.id}`;
  const mappedImage = phoneImageById[phone.id] || '';
  const suspectImage =
    !mappedImage ||
    mappedImage.includes('dummyimage.com') ||
    mappedImage.includes('via.placeholder') ||
    mappedImage.includes('placehold.co') ||
    mappedImage.toLowerCase().includes('fruit') ||
    mappedImage.toLowerCase().includes('logo');

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
