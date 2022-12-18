import { IProduct, IProductList } from '../../app/app';
import { IFilterSort, numberRange } from '../../controller/controller';
import './list.css';

class ProductsList {
  
  showProductsList(data: IProductList): void {
    document.querySelector('.products-list')!.innerHTML = '';
    const fragment: DocumentFragment = document.createDocumentFragment();
    const productItemTemp: HTMLTemplateElement = <HTMLTemplateElement>document.querySelector('#productTempl');

    data.products.forEach((item: IProduct) => {
      if (!item.excluded) {
        const productClone: HTMLElement = <HTMLElement>productItemTemp.content.cloneNode(true);

        productClone.querySelector('.item-id')!.innerHTML = item.id.toString();
        productClone.querySelector('.item-brand')!.innerHTML = item.brand;
        productClone.querySelector('.item-category')!.innerHTML = item.category;
        productClone.querySelector('.item-title')!.innerHTML = item.title;
        productClone.querySelector('.item-description')!.innerHTML = item.description;
        productClone.querySelector('.item-price')!.innerHTML = item.price.toString();
        productClone.querySelector('.item-discount')!.innerHTML = item.discountPercentage.toString();
        productClone.querySelector('.item-rating')!.innerHTML = item.rating.toString();
        productClone.querySelector('.item-stock')!.innerHTML = item.stock.toString();
        
        fragment.append(productClone);
      }
    });
    document.querySelector('.products-list')!.appendChild(fragment);
  }

