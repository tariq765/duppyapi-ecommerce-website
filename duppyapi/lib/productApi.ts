import { Product } from '@/app/interface';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

function mapDbProductToFrontendProduct(dbProd: any): Product {
  const mainImageUrl = dbProd.main_image_url.startsWith('http')
    ? dbProd.main_image_url
    : `${API_URL}${dbProd.main_image_url}`;
    
  const galleryUrls = dbProd.gallery
    ? dbProd.gallery.map((img: string) => img.startsWith('http') ? img : `${API_URL}${img}`)
    : [];

  return {
    _id: String(dbProd.id),
    id: dbProd.id,
    title: dbProd.title,
    slug: {
      current: dbProd.slug,
    },
    description: dbProd.description,
    price: dbProd.price,
    discountPercentage: dbProd.discount_percentage || 0,
    rating: dbProd.rating || 5,
    stock: dbProd.stock || 0,
    brand: dbProd.brand || '',
    category: dbProd.category || '',
    mainImage: mainImageUrl,
    gallery: galleryUrls,
    thumbnail: mainImageUrl,
    images: galleryUrls,
  };
}

export async function getAllProducts(search?: string): Promise<Product[]> {
  try {
    const url = new URL(`${API_URL}/products/`);
    if (search) {
      url.searchParams.append('search', search);
    }
    
    const res = await fetch(url.toString(), {
      cache: 'no-store',
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch products: ${res.statusText}`);
    }
    const data = await res.json();
    return data.map(mapDbProductToFrontendProduct);
  } catch (error) {
    console.error('Error fetching products from API:', error);
    return [];
  }
}

export async function getProduct(slug: string): Promise<Product | null> {
  try {
    const res = await fetch(`${API_URL}/products/${slug}`, {
      cache: 'no-store',
    });
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error(`Failed to fetch product by slug ${slug}: ${res.statusText}`);
    }
    const data = await res.json();
    return mapDbProductToFrontendProduct(data);
  } catch (error) {
    console.error(`Error fetching product by slug ${slug} from API:`, error);
    return null;
  }
}
