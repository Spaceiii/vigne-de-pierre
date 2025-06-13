export type CartEntry = {
  id: string;
  name: string;
  price: number;
}

export type CartItem = CartEntry & {
  quantity: number;
}
