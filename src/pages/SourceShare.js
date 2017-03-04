import React from 'react';
import ajax from 'superagent';
import { FormGroup, FormControl, Button } from 'react-bootstrap';
import { bootstrapUtils } from 'react-bootstrap/lib/utils';
import { Link } from 'react-router';
import ReactDOM from 'react-dom';
import{ observer } from 'mobx-react';
import { browserHistory } from 'react-router';

import { LoginState } from '../store';
import baseUrl from './config';
import './SourceShare.css';

bootstrapUtils.addStyle(FormControl, 'custom');

@observer
class SourceShare extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      resource: [],
      comments: [],
      commentsOwnerNames: [],
      urlPublishTime: 0,
      commentLength: 0,
      inputValidationState: null,
      inputPlaceholder: "写下你的评论..",
    }
  }

  componentWillMount(){
    this.getContent();
  }

  getContent = () => {
    ajax.get(`${baseUrl}/urlpublish/${this.props.params.id}`)
    .end((error, response) => {
      if(!error && response){
        this.setState({ resource : response.body });
        this.setState({ urlPublishTime : response.body.urlpublish_time.slice(0, 16) });
        this.setState({ commentLength : response.body.urlcomment_set.length })
      }else{
        console.log("resource fetching error!");
      }
    })

    ajax.get(`${baseUrl}/urlcomment/?comment1=${this.props.params.id}`)
    .end((error, response) => {
      if(!error && response){
        const rawComments = response.body.results;
        ajax.get(`${baseUrl}/users/`)
        .end((error, response) => {
          if(!error && response){
            const users = response.body.results
            const comments = rawComments.map(comment => ({
              ...comment,
              ownername: users.find(user => user.id === comment.username).username
            }))
            this.setState({ comments });
          }
        })
      }else{
        console.log("comments fetching error");
      }
    })
  }

  pushComment = () => {
    if(!LoginState.completed){
      browserHistory.push('login');
      return;
    }else{
      if(!ReactDOM.findDOMNode(this.refs.commentValue).value.trim()){
        this.errorRemminder();
      }else{
        const content = {
          content: ReactDOM.findDOMNode(this.refs.commentValue).value.trim()
        }

        ajax.post(`${baseUrl}/urlcomment/?comment1=${this.props.params.id}`)
        .send(content)
        .set({'Authorization': `Token ${LoginState.token}`})
        .end((error, response) => {
          if(error || response.status !== 201){
            alert("评论失败，请稍后再试");
            ReactDOM.findDOMNode(this.refs.commentValue).value = "";
          }else{
            this.getContent();
            ReactDOM.findDOMNode(this.refs.commentValue).value = "";
          }
        })
      }
    }
  }

  errorRemminder = () => {
    this.setState({ inputPlaceholder : "评论不能为空" });
    this.setState({ inputValidationState : "error" });
  }

  deleteInputValue = () => {
    ReactDOM.findDOMNode(this.refs.commentValue).value = "";
  }

  render(){
    return(
      <div className="source-share">
        <div className="source">
          <div className="source-title">
            <b>发布于</b>
            <b className="b-username"><Link to={`/user/${this.state.resource.username}`}>{this.state.resource.owner}</Link></b>
            <b className="b-publishtime">{this.state.urlPublishTime}</b>     
          </div>
          <div className="source-content">
            <p>
              {this.state.resource.urlintroduce}
            </p>
            <p>
              <a href={this.state.resource.urlmessage} target="blank">{this.state.resource.urlmessage}</a>
            </p>
          </div>
        </div>
        <div className="comment-source">
          <div><h5>{this.state.commentLength} 条评论</h5></div>
          <div className="comment-list">
            {
              this.state.comments.map((comment, index) => {
                const username = comment.ownername;
                const commentTime = comment.comment_time.slice(0, 16);
                const content = comment.content;
                const userId = comment.username;

                return (
                  <div className="comment" key={index}>
                    <p><b>来自</b><b className="b-comment-username"><Link to={`/user/${userId}`}>{username}</Link></b><b className="b-comment-time">{commentTime}</b></p>
                    <p>{content}</p>
                  </div>
                )
              })
            }
          </div>
          <div className="write-comment">
            <form>
              <FormGroup bsStyle="custom" validationState={this.state.inputValidationState}>
                <FormControl type="text" placeholder={this.state.inputPlaceholder} ref="commentValue" />
              </FormGroup>
            </form>
            <Button bsStyle="danger" onClick={this.pushComment}>提交</Button>
            <Button onClick={this.deleteInputValue}>取消</Button>
          </div>
        </div>
      </div>  
    )
  }
}

export default SourceShare;