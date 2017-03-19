import React from 'react';
import ajax from 'superagent';
import { FormGroup, InputGroup, Button, FormControl, OverlayTrigger, Popover } from 'react-bootstrap';

import './NewUser.css';

class NewUser extends React.Component{
  constructor(props){
		super(props);

		this.state = {
			userName: "",
			OncePassWord: "",
			SecondPassWord: "",
			email: "",
			class: "",
			unInputReminder: "不多于30个字符。只能用字母、数字和字符 @/./+/-/_ ",
		}
  }

	handleUnChange = (event) => {
		this.setState({ userName : event.target.value });
	}

	handlePsChange = (event) => {
		this.setState({ OncePassWord : event.target.value });
	}
	handlePsChange = (event) => {
		this.setState({ SecondPassWord : event.target.value });
	}

	handleEmChange = (event) => {
		this.setState({ email : event.target.value });
	}

	handleClChange = (event) => {
		this.setState({ class : event.target.value });
	}

	render(){

		const popoverHoverFocusUn = (
			<Popover id="popover-trigger-hover-focus">
				<strong>{this.state.unInputReminder}</strong>
			</Popover>
		);
		return (
			<div className="new-user">
				<form onSubmit={this.pushUserMessage}>
					<FormGroup validationState={this.state.validationState}>
						用户名：
						<OverlayTrigger trigger={['hover', 'focus']} placement="top" overlay={popoverHoverFocusUn}>
							<FormControl type="text" value={this.state.userName} onChange={this.handleUnChange}/>
						</OverlayTrigger>
					</FormGroup>
					<FormGroup validationState={this.state.validationState}>
						密码：
						<FormControl type="password" value={this.state.passWord} onChange={this.handleOpsChange}/>
					</FormGroup>
					<FormGroup validationState={this.state.validationState}>
						确认密码：
						<FormControl type="password" value={this.state.passWord} onChange={this.handleSpsChange}/>
					</FormGroup>
					<FormGroup validationState={this.state.validationState}>
						邮箱：
						<FormControl type="text" value={this.state.passWord} onChange={this.handleEmChange}/>
					</FormGroup>
					<FormGroup validationState={this.state.validationState}>
						班级：
						<FormControl type="text" value={this.state.passWord} onChange={this.handleClChange}/>
					</FormGroup>
				</form>

			</div>
		)
	}
}

export default NewUser;