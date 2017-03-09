import React from 'react';
import ajax from 'superagent';
import { FormGroup, FormControl, Button } from 'react-bootstrap';
import { bootstrapUtils } from 'react-bootstrap/lib/utils';
import { Link } from 'react-router';
import ReactDOM from 'react-dom';
import{ observer } from 'mobx-react';
import { browserHistory } from 'react-router';
import 'simditor-new/styles/simditor.css';

import { LoginState } from '../store';
import baseUrl from './config';
import './SourceShare.css';

bootstrapUtils.addStyle(FormControl, 'custom');

export default function createSource(sourceType){
  class Content extends React.Component{
  constructor(props){
    super(props);
  }

    render(){
      if(sourceType !== "article"){
        return(
          <p>
            <a href={this.props.linkUrl} target="blank">{this.props.linkUrl}</a>
          </p>
        )
      }else{
        return(
          <div className="article-content" dangerouslySetInnerHTML={this.props.setHtml()}></div>
        )
      }
    }
  }

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
    var commentUrl = sourceType === "article" ? "articlecomment" : "urlcomment";

    if(sourceType !== "article"){
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
    }else{
      ajax.get(`${baseUrl}/articlelist/${this.props.params.id}`)
      .end((error, response) => {
        if(!error && response){
          this.setState({ resource : response.body });
          this.setState({ urlPublishTime : response.body.publish_time.slice(0, 16) });
          this.setState({ commentLength : response.body.articlecomment_set.length })
        }else{
          console.log("resource fetching error!");
        }
      })
    }

    ajax.get(`${baseUrl}/${commentUrl}/?comment1=${this.props.params.id}`)
    .end((error, response) => {
      if(!error && response){
        const rawComments = response.body.results;
        ajax.get(`${baseUrl}/users/`)
        .end((error, response) => {
          if(!error && response){
            const users = response.body.results;
            var comments = [];
            if(sourceType !== "article"){
              comments = rawComments.map(comment => ({
                ...comment,
                ownername: users.find(user => user.id === comment.username).username
              }))
            }else{
              comments = rawComments.map(comment => ({
                ...comment,
                ownername: users.find(user => user.id === comment.usernameid).username
              }))
            }
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
      const commentUrl = sourceType === "article" ? "articlecomment" : "urlcomment";  
      ajax.post(`${baseUrl}/${commentUrl}/?comment1=${this.props.params.id}`)
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
    var userId = 0;
    var owner = "";
    var publishTime = "";
    var title = "";
    var urlmessage;
    var content;
    if(sourceType !== "article"){
        userId = this.state.resource.username;
        owner = this.state.resource.owner;
        publishTime = this.state.urlPublishTime;
        title = this.state.resource.urlintroduce;
        content = () => null;
        urlmessage = this.state.resource.urlmessage;
      }else{
        userId = this.state.resource.usernameid;
        owner = this.state.resource.article_owner;
        publishTime = this.state.urlPublishTime;
        title = this.state.resource.article_abstract;
        content = () => ({__html:this.state.resource.article});
        urlmessage = null;
      }
    return(
      <div className="source-share">
        <div className="source">
          <div className="source-title">
            <b>发布于</b>
            <b className="b-username"><Link to={`/user/${userId}`}>{owner}</Link></b>
            <b className="b-publishtime">{publishTime}</b>     
          </div>
          <div className="source-content">
            <p className="content-title">
              {title}
            </p>
            <Content setHtml={content} linkUrl={urlmessage} />
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

return SourceShare;
}




  

  