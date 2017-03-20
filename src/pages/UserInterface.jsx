import React from 'react';
import ajax from 'superagent';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router';

import baseUrl from './config';
import './UserInterface.css';

class UserInterface extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      userInformation: {},
      userPublish: []
    };
  }
  componentWillMount() {
    ajax.get(`${baseUrl}/users/${this.props.params.id}`)
    .end((error, response) => {
      if (!error && response) {
        this.setState({ userInformation: response.body });
        this.setState({ userPublish: response.body.urlpublish_set });
      } else {
        console.log("user information fetch error!");
      }
    });
  }

  sourceDelete = () => {
    ajax.delete(`${baseUrl}/users/${this.props.params.id}`)
       .end((error, response) => {
         if (!error && response) {
           this.setState({ userInformation: response.body });
           console.log("success");
         } else {
           console.log("fail");
         }
       });
  }

  render() {
    return (
      <div className="user">
        <div className="user-information">
          <p className="user-name">{this.state.userInformation.username}</p>
          <p>班级：<b>{this.state.userInformation.user_class}</b></p>
          <p>E-mail：<b>{this.state.userInformation.user_email}</b></p>
        </div>
        <div className="user-publish">
          <div className="publish-div-title">发布过{this.state.userPublish.length}条内容</div>
          {
            this.state.userPublish.map((urlpublish) => {
              const publishContent = urlpublish.split(",")[2];
              const urlKey = urlpublish.split(",")[1];
              return (
                <div className="publish" key={urlKey}>
                  <span>{publishContent}</span>
                  <Button bsStyle="default"><Link to={`/link/${urlKey}`}>查看</Link></Button>
                </div>
              );
            })
          }
        </div>
      </div>
    );
  }
}

UserInterface.propTypes = {
  params: React.PropTypes.element.isRequired
};

export default UserInterface;
