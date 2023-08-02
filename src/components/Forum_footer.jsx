import React, { Component } from 'react';
import axios from 'axios';

import './css/forum_footer.css';

import $ from 'jquery';

class Forumfooter extends Component {
    state = {
        url: window.location.pathname,
        page: [1],
        randompost: [],
        flag: 1
    }
    render() {
        return (
            <section>
                <div className="page">
                    {this.state.page.map((item) => {
                        var pattern = /\d+/;
                        var classname = this.state.url.split("/").reverse()[1] !== "" ? pattern.test(this.state.url.split("/").reverse()[0]) ? this.state.url.split("/").reverse()[1] : this.state.url.split("/").reverse()[0] : "all";
                        var ele = [];
                        if (this.state.url.split('/').length > 2) {
                            for (let i = 1; i <= this.state.page[0]; i++) {
                                if (Number(this.state.url.split("/").reverse()[0]) === i) {
                                    ele.push(<span key={i}>{i}</span>);
                                } else {
                                    ele.push(<a href={`/forum/${classname}/${i}`} key={i}><span>{i}</span></a>)
                                }
                            }
                        }
                        return ele;
                    })
                    }
                </div>
                <div className="random_recommend">
                    <div className="outsidediv">
                        <div>
                            <span>文章 - 隨機推薦</span>
                        </div>
                        <div className="insidediv">
                            {this.state.randompost.map(item =>
                                <a key={item.post_id} className="img_block" href={`/forum/post/${item.post_id}`}><img src={item.imageurl ? "/image/forum/upload/" + item.imageurl : "/image/forum/demo.png"} alt={item.title} /><div className="img_tip">{item.title}</div></a>
                            )}
                        </div>
                        <i className="fa fa-angle-left prevbtn scrollbtn" onClick={this.scrollbtn}></i>
                        <i className="fa fa-angle-right nextbtn scrollbtn" onClick={this.scrollbtn}></i>
                    </div>
                </div>
            </section>
        );
    }
    async componentDidMount() {
        var randompost_result = await axios.get('https://ejs.mingspace.website/forum/get_randompost');
        // var randompost_result = await axios.get('https://forum-server-qy2ufzf3yq-de.a.run.app/forum/get_randompost');
        var newState = { ...this.state };
        newState.randompost = randompost_result.data;
        if (window.location.pathname.indexOf('post') === -1 && window.location.pathname.indexOf('/forum/search') === -1) {
            var url = "";
            switch (window.location.pathname.split("/").length) {
                case 2:
                    url = "/forum/all/1";
                    newState.url = url;
                    break;
                case 3:
                    url = window.location.pathname + "/1";
                    newState.url = url;
                    break;
                case 4:
                    url = window.location.pathname;
                    newState.url = url;
                    break;
                default:
                    break;
            }
            var page_result = await axios.get('https://ejs.mingspace.website' + url + '/getpost');
            // var page_result = await axios.get('https://forum-server-qy2ufzf3yq-de.a.run.app' + url + '/getpost');
            newState.page[0] = page_result.data.page;
        }
        this.setState(newState);
    }
    scrollbtn = (event) => {
        var newState = { ...this.state };
        var scrolltimes = 4;
        if (window.innerWidth > 767) {
            scrolltimes = 4
        } else if (window.innerWidth > 530) {
            scrolltimes = 6
        } else {

        }
        var maxscrollwidth = $('.insidediv')[0].scrollWidth - $('.insidediv')[0].clientWidth;
        var scrollvalue = maxscrollwidth / scrolltimes;
        var targetscroll = $('.insidediv')[0].scrollLeft;
        if (event.target.className.indexOf('nextbtn') > -1 && this.state.flag) {
            newState.flag = 0;
            this.setState(newState);
            $('.insidediv').animate({
                scrollLeft: targetscroll === maxscrollwidth ? 0 : targetscroll + scrollvalue
            }, 800, () => { newState.flag = 1; this.setState(newState); })
        } else if (event.target.className.indexOf('prevbtn') > -1 && this.state.flag) {
            newState.flag = 0;
            this.setState(newState);
            $('.insidediv').animate({
                scrollLeft: targetscroll === 0 ? maxscrollwidth : targetscroll - scrollvalue
            }, 800, () => { newState.flag = 1; this.setState(newState); })
        }
    }
}

export default Forumfooter;