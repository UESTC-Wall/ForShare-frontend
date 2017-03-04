import React from 'react';
import ReactDOM from 'react-dom';
import ajax from 'superagent';
import { FormGroup, FormControl, Button } from 'react-bootstrap';
import{ observer } from 'mobx-react';
import { browserHistory } from 'react-router';

import baseUrl from './config';
import { LoginState } from '../store';
import './WriteSourceLink.css';

@observer
class WriteSourceLink extends React.Component{

  constructor(props){
    super(props);

    this.state = {
      urlValuePlaceholde: "添加链接",
      urlValueValidationState: null,
    }
  }

  publish = () => {
    
    if(!LoginState.completed){
      browserHistory.push('/login');
      alert("请先登录");
      return;
    }
    const urlMessage = ReactDOM.findDOMNode(this.refs.urlValue).value.trim();

    if(!urlMessage){
      this.errorReminder();
      return;
    }

    const content = {
      owner: LoginState.username,
      urlmessage: urlMessage,
    }
    ajax.post(`${baseUrl}/urlpublish/`)
      .send(content)
      .set({'Authorization': `Token ${LoginState.token}`})
      .end((error, response) => {
        if (error || response.status !== 201) {
          console.log('source push error!');
          alert("发布失败，请稍后再试");
          this.deleteInputValue();
        } else {
          console.log('yay got ' + JSON.stringify(response.body));
          alert("发布成功");
          this.deleteInputValue();
        }
      });
    }

  deleteInputValue = () => { 
    ReactDOM.findDOMNode(this.refs.urlValue).value = "";
  }
  
  errorReminder(){
    if(ReactDOM.findDOMNode(this.refs.urlValue).value.trim() === ""){
      this.setState({ urlValuePlaceholde : "链接不能为空" });
      this.setState({ urlValueValidationState : "error" });
    }
  }

  render(){
    return(
      <div key="write-source" className="write-source">
        <h1 className="title-h">上传链接</h1>
        <p className="title-p"><label className="of"></label>在这里添加链接<label className="on"></label></p>
        <form>
          <FormGroup bsSize="large" validationState={this.state.urlValueValidationState}>
            <FormControl type="text" placeholder={this.state.urlValuePlaceholde} ref="urlValue" />
          </FormGroup>
        </form>
        <Button bsStyle="danger" bsSize="large" onClick={this.publish}>提交</Button>
      </div>
    )
  }
}

export default WriteSourceLink;