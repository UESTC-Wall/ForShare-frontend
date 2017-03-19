import React from 'react';
import ajax from 'superagent';
import { FormGroup, FormControl, Button } from 'react-bootstrap';

import './UserCreate.css';
import baseUrl from './config';

class UserCreate extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      validationState: null,
      validationState2: null,
      userName: "",
      passWordOnce: "",
      passWordSecond: "",
      email: "",
      class: ""
    };
  }

  handleUserNameChange = (event) => {
    this.setState({ userName: event.target.value });
  }

  handlePassWordOnceChange = (event) => {
    this.setState({ passWordOnce: event.target.value });
  }

  handlePassWordSecondChange = (event) => {
    this.setState({ passWordSecond: event.target.value });
  }

  handleEmailChange = (event) => {
    this.setState({ email: event.target.value });
  }

  handleClassChange = (event) => {
    this.setState({ class: event.target.value });
  }

  pushUserCreateMessage = () => {
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
            const regex = /[0-9a-zA-Z\@\.\+\-\_]{0,30}/;
            const re = regex.test(this.state.userName);
            if (!re) {
              this.errorReminder();
            } else {
              alert("注册成功！");
            }
          } else {
            this.errorReminder();
          }
        });
  }

  render() {
    return (
      <div className="usercreate">
        <h3>注 册</h3>
        <form onSubmit={this.pushUserCreateMessage}>
          <FormGroup validationState={this.state.validationState}>
            <FormControl type="text" value={this.state.userName} onChange={this.handleUserNameChange} />
          </FormGroup>
          <FormGroup validationState={this.state.validationState2}>
            <FormControl type="password" value={this.state.passWordOnce} onChange={this.handlePassWordOnceChange} />
          </FormGroup>
          <FormGroup validationState={this.state.validationState2}>
            <FormControl type="password" value={this.state.passWordSecond} onChange={this.handlePassWordSecondChange} />
          </FormGroup>
          <FormGroup validationState={this.state.validationState2}>
            <FormControl type="text" value={this.state.email} onChange={this.handleEmailChange} />
          </FormGroup>
          <FormGroup validationState={this.state.validationState2}>
            <FormControl type="text" value={this.state.class} onChange={this.handleClassChange} />
          </FormGroup>
          <Button bsStyle="danger" type="submit">注 册</Button>
        </form>
      </div>
    );
  }
}

export default UserCreate;
