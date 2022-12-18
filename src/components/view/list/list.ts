import { IProduct, IProductList } from '../../app/app';
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



}

export default ProductsList;
