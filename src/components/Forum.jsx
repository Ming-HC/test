import React, { Component } from 'react';
import axios from 'axios';

import Forumfooter from './Forum_footer';

// import './css/forum.css';
import styles from './css/forum.module.css';
import 'font-awesome/css/font-awesome.min.css';

class Forum extends Component {
    state = {
        class: [],
        postlist: []
    }
    render() {
        return (
            <section>
                <div className={`container ${styles.container}`}>
                    <div className={styles.search_post}>
                        <div className={styles.post}>
                            <a href="/forum/view/newpost"><label>發佈文章</label></a>
                        </div>
                        <div className={styles.search}>
                            <input type="text" placeholder="請輸入搜尋內容" />
                            <select className={styles.search_select}>
                                <option value="all">簡易搜尋</option>
                                <option value="title">標題</option>
                                <option value="content">內文</option>
                            </select>
                            <button id="search_submit" onClick={this.searchsub}>搜尋</button>
                        </div>
                    </div>
                    <ul className={`${styles.subject} nav nav-tabs`} id={styles.myTab} role="tablist">
                        {this.state.class.map((classItem, index) =>
                            <li className='nav-item' key={classItem.class_name_eng}>
                                <a className={window.location.pathname === "/forum" && index === 0 ? `nav-link ${styles.active}` : window.location.pathname.indexOf(classItem.class_name_eng) > -1 ? `nav-link ${styles.active}` : "nav-link"}
                                    id={`${classItem.class_name_eng}-tab`} data-toggle="tab" href={`/forum/${classItem.class_name_eng}`} role="tab" aria-controls={`${classItem.class_name_eng}`}
                                    aria-selected="true">{classItem.class_name}</a>
                            </li>
                        )}
                    </ul>
                    <div id={styles.postResult}>
                        {this.state.postlist.map(Item =>
                            <div key={`post_${Item.post_id}`}>
                                <div><label>{Item.class_name}</label></div>
                                <div><img src={Item.imageurl ? "/image/forum/upload/" + Item.imageurl : "/image/forum/demo.png"} alt={Item.imageurl ? Item.imageurl : "demo.png"} /></div>
                                <div><a href={`/forum/post/${Item.post_id}`}><label>{Item.title}</label></a>
                                    <label>{Item.content}</label></div>
                                <div>
                                    <div><label>{Item.user}</label></div>
                                    <div className={styles.views_reply_div}>
                                        <div className={styles.views}><i className="fa fa-eye"></i><label>{Item.views}</label></div>
                                        <div className={styles.reply}><i className="fa fa-comments-o"></i><label>{Item.reply}</label></div>
                                    </div>
                                </div>
                                <div><label>{Item.latestReply_user}</label><label>{Item.latestReply_time_format}</label></div>
                            </div>
                        )}
                    </div>
                </div>
                <Forumfooter />
            </section>
        );
    }
    async componentDidMount() {
        var classresult = await axios.post('https://ejs.mingspace.website/forum/getclass');
        // var classresult = await axios.post('https://forum-server-qy2ufzf3yq-de.a.run.app/forum/getclass');
        var postlisturl = "";
        switch (window.location.pathname.split("/").length) {
            case 2:
                postlisturl = "/forum/all/1";
                break;
            case 3:
                postlisturl = window.location.pathname + "/1";
                break;
            case 4:
                postlisturl = window.location.pathname;
                break;
            default:
                break;
        }
        var postlistresult = await axios.get('https://ejs.mingspace.website' + postlisturl + '/getpost');
        // var postlistresult = await axios.get('https://forum-server-qy2ufzf3yq-de.a.run.app' + postlisturl + '/getpost');
        var newState = { ...this.state };
        newState.class = classresult.data;
        postlistresult.data.postlist.forEach((item) => {
            var postd = new Date(item.latestReply_time_format);
            var d = new Date();
            var posttime = (d - postd) / 1000;
            if (posttime < 60) {
                item.latestReply_time_format = `1分內`;
            } else if (posttime < (60 * 60)) {
                item.latestReply_time_format = `${Math.floor(posttime / 60)}分前`;
            } else if (posttime < (60 * 60 * 24)) {
                item.latestReply_time_format = `${Math.floor(posttime / 60 / 60)}小時前`;
            } else if (posttime >= (60 * 60 * 24)) {
                item.latestReply_time_format = `${Math.floor(posttime / 60 / 60 / 24)}天前`;
            }
        })
        newState.postlist = postlistresult.data.postlist;
        this.setState(newState);
    }
    searchsub = (e) => {
        if (e.target.parentNode.querySelector('input').value !== "") {
            sessionStorage.setItem('select_target', e.target.parentNode.querySelector('select').value);
            sessionStorage.setItem('select_content', e.target.parentNode.querySelector('input').value);
            window.location.href = "/forum/search"
        } else {
            e.target.parentNode.querySelector('input').focus();
        }

    }
}

export default Forum;