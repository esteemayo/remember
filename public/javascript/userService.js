/* eslint-disable */

const apiUrl = 'http://localhost:4900/api/v1/users/signup';

const signup = async userData => {
    try {
        const { data } = await axios({
            method: 'POST',
            url: apiUrl,
            data: userData
        });

        if (data.status === 'success') {
            // showAlert('success', 'Account successfully created!!!');
            alert('Account successfully created!!!');
            window.setTimeout(() => {
                location.assign('/');
            }, 1000);
        }

    } catch (err) {
        // showAlert('error', err.response.data.message);
        alert(err.response.data.message);
    }
};

// DOM Element
const signupForm = document.getElementById('signupform');

// Delegation
if (signupForm)
    signupForm.addEventListener('submit', e => {
        e.preventDefault();

        const form = new FormData();

        form.append('name', document.getElementById('name').value);
        form.append('email', document.getElementById('email').value);
        form.append('username', document.getElementById('username').value);
        form.append('password', document.getElementById('password').value);
        form.append('passwordConfirm', document.getElementById('passwordConfirm').value);
        form.append('about', document.getElementById('about').value);
        form.append('avatar', document.getElementById('avatar').files[0]);

        signup(form);
    });


    /********************************************************
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
     */