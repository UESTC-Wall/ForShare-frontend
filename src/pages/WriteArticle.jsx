import React from 'react';
import { FormGroup, FormControl, Button } from 'react-bootstrap';
import { bootstrapUtils } from 'react-bootstrap/lib/utils';
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
class WriteArticle extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ValidationState: null,
      Placeholde: "请输入文章标题",
      articleTitle: "",
      articleContent: ""
    };
  }

  handleTitleChange = (event) => {
    this.setState({ articleTitle: event.target.value.trim() });
  }

  publish = (event) => {
    event.preventDefault();

    if (!LoginState.completed) {
      browserHistory.push('/login');
      alert("请先登录");
    }

    const articleContent = {
      article_abstract: this.state.articleTitle,
      article: this.editor.getValue()
    };

    if (!articleContent.article_abstract || !articleContent.article) {
      this.setState({ ValidationState: "error", Placeholde: "标题与内容不能为空" });
      return;
    }

    ajax.post(`${baseUrl}/articlepublish/`)
      .send(articleContent)
      .set({ Authorization: `Token ${LoginState.token}` })
      .end((error, response) => {
        if (error || response.status !== 201) {
          console.log('source push error!');
          alert("发布失败，请稍后再试");
        } else {
          alert("发布成功");
          this.editor.reset();
          this.setState({ articleTitle: "" });
        }
      });
  }

  render() {
    return (
      <div className="editor">
        <h1 className="title-h">写文章</h1>
        <p className="title-p"><label className="of" />将想法告诉世界<label className="on" /></p>
        <form onSubmit={this.publish}>
          <FormGroup bsSize="large" validationState={this.state.ValidationState}>
            <FormControl type="text" placeholder={this.state.Placeholde} ref={(r) => { this.articleTitle = r; }} onChange={this.handleTitleChange} />
          </FormGroup>
          <Editor ref={(r) => { this.editor = r; }} className="simditor" />
          <Button bsStyle="danger" bsSize="large" type="submit">提交</Button>
        </form>
      </div>
    );
  }
}

export default WriteArticle;
