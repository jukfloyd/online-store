import { IProduct, IProductList, IFilterSort, numberRange } from '../../app/types';
import View from '../view';
import './products.css';

class ProductsView extends View {
  showProductsList(data: IProductList, filterSortParams: IFilterSort): void {
    document.querySelector('.products-list')!.innerHTML = '';
    filterSortParams.viewType === 'card'
      ? document.querySelector('.products-list')!.classList.add('cards')
      : document.querySelector('.products-list')!.classList.remove('cards');
    const fragment: DocumentFragment = document.createDocumentFragment();
    const productItemTemp: HTMLTemplateElement = <HTMLTemplateElement>(
      document.querySelector('#productTempl' + filterSortParams.viewType)
    );

    data.products.forEach((item: IProduct) => {
      if (!item.excluded) {
        const productClone: HTMLElement = <HTMLElement>productItemTemp.content.cloneNode(true);

        this.safeInnerHTML('.item-brand', item.brand, productClone);
        this.safeInnerHTML('.item-category', item.category, productClone);
        this.safeInnerHTML('.item-title', item.title, productClone);
        this.safeInnerHTML('.item-description', item.description, productClone);
        this.safeInnerHTML('.item-price', '€' + item.price.toFixed(2), productClone);
        this.safeInnerHTML('.item-discount', item.discountPercentage.toString() + '%', productClone);
        this.safeInnerHTML('.item-rating', item.rating.toString(), productClone);
        this.safeInnerHTML('.item-stock', item.stock.toString(), productClone);
        this.safeAttribute('.add-to-cart-button', 'data-id', item.id.toString(), productClone);
        this.safeAttribute('.detail-button', 'data-id', item.id.toString(), productClone);

        const imgDiv: Element | null = productClone.querySelector('.product-image');
        if (imgDiv) {
          (<HTMLElement>imgDiv).style.backgroundImage = "url('" + item.thumbnail + "')";
        }

        fragment.append(productClone);
      }
    });
    const productCount: number = data.products.filter((_) => !_.excluded).length;
    document.querySelector('.products-count')!.innerHTML = `${productCount}`;
    if (productCount) {
      document.querySelector('.products-list')!.appendChild(fragment);
      document.querySelector('.products-not-found')!.innerHTML = '';
      document.querySelector('.products-not-found')!.classList.add('hide');
    } else {
      document.querySelector('.products-not-found')!.innerHTML = 'Nothing found :(';
      document.querySelector('.products-not-found')!.classList.remove('hide');
    }
    document.querySelector('.products-list-page')!.classList.remove('hide');
  }

