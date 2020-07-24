/* eslint-disable */

const apiEndPoint = 'http://localhost:4900/api/v1/users';

const login = async (username, password) => {
    try {
        const { data } = await axios({
            method: 'POST',
            url: `${apiEndPoint}/login`,
            data: {
                username,
                password
            }
        });

        if (data.status === 'success') {
            showAlert('success', 'Logged in successfully!');
            window.setTimeout(() => {
                location.assign('/');
            }, 1500);
        }
    } catch (err) {
        showAlert('error', err.response.data.message);
    }
};

const logout = async () => {
    try {
        const { data } = await axios({
            method: 'GET',
            url: `${apiEndPoint}/logout`
        });

        if (data.status === 'success') {
            showAlert('success', 'Logged you out!', 5);
            window.setTimeout(() => {
                location.assign('/login');
            }, 1000);
        }
    } catch (err) {
        showAlert('error', 'Error logging out! Try again');
    }
};

const forgotPassword = async email => {
    try {
        const { data } = await axios({
            method: 'POST',
            url: `${apiEndPoint}/forgotPassword`,
            data: {
                email
            }
        });

        if (data.status === 'success') {
            showAlert('success', 'Token sent to email');
            window.setTimeout(() => {
                location.reload(true);
            }, 1000);
        }
    } catch (err) {
        showAlert('error', err.response.data.message);
    }
};

// DOM Element
const loginForm = document.getElementById('loginform');
const logoutBtn = document.querySelector('.logout--btn');
const forgotPasswordForm = document.querySelector('.forgot-password-form');

// Delegation
if (loginForm)
    loginForm.addEventListener('submit', e => {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        login(username, password);
    });

if (logoutBtn) logoutBtn.addEventListener('click', logout);

if (forgotPasswordForm)
    forgotPasswordForm.addEventListener('submit', e => {
        e.preventDefault();

        const email = document.getElementById('email').value;

        forgotPassword(email);
    });


const hideAlert = () => {
    const el = document.querySelector('.alertt');
    if (el) el.parentElement.removeChild(el);
};

// type is 'success' or 'error'
const showAlert = (type, msg, time = 7) => {
    hideAlert();
    const markup = `<div class="alertt alert--${type}">${msg}</div>`;
    document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
    window.setTimeout(hideAlert, time * 1000);
};