import React, { Component } from "react";
import { Route, withRouter } from "react-router-dom";
import axios from "axios";

import "./App.css";
import FriendsList from "./components/FriendsList";
import InputForm from "./components/InputForm";

class App extends Component {
  constructor() {
    super();
    this.state = {
      friends: [],
      name: "",
      age: "",
      email: "",
      id: ""
    };
  }

  componentDidMount() {
    axios
      .get("http://localhost:5000/friends")
      .then(res => this.setState({ friends: res.data }))
      .catch(err => console.log(err));

    this.listener = this.props.history.listen((location, action) => {
      if (action === "POP" && location.pathname === "/") {
        let backFriend = [...this.state.friends];
        let info = backFriend.pop();
        axios
          .delete(`http://localhost:5000/friends/${info.id}`)
          .then(res =>
            this.setState({
              friends: res.data,
              name: info.name,
              age: info.age,
              email: info.email,
              id: info.id
            })
          )
          .catch(err => console.log(err));
      }
    });
    console.log(this.props.history);
  }

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = e => {
    e.preventDefault();
    let newFriend = {
      name: this.state.name,
      age: parseInt(this.state.age, 10),
      email: this.state.email
    };

    if ((newFriend.name || newFriend.age || newFriend.email) === "") {
      return;
    }

    if (this.state.id.length > 0) {
      let index = this.state.friends.findIndex(
        friend => friend.id === parseInt(this.state.id)
      );
      axios
        .put(`http://localhost:5000/friends/${index + 1}`, newFriend)
        .then(res =>
          this.setState({
            friends: res.data,
            name: "",
            age: "",
            email: "",
            id: ""
          })
        )
        .catch(err => console.log(err));
    } else {
      axios
        .post(`http://localhost:5000/friends/`, newFriend)
        .then(res =>
          this.setState({
            friends: res.data,
            name: "",
            age: "",
            email: "",
            id: ""
          })
        )
        .catch(err => console.log(err));
    }
  };

  delete = e => {
    e.stopPropagation();
    axios
      .delete(`http://localhost:5000/friends/${e.target.id}`)
      .then(res => this.setState({ friends: res.data }))
      .catch(err => console.log(err));
  };

  reveal = () => {
    this.props.history.push("/edit");
  };
  render() {
    return (
      <div className="App">
        <Route
          path="/"
          render={props => (
            <FriendsList
              {...props}
              friends={this.state.friends}
              delete={this.delete}
              onClick={this.reveal}
            />
          )}
        />
        <Route
          path="/edit"
          render={props => (
            <InputForm
              {...props}
              info={this.state}
              change={this.handleChange}
              submit={this.handleSubmit}
            />
          )}
        />
      </div>
    );
  }
}

export default withRouter(App);
