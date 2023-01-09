import { stringPair } from '../app/types';

class View {
  layers: string[];

  constructor() {
    this.layers = ['.products-list-page', '.product-page', '.cart-page', '.page-404'];

    window.onpopstate = function () {
      window.location.reload();
    };
  }

  hideAllLayers(): void {
    this.layers.forEach((selector) => {
      document.querySelector(selector)!.classList.add('hide');
    });
  }

  updateUrl(path: string, params: stringPair): void {
    const href: string = window.location.href;
    const url: URL = new URL(href.indexOf('?') !== -1 ? href.slice(0, href.indexOf('?')) : href);
    Object.keys(params).forEach((key) => {
      if (params[key]) {
        url.searchParams.set(key, params[key]);
      }
    });
    url.pathname = path;
    window.history.pushState({}, '', url);
  }

  safeInnerHTML(selector: string, value: string, root?: HTMLElement): void {
    const parentElement: Document | HTMLElement = root ? root : document;
    const searchElement: Element | null = parentElement.querySelector(selector);
    if (searchElement) {
      searchElement.innerHTML = value;
    }
  }

  safeAttribute(selector: string, attribute: string, value: string, root?: HTMLElement): void {
    const parentElement: Document | HTMLElement = root ? root : document;
    const searchElement: Element | null = parentElement.querySelector(selector);
    if (searchElement) {
      searchElement.setAttribute(attribute, value);
    }
  }

  show404(): void {
    this.hideAllLayers();
    document.querySelector('.page-404')!.classList.remove('hide');
  }
}

export default View;
