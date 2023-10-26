import { Component, OnInit } from "@angular/core";
import { Cart, CartItem } from "../../models/cart.model";
import { CartService } from "src/app/services/cart.service";
import { HttpClient } from "@angular/common/http";
import { loadStripe } from "@stripe/stripe-js";

@Component({
  selector: "app-cart",
  templateUrl: "./cart.component.html",
})
export class CartComponent implements OnInit {
  cart: Cart = {
    items: [
      {
        product: "https://via.placeholder.com/150",
        name: "Snickers",
        price: 150,
        quantity: 1,
        id: 1,
      },
      {
        product: "https://via.placeholder.com/150",
        name: "Snickers",
        price: 150,
        quantity: 4,
        id: 2,
      },
    ],
  };

  dataSource: Array<CartItem> = [];
  displayedColumns: Array<string> = [
    "product",
    "name",
    "price",
    "quantity",
    "total",
    "action",
  ];

  constructor(private cartService: CartService, private http: HttpClient) {}

  ngOnInit(): void {
    this.cartService.cart.subscribe((_cart) => {
      this.cart = _cart;
      this.dataSource = this.cart.items;
    })
  }

  getTotal(items: Array<CartItem>): number {
    return this.cartService.getTotal(items);
  }  

  onClearCart(): void {
    this.cartService.clearCart();
  }

  onRemoveFromCart(item: CartItem): void {
    this.cartService.removeFromCart(item);
  }

  onAddQuantity(item: CartItem): void{
    this.cartService.addToCart(item);
  }

  onRemoveQuantity(item: CartItem): void{
    this.cartService.removeQuantity(item);
  }

  onCheckout(): void {
    this.http.post('http://localhost:3004/checkout',{
      items: this.cart.items
    }).subscribe(async(res: any) => {
      let stripe = await loadStripe('pk_test_51O5PESSHpvvOP5YaXNiNrCo3oj3nkZ3YSbDaJtFdbbT2RcFSBa0bUCPylqmilX4B63L18cV55gT65Jv5Qc1KJ8Ve00lTna8krc');
      stripe?.redirectToCheckout({
        sessionId: res.id
      })
    })
  }
}
