/* eslint-disable */

const blogApiEndPoint = 'http://localhost:4900/api/v1/blogs';

const createBlog = async data => {
    try {
        const { data: res } = await axios({
            method: 'POST',
            url: blogApiEndPoint,
            data
        });

        if (res.status === 'success') {
            alert('Blog created successfully!');
            window.setTimeout(() => {
                location.assign('/');
            }, 1000);
        }
    } catch (err) {
        alert(err.response.data.message);
    }
};

const editBlog = async (blog, blogId) => {
    try {
        const { data } = await axios({
            method: 'PATCH',
            url: `${blogApiEndPoint}/${blogId}`,
            data: {
                blog
            }
        });

        if (data.status === 'success') {
            alert('Blog successfully updated!');
            window.setTimeout(() => {
                location.assign('/admin/dashboard');
            }, 1000);
        }
    } catch (err) {
        alert(err.response.data.message);
    }
};

const contactUs = async (name, email, subject, message) => {
    try {
        const { data } = await axios({
            method: 'POST',
            url: `${blogApiEndPoint}/contact`,
            data: {
                name,
                email,
                subject,
                message
            }
        });

        console.log(data);

        if (data.status === 'success') {
            alert('Thanks for contacting us!');
            window.setTimeout(() => {
                location.assign('/blogs/contact');
            }, 1500);
        }
    } catch (err) {
        alert(err.response.data.message);
    }
};

const deleteBlog = async blogId => {
    try {
        await axios({
            method: 'DELETE',
            url: `${blogApiEndPoint}/${blogId}`
        });

        alert('Blog deleted successfully!');
        location.reload(true);

    } catch (err) {
        alert(err.response.data.message);
    }
};

// DOM Element
const newBlogForm = document.getElementById('addNewBlogform');
const editBlogForm = document.querySelector('.edit--blog--form');
const contactForm = document.querySelector('.contactForm');
const delBlog = document.getElementById('admin--delete--blog');

// Delegation
if (newBlogForm)
    newBlogForm.addEventListener('submit', e => {
        e.preventDefault();

        const form = new FormData();

        form.append('title', document.getElementById('title').value);
        form.append('category', document.getElementById('category').value);
        form.append('description', document.getElementById('description').value);
        form.append('subContent', document.getElementById('subContent').value);
        form.append('content', document.getElementById('Content').value);
        form.append('image', document.getElementById('image').files[0]);

        createBlog(form);
    });

if (editBlogForm)
    editBlogForm.addEventListener('submit', e => {
        e.preventDefault();

        const blogId = document.getElementById('blogId').value;

        const form = new FormData();

        // form.append('_id', document.getElementById('blogId').value);
        form.append('title', document.getElementById('title').value);
        form.append('description', document.getElementById('description').value);
        form.append('subContent', document.getElementById('subContent').value);
        form.append('content', document.getElementById('Content').value);
        form.append('image', document.getElementById('image').files[0]);

        editBlog(form, blogId);
    });

if (contactForm)
    contactForm.addEventListener('submit', e => {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;

        contactUs(name, email, subject, message);
    });

if (delBlog)
    delBlog.addEventListener('click', e => {
        const { blogId } = e.target.dataset;
        deleteBlog(blogId);
    });


/*************************************
     const hideAlert = () => {
         const el = document.querySelector('.alert');
         if (el) el.parentElement.removeChild(el);
     };

     // type is 'success' or 'error'
     const showAlert = (type, msg, time = 7) => {
         hideAlert();
         const markup = `<div class="alert alert--${type}">${msg}</div>`;
         document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
         window.setTimeout(hideAlert, time * 1000);
     };
 */