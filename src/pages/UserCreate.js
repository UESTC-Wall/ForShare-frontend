import React from 'react';
import ReactDOM from 'react-dom';
import ajax from 'superagent';
import { FormGroup, InputGroup, FormControl, Button, Glyphicon } from 'react-bootstrap';

import './UserCreate.css';
import baseUrl from './config';

class UserCreate extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            validationState: null,
            namePlaceholder: "用户名",
            passwordPlaceholder: "输入密码",
            emailPlaceholder: "输入你的邮箱",
            classPlaceholder: "年级（如：2015）"
        }
    }

    pushUserCreateMessage = () => {
        const content = {
            username: ReactDOM.findDOMNode(this.refs.userName).value,
            password: ReactDOM.findDOMNode(this.refs.passWord).value,
            useremail: ReactDOM.findDOMNode(this.refs.userEmail).value,
            userclass: ReactDOM.findDOMNode(this.refs.userClass).value
        }

        ajax.post(`${baseUrl}/usercreate/`)
            .send(content)
            .end((error, response) => {
                if(!error && response) {
                    alert('suceese!');
                } else {
                    alert('fail!');
                }
            })
    }

    errorReminder = () => {
        let setErrorContent = (value) => {
            ReactDOM.findDOMNode(this.refs.errorReminder).style.display = "block";
            ReactDOM.findDOMNode(this.refs.errorReminder).innerHTML = value;
        }
        if(ReactDOM.findDOMNode(this.refs.userName).value.trim() === "" || 
        ReactDOM.findDOMNode(this.refs.passWord).value.trim() === "" ||
        ReactDOM.findDOMNode(this.refs.userEmail).value.trim() === "" ||
        ReactDOM.findDOMNode(this.refs.userClass).value.trim() === "") {
            setErrorContent("请输入完整的用户信息！");
        } else {
            setErrorContent("请按要求填写用户名！");
            this.setState({ validationState : "error" });
        }
    }

    render() {
        return(
            <div className="usercreate">
                <h3>注 册</h3>
                <form>
                    <FormGroup validationState={this.state.validationState}>
                        <InputGroup bsStyle="custom">
                            <InputGroup.Addon >
                                <Glyphicon glyph="user" /></InputGroup.Addon>
                            <FormControl type="text" ref="userName" placeholder={this.state.namePlaceholder}/>
                        </InputGroup>
                    </FormGroup>
                    <FormGroup>
                        <InputGroup bsStyle="custom">
                            <InputGroup.Addon>
                                <Glyphicon glyph="lock" />
                            </InputGroup.Addon>
                            <FormControl type="password" ref="passWord" placeholder={this.state.passwordPlaceholder}/>
                        </InputGroup>
                    </FormGroup>
                    <FormGroup>
                        <InputGroup bsStyle="custom">
                            <InputGroup.Addon>
                                <Glyphicon glyph="envelope" />
                            </InputGroup.Addon>
                            <FormControl type="text" ref="userEmail" placeholder={this.state.emailPlaceholder}/>
                        </InputGroup>
                    </FormGroup>
                    <FormGroup>
                        <InputGroup bsStyle="custom">
                            <InputGroup.Addon>
                                <Glyphicon glyph="book" />
                            </InputGroup.Addon>
                            <FormControl type="text" ref="userClass" placeholder={this.state.classPlaceholder}/>
                        </InputGroup>
                    </FormGroup>
                </form>
                <Button bsStyle="danger" onClick={this.pushUserCreateMessage}>注 册</Button>
                <p className="error-reminder" ref="errorReminder"></p>
            </div>
        )
    }
}

export default UserCreate;