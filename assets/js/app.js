(function () {
  "use strict";

  const products = window.JRProducts || [];
  const money = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
  const cartKey = "jr-galego-cart";
  const favoriteKey = "jr-galego-favorites";
  const navigationScrollKey = "jr-galego-navigation-scroll";
  const categoryNames = ["Sofás", "Racks", "Painéis", "Mesas", "Cadeiras", "Camas", "Guarda-roupas", "Poltronas", "Armários"];
  let cart = readStorage(cartKey, []);
  let favorites = readStorage(favoriteKey, []);
  let catalogState = { category: "", query: "", saleOnly: false, maxPrice: 5000, brand: "", color: "", material: "", inStock: false, sort: "featured", page: 1 };
  const pageSize = 9;

  function readStorage(key, fallback) {
    try {
      const value = JSON.parse(localStorage.getItem(key) || "null");
      return Array.isArray(value) ? value : fallback;
    } catch (error) {
      console.error("Não foi possível ler os dados salvos da loja.", error);
      return fallback;
    }
  }

  function saveStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      showToast("Não foi possível salvar esta alteração neste navegador.", true);
      console.error("Não foi possível salvar dados da loja.", error);
    }
  }

  function imageUrl(id, width) {
    return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width || 720}&q=82`;
  }

  function toast(message, isError) {
    let region = document.querySelector(".toast-region");
    if (!region) {
      region = document.createElement("div");
      region.className = "toast-region";
      region.setAttribute("role", "status");
      region.setAttribute("aria-live", "polite");
      document.body.append(region);
    }
    const item = document.createElement("div");
    item.className = `toast${isError ? " toast-error" : ""}`;
    item.textContent = message;
    region.append(item);
    window.setTimeout(() => item.remove(), 3200);
  }

  function showToast(message, isError) {
    toast(message, isError);
  }

  function icons() {
    if (window.lucide) window.lucide.createIcons();
  }

  function setSchema(id, data) {
    document.getElementById(id)?.remove();
    const script = document.createElement("script");
    script.id = id;
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(data);
    document.head.append(script);
  }

  function rememberNavigationScroll(destination) {
    if (destination.origin !== window.location.origin || destination.hash) return;
    try {
      sessionStorage.setItem(navigationScrollKey, JSON.stringify({
        destination: `${destination.pathname}${destination.search}`,
        scrollY: window.scrollY
      }));
    } catch (error) {
      console.error("Não foi possível preservar a posição da página.", error);
    }
  }

  function restoreNavigationScroll() {
    let savedPosition;
    try {
      savedPosition = JSON.parse(sessionStorage.getItem(navigationScrollKey) || "null");
      sessionStorage.removeItem(navigationScrollKey);
    } catch (error) {
      console.error("Não foi possível recuperar a posição da página.", error);
      return;
    }
    if (!savedPosition || savedPosition.destination !== `${window.location.pathname}${window.location.search}`) return;
    const previousScrollBehavior = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = "auto";
    window.scrollTo(0, Math.max(0, Number(savedPosition.scrollY) || 0));
    requestAnimationFrame(() => {
      document.documentElement.style.scrollBehavior = previousScrollBehavior;
    });
  }

  function productCard(product) {
    const discount = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : 0;
    return `<article class="product-card">
      <a class="product-image-link" href="produto.html?id=${encodeURIComponent(product.id)}" aria-label="Ver ${product.name}">
        <img src="${imageUrl(product.image, 640)}" alt="${product.name}" loading="lazy">
        ${discount ? `<span class="product-badge">-${discount}%</span>` : ""}
      </a>
      <button class="product-favorite${favorites.includes(product.id) ? " is-favorite" : ""}" aria-label="${favorites.includes(product.id) ? "Remover dos" : "Adicionar aos"} favoritos" aria-pressed="${favorites.includes(product.id)}" data-favorite="${product.id}"><i data-lucide="heart"></i></button>
      <div class="product-rating"><i data-lucide="star"></i> ${product.rating.toFixed(1)} <span>(${product.reviews})</span></div>
      <a class="product-title" href="produto.html?id=${encodeURIComponent(product.id)}">${product.name}</a>
      <div class="product-prices">${product.oldPrice ? `<span class="old-price">${money.format(product.oldPrice)}</span>` : ""}<strong class="product-price">${money.format(product.price)}</strong><span class="installments">ou ${product.installments}x de ${money.format(product.price / product.installments)} sem juros</span></div>
      <button class="button button-dark product-buy" data-add-cart="${product.id}"><i data-lucide="shopping-bag"></i> Comprar</button>
    </article>`;
  }

  function renderProductGroups() {
    document.querySelectorAll("[data-product-grid]").forEach((grid) => {
      const type = grid.dataset.productGrid;
      const limit = Number(grid.dataset.limit) || products.length;
      let list = products;
      if (type === "sale") list = products.filter((product) => product.oldPrice);
      if (type === "featured") list = products.filter((product) => product.featured);
      if (type === "bestseller") list = products.filter((product) => product.bestseller);
      if (type === "related") {
        const current = getCurrentProduct();
        list = products.filter((product) => product.id !== (current && current.id));
      }
      grid.innerHTML = list.slice(0, limit).map(productCard).join("");
    });
  }

  function getCurrentProduct() {
    return products.find((product) => product.id === new URLSearchParams(window.location.search).get("id")) || products[0];
  }

  function renderProductDetail() {
    const container = document.querySelector("[data-product-detail]");
    if (!container) return;
    const product = getCurrentProduct();
    const discount = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : 0;
    const whatsApp = `https://wa.me/5500000000000?text=${encodeURIComponent(`Olá! Gostaria de saber mais sobre o produto ${product.name}.`)}`;
    document.title = `${product.name} | JR Galego Móveis`;
    document.querySelector('meta[name="description"]')?.setAttribute("content", product.description);
    const breadcrumb = document.querySelector("[data-product-breadcrumb]");
    if (breadcrumb) breadcrumb.textContent = product.name;
    setSchema("product-schema", {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.name,
      description: product.description,
      image: imageUrl(product.image, 1100),
      sku: product.id,
      category: product.category,
      brand: { "@type": "Brand", name: "JR Galego Móveis" },
      aggregateRating: { "@type": "AggregateRating", ratingValue: product.rating, reviewCount: product.reviews },
      offers: {
        "@type": "Offer",
        url: window.location.href,
        priceCurrency: "BRL",
        price: product.price.toFixed(2),
        availability: product.stock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
      }
    });
    setSchema("product-breadcrumb-schema", {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Início", item: `${window.location.origin}/` },
        { "@type": "ListItem", position: 2, name: "Móveis", item: `${window.location.origin}/categoria.html` },
        { "@type": "ListItem", position: 3, name: product.name, item: window.location.href }
      ]
    });
    container.innerHTML = `<div class="product-gallery">
      <div class="product-thumbnails"><button class="product-thumbnail active" data-gallery-image="${imageUrl(product.image, 1000)}" aria-label="Ver imagem 1"><img src="${imageUrl(product.image, 150)}" alt=""></button><button class="product-thumbnail" data-gallery-image="${imageUrl("photo-1600210492486-724fe5c67fb0", 1000)}" aria-label="Ver imagem 2"><img src="${imageUrl("photo-1600210492486-724fe5c67fb0", 150)}" alt=""></button><button class="product-thumbnail" data-gallery-image="${imageUrl("photo-1616486338812-3dadae4b4ace", 1000)}" aria-label="Ver imagem 3"><img src="${imageUrl("photo-1616486338812-3dadae4b4ace", 150)}" alt=""></button></div>
      <div class="product-main-image">${discount ? `<span class="product-badge">-${discount}%</span>` : ""}<img src="${imageUrl(product.image, 1100)}" alt="${product.name}" data-main-product-image></div>
    </div><div class="product-summary"><div class="product-rating"><i data-lucide="star"></i> ${product.rating.toFixed(1)} <span>(${product.reviews} avaliações)</span></div><h1>${product.name}</h1><span class="product-sku">Ref. ${product.id.toUpperCase()}</span><p class="product-summary-description">${product.description}</p><div class="detail-price">${product.oldPrice ? `<span class="old-price">${money.format(product.oldPrice)}</span>` : ""}<strong class="product-price">${money.format(product.price)}</strong><span class="installments">ou ${product.installments}x de ${money.format(product.price / product.installments)} sem juros</span></div><hr class="detail-divider"><span class="variation-label">Cor: <span data-selected-color>Natural</span></span><div class="variation-options"><button class="variation-option active" data-color="Natural">Natural</button><button class="variation-option" data-color="Freijó">Freijó</button><button class="variation-option" data-color="Off-white">Off-white</button></div><div class="product-purchase"><div class="quantity-control"><button type="button" aria-label="Diminuir quantidade" data-quantity-minus>−</button><span data-product-quantity>1</span><button type="button" aria-label="Aumentar quantidade" data-quantity-plus>+</button></div><button class="button button-dark" data-add-cart="${product.id}" data-detail-buy><i data-lucide="shopping-bag"></i> Adicionar ao carrinho</button></div><a class="button button-whatsapp" href="${whatsApp}" target="_blank" rel="noopener"><i data-lucide="message-circle"></i> Tirar dúvidas pelo WhatsApp</a><div class="delivery-callout"><i data-lucide="truck"></i><div><strong>Entrega com cuidado</strong><p>Consulte disponibilidade e prazo para sua região com nosso atendimento.</p></div></div></div>`;
    const variationContainer = container.querySelector(".variation-options");
    const colors = [...new Set([product.color, "Natural", "Freijó", "Off-white"])];
    variationContainer.innerHTML = colors.map((color) => `<button class="variation-option${color === product.color ? " active" : ""}" data-color="${color}">${color}</button>`).join("");
    document.querySelector("[data-selected-color]").textContent = product.color;
    document.querySelector("[data-product-description]").textContent = product.description;
    document.querySelector("[data-product-category]").textContent = product.category;
    document.querySelector("[data-product-material]").textContent = product.material;
  }

  function renderCatalog() {
    const grid = document.querySelector('[data-product-grid="catalog"]');
    if (!grid) return;
    const selectedCategory = catalogState.category;
    const title = catalogState.saleOnly ? "Ofertas da semana" : selectedCategory || (catalogState.query ? `Busca: ${catalogState.query}` : "Nossos móveis");
    const description = catalogState.saleOnly ? "Boas escolhas para sua casa com condições especiais por tempo limitado." : selectedCategory ? `Encontre ${selectedCategory.toLowerCase()} para deixar a sua casa ainda mais especial.` : "Peças que unem conforto, beleza e praticidade para transformar o seu lar.";
    document.querySelector("[data-category-title]").textContent = title;
    document.querySelector("[data-category-breadcrumb]").textContent = title;
    document.querySelector("[data-category-description]").textContent = description;
    document.title = `${title} | JR Galego Móveis`;
    const categoryFilters = document.querySelector("[data-category-filters]");
    categoryFilters.innerHTML = categoryNames.map((name) => `<label class="check-filter"><input type="checkbox" value="${name}" data-category-check ${selectedCategory === name ? "checked" : ""}> ${name}</label>`).join("");
    const filtered = products.filter((product) => {
      const matchesCategory = !selectedCategory || product.category === selectedCategory;
      const matchesPrice = product.price <= catalogState.maxPrice;
      const matchesStock = !catalogState.inStock || product.stock;
      const matchesBrand = !catalogState.brand || product.brand === catalogState.brand;
      const matchesColor = !catalogState.color || product.color === catalogState.color;
      const matchesMaterial = !catalogState.material || product.material === catalogState.material;
      const matchesSale = !catalogState.saleOnly || product.oldPrice;
      const needle = catalogState.query.toLocaleLowerCase("pt-BR");
      const matchesQuery = !needle || `${product.name} ${product.category}`.toLocaleLowerCase("pt-BR").includes(needle);
      return matchesCategory && matchesPrice && matchesStock && matchesBrand && matchesColor && matchesMaterial && matchesSale && matchesQuery;
    });
    if (catalogState.sort === "price-asc") filtered.sort((a, b) => a.price - b.price);
    if (catalogState.sort === "price-desc") filtered.sort((a, b) => b.price - a.price);
    if (catalogState.sort === "name") filtered.sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
    const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
    catalogState.page = Number.isInteger(catalogState.page) && catalogState.page > 0
      ? Math.min(catalogState.page, pages)
      : 1;
    const start = (catalogState.page - 1) * pageSize;
    grid.innerHTML = filtered.slice(start, start + pageSize).map(productCard).join("");
    document.querySelector("[data-result-count]").textContent = `${filtered.length} ${filtered.length === 1 ? "produto" : "produtos"}`;
    document.querySelector("[data-empty]").hidden = filtered.length !== 0;
    document.querySelector("[data-pagination]").innerHTML = pages > 1 ? Array.from({ length: pages }, (_, index) => `<button type="button" data-page="${index + 1}" ${catalogState.page === index + 1 ? 'aria-current="page"' : ""} aria-label="Página ${index + 1}">${index + 1}</button>`).join("") : "";
    const priceRange = document.querySelector("[data-price-filter]");
    priceRange.value = String(catalogState.maxPrice);
    document.querySelector("[data-price-label]").textContent = money.format(catalogState.maxPrice);
    document.querySelector("[data-in-stock]").checked = catalogState.inStock;
    document.querySelector("[data-brand-filter]").value = catalogState.brand;
    document.querySelector("[data-color-filter]").value = catalogState.color;
    document.querySelector("[data-material-filter]").value = catalogState.material;
    icons();
  }

  function renderCart() {
    const quantity = cart.reduce((total, item) => total + item.quantity, 0);
    document.querySelectorAll("[data-cart-count]").forEach((element) => element.textContent = String(quantity));
    document.querySelectorAll("[data-cart-label]").forEach((element) => element.textContent = `(${quantity})`);
    document.querySelectorAll("[data-cart-subtotal]").forEach((element) => element.textContent = money.format(cart.reduce((total, item) => {
      const product = products.find((entry) => entry.id === item.id);
      return total + (product ? product.price * item.quantity : 0);
    }, 0)));
    const container = document.querySelector("[data-cart-items]");
    if (!container) return;
    if (!cart.length) {
      container.innerHTML = '<div class="cart-empty"><i data-lucide="shopping-bag"></i><p>Seu carrinho está esperando por boas escolhas.</p></div>';
      icons();
      return;
    }
    container.innerHTML = cart.map((item) => {
      const product = products.find((entry) => entry.id === item.id);
      if (!product) return "";
      return `<article class="cart-item"><img src="${imageUrl(product.image, 180)}" alt=""><div><h3>${product.name}</h3><strong class="cart-item-price">${money.format(product.price)}</strong><div class="quantity-control"><button type="button" aria-label="Diminuir quantidade" data-cart-minus="${product.id}">−</button><span>${item.quantity}</span><button type="button" aria-label="Aumentar quantidade" data-cart-plus="${product.id}">+</button></div></div><button class="cart-item-remove" type="button" aria-label="Remover ${product.name}" data-cart-remove="${product.id}"><i data-lucide="trash-2"></i></button></article>`;
    }).join("");
    icons();
  }

  function addToCart(id, quantity) {
    const product = products.find((item) => item.id === id);
    if (!product) {
      showToast("Não foi possível encontrar este produto.", true);
      return;
    }
    const item = cart.find((entry) => entry.id === id);
    if (item) item.quantity += quantity || 1;
    else cart.push({ id, quantity: quantity || 1 });
    saveStorage(cartKey, cart);
    renderCart();
    openCart();
    showToast(`${product.name} adicionado ao carrinho.`);
  }

  function openCart() {
    document.body.classList.add("drawer-open");
    const drawer = document.querySelector("[data-cart-drawer]");
    if (drawer) drawer.setAttribute("aria-hidden", "false");
  }

  function closeCart() {
    document.body.classList.remove("drawer-open");
    const drawer = document.querySelector("[data-cart-drawer]");
    if (drawer) drawer.setAttribute("aria-hidden", "true");
  }

  function closeMenu() {
    document.body.classList.remove("menu-open");
    document.querySelectorAll("[data-menu-toggle]").forEach((button) => button.setAttribute("aria-expanded", "false"));
  }

  function updateCart(id, delta) {
    const item = cart.find((entry) => entry.id === id);
    if (!item) return;
    item.quantity += delta;
    if (item.quantity <= 0) cart = cart.filter((entry) => entry.id !== id);
    saveStorage(cartKey, cart);
    renderCart();
  }

  function toggleFavorite(id) {
    favorites = favorites.includes(id) ? favorites.filter((item) => item !== id) : [...favorites, id];
    saveStorage(favoriteKey, favorites);
    renderProductGroups();
    renderCatalog();
    showToast(favorites.includes(id) ? "Produto salvo nos favoritos." : "Produto removido dos favoritos.");
  }

  function initNewsletter() {
    const form = document.querySelector("[data-newsletter]");
    if (!form) return;
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      showToast("Obrigado! Seu cadastro foi recebido.");
      form.reset();
    });
  }

  function initMegaMenus() {
    document.querySelectorAll(".nav-mega-wrap").forEach((menu) => {
      menu.addEventListener("mouseenter", () => menu.classList.add("is-open"));
      menu.addEventListener("mouseleave", () => menu.classList.remove("is-open"));
      menu.addEventListener("focusin", () => menu.classList.add("is-open"));
      menu.addEventListener("focusout", (event) => {
        if (!menu.contains(event.relatedTarget)) menu.classList.remove("is-open");
      });
    });
  }

  function initEvents() {
    document.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const link = target.closest(".site-header a[href], .breadcrumbs a[href]");
      if (!link || link.hasAttribute("download") || (link.target && link.target !== "_self")) return;
      rememberNavigationScroll(new URL(link.href, window.location.href));
    }, true);

    document.querySelector(".site-header .search-form")?.addEventListener("submit", (event) => {
      const form = event.currentTarget;
      if (!(form instanceof HTMLFormElement) || form.method.toLowerCase() !== "get") return;
      const destination = new URL(form.action, window.location.href);
      new FormData(form).forEach((value, name) => {
        if (typeof value === "string") destination.searchParams.set(name, value);
      });
      rememberNavigationScroll(destination);
    });

    document.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const add = target.closest("[data-add-cart]");
      if (add) {
        const quantity = add.hasAttribute("data-detail-buy") ? Number(document.querySelector("[data-product-quantity]").textContent) : 1;
        addToCart(add.dataset.addCart, quantity);
      }
      const favorite = target.closest("[data-favorite]");
      if (favorite) toggleFavorite(favorite.dataset.favorite);
      if (target.closest("[data-cart-open]")) openCart();
      if (target.closest("[data-cart-close]")) closeCart();
      const plus = target.closest("[data-cart-plus]");
      if (plus) updateCart(plus.dataset.cartPlus, 1);
      const minus = target.closest("[data-cart-minus]");
      if (minus) updateCart(minus.dataset.cartMinus, -1);
      const remove = target.closest("[data-cart-remove]");
      if (remove) {
        cart = cart.filter((item) => item.id !== remove.dataset.cartRemove);
        saveStorage(cartKey, cart);
        renderCart();
      }
      if (target.closest("[data-menu-toggle]")) {
        const open = document.body.classList.toggle("menu-open");
        target.closest("[data-menu-toggle]").setAttribute("aria-expanded", String(open));
      } else if (target.closest("[data-menu-close]")) {
        closeMenu();
      } else if (document.body.classList.contains("menu-open") && (!target.closest(".main-nav") || target.closest(".main-nav a"))) {
        closeMenu();
      }
      if (target.closest(".mobile-search-toggle")) document.body.classList.toggle("search-open");
      if (target.closest("[data-filter-open]")) document.body.classList.add("filters-open");
      if (target.closest("[data-filter-close]")) document.body.classList.remove("filters-open");
      const pageButton = target.closest(".pagination [data-page]");
      const pageNumber = pageButton ? Number(pageButton.dataset.page) : NaN;
      if (Number.isInteger(pageNumber) && pageNumber > 0) {
        catalogState.page = pageNumber;
        renderCatalog();
        document.querySelector(".catalog-toolbar")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      const scrollRight = target.closest("[data-scroll-right]");
      if (scrollRight) document.getElementById(scrollRight.dataset.scrollRight)?.scrollBy({ left: 320, behavior: "smooth" });
      const scrollLeft = target.closest("[data-scroll-left]");
      if (scrollLeft) document.getElementById(scrollLeft.dataset.scrollLeft)?.scrollBy({ left: -320, behavior: "smooth" });
      const color = target.closest("[data-color]");
      if (color) {
        document.querySelectorAll("[data-color]").forEach((option) => option.classList.toggle("active", option === color));
        document.querySelector("[data-selected-color]").textContent = color.dataset.color;
      }
      if (target.closest("[data-quantity-plus]")) {
        const quantity = document.querySelector("[data-product-quantity]");
        quantity.textContent = String(Number(quantity.textContent) + 1);
      }
      if (target.closest("[data-quantity-minus]")) {
        const quantity = document.querySelector("[data-product-quantity]");
        quantity.textContent = String(Math.max(1, Number(quantity.textContent) - 1));
      }
      const thumbnail = target.closest("[data-gallery-image]");
      if (thumbnail) {
        document.querySelector("[data-main-product-image]").src = thumbnail.dataset.galleryImage;
        document.querySelectorAll(".product-thumbnail").forEach((item) => item.classList.toggle("active", item === thumbnail));
      }
      if (target.closest("[data-checkout]")) {
        event.preventDefault();
        showToast("A finalização será conectada ao WooCommerce nesta etapa de integração.");
      }
    });
    document.addEventListener("change", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLInputElement || target instanceof HTMLSelectElement)) return;
      if (target.matches("[data-category-check]")) {
        catalogState.category = target.checked ? target.value : "";
        catalogState.page = 1;
        renderCatalog();
      }
      if (target.matches("[data-price-filter]")) {
        catalogState.maxPrice = Number(target.value);
        catalogState.page = 1;
        renderCatalog();
      }
      if (target.matches("[data-in-stock]")) {
        catalogState.inStock = target.checked;
        catalogState.page = 1;
        renderCatalog();
      }
      if (target.matches("[data-brand-filter]")) {
        catalogState.brand = target.value;
        catalogState.page = 1;
        renderCatalog();
      }
      if (target.matches("[data-color-filter]")) {
        catalogState.color = target.value;
        catalogState.page = 1;
        renderCatalog();
      }
      if (target.matches("[data-material-filter]")) {
        catalogState.material = target.value;
        catalogState.page = 1;
        renderCatalog();
      }
      if (target.matches("[data-sort]")) {
        catalogState.sort = target.value;
        catalogState.page = 1;
        renderCatalog();
      }
    });
    document.querySelector("[data-clear-filters]")?.addEventListener("click", () => {
      catalogState = { category: "", query: "", saleOnly: false, maxPrice: 5000, brand: "", color: "", material: "", inStock: false, sort: "featured", page: 1 };
      window.history.replaceState({}, "", "categoria.html");
      renderCatalog();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeCart();
        document.body.classList.remove("filters-open", "search-open");
        closeMenu();
      }
    });
  }

  function init() {
    document.querySelectorAll("[data-year]").forEach((item) => item.textContent = String(new Date().getFullYear()));
    if (document.body.dataset.page === "category") {
      const params = new URLSearchParams(window.location.search);
      catalogState.category = params.get("categoria") || "";
      catalogState.query = params.get("q") || "";
      catalogState.saleOnly = params.get("ofertas") === "1";
      setSchema("catalog-breadcrumb-schema", {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Início", item: `${window.location.origin}/` },
          { "@type": "ListItem", position: 2, name: catalogState.category || (catalogState.saleOnly ? "Ofertas" : "Móveis"), item: window.location.href }
        ]
      });
    }
    renderProductGroups();
    renderProductDetail();
    renderCatalog();
    renderCart();
    initEvents();
    initMegaMenus();
    initNewsletter();
    icons();
    restoreNavigationScroll();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
