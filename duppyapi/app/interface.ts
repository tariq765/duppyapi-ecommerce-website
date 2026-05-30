// interfaces.ts

export interface Product {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  mainImage: any;
  gallery?: any[];
  id: number;
  thumbnail?: string;
  images?: string[];
}


export interface ProductsResponse {
  products: Product[];
  total?: number;
  skip?: number;
  limit?: number;
}
