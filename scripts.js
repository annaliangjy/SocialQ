/* --------------------------------------------------
   SocialQ Landing Page Interactivity
   -------------------------------------------------- */

// Live Posts Counter ------------------------------------------------------
(function () {
  const element = document.getElementById('posts-analyzed');
  if (!element) return;

  // Base data (set to the timestamp when the baseValue was recorded)
  const baseValue = 29171793; // initial sample value
  const baseTimestamp = new Date('2024-06-01T00:00:00Z').getTime();
  const growthPerHour = 25000; // approximate growth rate

  function formatNumber(num) {
    return num.toLocaleString('en-US');
  }

  function updateCounter() {
    const now = Date.now();
    const hoursElapsed = (now - baseTimestamp) / (1000 * 60 * 60);
    const newValue = Math.floor(baseValue + growthPerHour * hoursElapsed);
    element.textContent = formatNumber(newValue);
  }

  updateCounter();
  // update every minute to keep it fresh without taxing performance
  setInterval(updateCounter, 60 * 1000);
})();

// Waitlist Form Handling --------------------------------------------------
(function () {
  const forms = document.querySelectorAll('.cta-form');
  forms.forEach((form) => {
    const input = form.querySelector('input[type="email"]');
    const feedback = form.querySelector('.form-feedback');

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = input.value.trim();
      if (!isValidEmail(email)) {
        showError('Please enter a valid email address.');
        return;
      }

      // Simulate async submission
      showLoading();
      setTimeout(() => {
        showSuccess('Thank you! You have been added to the waiting list.');
        input.value = '';
      }, 1200);
    });

    function isValidEmail(val) {
      return /^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/i.test(val);
    }

    function showError(msg) {
      input.classList.remove('success');
      input.classList.add('error');
      feedback.style.color = 'var(--error)';
      feedback.textContent = msg;
    }

    function showSuccess(msg) {
      input.classList.remove('error');
      input.classList.add('success');
      feedback.style.color = 'var(--success)';
      feedback.textContent = msg;
    }

    function showLoading() {
      input.classList.remove('error', 'success');
      feedback.style.color = 'inherit';
      feedback.textContent = 'Submitting...';
    }
  });
})();

// Year in footer ----------------------------------------------------------
(function () {
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear().toString();
  }
})();