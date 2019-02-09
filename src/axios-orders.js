import axios from "axios";

const instance = axios.create({
  baseURL: "https://react-my-burger-cab48.firebaseio.com/"
});

export default instance;
