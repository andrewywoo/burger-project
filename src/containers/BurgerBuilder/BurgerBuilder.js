import React, { Component } from "react";
import Burger from "../../components/Burger/Burger";
import BuildControls from "../../components/Burger/BuildControls/BuildControls";
import Modal from "../../components/UI/Modal/Modal";
import OrderSummary from "../../components/Burger/OrderSummary/OrderSummary";
import axios from "../../axios-orders";
import Spinner from "../../components/UI/Spinner/Spinner";
import WithErrorHandling from "../../components/hoc/withErrorHandling/withErrorHandling";

const INGREDIENT_PRICES = {
  tomato: 0.1,
  lettuce: 0.1,
  bacon: 1,
  cheese: 0.5,
  meat: 2
};

class BurgerBuilder extends Component {
  state = {
    ingredients: null,
    totalPrice: 5,
    purchaseable: false,
    purchasing: false,
    loading: false,
    error: false
  };

  componentDidMount() {
    axios
      .get("ingredients.json")
      .then(response => {
        this.setState({ ingredients: response.data });
      })
      .catch(error => {
        this.setState({ error: true });
      });
  }

  updatePurchaseState(ingredients) {
    const sum = Object.keys(ingredients)
      .map(igKey => {
        return ingredients[igKey];
      })
      .reduce((acc, i) => acc + i);

    this.setState({ purchaseable: sum > 0 });
  }

  isPurchasing = () => {
    this.setState({ purchasing: true });
  };

  isNotPurchasing = () => {
    this.setState({ purchasing: false });
  };

  purchasedHandler = () => {
    this.setState({ loading: true });

    const order = {
      ingredients: this.state.ingredients,
      price: this.state.totalPrice,
      customer: {
        name: "Andrew Woo",
        address: {
          number: "10",
          street: "Smith St",
          city: "Lynbrook",
          zipCode: "11235",
          country: "USA"
        },
        email: "awoo@google.com"
      },
      deliveryMethod: "car"
    };
    axios
      .post("orders.json", order)
      .then(response => {
        this.setState({ loading: false, purchasing: false });
        console.log(response);
      })
      .catch(error => {
        this.setState({ loading: false, purchasing: false });
        console.log(error);
      });
  };

  addIngredient = type => {
    const newCount = this.state.ingredients[type] + 1;
    const newPrice = this.state.totalPrice + INGREDIENT_PRICES[type];
    const newState = { ...this.state };
    newState.ingredients[type] = newCount;
    newState.totalPrice = newPrice;
    this.setState(newState);
    this.updatePurchaseState(newState.ingredients);
  };

  removeIngredient = type => {
    if (this.state.ingredients[type] <= 0) {
      return;
    }
    const newCount = this.state.ingredients[type] - 1;
    const newPrice = this.state.totalPrice - INGREDIENT_PRICES[type];
    const newState = { ...this.state };
    newState.ingredients[type] = newCount;
    newState.totalPrice = newPrice;
    this.setState(newState);
    this.updatePurchaseState(newState.ingredients);
  };

  render() {
    const disabledState = { ...this.state.ingredients };
    for (let key in disabledState) {
      disabledState[key] = disabledState[key] <= 0;
    }

    let orderSummary = null;
    let burger = this.state.error ? "Ingredients Can't Be Loaded" : <Spinner />;

    if (this.state.ingredients) {
      burger = (
        <>
          <Burger ingredients={this.state.ingredients} />
          <BuildControls
            more={this.addIngredient}
            less={this.removeIngredient}
            disabled={disabledState}
            price={this.state.totalPrice}
            purchaseable={this.state.purchaseable}
            order={this.isPurchasing}
          />
        </>
      );

      orderSummary = (
        <OrderSummary
          ingredients={this.state.ingredients}
          purchaseCanceled={this.isNotPurchasing}
          purchasedContinued={this.purchasedHandler}
        />
      );
      if (this.state.loading) {
        orderSummary = <Spinner />;
      }
    }

    return (
      <>
        <Modal
          ordering={this.state.purchasing}
          closeModal={this.isNotPurchasing}
        >
          {orderSummary}
        </Modal>
        {burger}
      </>
    );
  }
}

export default WithErrorHandling(BurgerBuilder, axios);
