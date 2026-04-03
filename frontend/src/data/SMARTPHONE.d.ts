export interface RawSmartphone {
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

export const allSmartphones: RawSmartphone[];
export const smartphones: RawSmartphone[];
export const upcomingSmartphones: RawSmartphone[];

declare const defaultExport: RawSmartphone[];
export default defaultExport;
