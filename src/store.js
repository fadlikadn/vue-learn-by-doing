import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import { Promise } from 'q';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        status: '',
        token: localStorage.getItem('token') || '',
        user: {}
    },
    mutations: {
        // used to change the state of vuex store
        auth_request(state) {
            state.status = 'loading';
        },
        auth_success(state, token, user) {
            state.status = 'success';
            state.token = token;
            state.user = user;
        },
        auth_error(state) {
            state.status = 'error';
        },
        logout(state) {
            state.status = '';
            state.token = '';
        }
    },
    actions: {
        login({commit}, user) {
            console.log('login');
            return new Promise((resolve, reject) => {
                commit('auth_request');
                console.log(user);
                axios(
                    {
                        url: 'http://localhost:8081/login', 
                        data: user, 
                        method: 'POST',
                        headers: {
                            "content-type": "application/json",
                        }
                    })
                    .then(resp => {
                        console.log(resp);
                        const token = resp.data.token;
                        const user = resp.data.user;
                        localStorage.setItem('token', token);
                        axios.defaults.headers.common['Authorization'] = token;
                        commit('auth_success', token, user);
                        resolve(resp);
                    })
                    .catch(err => {
                        commit('auth_error');
                        localStorage.removeItem('token');
                        reject(err);
                    });
            });
        },

        register({commit}, user) {
            return new Promise((resolve, reject) => {
                console.log(user);
                commit('auth_request')
                axios({url: 'http://localhost:8081/users', data: user, method: 'POST'})
                    .then(resp => {
                        const token = resp.data.token;
                        const user = resp.data.user;
                        localStorage.setItem('token', token);
                        axios.defaults.headers.common['Authorization'] = token;
                        commit('auth_success', token, user);
                        resolve(resp);
                    })
                    .catch(err => {
                        commit('auth_error', err);
                        localStorage.removeItem('token');
                        reject(err);
                    });
            });
        },

        logout({commit}) {
            // eslint-disable-next-line no-unused-vars
            return new Promise((resolve, reject) => {
                commit('logout');
                localStorage.removeItem('token');
                delete axios.defaults.headers.common['Authorization'];
                resolve();
            });
        }
    },
    getters: {
        // get the value of the attributes of vuex state
        isLoggedIn: state => !!state.token,
        authStatus: state => state.status,
    }
});