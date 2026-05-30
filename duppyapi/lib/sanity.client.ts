import { createClient } from 'next-sanity';
import imageUrlBuilder from '@sanity/image-url';

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!;
export const apiVersion = '2023-05-03';

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true, // Set to false if you need fresh data always
});

const builder = imageUrlBuilder(client);

export function urlFor(source: any) {
  if (typeof source === 'string') {
    return {
      url: () => source
    };
  }
  if (source && typeof source === 'object' && (source.url || source.asset)) {
    if (typeof source.url === 'string') {
      return {
        url: () => source.url
      };
    }
  }
  try {
    if (source) {
      return builder.image(source);
    }
  } catch (error) {
    // Fallback if image building fails
  }
  return {
    url: () => "/placeholder.png"
  };
}

