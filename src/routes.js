import React from "react";
import { Route } from "react-router-dom";
import Hoc from "./hoc/hoc";

import Login from "./containers/Login";
import Signup from "./containers/Signup";
import MainBoard from "./containers/Main";
import AddClient from "./containers/AddClient";
import OtherClientList from "./containers/OtherClientList";
import UserLists from "./containers/UserLists";

import HomepageLayout from "./containers/Home";

const BaseRouter = () => (
  <Hoc>
    <Route path="/login" component={Login} />
    <Route path="/signup" component={Signup} />
    <Route path="/main" component={MainBoard} />
    <Route path="/editClient/:id" component={AddClient} />
    <Route path="/otherClient" component={OtherClientList} />
    <Route path="/addClient/" component={AddClient} />
    <Route path="/userLists" component={UserLists} />
    <Route exact path="/" component={Login} />
  </Hoc>
);

export default BaseRouter;
