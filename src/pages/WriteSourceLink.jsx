import React from 'react';
import ajax from 'superagent';
import { FormGroup, FormControl, Button } from 'react-bootstrap';
import { observer } from 'mobx-react';
import { browserHistory } from 'react-router';

import baseUrl from './config';
import { LoginState } from '../store';
import './WriteSourceLink.css';

@observer
class WriteSourceLink extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      urlValuePlaceholde: "添加链接",
      urlValueValidationState: null,
      urlValue: ""
    };
  }

  handleChange = (event) => {
    this.setState({ urlValue: event.target.value.trim() });
  }

  publish = () => {
    if (!LoginState.completed) {
      browserHistory.push('/login');
      alert("请先登录");
      return;
    }
    const urlMessage = this.state.urlValue;

    if (!urlMessage) {
      this.errorReminder();
      return;
    }

    const content = {
      owner: LoginState.username,
      urlmessage: urlMessage,
    };
    ajax.post(`${baseUrl}/urlpublish/`)
      .send(content)
      .set({ Authorization: `Token ${LoginState.token}` })
      .end((error, response) => {
        if (error || response.status !== 201) {
          console.log('source push error!');
          alert("发布失败，请稍后再试");
          this.deleteInputValue();
        } else {
          alert("发布成功");
          this.deleteInputValue();
        }
      });
  }

  deleteInputValue = () => {
    this.setState({ urlValue: "" });
  }

  errorReminder() {
    if (this.state.urlValue === "") {
      this.setState({ urlValuePlaceholde: "链接不能为空" });
      this.setState({ urlValueValidationState: "error" });
    }
  }

  render() {
    return (
      <div key="write-source" className="write-source">
        <h1 className="title-h">上传链接</h1>
        <p className="title-p"><label className="of" />在这里添加链接<label className="on" /></p>
        <form onSubmit={this.publish}>
          <FormGroup bsSize="large" validationState={this.state.urlValueValidationState}>
            <FormControl type="text" placeholder={this.state.urlValuePlaceholde} value={this.state.urlValue} onChange={this.handleChange} />
          </FormGroup>
          <Button bsStyle="danger" bsSize="large" onClick={this.publish}>提交</Button>
        </form>
      </div>
    );
  }
}

export default WriteSourceLink;
