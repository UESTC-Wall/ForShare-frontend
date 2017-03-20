import React from "react";
import { NavDropdown, NavItem, MenuItem, Modal, FormGroup, InputGroup, Button, FormControl } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { observer } from "mobx-react";
import { browserHistory, Link } from "react-router";
import ajax from "superagent";

import { LoginState } from "../store";
import baseUrl from "../pages/config";
import "./LoginStatusUI.css";

@observer
class LoginStatusUI extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      showModal: false,
      validationState: null,
      userName: "",
      passWord: "",
      errorReminder: ""
    };
  }

  logout = () => {
    LoginState.logout();

    const currentLocation = this.context.location.pathname.slice(0, 4);
    if (currentLocation === "user") {
      browserHistory.push("/linksourcelist");
    }
    this.setState({ showModal: false });
  }

  handleUserNameChange = (event) => {
    this.setState({ userName: event.target.value.trim() });
  }

  handlepassWordChange = (event) => {
    this.setState({ passWord: event.target.value.trim() });
  }

  pushUserMessage = (event) => {
    event.preventDefault();

    const content = {
      username: this.state.userName,
      password: this.state.passWord
    };

    ajax.post(`${baseUrl}/login/`)
      .send(content)
      .end((error, response) => {
        if (error || response.status !== 200) {
          console.log("login failed!");
          this.errorReminder();
        } else {
          LoginState.login(response.body.username, response.body.token);
          browserHistory.push("/linksourcelist");
          this.setState({ userName: "" });
          this.setState({ passWord: "" });
          ajax.get(`${baseUrl}/users/`)
          .end((error2, response1) => {
            if (!error2 && response1) {
              LoginState.userid =
              response1.body.results.find(user => user.username === content.username).id;
            } else {
              console.log("id fetch error!");
              alert("登陆失败，请稍后再试");
              this.setState({ userName: "" });
              this.setState({ passWord: "" });
            }
          });
        }
      });
  }

  showTheModal = () => {
    this.setState({ showModal: true });
  }

  close = () => {
    this.setState({ showModal: false });
  }

  errorReminder = () => {
    const setErrorContent = (value) => {
      this.errorReminder.style.display = "block";
      this.setState({ errorReminder: value });
    };
    if (this.state.userName === "" || this.state.passWord === "") {
      setErrorContent("请输入用户名和密码！");
    } else {
      setErrorContent("用户名或密码错误！");
      this.setState({ validationState: "error" });
    }
  }

  render() {
    if (!LoginState.completed) {
      return (
        <NavItem onClick={this.showTheModal}>登陆
          <Modal
            show={this.state.showModal}
            onHide={this.close}
            dialogClassName="custom-modal"
            bsSize="lg"
          >
            <Modal.Header closeButton>
              <Modal.Title>登录</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <form onSubmit={this.pushUserMessage}>
                <FormGroup validationState={this.state.validationState}>
                  <InputGroup bsStyle="custom">
                    <InputGroup.Addon bsStyle="custom-user" />
                    <FormControl type="text" value={this.state.userName} onChange={this.handleUserNameChange} />
                  </InputGroup>
                </FormGroup>
                <FormGroup validationState={this.state.validationState}>
                  <InputGroup bsStyle="custom">
                    <InputGroup.Addon bsStyle="custom-password" />
                    <FormControl type="password" value={this.state.passWord} onChange={this.handlepassWordChange} />
                  </InputGroup>
                </FormGroup>
                <Button bsStyle="danger" type="submit">登录</Button>
              </form>
              <p className="error-reminder" value={this.state.errorReminder} ref={(r) => { this.errorReminder = r; }} />
              <p>没有账号？<Link to={"/newuser"} onClick={this.close}>点击这里注册</Link></p>
            </Modal.Body>
          </Modal>
        </NavItem>
      );
    }
    return (
      <NavDropdown title={LoginState.username} id="basic-nav-dropdown">
        <LinkContainer to={`user/${LoginState.userid}`}>
          <MenuItem eventKey={2}>个人主页</MenuItem>
        </LinkContainer>
        <MenuItem eventKey={1} onClick={this.logout}>退出登陆</MenuItem>
      </NavDropdown>
    );
  }
}

LoginStatusUI.contextTypes = {
  location: React.PropTypes.object
};
export default LoginStatusUI;
