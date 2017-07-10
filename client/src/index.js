import React from 'react';
import ReactDOM from 'react-dom';


//import Using ES6 syntax
import {Popup, Form, FormCell, CellBody, TextArea, Cell, Uploader, Gallery, GalleryDelete} from 'react-weui';

//import styles
import 'weui';
import 'react-weui/lib/react-weui.min.css';


import './index.css';


class Nav extends React.Component {
	render(props) {
		return (
			<div className="nav">
				朋友圈
				<div className="nav-publish" onClick={() => this.props.onClick()} onTouchStart={(e) => this.props.onTouchStart(e)} onTouchEnd={() => this.props.onTouchEnd()}><i className="iconfont icon-publish">&#xe602;</i></div>
			</div>
		);
	}
}

class Header extends React.Component {
	render(props) {
		return (
			<div className="header">
				<div className="desc">
					<span>{this.props.sessionName ? this.props.sessionName : '会话姓名'}</span>
					<div className="head-img">
						<img alt="" src={this.props.sessionHeadImg ? '/head-img/' + this.props.sessionHeadImg : 'http://7xvxmb.com1.z0.glb.clouddn.com/2017-07-09-170709-head-img.png'} />
					</div>
				</div>
			</div>
		);
	}
}

class Content extends React.Component {
	constructor() {
		super();
		this.state = {
			gallery: false,
			isZanShow: []
		};
	}
	renderGallery(){
        if(!this.state.gallery) return false;

        return (
            <Gallery src={this.state.gallery.url} show onClick={ e=> {
                //avoid click background item
                e.preventDefault()
                e.stopPropagation();
                this.setState({gallery: false})
            }}>
            </Gallery>
        )
    }
	renderText(text) {
		if (text && text.length === 0) {
			return null;
		} else {
			return <p className="content-item-text">{text}</p>
		}
	}
	renderBackgroundImg(img) {
		return {backgroundImage: `url(${img.replace('localhost', '192.168.1.3')})`};
	}
	renderImgs(imgs) {
		if (imgs.length === 0) {
			return null;
		} else {
			return (
				<ul className="moments-imgs">
					{imgs.map((img, index) =>
						<li key={index} style={this.renderBackgroundImg(img)} 
						onClick={() => {
							this.setState({
								gallery: {
									url: img.replace('localhost', '192.168.1.3')
								}
							});
						}}
						></li>
					)}
				</ul>
			);
		}
	}
	renderTime(time) {
		let timeInterval = Date.now() - time;
		if (timeInterval < 1000*60*60) {
			return `${Math.ceil(timeInterval/1000/60)}分钟前`;
		} else if (timeInterval < 1000*60*60*24) {
			return `${Math.ceil(timeInterval/1000/60/60)}小时前`;
		} else if (timeInterval < 1000*60*60*24*2) {
			return '昨天';
		} else {
			return `${Math.ceil(timeInterval/1000/60/60/24)}天前`;
		}
	}
	renderZan(index, zan) {
		if (!this.state.isZanShow[index]) return null;
		let isZan;
		if (zan) {
			isZan = zan.some((item) => {
				return item.sessionId === this.props.sessionId;
			});
		} else {
			isZan = false;
		}
		return (
			<div className="social-display">
				<span onClick={() => {
					this.props.onClickZan(index);
					this.setState({
						isZanShow: []
					});
				}}><i className="iconfont">&#xe60b;</i>{isZan ? '取消' : '赞'}</span>
			</div>
		);
	}
	renderByZan(zan) {
		if (!zan || zan.length === 0) return null;
		const zanlist = zan.map((item, i) => {
			if (i===0) {
				return (
					<span key={i}>
						<span className="zan-icon"><i className="iconfont">&#xe60b;</i></span>
						<span>{item.name}</span>					
					</span>
				);
			}
			return (
				<span key={i}>
					<span>, </span>
					<span>{item.name}</span>					
				</span>
			);
		});
		return (
			<div className="zan-list">{zanlist}</div>
		);
	}
	render(props) {
		const contentLists = this.props.contentLists;
		const moments = contentLists.map((item, index, array) => {
			if ((item.text === '' || !item.text) && (item.imgUrls.length === 0)) return null;
			return (
				<li key={item._id} className="content-item">
					<div className="content-item-head-img">
						<img alt="" src={item.headImg ? '/head-img/' + item.headImg : 'http://7xvxmb.com1.z0.glb.clouddn.com/2017-07-09-170709-head-img.png'} />
					</div>

					<div className="content-item-wrapper">
						<p className="content-item-name">{item.name ? item.name : '姓名'}</p>
						{this.renderText(item.text)}
						{this.renderImgs(item.imgUrls)}
						<p className="content-item-time">{this.renderTime(item.publishTime)}</p>
						<div className="content-item-social">
							<i onClick={() => {
								let isZanShow = [];
								isZanShow[index] = this.state.isZanShow[index] ? false : true;
								this.setState({
									isZanShow: isZanShow
								});
							}} className="iconfont">&#xe603;</i>
							{this.renderZan(index, item.zan)}
						</div>
					</div>
					{this.renderByZan(item.zan)}
				</li>
			);			
		});
		return (
			<div className="content">
				{ this.renderGallery() }
				<ul>{moments}</ul>
			</div>
		);
	}
}

