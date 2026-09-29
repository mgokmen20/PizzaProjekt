const apiUrl = 'http://localhost:5000/api/pizzas';
const orderApiUrl = 'http://localhost:5000/api/orders';

const translations = {
  de: {
    navMenu: 'Menü',
    navAbout: 'Über uns',
    navContact: 'Kontakt',
    cartLabel: 'Warenkorb',
    cartTitle: 'Dein Warenkorb',
    emptyCart: 'Dein Warenkorb ist leer.',
    total: 'Gesamt',
    closeCart: 'Warenkorb schließen',
    decreaseQuantity: 'Menge verringern',
    increaseQuantity: 'Menge erhöhen',
    remove: 'Entfernen',
    customerName: 'Kundenname',
    customerNamePlaceholder: 'Vor- und Nachname',
    deliveryAddress: 'Lieferadresse',
    deliveryAddressPlaceholder: 'Straße, Hausnummer, PLZ und Ort',
    orderNow: 'Jetzt bestellen',
    placingOrder: 'Bestellung wird gesendet...',
    orderSuccess: 'Bestellung #{id} wurde erfolgreich aufgegeben.',
    orderError: 'Die Bestellung konnte nicht gesendet werden. Bitte versuche es erneut.',
    eyebrow: 'Frisch. Einfach. Italienisch.',
    heroTitle: 'Deine Lieblingspizza, frisch aus dem Ofen.',
    heroDescription: 'Handgemachte Pizza mit sorgfältig ausgewählten Zutaten und echtem italienischem Geschmack.',
    menuLabel: 'Unsere Auswahl',
    menuTitle: 'Pizza-Menü',
    menuNote: 'Alle Pizzen werden frisch zubereitet und haben einen Durchmesser von 32 cm.',
    loading: 'Pizzen werden geladen...',
    error: 'Das Menü konnte nicht geladen werden. Bitte versuche es später erneut.',
    addToCart: 'In den Warenkorb',
    footerTagline: 'Mit Liebe gebacken.',
    hoursTitle: 'Öffnungszeiten',
    hoursText: 'Montag–Sonntag\n11:30–22:00 Uhr',
    locationTitle: 'Standort',
    locationText: 'Bern, Schweiz',
  },
  en: {
    navMenu: 'Menu',
    navAbout: 'About',
    navContact: 'Contact',
    cartLabel: 'Cart',
    cartTitle: 'Your Cart',
    emptyCart: 'Your cart is empty.',
    total: 'Total',
    closeCart: 'Close cart',
    decreaseQuantity: 'Decrease quantity',
    increaseQuantity: 'Increase quantity',
    remove: 'Remove',
    customerName: 'Customer Name',
    customerNamePlaceholder: 'First and last name',
    deliveryAddress: 'Delivery Address',
    deliveryAddressPlaceholder: 'Street, number, postal code, and city',
    orderNow: 'Order Now',
    placingOrder: 'Placing order...',
    orderSuccess: 'Order #{id} was placed successfully.',
    orderError: 'The order could not be placed. Please try again.',
    eyebrow: 'Fresh. Simple. Italian.',
    heroTitle: 'Your favorite pizza, fresh from the oven.',
    heroDescription: 'Handmade pizza with carefully selected ingredients and authentic Italian flavor.',
    menuLabel: 'Our selection',
    menuTitle: 'Pizza Menu',
    menuNote: 'Every pizza is freshly prepared and has a diameter of 32 cm.',
    loading: 'Loading pizzas...',
    error: 'The menu could not be loaded. Please try again later.',
    addToCart: 'Add to Cart',
    footerTagline: 'Baked with love.',
    hoursTitle: 'Opening hours',
    hoursText: 'Monday–Sunday\n11:30–22:00',
    locationTitle: 'Location',
    locationText: 'Bern, Switzerland',
  },
};

