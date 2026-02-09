// types.ts
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