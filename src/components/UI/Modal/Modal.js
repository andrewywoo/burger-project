import React, { Component } from "react";
import classes from "./Modal.module.css";
import Backdrop from "../Backdrop/Backdrop";

class Modal extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextProps.ordering !== this.props.ordering ||
      nextProps.children !== this.props.children
    );
  }

  render() {
    return (
      <>
        <Backdrop
          show={this.props.ordering}
          closeModal={this.props.closeModal}
        />
        <div
          className={classes.Modal}
          style={{
            transform: this.props.ordering
              ? "translateY(0)"
              : "translateY(-100vh)",
            opacity: this.props.ordering ? "1" : "0"
          }}
        >
          {this.props.children}
        </div>
      </>
    );
  }
}

export default Modal;
