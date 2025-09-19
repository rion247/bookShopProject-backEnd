export interface TProduct {
  title: string;
  author: string;
  category: string;
  price: number;
  quantity: number;
  image: string;
  status: 'available' | 'out-of-stock';
}
