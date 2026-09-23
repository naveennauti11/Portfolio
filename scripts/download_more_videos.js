import { processItem } from './download_all_cuts.js';

const MORE_CUTS = [
  // Typography additions
  { prefix: 'typo_06_mad_march', id: '1mjyleAbh-cZWWP66peDSu0Ro8jN2wHrS', title: 'Mad March Kinetic Pacing' },
  { prefix: 'typo_07_scariest_part', id: '1vazU3eeEwli4_8jNYt6zMdyMHJt3A6nl', title: 'Kinetic Explainer Subtitles' },
  { prefix: 'typo_08_talking_head', id: '1kUcYqUvWjxhh4MozXyUEIQMFIXBOLuil', title: 'Talking Head Dynamic Text' },

  // Motion additions
  { prefix: 'motion_06_damani_video2', id: '1K7Zc2h8Fpj1iXKa-JJgBvokY8X1nMTrW', title: 'Damani Retail Kinetic Cut' },
  { prefix: 'motion_07_ayra', id: '10Ozw9kW814LtIvbBIu4WbVpeAOjr_Yog', title: 'Ayra Brand Identity Animation' },
  { prefix: 'motion_08_commercial', id: '1xEVZTgLUl7U-SaVxviRC5NHSdSdrpA5N', title: 'Commercial Motion Showcase' },

  // Cinematic additions
  { prefix: 'cinema_06_republic_day', id: '12K4xxVO_tvj86t0IsgmlwLxwbEhrx012', title: 'Republic Day Cinematic Narrative' },
  { prefix: 'cinema_07_network_wrap', id: '1ZdpoJ3hyfpnnqEB_cSLUCzuvepA9aixd', title: 'Annual Wrap Cinematic Cut' },
  { prefix: 'cinema_08_britts', id: '18ZeffBM22nHLc7PgDxW-yfFI-pfbI2w7', title: 'Britts Brand Narrative' },

  // VFX additions
  { prefix: 'vfx_06_teaser1', id: '1sYeW1TdZxUJxl07gCFIeNpbdg9C8Qno6', title: 'Network FP Teaser VFX' },
  { prefix: 'vfx_07_greenmat_english', id: '19qOy8wvBvlCV0epU40s0Eh_ZqNBuTsFt', title: 'Studio Greenmat Extraction' },
  { prefix: 'vfx_08_ai_research', id: '1pGwy-zJUa6FzrP7ufqXql4x_sBCumE8M', title: 'Screen Replacements & UI Tracking' },

  // AI additions
  { prefix: 'ai_06_gudi_padwa', id: '1xjH4X2Vj2hvpqbRD83mYxipUBhjuRtnP', title: 'Gudi Padwa Neural Animation' },
  { prefix: 'ai_07_avatar_shot2', id: '1e_NwJKEg5vPecqy4L16lg6Tky6h_4hHh', title: 'AI Avatar Video Synthesis' },
  { prefix: 'ai_08_ai_christmas', id: '1TsbQ7X5t5g-1SJEyDYQtgrPvDn2zk11m', title: 'AI Enhanced Holiday Reel' },
];

console.log('=== Downloading Additional Cuts to Expand Featured Work ===');
for (const cut of MORE_CUTS) {
  await processItem(cut.prefix, cut.id, cut.title);
}
console.log('=== All Additional Cuts Processed! ===');
