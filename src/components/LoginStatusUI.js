import React from 'react';
import { NavDropdown, NavItem, MenuItem, Modal, FormGroup, InputGroup, Button, FormControl } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import{ observer } from 'mobx-react';
import { browserHistory } from 'react-router';
import ReactDOM from 'react-dom';
import ajax from 'superagent';
import { Link } from 'react-router';

import { LoginState } from '../store';
import baseUrl from '../pages/config';
import './LoginStatusUI.css'; 

@observer
class LoginStatusUI extends React.Component{

  constructor(props){
    super(props);

    this.state = {
      showModal: false,
      validationState: null
    }
  }

  logout = () => {
    LoginState.logout();

    let currentLocation = this.context.location.pathname.slice(0,4);
    if(currentLocation === 'user'){
      browserHistory.push('/linksourcelist');
    }
    this.setState({ showModal : false });
    
  }

  pushUserMessage = (event) => {
    event.preventDefault();
    
    const content = {
      username: ReactDOM.findDOMNode(this.refs.userName).value,
      password: ReactDOM.findDOMNode(this.refs.passWord).value
    }

    ajax.post(`${baseUrl}/login/`)
      .send(content)
      .end((error, response) => {
        if (error || response.status !== 200) {
          console.log('login failed!');
          this.errorReminder();
        } else {
          LoginState.login(response.body.username, response.body.token);
          browserHistory.push('/linksourcelist');
          ajax.get(`${baseUrl}/users/`)
          .end((error, response) => {
            if (!error && response){
              LoginState.userid = response.body.results.find(user => user.username === content.username).id;
            }else{
              console.log("id fetch error!");
              alert("登陆失败，请稍后再试");
              ReactDOM.findDOMNode(this.refs.userName).value = "";
              ReactDOM.findDOMNode(this.refs.passWord).value = "";
            }
          })
        };
      });
  }

  showTheModal = () => {
    this.setState({ showModal: true });
  }

  close = () => {
    this.setState({ showModal : false });
  }

  errorReminder = () => {
    let setErrorContent = (value) => {
      ReactDOM.findDOMNode(this.refs.errorReminder).style.display = "block";
      ReactDOM.findDOMNode(this.refs.errorReminder).innerHTML = value;
    }
    if(ReactDOM.findDOMNode(this.refs.userName).value.trim() === "" || ReactDOM.findDOMNode(this.refs.passWord).value === ""){
      setErrorContent("请输入用户名和密码！");
    }else{
      setErrorContent("用户名或密码错误！");
      this.setState({ validationState : "error" });
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