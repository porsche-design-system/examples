import './style.css';

// DO NOT USE IN PRODUCTION!
// EXAMPLE CODE FOR DEMONSTRATION PURPOSE ONLY.
const pPopover = document.querySelectorAll('p-popover');

for (const el of pPopover) {
  const button = el.querySelector('button');
  button.addEventListener('click', (e) => {
    el.open = !el.open;
    e.target.setAttribute('aria-expanded', el.open);
  });
}