  createProductsFilter(filterContent: IFilterSort): void {
    const filterTemp: HTMLTemplateElement = <HTMLTemplateElement>document.querySelector('#checkboxWithCount');

    // Set brands
    const fragmentBrand: DocumentFragment = document.createDocumentFragment();
    filterContent.brands.forEach((item) => {
      const elemClone: HTMLElement = <HTMLElement>filterTemp.content.cloneNode(true);
      elemClone.querySelector('.filter-checkbox__text')!.textContent = item;
      (<HTMLInputElement>elemClone.querySelector('.filter-checkbox__input')!).value = item;
      fragmentBrand.append(elemClone);
    });
    document.querySelector('.filter-brand')!.append(fragmentBrand);

    // Set categories
    const fragmentCategory: DocumentFragment = document.createDocumentFragment();
    filterContent.categories.forEach((item) => {
      const elemClone: HTMLElement = <HTMLElement>filterTemp.content.cloneNode(true);
      elemClone.querySelector('.filter-checkbox__text')!.textContent = item;
      (<HTMLInputElement>elemClone.querySelector('.filter-checkbox__input')!).value = item;
      fragmentCategory.append(elemClone);
    });
    document.querySelector('.filter-category')!.append(fragmentCategory);

    // Set Price Range
    const priceFieldFrom: Element | null = document.querySelector('.price-from');
    const priceFieldTo: Element | null = document.querySelector('.price-to');
    if (priceFieldFrom && priceFieldTo && filterContent.price) {
      (<HTMLInputElement>priceFieldFrom).value =
        (<HTMLInputElement>priceFieldFrom).min =
        (<HTMLInputElement>priceFieldTo).min =
          filterContent.price[0].toString();
      (<HTMLInputElement>priceFieldTo).value =
        (<HTMLInputElement>priceFieldFrom).max =
        (<HTMLInputElement>priceFieldTo).max =
          filterContent.price[1].toString();
      (<HTMLElement>document.querySelector('.price-from-value')!).textContent = '€' + filterContent.price[0].toFixed(2);
      (<HTMLElement>document.querySelector('.price-to-value')!).textContent = '€' + filterContent.price[1].toFixed(2);
    }

    // Set Stock range
    const stockFieldFrom: Element | null = document.querySelector('.stock-from');
    const stockFieldTo: Element | null = document.querySelector('.stock-to');
    if (stockFieldFrom && stockFieldTo && filterContent.stock) {
      (<HTMLInputElement>stockFieldFrom).value =
        (<HTMLInputElement>stockFieldFrom).min =
        (<HTMLInputElement>stockFieldTo).min =
          filterContent.stock[0].toString();
      (<HTMLInputElement>stockFieldTo).value =
        (<HTMLInputElement>stockFieldFrom).max =
        (<HTMLInputElement>stockFieldTo).max =
          filterContent.stock[1].toString();
      (<HTMLElement>document.querySelector('.stock-from-value')!).textContent = '€' + filterContent.stock[0].toFixed(2);
      (<HTMLElement>document.querySelector('.stock-to-value')!).textContent = '€' + filterContent.stock[1].toFixed(2);
    }
  }

  updateBrandFilter(filterSortParams: IFilterSort, count: Map<string, numberRange>): void {
    (document.querySelectorAll('.filter-brand input') as NodeListOf<HTMLInputElement>).forEach((input) => {
      input.checked = filterSortParams.brands.includes(input.value);
      const countRange: numberRange | undefined = count.get(input.value);
      input.parentNode!.querySelector('.filter-brand .filter-checkbox__count')!.innerHTML = countRange
        ? '[' + countRange.join('/') + ']'
        : '';
      input
        .parentNode!.querySelector('.filter-brand .filter-checkbox__text')!
        .classList.toggle('filter-checkbox__text_light', countRange && countRange[0] === 0);
    });
  }

  updateCategoryFilter(filterSortParams: IFilterSort, count: Map<string, numberRange>): void {
    (document.querySelectorAll('.filter-category input') as NodeListOf<HTMLInputElement>).forEach((input) => {
      input.checked = filterSortParams.categories.includes(input.value);
      const countRange: numberRange | undefined = count.get(input.value);
      input.parentNode!.querySelector('.filter-category .filter-checkbox__count')!.innerHTML = countRange
        ? '[' + countRange.join('/') + ']'
        : '';
      input
        .parentNode!.querySelector('.filter-category .filter-checkbox__text')!
        .classList.toggle('filter-checkbox__text_light', countRange && countRange[0] === 0);
    });
  }

  updatePriceFilter(from: number, to: number): void {
    if (from !== 0 && to !== 0) {
      (<HTMLInputElement>document.querySelector('.price-from')!).value = from.toString();
      (<HTMLInputElement>document.querySelector('.price-to')!).value = to.toString();
      (<HTMLElement>document.querySelector('.price-from-value')!).textContent = '€' + from.toFixed(2);
      (<HTMLElement>document.querySelector('.price-to-value')!).textContent = '€' + to.toFixed(2);
    } else {
      (<HTMLElement>document.querySelector('.price-from-value')!).textContent = '';
      (<HTMLElement>document.querySelector('.price-to-value')!).textContent = '';
    }
  }

  updateStockFilter(from: number, to: number): void {
    if (from !== 0 && to !== 0) {
      (<HTMLInputElement>document.querySelector('.stock-from')!).value = from.toString();
      (<HTMLInputElement>document.querySelector('.stock-to')!).value = to.toString();
      (<HTMLElement>document.querySelector('.stock-from-value')!).textContent = from.toString();
      (<HTMLElement>document.querySelector('.stock-to-value')!).textContent = to.toString();
    } else {
      (<HTMLElement>document.querySelector('.stock-from-value')!).textContent = '';
      (<HTMLElement>document.querySelector('.stock-to-value')!).textContent = '';
    }
  }

