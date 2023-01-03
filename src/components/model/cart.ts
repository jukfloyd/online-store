import { IProduct, IPagination, KeyValuePair, CartType, StrNumArr } from "../app/types";

const promoCodeValues: KeyValuePair = {
  'rs': 10,
  'epm': 20,
}

class CartModel {
  products: IProduct[];
  promoCodes: string[];

  constructor(data: IProduct[]) {
    const cartInStorage: string | null = localStorage.getItem('cart');
    if (cartInStorage) {
      const cart: CartType = JSON.parse(cartInStorage);
      const idAndCount: KeyValuePair = cart[0];
      this.products = data.filter(_ => Object.keys(idAndCount).includes(_.id.toString()));
      this.products = this.products.map(_ => {
        _.cart = idAndCount[_.id];
        return _;
      });
      this.promoCodes = cart[1] || [];
    } else {
      this.products = [];
      this.promoCodes = [];
    }

  }

  addOrDrop(product: IProduct): void {
    if (!this.hasId(product.id)) {
      product.cart = 1;
      this.products.push(product);
    } else {
      product.cart = 0;
      this.products = this.products.filter(_ => _.id !== product.id);
    }
    this.saveToLocalStorage();
  }

  hasId(id: number): boolean {
    return (this.products.filter(_ => _.id === id).length) ? true : false;
  }

  saveToLocalStorage() {
    const idAndCount: KeyValuePair = {};
    const cart: CartType = [idAndCount];
    this.products.forEach(_ => {
      idAndCount[_.id.toString()] = (_.cart) ? _.cart : 0;
    });
    cart.push(this.promoCodes);
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  plusCount(product: IProduct): void {
    product.cart = (product.cart && product.cart < product.stock) ? product.cart + 1 : product.cart;
    this.saveToLocalStorage();
  }

  minusCount(product: IProduct): void {
    if (product.cart && product.cart > 1) {
      product.cart -= 1;
    } else {
      this.addOrDrop(product);
    }
    this.saveToLocalStorage();
  }

  getCount(): number {
    return this.products.reduce( (count: number, item: IProduct) => {
      return count + (item.cart ? item.cart : 0);
    }, 0);
  }

  getTotalSum(): number {
    return this.products.reduce( (total: number, item: IProduct) => {
      return total + (item.price * (item.cart ? item.cart : 0) );
    }, 0);
  }

  getTotalSumWithDiscount(): number {
    const totalSum: number = this.getTotalSum();
    const totalDiscount: number = this.promoCodes.map(_ => promoCodeValues[_]).reduce((sum, currValue) => sum += currValue, 0);
    return Math.round(100*totalSum*(1 - 0.01*totalDiscount))/100;
  }

  searchNotAppliedPromoCode(promoText: string): StrNumArr | null {
    if (this.promoCodes.includes(promoText) || !promoCodeValues[promoText]) {
      return null;
    }
    return [promoText, promoCodeValues[promoText]];
  }

  applyPromoCode(promoText: string): void {
    if (!this.promoCodes.includes(promoText) && promoCodeValues[promoText]) {
      this.promoCodes.push(promoText);
      this.saveToLocalStorage();
    }
  }

  getAllAppliedPromoCodes(): StrNumArr[] {
    return this.promoCodes.map(_ => [_, promoCodeValues[_]]);
  }

  removePromoCode(promoText: string): void {
    if (this.promoCodes.includes(promoText)) {
      this.promoCodes.splice(this.promoCodes.indexOf(promoText), 1);
      this.saveToLocalStorage();
    }
  }

  filterByPage(cartPage: IPagination): IProduct[] {
    return this.products.filter((item, indx) => indx >= cartPage.countOnPage*(cartPage.pageNum - 1) && indx <= cartPage.countOnPage*(cartPage.pageNum) - 1);
  }

  getRealPageNum(cartPage: IPagination): number {
    return (this.products.length <= cartPage.countOnPage*(cartPage.pageNum - 1))
      ? Math.ceil(Math.round(100*this.products.length/cartPage.countOnPage)/100)
      : cartPage.pageNum;
  }

  clearCart(): void {
    this.products = [];
    this.promoCodes = [];
    this.saveToLocalStorage();
  }

}

export default CartModel;