import React, { Component } from "react";
import { Grid, Image } from "semantic-ui-react";

export default class home extends Component {
  render() {
    return (
      <Grid
        textAlign="center"
        style={{ height: "100vh" }}
        verticalAlign="middle"
        container
      >
        <Grid.Column style={{ maxWidth: 450 }}></Grid.Column>
      </Grid>
    );
  }
}
