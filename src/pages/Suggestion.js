import React from 'react';
import { FormGroup, FormControl, Modal, Button } from 'react-bootstrap';
import ReactDOM from 'react-dom';
import ajax from 'superagent';

import baseUrl from './config';
import './Suggestion.css';

class Suggestion extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showModal: true,
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

    render() {
        let close = () => ({ showModal: false });

        return (
            <div>
                <Modal 
                show={ this.state.showModal }
                onHide={ close }
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
                        <Button bsStyle="danger" onClick={close}>取消</Button>
                        <Button bsStyle="danger" onClick={this.publish}>确认</Button>
                    </Modal.Footer>    
                </Modal> 
            </div>
        );
    }
}

export default Suggestion;