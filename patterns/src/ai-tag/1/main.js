import './style.css';

// DO NOT USE IN PRODUCTION!
// EXAMPLE CODE FOR DEMONSTRATION PURPOSE ONLY.
const pPopover = document.querySelectorAll('p-popover');

pPopover.forEach((el, i) => {
  const button = el.querySelector('button');
  button.addEventListener('click', (e) => {
    el.open = !el.open;
    e.target.setAttribute('aria-expanded', el.open);
  })
  el.addEventListener('dismiss', (e) => {
    button.setAttribute('aria-expanded', 'false');
    e.target.open = false;
  })
})
