/* ============================================================
   WanderLust — Main Script
   ============================================================ */

// ── NAV: Hamburger ────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
    });
  }

  // Active nav link
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (href === 'index.html' && currentPath === '')) {
      link.classList.add('active');
    }
  });

  // Animate on scroll
  const animEls = document.querySelectorAll('.animate-up');
  if (animEls.length) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in-view'); obs.unobserve(e.target); } });
    }, { threshold: 0.1 });
    animEls.forEach(el => obs.observe(el));
  }
});

/* ── DESTINATIONS DATA ────────────────────────────────────── */
const destinations = [
  {
    id: 'bali',
    name: 'Bali, Indonesia',
    country: 'Indonesia',
    category: 'beach',
    price: 89,
    rating: 4.9,
    reviews: 2148,
    badge: 'Most Popular',
    desc: 'Lush rice terraces, spiritual temples, and stunning sunsets make Bali a paradise for every traveler.',
    img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'paris',
    name: 'Paris, France',
    country: 'France',
    category: 'europe',
    price: 149,
    rating: 4.8,
    reviews: 3421,
    badge: 'Romantic',
    desc: 'The City of Light dazzles with world-class cuisine, iconic landmarks and timeless elegance.',
    img: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'tokyo',
    name: 'Tokyo, Japan',
    country: 'Japan',
    category: 'city',
    price: 129,
    rating: 4.9,
    reviews: 2876,
    badge: 'Trending',
    desc: 'A thrilling blend of ultramodern tech and ancient traditions, neon lights and serene temples.',
    img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'santorini',
    name: 'Santorini, Greece',
    country: 'Greece',
    category: 'europe',
    price: 199,
    rating: 4.8,
    reviews: 1932,
    badge: 'Luxury',
    desc: 'Iconic blue-domed churches, whitewashed villages perched on volcanic cliffs above crystal waters.',
    img: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'newyork',
    name: 'New York, USA',
    country: 'USA',
    category: 'city',
    price: 179,
    rating: 4.7,
    reviews: 4210,
    badge: 'City Break',
    desc: 'The city that never sleeps: Broadway shows, Central Park, iconic skyline and diverse culture.',
    img: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'maldives',
    name: 'Maldives',
    country: 'Maldives',
    category: 'beach',
    price: 299,
    rating: 5.0,
    reviews: 1456,
    badge: 'Exclusive',
    desc: 'Overwater bungalows, crystal-clear lagoons and pristine coral reefs in the Indian Ocean.',
    img: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&auto=format&fit=crop&q=80'
  }
];

/* ── BOOKING UTILS ────────────────────────────────────────── */
function saveBooking(booking) {
  const bookings = JSON.parse(localStorage.getItem('wanderlust_bookings') || '[]');
  bookings.unshift(booking);
  localStorage.setItem('wanderlust_bookings', JSON.stringify(bookings));
}

function getBookings() {
  return JSON.parse(localStorage.getItem('wanderlust_bookings') || '[]');
}

function generateTicketNumber() {
  return 'WL-' + Date.now().toString(36).toUpperCase();
}

function calcNights(checkin, checkout) {
  const d1 = new Date(checkin), d2 = new Date(checkout);
  const diff = Math.round((d2 - d1) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 0;
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

/* ── DESTINATIONS PAGE ────────────────────────────────────── */
function initDestinationsPage() {
  const grid = document.getElementById('destGrid');
  const filters = document.querySelectorAll('.filter-btn');
  if (!grid) return;

  function renderCards(filter) {
    const list = filter === 'all' ? destinations : destinations.filter(d => d.category === filter);
    grid.innerHTML = list.map(d => `
      <div class="dest-card animate-up" data-category="${d.category}" onclick="window.location.href='bookings.html?dest=${d.id}'">
        <div class="card-img">
          <img src="${d.img}" alt="${d.name}" loading="lazy">
          <span class="card-badge">${d.badge}</span>
          <span class="card-rating">⭐ ${d.rating} (${d.reviews.toLocaleString()})</span>
        </div>
        <div class="card-body">
          <div class="card-location">📍 ${d.country}</div>
          <div class="card-title">${d.name}</div>
          <div class="card-desc">${d.desc}</div>
          <div class="card-footer">
            <div class="card-price">
              <span class="amount">$${d.price}</span>
              <span class="per">/night</span>
            </div>
            <a href="bookings.html?dest=${d.id}" class="btn btn-navy btn-sm">Book Now</a>
          </div>
        </div>
      </div>
    `).join('');
    // Re-observe for animations
    document.querySelectorAll('.animate-up').forEach(el => el.classList.add('in-view'));
  }

  renderCards('all');

  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      filters.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderCards(btn.dataset.filter);
    });
  });
}

