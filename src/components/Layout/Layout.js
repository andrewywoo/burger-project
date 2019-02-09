import React, { Component } from "react";
import classes from "./Layout.module.css";
import Toolbar from "../Navigation/Toolbar/Toolbar";
import SideDrawer from "../Navigation/SideDrawer/SideDrawer";

class layout extends Component {
  state = {
    showSideDrawer: false
  };

  sideDrawerHandler = () => {
    this.setState({ showSideDrawer: false });
  };

  sideDrawerMenuToggle = () => {
    this.setState(prevState => {
      return { showSideDrawer: !prevState.showSideDrawer };
    });
  };

  render() {
    return (
      <>
        <Toolbar clicked={this.sideDrawerMenuToggle} />
        <SideDrawer
          show={this.state.showSideDrawer}
          clicked={this.sideDrawerHandler}
        />
        <main className={classes.Content}>{this.props.children}</main>
      </>
    );
  }
}

export default layout;
