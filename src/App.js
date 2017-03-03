import React from 'react';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import { bootstrapUtils } from 'react-bootstrap/lib/utils';
import { LinkContainer } from 'react-router-bootstrap';
import { Link } from 'react-router';

import LoginStatusUI from './components/LoginStatusUI';
import './App.css';

bootstrapUtils.addStyle(Navbar, 'custom');

function GetIEVersion() {
  var sAgent = window.navigator.userAgent;
  var Idx = sAgent.indexOf("MSIE");

  // If IE, return version number.
  if (Idx > 0) 
    return parseInt(sAgent.substring(Idx+ 5, sAgent.indexOf(".", Idx)));

  // If IE 11 then look for Updated user agent string.
  else if (sAgent.indexOf("rv:11") > 0) 
    return 11;

  else
    return 0; //It is not IE
}


class Footer extends React.Component{
  render() {
    let browser = navigator.appName;
    console.log(browser);
    if(GetIEVersion() > 0){
      return null;
    }else{
      return(
          <footer>
            <Link to="/suggestion">
              期待你的建议...
            </Link>
          </footer>
      )
    }
  }
}

class App extends React.Component {

  render() {
    return (
      <div className="header">
        <Navbar bsStyle="custom">
          <Navbar.Header>
            <Navbar.Brand>
              <a href="#" className="brand">ForShare</a>
            </Navbar.Brand>
          </Navbar.Header>
          <Nav>
            <LinkContainer to="/sourcelist" activeHref="active">
              <NavItem>资源分享</NavItem>
            </LinkContainer>
            <LinkContainer to="/new" activeHref="active">
              <NavItem>写文章</NavItem>
            </LinkContainer>
          </Nav>
          <Nav pullRight>
            <LoginStatusUI></LoginStatusUI>
          </Nav>
        </Navbar>
        <div className="body">
          { this.props.children }
        </div>
        <Footer />
      </div>
    );
  }
}

export default App;
