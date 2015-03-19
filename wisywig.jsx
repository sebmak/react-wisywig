var React = require('react/addons')
var Lodash = require('lodash/lang')
var Update = React.addons.update;
var cx = require('classnames');

WysiwygButtonIframe = React.createClass({
  handleClick: function(e){
    var p = prompt('Enter Iframe');
    if(p==null || p=='') return;
    document.querySelector('.wysiwyg-content').focus();
    document.execCommand('insertHTML',false,p)
  },
  render: function(){
    return <button style={{width:"60px"}} onClick={this.handleClick} disabled={this.props.preview || this.props.codeView}>Iframe</button>
  }
});

WysiwygButtonCallback = React.createClass({
  handleClick: function(e){
    this.props.callback(e);
  },
  render: function(){
    disabled = false;
    if(this.props.requiresEdit==true){
      disabled = this.props.preview || this.props.codeView;
    }
    var classes = cx({
      'active':this.props.state
    })
    return <button onClick={this.handleClick} className={classes} disabled={disabled}><i className={this.props.icon}></i></button>
  }
});

WysiwygButtonSave = React.createClass({
  handleClick: function(e){
    this.props.callback(e);
  },
  render: function(){
    return <button onClick={this.handleClick}><i className={this.props.icon}></i></button>
  }
});

WysiwygButtonFont = React.createClass({
  getInitialState: function(){
    return {
      open: false,
      active: 'Normal Text'
    }
  },
  checkActive: function(e){
    if(!this.refs.select.getDOMNode().contains(e.target)){
      this.setState({open:false})
    }
  },
  checkState: function(e){
    if(this.props.preview || this.props.codeView) return;
    if(Lodash.isElement(e.target) && document.querySelector('.wysiwyg-content').contains(e.target)){
      var selection = window.getSelection();
      var range = selection.getRangeAt(0);
      var container = range.startContainer;
      while(container.className!=='wysiwyg-content' && ['H1','H2','H3','H4','H5','H6'].indexOf(container.nodeName)==-1){
        container = container.parentNode;
      }
      if(container.nodeName=='H1'){
        this.setState({active: 'Heading 1'});
        return;
      } else if(container.nodeName=='H2'){
        this.setState({active: 'Heading 2'});
        return;
      } else if(container.nodeName=='H3'){
        this.setState({active: 'Heading 3'});
        return;
      } else if(container.nodeName=='H4'){
        this.setState({active: 'Heading 4'});
        return;
      } else if(container.nodeName=='H5'){
        this.setState({active: 'Heading 5'});
        return;
      } else if(container.nodeName=='H6'){
        this.setState({active: 'Heading 6'});
        return;
      } else {
        this.setState({active: 'Normal Text'});
        return;
      }
    }
  },
  componentDidMount: function(){
    document.addEventListener('keydown', this.checkState);
    document.addEventListener('click', this.checkState);
    document.addEventListener('focus', this.checkState);
    document.addEventListener('click', this.checkActive);
    document.addEventListener('focus', this.checkActive);
  },
  componentWillUnmount: function(){
    document.removeEventListener('keydown', this.checkState);
    document.removeEventListener('click', this.checkState);
    document.removeEventListener('focus', this.checkState);
    document.removeEventListener('click', this.checkActive);
    document.removeEventListener('focus', this.checkActive);
  },
  handleClick: function(){
    if(this.props.preview || this.props.codeView) return;
    this.setState({open:!this.state.open});
  },
  setText: function(type,e){
    if(this.props.preview || this.props.codeView) return;
    if(type=='normal'){
      document.execCommand('removeFormat',false,null);
      document.execCommand('formatBlock',false,'p');
    } else {
      document.execCommand('formatBlock',false,type);
    }
    this.setState({open:false,active:e.target.innerText})
  },
  render: function(){
    var classes = "wysiwyg-toolbar-select";
    if(this.state.open){
      classes+=' open';
    }
    return (
      <div ref="select" className={classes} disabled={this.props.preview || this.props.codeView}>
        <span onClick={this.handleClick} className="wysiwyg-toolbar-select-active">{this.state.active}</span>
        <ul className="wysiwyg-toolbar-select-list">
          <li onClick={this.setText.bind(this,"normal")}>Normal Text</li>
          <li onClick={this.setText.bind(this,"h1")}><h1>Heading 1</h1></li>
          <li onClick={this.setText.bind(this,"h2")}><h2>Heading 2</h2></li>
          <li onClick={this.setText.bind(this,"h3")}><h3>Heading 3</h3></li>
          <li onClick={this.setText.bind(this,"h4")}><h4>Heading 4</h4></li>
          <li onClick={this.setText.bind(this,"h5")}><h5>Heading 5</h5></li>
          <li onClick={this.setText.bind(this,"h6")}><h6>Heading 6</h6></li>
        </ul>
      </div>
    )
  }
});
WysiwygButtonLink = React.createClass({
  getInitialState: function(){
    return {
      icon: 'fa fa-link'
    }
  },
  checkActive: function(){

    if(this.props.preview || this.props.codeView) return;
    var selection = window.getSelection();
    if(selection.rangeCount<1) return;
    var selectText = selection.toString();

    var icon = 'fa fa-link';
    var range = selection.getRangeAt(0);
    var container = range.commonAncestorContainer;
    if (container.nodeType == 3) {container = container.parentNode;}
    if(container.nodeName === "A") {
      icon = 'fa fa-unlink';
    }
    this.setState({icon:icon})

  },
  handleClick: function(){
    if(this.props.preview || this.props.codeView) return;
    var selection = window.getSelection();
    var selectText = selection.toString();
    var range = selection.getRangeAt(0);
    var container = range.commonAncestorContainer;

    if (container.nodeType == 3) {container = container.parentNode;}
    if(container.nodeName === "A") {
      var newRange = document.createRange();
      range.selectNode(container);
      window.getSelection().addRange(range);

      document.execCommand('unlink',false,selectText);
      return;
    }
    var res = prompt("Enter a url", selectText);
    if(res=='' || res==null) return;
    if(selectText=='' || selectText==null){
      var a = document.createElement("a");
      a.innerHTML = res
      a.href = res;
      range.insertNode(a);
    } else {
      document.execCommand('createLink',false,res);
    }
  },
  componentDidMount: function(){
    document.addEventListener('keydown', this.checkActive);
    document.addEventListener('click', this.checkActive);
    document.addEventListener('focus', this.checkActive);
  },
  componentWillUnmount: function(){
    document.removeEventListener('keydown', this.checkActive);
    document.removeEventListener('click', this.checkActive);
    document.removeEventListener('focus', this.checkActive);
  },
  render: function(){
    return <button onClick={this.handleClick} disabled={this.props.preview || this.props.codeView}><i className={this.state.icon}></i></button>
  }
})

