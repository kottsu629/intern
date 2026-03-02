export type Car = {
  id: number;
  model: string;
  year: number;
  price: number;
};

export type Bid = {
  id: number;
  car_id: number;
  amount: number;
  bidder: string;
  request_id: string;
  created_at: string;
};