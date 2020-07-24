/* eslint-disable */

const endpoint = 'http://localhost:4900/api/v1/blogs';

const commentData = async (comment, userId, blogId) => {
    try {
        const { data } = await axios({
            method: 'POST',
            url: `${endpoint}/${blogId}/comments`,
            data: {
                comment,
                userId,
                blogId
            }
        });

        if (data.status === 'success') {
            showAlert('success', 'Comment posted successfully!', 5);
            location.reload(true);
        }
    } catch (err) {
        showAlert('error', err.response.data.message);
    }
};

// DOM Element
const commentForm = document.querySelector('#commentform');

// Delegation
if (commentForm)
    commentForm.addEventListener('submit', e => {
        e.preventDefault();

        const comment = document.getElementById('comment').value;
        const { userId } = e.target.dataset;
        const { blogId } = e.target.dataset;

        // console.log({ comment, userId, blogId });
        commentData(comment, userId, blogId);
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