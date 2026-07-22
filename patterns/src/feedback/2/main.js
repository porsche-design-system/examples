import './style.css';

// DO NOT USE IN PRODUCTION!
// EXAMPLE CODE FOR DEMONSTRATION PURPOSE ONLY. No data is sent anywhere.

const trigger = document.getElementById('feedback-trigger');
const modal = document.getElementById('feedback-modal');
const rating = document.getElementById('feedback-rating');
const detail = document.getElementById('feedback-detail');
const form = document.getElementById('feedback-form');
const submit = document.getElementById('feedback-submit');
const close = document.getElementById('feedback-close');
const thanks = document.getElementById('feedback-thanks');
const question = document.getElementById('feedback-question');

// The trigger opens the feedback modal.
trigger.addEventListener('click', () => {
  modal.open = true;
});

// Choosing a rating reveals the optional free-text field and the submit button.
rating.addEventListener('change', () => {
  detail.hidden = false;
  submit.hidden = false;
});

submit.addEventListener('click', () => {
  // Simulate a short server round-trip: show a loading spinner while "submitting",
  // then reveal the confirmation. In a real integration the request would happen here.
  submit.loading = true;
  window.setTimeout(() => {
    submit.loading = false;
    form.hidden = true;
    question.hidden = true;
    thanks.hidden = false;
    submit.hidden = true;
    close.hidden = false;
  }, 1200);
});

// Closing resets the flow so the next open starts fresh.
const closeModal = () => {
  modal.open = false;
  rating.value = undefined;
  detail.hidden = true;
  thanks.hidden = true;
  question.hidden = false;
  form.hidden = false;
  submit.loading = false;
  submit.hidden = true;
  close.hidden = true;
};

close.addEventListener('click', closeModal);
modal.addEventListener('dismiss', closeModal);
