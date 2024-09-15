export type TItem = {
  id: number;
  nano_id: string;
  store_id: string;
  name: string;
  description: string;
  price: number;
  discount: number;
  colors: string[];
  sizes: string[];
  quantities: {
    color: string;
    size: string;
    quantity: number;
  };
  category: string[];
};
