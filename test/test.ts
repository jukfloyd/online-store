import OrderModel from '../src/components/model/order';
import CartModel from '../src/components/model/cart';
import { IProduct, IProductList } from '../src/components/app/types';

const order = new OrderModel();

test('OrderModel.isCreditCardNumberValid should validate CCN', () => {

  [
    '4012888888881881',
    '5123456789012346',
    '5610591081018250',
    '6011111111111117',
    '6011000990139424',
    '3530111333300000',
    '3566002020360505',
    '5555555555554444',
    '5105105105105100',
    '4111111111111111',
    '4012888888881881',
    '5019717010103742',
    '6331101999990016'
  ].forEach((ccn) => {
    expect(order.isCreditCardNumberValid(ccn)).toBe(true);
  });


  [
    '4571234567890111',
    '5436468789016589',
    '4916123456789012',
    '9112893456789010'
  ].forEach((ccn) => {
    expect(order.isCreditCardNumberValid(ccn)).toBe(false);
  });

});

test('OrderModel.isCreditCardUntilValid should validate card exp date', () => {

  [
    '12/23',
    '01/24',
    '09/22'
  ].forEach((str) => {
    expect(order.isCreditCardUntilValid(str)).toBe(true);
  });

  [
    '19/22',
    '00/23',
    '10/19',
  ].forEach((str) => {
    expect(order.isCreditCardUntilValid(str)).toBe(false);
  });

});

test('OrderModel.isCreditCardUntilValid should validate card exp date', () => {

  [
    '12/23',
    '01/24',
    '09/22'
  ].forEach((str) => {
    expect(order.isCreditCardUntilValid(str)).toBe(true);
  });

  [
    '19/22',
    '00/23',
    '10/19',
  ].forEach((str) => {
    expect(order.isCreditCardUntilValid(str)).toBe(false);
  });

});

test('OrderModel.formatField should format certain fields', () => {

  expect(order.formatField('order-card-number','sdf41dfg111h1111sdf1111111')).toBe('4111 1111 1111 1111');
  expect(order.formatField('order-card-until','df1223')).toBe('12/23');
  expect(order.formatField('order-card-cvv','fsd343ef')).toBe('343');

});

const dummyProducts: IProductList = {
	"products": [
		{
			"id": 1,
			"title": "Dummy 1",
			"description": "",
			"price": 100,
			"discountPercentage": 0,
			"rating": 1,
			"stock": 10,
			"brand": "",
			"category": "",
			"thumbnail": "",
			"images": []
		},
		{
			"id": 2,
			"title": "Dummy 2",
			"description": "",
			"price": 200,
			"discountPercentage": 0,
			"rating": 1,
			"stock": 10,
			"brand": "",
			"category": "",
			"thumbnail": "",
			"images": []
		},
    {
			"id": 3,
			"title": "Dummy 2",
			"description": "",
			"price": 14.05,
			"discountPercentage": 0,
			"rating": 1,
			"stock": 10,
			"brand": "",
			"category": "",
			"thumbnail": "",
			"images": []
		},
  ]
}

test('CartModel.hasId should show if product is in cart', () => {

  const cart = new CartModel(dummyProducts.products);
  cart.clearCart();
  cart.addOrDrop(dummyProducts.products[0]);
  expect(cart.hasId(dummyProducts.products[0].id)).toBe(true);
  expect(cart.hasId(dummyProducts.products[1].id)).toBe(false);

});

test('CartModel.addOrDrop should add product when it is not in cart and drop if it is in cart', () => {

  const cart = new CartModel(dummyProducts.products);
  cart.clearCart();
  cart.addOrDrop(dummyProducts.products[0]);
  expect(cart.hasId(dummyProducts.products[0].id)).toBe(true);
  cart.addOrDrop(dummyProducts.products[0]);
  expect(cart.hasId(dummyProducts.products[0].id)).toBe(false);

});

test('CartModel.getCount should return the number of products in cart', () => {

  const cart = new CartModel(dummyProducts.products);
  cart.clearCart();
  cart.addOrDrop(dummyProducts.products[0]);
  expect(cart.getCount()).toBe(1);
  cart.addOrDrop(dummyProducts.products[0]);
  expect(cart.getCount()).toBe(0);
  cart.addOrDrop(dummyProducts.products[0]);
  cart.addOrDrop(dummyProducts.products[1]);
  expect(cart.getCount()).toBe(2);
  cart.plusCount(dummyProducts.products[0]);
  cart.plusCount(dummyProducts.products[1]);
  expect(cart.getCount()).toBe(4);

});

test('CartModel.plusCount should add 1 quantity of product', () => {

  const cart = new CartModel(dummyProducts.products);
  cart.clearCart();
  cart.addOrDrop(dummyProducts.products[0]);
  expect(cart.getCount()).toBe(1);
  cart.plusCount(dummyProducts.products[0]);
  expect(cart.getCount()).toBe(2);
  cart.addOrDrop(dummyProducts.products[1]);
  expect(cart.getCount()).toBe(3);

});

test('CartModel.minusCount should subtract 1 quantity of product', () => {

  const cart = new CartModel(dummyProducts.products);
  cart.clearCart();
  cart.addOrDrop(dummyProducts.products[0]);
  expect(cart.getCount()).toBe(1);
  cart.plusCount(dummyProducts.products[0]);
  cart.plusCount(dummyProducts.products[0]);
  cart.plusCount(dummyProducts.products[0]);
  expect(cart.getCount()).toBe(4);
  cart.addOrDrop(dummyProducts.products[1]);
  cart.plusCount(dummyProducts.products[1]);
  cart.minusCount(dummyProducts.products[1]);
  expect(cart.getCount()).toBe(5);

});

test('CartModel.getTotalSum should return cart subtotal w/o discount', () => {

  const cart = new CartModel(dummyProducts.products);
  cart.clearCart();
  cart.addOrDrop(dummyProducts.products[0]);
  expect(cart.getTotalSum()).toBe(100);
  cart.plusCount(dummyProducts.products[0]);
  cart.plusCount(dummyProducts.products[0]);
  cart.plusCount(dummyProducts.products[0]);
  expect(cart.getTotalSum()).toBe(400);
  cart.addOrDrop(dummyProducts.products[1]);
  cart.plusCount(dummyProducts.products[1]);
  expect(cart.getTotalSum()).toBe(800);

});

test('CartModel.searchNotAppliedPromoCode should return promocode if found and not applied', () => {

  const cart = new CartModel(dummyProducts.products);
  cart.clearCart();
  expect(cart.searchNotAppliedPromoCode('rs')).toEqual(['rs', 10]);
  expect(cart.searchNotAppliedPromoCode('epm')).toEqual(['epm', 20]);
  expect(cart.searchNotAppliedPromoCode('RS')).toBe(null);
  expect(cart.searchNotAppliedPromoCode('sdfdfg')).toBe(null);

});

test('CartModel.applyPromoCode should apply correct discount on subtotal', () => {

  const cart = new CartModel(dummyProducts.products);
  cart.clearCart();
  cart.addOrDrop(dummyProducts.products[0]);
  cart.applyPromoCode('rs');
  expect(cart.getTotalSumWithDiscount()).toBe(90);
  cart.applyPromoCode('epm');
  expect(cart.getTotalSumWithDiscount()).toBe(70);
  cart.addOrDrop(dummyProducts.products[0]);
  cart.addOrDrop(dummyProducts.products[2]);
  expect(cart.getTotalSumWithDiscount()).toBe(9.84);
});

