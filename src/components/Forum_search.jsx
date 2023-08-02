import React, { Component } from 'react';
import axios from 'axios';
import $ from 'jquery';
import Forumfooter from './Forum_footer';
import styles from './css/forum_search.module.css';
class ForumSearch extends Component {
    state = {
        postlist: [],
        page: 1
    }
    render() {
        return (
            <div className={`container ${styles.container}`}>
                <div className={styles.search_post}>
                    <div className={`searchResult_div ${styles.searchResult_div}}`}>
                        <span>搜尋結果：</span>
                        <span className={`searchResult ${styles.searchResult}`}></span>
                    </div>
                    <div className={`search ${styles.search}`}>
                        <input type="text" placeholder="請輸入搜尋內容" />
                        <select className={`search_select ${styles.search_select}`}>
                            <option value="all">簡易搜尋</option>
                            <option value="title">標題</option>
                            <option value="content">內文</option>
                        </select>
                        <button id="search_submit" className={styles.search_submit} onClick={this.searchsub}>搜尋</button>
                    </div>
                </div>
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
                <Forumfooter />
            </div>
        );
    }
    async componentDidMount() {
        if (sessionStorage.getItem('select_target') && sessionStorage.getItem('select_content')) {
            this.search();
        }
    }
    search = async (req) => {
        var newState = { ...this.state };
        var url = window.location.pathname;
        if (req) {
            sessionStorage.setItem('select_target', $('.search_select').val());
            sessionStorage.setItem('select_content', $('.search>input').val());
        }
        $('.search_select').val(sessionStorage.getItem('select_target'));
        $('.search>input').val(sessionStorage.getItem('select_content'));
        var dataToServer = {
            select_target: $('.search_select').val(),
            select_content: $('.search>input').val()
        }
        var searchresults = await axios.post('https://ejs.mingspace.website' + url, dataToServer);
        // var searchresults = await axios.post('https://forum-server-qy2ufzf3yq-de.a.run.app' + url, dataToServer);
        $(".searchResult").text(`${$('.search>input').val()}，共 ${searchresults.data.reslength} 筆。`)
        $.each(searchresults.data.postlist, (index, item) => {
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
        newState.postlist = searchresults.data.postlist;
        newState.page = searchresults.data.page;
        this.setState(newState);

        $('.page').html('');
        if (searchresults.data.page === 1) {
            $('.page').append(`<span>1</span>`)
        } else {
            for (let i = 1; i <= searchresults.data.page; i++) {
                if (Number(url.split("/").reverse()[0]) === i || (url.split("/").reverse()[0] === "search" && i === 1)) {
                    
                    $('.page').append(`<span>${i}</span>`)
                } else {
                    $('.page').append(`<a href="/forum/search/${i}"><span>${i}</span></a>`);
                }
            }
        }
    }
    searchsub = (e) => {
        if (e.target.parentNode.querySelector('input').value !== "") {
            this.search("reset");
        } else {
            e.target.parentNode.querySelector('input').focus();
        }
    }
}

export default ForumSearch;