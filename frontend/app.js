const apiUrl = 'http://localhost:5000/api/pizzas';

const translations = {
  de: {
    navMenu: 'Menü',
    navAbout: 'Über uns',
    navContact: 'Kontakt',
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
let hasLoadingError = false;

function updateStaticContent() {
  const content = translations[currentLanguage];

  document.documentElement.lang = currentLanguage;
  elements.navMenu.textContent = content.navMenu;
  elements.navAbout.textContent = content.navAbout;
  elements.navContact.textContent = content.navContact;
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
  price.textContent = `CHF ${Number(pizza.price).toFixed(2)}`;

  const button = document.createElement('button');
  button.type = 'button';
  button.disabled = true;
  button.className = 'cursor-not-allowed rounded-full bg-stone-200 px-4 py-2.5 text-sm font-bold text-stone-500';
  button.textContent = translations[currentLanguage].addToCart;

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

    if (pizzas.length > 0) {
      renderPizzas();
    } else {
      renderStatus();
    }
  });
});

updateStaticContent();
loadPizzas();
