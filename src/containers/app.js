import React, { Component, createFactory, DOM, PropTypes, createClass } from 'react';
import IO from 'socket.io-client';

export default createClass({
  getInitialState: function() {
    return {
      files: {}
    };
  },

  componentWillMount: function() {
    const socket = IO(this.props.host);

    socket.on('files', (files) => {
      this.setState({files: files})
    });

    socket.on('file', (file) => {
      const files = this.state.files;
      files[file.name] = file.content;
      this.setState({files: files})
    });

    this.setState({
      socket: socket
    });
  },

  destroyFile: function(name) { 
    return () => {
      const files = this.state.files;
      delete files[name];
      this.setState({files: files});
    }
  },

  filesToElems: function(files) {
    return Object.keys(files).map(name => {
      const content = files[name];
      return DOM.div({className: 'file', key: name},
        DOM.h4({onClick: this.destroyFile(name)}, name),
        DOM.textarea({value: content, readOnly: true})
      );
    });
  },

  render: function() {
    const {
      files
    } = this.state;

    return DOM.div({className: 'files'},
      this.filesToElems(files)
    );
  }
})
