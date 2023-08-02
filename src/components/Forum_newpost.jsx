import React, { Component } from 'react';
import axios from 'axios';
import $ from 'jquery';
import styles from './css/forum_newpost.module.css'

class ForumNewPost extends Component {
    state = {
        logined_user: '',
        classlist: [],
        flag: 1
    }
    render() {
        return (
            <div className={styles.container_cancelbs}>
                <form action="https://ejs.mingspace.website/forum/newpost/new" method="post" encType="multipart/form-data">
                {/* <form action="https://forum-server-qy2ufzf3yq-de.a.run.app/forum/newpost/new" method="post" encType="multipart/form-data"> */}
                {/* <form action="http://localhost:8080/forum/newpost/new" method="post" encType="multipart/form-data"> */}
                    <table>
                        <tbody>
                            <tr>
                                <td className="title"><label>請選擇主題分類：</label></td>
                                <td><select id="classResult" name="class_name">
                                    {this.state.classlist.map(item =>
                                        <option key={`${item.class_name_eng}`} value={item.class_eng}>{item.class_name}</option>
                                    )}
                                </select></td>
                            </tr>
                            <tr>
                                <td className="title"><label>請輸入文章標題：</label></td>
                                <td><input type="text" name="title" /></td>
                            </tr>
                            <tr>
                                <td></td>
                                <td className={`${styles.inputfile_group} inputfile_group`}><input type="file" name="imageurl" accept="image/*" onChange={this.handleFiles} /></td>
                            </tr>
                            <tr>
                                <td></td>
                                <td className={`${styles.img_group} img_group`}><div className={`${styles.img_block} img_block`}><img src="/image/forum/upload_image_demo.png" alt="default" /><div className={`${styles.img_tip} img_tip`} onMouseEnter={this.hoverimg} onMouseLeave={this.leaveimg} onClick={this.delimg}></div></div></td>
                            </tr>
                            <tr>
                                <td className={styles.title}><label>請輸入文章內容：</label></td>
                            </tr>
                            <tr>
                                <td></td>
                                <td><textarea cols="50" rows="15" name="content"></textarea></td>
                            </tr>
                            <tr>
                                <td></td>
                                <td className={styles.submit}><button>送出</button></td>
                            </tr>
                        </tbody>
                    </table>
                </form>
            </div>
        )
    }
    async componentDidMount() {
        var newState = { ...this.state };
        var dataToServer = { from: 'newpost' }
        var classresult = await axios.post('https://ejs.mingspace.website/forum/getclass', dataToServer, { withCredentials: true });
        // var classresult = await axios.post('https://forum-server-qy2ufzf3yq-de.a.run.app/forum/getclass', dataToServer, { withCredentials: true });
        // var classresult = await axios.post('http://localhost:8080/forum/getclass', dataToServer, { withCredentials: true });
        newState.logined_user = classresult.data.logined_user;
        newState.classlist = classresult.data.results;
        this.setState(newState);
    }
    handleFiles = (e) => {
        if (e.target.value !== "") {
            const imgBlock = document.querySelectorAll('.img_block')[document.querySelectorAll('.img_block').length-1];
            const newImage = imgBlock.cloneNode(true);
            const newInput = e.target.cloneNode(true);
            $('.img_block img').eq($('.img_block img').length - 1).prop("src", window.URL.createObjectURL(e.target.files[0]));
            $('.img_block img').eq($('.img_block img').length - 1).onload = function () {
                window.URL.revokeObjectURL(e.target.src);
            }
            e.target.style.display = "none";
            newInput.value = "";
            newInput.addEventListener("change", this.handleFiles);
            e.target.parentElement.appendChild(newInput);
            $('.img_tip').eq($('.img_tip').length - 1).text(e.target.value.split("\\").reverse()[0]);

            newImage.querySelector('.img_tip').addEventListener("mouseenter", this.hoverimg);
            newImage.querySelector('.img_tip').addEventListener("mouseleave", this.leaveimg);
            newImage.querySelector('.img_tip').addEventListener("click", this.delimg);
            $('.img_group').append(newImage);
        }
    }
    hoverimg = (e) => {
        if (e.target.value !== '點擊刪除' && this.state.flag) {
            var newState = {...this.state};
            e.target.value = e.target.innerText;
            newState.flag = !newState.flag;
            this.setState(newState);
        }
        e.target.style.opacity = 0.9;
        e.target.innerText = "點擊刪除";
        e.target.style.color = "red";
    }
    leaveimg = (e) => {
        var newState = {...this.state};
        e.target.innerText = e.target.value;
        e.target.style.opacity = 0.7;
        e.target.style.color = "white";
        newState.flag = !newState.flag;
        this.setState(newState);
    }
    delimg = (e) => {
        console.log(1);
        $(e.target.parentNode).remove();
        for (let i = 0; i < $('input[type=file]').length; i++) {
            if ($('input[type=file]').eq(i).val().indexOf(`${e.value}`) > -1) {
                $('input[type=file]').eq(i).remove();
                break;
            }
        }
        var newState = {...this.state};
        newState.flag = 1;
        this.setState(newState);
    }
}

export default ForumNewPost;