class Publish extends React.Component {
	render(props) {
		return (
			<div>
				<div className="nav-publish-imgs">
					发表文字
					<button className="cancel" onClick={() => this.props.onClickCancel()}>取消</button>
                	<button className="submit" disabled={this.props.isNull} onClick={() => this.props.onClick()}>发送</button>
				</div>
				<Form>
	                <FormCell>
	                    <CellBody>
	                        <TextArea value={this.props.currentText} rows="7" onChange={(e) => {this.props.onChange(e)}}></TextArea>
	                    </CellBody>
	                </FormCell>
	            </Form>
			</div>
		);
	}
}

class PublishImg extends React.Component {

	constructor() {
		super();
		this.state = {
			gallery: false
		};
	}

	renderGallery(){
        if(!this.state.gallery) return false;

        return (
            <Gallery src={this.state.gallery.url} show onClick={ e=> {
                //avoid click background item
                e.preventDefault()
                e.stopPropagation();
                this.setState({gallery: false})
            }}>
                <GalleryDelete onClick={ ()=> {
                	// console.log(this.state.gallery);
                	this.props.onDeleteGallery(this.state.gallery.id);
                }} />
            </Gallery>
        )
    }

	render(props) {
		return (
			<div>
				{ this.renderGallery() }
				<div className="nav-publish-imgs">
					<button className="cancel" onClick={() => this.props.onClickCancel()}>取消</button>
                	<button className="submit" disabled={this.props.isNull} onClick={() => this.props.onPublish()}>发送</button>
				</div>
				<Form>
					<Cell>
						<CellBody>
	                        <TextArea placeholder="这一刻的想法..." showCounter={false} value={this.props.currentText} rows="4" onChange={(e) => {this.props.onChange(e)}}></TextArea>
	                    </CellBody>
                    </Cell>
                    <Cell>
                        <CellBody>
                            <Uploader
                                title=""
                                maxWidth={750}
                                maxCount={9}
                                files={this.props.currentImgFiles}
                                onError={msg => alert(msg)}
                                onChange={(file,e) => {
                                	this.props.onChangeImg(file, e);
                                	// console.log('change');                            
                                }}
                                lang={{
                                    maxError: maxCount => `最多上传${maxCount}张照片`
                                }}
                                onFileClick={
                                    (e, file, i) => {
                                        // console.log('file click', file, i)
                                        this.setState({
                                            gallery: {
                                                url: file.url,
                                                id: i
                                            }
                                        })
                                    }
                                }
                            />
                        </CellBody>
                    </Cell>
                </Form>                
			</div>
		);
	}
}

class App extends React.Component{
	constructor() {
		super();
		this.state = {
			isPublish: false,
			isPublishImg: false,
			currentText: '',
			currentImgFiles: [],
			currentImgUrls: [],
			contents: [],
			sessionName: '',
			sessionHeadImg: '',
			sessionId: ''
		};
		this.getContent = this.getContent.bind(this);
	}

	getContent() {
		fetch('/wechat-moments/get', {credentials: 'include'})
		.then(response => response.json())
		.then(data => {
			this.setState({
				contents: data.contents,
				sessionName: data.name,
				sessionHeadImg: data.headImg,
				sessionId: data.sessionId
			});
		})
	}

	postImg(data) {
		return fetch('/wechat-moments/post-img', { method: 'POST', body: data})
		.then(response => response.text());
	}

	postText() {
		const publishText = {
			'text': this.state.currentText,
			'imgs': this.state.currentImgUrls
		};		
		const myHeaders = new Headers({
			'Content-Type': 'application/json'
		});
		fetch('/wechat-moments/text', { method: 'POST', credentials: 'include', headers: myHeaders, body: JSON.stringify(publishText) })
		.then(() => {
			this.setState({
				isPublish: false,
				isPublishImg: false,
				currentText: '',
				currentImgUrls: [],
				currentImgFiles: []
			});			
		})
		.then(() => {
			this.getContent();
		});
	}

