/* eslint-disable */

const updateApiEndPoint = 'http://localhost:4900/api/v1/users';

const updateSettings = async (data, type) => {
    try {
        const url = type === 'password'
            ? `${updateApiEndPoint}/updateMyPassword`
            : `${updateApiEndPoint}/updateMe`;

        const { data: res } = await axios({
            method: 'PATCH',
            url,
            data
        });

        if (res.status === 'success') {
            // showAlert('success', `${type.toUpperCase()} updated successfully!`);
            alert(`${type.toUpperCase()} updated successfully!`);
            window.setTimeout(() => {
                location.reload(true);
            }, 1000);
        }
    } catch (err) {
        // showAlert('error', err.response.data.message);
        alert(err.response.data.message);
    }
};

// DOM Element
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');

// Delegation
if (userDataForm)
    userDataForm.addEventListener('submit', e => {
        e.preventDefault();

        const form = new FormData();

        form.append('name', document.getElementById('name').value);
        form.append('email', document.getElementById('email').value);
        form.append('about', document.getElementById('about').value);
        form.append('username', document.getElementById('username').value);
        form.append('avatar', document.getElementById('avatar').files[0]);

        updateSettings(form, 'data');
    });

if (userPasswordForm)
    userPasswordForm.addEventListener('submit', async e => {
        e.preventDefault();

        document.querySelector('.btn--save-password').textContent = 'UPDATING...';

        const passwordCurrent = document.getElementById('passwordCurrent').value;
        const password = document.getElementById('password').value;
        const passwordConfirm = document.getElementById('passwordConfirm').value;

        document.getElementById('passwordCurrent').value = '';
        document.getElementById('password').value = '';
        document.getElementById('passwordConfirm').value = '';

        document.querySelector('.btn--save-password').textContent = 'SAVE SETTINGS';

        await updateSettings({ passwordCurrent, password, passwordConfirm }, 'password');
    });

/********************************************
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