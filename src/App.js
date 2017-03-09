import React from 'react';
import { Navbar, Nav, NavDropdown, NavItem, MenuItem } from 'react-bootstrap';
import { bootstrapUtils } from 'react-bootstrap/lib/utils';
import { LinkContainer } from 'react-router-bootstrap';
import { observer } from 'mobx-react';

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
    if(GetIEVersion() > 0){
      return null;
    }else{
      return(
        <footer>ForShare</footer>
      )
    }
  }
}

@observer
class App extends React.Component {

  getChildContext = () => {
    return {
      location: this.props.location
    }
  }

  refresh = () => {
    window.location.reload();
  }

  render() {
    return (
      <div className="header">
        <Navbar bsStyle="custom">
          <Navbar.Header>
            <Navbar.Brand>
              <a href="#">ForShare</a>
            </Navbar.Brand>
          </Navbar.Header>
          <Nav>
            <NavDropdown title={"资源分享"} id="basic-nav-dropdown">
              <LinkContainer to="/article">
                <MenuItem eventKey={1} onClick={this.refresh}>原创文章</MenuItem>
              </LinkContainer>
              <LinkContainer to="/link">
                <MenuItem eventKey={2} onClick={this.refresh}>链接分享</MenuItem>
              </LinkContainer>
            </NavDropdown>
            <LinkContainer to="newlink" activeHref="active">
              <NavItem>上传链接</NavItem>
            </LinkContainer>
            <LinkContainer to="newarticle" activeHref="active">
              <NavItem>写文章</NavItem>
            </LinkContainer>
            <LinkContainer to="suggestion" activeHref="active">
              <NavItem>意见反馈</NavItem>
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

App.childContextTypes = {
    location: React.PropTypes.object
}
export default App;
