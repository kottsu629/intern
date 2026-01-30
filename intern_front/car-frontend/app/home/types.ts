export type Car = {
  id: number;
  model: string;
  year: number;
  price: number;
};

export type CarCreateRequest = {
  model: string;
  year: number;
  price: number;
};

export type BidCreateRequest = {
  car_id: number;
  amount: number;
  bidder: string;
  request_id: string;
};
