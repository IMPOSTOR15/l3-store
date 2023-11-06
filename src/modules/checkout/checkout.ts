import { Component } from '../component';
import { Product } from '../product/product';
import html from './checkout.tpl.html';
import { formatPrice, genUUID } from '../../utils/helpers';
import { cartService } from '../../services/cart.service';
import { ProductData } from 'types';
import { sendEvent } from '../../utils/analytics';

class Checkout extends Component {
  products!: ProductData[];
  totalPrice: number;
  constructor(props: any) {
    super(props)
    this.totalPrice = 0
  }
  async render() {
    this.products = await cartService.get();

    if (this.products.length < 1) {
      this.view.root.classList.add('is__empty');
      return;
    }

    this.products.forEach((product) => {
      const productComp = new Product(product, { isHorizontal: true });
      productComp.render();
      productComp.attach(this.view.cart);
    });

    this.totalPrice = this.products.reduce((acc, product) => (acc += product.salePriceU), 0);
    this.view.price.innerText = formatPrice(this.totalPrice);

    this.view.btnOrder.onclick = this._makeOrder.bind(this);
  }

  private async _makeOrder() {
    await cartService.clear();
    fetch('/api/makeOrder', {
      method: 'POST',
      body: JSON.stringify(this.products)
    });
    console.log(this.products.map(product => product.id));
    
    sendEvent('purchase', {
      orderId: genUUID(),
      totalPrice: this.totalPrice,
      productIds: this.products.map(product => product.id)
    });
  }
}

export const checkoutComp = new Checkout(html);
