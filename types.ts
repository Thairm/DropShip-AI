
export enum GenerationMode {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO'
}

export enum AppView {
  LANDING = 'LANDING',
  HUB = 'HUB',
  GENERATOR = 'GENERATOR',
  TEMPLATES = 'TEMPLATES',
  DOCUMENTS = 'DOCUMENTS'
}

export interface GenerationState {
  originalImages: string[]; // Changed from single string to array
  generatedImage: string | null;
  generatedVideoUri: string | null;
  prompt: string;
  mode: GenerationMode;
  isLoading: boolean;
  error: string | null;
  progressMessage: string;
}

export interface PricingPlan {
  name: string;
  price: string;
  credits: string;
  features: string[];
  isPopular?: boolean;
}

export interface Feature {
  title: string;
  description: string;
  icon: string;
}

// --- AI Model Configuration Registry ---
// This is where you define new models and what they accept.

export interface ModelConfig {
  id: string; // The value passed to the API
  label: string; // The display name
  mode: GenerationMode;
  description: string;
  capabilities: {
    supportsAspectRatio: boolean;
    supportsResolution: boolean; // 1K, 2K, 4K
    supportsQuantity: boolean; // Batch generation
    supportsInputImage: boolean; // TRUE for Background Swap, FALSE for pure Text-to-Image
  };
  defaultAspectRatio: string;
}

export const AVAILABLE_MODELS: ModelConfig[] = [
  // --- IMAGE MODELS ---
  {
    id: 'gemini-2.5-flash-image',
    label: 'Gemini Flash (Standard)',
    mode: GenerationMode.IMAGE,
    description: 'Fastest generation. Best for background replacement.',
    capabilities: {
      supportsAspectRatio: true,
      supportsResolution: false,
      supportsQuantity: false,
      supportsInputImage: true, 
    },
    defaultAspectRatio: '1:1'
  },
  {
    id: 'gemini-3-pro-image-preview',
    label: 'Nano Banana Pro (High Res)',
    mode: GenerationMode.IMAGE,
    description: 'High fidelity 4K output. Best for professional product shots.',
    capabilities: {
      supportsAspectRatio: true,
      supportsResolution: true,
      supportsQuantity: false,
      supportsInputImage: true,
    },
    defaultAspectRatio: '1:1'
  },
  {
    id: 'imagen-4.0-generate-001',
    label: 'Imagen 4 Ultra (Creative)',
    mode: GenerationMode.IMAGE,
    description: 'Pure creative generation from text. Does not use input image.',
    capabilities: {
      supportsAspectRatio: true,
      supportsResolution: false,
      supportsQuantity: true, // Supports generating multiple options
      supportsInputImage: false, // Text-to-Image only
    },
    defaultAspectRatio: '1:1'
  },
  {
    id: 'qwen-image-edit-2509',
    label: 'Qwen Image Edit 2509',
    mode: GenerationMode.IMAGE,
    description: 'Advanced editing capabilities for complex scene composition.',
    capabilities: {
      supportsAspectRatio: true,
      supportsResolution: true,
      supportsQuantity: false,
      supportsInputImage: true,
    },
    defaultAspectRatio: '1:1'
  },
  {
    id: 'seedream-4.0',
    label: 'SeeDream 4.0',
    mode: GenerationMode.IMAGE,
    description: 'Balanced artistic generation for lifestyle shots.',
    capabilities: {
      supportsAspectRatio: true,
      supportsResolution: false,
      supportsQuantity: true,
      supportsInputImage: true,
    },
    defaultAspectRatio: '3:4'
  },
  {
    id: 'seedream-4.5',
    label: 'SeeDream 4.5',
    mode: GenerationMode.IMAGE,
    description: 'Latest SeeDream model with enhanced photorealism.',
    capabilities: {
      supportsAspectRatio: true,
      supportsResolution: true,
      supportsQuantity: true,
      supportsInputImage: true,
    },
    defaultAspectRatio: '3:4'
  },

  // --- VIDEO MODELS ---
  {
    id: 'veo-3.1-fast-generate-preview',
    label: 'Veo Fast (Video)',
    mode: GenerationMode.VIDEO,
    description: 'Generate 1080p video ads rapidly.',
    capabilities: {
      supportsAspectRatio: true,
      supportsResolution: true,
      supportsQuantity: false,
      supportsInputImage: true,
    },
    defaultAspectRatio: '9:16'
  },
  {
    id: 'veo-3.1-generate-preview',
    label: 'Veo 3.1 (High Quality)',
    mode: GenerationMode.VIDEO,
    description: 'Higher fidelity video generation with complex motion.',
    capabilities: {
      supportsAspectRatio: true,
      supportsResolution: true,
      supportsQuantity: false,
      supportsInputImage: true,
    },
    defaultAspectRatio: '16:9'
  },
  {
    id: 'sora-2',
    label: 'Sora 2',
    mode: GenerationMode.VIDEO,
    description: 'State-of-the-art video realism and physics simulation.',
    capabilities: {
      supportsAspectRatio: true,
      supportsResolution: true,
      supportsQuantity: false,
      supportsInputImage: true,
    },
    defaultAspectRatio: '16:9'
  },
  {
    id: 'hailuo-2.3',
    label: 'Hailuo 2.3',
    mode: GenerationMode.VIDEO,
    description: 'Optimized for social media motion trends.',
    capabilities: {
      supportsAspectRatio: true,
      supportsResolution: false,
      supportsQuantity: false,
      supportsInputImage: true,
    },
    defaultAspectRatio: '9:16'
  },
  {
    id: 'wan-2.2',
    label: 'Wan 2.2',
    mode: GenerationMode.VIDEO,
    description: 'Efficient video generation for e-commerce.',
    capabilities: {
      supportsAspectRatio: true,
      supportsResolution: false,
      supportsQuantity: false,
      supportsInputImage: true,
    },
    defaultAspectRatio: '9:16'
  },
  {
    id: 'wan-2.5',
    label: 'Wan 2.5',
    mode: GenerationMode.VIDEO,
    description: 'Latest Wan model with improved dynamic range.',
    capabilities: {
      supportsAspectRatio: true,
      supportsResolution: true,
      supportsQuantity: false,
      supportsInputImage: true,
    },
    defaultAspectRatio: '9:16'
  }
];
