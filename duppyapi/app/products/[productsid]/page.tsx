import Link from 'next/link';
import { Product } from '@/app/interface';
import { Metadata } from 'next';
import ProductActions from '@/app/components/ProductActions';
import { FadeIn, SlideIn, HoverScale, HoverImage, HoverLink, HoverBadge, HoverStar, HoverPrice } from '@/app/components/AnimateIn';
import { urlFor } from '@/lib/sanity.client';
import { getProduct } from '@/lib/productApi';

interface PageProps {
  params: Promise<{
    productsid: string;
  }>;
}

// Dynamic metadata generation for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { productsid } = await params;
  try {
    const product = await getProduct(productsid);
    
    if (!product) return { title: 'Product Not Found' };
    
    return {
      title: `${product.title} - Duppy Store`,
      description: product.description,
    };
  } catch {
    return { title: 'Product Details' };
  }
}


export default async function ProductDetailPage({ params }: PageProps) {
  const { productsid } = await params;
  const product = await getProduct(productsid);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-5 text-center bg-gray-50">
        <h2 className="text-3xl font-extrabold text-red-600 mb-4">Product Not Found!</h2>
        <p className="text-gray-500 mb-6">The product you are looking for does not exist or has been removed.</p>
        <Link href="/products" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition">
          Back to Products
        </Link>
      </div>
    );
  }

  // Calculate discounted original price
  const originalPrice = (product.price / (1 - product.discountPercentage / 100)).toFixed(2);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <FadeIn delay={0.1}>
          <HoverLink className="inline-block mb-8">
            <Link href="/products" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold transition">
              ← Back to Products Listing
            </Link>
          </HoverLink>
        </FadeIn>

        {/* Product Card container */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-10">
          
          {/* Images Section */}
          <SlideIn direction="left" delay={0.2} className="flex flex-col gap-4">
            <div className="flex flex-col gap-4">
              <HoverImage 
                src={urlFor(product.mainImage).url()} 
                alt={product.title} 
                className="aspect-square w-full rounded-xl bg-gray-100 border border-gray-200 shadow-sm"
              />
              
              {/* Gallery of other images */}
              {product.gallery && product.gallery.length > 0 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.gallery.slice(0, 4).map((img, idx) => (
                    <HoverScale key={idx}>
                      <div className="aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-50 h-full w-full">
                        <img src={urlFor(img).url()} alt={`${product.title} gallery ${idx}`} className="w-full h-full object-cover" />
                      </div>
                    </HoverScale>
                  ))}
                </div>
              )}
            </div>
          </SlideIn>

          {/* Details Section */}
          <SlideIn direction="right" delay={0.3} className="flex flex-col justify-between">
            <div className="flex flex-col justify-between h-full">
              <div>
                {/* Category & Brand badges */}
                <div className="flex gap-2 mb-4">
                  {product.category && (
                    <HoverBadge 
                      hoverColor="#dbeafe"
                      className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded uppercase tracking-wider"
                    >
                      {product.category}
                    </HoverBadge>
                  )}
                  {product.brand && (
                    <HoverBadge 
                      hoverColor="#f3f4f6"
                      className="bg-gray-100 text-gray-800 text-xs font-semibold px-2.5 py-0.5 rounded uppercase tracking-wider"
                    >
                      {product.brand}
                    </HoverBadge>
                  )}
                </div>

                {/* Title */}
                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2 leading-tight">
                  {product.title}
                </h1>

                {/* Rating */}
                <div className="flex items-center mb-6">
                  <div className="flex text-yellow-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <HoverStar 
                        key={i} 
                        className="text-xl"
                      >
                        {i < Math.floor(product.rating) ? '★' : '☆'}
                      </HoverStar>
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-500 font-semibold">
                    {product.rating} / 5
                  </span>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-base leading-relaxed mb-6">
                  {product.description}
                </p>
              </div>

              <div>
                {/* Pricing section */}
                <div className="border-t border-b border-gray-100 py-6 mb-6">
                  <div className="flex items-baseline gap-4">
                    <HoverPrice className="text-3xl font-extrabold text-gray-900">
                      ${product.price}
                    </HoverPrice>
                    {product.discountPercentage > 0 && (
                      <>
                        <span className="text-lg text-gray-400 line-through">
                          ${originalPrice}
                        </span>
                        <HoverBadge 
                          hoverColor="#f0fdf4"
                          className="text-sm font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded"
                        >
                          {product.discountPercentage}% OFF
                        </HoverBadge>
                      </>
                    )}
                  </div>
                  
                  {/* Stock info */}
                  <div className="mt-4">
                    {product.stock > 0 ? (
                      <HoverScale className="inline-block w-auto h-auto">
                        <span className="text-sm font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                          ✓ In Stock ({product.stock} available)
                        </span>
                      </HoverScale>
                    ) : (
                      <HoverScale className="inline-block w-auto h-auto">
                        <span className="text-sm font-semibold text-rose-600 bg-rose-50 px-3 py-1 rounded-full">
                          ✗ Out of Stock
                        </span>
                      </HoverScale>
                    )}
                  </div>
                </div>

                {/* Actions */}
                {/* We might need to adjust ProductActions to handle the new product object structure if it uses dummy fields like thumbnail */}
                <ProductActions product={{
                  ...product,
                  id: Number(product._id.replace(/\D/g, '').slice(0, 9)) || 0, // Fallback ID for CartContext
                  thumbnail: urlFor(product.mainImage).url(),
                  images: product.gallery?.map(img => urlFor(img).url()) || []
                } as any} />
              </div>

            </div>
          </SlideIn>

        </div>
      </div>
    </div>
  );
}
