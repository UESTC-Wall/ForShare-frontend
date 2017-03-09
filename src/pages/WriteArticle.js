import React from 'react';
import { FormGroup, FormControl, Button } from 'react-bootstrap';
import { bootstrapUtils } from 'react-bootstrap/lib/utils';
import ReactDOM from 'react-dom';
import ajax from 'superagent';
import { observer } from 'mobx-react';
import { browserHistory } from 'react-router';

import baseUrl from './config';
import { LoginState } from '../store';
import './WriteSourceLink.css';

import Editor from '../components/Editor';
import './WriteArticle.css';

bootstrapUtils.addStyle(FormControl, 'custom');

@observer
class WriteArticle extends React.Component{
  constructor(props){
    super(props);

    this.state = {
      ValidationState: null,
      Placeholde: "请输入文章标题"
    }
  }

  componentDidMount(){
    
  }

  publish = () => {
    if(!LoginState.completed){
      browserHistory.push('/login');
      alert("请先登录");
    }
    
    const articleContent = {
      article_abstract: ReactDOM.findDOMNode(this.refs.titleValue).value.trim(),
      article: this.refs.editor.getValue().trim()
    }

    if(!articleContent.article_abstract || !articleContent.article){
      this.setState({ ValidationState: "error" , Placeholde: "标题与内容不能为空"});
      alert(articleContent.article);
      return;
    }

    ajax.post(`${baseUrl}/articlepublish/`)
      .send(articleContent)
      .set({'Authorization': `Token ${LoginState.token}`})
      .end((error, response) => {
        if (error || response.status !== 201) {
          console.log('source push error!');
          alert("发布失败，请稍后再试");
        } else {
          console.log('yay got ' + JSON.stringify(response.body));
          alert("发布成功");
        }
      });
  }

  render(){
    return (
      <div className="editor">
        <h1 className="title-h">写文章</h1>
        <p className="title-p"><label className="of"></label>将想法告诉世界<label className="on"></label></p>
        <form>
          <FormGroup bsSize="large" validationState={this.state.ValidationState}>
            <FormControl type="text" placeholder={this.state.Placeholde} ref="titleValue" bsStyle="custom" />
          </FormGroup>
        </form>
        <Editor ref="editor"/>
        <Button bsStyle="danger" bsSize="large" onClick={this.publish}>提交</Button>
      </div>
    );
  }
}

export default WriteArticle;