  updateOtherFilter(filterSortParams: IFilterSort): void {
    // Sort
    (<HTMLSelectElement>document.querySelector('.sort')!).value = filterSortParams.sort || 'brand';

    //Search
    (<HTMLInputElement>document.querySelector('.search')!).value = filterSortParams.search || '';

    // View
    document.querySelectorAll('.view-button').forEach((elem) => {
      elem.getAttribute('value') === filterSortParams.viewType
        ? elem.classList.add('active')
        : elem.classList.remove('active');
    });
  }

  changeCopyButton(): void {
    (<HTMLElement>document.querySelector('.filter-copy')!).textContent = 'Copied!';
    setTimeout(() => {
      (<HTMLElement>document.querySelector('.filter-copy')!).textContent = 'Copy';
    }, 3000);
  }

  showProduct(item: IProduct) {
    (<HTMLElement>document.querySelector('.products-list-page')!).style.display = 'none';

    this.safeInnerHTML('.product-page .item-brand', item.brand);
    this.safeInnerHTML('.product-page .item-category', item.category);
    this.safeInnerHTML('.product-page .item-title', item.title);
    this.safeInnerHTML('.product-page .item-description', item.description);
    this.safeInnerHTML('.product-page .item-price', '€' + item.price.toFixed(2));
    this.safeInnerHTML('.product-page .item-discount', item.discountPercentage.toString() + '%');
    this.safeInnerHTML('.product-page .item-rating', item.rating.toString());
    this.safeInnerHTML('.product-page .item-stock', item.stock.toString());
    this.safeAttribute('.product-page .add-to-cart-button', 'data-id', item.id.toString());
    this.safeAttribute('.product-page .product-buy', 'data-id', item.id.toString());

    const imgDiv: Element | null = document.querySelector('.product-page .product-photo-big');
    const allPhoto: Element | null = document.querySelector('.product-photo-all');
    if (imgDiv && allPhoto) {
      (<HTMLElement>imgDiv).style.backgroundImage = "url('" + item.thumbnail + "')";
      item.images.forEach((imageUrl) => {
        const smallPhoto: HTMLDivElement = document.createElement('div');
        smallPhoto.classList.add('product-photo-small');
        smallPhoto.style.backgroundImage = "url('" + imageUrl + "')";
        allPhoto.append(smallPhoto);
      });
    }

    const breadCategory: HTMLAnchorElement = <HTMLAnchorElement>document.querySelector('.breadcrumbs .category');
    breadCategory!.href = 'index.html?categories=' + encodeURIComponent(item.category);
    breadCategory!.innerHTML = item.category;
    const breadBrand: HTMLAnchorElement = <HTMLAnchorElement>document.querySelector('.breadcrumbs .brand');
    breadBrand!.href =
      'index.html?categories=' + encodeURIComponent(item.category) + '&brands=' + encodeURIComponent(item.brand);
    breadBrand!.innerHTML = item.brand;
    document.querySelector('.breadcrumbs .product')!.innerHTML = item.title;
    document.querySelector('.product-page')!.classList.remove('hide');
  }

  showBigPicture(product: IProduct, indx: number): void {
    (<HTMLElement>document.querySelector('.product-page .product-photo-big')!).style.backgroundImage =
      "url('" + product.images[indx] + "')";
  }

  changeCartButtons(data: IProduct[]): void {
    const idArray: number[] = data.map((_) => _.id);
    document.querySelectorAll('.add-to-cart-button').forEach((item) => {
      const id: string | null = item.getAttribute('data-id');
      if (id && idArray.includes(parseInt(id))) {
        item.innerHTML = 'Drop from Cart';
        item.classList.add('in-cart');
      } else {
        item.innerHTML = 'Add to Cart';
        item.classList.remove('in-cart');
      }
    });
  }
}

export default ProductsView;
