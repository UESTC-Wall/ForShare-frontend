import React from 'react';
import ajax from 'superagent';
import { FormGroup, FormControl, Button, Popover, OverlayTrigger } from 'react-bootstrap';

import './UserCreate.css';
import baseUrl from './config';

class UserCreate extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userNameValidationState: null,
      userNameError: null,
      passWordOnceValidationState: null,
      passWordOnceError: null,
      passWordSecondValidationState: null,
      passWordSecondError: null,
      emailValidationState: null,
      emailError: null,
      classValidationState: null,
      classError: null,
      userName: "",
      passWordOnce: "",
      passWordSecond: "",
      email: "",
      class: "",
      formValidation: false
    };
  }

  handleUserNameChange = (event) => {
    this.setState({ userName: event.target.value });
  }

  handleUserNameUnBlur = () => {
    const regex = /[0-9a-zA-Z_\@\.\+\-]{1,30}/;
    const re = regex.test(this.state.userName);

    if (!re) {
      this.setState({ userNameError: "用户名不合法！" });
      this.setState({ userNameValidationState: "error" });
      this.setState({ formValidation: false });
    } else {
      this.setState({ userNameError: null });
      this.setState({ formValidation: true });
      this.setState({ userNameValidationState: "success" });
    }
  }

  handlePassWordOnceChange = (event) => {
    this.setState({ passWordOnce: event.target.value });
  }

  handlePassWordOnceUnBlur = () => {
    if (this.state.passWordOnce === this.state.userName) {
      this.setState({ passWordOnceError: "不得与用户名相同！" });
      this.passWordOnceError();
    } else if (this.state.passWordOnce.length > 20 || this.state.passWordOnce.length < 6) {
      this.setState({ passWordOnceError: "必须为6-20个字符！" });
      this.passWordOnceError();
    } else {
      this.setState({ passWordOnceError: null });
      this.setState({ formValidation: true });
      this.setState({ passWordOnceValidationState: "success" });
    }
  }

  passWordOnceError = () => {
    this.setState({ formValidation: false });
    this.setState({ passWordOnceValidationState: "error" });
  }

  handlePassWordSecondChange = (event) => {
    this.setState({ passWordSecond: event.target.value });
  }

  handlePassWordSecondUnBlur = () => {
    if (this.state.passWordOnce !== this.state.passWordSecond ||
      this.state.passWordSecond.length === 0) {
      this.setState({ passWordSecondError: "与第一次的密码不一致！" });
      this.setState({ formValidation: false });
      this.setState({ passWordSecondValidationState: "error" });
    } else {
      this.setState({ formValidation: true });
      this.setState({ passWordSecondError: null });
      this.setState({ passWordSecondValidationState: "success" });
    }
  }

  handleEmailChange = (event) => {
    this.setState({ email: event.target.value });
  }

  handleEmailUnBlur = () => {
    const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const re = regex.test(this.state.email);

    if (!re) {
      this.setState({ emailError: "邮箱地址有误！" });
      this.setState({ formValidation: false });
      this.setState({ emailValidationState: "error" });
    } else {
      this.setState({ formValidation: true });
      this.setState({ emailError: null });
      this.setState({ emailValidationState: "success" });
    }
  }

  handleClassChange = (event) => {
    this.setState({ class: event.target.value });
  }

  handleClassUnBlur = () => {
    if (this.state.class.length > 6 || this.state.class.length < 4) {
      this.setState({ classError: "年级无效！" });
      this.setState({ formValidation: false });
      this.setState({ classValidationState: "error" });
    } else {
      this.setState({ formValidation: true });
      this.setState({ classError: null });
      this.setState({ classValidationState: "success" });
    }
  }

  pushUserCreateMessage = (event) => {
    if (this.state.formValidation === false) {
      return;
    } else {
      event.preventDefault();
      const content = {
        username: this.state.userName,
        password: this.state.passWordSecond,
        user_email: this.state.email,
        user_class: this.state.class
      };

      ajax.post(`${baseUrl}/usercreate/`)
        .send(content)
        .end((error, response) => {
          if (!error && response) {
            alert("注册成功！");
            this.clean();
          } else {
            alert("注册失败！请稍后再试");
          }
        });
    }
  }

  clean = () => {
    this.setState({ userName: "" });
    this.setState({ passWordOnce: "" });
    this.setState({ passWordSecond: "" });
    this.setState({ email: "" });
    this.setState({ class: "" });
    this.setState({ userNameValidationState: null });
    this.setState({ passWordOnceValidationState: null });
    this.setState({ passWordSecondValidationState: null });
    this.setState({ emailValidationState: null });
    this.setState({ classValidationState: null });
  }

  render() {
    const userNamePopoverHoverFocus = (
      <Popover id="popover-trigger-hover-focus">
        小于30个字符，只能为数字、字母和字符@/-/_/+/.
      </Popover>
    );
    const passWordOncePopoverHoverFocus = (
      <Popover id="popover-trigger-hover-focus">
        不得与用户名相同,不超过20个字符
      </Popover>
    );
    const classPopoverHoverFocus = (
      <Popover id="popover-trigger-hover-focus">
        如：2015
      </Popover>
    );

    return (
      <div className="usercreate">
        <h3>注 册</h3>
        <form onSubmit={this.pushUserCreateMessage}>
          <OverlayTrigger trigger={['hover', 'focus']} placement="top" overlay={userNamePopoverHoverFocus}>
            <FormGroup validationState={this.state.userNameValidationState}>
              用户名：<b className="error">{this.state.userNameError}</b>
              <FormControl type="text" value={this.state.userName} onChange={this.handleUserNameChange} onBlur={this.handleUserNameUnBlur} />
              <FormControl.Feedback />
            </FormGroup>
          </OverlayTrigger>
          <OverlayTrigger trigger={['hover', 'focus']} placement="top" overlay={passWordOncePopoverHoverFocus}>
            <FormGroup validationState={this.state.passWordOnceValidationState}>
              密码：<b className="error">{this.state.passWordOnceError}</b>
              <FormControl type="password" value={this.state.passWordOnce} onChange={this.handlePassWordOnceChange} onBlur={this.handlePassWordOnceUnBlur} />
              <FormControl.Feedback />
            </FormGroup>
          </OverlayTrigger>
          <FormGroup validationState={this.state.passWordSecondValidationState}>
            确认密码：<b className="error">{this.state.passWordSecondError}</b>
            <FormControl type="password" value={this.state.passWordSecond} onChange={this.handlePassWordSecondChange} onBlur={this.handlePassWordSecondUnBlur} />
            <FormControl.Feedback />
          </FormGroup>
          <FormGroup validationState={this.state.emailValidationState}>
            邮箱：<b className="error">{this.state.emailError}</b>
            <FormControl type="text" value={this.state.email} onChange={this.handleEmailChange} onBlur={this.handleEmailUnBlur} />
            <FormControl.Feedback />
          </FormGroup>
          <OverlayTrigger trigger={['hover', 'focus']} placement="top" overlay={classPopoverHoverFocus}>
            <FormGroup validationState={this.state.classValidationState}>
              年级：<b className="error">{this.state.classError}</b>
              <FormControl type="text" value={this.state.class} onChange={this.handleClassChange} onBlur={this.handleClassUnBlur} />
              <FormControl.Feedback />
            </FormGroup>
          </OverlayTrigger>
          <Button bsStyle="danger" type="submit">注 册</Button>
        </form>
      </div>
    );
  }
}

export default UserCreate;
