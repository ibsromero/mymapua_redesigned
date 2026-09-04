const sidebar = document.querySelector('#sidebar');
const pageTitle = document.querySelector('#pageTitle');
const toast = document.querySelector('#toast');

document.querySelector('#openMenu').addEventListener('click', () => sidebar.classList.add('open'));
document.querySelector('#closeMenu').addEventListener('click', () => sidebar.classList.remove('open'));

document.querySelectorAll('.nav-link').forEach((link) => {
  link.addEventListener('click', () => {
    document.querySelectorAll('.nav-link').forEach((item) => item.classList.remove('active'));
    link.classList.add('active');
    pageTitle.textContent = link.dataset.page;
    sidebar.classList.remove('open');
  });
});

document.querySelector('#helpButton').addEventListener('click', () => {
  toast.classList.add('show');
  window.setTimeout(() => toast.classList.remove('show'), 2600);
});