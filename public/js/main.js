document.addEventListener('DOMContentLoaded', function () {
  var quantityNoticeTimer;

  function showQuantityNotice(input) {
    var notice = document.querySelector('.quantity-notice');
    if (!notice || !input) return;

    var max = parseInt(input.max || '99', 10);
    notice.textContent = 'Nur ' + max + ' Produkte verfügbar.';
    notice.classList.add('is-visible');

    clearTimeout(quantityNoticeTimer);
    quantityNoticeTimer = setTimeout(function () {
      notice.classList.remove('is-visible');
      notice.textContent = '';
    }, 3500);
  }

  function clampQuantity(input) {
    var min = parseInt(input.min || '1', 10);
    var max = parseInt(input.max || '99', 10);
    var current = parseInt(input.value || min, 10);
    if (Number.isNaN(current)) current = min;
    if (current > max) showQuantityNotice(input);
    input.value = Math.min(max, Math.max(min, current));
  }

  document.querySelectorAll('.qty-input').forEach(function (input) {
    input.addEventListener('change', function () {
      clampQuantity(this);
    });
    input.addEventListener('blur', function () {
      clampQuantity(this);
    });
  });

  document.querySelectorAll('.quantity-step').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var quantityInput = document.querySelector('#quantity');
      if (!quantityInput) return;

      var step = parseInt(this.dataset.step || '0', 10);
      var min = parseInt(quantityInput.min || '1', 10);
      var max = parseInt(quantityInput.max || '99', 10);
      var current = parseInt(quantityInput.value || min, 10);
      quantityInput.value = Math.min(max, Math.max(min, current + step));
    });
  });

  document.querySelectorAll('.product-thumbnail').forEach(function (thumb) {
    thumb.addEventListener('click', function () {
      var mainImage = document.querySelector('.product-detail-image img');
      var thumbImage = this.querySelector('img');
      if (!mainImage || !thumbImage) return;

      mainImage.src = thumbImage.src;
      document.querySelectorAll('.product-thumbnail').forEach(function (item) {
        item.classList.remove('is-active');
      });
      this.classList.add('is-active');
    });
  });

  function initCoffeeFinder() {
    var finder = document.querySelector('.finder-layout');
    if (!finder) return;

    var questions = Array.prototype.slice.call(document.querySelectorAll('.finder-question'));
    var label = document.querySelector('.finder-progress-label');
    var value = document.querySelector('.finder-progress-value');
    var bar = document.querySelector('.finder-progress-bar');
    var total = questions.length || 5;

    function getAnsweredCount() {
      return questions.filter(function (question) {
        return question.querySelector('input[type="radio"]:checked');
      }).length;
    }

    function updateProgress() {
      var answered = getAnsweredCount();
      var percent = Math.round((answered / total) * 100);

      if (value) value.textContent = percent + '%';
      if (bar) bar.style.width = percent + '%';
    }

    function setActiveStep(index) {
      var step = Math.min(total, Math.max(1, index + 1));

      if (label) label.textContent = 'Schritt ' + step + ' von ' + total;
      updateProgress();
    }

    function markCompleteIfAnswered(question) {
      question.classList.toggle('is-complete', !!question.querySelector('input[type="radio"]:checked'));
    }

    function refreshCompletion() {
      questions.forEach(markCompleteIfAnswered);
    }

    function setSubmittedProgress() {
      var percent = total ? 100 : 0;
      if (label) label.textContent = 'Schritt ' + total + ' von ' + total;
      if (value) value.textContent = percent + '%';
      if (bar) bar.style.width = percent + '%';
    }

    function openStep(index) {
      questions.forEach(function (question, questionIndex) {
        question.open = questionIndex === index;
      });
      setActiveStep(index);
    }

    function openNextStep(index) {
      if (index < questions.length - 1) {
        openStep(index + 1);
        return;
      }
      setActiveStep(index);
    }

    questions.forEach(function (question, index) {
      question.addEventListener('toggle', function () {
        if (!question.open) return;
        questions.forEach(function (otherQuestion, otherIndex) {
          if (otherIndex !== index) otherQuestion.open = false;
        });
        setActiveStep(index);
      });

      question.querySelectorAll('input[type="radio"]').forEach(function (input) {
        input.addEventListener('change', function () {
          markCompleteIfAnswered(question);
          updateProgress();
          requestAnimationFrame(function () {
            openNextStep(index);
          });
        });
      });
    });

    refreshCompletion();
    if (document.querySelector('.finder-result')) {
      setSubmittedProgress();
      return;
    }

    var openIndex = questions.findIndex(function (question) { return question.open; });
    if (openIndex < 0) {
      openStep(0);
    } else {
      openStep(openIndex);
    }
  }

  initCoffeeFinder();

  // Add to cart via AJAX
  document.querySelectorAll('.add-to-cart-btn').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      var id = this.dataset.id;
      var quantityInput = document.querySelector('#quantity');
      if (quantityInput) clampQuantity(quantityInput);
      var quantity = quantityInput ? quantityInput.value : 1;
      fetch('/cart/add/' + id, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'quantity=' + encodeURIComponent(quantity)
      })
        .then(function (r) { return r.json(); })
        .then(function (data) {
          var navLink = document.querySelector('a[href="/warenkorb"]');
          if (navLink) {
            var cartCount = navLink.querySelector('.cart-count');
            if (!cartCount) {
              cartCount = document.createElement('span');
              cartCount.className = 'cart-count';
              navLink.appendChild(cartCount);
            }
            cartCount.textContent = data.cartCount;
          }
          if (data.maxReached && quantityInput) {
            showQuantityNotice(quantityInput);
          }
          var orig = this.innerHTML;
          this.innerHTML = '<span>Hinzugefügt</span>';
          var addToCart = this.closest('.add-to-cart');
          if (addToCart) {
            addToCart.classList.add('is-added');
          }
          var self = this;
          setTimeout(function () { self.innerHTML = orig; }, 1500);
        }.bind(this));
    });
  });
});