/* ── BOOKING PAGE ─────────────────────────────────────────── */
function initBookingPage() {
  const step1 = document.getElementById('step1');
  const step2 = document.getElementById('step2');
  if (!step1) return;

  // Prefill destination from URL param
  const params = new URLSearchParams(window.location.search);
  const destParam = params.get('dest');
  const destSelect = document.getElementById('destination');
  if (destSelect && destParam) {
    destSelect.value = destParam;
    updatePriceDisplay();
  }

  // Set min date for checkin/checkout
  const today = new Date().toISOString().split('T')[0];
  const checkinInput = document.getElementById('checkin');
  const checkoutInput = document.getElementById('checkout');
  if (checkinInput) {
    checkinInput.min = today;
    checkinInput.addEventListener('change', () => {
      checkoutInput.min = checkinInput.value;
      updatePriceDisplay();
    });
  }
  if (checkoutInput) {
    checkoutInput.addEventListener('change', updatePriceDisplay);
  }
  if (destSelect) destSelect.addEventListener('change', updatePriceDisplay);

  const guestsInput = document.getElementById('guests');
  if (guestsInput) guestsInput.addEventListener('change', updatePriceDisplay);

  // Payment checkbox
  const payCheckbox = document.getElementById('paymentAgreement');
  const continueBtn = document.getElementById('continueBtn');
  const payWarning = document.getElementById('payWarning');
  const payBox = document.getElementById('paymentBox');

  if (payCheckbox) {
    payCheckbox.addEventListener('change', () => {
      continueBtn.disabled = !payCheckbox.checked;
      if (payCheckbox.checked) {
        payWarning.classList.add('hidden');
        payBox.classList.add('checked');
      } else {
        payBox.classList.remove('checked');
      }
    });
  }

  if (continueBtn) {
    continueBtn.addEventListener('click', () => {
      if (!payCheckbox.checked) {
        payWarning.classList.remove('hidden');
        payBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }
      // Validate step 1 fields
      const dest = destSelect.value;
      const checkin = checkinInput.value;
      const checkout = checkoutInput.value;
      const guests = guestsInput.value;
      if (!dest || !checkin || !checkout || !guests) {
        alert('Please fill in all fields before continuing.');
        return;
      }
      const nights = calcNights(checkin, checkout);
      if (nights < 1) {
        alert('Check-out must be at least 1 night after check-in.');
        return;
      }
      goToStep2();
    });
  }

  // Back button
  const backBtn = document.getElementById('backBtn');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      step2.style.display = 'none';
      step2.classList.add('hidden');
      step1.style.display = 'block';
      updateStepUI(1);
    });
  }

  // Form submit
  const bookingForm = document.getElementById('bookingForm');
  if (bookingForm) {
    bookingForm.addEventListener('submit', handleBookingSubmit);
  }
}

function getDestData(id) {
  return destinations.find(d => d.id === id);
}

function updatePriceDisplay() {
  const destSelect = document.getElementById('destination');
  const checkin = document.getElementById('checkin')?.value;
  const checkout = document.getElementById('checkout')?.value;
  const guests = document.getElementById('guests')?.value;
  const summaryDiv = document.getElementById('priceSummary');
  if (!summaryDiv || !destSelect || !destSelect.value || !checkin || !checkout) {
    if (summaryDiv) summaryDiv.style.display = 'none';
    return;
  }
  const dest = getDestData(destSelect.value);
  if (!dest) return;
  const nights = calcNights(checkin, checkout);
  if (nights < 1) return;
  const subtotal = nights * dest.price;
  const taxes = Math.round(subtotal * 0.12);
  const total = subtotal + taxes;
  summaryDiv.style.display = 'block';
  document.getElementById('priceNights').textContent = `${nights} nights × $${dest.price}`;
  document.getElementById('priceSubtotal').textContent = `$${subtotal}`;
  document.getElementById('priceTaxes').textContent = `$${taxes}`;
  document.getElementById('priceTotal').textContent = `$${total}`;
  // Store for step2
  window._bookingData = { dest, nights, guests, checkin, checkout, subtotal, taxes, total };
}

