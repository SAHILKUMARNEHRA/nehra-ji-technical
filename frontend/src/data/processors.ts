export interface ProcessorSpec {
  slug: string;
  name: string;
  brand: string;
  platform: 'Android' | 'Apple';
  launchDate: string;
  fabrication: string;
  cpuCores: string;
  clockSpeed: string;
  gpu: string;
  aiEngine: string;
  antutuScore: number;
  gamingScore: number;
  multitaskingScore: number;
  summary: string;
  image: string;
}

const chipsetLogo = {
  qualcomm: 'https://cdn.simpleicons.org/qualcomm/3253DC',
  mediatek: 'https://cdn.simpleicons.org/mediatek/EC2027',
  apple: 'https://cdn.simpleicons.org/apple/111111',
  samsung: 'https://cdn.simpleicons.org/samsung/1428A0',
  google: 'https://cdn.simpleicons.org/google/4285F4',
} as const;

export const processorCatalog: ProcessorSpec[] = [
  {
    slug: 'snapdragon-8-elite',
    name: 'Snapdragon 8 Elite',
    brand: 'Qualcomm',
    platform: 'Android',
    launchDate: '2024-10-21',
    fabrication: '3nm',
    cpuCores: '8-core (2x Prime + 6x Performance)',
    clockSpeed: 'Up to 4.32 GHz',
    gpu: 'Adreno 830',
    aiEngine: 'Hexagon NPU (on-device Gen AI)',
    antutuScore: 2850000,
    gamingScore: 98,
    multitaskingScore: 97,
    summary: 'Top-tier Android flagship chip focused on sustained gaming performance and advanced AI workloads.',
    image: chipsetLogo.qualcomm,
  },
  {
    slug: 'dimensity-9400',
    name: 'Dimensity 9400',
    brand: 'MediaTek',
    platform: 'Android',
    launchDate: '2024-10-09',
    fabrication: '3nm',
    cpuCores: '8-core (1x Ultra + 3x Big + 4x Efficiency)',
    clockSpeed: 'Up to 3.62 GHz',
    gpu: 'Immortalis-G925',
    aiEngine: 'APU 790',
    antutuScore: 2750000,
    gamingScore: 97,
    multitaskingScore: 96,
    summary: 'Flagship MediaTek processor with strong GPU output and efficient thermal behavior for long sessions.',
    image: chipsetLogo.mediatek,
  },
  {
    slug: 'apple-a18-pro',
    name: 'Apple A18 Pro',
    brand: 'Apple',
    platform: 'Apple',
    launchDate: '2024-09-09',
    fabrication: '3nm',
    cpuCores: '6-core (2x Performance + 4x Efficiency)',
    clockSpeed: 'Up to 4.05 GHz',
    gpu: '6-core Apple GPU',
    aiEngine: '16-core Neural Engine',
    antutuScore: 1950000,
    gamingScore: 95,
    multitaskingScore: 96,
    summary: 'Flagship iPhone chip tuned for high single-core speed, pro graphics, and low power draw.',
    image: chipsetLogo.apple,
  },
  {
    slug: 'apple-a18',
    name: 'Apple A18',
    brand: 'Apple',
    platform: 'Apple',
    launchDate: '2024-09-09',
    fabrication: '3nm',
    cpuCores: '6-core (2x Performance + 4x Efficiency)',
    clockSpeed: 'Up to 3.90 GHz',
    gpu: '5-core Apple GPU',
    aiEngine: '16-core Neural Engine',
    antutuScore: 1710000,
    gamingScore: 92,
    multitaskingScore: 94,
    summary: 'Balanced iPhone chip offering excellent efficiency with very strong everyday and creator performance.',
    image: chipsetLogo.apple,
  },
  {
    slug: 'snapdragon-8-gen-3',
    name: 'Snapdragon 8 Gen 3',
    brand: 'Qualcomm',
    platform: 'Android',
    launchDate: '2023-10-24',
    fabrication: '4nm',
    cpuCores: '8-core (1x Prime + 5x Performance + 2x Efficiency)',
    clockSpeed: 'Up to 3.30 GHz',
    gpu: 'Adreno 750',
    aiEngine: 'Hexagon NPU',
    antutuScore: 2100000,
    gamingScore: 92,
    multitaskingScore: 93,
    summary: 'Widely used premium Android chipset with mature optimization and stable real-world performance.',
    image: chipsetLogo.qualcomm,
  },
  {
    slug: 'apple-a17-pro',
    name: 'Apple A17 Pro',
    brand: 'Apple',
    platform: 'Apple',
    launchDate: '2023-09-12',
    fabrication: '3nm',
    cpuCores: '6-core (2x Performance + 4x Efficiency)',
    clockSpeed: 'Up to 3.78 GHz',
    gpu: '6-core Apple GPU',
    aiEngine: '16-core Neural Engine',
    antutuScore: 1570000,
    gamingScore: 90,
    multitaskingScore: 92,
    summary: 'First 3nm iPhone processor with strong sustained performance and high-end mobile graphics.',
    image: chipsetLogo.apple,
  },
  {
    slug: 'dimensity-9300-plus',
    name: 'Dimensity 9300+',
    brand: 'MediaTek',
    platform: 'Android',
    launchDate: '2024-05-07',
    fabrication: '4nm',
    cpuCores: '8-core (4x Big + 4x Big)',
    clockSpeed: 'Up to 3.40 GHz',
    gpu: 'Immortalis-G720',
    aiEngine: 'APU 790',
    antutuScore: 2250000,
    gamingScore: 93,
    multitaskingScore: 95,
    summary: 'Aggressive all-big-core setup built for heavy multi-app usage and flagship-grade gaming.',
    image: chipsetLogo.mediatek,
  },
  {
    slug: 'exynos-2400',
    name: 'Exynos 2400',
    brand: 'Samsung',
    platform: 'Android',
    launchDate: '2024-01-17',
    fabrication: '4nm',
    cpuCores: '10-core (1+2+3+4 layout)',
    clockSpeed: 'Up to 3.20 GHz',
    gpu: 'Xclipse 940',
    aiEngine: 'NPU with on-device AI acceleration',
    antutuScore: 1800000,
    gamingScore: 88,
    multitaskingScore: 91,
    summary: 'Samsung flagship chip with capable multi-core throughput and premium display/image processing.',
    image: chipsetLogo.samsung,
  },
  {
    slug: 'tensor-g4',
    name: 'Google Tensor G4',
    brand: 'Google',
    platform: 'Android',
    launchDate: '2024-08-13',
    fabrication: '4nm',
    cpuCores: '8-core',
    clockSpeed: 'Up to 3.10 GHz',
    gpu: 'Mali-G715',
    aiEngine: 'Google TPU',
    antutuScore: 1300000,
    gamingScore: 81,
    multitaskingScore: 87,
    summary: 'AI-focused Google chipset optimized for camera intelligence, voice tasks, and smart features.',
    image: chipsetLogo.google,
  },
  {
    slug: 'snapdragon-8s-gen-3',
    name: 'Snapdragon 8s Gen 3',
    brand: 'Qualcomm',
    platform: 'Android',
    launchDate: '2024-03-18',
    fabrication: '4nm',
    cpuCores: '8-core (1+4+3 layout)',
    clockSpeed: 'Up to 3.00 GHz',
    gpu: 'Adreno 735',
    aiEngine: 'Hexagon NPU',
    antutuScore: 1520000,
    gamingScore: 86,
    multitaskingScore: 88,
    summary: 'Upper mid-flagship chip delivering near-flagship experience at more affordable phone pricing.',
    image: chipsetLogo.qualcomm,
  },
  {
    slug: 'apple-a16-bionic',
    name: 'Apple A16 Bionic',
    brand: 'Apple',
    platform: 'Apple',
    launchDate: '2022-09-07',
    fabrication: '4nm',
    cpuCores: '6-core (2x Performance + 4x Efficiency)',
    clockSpeed: 'Up to 3.46 GHz',
    gpu: '5-core Apple GPU',
    aiEngine: '16-core Neural Engine',
    antutuScore: 1350000,
    gamingScore: 84,
    multitaskingScore: 89,
    summary: 'Well-optimized Apple chip still strong for premium gaming and smooth long-term iOS performance.',
    image: chipsetLogo.apple,
  },
  {
    slug: 'dimensity-8400',
    name: 'Dimensity 8400',
    brand: 'MediaTek',
    platform: 'Android',
    launchDate: '2025-01-15',
    fabrication: '4nm',
    cpuCores: '8-core',
    clockSpeed: 'Up to 3.25 GHz',
    gpu: 'Mali-G720',
    aiEngine: 'MediaTek APU',
    antutuScore: 1650000,
    gamingScore: 89,
    multitaskingScore: 90,
    summary: 'High-value performance chip for upper mid-range devices with reliable gaming and efficiency.',
    image: chipsetLogo.mediatek,
  },
];

const normalize = (value: string): string =>
  value.toLowerCase().replace(/[^a-z0-9]/g, '');

export const processorsByNewest = [...processorCatalog].sort(
  (a, b) => new Date(b.launchDate).getTime() - new Date(a.launchDate).getTime()
);

export const latestAndroidProcessors = processorsByNewest.filter((processor) => processor.platform === 'Android');

export const appleProcessors = processorsByNewest.filter((processor) => processor.platform === 'Apple');

export const getProcessorBySlug = (slug: string): ProcessorSpec | undefined =>
  processorCatalog.find((processor) => processor.slug === slug);

export const getProcessorByText = (processorText: string): ProcessorSpec | undefined => {
  const raw = normalize(processorText);

  return processorCatalog.find((processor) => {
    const direct = normalize(processor.name);
    if (raw.includes(direct) || direct.includes(raw)) return true;

    if (direct.includes('snapdragon') && raw.includes('snapdragon') && raw.includes(normalize(processor.name.replace('Snapdragon', '')))) {
      return true;
    }

    if (direct.includes('dimensity') && raw.includes('dimensity') && raw.includes(normalize(processor.name.replace('Dimensity', '')))) {
      return true;
    }

    return false;
  });
};
