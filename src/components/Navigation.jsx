/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
// import { NavLink } from 'react-router-dom';
import axios from 'axios';

import $ from 'jquery';
import './css/navbar.css';

class Navigation extends Component {
    state = {
        user: '',
        headshot: "/image/member/demo.png"
    }
    render() {
        return (
            <div className="topnav" id="myTopnav">
                <a href="/forum" id="forum">討論區</a>
                <a href={this.state.user} id="member">會員中心</a>
                <a href="https://github.com/Ming-HC/Side_Project_Demo" to="/contact" id="github">MyGitHub</a>
                <a href={this.state.user} id="membericon" className="split" onClick={this.logout}>
                    <img src={this.state.headshot} alt="Member Icon" />
                </a>
                <a href="#" className="icon" onClick={(e) => { this.navbar(e) }}>
                    <i className="fa fa-bars"></i>
                </a>
            </div>
        );
    }
    async componentDidMount() {
        var newState = { ...this.state };
        var prevScrollpos = window.pageYOffset;
        window.onscroll = function () {
            var currentScrollPos = window.pageYOffset;
            if (prevScrollpos > currentScrollPos) {
                document.getElementById("myTopnav").style.top = "0";
            } else {
                // document.getElementById("myTopnav").style.top = `-${Math.ceil(Number($('#myTopnav').css('height').split('px')[0]))}px`
                document.getElementById("myTopnav").style.top = `-54px`;
            }
            prevScrollpos = currentScrollPos;
        }
        if (window.location.pathname.indexOf('forum') > -1) {
            $('#forum')[0].className = "active";
            $('#member')[0].className = "";
        } else if (window.location.pathname.indexOf('member') > -1) {
            $('#forum')[0].className = "";
            $('#member')[0].className = "active";
        }
        var chkmemberresult = await axios.get('https://ejs.mingspace.website/member/statechk', { withCredentials: true });
        // var chkmemberresult = await axios.get('https://forum-server-qy2ufzf3yq-de.a.run.app/member/statechk', { withCredentials: true });
        // var chkmemberresult = await axios.get('http://localhost:8080/member/statechk', { withCredentials: true });
        newState.user = chkmemberresult.data;
        if (newState.user.indexOf("login") === -1) {
            var headshotresult = await axios.get('https://ejs.mingspace.website/member/navbar_headshot', { withCredentials: true });
            // var headshotresult = await axios.get('https://forum-server-qy2ufzf3yq-de.a.run.app/member/navbar_headshot', { withCredentials: true });
            // var headshotresult = await axios.get('http://localhost:8080/member/navbar_headshot', { withCredentials: true });
            newState.headshot = headshotresult.data ? headshotresult.data.indexOf("headshot") === -1 ? headshotresult.data : `/image/member/upload/headshot/${headshotresult.data}` : "/image/member/demo.png";
        }
        this.setState(newState);
    }
    navbar = (e) => {
        e.preventDefault();
        var x = document.getElementById("myTopnav");
        if (x.className === "topnav") {
            x.className += " responsive";
            $(x).css('display', 'block');
            $(x).css('position', 'fixed');
            $('#membericon').css('display', 'none');
        } else {
            x.className = "topnav";
            $(x).css('display', 'flex');
            $('#membericon').css('display', 'inline-block');
        }
    }
    logout = async (e) => {
        e.preventDefault();
        if ($('#membericon').prop('href').indexOf('login') === -1) {
            var hint = '是否登出?';
            if (window.confirm(hint) === true) {
                var logoutresult = axios.post(`https://forum-server-qy2ufzf3yq-de.a.run.app${this.state.user.split('/personal')[0]}/logout`);
                // var logoutresult = await axios.post(`http://localhost:8080${this.state.user.split('/personal')[0]}/logout`, { withCredentials: true });
                if (logoutresult.data) {
                    var newState = {...this.state};
                    newState.user = '';
                    newState.headshot = "/image/member/demo.png";
                    console.log(newState);
                    this.setState(newState);
                    // window.location.reload();
                }
            }
        } else {
            window.location.href = '/member/login';
        }
    }
}

export default Navigation;