	componentDidMount() {
		this.getContent();
	}

	postZan(params) {
		console.log(params);
		const myHeaders = new Headers({
			'Content-Type': 'application/json'
		});
		fetch('/wechat-moments/zan', {method: 'POST', credentials: 'include', headers: myHeaders, body: JSON.stringify(params)})
		.then(response => response.text())
		.then(text => {
			console.log(text);
		});
	}

	render() {
		let timeoutEvent;
		return (
			<div>
				<Nav onClick={() => {
					this.setState({
						isPublishImg: true
					});
				}}
				onTouchStart={(e) => {
					e.preventDefault()
                	e.stopPropagation();	
					timeoutEvent =  setTimeout(() => {						
						this.setState({
							isPublish: true
						});
					}, 500);
				}}
				onTouchEnd={() => {
					clearTimeout(timeoutEvent);
					this.setState({
						isPublishImg: !this.state.isPublish
					});
				}}
				/>

				<Header sessionName={this.state.sessionName} sessionHeadImg={this.state.sessionHeadImg} />

				<Content contentLists={this.state.contents}
				sessionId={this.state.sessionId}
				onClickZan={(index) => {
					let contents = this.state.contents.slice();
					!contents[index].zan && (contents[index].zan = []);
					let isZanExist = contents[index].zan.some((item) => {
						return item.sessionId === this.state.sessionId;
					});
					let fetchParams;
					if (isZanExist) {
						contents[index].zan = contents[index].zan.filter((item) => {
							return item.sessionId !== this.state.sessionId;
						});
						fetchParams = {
							_id: contents[index]._id,
							sessionId: this.state.sessionId,
							sessionName: this.state.sessionName,
							opera: 'delete'
						};
					} else {
						contents[index].zan.push({
							sessionId: this.state.sessionId,
							name: this.state.sessionName
						});
						fetchParams = {
							_id: contents[index]._id,
							sessionId: this.state.sessionId,
							sessionName: this.state.sessionName,
							opera: 'insert'
						};
					}
					this.setState({
						contents: contents
					});
					this.postZan(fetchParams);
				}}
				/>

				<Popup show={this.state.isPublish}>
					<div style={{height: '100vh', overflow: 'scroll'}}>
						<Publish onClick={() => {
							this.postText();
						}}
						onClickCancel={() => {
							this.setState({
								isPublish: false,
								currentText: ''
							});
							// console.log('cancel');
						}}
						onChange={(e) => {
							this.setState({
								currentText: e.target.value
							});
						}}
						isNull={this.state.currentText.length === 0 ? true : false}
						currentText={this.state.currentText}
						/>
					</div>
				</Popup>

				<Popup show={this.state.isPublishImg}>
					<div style={{height: '100vh', overflow: 'scroll'}}>
						<PublishImg onClickCancel={() => {
							this.setState({
								isPublishImg: false,
								currentImgFiles: [],
								currentText: ''
							});
							// console.log('cancel');
						}}
						onChangeImg={(file, e) => {
							// console.log(file.data);
							let currentImgFiles = [...this.state.currentImgFiles, { url: file.data }];
							this.setState({
                                currentImgFiles: currentImgFiles
                            });
						}}
						currentImgFiles={this.state.currentImgFiles}
						onDeleteGallery={(id) => {
							// console.log('onDeleteGallery');
							let currentImgFiles = this.state.currentImgFiles;
							currentImgFiles = currentImgFiles.filter((item, index) => index !== id);
							this.setState({
                                currentImgFiles: currentImgFiles
                            });
						}}
						onPublish={() => {
							this.setState({
								isPublishImg: false
							});
							let postAllImg = this.state.currentImgFiles.map((item) => {
								return this.postImg(item.url);
							});
							Promise.all(postAllImg).then((texts) => {
								this.setState({
									currentImgUrls: texts
								});
							})
							.then(() => {
								this.postText();
							});
						}}
						isNull={this.state.currentImgFiles.length === 0 ? true : false}
						currentText={this.state.currentText}
						onChange={(e) => {
							this.setState({
								currentText: e.target.value
							});
						}}
						/>
					</div>
				</Popup>


			</div>
		);
	}
}

ReactDOM.render(<App />, document.getElementById('root'));