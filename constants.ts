import { PosterAnalysis } from './types';

// Pre-filled analysis based on the user's provided sheep poster collection
export const INITIAL_ANALYSIS: PosterAnalysis = {
  id: 'sheep-collection-001',
  imageUrl: 'https://picsum.photos/seed/sheep/800/600', // Placeholder
  colorPalette: [
    '#5A8D49', // Forest Green
    '#E8C665', // Mustard Yellow
    '#D97D56', // Terracotta
    '#3B82F6', // Sky Blue
    '#F5F5F0', // Off-White (Sheep)
    '#4A3B32', // Dark Wood
  ],
  attributes: [], // Attributes are no longer displayed, so we can leave this empty or keep for internal reference
  // Updated Prompt specifically for the "Lotus Pond/Island" style
  basePrompt: "A high-quality, flat textured illustration in the style of a children's picture book. [COUNT] anthropomorphic white sheep with round, cloud-like fluffy heads, small dot eyes, pink blush cheeks, and simple black stick legs. The sheep are wearing cute human clothes (like vests, shirts, or dresses) and are [ACTION]. The scene is [SCENE] during [SEASON], [HOLIDAY]filled with oversized, colorful plants and objects. The art style features a heavy noise/grain texture, resembling crayon or chalk drawing on paper. Vibrant, saturated colors (greens, oranges, yellows). No outlines (lineless art). Flat perspective. Whimsical, healing, and cozy atmosphere."
};