/**
 * Created by rubin on 2020/6/4.
 */

'use strict'

import axios from 'axios'
import { clearToken, getToken } from './cookie'
import { MessageBox, Message } from 'element-ui'
import panUtil from './common'
import store from '../store'

const toLogin = function () {
        // to re-login
        MessageBox.confirm('You need to log in again', 'Confirm logging out', {
            confirmButtonText: 'ReLogin',
            cancelButtonText: 'Cancel',
            type: 'warning'
        }).then(() => {
            clearToken()
            store.commit('file/clear')
            store.commit('breadcrumb/clear')
            store.commit('navbar/clear')
            store.commit('user/clear')
            window.location.reload()
        })
    },
    http = axios.create({
        baseURL: panUtil.getUrlPrefix(),
        timeout: 1000 * 60,
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        }
    })

http.interceptors.request.use(config => {
    if (config.data) {
        config.data = JSON.stringify(config.data)
    }
    let token = getToken()
    if (token) {
        config.headers['Authorization'] = token
    }
    return config
}, error => {
    Message.error('请求失败')
    return
})

http.interceptors.response.use(res => {
    if (res.data.status === 10) {
        toLogin()
        res.data.message = '您需要重新登陆'
        return Promise.reject(res.data)
    }
    if (res.data.status !== 0) {
        return Promise.reject(res.data)
    }
    return res.data
}, error => {
    Message.error('请求失败')
    return
})

export default http
