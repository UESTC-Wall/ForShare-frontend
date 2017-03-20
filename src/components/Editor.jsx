import React from 'react';
import Simditor from 'simditor-new';
import 'simditor-new/styles/simditor.css';

import { LoginState } from '../store';
import baseUrl from '../pages/config';

class Editor extends React.Component {

  componentDidMount() {
    this.editor = new Simditor({
      textarea: ('#editor'),
      upload: {
        url: `${baseUrl}/articlepublish`,
        type: 'photo',
        params: { Authorization: `Token ${LoginState.token}` },
        fileKey: 'upload_file',
        connectionCount: 3,
        leaveConfirm: 'Uploading is in progress, are you sure to leave this page?',
      },
      toolbar: [
        'title',
        'bold',
        'italic',
        'underline',
        'strikethrough',
        'fontScale',
        'color',
        'ol',
        'ul',
        'blockquote',
        'code',
        'table',
        'image',
        'link',
        'hr',
        'outdent',
        'alignment',
      ]
    });

    if (this.props.content !== undefined) {
      this.editor.setValue(this.props.content);
    }
  }

  setValue = (content) => {
    this.editor.setValue(content);
  }

  reset = () => {
    this.setValue("");
  }

  getValue = () => this.editor.getValue().trim()

  render() {
    return (
      <textarea id="editor" placeholder="请在这里写入文章" />
    );
  }
}

Editor.propTypes = {
  content: React.PropTypes.string
};

Editor.defaultProps = {
  content: undefined
};
export default Editor;
