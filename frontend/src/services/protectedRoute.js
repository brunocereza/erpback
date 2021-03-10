import React, { Component } from 'react';
import { Route } from 'react-router-dom';

export default class ProtectedRoute extends Component {

  render() {
    const { component: Component, menus, ...props } = this.props;

    return (
      <Route
        {...props}
        render={props => (
          (menus.filter((e) => e.url === props.match.path).length !== 0) ? (
            <Component {...props} menus={menus}/>
          ) : (
              ""
            )
        )
        }
      />
    );
  }
}