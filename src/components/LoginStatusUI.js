import React from 'react';
import { NavDropdown, NavItem, MenuItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import{ observer } from 'mobx-react';
import { browserHistory } from 'react-router';

import { LoginState } from '../store';

@observer
class LoginStatusUI extends React.Component{

  logout = () => {
    LoginState.logout();

    let currentLocation = this.context.location.pathname.slice(0,4);
    if(currentLocation === 'user'){
      browserHistory.push('/linksourcelist');
    }
    
  }

  render(){
    if(!LoginState.completed){
      return (
        <LinkContainer to="login" activeHref="active">
          <NavItem>登陆</NavItem>
        </LinkContainer>
      )
    }else{
      return(
        <NavDropdown title={LoginState.username} id="basic-nav-dropdown">
          <LinkContainer to={`user/${LoginState.userid}`}>
            <MenuItem eventKey={2}>个人主页</MenuItem>
          </LinkContainer>
          <MenuItem eventKey={1} onClick={this.logout}>退出登陆</MenuItem>
        </NavDropdown>
      )
    }
  }
}

LoginStatusUI.contextTypes = {
    location: React.PropTypes.object
 }
export default LoginStatusUI;