export type NewProductDto = {
  name: string;
  description: string;
  brand: string;
  price: number;
  category: number;
  is_published: boolean;
  colors: string[];
  sizes: string[];
}