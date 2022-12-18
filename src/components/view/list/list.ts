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


}

export default ProductsList;
