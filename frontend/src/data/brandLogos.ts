export const normalizeBrandKey = (brand: string): string =>
  brand.trim().toLowerCase().replace(/\s+/g, "");

const logoByBrand: Record<string, string> = {
  apple: "https://cdn.simpleicons.org/apple/000000",
  samsung: "https://cdn.simpleicons.org/samsung/1428A0",
  google: "https://cdn.simpleicons.org/google/4285F4",
  oneplus: "https://cdn.simpleicons.org/oneplus/F5010C",
  oppo: "https://cdn.simpleicons.org/oppo/2D683D",
  vivo: "https://cdn.simpleicons.org/vivo/415FFF",
  xiaomi: "https://cdn.simpleicons.org/xiaomi/FF6900",
  redmi: "https://cdn.simpleicons.org/xiaomi/FF6900",
  poco: "https://cdn.simpleicons.org/xiaomi/FF6900",
  realme: "https://www.google.com/s2/favicons?sz=128&domain_url=https://www.realme.com/in/",
  iqoo: "https://cdn.simpleicons.org/vivo/415FFF",
  nothing: "https://www.google.com/s2/favicons?sz=128&domain_url=https://in.nothing.tech/",
  cmf: "https://www.google.com/s2/favicons?sz=128&domain_url=https://in.cmf.tech/",
  motorola: "https://cdn.simpleicons.org/motorola/E1140A",
  moto: "https://cdn.simpleicons.org/motorola/E1140A",
  asus: "https://cdn.simpleicons.org/asus/000000",
  honor: "https://cdn.simpleicons.org/honor/000000",
  lava: "https://www.google.com/s2/favicons?sz=128&domain_url=https://www.lavamobiles.com",
  tecno: "https://www.google.com/s2/favicons?sz=128&domain_url=https://www.tecno-mobile.com",
  "ai+": "https://www.google.com/s2/favicons?sz=128&domain_url=https://openai.com",
};

const fallbackDomainByBrand: Record<string, string> = {
  apple: "https://www.apple.com",
  samsung: "https://www.samsung.com",
  google: "https://store.google.com",
  oneplus: "https://www.oneplus.in",
  oppo: "https://www.oppo.com",
  vivo: "https://www.vivo.com",
  xiaomi: "https://www.mi.com",
  redmi: "https://www.mi.com",
  poco: "https://www.po.co",
  realme: "https://www.realme.com",
  iqoo: "https://www.iqoo.com",
  nothing: "https://in.nothing.tech",
  cmf: "https://in.cmf.tech",
  motorola: "https://www.motorola.com",
  moto: "https://www.motorola.com",
  asus: "https://www.asus.com",
  honor: "https://www.honor.com",
  lava: "https://www.lavamobiles.com",
  tecno: "https://www.tecno-mobile.com",
  "ai+": "https://openai.com",
};

export const getBrandLogo = (brand: string): string => {
  const key = normalizeBrandKey(brand);
  if (logoByBrand[key]) return logoByBrand[key];
  const fallbackDomain = fallbackDomainByBrand[key] || "https://www.android.com";
  return `https://www.google.com/s2/favicons?sz=128&domain_url=${encodeURIComponent(fallbackDomain)}`;
};
