export interface HOYAPrice {
  symbol: string;
  price: string;
}

export interface HOYAApiResponse {
  data: HOYAPrice[];
}

export interface MAXPrice {
  price: string;
}

export interface BitoProPrice {
  price: string;
}

export interface BitoProApiResponse {
  data: BitoProPrice[];
}
