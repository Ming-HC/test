import axios from 'axios';
import React, { Component } from 'react';
import styles from './css/member_personal.module.css';
// import $ from 'jquery';

class MemberPersonal extends Component {
    state = {
        memberinfo: []
    }
    render() {
        return (
            <div className={`container ${styles.container}`}>
                <div className={`personalResult ${styles.personalResult}`}>
                    {this.state.memberinfo.submitfrom === 'google' && this.state.memberinfo.change_username_times === 0 ?
                        <p>第三方登入的使用者名稱為亂數命名，建議您更改！(僅能更改一次)</p> : null}
                    <ul>
                        <li><span>大頭貼：</span><img src={this.state.memberinfo.headshot ? this.state.memberinfo.headshot.length > 20 ? this.state.memberinfo.headshot : "/image/member/upload/headshot/" + this.state.memberinfo.headshot : "/image/member/demo.png"} alt={this.state.memberinfo.headshot} /></li>
                        <li><span>使用者名稱：</span><span>{this.state.memberinfo.username}</span>{this.state.memberinfo.submitfrom === 'google' && this.state.memberinfo.change_username_times === 0 ? <input type="button" value="更改" onClick={this.changeuname} /> : null}</li>
                        <li><span>暱稱：</span><span>{this.state.memberinfo.nickname ? this.state.memberinfo.nickname : null}</span></li>
                        <li><span>Email：</span><span>{this.state.memberinfo.email ? this.state.memberinfo.email : null}</span></li>
                    </ul>
                </div>
            </div>
        );
    }
    async componentDidMount() {
        var newState = { ...this.state };
        var getmemberresult = await axios.get(`https://ejs.mingspace.website/member/${this.props.match.params.user}/personal/getdata`, { withCredentials: true });
        // var getmemberresult = await axios.get(`https://forum-server-qy2ufzf3yq-de.a.run.app/member/${this.props.match.params.user}/personal/getdata`, { withCredentials: true });
        newState.memberinfo = getmemberresult.data;
        this.setState(newState);
    }
    changeuname = () => {
        // if ($('.personalResult li:nth-of-type(2) input').val() === '更改') {
        //     $('.personalResult li:nth-of-type(2)').html('');
        //     $('.personalResult li:nth-of-type(2)').append(`<span>使用者名稱：</span>${`<input type="text" value="${req.username}" />`}${req.submitfrom == 'google'&& req.change_username_times === 0? '<input type="button" value="送出" onclick="submitchange()" /><input type="button" value="取消" onclick="cancelChange()" />' : ''}`);
        //     $('.personalResult li:nth-of-type(2) input[value="取消"]').attr('onclick', `cancelChange('${req.username}')`);
        // }
    }
}

export default MemberPersonal;