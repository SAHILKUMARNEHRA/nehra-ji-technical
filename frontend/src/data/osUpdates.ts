export interface OSUpdateItem {
  brand: 'Google' | 'Apple' | 'OnePlus' | 'OPPO' | 'Vivo' | 'realme';
  osName: string;
  latestVersion: string;
  basedOn?: string;
  releaseWindow: string;
  whatsNew: string[];
  hiddenFeatures: string[];
  note: string;
}

export const osUpdates: OSUpdateItem[] = [
  {
    brand: 'Google',
    osName: 'Android',
    latestVersion: 'Android 16',
    releaseWindow: '2025 stable rollout, feature drops continuing in 2026',
    whatsNew: [
      'Smarter privacy controls and foreground service behavior',
      'Improved large-screen and multitasking polish',
      'Battery efficiency and thermal improvements for background tasks',
    ],
    hiddenFeatures: [
      'Adaptive battery behavior becomes better after a few days of usage',
      'Per-app language and notification tuning can reduce clutter',
      'Developer options animation scale tweaks can make UI feel faster',
    ],
    note: 'Version availability depends on OEM rollout and region.',
  },
  {
    brand: 'Apple',
    osName: 'iOS',
    latestVersion: 'iOS 26',
    releaseWindow: '2026 cycle',
    whatsNew: [
      'System-wide intelligence and writing assistance improvements',
      'Refined lock-screen and app experience consistency',
      'Improved privacy surfaces and permissions transparency',
    ],
    hiddenFeatures: [
      'Back Tap and accessibility shortcuts can automate daily actions',
      'Per-app cellular controls help reduce data use',
      'Focus filters can isolate noisy apps during work sessions',
    ],
    note: 'Exact feature set varies by iPhone model and region.',
  },
  {
    brand: 'OnePlus',
    osName: 'OxygenOS',
    latestVersion: 'OxygenOS 15',
    basedOn: 'Android 15',
    releaseWindow: '2025-2026 rollout by device model',
    whatsNew: [
      'Smoother animations and app transition consistency',
      'Battery and thermal refinements under gaming loads',
      'AI-assisted utility features in selected regions/devices',
    ],
    hiddenFeatures: [
      'RAM expansion and background limits can improve long session stability',
      'Per-game touch response and refresh tuning boosts experience',
      'Shelf widgets can be used for productivity shortcuts',
    ],
    note: 'Rollout order differs by OnePlus model family.',
  },
  {
    brand: 'OPPO',
    osName: 'ColorOS',
    latestVersion: 'ColorOS 15',
    basedOn: 'Android 15',
    releaseWindow: '2025-2026 phased update',
    whatsNew: [
      'Visual polish upgrades and motion smoothness improvements',
      'Enhanced cross-device and ecosystem convenience features',
      'Battery optimization for standby and mixed usage',
    ],
    hiddenFeatures: [
      'Smart charging limits can improve long-term battery health',
      'Clone app and split-screen settings can be tuned per app',
      'Quick return bubbles help multitask without app switching overhead',
    ],
    note: 'Feature availability varies by region and device tier.',
  },
  {
    brand: 'Vivo',
    osName: 'Funtouch OS',
    latestVersion: 'Funtouch OS 15',
    basedOn: 'Android 15',
    releaseWindow: '2025-2026 rollout',
    whatsNew: [
      'Improved UI responsiveness and app open/close fluidity',
      'Camera and portrait pipeline refinements',
      'Power management updates for better all-day endurance',
    ],
    hiddenFeatures: [
      'Ultra game mode tuning can reduce notifications while gaming',
      'Animation and transition controls in settings can speed up feel',
      'Per-app battery controls can significantly impact standby drain',
    ],
    note: 'Update timeline differs by series and country.',
  },
  {
    brand: 'realme',
    osName: 'realme UI',
    latestVersion: 'realme UI 6.0',
    basedOn: 'Android 15',
    releaseWindow: '2025-2026 staged rollout',
    whatsNew: [
      'Refined quick settings and notification layout',
      'Smoother interaction pipeline and game stability updates',
      'Better memory behavior under heavy multitasking',
    ],
    hiddenFeatures: [
      'GT mode and game touch settings can be tuned per title',
      'Smart sidebar shortcuts reduce task-switch friction',
      'Auto-launch and background app control can boost battery life',
    ],
    note: 'Depends on model and regional software channel.',
  },
];

export const osDataLastChecked = 'April 3, 2026';
