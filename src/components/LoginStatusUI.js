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
        <NavItem onClick={this.showTheModal}>登陆
          <Modal
            show={this.state.showModal}
            onHide={this.close}
            dialogClassName="custom-modal"
            bsSize="lg">
          <Modal.Header closeButton>
            <Modal.Title>登录</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={this.pushUserMessage}>
              <FormGroup validationState={this.state.validationState}>
                <InputGroup bsStyle="custom">
                  <InputGroup.Addon bsStyle="custom-user"></InputGroup.Addon>
                  <FormControl type="text" ref="userName" />
                </InputGroup>
              </FormGroup>
              <FormGroup validationState={this.state.validationState}>
                <InputGroup bsStyle="custom">
                  <InputGroup.Addon bsStyle="custom-password"></InputGroup.Addon>
                  <FormControl type="password" ref="passWord" />
                </InputGroup>
              </FormGroup>
              <Button bsStyle="danger" type="submit">登录</Button>
            </form>
            <p className="error-reminder" ref="errorReminder"></p>
            <p>没有账号？<Link to={"/newuser"} onClick={this.close}>点击这里注册</Link></p>
          </Modal.Body>
        </Modal>
      </NavItem>
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