const englishDescriptions = {
  'Pizza Margherita': 'Tomato sauce, mozzarella, oregano, and fresh basil.',
  'Pizza Salami': 'Tomato sauce, mozzarella, salami, and oregano.',
  'Pizza Prosciutto e Funghi': 'Tomato sauce, mozzarella, ham, mushrooms, and oregano.',
  'Pizza Vegetariana': 'Tomato sauce, mozzarella, peppers, mushrooms, zucchini, and olives.',
  'Pizza Quattro Formaggi': 'Tomato sauce, mozzarella, Gorgonzola, Parmesan, and Emmental.',
};

const elements = {
  navMenu: document.querySelector('#nav-menu'),
  navAbout: document.querySelector('#nav-about'),
  navContact: document.querySelector('#nav-contact'),
  cartButton: document.querySelector('#cart-button'),
  cartLabel: document.querySelector('#cart-label'),
  cartCount: document.querySelector('#cart-count'),
  cartDrawerContainer: document.querySelector('#cart-drawer-container'),
  cartBackdrop: document.querySelector('#cart-backdrop'),
  cartDrawer: document.querySelector('#cart-drawer'),
  cartClose: document.querySelector('#cart-close'),
  cartTitle: document.querySelector('#cart-title'),
  cartEmpty: document.querySelector('#cart-empty'),
  cartItems: document.querySelector('#cart-items'),
  cartTotalLabel: document.querySelector('#cart-total-label'),
  cartTotal: document.querySelector('#cart-total'),
  checkoutForm: document.querySelector('#checkout-form'),
  customerNameLabel: document.querySelector('#customer-name-label'),
  customerName: document.querySelector('#customer-name'),
  deliveryAddressLabel: document.querySelector('#delivery-address-label'),
  deliveryAddress: document.querySelector('#delivery-address'),
  checkoutError: document.querySelector('#checkout-error'),
  orderButton: document.querySelector('#order-button'),
  notification: document.querySelector('#notification'),
  eyebrow: document.querySelector('#eyebrow'),
  heroTitle: document.querySelector('#hero-title'),
  heroDescription: document.querySelector('#hero-description'),
  menuLabel: document.querySelector('#menu-label'),
  menuTitle: document.querySelector('#menu-title'),
  menuNote: document.querySelector('#menu-note'),
  pizzaList: document.querySelector('#pizza-list'),
  status: document.querySelector('#status'),
  footerTagline: document.querySelector('#footer-tagline'),
  hoursTitle: document.querySelector('#hours-title'),
  hoursText: document.querySelector('#hours-text'),
  locationTitle: document.querySelector('#location-title'),
  locationText: document.querySelector('#location-text'),
  languageButtons: document.querySelectorAll('.language-button'),
};

let currentLanguage = 'de';
let pizzas = [];
let cart = [];
let hasLoadingError = false;
let isSubmittingOrder = false;
let lastFocusedElement = null;
let notificationTimer = null;

function updateStaticContent() {
  const content = translations[currentLanguage];

  document.documentElement.lang = currentLanguage;
  elements.navMenu.textContent = content.navMenu;
  elements.navAbout.textContent = content.navAbout;
  elements.navContact.textContent = content.navContact;
  elements.cartLabel.textContent = content.cartLabel;
  elements.cartTitle.textContent = content.cartTitle;
  elements.cartEmpty.textContent = content.emptyCart;
  elements.cartTotalLabel.textContent = content.total;
  elements.cartButton.setAttribute('aria-label', `${content.cartLabel}: ${getCartItemCount()}`);
  elements.cartClose.setAttribute('aria-label', content.closeCart);
  elements.cartBackdrop.setAttribute('aria-label', content.closeCart);
  elements.customerNameLabel.textContent = content.customerName;
  elements.customerName.placeholder = content.customerNamePlaceholder;
  elements.deliveryAddressLabel.textContent = content.deliveryAddress;
  elements.deliveryAddress.placeholder = content.deliveryAddressPlaceholder;
  elements.orderButton.textContent = isSubmittingOrder ? content.placingOrder : content.orderNow;

  if (!elements.checkoutError.classList.contains('hidden')) {
    elements.checkoutError.textContent = content.orderError;
  }
  elements.eyebrow.textContent = content.eyebrow;
  elements.heroTitle.textContent = content.heroTitle;
  elements.heroDescription.textContent = content.heroDescription;
  elements.menuLabel.textContent = content.menuLabel;
  elements.menuTitle.textContent = content.menuTitle;
  elements.menuNote.textContent = content.menuNote;
  elements.footerTagline.textContent = content.footerTagline;
  elements.hoursTitle.textContent = content.hoursTitle;
  elements.hoursText.textContent = content.hoursText;
  elements.locationTitle.textContent = content.locationTitle;
  elements.locationText.textContent = content.locationText;

  elements.languageButtons.forEach((button) => {
    const isActive = button.dataset.language === currentLanguage;
    button.setAttribute('aria-pressed', String(isActive));
    button.classList.toggle('bg-red-600', isActive);
    button.classList.toggle('text-white', isActive);
    button.classList.toggle('text-stone-600', !isActive);
  });
}

