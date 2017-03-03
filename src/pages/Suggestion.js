import React from 'react';
import { FormGroup, FormControl, Button } from 'react-bootstrap';

import './Suggestion.css'

class Suggestion extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            sugPlaceholder:"请输入你的建议...",
            sugValidationState: null
        }
    }

    render() {
        return(
            <div className="write-suggestion">
                <p className="title">发表你的建议吧~</p>
                <form>
                    <FormGroup bsSize="large" validationState={this.state.sugValidationState}>
                        <FormControl type="textarea" placeholder={this.state.sugPlaceholder}/>
                    </FormGroup>
                </form>    
                <Button bsStyle="danger" bsSize="large">确认</Button>
            </div>
        );
    }
}

export default Suggestion; 