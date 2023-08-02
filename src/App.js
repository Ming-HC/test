import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Navigation from './components/Navigation';
import LoginRegister from './components/Login_register';
import MemberPersonal from './components/Member_personal';
import Forum from './components/Forum';
import ForumPost from './components/Forum_post';
import ForumSearch from './components/Forum_search';
import ForumNewPost from './components/Forum_newpost';
import Error from './components/Error';

import 'bootstrap/dist/css/bootstrap.css';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <Navigation />
          <Switch>
            <Route path="/member/:user/personal" component={MemberPersonal} />
            <Route path="/member/:state" component={LoginRegister} />
            <Route path="/forum/post/:id" component={ForumPost} />
            <Route path="/forum/search" component={ForumSearch} />
            <Route path="/forum/view/newpost" component={ForumNewPost} />
            <Route path="/forum/:class(all|complex|gossip|ask|system|delete)?/:page(\\d+)?" component={Forum} />
            {/* <Route path="/forum" component={Forum} /> */}
            <Route component={Error} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;