function getPizzaDescription(pizza) {
  if (currentLanguage === 'en') {
    return englishDescriptions[pizza.name] || pizza.description;
  }

  return pizza.description;
}

function formatPrice(value) {
  return `CHF ${Number(value).toFixed(2)}`;
}

function getCartItemCount() {
  return cart.reduce((total, item) => total + item.quantity, 0);
}

function addToCart(pizza) {
  const existingItem = cart.find((item) => String(item.id) === String(pizza.id));

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: pizza.id,
      name: pizza.name,
      price: Number(pizza.price),
      quantity: 1,
    });
  }

  renderCart();
}

function adjustCartItemQuantity(itemId, change) {
  const item = cart.find((cartItem) => String(cartItem.id) === String(itemId));

  if (!item) {
    return;
  }

  item.quantity += change;

  if (item.quantity <= 0) {
    removeCartItem(itemId);
    return;
  }

  renderCart();
}

function removeCartItem(itemId) {
  cart = cart.filter((item) => String(item.id) !== String(itemId));
  renderCart();
}

function createCartItem(item) {
  const content = translations[currentLanguage];
  const cartItem = document.createElement('article');
  cartItem.className = 'rounded-2xl border border-stone-200 p-4';

  const itemHeader = document.createElement('div');
  itemHeader.className = 'flex items-start justify-between gap-4';

  const itemDetails = document.createElement('div');

  const itemName = document.createElement('h3');
  itemName.className = 'font-bold text-stone-900';
  itemName.textContent = item.name;

  const itemPrice = document.createElement('p');
  itemPrice.className = 'mt-1 text-sm text-stone-500';
  itemPrice.textContent = formatPrice(item.price);

  const removeButton = document.createElement('button');
  removeButton.type = 'button';
  removeButton.className = 'text-sm font-bold text-red-600 transition hover:text-red-700';
  removeButton.textContent = content.remove;
  removeButton.setAttribute('aria-label', `${content.remove}: ${item.name}`);
  removeButton.addEventListener('click', () => removeCartItem(item.id));

  const quantityRow = document.createElement('div');
  quantityRow.className = 'mt-4 flex items-center justify-between';

  const quantityControls = document.createElement('div');
  quantityControls.className = 'flex items-center rounded-full border border-stone-300 bg-white';

  const decreaseButton = document.createElement('button');
  decreaseButton.type = 'button';
  decreaseButton.className = 'grid size-9 place-items-center rounded-full text-lg transition hover:bg-stone-100';
  decreaseButton.textContent = '−';
  decreaseButton.setAttribute('aria-label', `${content.decreaseQuantity}: ${item.name}`);
  decreaseButton.addEventListener('click', () => adjustCartItemQuantity(item.id, -1));

  const quantity = document.createElement('span');
  quantity.className = 'min-w-9 text-center text-sm font-bold';
  quantity.textContent = item.quantity;

  const increaseButton = document.createElement('button');
  increaseButton.type = 'button';
  increaseButton.className = 'grid size-9 place-items-center rounded-full text-lg transition hover:bg-stone-100';
  increaseButton.textContent = '+';
  increaseButton.setAttribute('aria-label', `${content.increaseQuantity}: ${item.name}`);
  increaseButton.addEventListener('click', () => adjustCartItemQuantity(item.id, 1));

  const itemTotal = document.createElement('p');
  itemTotal.className = 'font-black text-stone-900';
  itemTotal.textContent = formatPrice(item.price * item.quantity);

  itemDetails.append(itemName, itemPrice);
  itemHeader.append(itemDetails, removeButton);
  quantityControls.append(decreaseButton, quantity, increaseButton);
  quantityRow.append(quantityControls, itemTotal);
  cartItem.append(itemHeader, quantityRow);

  return cartItem;
}

