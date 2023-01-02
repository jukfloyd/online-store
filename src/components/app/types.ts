export interface IProduct {
  id: number,
  title: string,
  description: string,
  price: number,
  discountPercentage: number,
  rating: number,
  stock: number,
  brand: string,
  category: string,
  thumbnail: string,
  images: string[],
  excluded?: boolean,
  cart?: number,
}

export interface IProductList {
  products: IProduct[];
  total?: number,
	skip?: number,
	limit?: number,
}

export interface IFilterSort {
  sort?: string,
  brands: string[],
  categories: string[],
  price?: numberRange,
  stock?: numberRange,
  search?: string,
  viewType?: string,
  id?: number,
}

export type KeyValuePair = {
  [key: string]: number;
}

export type stringPair = {
  [key: string]: string;
}

export type checkResult = [boolean, string?];
export type numberRange = [number, number];
export type number4Range = [number, number, number, number];
export type CartType = [KeyValuePair, string[]?];
export type StrNumArr = [string, number];

export interface IPagination {
  countOnPage: number,
  pageNum: number,
}
