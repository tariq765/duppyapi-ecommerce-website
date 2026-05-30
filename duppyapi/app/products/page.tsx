// app/page.tsx
// Server Component

import Link from 'next/link';
import { Product } from '@/app/interface';
import { HoverScale, FadeIn, HoverImage } from '@/app/components/AnimateIn';
import { urlFor } from '@/lib/sanity.client';
import { getAllProducts } from '@/lib/productApi';

export default async function ProductListing({ 
  searchParams,
  search: directSearch 
}: { 
  searchParams?: Promise<{ search?: string }>,
  search?: string 
}) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const searchTerm = directSearch || resolvedSearchParams.search;
  const products: Product[] = await getAllProducts(searchTerm);

  return (
    <div className="p-5 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold">
        {searchTerm ? `🔍 Search Results for "${searchTerm}"` : '🛒 Product Listing'}
      </h1>
      <p className="text-gray-600">
        {searchTerm ? `Found ${products.length} products` : 'Click on any product to see its details.'}
      </p>

      {products.length === 0 ? (
        <div className="mt-10 text-center p-10 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
          <h2 className="text-xl font-semibold text-gray-500">
            {searchTerm ? `No products matching "${searchTerm}"` : 'No products found!'}
          </h2>
          <p className="text-gray-400 mt-2">
            {searchTerm ? 'Try searching for something else.' : (
              <>Please add products in the <Link href="/studio" className="text-blue-600 hover:underline">Sanity Studio</Link>.</>
            )}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
          {products.map((product: Product, index: number) => (
            <FadeIn key={product._id} delay={index * 0.05}>
              <HoverScale className="h-full">
                <Link href={`/products/${product.slug.current}`} className="block h-full border border-gray-200 rounded-2xl p-4 text-center shadow-sm bg-white hover:border-blue-200 transition-colors">
                  <HoverImage
                    src={urlFor(product.mainImage).url()}
                    alt={product.title}
                    className="aspect-square mb-4 rounded-xl bg-gray-50"
                  />

                  <h3 className="text-lg font-bold text-gray-900 truncate px-2">
                    {product.title}
                  </h3>

                  <div className="flex items-center justify-center gap-2 mt-2">
                    <p className="text-blue-600 text-xl font-extrabold">
                      ${product.price}
                    </p>
                  </div>

                  <div className="mt-4 bg-blue-600 text-white py-2 rounded-xl font-semibold hover:bg-blue-700 transition active:scale-95">
                    View Details
                  </div>
                </Link>
              </HoverScale>
            </FadeIn>
          ))}
        </div>
      )}
    </div>
  );
}