WysiwygButton = React.createClass({
  getInitialState: function(){
    return {
      active:false
    }
  },
  checkActive: function(e){
    console.log(this.props.preview,this.props.codeView);
    if(this.props.preview || this.props.codeView) return;
    if(Lodash.isElement(e.target) && document.querySelector('.wysiwyg').contains(e.target)){
      var isActive = document.queryCommandState(this.props.command);
      this.setState({active:isActive});
    }
  }, 
  componentDidMount: function(){
    document.addEventListener('keydown', this.checkActive);
    document.addEventListener('click', this.checkActive);
    document.addEventListener('focus', this.checkActive);
  },
  componentWillUnmount: function(){
    document.removeEventListener('keydown', this.checkActive);
    document.removeEventListener('click', this.checkActive);
    document.removeEventListener('focus', this.checkActive);
  },
  handleClick: function(e){
    document.querySelector('.wysiwyg-content').focus();
    document.execCommand(this.props.command,false,null);
    this.checkActive(e);
  },
  render: function(){
    var active = cx({
      active: this.state.active
    })
    return <button onClick={this.handleClick} className={active} disabled={this.props.preview || this.props.codeView}><i className={this.props.icon}></i></button>
  }
})

module.exports = React.createClass({
  getInitialProps: function(){
    return {
      save: function(){},
      buttons: [],
      contents:false,
      codeView: false
    }
  },
  getInitialState: function(){
    return {
      buttons:[],
      target:false,
      preview: false,
      codeView: false
    }
  },
  save: function(){
    this.props.save(this.refs.content.getDOMNode().innerHTML);
  },
  toggleEditable: function(){
    this.setState({preview:!this.state.preview})
    if(this.state.codeView){
      this.refs.content.getDOMNode().innerHTML = this.refs.content.getDOMNode().innerText;
      this.setState({codeView:false});
    }
  },
  toggleCodeView: function(){
    if(this.state.codeView){
      this.refs.content.getDOMNode().innerHTML = this.refs.content.getDOMNode().innerText;
      this.setState({codeView:false});
    } else {
      this.refs.content.getDOMNode().innerText = this.refs.content.getDOMNode().innerHTML;
      this.setState({codeView:true,preview:false});
    }
  },
  componentWillMount: function(){
    if(typeof(this.props.buttons)=='undefined'){
      var newButtons = [];
    } else {
      var newButtons = this.props.buttons;
    }
    var buttons = Update([
      [
        {type: 'Save', callback: this.save, command:'save',icon:'fa fa-floppy-o'}
      ],
      [
        {type: 'Callback', callback:this.toggleEditable,state:'preview',icon:'fa fa-search'}
      ],
      [
        {type: 'Callback', callback:this.toggleCodeView,state:'codeView',icon:'fa fa-code'}
      ],
      [
        {type: 'Font', command:'font',icon:'fa fa-font'}
      ],
      [
        {command:'bold',icon:'fa fa-bold'},
        {command:'italic',icon:'fa fa-italic'},
        {command:'strikethrough',icon:'fa fa-strikethrough'},
        {command:'underline',icon:'fa fa-underline'}
      ],
      [
        {command:'justifyLeft',icon:"fa fa-align-left"},
        {command:'justifyCenter',icon:"fa fa-align-center"},
        {command:'justifyRight',icon:"fa fa-align-right"},
        {command:'justifyFull',icon:"fa fa-align-justify"}
      ],
      [
        {command:'insertOrderedList',icon:'fa fa-list-ol'},
        {command:'insertUnorderedList',icon:'fa fa-list-ul'}
      ],
      [
        {command:'indent',icon:'fa fa-indent'},
        {command:'outdent',icon:'fa fa-outdent'}
      ],
      [
        {type:'Link',command:'createLink',icon:'fa fa-link'}
      ],
      [
        {type:'Iframe'}
      ]
    ],
    {$push: newButtons}
    )

    this.setState({buttons:buttons});

  },
  componentDidMount: function(){
    this.refs.content.getDOMNode().innerHTML = this.props.contents || this.props.children
  },
  mapButtons: function(button){
    if(Lodash.isArray(button)){
      return <div className="wysiwyg-toolbar-group">{button.map(this.mapButtons)}</div>;
    }
    if(typeof(button.type)!=='undefined'){
      if(typeof(window['WysiwygButton'+button.type])=='undefined') return;
      if(button.type=='Callback'){
        return React.createElement(window['WysiwygButton'+button.type], Update(button,{$merge: {preview:this.state.preview,codeView:this.state.codeView,state:this.state[button.state]}}));
      }
      return React.createElement(window['WysiwygButton'+button.type], Update(button,{$merge: {preview:this.state.preview,codeView:this.state.codeView}}));
    }
    return <WysiwygButton command={button.command} preview={this.state.preview} codeView={this.state.codeView} icon={button.icon} />
  },
  toggleableAction: function(type,e){
    var node = e.target;
    if(node.nodeName=='I'){
      node = node.parentNode;
    }

    node.className = (node.className=='active') ? '' : 'active';
    document.execCommand(type,false,null);
  },
  handleKeyDown: function(e){
    var keyCode = e.keyCode || e.which
    if(keyCode==9){
      e.preventDefault();
      e.stopPropagation();
      if(e.shiftKey){
        document.execCommand('styleWithCSS',false,null);
        document.execCommand('outdent',false,null);
      } else {
        document.execCommand('styleWithCSS',false,null);
        document.execCommand('indent',false,null);
      }
    } else if(keyCode===13){
      var range = window.getSelection().getRangeAt(0);
      var container = range.commonAncestorContainer;

      if (container.nodeType == 3) {container = container.parentNode;}
      if(container.nodeName!=='BLOCKQUOTE'){
        e.preventDefault();
        e.stopPropagation();
        document.execCommand('insertHTML', false, '<br><br>');
      }
    }
  },
  handleMouseMove: function(e){
    //
    //
    //  Put tooltip code here
    //
    //
    // if(e.target!==this.state.target){
    //   this.setState({target:e.target});
    //   var tooltip = this.refs.tooltip.getDOMNode();
    //   if(e.target.nodeName=='IFRAME'){
    //     tooltip.style.top = e.target.clientHeight+e.target.offsetTop+"px";
    //     tooltip.style.left = e.target.offsetWidth+"px";
    //   } else {
    //     tooltip.style.top = "-1000px";
    //     tooltip.style.left = "-1000px";
    //   }
    // }
  },
  render: function(){
    var buttons = this.state.buttons.map(this.mapButtons);
    var classes = cx({
      "wysiwyg-content":true,
      "code":this.state.codeView
    })
    return (
      <div className="wysiwyg" {...this.props}>
        <div className="wysiwyg-toolbar">
          {buttons}
        </div>
        <p ref="content" onMouseMove={this.handleMouseMove} onKeyDown={this.handleKeyDown} className={classes} contentEditable={!this.state.preview}></p>
      </div>
    )
  }
})