function goToStep2() {
  updatePriceDisplay();
  const bd = window._bookingData;
  if (!bd) return;
  const step1 = document.getElementById('step1');
  const step2 = document.getElementById('step2');
  step1.style.display = 'none';
  step2.classList.remove('hidden');
  step2.style.display = 'block';
  updateStepUI(2);
  // Populate summary
  document.getElementById('sum-dest').textContent = bd.dest.name;
  document.getElementById('sum-checkin').textContent = formatDate(bd.checkin);
  document.getElementById('sum-checkout').textContent = formatDate(bd.checkout);
  document.getElementById('sum-nights').textContent = bd.nights + ' nights';
  document.getElementById('sum-guests').textContent = bd.guests + ' guest(s)';
  document.getElementById('sum-subtotal').textContent = `$${bd.subtotal}`;
  document.getElementById('sum-taxes').textContent = `$${bd.taxes}`;
  document.getElementById('sum-total').textContent = `$${bd.total}`;
  // Hidden form fields
  document.getElementById('f-destination').value = bd.dest.name;
  document.getElementById('f-checkin').value = bd.checkin;
  document.getElementById('f-checkout').value = bd.checkout;
  document.getElementById('f-guests').value = bd.guests;
  document.getElementById('f-nights').value = bd.nights;
  document.getElementById('f-price').value = `$${bd.total}`;
}

function updateStepUI(step) {
  document.querySelectorAll('.step-circle').forEach((el, i) => {
    el.classList.remove('active', 'done');
    if (i + 1 < step) el.classList.add('done');
    else if (i + 1 === step) el.classList.add('active');
  });
  document.querySelectorAll('.step-label').forEach((el, i) => {
    el.classList.toggle('active', i + 1 === step);
  });
  document.querySelectorAll('.step-connector').forEach((el, i) => {
    el.classList.toggle('done', i + 1 < step);
  });
}

function handleBookingSubmit(e) {
  e.preventDefault();
  const bd = window._bookingData;
  const name  = document.getElementById('guestName').value.trim();
  const email = document.getElementById('guestEmail').value.trim();
  const cardName   = document.getElementById('cardName').value.trim();
  const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
  const cardExpiry = document.getElementById('cardExpiry').value.trim();
  const cardCvv    = document.getElementById('cardCvv').value.trim();
  const paymentError = document.getElementById('paymentError');

  // Validate name & email
  if (!name || !email) {
    alert('Please fill in your full name and email address.');
    return;
  }

  // Luhn check for card number validity
  function luhn(num) {
    let sum = 0, alt = false;
    for (let i = num.length - 1; i >= 0; i--) {
      let n = parseInt(num[i]);
      if (alt) { n *= 2; if (n > 9) n -= 9; }
      sum += n;
      alt = !alt;
    }
    return sum % 10 === 0;
  }

  // Validate expiry is in future (MM/YY format)
  function validExpiry(exp) {
    const parts = exp.replace(/\s/g, '').split('/');
    if (parts.length !== 2) return false;
    const mm = parseInt(parts[0]), yy = parseInt(parts[1]);
    if (mm < 1 || mm > 12) return false;
    const now = new Date();
    const expDate = new Date(2000 + yy, mm - 1, 1);
    return expDate > now;
  }

  const payErr = document.getElementById('paymentError');
  let payErrMsg = '';

  if (!cardName) {
    payErrMsg = '⚠️ Please enter the cardholder name.';
  } else if (cardNumber.length !== 16 || !luhn(cardNumber)) {
    payErrMsg = '⚠️ Invalid card number. Please check and try again.';
  } else if (!validExpiry(cardExpiry)) {
    payErrMsg = '⚠️ Invalid or expired card expiry date.';
  } else if (cardCvv.length < 3) {
    payErrMsg = '⚠️ Invalid CVV. Please enter 3 or 4 digits.';
  }

  if (payErrMsg) {
    payErr.textContent = payErrMsg;
    payErr.style.display = 'block';
    payErr.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }
  payErr.style.display = 'none';

  // Show processing state
  const confirmBtn = document.querySelector('[data-testid="button-confirm"]');
  confirmBtn.disabled = true;
  confirmBtn.textContent = '⏳ Processing Payment…';

  // Simulate payment processing (1.5 sec) then confirm
  setTimeout(() => {
    const booking = {
      id: generateTicketNumber(),
      destination: bd.dest.name,
      destId: bd.dest.id,
      img: bd.dest.img,
      checkin: bd.checkin,
      checkout: bd.checkout,
      guests: bd.guests,
      nights: bd.nights,
      total: bd.total,
      name,
      email,
      createdAt: new Date().toISOString()
    };
    saveBooking(booking);

    // Submit booking details to Netlify Forms so admin receives email notification
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
      // Fill hidden fields before submitting
      document.getElementById('f-destination').value = bd.dest.name;
      document.getElementById('f-checkin').value = bd.checkin;
      document.getElementById('f-checkout').value = bd.checkout;
      document.getElementById('f-guests').value = bd.guests;
      document.getElementById('f-nights').value = bd.nights;
      document.getElementById('f-price').value = bd.total;
      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(new FormData(bookingForm)).toString()
      }).catch(() => {}); // silently ignore on local preview
    }

    document.getElementById('successOverlay').classList.add('show');
  }, 1500);
}