function renderCart() {
  const itemCount = getCartItemCount();
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  elements.cartCount.textContent = itemCount;
  elements.cartButton.setAttribute('aria-label', `${translations[currentLanguage].cartLabel}: ${itemCount}`);
  elements.cartItems.replaceChildren(...cart.map(createCartItem));
  elements.cartEmpty.classList.toggle('hidden', cart.length > 0);
  elements.cartTotal.textContent = formatPrice(total);
  elements.orderButton.disabled = cart.length === 0 || isSubmittingOrder;
  elements.orderButton.textContent = isSubmittingOrder
    ? translations[currentLanguage].placingOrder
    : translations[currentLanguage].orderNow;
}

function showNotification(message, type) {
  window.clearTimeout(notificationTimer);
  elements.notification.textContent = message;
  elements.notification.classList.toggle('bg-green-600', type === 'success');
  elements.notification.classList.toggle('bg-red-600', type === 'error');
  elements.notification.classList.remove('translate-y-4', 'opacity-0');
  elements.notification.classList.add('translate-y-0', 'opacity-100');

  notificationTimer = window.setTimeout(() => {
    elements.notification.classList.add('translate-y-4', 'opacity-0');
    elements.notification.classList.remove('translate-y-0', 'opacity-100');
  }, 4000);
}

async function submitOrder(event) {
  event.preventDefault();

  if (cart.length === 0 || isSubmittingOrder) {
    return;
  }

  const customerName = elements.customerName.value.trim();
  const deliveryAddress = elements.deliveryAddress.value.trim();

  if (!customerName || !deliveryAddress) {
    elements.checkoutForm.reportValidity();
    return;
  }

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const orderItems = cart.map((item) => ({
    id: item.id,
    name: item.name,
    price: item.price,
    quantity: item.quantity,
  }));

  isSubmittingOrder = true;
  elements.checkoutError.classList.add('hidden');
  renderCart();

  try {
    const response = await fetch(orderApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customer_name: customerName,
        delivery_address: deliveryAddress,
        items: orderItems,
        total_price: Number(totalPrice.toFixed(2)),
      }),
    });

    if (response.status !== 201) {
      throw new Error(`Order API returned status ${response.status}.`);
    }

    const createdOrder = await response.json();
    const successMessage = translations[currentLanguage].orderSuccess.replace('{id}', createdOrder.id);

    cart = [];
    elements.checkoutForm.reset();
    renderCart();
    closeCart();
    showNotification(successMessage, 'success');
  } catch (error) {
    const errorMessage = translations[currentLanguage].orderError;

    elements.checkoutError.textContent = errorMessage;
    elements.checkoutError.classList.remove('hidden');
    showNotification(errorMessage, 'error');
    console.error('Failed to place order:', error);
  } finally {
    isSubmittingOrder = false;
    renderCart();
  }
}

