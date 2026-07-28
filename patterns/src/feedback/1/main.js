import './style.css';

// DO NOT USE IN PRODUCTION!
// EXAMPLE CODE FOR DEMONSTRATION PURPOSE ONLY. No data is sent anywhere.

const form = document.getElementById('feedback-form');
const rating = document.getElementById('feedback-rating');
const comment = document.getElementById('feedback-comment');
const submit = document.getElementById('feedback-submit');
const thanks = document.getElementById('feedback-thanks');
const question = document.getElementById('feedback-question');
const restart = document.getElementById('feedback-restart');

// Choosing a rating reveals the optional free-text field and the submit button.
rating.addEventListener('change', () => {
  comment.hidden = false;
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
  }, 1200);
});

// Restart the flow so another rating can be given.
restart.addEventListener('click', () => {
  rating.value = undefined;
  comment.value = undefined;
  submit.loading = false;
  submit.hidden = true;
  comment.hidden = true;
  thanks.hidden = true;
  question.hidden = false;
  form.hidden = false;
});
