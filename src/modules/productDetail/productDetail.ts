import { Component } from '../component';
import { ProductList } from '../productList/productList';
import { formatPrice } from '../../utils/helpers';
import { ProductData } from 'types';
import html from './productDetail.tpl.html';
import { cartService } from '../../services/cart.service';
import { fetchWithUserId } from '../../utils/fetchUtils';
import { sendEvent } from '../../utils/analytics';
import { favoritesService } from '../../services/favorites.service';

class ProductDetail extends Component {
  more: ProductList;
  product?: ProductData;

  constructor(props: any) {
    super(props);

    this.more = new ProductList();
    this.more.attach(this.view.more);
  }

  async render() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = Number(urlParams.get('id'));

    const productResp = await fetch(`/api/getProduct?id=${productId}`);
    this.product = await productResp.json();
    if (!this.product) return;

    const { id, src, name, description, salePriceU } = this.product;

    this.view.photo.setAttribute('src', src);
    this.view.title.innerText = name;
    this.view.description.innerText = description;
    this.view.price.innerText = formatPrice(salePriceU);
    this.view.btnBuy.onclick = this._addToCart.bind(this);
    this.view.btnFavorite.onclick = this._addToFavorite.bind(this);

    const isInCart = await cartService.isInCart(this.product);
    const isInFavorites = await favoritesService.isInFavorites(this.product);

    if (isInCart) this._setInCart();
    if (isInFavorites) this._setInFalorite()

    fetch(`/api/getProductSecretKey?id=${id}`)
      .then((res) => res.json())
      .then((secretKey) => {
        this.view.secretKey.setAttribute('content', secretKey);
        const type = (this.product?.log && Object.keys(this.product.log).length !== 0) ? 'viewCardPromo' : 'viewCard';
        sendEvent(type, { ...this.product, secretKey: secretKey });
      })

    fetchWithUserId('/api/getPopularProducts')
      .then((res) => res.json())
      .then((products) => {
        this.more.update(products);
      });
  }

  private _addToCart() {
    if (!this.product) return;
    sendEvent('addToCard', { ...this.product});
    cartService.addProduct(this.product);
    this._setInCart();
  }

  private _setInCart() {
    this.view.btnBuy.innerText = '✓ В корзине';
    this.view.btnBuy.disabled = true;
  }

  private _addToFavorite() {
    if (!this.product) return;

    favoritesService.addProduct(this.product);
    this._setInFalorite();
  }
  private _setInFalorite() {
    this.view.btnFavorite.innerText = '✓ В Избранном';
    this.view.btnFavorite.disabled = true;

    const svgIcon = this.view.btnFavorite.querySelector(".svg-icon");
    if (svgIcon) {
        svgIcon.classList.add('filled');
    }
  }
}

export const productDetailComp = new ProductDetail(html);
