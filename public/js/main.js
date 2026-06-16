document.addEventListener('DOMContentLoaded', function () {
  // Add to cart via AJAX
  document.querySelectorAll('.add-to-cart-btn').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      var id = this.dataset.id;
      var quantityInput = document.querySelector('#quantity');
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
            navLink.textContent = 'Warenkorb (' + data.cartCount + ')';
          }
          var orig = this.textContent;
          this.textContent = 'Hinzugefügt ✓';
          var self = this;
          setTimeout(function () { self.textContent = orig; }, 1500);
        }.bind(this));
    });
  });
});
