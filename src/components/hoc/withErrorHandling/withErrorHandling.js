import React, { Component } from "react";
import Modal from "../../UI/Modal/Modal";

const WithErrorHandling = (WrappedComponent, axios) => {
  //returns a anonymous class with wrapped component and the error modal.
  return class extends Component {
    state = {
      error: null
    };

    //component will mount happens before render. component did mount happens after.
    //if theres an error fetching data before render. This wont fire if using componentdidmount.
    componentWillMount() {
      this.errorReq = axios.interceptors.request.use(req => {
        this.setState({ error: null });
        return req;
      });
      this.errorRes = axios.interceptors.response.use(null, error => {
        this.setState({ error: error });
      });
    }

    componentWillUnmount() {
      console.log("did i unmount");
      axios.interceptors.request.reject(this.errorReq);
      axios.interceptors.response.reject(this.errorRes);
    }

    errorConfirmed = () => {
      this.setState({ error: null });
    };

    render() {
      return (
        <>
          <Modal ordering={this.state.error} closeModal={this.errorConfirmed}>
            {this.state.error ? this.state.error.message : null}
          </Modal>
          <WrappedComponent {...this.props} />
        </>
      );
    }
  };
};

export default WithErrorHandling;
