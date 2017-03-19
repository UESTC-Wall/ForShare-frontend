import React from 'react';
import ajax from 'superagent';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router';

import baseUrl from './config';
import './UserInterface.css';

bootstrapUtils.addStyle(Button, 'Link');

class UserInterface extends React.Component{

  constructor(props){
    super(props);

    this.state = {
      userInformation: {},
      userPublish: []
    }
  }
  componentWillMount(){
    ajax.get(`${baseUrl}/users/${this.props.params.id}`)
    .end((error, response) => {
      if(!error && response){
        this.setState({ userInformation : response.body });
        this.setState({ userPublish : response.body.urlpublish_set });
      }else{
        console.log("user information fetch error!");
      }
    })
  }

 sourceDelete = (publishTime) => {
   ajax.delete(`${baseUrl}/users/${this.props.params.id}`)
       .end((error, response) => {
         if(!error && response) {
           let publishTime = '';
           this.setState({ userInformation : response.body });
           console.log("success");
         } else {
           console.log("fail");
         }
       })
 }

  render(){
    return (
      <div className="user">
        <div className="user-information">
          <p className="user-name">{this.state.userInformation.username}</p>
          <p>班级：<b>{this.state.userInformation.user_class}</b></p>
        </div>
        <div className="user-publish">
          <div className="publish-div-title">发布过{this.state.userPublish.length}条内容</div>
          {
            this.state.userPublish.map((urlpublish, index) => {
              const publishTime = urlpublish.slice(7, 23);
              const publishContent = urlpublish.slice(33);
              return(
                <div className="publish" key={index}>
                  <div>
                    <b className="user-time">{publishTime}</b>
                    <DropdownButton title="" className="user-delete">
                      <MenuItem eventKey="1" onClick={this.sourceDelete.bind(this, publishTime)}>删除</MenuItem>
                    </DropdownButton>
                  </div>
                  <p>{publishContent}</p>
                </div>
              )
            })  
          }
        </div>
      </div>
    );
  }
}

export default UserInterface;