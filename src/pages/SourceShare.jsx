import React from "react";
import ajax from "superagent";
import { FormGroup, FormControl, Button } from "react-bootstrap";
import { bootstrapUtils } from "react-bootstrap/lib/utils";
import { Link, browserHistory } from "react-router";
import { observer } from "mobx-react";
import "simditor-new/styles/simditor.css";

import { LoginState } from "../store";
import baseUrl from "./config";
import "./SourceShare.css";

bootstrapUtils.addStyle(FormControl, "custom");

export default function createSource(sourceType) {
  const Content = (props) => {
    if (sourceType !== "article") {
      return (
        <p>
          <a href={props.linkUrl} target="blank">{props.linkUrl}</a>
        </p>
      );
    }
    return (
      <div className="article-content" dangerouslySetInnerHTML={props.setHtml} />
    );
  };

  Content.defaultProps = {
    linkUrl: null,
    setHtml: null
  };

  Content.propTypes = {
    linkUrl: React.PropTypes.string,
    setHtml: React.PropTypes.string
  };

  @observer
  class SourceShare extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        resource: [],
        comments: [],
        commentsOwnerNames: [],
        urlPublishTime: 0,
        commentLength: 0,
        inputValidationState: null,
        inputPlaceholder: "写下你的评论..",
        commentContent: ""
      };
    }

    componentWillMount() {
      this.getContent();
    }

    getContent = () => {
      const commentUrl = sourceType === "article" ? "articlecomment" : "urlcomment";

      if (sourceType !== "article") {
        ajax.get(`${baseUrl}/urlpublish/${this.props.params.id}`)
          .end((error, response) => {
            if (!error && response) {
              this.setState({ resource: response.body });
              this.setState({ urlPublishTime: response.body.urlpublish_time.slice(0, 16) });
              this.setState({ commentLength: response.body.urlcomment_set.length });
            } else {
              console.log("resource fetching error!");
            }
          });
      } else {
        ajax.get(`${baseUrl}/articlelist/${this.props.params.id}`)
          .end((error, response) => {
            if (!error && response) {
              this.setState({ resource: response.body });
              this.setState({ urlPublishTime: response.body.publish_time.slice(0, 16) });
              this.setState({ commentLength: response.body.articlecomment_set.length });
            } else {
              console.log("resource fetching error!");
            }
          });
      }

      ajax.get(`${baseUrl}/${commentUrl}/?comment1=${this.props.params.id}`)
        .end((error, response) => {
          if (!error && response) {
            const rawComments = response.body.results;
            ajax.get(`${baseUrl}/users/`)
              .end((error1, response1) => {
                if (!error1 && response1) {
                  const users = response1.body.results;
                  let comments = [];
                  if (sourceType !== "article") {
                    comments = rawComments.map(comment => ({
                      ...comment,
                      ownername: users.find(user => user.id === comment.username).username,
                    }));
                  } else {
                    comments = rawComments.map(comment => ({
                      ...comment,
                      ownername: users.find(user => user.id === comment.usernameid).username,
                    }));
                  }
                  this.setState({ comments });
                }
              });
          } else {
            console.log("comments fetching error");
          }
        });
    }

    handleChange = (event) => {
      this.setState({ commentContent: event.target.value.trim() });
    }

    pushComment = () => {
      if (!LoginState.completed) {
        browserHistory.push("login");
      } else if (!this.state.commentContent) {
        this.errorRemminder();
      } else {
        const content = {
          content: this.state.commentContent
        };
        const commentUrl = sourceType === "article" ? "articlecomment" : "urlcomment";
        ajax.post(`${baseUrl}/${commentUrl}/?comment1=${this.props.params.id}`)
            .send(content)
            .set({ Authorization: `Token ${LoginState.token}` })
            .end((error, response) => {
              if (error || response.status !== 201) {
                alert("评论失败，请稍后再试");
                this.setState({ commentContent: "" });
              } else {
                this.getContent();
                this.setState({ commentContent: "" });
              }
            });
      }
    }

    errorRemminder = () => {
      this.setState({ inputPlaceholder: "评论不能为空" });
      this.setState({ inputValidationState: "error" });
    }

    deleteInputValue = () => {
      this.setState({ commentContent: "" });
    }

    render() {
      let userId = 0;
      let owner = "";
      let publishTime = "";
      let title = "";
      let urlmessage;
      let content;
      if (sourceType !== "article") {
        userId = this.state.resource.username;
        owner = this.state.resource.owner;
        publishTime = this.state.urlPublishTime;
        title = this.state.resource.urlintroduce;
        urlmessage = this.state.resource.urlmessage;
      } else {
        userId = this.state.resource.usernameid;
        owner = this.state.resource.article_owner;
        publishTime = this.state.urlPublishTime;
        title = this.state.resource.article_abstract;
        content = { __html: this.state.resource.article };
        urlmessage = null;
      }
      return (
        <div className="source-share">
          <div className="source">
            <div className="source-title">
              <b>发布于</b>
              <b className="b-username"><Link to={`/user/${userId}`}>{owner}</Link></b>
              <b className="b-publishtime">{publishTime}</b>
              <Button bsStyle="default" onClick={browserHistory.goBack}>返回</Button>
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
                this.state.comments.map((comment) => {
                  const username = comment.ownername;
                  const commentTime = comment.comment_time.slice(0, 16);
                  const ccontent = comment.content;
                  const cuserId = comment.username;

                  return (
                    <div className="comment" key={cuserId}>
                      <p><b>来自</b><b className="b-comment-username"><Link to={`/user/${cuserId}`}>{username}</Link></b><b className="b-comment-time">{commentTime}</b></p>
                      <p>{ccontent}</p>
                    </div>
                  );
                })
              }
            </div>
            <div className="write-comment">
              <form onSubmit={this.pushComment}>
                <FormGroup bsStyle="custom" validationState={this.state.inputValidationState}>
                  <FormControl type="text" placeholder={this.state.inputPlaceholder} value={this.state.commentContent} onChange={this.handleChange} />
                </FormGroup>
                <Button bsStyle="danger" type="submit">提交</Button>
                <Button onClick={this.deleteInputValue}>取消</Button>
              </form>
            </div>
          </div>
        </div>
      );
    }
  }

  SourceShare.propTypes = {
    params: React.PropTypes.element.isRequired
  };

  return SourceShare;
}