function closeSuccess() {
  window.location.href = 'tickets.html';
}

/* ── TICKETS PAGE ─────────────────────────────────────────── */
function initTicketsPage() {
  const container = document.getElementById('ticketsContainer');
  if (!container) return;
  const bookings = getBookings();
  if (!bookings.length) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🎫</div>
        <h3>No bookings yet</h3>
        <p>Start planning your adventure and book your first trip!</p>
        <a href="destinations.html" class="btn btn-navy">Explore Destinations</a>
      </div>`;
    return;
  }
  container.innerHTML = bookings.map(b => {
    const dest = getDestData(b.destId) || {};
    const img = b.img || dest.img || 'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=400&auto=format&fit=crop';
    return `
      <div class="ticket-card">
        <div class="ticket-left">
          <img src="${img}" alt="${b.destination}" loading="lazy">
          <div class="overlay"></div>
        </div>
        <div class="ticket-divider"></div>
        <div class="ticket-right">
          <div class="ticket-num">Booking # ${b.id}</div>
          <div class="ticket-dest">${b.destination}</div>
          <div class="ticket-meta">
            <div class="meta-item"><span class="m-label">Check-in</span><span class="m-value">${formatDate(b.checkin)}</span></div>
            <div class="meta-item"><span class="m-label">Check-out</span><span class="m-value">${formatDate(b.checkout)}</span></div>
            <div class="meta-item"><span class="m-label">Guests</span><span class="m-value">${b.guests}</span></div>
            <div class="meta-item"><span class="m-label">Duration</span><span class="m-value">${b.nights} nights</span></div>
          </div>
          <div class="ticket-footer">
            <div class="ticket-price">$${b.total}</div>
            <span class="paid-badge">✅ Paid</span>
          </div>
        </div>
      </div>`;
  }).join('');
}

/* ── CONTACT PAGE ─────────────────────────────────────────── */
function initContactPage() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    // Submit to Netlify via fetch so the dashboard receives the entry and sends email
    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(new FormData(form)).toString()
    }).catch(() => {}); // silently ignore network errors on local preview
    document.getElementById('formFields').style.display = 'none';
    document.getElementById('formSuccess').style.display = 'block';
  });
}

/* ── HOME SEARCH ──────────────────────────────────────────── */
function initHomePage() {
  const searchBtn = document.getElementById('heroSearchBtn');
  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      const dest = document.getElementById('heroDestSelect').value;
      const url = dest ? `bookings.html?dest=${dest}` : 'destinations.html';
      window.location.href = url;
    });
  }
}

/* ── INIT ─────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initDestinationsPage();
  initBookingPage();
  initTicketsPage();
  initContactPage();
  initHomePage();
});
