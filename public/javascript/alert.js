/* eslint-disable */

export const hideAlert = () => {
    const el = document.querySelector('.alertt');
    if (el) el.parentElement.removeChild(el);
};

// type is 'success' or 'error'
export const showAlert = (type, msg, time = 7) => {
    hideAlert();
    const markup = `<div class="alertt alert--${type}">${msg}</div>`;
    document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
    window.setTimeout(hideAlert, time * 1000);
};