function openCart() {
  lastFocusedElement = document.activeElement;
  elements.cartDrawerContainer.removeAttribute('inert');
  elements.cartDrawerContainer.classList.remove('pointer-events-none');
  elements.cartDrawerContainer.setAttribute('aria-hidden', 'false');
  elements.cartBackdrop.classList.remove('opacity-0');
  elements.cartBackdrop.classList.add('opacity-100');
  elements.cartDrawer.classList.remove('translate-x-full');
  elements.cartButton.setAttribute('aria-expanded', 'true');
  document.body.classList.add('overflow-hidden');
  elements.cartClose.focus();
}

function closeCart() {
  if (lastFocusedElement) {
    lastFocusedElement.focus();
  }

  elements.cartDrawerContainer.classList.add('pointer-events-none');
  elements.cartDrawerContainer.setAttribute('aria-hidden', 'true');
  elements.cartDrawerContainer.setAttribute('inert', '');
  elements.cartBackdrop.classList.add('opacity-0');
  elements.cartBackdrop.classList.remove('opacity-100');
  elements.cartDrawer.classList.add('translate-x-full');
  elements.cartButton.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('overflow-hidden');
}

function createPizzaCard(pizza) {
  const card = document.createElement('article');
  card.className = 'group overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl';

  const image = document.createElement('img');
  image.className = 'h-56 w-full object-cover transition duration-500 group-hover:scale-105';
  image.src = pizza.image_url;
  image.alt = pizza.name;
  image.loading = 'lazy';
  image.onerror = () => {
    console.error('Failed to load pizza image:', pizza.image_url);
    image.onerror = null;
  };

  const content = document.createElement('div');
  content.className = 'flex min-h-64 flex-col p-6';

  const title = document.createElement('h3');
  title.className = 'text-xl font-black tracking-tight';
  title.textContent = pizza.name;

  const description = document.createElement('p');
  description.className = 'mt-3 flex-1 text-sm leading-6 text-stone-600';
  description.textContent = getPizzaDescription(pizza);

  const actionRow = document.createElement('div');
  actionRow.className = 'mt-6 flex items-center justify-between gap-4';

  const price = document.createElement('p');
  price.className = 'text-xl font-black text-red-600';
  price.textContent = formatPrice(pizza.price);

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'rounded-full bg-red-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2';
  button.textContent = translations[currentLanguage].addToCart;
  button.addEventListener('click', () => addToCart(pizza));

  actionRow.append(price, button);
  content.append(title, description, actionRow);
  card.append(image, content);

  return card;
}

function renderPizzas() {
  elements.pizzaList.replaceChildren(...pizzas.map(createPizzaCard));
  elements.pizzaList.classList.remove('hidden');
  elements.pizzaList.classList.add('grid');
  elements.status.classList.add('hidden');
}

function renderStatus() {
  elements.status.textContent = hasLoadingError
    ? translations[currentLanguage].error
    : translations[currentLanguage].loading;
}

async function loadPizzas() {
  renderStatus();

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`Pizza API returned status ${response.status}.`);
    }

    pizzas = await response.json();
    renderPizzas();
  } catch (error) {
    hasLoadingError = true;
    renderStatus();
    console.error('Failed to load pizzas:', error);
  }
}

elements.languageButtons.forEach((button) => {
  button.addEventListener('click', () => {
    currentLanguage = button.dataset.language;
    updateStaticContent();
    renderCart();

    if (pizzas.length > 0) {
      renderPizzas();
    } else {
      renderStatus();
    }
  });
});

elements.cartButton.addEventListener('click', openCart);
elements.cartClose.addEventListener('click', closeCart);
elements.cartBackdrop.addEventListener('click', closeCart);
elements.checkoutForm.addEventListener('submit', submitOrder);

[elements.customerName, elements.deliveryAddress].forEach((input) => {
  input.addEventListener('input', () => {
    elements.checkoutError.classList.add('hidden');
  });
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && elements.cartButton.getAttribute('aria-expanded') === 'true') {
    closeCart();
  }
});

updateStaticContent();
renderCart();
loadPizzas();
