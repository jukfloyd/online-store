import { IProduct, IProductList, IFilterSort, numberRange } from '../app/types';

class ProductModel {
  data: IProductList

  constructor(data: IProductList) {
    this.data = data;
  }

  filterAndSort(filterSortParams: IFilterSort): IProductList {

    // filter
    this.data.products.forEach((item: IProduct) => {
      if (
          (filterSortParams.brands.length === 0 || filterSortParams.brands.includes(item.brand))
          &&
          (filterSortParams.categories.length === 0 || filterSortParams.categories.includes(item.category))
          &&
          (!filterSortParams.price || (item.price >= filterSortParams.price[0] && item.price <= filterSortParams.price[1]))
          &&
          (!filterSortParams.stock || (item.stock >= filterSortParams.stock[0] && item.stock <= filterSortParams.stock[1]))
          &&
          (!filterSortParams.search || 
            (
              item.brand.toUpperCase().includes(filterSortParams.search.toUpperCase()) ||
              item.category.toUpperCase().includes(filterSortParams.search.toUpperCase()) ||
              item.title.toUpperCase().includes(filterSortParams.search.toUpperCase()) ||
              item.description.toUpperCase().includes(filterSortParams.search.toUpperCase()) ||
              item.price.toString().includes(filterSortParams.search) ||
              item.discountPercentage.toString().includes(filterSortParams.search) ||
              item.rating.toString().includes(filterSortParams.search) ||
              item.stock.toString().includes(filterSortParams.search)
            )
          )
        ) {
        item.excluded = false;
      } else {
        item.excluded = true;
      }
    });

    // sort
    if (filterSortParams.sort === 'priceAsc') {
      this.data.products.sort((a: IProduct, b: IProduct): number  => a.price - b.price);
    }
    if (filterSortParams.sort === 'priceDesc') {
      this.data.products.sort((a: IProduct, b: IProduct): number  => b.price - a.price);
    }
    if (filterSortParams.sort === 'ratingAsc') {
      this.data.products.sort((a: IProduct, b: IProduct): number  => a.rating - b.rating);
    }
    if (filterSortParams.sort === 'ratingDesc') {
      this.data.products.sort((a: IProduct, b: IProduct): number  => b.rating - a.rating);
    }
    if (filterSortParams.sort === 'brand') {
      this.data.products.sort((a: IProduct, b: IProduct): number  => {
        if (a.brand > b.brand) {
          return 1;
        } else if (a.brand < b.brand) {
          return -1;
        } else {
          return 0;
        }
      });
    }

    return this.data;
  }

  getFilteredCount(): number {
    return this.data.products.filter(_ => _.excluded === false).length;
  }

  getCountByKey(key: 'brand' | 'category'): Map<string, numberRange> {
    const countMap = new Map<string, numberRange>();
    this.data.products.forEach((item: IProduct) => {
      const count: numberRange = countMap.get(item[key]) || [0, 0];
      count[1] += 1;
      if (!item.excluded) {
        count[0] += 1;
      }
      countMap.set(item[key], count);
    });
    return countMap;
  }

  getSorted(key: 'brand' | 'category'): string[] {
    const result: string[] = [];
    this.data.products.forEach((item: IProduct) => {
      if (!result.includes(item[key])) {
        result.push(item[key]);
      }
      result.sort();
    });
    return result;
  }

  getPriceRange(): numberRange {
    let min = Number.MAX_VALUE, max = 0;
    let minFilter = Number.MAX_VALUE, maxFilter = 0;
    this.data.products.forEach((item: IProduct) => {
      min = (item.price < min) ? item.price : min;
      max = (item.price > max) ? item.price : max;
      if (!item.excluded) {
        minFilter = (item.price < minFilter) ? item.price : minFilter;
        maxFilter = (item.price > maxFilter) ? item.price : maxFilter;
      }
    });
    if (minFilter === Number.MAX_VALUE && maxFilter === 0) {
      minFilter = 0;
    } else {
      if (maxFilter > max) {
        maxFilter = max;
      }
      if (minFilter < min) {
        minFilter = min;
      }
    }
    return [min, max, minFilter, maxFilter];
  }

  getStockRange(): numberRange {
    let min = Number.MAX_VALUE, max = 0;
    let minFilter = Number.MAX_VALUE, maxFilter = 0;
    this.data.products.forEach((item: IProduct) => {
      min = (item.stock < min) ? item.stock : min;
      max = (item.stock > max) ? item.stock : max;
      if (!item.excluded) {
        minFilter = (item.stock < minFilter) ? item.stock : minFilter;
        maxFilter = (item.stock > maxFilter) ? item.stock : maxFilter;
      }
    });
    if (maxFilter > max) {
      maxFilter = max;
    }
    if (minFilter < min) {
      minFilter = min;
    }
    return [min, max, minFilter, maxFilter];
  }

  getProductById(id: number): IProduct | undefined {
    return this.data.products.filter(_ => _.id === id)[0];
  }

}

export default ProductModel;