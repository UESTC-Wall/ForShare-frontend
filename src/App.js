import React from 'react';
import { Navbar, Nav, NavDropdown, NavItem, MenuItem } from 'react-bootstrap';
import { bootstrapUtils } from 'react-bootstrap/lib/utils';
import { LinkContainer } from 'react-router-bootstrap';
import { observer } from 'mobx-react';
import { FormGroup, FormControl, Modal, Button } from 'react-bootstrap';
import ReactDOM from 'react-dom';
import ajax from 'superagent';

import LoginStatusUI from './components/LoginStatusUI';
import baseUrl from './pages/config';
import './App.css';

bootstrapUtils.addStyle(Navbar, 'custom');

function GetIEVersion() {
  var sAgent = window.navigator.userAgent;
  var Idx = sAgent.indexOf("MSIE");

  // If IE, return version number.
  if (Idx > 0) 
    return parseInt(sAgent.substring(Idx+ 5, sAgent.indexOf(".", Idx)));

  // If IE 11 then look for Updated user agent string.
  else if (sAgent.indexOf("rv:11") > 0) 
    return 11;

  else
    return 0; //It is not IE
}


class Footer extends React.Component{
  render() {
    if(GetIEVersion() > 0){
      return null;
    }else{
      return(
        <footer>ForShare</footer>
      )
    }
  }
}

@observer
class App extends React.Component {
  constructor(props) {
      super(props);

      this.state = {
          showModal: false,
          sugPlaceholder: "写下你的建议...",
          sugValidationState: null
      }
  }

  publish = () => {
      const sugMessage = ReactDOM.findDOMNode(this.refs.sugValue).value.trim();

      if(!sugMessage) {
          this.errorReminder();
          return;
      }

      const content = {
          content: sugMessage
      }
      ajax.post(`${baseUrl}/suggestion/`)
          .send(content)
          .end((error,response) => {
              if(error || response.status !== 201) {
                  console.log('source push error!');
                  alert("发布失败，请稍后再试");
                  this.deleteInputValue();
              } else {
                  console.log('yay got ' + JSON.stringify(response.body));
                  alert("发布成功");
                  this.deleteInputValue();
              }
          })
  }

  errorReminder() {
      if(ReactDOM.findDOMNode(this.refs.sugValue).value.trim() === "") {
          this.setState({ sugPlaceholder : "提交内容不能为空..." });
          this.setState({ sugValidationState : "error" });
      }
  }

  deleteInputValue = () => {
      ReactDOM.findDOMNode(this.refs.sugValue).value = "";
  }

  getChildContext = () => {
    return {
      location: this.props.location
    }
  }

  showTheModal = () => {
    this.setState({ showModal: true});
  }

  close = () => this.setState({ showModal: false });

  render() {

    return (
      <div>
        <div className="header">
          <Navbar bsStyle="custom">
            <Navbar.Header>
              <Navbar.Brand>
                <a href="#">ForShare</a>
              </Navbar.Brand>
            </Navbar.Header>
            <Nav>
              <NavDropdown title={"资源分享"} id="basic-nav-dropdown">
                <LinkContainer to="/articlesourcelist">
                  <MenuItem eventKey={1}>原创文章</MenuItem>
                </LinkContainer>
                <LinkContainer to="/linksourcelist">
                  <MenuItem eventKey={2}>链接分享</MenuItem>
                </LinkContainer>
              </NavDropdown>
              <LinkContainer to="newlink" activeHref="active">
                <NavItem>上传链接</NavItem>
              </LinkContainer>
              <LinkContainer to="newarticle" activeHref="active">
                <NavItem>写文章</NavItem>
              </LinkContainer>
                <NavItem onClick={this.showTheModal}>意见反馈</NavItem>
            </Nav>
            <Nav pullRight>
              <LoginStatusUI></LoginStatusUI>
            </Nav>
          </Navbar>
          <div className="body">
            { this.props.children }
          </div>
          <Footer />
        </div>  
        <div>
          <Modal 
            show={ this.state.showModal }
            onHide={ this.close }
            dialogClassName="custom-modal"
          >
                <Modal.Header closeButton>
                    <Modal.Title>意见反馈</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <FormGroup bsSize="large" validationState={this.state.sugValidationState}>
                            <FormControl componentClass="textarea" placeholder={this.state.sugPlaceholder} ref="sugValue"/>
                        </FormGroup>
                    </form>
                </Modal.Body>    
                <Modal.Footer>
                    <Button bsStyle="danger" onClick={this.close}>取消</Button>
                    <Button bsStyle="danger" onClick={this.publish}>确认</Button>
                </Modal.Footer>    
            </Modal> 
        </div>
      </div>   
    );
  }
}

App.childContextTypes = {
    location: React.PropTypes.object
}
export default App;
