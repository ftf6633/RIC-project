import React from "react";
import {
  Container,
  Divider,
  Dropdown,
  Grid,
  Header,
  Image,
  List,
  Menu,
  Segment
} from "semantic-ui-react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { logout } from "../store/actions/auth";

class CustomLayout extends React.Component {
  render() {
    const { authenticated } = this.props;
    return (
      <div>
        <Menu inverted>
          <Container>
            {/*{authenticated ? (*/}
            {/*  <React.Fragment>*/}
            {/*    <Menu.Item header onClick={() => this.props.logout()}>*/}
            {/*      Logout*/}
            {/*    </Menu.Item>*/}
            {/*    <Link to="/addClient">*/}
            {/*      <Menu.Item header>*/}
            {/*        Add Clients*/}
            {/*      </Menu.Item>*/}
            {/*    </Link>*/}
            {/*  </React.Fragment>*/}
            {/*) : (*/}
            {/*  <React.Fragment>*/}
            {/*    <Link to="/login">*/}
            {/*      <Menu.Item header>Login</Menu.Item>*/}
            {/*    </Link>*/}
            {/*    <Link to="/signup">*/}
            {/*      <Menu.Item header>Signup</Menu.Item>*/}
            {/*    </Link>*/}
            {/*  </React.Fragment>*/}
            {/*)}*/}
            {authenticated} (
                <React.Fragment>
                  <Menu.Item header onClick={() => {
                    localStorage.clear();
                    document.location.href = '/';
                  }}>
                    Logout
                  </Menu.Item>
                  <Link to="/addClient">
                    <Menu.Item header>
                      Add Clients
                    </Menu.Item>
                  </Link>
                <Link to="/main">
                    <Menu.Item header>
                        Main Table
                    </Menu.Item>
                </Link>

                <Link to="/otherClient">
                    <Menu.Item header>
                        Removed Clients
                    </Menu.Item>
                </Link>
                </React.Fragment>
            )
          </Container>
        </Menu>

        {this.props.children}

      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    authenticated: state.auth.token !== null
  };
};

const mapDispatchToProps = dispatch => {
  return {
    logout: () => dispatch(logout())
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(CustomLayout)
);
