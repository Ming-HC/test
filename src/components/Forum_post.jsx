import React, { Component } from 'react';
import axios from 'axios';

import Forumfooter from './Forum_footer';
import $ from 'jquery';
// import './css/forum_post.css';
import styles from './css/forum_post.module.css';

class ForumPost extends Component {
    state = {
        flag: 1,
        floor: [],
        formaction: ""
    }
    render() {
        return (
            <section>
                <div className={`container ${styles.container}`}>
                    <div id={styles.floorResult}>
                        {this.state.floor.map((item) => {
                            var ele = [];
                            if (item.floor_exists) {
                                if (item.headshot) {
                                    if (item.headshot.indexOf("headshot") > -1) {
                                        item.headshot = `/image/member/upload/headshot/${item.headshot}`
                                    }
                                } else {
                                    item.headshot = "/image/member/demo.png"
                                }
                                ele.push(
                                    <div className={`${styles.reply_floor} floor_${item.reply_floor}`} key={item.reply_floor}>
                                        <div>
                                            <div className="col-12" id={styles.title}>
                                                <label>{item.class_name ? item.class_name : ""}</label>
                                                <h3>{item.title ? item.title : ""}</h3>
                                            </div>
                                            <div className="col-4" id={styles.user_info}>
                                                <div><img src={item.headshot} alt={item.headshot.split('/').reverse()[0]} /></div>
                                                <div><label>{item.user}</label></div>
                                            </div>
                                            <div className="col-7">
                                                <div>
                                                    <div>
                                                        <div id={styles.reply_floor_div}><label>{item.reply_floor}F</label></div>
                                                        <div>
                                                            {this.appendimage(item.imageurl)}
                                                            <pre>{item.content}</pre>
                                                            <label>{item.post_time_format}</label>
                                                        </div>
                                                    </div>
                                                    <div className={styles.function_div}>
                                                        {$("#membericon").prop('href').indexOf('login') === -1 ?
                                                            item.user === $("#membericon").prop('href').split('/')[4] ? '<input type="button" className={styles.edit btn} value="編輯" onClick={(e)=>this.editaction(e)}/>' : "" : ""
                                                        }
                                                        {$("#membericon").prop('href').indexOf('login') === -1 ?
                                                            item.user === $("#membericon").prop('href').split('/')[4] ? '<input type="button" className={styles.delete btn} value="刪除" onClick={(e)=>this.deleaction(e)}/>' : "" : ""
                                                        }
                                                        <input type="button" className={`${styles.reply} btn`} value="回覆" onClick={()=>this.replybtn} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>);
                                return ele;
                            } else {
                                if (item.reply_floor === 1) {
                                    ele.push(
                                        <div>
                                            <div className={`col-12 ${styles.d_title}`} id={styles.title}>
                                                <label>{item.class_name ? item.class_name : ""}</label>
                                                <h3>{item.title ? item.title : ""}</h3>
                                            </div>
                                            <div className={`${styles.reply_floor} floor_${item.reply_floor} ${styles.d_floor}`}>
                                                <label>此文章已由原作者({item.user})刪除</label>
                                                <div id={styles.reply_floor_div}><label>{item.reply_floor}F</label></div>
                                            </div></div>);
                                } else {
                                    ele.push(
                                        <div className={`${styles.reply_floor} floor_${item.reply_floor} ${styles.d_floor}`}>
                                            <label>此回覆已由原作者({item.user})刪除</label>
                                            <div id={styles.reply_floor_div}><label>{item.reply_floor}F</label></div>
                                        </div>);
                                }
                                return ele;
                            }
                        })}
                    </div>
                    <form action={`https://ejs.mingspace.website${this.state.formaction}/reply`} method="post" encType="multipart/form-data" className={styles.reply_form}>
                    {/* <form action={`https://forum-server-qy2ufzf3yq-de.a.run.app${this.state.formaction}/reply`} method="post" encType="multipart/form-data" className={styles.reply_form}> */}
                        <div className={styles.reply_div}>
                            <label>回覆：</label>
                            <div className={styles.reply_img_div}>
                                <div className={styles.inputfile_group}>
                                    <input type="file" name="imageurl" accept="image/*" onChange={() => this.handleFiles(this)} />
                                </div>
                                <div className={styles.img_group}>
                                    <div className={styles.img_block}><img src="/image/forum/upload_image_demo.png" alt="upload_image_demo.png" />
                                        <div className={styles.img_tip} onMouseEnter={() => this.hoverimg(this)} onMouseLeave={() => this.leaveimg(this)}
                                            onClick={() => this.delimg(this)}></div>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.reply_content}>
                                <textarea cols="60" rows="7" name="content"></textarea>
                            </div>
                            <div className={styles.reply_post_submit_div}>
                                <input type="submit" value="送出" className='sub' />
                            </div>
                        </div>
                    </form>
                </div>
                <Forumfooter />
            </section>
        );
    }
    async componentDidMount() {
        var newState = { ...this.state };
        $('.page').remove();
        newState.formaction = window.location.pathname;
        var floorresult = await axios.get('https://ejs.mingspace.website' + window.location.pathname + '/getdata');
        // var floorresult = await axios.get('https://forum-server-qy2ufzf3yq-de.a.run.app' + window.location.pathname + '/getdata');
        newState.floor = floorresult.data;
        this.setState(newState);
    }
    appendimage = (imageurl) => {
        if (imageurl) {
            var imageres = [];
            imageres = imageurl.split(',');
            for (let i = 0; i < imageres.length; i++) {
                imageres[i] = `<img src="/image/forum/upload/${imageres[i]}"/>`;
            }
            return imageres.join().replaceAll(',', '');
        } else {
            return '';
        }
    }
    replybtn = () => {
        if ($("#member").prop("href").indexOf('login') > -1) {
            var hint = "需登入才可回覆，是否登入？"
            if (window.confirm(hint) === true) {
                window.location.href = "/member/login";
            }
        } else {
            $("textarea").focus();
        }
    }
    editaction = (e) => {
        var post_id = window.location.pathname.split("post/")[1];
        var floor = e.target.parentNode.parentNode.querySelector("#reply_floor_div label").innerText.split("F")[0];
        window.location.href = `/forum/editpost/${post_id}/${floor}`;
    }
    deleaction = async (e) => {
        var post_id = window.location.pathname.split("post/")[1];
        var floor = e.target.parentNode.parentNode.querySelector("#reply_floor_div label").innerText.split("F")[0];
        var hint = "是否確定刪除文章";
        if (window.confirm(hint) === true) {
            var delefloor = await axios.put(`https://ejs.mingspace.website/forum/deletepost/${post_id}/${floor}`)
            // var delefloor = await axios.put(`https://forum-server-qy2ufzf3yq-de.a.run.app/forum/deletepost/${post_id}/${floor}`)
            if (delefloor.data.indexOf("success") > -1) {
                if (floor === 1) {
                    window.location.href = "/forum";
                } else {
                    window.location.reload();
                }
            }
        }
    }
    handleFiles = (e) => {
        if (e.value !== "") {
            $('.img_group .img_block img').eq($('.img_group .img_block img').length - 1).prop("src", window.URL.createObjectURL(e.files[0]));
            $('.img_group .img_block img').eq($('.img_group .img_block img').length - 1).onload = function () {
                window.URL.revokeObjectURL(e.src);
            }
            e.style.display = "none";
            $('.img_group .img_block .img_tip').eq($('.img_group .img_block .img_tip').length - 1).text(e.value.split("\\").reverse()[0]);
            $('.inputfile_group').append(`<input type="file" name="imageurl" accept="image/*" onChange={()=>handleFiles(this)}>`);
            $('.img_group').append(`<div className="img_block"><img src="/image/forum/upload_image_demo.png"><div className="img_tip" onMousEenter={()=>hoverimg(this)} onMouseLeave={()=>leaveimg(this)} onClick={()=>delimg(this)}></div></div>`);
        }
    }
    hoverimg = (e) => {
        var newState = { ...this.state };

        if (e.value !== '點擊刪除' && newState.flag) {
            e.value = e.innerText;
            newState.flag = !newState.flag;
        }
        e.style.opacity = 0.9;
        e.innerText = "點擊刪除";
        e.style.color = "red";
        this.setState(newState);
    }
    leaveimg = (e) => {
        var newState = { ...this.state };
        e.innerText = e.value;
        e.style.opacity = 0.7;
        e.style.color = "white";
        newState.flag = !newState.flag;
        this.setState(newState);
    }
    delimg = (e) => {
        var newState = { ...this.state };
        $(e.parentNode).remove();
        for (let i = 0; i < $('input[type=file]').length; i++) {
            if ($('input[type=file]').eq(i).val().indexOf(`${e.value}`) > -1) {
                $('input[type=file]').eq(i).remove();
                break;
            }
        }
        newState.flag = 1;
        this.setState(newState);
    }
}

export default ForumPost;