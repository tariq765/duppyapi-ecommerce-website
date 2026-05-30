import { createClient } from '@sanity/client';
import axios from 'axios';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

// Load environment variables from .env.local
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2023-05-03',
});

async function uploadImageToSanity(imageUrl) {
  try {
    console.log(`Uploading image: ${imageUrl}`);
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data);
    const asset = await client.assets.upload('image', buffer, {
      filename: imageUrl.split('/').pop(),
    });
    console.log(`Image uploaded successfully: ${asset._id}`);
    return asset._id;
  } catch (error) {
    console.error('Failed to upload image:', imageUrl, error.message);
    return null;
  }
}

async function importData() {
  try {
    console.log('Fetching products from DummyJSON...');
    const response = await axios.get('https://dummyjson.com/products?limit=20');
    const products = response.data.products;

    console.log(`Found ${products.length} products. Starting import...`);

    for (const product of products) {
      console.log(`Processing product: ${product.title}`);

      const imageId = await uploadImageToSanity(product.thumbnail);

      const sanityProduct = {
        _type: 'product',
        title: product.title,
        slug: {
          _type: 'slug',
          current: product.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''),
        },
        price: product.price,
        discountPercentage: product.discountPercentage,
        description: product.description,
        stock: product.stock,
        category: product.category,
        brand: product.brand,
        rating: product.rating,
        mainImage: imageId ? {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: imageId,
          },
        } : undefined,
      };

      await client.create(sanityProduct);
      console.log(`Successfully imported product: ${product.title}`);
    }

    console.log('Data import completed successfully!');
  } catch (error) {
    console.error('Error importing data:', error.message);
  }
}

importData();