  createProductsFilter(data: IProductList, filterSortParams: IFilterSort): void {

    const filterBrands: string[] = [];
    const filterCategory: string[] = [];

    data.products.forEach((item: IProduct) => {

      const brand: string = item.brand;
      if (!filterBrands.includes(brand)) {
        filterBrands.push(brand);
      }
      filterBrands.sort();

      const category: string = item.category;
      if (!filterCategory.includes(category)) {
        filterCategory.push(category);
      }
      filterCategory.sort();

    });

    filterBrands.forEach((brand, indx) => {
      const elementLabel: HTMLLabelElement = <HTMLLabelElement>document.createElement('LABEL');
      const elementText: HTMLSpanElement = <HTMLSpanElement>document.createElement('SPAN');
      const elementCount: HTMLSpanElement = <HTMLSpanElement>document.createElement('SPAN');
      const elementInput: HTMLInputElement = <HTMLInputElement>document.createElement('INPUT');
      elementInput.type = 'checkbox';
      elementInput.name = 'brand' + indx.toString();
      elementInput.value = brand;
      elementInput.checked = (filterSortParams.brands.includes(brand)) ? true : false;
      elementText.textContent = brand;
      elementLabel.append(elementInput);
      elementLabel.append(elementText);
      elementLabel.append(elementCount);
      document.querySelector('.brand-filter')!.appendChild(elementLabel);
    });

    filterCategory.forEach((category, indx) => {
      const elementLabel: HTMLLabelElement = <HTMLLabelElement>document.createElement('LABEL');
      const elementText: HTMLSpanElement = <HTMLSpanElement>document.createElement('SPAN');
      const elementCount: HTMLSpanElement = <HTMLSpanElement>document.createElement('SPAN');
      const elementInput: HTMLInputElement = <HTMLInputElement>document.createElement('INPUT');
      elementInput.type = 'checkbox';
      elementInput.name = 'category' + indx.toString();
      elementInput.value = category;
      elementInput.checked = (filterSortParams.categories.includes(category)) ? true : false;
      elementText.textContent = category;
      elementLabel.append(elementInput);
      elementLabel.append(elementText);
      elementLabel.append(elementCount);
      document.querySelector('.category-filter')!.appendChild(elementLabel);
    });
  }

  
  styleFilterFields(data: IProductList, filterSortParams: IFilterSort): void {
    const countBrandsMap = new Map<string, number[]>();
    const countCategoriesMap = new Map<string, number[]>();
    let
      minPrice = Number.MAX_VALUE, 
      maxPrice = 0,
      priceFrom = Number.MAX_VALUE,
      priceTo = 0,
      minStock = Number.MAX_VALUE, 
      maxStock = 0,
      stockFrom = Number.MAX_VALUE,
      stockTo = 0;

    data.products.forEach((item: IProduct) => {
      const countBrand: number[] = countBrandsMap.get(item.brand) || [0, 0];
      const countCategories: number[] = countCategoriesMap.get(item.category) || [0, 0];
      countBrand[1] += 1;
      countCategories[1] += 1;
      minPrice = (item.price < minPrice) ? item.price : minPrice;
      maxPrice = (item.price > maxPrice) ? item.price : maxPrice;
      minStock = (item.stock < minStock) ? item.stock : minStock;
      maxStock = (item.stock > maxStock) ? item.stock : maxStock;
      if (!item.excluded) {
        countBrand[0] += 1;
        countCategories[0] += 1;
        priceFrom = (item.price < priceFrom) ? item.price : priceFrom;
        priceTo = (item.price > priceTo) ? item.price : priceTo;
        stockFrom = (item.stock < stockFrom) ? item.stock : stockFrom;
        stockTo = (item.stock > stockTo) ? item.stock : stockTo;
      }
      countBrandsMap.set(item.brand, countBrand);
      countCategoriesMap.set(item.category, countCategories);
    });

    (document.querySelectorAll('[name^=brand], [name^=category]') as NodeListOf<HTMLInputElement>).forEach((input) => {
      input.parentElement!.style.fontWeight = 'normal';
    });

    const clearFilter: boolean = (!filterSortParams.brands.length && !filterSortParams.categories.length);
    (document.querySelectorAll('[name^=brand]') as NodeListOf<HTMLInputElement>).forEach((input) => {
      const brands: number[] | undefined = countBrandsMap.get(input.value);
      if (countBrandsMap.has(input.value) && !clearFilter && brands && brands[0] > 0) {
        input.parentElement!.style.fontWeight = 'bold';
      }
      if (!filterSortParams.brands.length) {
        input.checked = false;
      }
      const spanCount: Element | undefined = input.parentElement!.querySelectorAll('SPAN')[1];
      if (spanCount) {
        if (brands) {
          spanCount.innerHTML = (clearFilter) ? '[' + brands[1] + '/' + brands[1] + ']' : '[' + brands.join('/') + ']';
        }
      }
    });

    (document.querySelectorAll('[name^=category]') as NodeListOf<HTMLInputElement>).forEach((input) => {
      const categories: number[] | undefined = countCategoriesMap.get(input.value);
      if (countCategoriesMap.has(input.value) && !clearFilter && categories && categories[0] > 0) {
        input.parentElement!.style.fontWeight = 'bold';
      }
      if (!filterSortParams.categories.length) {
        input.checked = false;
      }
      const spanCount: Element | undefined = input.parentElement!.querySelectorAll('SPAN')[1];
      if (spanCount) {
        if (categories) {
          spanCount.innerHTML = (clearFilter) ? '[' + categories[1] + '/' + categories[1] + ']' : '[' + categories.join('/') + ']';
        }
      }
    });

    document.querySelector('.min-price')!.innerHTML = minPrice.toString();
    document.querySelector('.max-price')!.innerHTML = maxPrice.toString();
    document.querySelector('.min-stock')!.innerHTML = minStock.toString();
    document.querySelector('.max-stock')!.innerHTML = maxStock.toString();

    this.updateFieldsValues(filterSortParams);

  }

  updateFieldsValues(filterSortParams: IFilterSort): void {
    (<HTMLSelectElement>document.querySelector('.sort')!).value = filterSortParams.sort || 'brand';
    (<HTMLInputElement>document.querySelector('.stock-from')!).value = (filterSortParams.stock) ? filterSortParams.stock[0].toString() : '';
    (<HTMLInputElement>document.querySelector('.stock-to')!).value = (filterSortParams.stock) ? filterSortParams.stock[1].toString() : '';
    (<HTMLInputElement>document.querySelector('.price-from')!).value = (filterSortParams.price) ? filterSortParams.price[0].toString() : '';
    (<HTMLInputElement>document.querySelector('.price-to')!).value = (filterSortParams.price) ? filterSortParams.price[1].toString() : '';

  }

}

export default ProductsList;
