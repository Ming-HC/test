import React, { Component } from 'react';
import axios from 'axios';

// import './css/login_register.css';
import styles from './css/login_register.module.css';
import $ from 'jquery';

class LoginRegister extends Component {
    state = {
        url: 'login'
    }
    render() {
        return (
            <section>
                <div className={`container ${styles.container}`}>
                    <div className={styles.header}>
                        <div onClick={this.chkstate}><label>註冊</label></div>
                        <div onClick={this.chkstate}><label>登入</label></div>
                    </div>
                    <div className={styles.imgcontainer}>
                        <img src="/image/member/demo.png" alt="Avatar" />
                    </div>
                    <div className="formResult" id="<%= url %>">
                        {this.state.url === 'login' ?
                            <form className="row">
                                <div className={styles.input_info}>
                                    {/* <script src="https://accounts.google.com/gsi/client" async defer></script>
                                    <div id="g_id_onload" data-client_id="579958787486-c73jlvvk6p4oja02bvbllvelq59alkip.apps.googleusercontent.com"
                                        data-callback="onSignIn2"></div>
                                    <div className="g_id_signin" data-type="standard"></div> */}

                                    <div className={styles.inputdiv}>
                                        <label htmlFor="uname" className="form-label"><b>使用者名稱：</b></label>
                                        <input type="text" placeholder="Enter Username" id="uname" className="form-control" required />
                                    </div>
                                    <div className={styles.inputdiv}>
                                        <label htmlFor="psw"><b>密碼：</b></label>
                                        <input type="password" placeholder="Enter Password" id="psw" className={`form-control ${styles.psw}`} required />
                                        <label></label>
                                    </div>
                                    <input type="submit" value="登入" className={styles.btn} onClick={this.loginsub} />
                                </div>
                            </form>
                            :
                            <form action="https://ejs.mingspace.website/member/upload_headshot" method="post" encType="multipart/form-data" className="row">
                            {/* <form action="https://forum-server-qy2ufzf3yq-de.a.run.app/member/upload_headshot" method="post" encType="multipart/form-data" className="row"> */}
                                <div className={styles.input_info}>
                                    <div>
                                        <label><b>大頭貼：</b></label>
                                        <input type="file" name="headshot" className="form-control" onChange={this.showheadshot} />
                                    </div>
                                    <div>
                                        <label><b>使用者名稱：</b></label>
                                        <input type="text" placeholder="Enter Username" name="uname" className="form-control is-invalid" onKeyUp={this.RegexChkUname} onBlur={this.ChkUname} required />
                                        <label>請輸入6-12個英數字</label><br />
                                    </div>
                                    <div>
                                        <label><b>密碼：</b></label>
                                        <input type="password" placeholder="Enter Password" name="psw" className="form-control is-invalid" onKeyUp={this.RegexChkUname} required />
                                        <label>請輸入6-12個英數字</label>
                                    </div>
                                    <input type="button" value="註冊" className={styles.sub} onClick={this.registersub} />
                                </div>
                            </form>
                        }
                    </div>
                </div>
            </section>
        );
    }
    async componentDidMount() {
        var newState = { ...this.state };
        var url = 'login';
        if (window.location.pathname.indexOf('login') > -1) {
            url = 'login';
        } else if (window.location.pathname.indexOf('register') > -1) {
            url = 'register';
        }
        var login_signup_button = document.querySelectorAll('.container div div');
        var login_signup_label = document.querySelectorAll('.container div div label');
        if (url === 'login') {
            login_signup_button[0].style.borderBottom = '5px solid lightgray';
            login_signup_label[0].style.color = 'lightgray';
            login_signup_button[1].style.borderBottom = '5px solid coral';
            login_signup_label[1].style.color = 'black';
            newState.url = 'login';
        } else if (url === 'register') {
            login_signup_button[0].style.borderBottom = '5px solid coral';
            login_signup_label[0].style.color = 'black';
            login_signup_button[1].style.borderBottom = '5px solid lightgray';
            login_signup_label[1].style.color = 'lightgray';
            newState.url = 'register';
        }
        this.setState(newState);
    }
    chkstate = (e) => {
        var login_signup_pagechk = 'login';
        console.log(e.target.tagName);
        console.log($(e.target.parentNode));
        if (e.target.tagName === 'LABEL') {
            if ($(e.target.parentNode).find('label').text() === '登入') {
                login_signup_pagechk = '/member/login';
                window.location.href = login_signup_pagechk;
            } else if ($(e.target.parentNode).find('label').text() === '註冊') {
                login_signup_pagechk = '/member/register';
                window.location.href = login_signup_pagechk;
            }
        } else {
            if ($(e.target).find('label').text() === '登入') {
                login_signup_pagechk = '/member/login';
                window.location.href = login_signup_pagechk;
            } else if ($(e.target).find('label').text() === '註冊') {
                login_signup_pagechk = '/member/register';
                window.location.href = login_signup_pagechk;
            }
        }
    }
    RegexChkUname = (e) => {
        if (e.target.value !== "") {
            var inputvalue = e.target.value;
            var pattern = /^[A-Za-z0-9]{6,12}$/;
            if (inputvalue.match(pattern)) {
                e.target.parentNode.querySelector('input+label').innerText = "";
                $(e.target).prop('class', 'form-control is-valid');
            } else {
                e.target.parentNode.querySelector('input+label').style.color = 'red';
                e.target.parentNode.querySelector('input+label').innerText = "請輸入6-12個英數字";
                $(e.target).prop('class', 'form-control is-invalid');
            }
        } else {
            $(e.target).prop('class', 'form-control is-invalid');
        }
    }
    ChkUname = async () => {
        if ($('input[name=uname]').val() !== "" && $('input[name=uname]').prop('class').indexOf('is-valid') > -1) {
            var dataToServer = {
                username: $('input[name=uname]').val()
            }
            var chkunameresult = await axios.post('https://ejs.mingspace.website/member/chkuser/memberchk', dataToServer);
            // var chkunameresult = await axios.post('https://forum-server-qy2ufzf3yq-de.a.run.app/member/chkuser/memberchk', dataToServer);

            if (chkunameresult.data.indexOf("can't") > -1) {
                $('input[name=uname]+label').css('color', 'red');
                $('input[name=uname]').prop('class', 'form-control is-invalid');
            } else {
                $('input[name=uname]+label').css('color', 'green');
                $('input[name=uname]').prop('class', 'form-control is-valid');
            }
            $('input[name=uname]+label').text(chkunameresult.data);
        } else {
            $('input[name=uname]').prop('class', 'form-control is-invalid');
            $('input[name=uname]+label').text("請輸入6-12個英數字");
        }
    }
    registersub = () => {
        if (this.state.url === 'register' && $('input[name=uname]').prop('class').indexOf('is-valid') > -1 && $('input[name=psw]').prop('class').indexOf('is-valid') > -1) {
            this.postheadshot();
        }
    }
    showheadshot = (e) => {
        var img = document.querySelector('.container img');
        if ($('input[type=file]').val() !== "") {
            img.src = window.URL.createObjectURL(e.target.files[0]);
            img.onload = function (e) {
                window.URL.revokeObjectURL(e.target.src);
            }
        } else {
            img.src = "/image/member/demo.png";
        }
    }
    postheadshot = async () => {
        if ($("input[type=file]")[0].files.length && this.state.url === 'register') {
            var data = new FormData();
            $.each($("input[type=file]")[0].files, function (i, file) {
                data.append('headshot', file);
            })
            var uploadheadshotresult = await axios.post('https://ejs.mingspace.website/member/upload_headshot', data);
            // var uploadheadshotresult = await axios.post('https://forum-server-qy2ufzf3yq-de.a.run.app/member/upload_headshot', data);
            if (uploadheadshotresult.data.indexOf('\\') > -1) {
                $('.imgcontainer img').prop('src', `/image/member/upload/headshot/${uploadheadshotresult.data.split('headshot\\')[1]}`);
                this.postRegister(uploadheadshotresult.data.split('headshot\\')[1]);
            } else {
                $('.imgcontainer img').prop('src', `/image/member/upload/headshot/${uploadheadshotresult.data.split('headshot/')[1]}`);
                this.postRegister(uploadheadshotresult.data.split('headshot/')[1]);
            }
        } else if (this.state.url === 'register') {
            this.postRegister();
        }
    }
    postRegister = async (headshot) => {
        if (this.state.url === 'register') {
            $('input[name=psw]').val(window.btoa($('input[name=psw]').val()));
            var dataToServer = {
                username: $('input[name=uname]').val().toLowerCase(),
                password: $('input[name=psw]').val(),
                headshot: headshot
            }
            var registerresult = await axios.post('https://ejs.mingspace.website/member/register/memberchk', dataToServer);
            // var registerresult = await axios.post('https://forum-server-qy2ufzf3yq-de.a.run.app/member/register/memberchk', dataToServer);
            if (registerresult.data.indexOf('Success') > -1) {
                $('input[name=psw]+label').text(registerresult.data + ' 5秒後跳轉至登入頁.');
                setTimeout(() => { window.location.href = 'login'; }, 5000);
            } else {
                $('input[name=psw]+label').text(registerresult.data);
            }
        }
    }
    loginsub = async (e) => {
        if ($('#uname').val() && $('#psw').val()) {
            if (this.state.url === 'login') {
                e.preventDefault();
                var dataToServer = {
                    username: $('#uname').val().toLowerCase(),
                    password: $('#psw').val()
                }
                var loginresult = await axios.post('https://ejs.mingspace.website/member/login/memberchk', dataToServer, { withCredentials: true });
                // var loginresult = await axios.post('https://forum-server-qy2ufzf3yq-de.a.run.app/member/login/memberchk', dataToServer, { withCredentials: true });
                // var loginresult = await axios.post('http://localhost:8080/member/login/memberchk', dataToServer, { withCredentials: true });
                
                if (loginresult.data.account) {
                    if (loginresult.data.headshot) {
                        $('.container img, #membericon img').prop('src', `/image/member/upload/headshot/${loginresult.data.headshot}`);
                    }
                    $('#uname').prop('class', 'form-control is-valid');
                    $('#psw').prop('class', 'form-control is-valid');
                    $('#psw+label').css('color', 'green');
                    $('#psw+label').text('Login Success, 5秒後跳轉頁面.');
                    if (document.referrer.indexOf('register') > -1) {
                        if (loginresult.data.logined_times < 1) {
                            setTimeout(() => { window.location.href = `/member/${loginresult.data.account}/personal`; }, 5000);
                        } else {
                            setTimeout(() => { window.location.href = `/`; }, 5000);
                        }
                    } else if (document.referrer === "" || document.referrer.indexOf('login') > -1) {
                        if (loginresult.data.logined_times < 1) {
                            setTimeout(() => { window.location.href = `/member/${loginresult.data.account}/personal`; }, 5000);
                        } else {
                            setTimeout(() => { window.location.href = '/'; }, 5000);
                        }
                    } else if (document.referrer.indexOf('/logout') > -1) {
                        if (loginresult.data.logined_times < 1) {
                            setTimeout(() => { window.location.href = `/member/${loginresult.data.account}/personal`; }, 5000);
                        } else {
                            setTimeout(() => { window.location.href = '/'; }, 5000);
                        }
                    } else {
                        setTimeout(() => { window.location.href = document.referrer; }, 5000);
                    }
                } else {
                    $('#uname').prop('class', 'form-control is-invalid');
                    $('#psw').prop('class', 'form-control is-invalid');
                    $('#psw+label').css('color', 'red');
                    $('#psw+label').text(loginresult.data);
                }
            }
        } else {
            $('#psw+label').text('請輸入使用者名稱及密碼');
        }
    }
}

export default LoginRegister;