const ROOT = document.querySelector("#app");
const RESIDENCE_URL = "https://casa-nova-showcase-45.lovable.app/";
const money = (value) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
const esc = (value = "") => String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
const readStore = (key, fallback) => {
  try { const stored = localStorage.getItem(key); return stored ? JSON.parse(stored) : fallback; }
  catch { return fallback; }
};
const saveStore = (key, value) => {
  try { localStorage.setItem(key, JSON.stringify(value)); }
  catch { notify("Não foi possível salvar as alterações neste navegador."); }
};
function notify(message) {
  document.querySelector(".atelier-notice")?.remove();
  const item = document.createElement("div");
  item.className = "atelier-notice";
  item.setAttribute("role", "status");
  item.textContent = message;
  document.body.append(item);
  setTimeout(() => item.remove(), 3200);
}
const KEYBOARD_TYPING_START = 0.75;
const KEYBOARD_AUDIO_START = 0.72;
let keyboardAudio;
let keyboardSoundEnabled = false;
let syncHeroKeyboardAudio = null;

function updateKeyboardSoundButtons() {
  document.querySelectorAll('[data-action="keyboard-sound"]').forEach((button) => {
    button.setAttribute("aria-pressed", String(keyboardSoundEnabled));
    button.textContent = keyboardSoundEnabled ? "Silenciar som do teclado" : "Ativar som do teclado";
  });
}

function stopKeyboardAudio(reset = false) {
  if (!keyboardAudio) return;
  keyboardAudio.pause();
  if (reset) keyboardAudio.currentTime = 0;
}

function playKeyboardAudio(startTime) {
  keyboardAudio.currentTime = startTime;
  keyboardAudio.play().catch((error) => {
    if (!keyboardSoundEnabled) return;
    keyboardSoundEnabled = false;
    updateKeyboardSoundButtons();
    stopKeyboardAudio();
    if (error.name === "NotAllowedError") {
      notify("O navegador bloqueou o áudio. Clique novamente para tentar reproduzir.");
      return;
    }
    console.error("Não foi possível reproduzir o áudio de teclado.", error);
    if (!keyboardAudio.error) notify("Não foi possível reproduzir o áudio de teclado.");
  });
}

function toggleKeyboardSound(button) {
  if (!keyboardAudio) {
    keyboardAudio = new Audio(new URL("./assets/audio/keyboard-sound.mp3", document.baseURI));
    keyboardAudio.preload = "auto";
    keyboardAudio.addEventListener("error", () => {
      keyboardSoundEnabled = false;
      updateKeyboardSoundButtons();
      console.error("Não foi possível carregar assets/audio/keyboard-sound.mp3.", keyboardAudio.error);
      notify("Não foi possível carregar o áudio de teclado.");
    });
  }

  keyboardSoundEnabled = button.getAttribute("aria-pressed") !== "true";
  updateKeyboardSoundButtons();

  if (!keyboardSoundEnabled) {
    stopKeyboardAudio(true);
    return;
  }

  syncHeroKeyboardAudio?.();
  if (keyboardAudio.paused) playKeyboardAudio(0);
}
function route() { return location.hash.replace(/^#\/?/, "") || ""; }
function navTo(path) { location.hash = `/${path}`; }

const projects = [
  {
    id: "residence", title: "RESIDENCE", category: "Web design · Real estate",
    description: "Landing page de arquitetura contemporânea com foco em direção de arte, narrativa visual e experiência digital.",
    tags: ["Landing page", "Arquitetura"],
    featured: true,
    cover: `<div class="card-cover card-cover-residence"><img src="https://casa-nova-showcase-45.lovable.app/assets/fachada-BFyZFc2J.jpg" alt="Fachada contemporânea da demonstração RESIDENCE" loading="lazy" decoding="async" onerror="this.parentElement.classList.add('image-unavailable'); this.remove()"><span class="cover-tint"></span><span class="cover-label">Experiência visual · 01</span></div>`,
  },
  {
    id: "moneta", title: "MONETA", category: "SaaS · Fintech · Dashboard",
    description: "Dashboard financeiro demonstrativo com transações, orçamentos, gráficos e relatórios interativos.",
    tags: ["JavaScript", "Local storage", "CSV"],
    cover: `<div class="card-cover card-cover-moneta"><img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1100&q=85" alt="Notebook exibindo uma interface de gráficos financeiros" loading="lazy" decoding="async" onerror="this.parentElement.classList.add('image-unavailable'); this.remove()"><div class="mono-cover"><div class="eyebrow">MONETA · RESUMO</div><div class="mini-dashboard" aria-hidden="true"><div class="mini-rail"></div><div class="mini-content"><div class="mini-chip"></div><div class="mini-panels"><i class="mini-chip"></i><i class="mini-chip"></i><i class="mini-chip"></i></div><div class="mini-chart"></div></div></div></div><span class="cover-tint"></span><span class="cover-label">Painel financeiro · 02</span></div>`,
  },
  {
    id: "atelier", title: "ATELIER", category: "E-commerce · Fashion · UI",
    description: "E-commerce demonstrativo de moda com catálogo, filtros, favoritos, carrinho e fluxo de checkout.",
    tags: ["JavaScript", "Local storage", "E-commerce"],
    cover: `<div class="card-cover atelier-cover"><img src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1100&q=85" alt="Look de moda em composição editorial urbana" loading="lazy" decoding="async" onerror="this.parentElement.classList.add('image-unavailable'); this.remove()"><span class="cover-tint"></span><span class="cover-label">Moda · 03</span></div>`,
  },
];

const skillIcons = {
  code: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 7-5 5 5 5M16 7l5 5-5 5M14 4l-4 16"/></svg>',
  html: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 3h14l-1.3 15L12 21l-5.7-3L5 3Z M8 7h8l-.3 3H9l.3 3h6l-.3 3-3 1.5-3-1.5-.2-2"/></svg>',
  css: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 3h14l-1.3 15L12 21l-5.7-3L5 3Z M8 7h8l-.3 3H9l.3 3h6l-.3 3-3 1.5-3-1.5"/></svg>',
  javascript: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h16v16H4zM13 9v6a2 2 0 0 1-4 0m7-1a2 2 0 0 0 4 0c0-2-4-1-4-3a2 2 0 0 1 4 0"/></svg>',
  screen: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8m-4-4v4"/></svg>',
  chart: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 15v-3m5 3V8m5 7v-5"/></svg>',
  storage: '<svg viewBox="0 0 24 24" aria-hidden="true"><ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5m-16 7c0 1.7 3.6 3 8 3s8-1.3 8-3"/></svg>',
  page: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8m-8 4h5m-5 4h8"/></svg>',
  shop: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h16l-1 11H5L4 9ZM8 9V6a4 4 0 0 1 8 0v3"/></svg>',
  git: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="7" cy="5" r="2"/><circle cx="17" cy="19" r="2"/><circle cx="17" cy="7" r="2"/><path d="M7 7v7a5 5 0 0 0 5 5h3m-3-12h3"/></svg>',
};

const skills = [
  { name: "HTML5", category: "Front-end", icon: "html", description: "Estrutura das páginas do portfólio e das demonstrações." },
  { name: "CSS3", category: "Front-end", icon: "css", description: "Estilos, layouts responsivos e interações visuais." },
  { name: "JavaScript", category: "Front-end", icon: "javascript", description: "Interações, filtros e comportamento das demonstrações." },
  { name: "Interfaces responsivas", category: "Front-end", icon: "screen", description: "Adaptação das interfaces a diferentes tamanhos de tela." },
  { name: "Dashboards demonstrativos", category: "SaaS & APIs", icon: "chart", description: "Painel financeiro demonstrativo do projeto MONETA." },
  { name: "Persistência no navegador", category: "SaaS & APIs", icon: "storage", description: "Dados de demonstração armazenados com localStorage." },
  { name: "Landing pages", category: "UI/UX & Landing Pages", icon: "page", description: "Páginas de apresentação como a demonstração RESIDENCE." },
  { name: "E-commerce demonstrativo", category: "UI/UX & Landing Pages", icon: "shop", description: "Catálogo e interações de compra demonstrativas no ATELIER." },
  { name: "Git & GitHub", category: "Ferramentas & IA", icon: "git", description: "Versionamento do projeto e hospedagem em repositório GitHub." },
];

function skillCard(skill, index) {
  return `<article class="skill-card" tabindex="0" style="--card-index:${index}"><span class="skill-icon">${skillIcons[skill.icon]}</span><span class="skill-category">${skill.category}</span><h3>${skill.name}</h3><p>${skill.description}</p></article>`;
}

function initializeSkills() {
  const grid = ROOT.querySelector("#skills-grid");
  const revealElements = ROOT.querySelectorAll(".skills-header, .skills-highlight");
  const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
  const tiltEnabled = window.matchMedia("(hover: hover) and (pointer: fine)");
  const observer = "IntersectionObserver" in window && !motionPreference.matches
    ? new IntersectionObserver((entries, intersectionObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        intersectionObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -24px 0px" })
    : null;

  const reveal = (element) => {
    if (observer) observer.observe(element);
    else element.classList.add("is-visible");
  };
  revealElements.forEach(reveal);

  grid.innerHTML = skills.map(skillCard).join("");
  grid.querySelectorAll(".skill-card").forEach((card, index) => {
    card.style.setProperty("--card-index", index);
    reveal(card);
    if (!tiltEnabled.matches || motionPreference.matches) return;
    card.addEventListener("pointermove", (event) => {
      const bounds = card.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;
      card.style.setProperty("--pointer-x", `${(x + 0.5) * 100}%`);
      card.style.setProperty("--pointer-y", `${(y + 0.5) * 100}%`);
      card.style.setProperty("--tilt-x", `${-y * 4}deg`);
      card.style.setProperty("--tilt-y", `${x * 4}deg`);
    });
    card.addEventListener("pointerleave", () => {
      card.style.setProperty("--tilt-x", "0deg");
      card.style.setProperty("--tilt-y", "0deg");
    });
  });
}

const heroCharacterConfig = {
  videoSrc: "./assets/videos/portifolio animação.mp4",
  videoType: "video/mp4",
  fallbackSrc: "./assets/developer-fullstack.png",
  width: 640,
  height: 974,
  glow: 0.12,
  position: "center",
};

function heroCharacter(config = heroCharacterConfig) {
  const video = config.videoSrc
    ? `<video class="hero-character-video" autoplay muted loop playsinline webkit-playsinline preload="metadata" aria-hidden="true" poster="${esc(config.fallbackSrc)}"><source data-src="${esc(config.videoSrc)}" type="${esc(config.videoType)}"></video>`
    : "";
  return `<figure class="hero-portrait" style="--hero-portrait-width:${config.width}px;--hero-portrait-height:${config.height}px;--hero-portrait-aspect:${config.width}/${config.height};--hero-glow-strength:${config.glow};--hero-portrait-justify:${config.position}">
    <div class="hero-character-motion">
      ${video}
      <img class="hero-character-image" src="${esc(config.fallbackSrc)}" alt="Desenvolvedor Full Stack vestido de preto, segurando um notebook diante de interfaces de programação em neon azul." width="768" height="1152" fetchpriority="high" decoding="async">
    </div>
  </figure>`;
}

let heroCharacterCleanup = null;

function initializePortfolioNavigation() {
  const nav = ROOT.querySelector(".portfolio-header .main-nav");
  if (!nav) return;
  const links = [...nav.querySelectorAll('a[href^="#"]')];
  const sections = links.map((link) => ROOT.querySelector(link.getAttribute("href"))).filter(Boolean);
  if (!("IntersectionObserver" in window)) return;
  const observer = new IntersectionObserver((entries) => {
    const active = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!active) return;
    links.forEach((link) => {
      if (link.getAttribute("href") === `#${active.target.id}`) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  }, { rootMargin: "-20% 0px -65% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] });
  sections.forEach((section) => observer.observe(section));
}

function initializeHeroCharacter() {
  heroCharacterCleanup?.();
  heroCharacterCleanup = null;
  syncHeroKeyboardAudio = null;

  const figure = ROOT.querySelector(".hero-portrait");
  const video = figure?.querySelector(".hero-character-video");
  if (!video) return;

  video.muted = true;
  video.defaultMuted = true;
  video.playsInline = true;

  const source = video.querySelector("source");
  const videoSrc = source?.dataset.src;
  if (!source || !videoSrc) return;

  syncHeroKeyboardAudio = () => {
    if (!keyboardAudio) return;

    if (
      !keyboardSoundEnabled ||
      document.hidden ||
      video.paused ||
      video.ended ||
      !video.isConnected ||
      !figure.classList.contains("video-ready")
    ) {
      stopKeyboardAudio();
      return;
    }

    const targetTime = Math.max(0, KEYBOARD_AUDIO_START + video.currentTime - KEYBOARD_TYPING_START);
    if (Number.isFinite(keyboardAudio.duration) && targetTime >= keyboardAudio.duration) {
      stopKeyboardAudio();
      return;
    }

    if (keyboardAudio.paused) {
      playKeyboardAudio(targetTime);
      return;
    }

    if (Math.abs(keyboardAudio.currentTime - targetTime) > 0.35) {
      keyboardAudio.currentTime = targetTime;
    }
  };
  const syncAudio = () => syncHeroKeyboardAudio?.();
  const pauseAudio = () => stopKeyboardAudio();

  const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
  const setMotionPreference = () => {
    if (motionPreference.matches) {
      video.pause();
      source.removeAttribute("src");
      video.load();
      figure.classList.remove("video-ready", "video-unavailable");
      return;
    }

    source.src = videoSrc;
    figure.classList.remove("video-unavailable");
    video.load();
    video.play().catch((error) => {
      if (motionPreference.matches) return;
      console.warn("A reprodução automática do vídeo do personagem foi bloqueada; exibindo a imagem de fallback.", error);
      figure.classList.remove("video-ready");
      figure.classList.add("video-unavailable");
    });
  };

  const handleLoadedData = () => {
    if (!motionPreference.matches) {
      figure.classList.add("video-ready");
      syncAudio();
    }
  };
  const handleError = () => {
    if (motionPreference.matches) return;
    pauseAudio();
    console.warn("O vídeo do personagem não pôde ser carregado; exibindo a imagem de fallback.");
    figure.classList.remove("video-ready");
    figure.classList.add("video-unavailable");
  };
  video.addEventListener("loadeddata", handleLoadedData);
  video.addEventListener("error", handleError);
  video.addEventListener("timeupdate", syncAudio);
  video.addEventListener("play", syncAudio);
  video.addEventListener("pause", pauseAudio);
  video.addEventListener("seeking", pauseAudio);
  video.addEventListener("seeked", syncAudio);
  video.addEventListener("ended", pauseAudio);
  document.addEventListener("visibilitychange", syncAudio);
  window.addEventListener("pagehide", pauseAudio);
  if (typeof motionPreference.addEventListener === "function") {
    motionPreference.addEventListener("change", setMotionPreference);
  } else {
    motionPreference.addListener(setMotionPreference);
  }
  heroCharacterCleanup = () => {
    video.removeEventListener("loadeddata", handleLoadedData);
    video.removeEventListener("error", handleError);
    video.removeEventListener("timeupdate", syncAudio);
    video.removeEventListener("play", syncAudio);
    video.removeEventListener("pause", pauseAudio);
    video.removeEventListener("seeking", pauseAudio);
    video.removeEventListener("seeked", syncAudio);
    video.removeEventListener("ended", pauseAudio);
    document.removeEventListener("visibilitychange", syncAudio);
    window.removeEventListener("pagehide", pauseAudio);
    if (typeof motionPreference.removeEventListener === "function") {
      motionPreference.removeEventListener("change", setMotionPreference);
    } else {
      motionPreference.removeListener(setMotionPreference);
    }
    syncHeroKeyboardAudio = null;
    stopKeyboardAudio(true);
    video.pause();
  };
  setMotionPreference();
}

function portfolio() {
  document.title = "RT STUDIO — Projetos em destaque";
  document.body.className = "";
  ROOT.innerHTML = `
    <header class="site-header portfolio-header"><div class="shell topbar">
      <a class="brand brand-image" href="#/" aria-label="RT STUDIO — início"><span class="brand-symbol" aria-hidden="true"></span><span class="brand-wordmark" aria-hidden="true"></span></a>
      <nav class="main-nav" aria-label="Navegação principal"><a href="#projetos">Projetos</a><a href="#habilidades">Habilidades</a><a href="#sobre">Sobre</a><a class="nav-pill" href="https://wa.me/5519983191689" target="_blank" rel="noopener noreferrer">Contato ↗</a></nav>
    </div></header>
    <main>
      <section class="hero shell">
        <div class="hero-grid"><div>
          <h1>Ideias viram<br><span>experiências.</span></h1>
          <p class="hero-copy">Interfaces pensadas com intenção. Produtos digitais demonstrativos que exploram design, lógica e experiência em diferentes contextos.</p>
          <div class="hero-actions"><a class="button button-primary" href="#projetos">Explorar projetos <span aria-hidden="true">↓</span></a><a class="button button-quiet" href="mailto:contato@rtstudio.dev">Vamos conversar ↗</a><button class="button button-quiet" type="button" data-action="keyboard-sound" aria-pressed="${keyboardSoundEnabled}">${keyboardSoundEnabled ? "Silenciar som do teclado" : "Ativar som do teclado"}</button></div>
        </div>
        ${heroCharacter()}
        </div>
      </section>
      <section class="section shell" id="projetos"><div class="section-heading"><div><span class="eyebrow">ESTUDOS DE PRODUTO</span><h2>Projetos em destaque</h2></div><p>Projetos que transformam ideias em experiências digitais. Interfaces demonstrativas, com escopo transparente e interações reais.</p></div>
        <div class="project-grid">${projects.map((project) => `<article class="project-card${project.featured ? " project-card-featured" : ""}">${project.cover}<div class="card-body"><span class="card-category">${project.category}</span><h3 class="card-title">${project.title}</h3><p class="card-description">${project.description}</p><div class="tag-list">${project.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}</div><div class="card-actions"><a class="button button-primary button-small" href="#/${project.id}">Ver projeto ↗</a>${project.id === "residence" ? `<a class="button button-small" href="${RESIDENCE_URL}" target="_blank" rel="noopener noreferrer">Demonstração publicada ↗</a>` : ""}${project.repository ? `<a class="button button-small" href="${project.repository}" target="_blank" rel="noopener noreferrer">Ver código ↗</a>` : ""}</div></div></article>`).join("")}</div>
      </section>
      <section class="skills-section section shell" id="habilidades" aria-labelledby="skills-title">
        <header class="skills-header">
          <div><span class="eyebrow">SKILLS &amp; EXPERTISE</span><h2 id="skills-title">Minhas habilidades.</h2></div>
          <p>Desenvolvimento, segurança e tecnologia transformados em soluções digitais.</p>
        </header>
        <aside class="skills-highlight">
          <div class="skills-highlight-copy"><span class="eyebrow">CURIOSIDADE EM MOVIMENTO</span><h3>Tecnologia em constante evolução.</h3><p>Exploro novas ferramentas, desenvolvo projetos práticos e aprimoro minhas habilidades para construir experiências digitais cada vez melhores.</p></div>
          <img class="skills-setup-image" src="./assets/developer-setup.png" alt="Setup de desenvolvimento de software com notebook exibindo código, painéis de programação e iluminação azul sobre uma mesa escura." width="690" height="505" loading="lazy" decoding="async">
        </aside>
        <div class="skills-grid" id="skills-grid" aria-label="Habilidades demonstradas"></div>
        <p class="skills-note">Tecnologias e práticas apresentadas com base nos projetos deste portfólio; sem níveis de domínio presumidos.</p>
      </section>
      <section class="about-section shell" id="sobre" aria-labelledby="about-title">
        <div class="about-copy">
          <h2 id="about-title">Por trás do código,<br><span>existe uma ideia.</span></h2>
          <p>Eu sou o Rafael Henrique, desenvolvedor apaixonado por tecnologia, performance e design. Acredito que um bom projeto vai além do código — ele precisa resolver problemas, criar experiências e gerar valor de verdade.</p>
          <p>Aqui no RT STUDIO, transformo ideias em soluções digitais modernas, com foco em qualidade, usabilidade e inovação.</p>
          <a class="button button-quiet about-profile" href="https://www.linkedin.com/in/rafaeltomadon" target="_blank" rel="noopener noreferrer">Conheça meu perfil <span aria-hidden="true">→</span></a>
        </div>
        <div class="about-mark" aria-hidden="true">&lt;/&gt;</div>
        <pre class="about-code" aria-label="Exemplo de código JavaScript"><code><span class="code-keyword">const</span> developer = {
  name: <span class="code-string">"Rafael Henrique"</span>,
  role: <span class="code-string">"Full Stack Developer"</span>,
  mindset: <span class="code-string">"Build the future"</span>
};

console.log(developer.mindset);
<span class="code-comment">// Build the future</span></code></pre>
      </section>
    </main><footer class="site-footer"><div class="shell footer-row"><span>© 2026 RT STUDIO · projetos demonstrativos</span><a class="text-link" href="#/">Voltar ao início ↑</a></div></footer>`;
  initializeHeroCharacter();
  initializeSkills();
  initializePortfolioNavigation();
}

const residenceImages = [
  ["https://casa-nova-showcase-45.lovable.app/assets/fachada-BFyZFc2J.jpg", "Fachada contemporânea"],
  ["https://casa-nova-showcase-45.lovable.app/assets/sala-GSHmV69X.jpg", "Living integrado"],
  ["https://casa-nova-showcase-45.lovable.app/assets/cozinha-B_GA5yoj.jpg", "Cozinha gourmet"],
  ["https://casa-nova-showcase-45.lovable.app/assets/suite-DsCkmQzi.jpg", "Suíte master"],
  ["https://casa-nova-showcase-45.lovable.app/assets/piscina-BuwE5IXR.jpg", "Piscina e deck"],
];
function residence() {
  document.title = "RESIDENCE — estudo arquitetônico · RT STUDIO";
  document.body.className = "residence-page";
  ROOT.innerHTML = `<header class="site-header"><div class="shell topbar"><a class="brand" href="#/"><span class="brand-mark">RT</span> RT STUDIO</a><nav class="main-nav" aria-label="Navegação do projeto"><a href="#/">Portfólio</a><a href="#residence-conceito">Conceito</a><a href="#residence-galeria">Galeria</a><a href="#residence-contato">Contato</a></nav></div></header>
  <main><section class="residence-hero"><div class="shell"><span class="eyebrow">ESTUDO DE DIREÇÃO DE ARTE · RESIDENCE</span><h1>Arquitetura<br>que transcende o tempo.</h1><p>Espaços extraordinários, desenhados para uma forma de viver única. Uma demonstração visual de narrativa imobiliária e design digital.</p><div class="hero-actions"><a class="button button-primary" href="#residence-conceito">Explorar residência ↓</a><a class="button" href="#residence-contato">Agendar conversa</a></div></div></section>
    <section class="res-section shell res-intro" id="residence-conceito"><div><span class="eyebrow">O CONCEITO</span><h2>Linhas limpas.<br>Materiais naturais.<br>Espaços para viver.</h2><p>Uma exploração visual de arquitetura contemporânea: volumes geométricos, luz natural, madeira e paisagismo se encontram em uma composição serena.</p><p class="demo-banner">Estudo demonstrativo de design. As imagens e informações do imóvel nesta página não constituem oferta imobiliária verificada.</p></div><div class="res-facts"><div class="res-fact"><strong>Forma</strong><span>Composição contemporânea</span></div><div class="res-fact"><strong>Luz</strong><span>Arquitetura luminosa</span></div><div class="res-fact"><strong>Matéria</strong><span>Texturas naturais</span></div><div class="res-fact"><strong>Verde</strong><span>Integração paisagística</span></div></div></section>
    <section class="res-section shell" id="residence-galeria"><span class="eyebrow">GALERIA</span><h2>Uma experiência em cada ambiente.</h2><div class="res-gallery">${residenceImages.map(([src, alt]) => `<img src="${src}" alt="${alt} — imagem da demonstração RESIDENCE" loading="lazy">`).join("")}</div></section>
    <section class="res-section shell res-intro"><div><span class="eyebrow">EXPERIÊNCIA DIGITAL</span><h2>Uma visita visual,<br>antes de chegar.</h2><p>Composição responsiva, organização editorial de conteúdo e navegação entre seções foram pensadas para apresentar o conceito com clareza em diferentes telas.</p><a class="button button-primary" href="${RESIDENCE_URL}" target="_blank" rel="noopener noreferrer">Ver demonstração publicada ↗</a></div><div><img src="${residenceImages[1][0]}" alt="Living da página de demonstração RESIDENCE" loading="lazy" style="width:100%;height:360px;object-fit:cover;border-radius:7px"></div></section>
    <section class="res-section shell" id="residence-contato"><div class="res-contact"><span class="eyebrow">CONTATO</span><h2>Vamos falar sobre o projeto?</h2><p>Formulário demonstrativo: os dados não são enviados a um serviço externo.</p><form id="residence-form"><label class="field">Nome<input name="name" autocomplete="name" required maxlength="100"></label><label class="field">E-mail<input name="email" type="email" autocomplete="email" required maxlength="160"></label><label class="field">Mensagem<textarea name="message" required maxlength="1000"></textarea></label><button class="button button-primary" type="submit">Enviar demonstração</button><span id="residence-result" role="status"></span></form></div></section>
  </main><footer class="site-footer"><div class="shell footer-row"><span>RESIDENCE · estudo demonstrativo · RT STUDIO</span><a href="#/">Voltar ao portfólio ↑</a></div></footer>`;
}

const defaultTransactions = [
  { id: "m1", description: "Projeto identidade visual", category: "Trabalho", date: "2026-10-04", type: "income", amount: 4800 },
  { id: "m2", description: "Aluguel do escritório", category: "Moradia", date: "2026-10-03", type: "expense", amount: 1650 },
  { id: "m3", description: "Mercado da semana", category: "Alimentação", date: "2026-10-02", type: "expense", amount: 286.5 },
  { id: "m4", description: "Consultoria de produto", category: "Trabalho", date: "2026-09-27", type: "income", amount: 2100 },
  { id: "m5", description: "Transporte", category: "Transporte", date: "2026-09-23", type: "expense", amount: 145 },
  { id: "m6", description: "Conta de energia", category: "Moradia", date: "2026-09-20", type: "expense", amount: 198.4 },
  { id: "m7", description: "Venda de ilustração", category: "Trabalho", date: "2026-09-17", type: "income", amount: 950 },
  { id: "m8", description: "Cinema", category: "Lazer", date: "2026-09-12", type: "expense", amount: 76 },
];
let transactions = readStore("rt-moneta-transactions", defaultTransactions);
let budgets = readStore("rt-moneta-budgets", { Alimentação: 1200, Moradia: 2100, Transporte: 600, Lazer: 400, Saúde: 350 });
let monetaView = "overview";
let transactionFilter = { search: "", category: "", type: "", sort: "date-desc" };
const expenseCategories = ["Alimentação", "Moradia", "Transporte", "Lazer", "Saúde", "Educação", "Outros"];
const incomeCategories = ["Trabalho", "Investimentos", "Vendas", "Outros"];
const monthNames = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
function totals() {
  const now = new Date();
  const sameMonth = transactions.filter((item) => {
    const date = new Date(`${item.date}T12:00:00`);
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  });
  const income = sameMonth.filter((item) => item.type === "income").reduce((sum, item) => sum + item.amount, 0);
  const expense = sameMonth.filter((item) => item.type === "expense").reduce((sum, item) => sum + item.amount, 0);
  return { income, expense, savings: income - expense, balance: transactions.reduce((sum, item) => sum + (item.type === "income" ? item.amount : -item.amount), 0) };
}
function sortedTransactions(sort = "date-desc") {
  return [...transactions].sort((a, b) => sort === "amount-desc" ? b.amount - a.amount : sort === "amount-asc" ? a.amount - b.amount : sort === "date-asc" ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date));
}
function chartBars() {
  const now = new Date();
  const months = Array.from({ length: 6 }, (_, i) => new Date(now.getFullYear(), now.getMonth() - 5 + i, 1));
  const grouped = months.map((month) => {
    const rows = transactions.filter((item) => { const date = new Date(`${item.date}T12:00:00`); return date.getMonth() === month.getMonth() && date.getFullYear() === month.getFullYear(); });
    return { label: monthNames[month.getMonth()], income: rows.filter((item) => item.type === "income").reduce((s, x) => s + x.amount, 0), expense: rows.filter((item) => item.type === "expense").reduce((s, x) => s + x.amount, 0) };
  });
  const max = Math.max(1, ...grouped.flatMap((item) => [item.income, item.expense]));
  return grouped.map((item) => `<div class="chart-group"><i style="height:${Math.max(4, item.income / max * 100)}%"></i><i style="height:${Math.max(4, item.expense / max * 100)}%"></i><span>${item.label}</span></div>`).join("");
}
function recentTable(rows, withActions = false) {
  if (!rows.length) return `<p class="muted">Nenhuma movimentação encontrada.</p>`;
  return `<div class="table-wrap"><table class="data-table"><thead><tr><th>Descrição</th><th>Categoria</th><th>Data</th><th>Tipo</th><th>Valor</th>${withActions ? "<th>Ações</th>" : ""}</tr></thead><tbody>${rows.map((item) => `<tr><td>${esc(item.description)}</td><td>${esc(item.category)}</td><td>${new Date(`${item.date}T12:00:00`).toLocaleDateString("pt-BR")}</td><td>${item.type === "income" ? "Receita" : "Despesa"}</td><td class="${item.type === "income" ? "amount-positive" : "amount-negative"}">${item.type === "income" ? "+" : "−"} ${money(item.amount)}</td>${withActions ? `<td><div class="table-actions"><button class="inline-button" data-edit="${esc(item.id)}">Editar</button><button class="inline-button" data-delete="${esc(item.id)}">Excluir</button></div></td>` : ""}</tr>`).join("")}</tbody></table></div>`;
}
function monetaHeader() {
  const links = [["overview", "Visão geral"], ["transactions", "Transações"], ["budgets", "Orçamentos"], ["reports", "Relatórios"], ["settings", "Configurações"]];
  return `<header class="app-topbar"><div class="shell topbar"><a class="brand mono-brand" href="#/"><span class="brand-mark">RT</span> <span style="color:#f4f5f7">MONETA</span></a><nav class="app-nav" aria-label="Navegação MONETA">${links.map(([id, label]) => `<a href="#/moneta/${id}" ${monetaView === id ? 'aria-current="page"' : ""}>${label}</a>`).join("")}</nav><a class="button button-small" href="#/">← Portfólio</a></div></header>`;
}
function statCard(label, amount, note) { return `<div class="stat-card"><span class="stat-label">${label}</span><strong class="stat-value">${money(amount)}</strong><span class="stat-note">${note}</span></div>`; }
function overviewView() {
  const t = totals();
  const categories = [...new Set(transactions.filter((x) => x.type === "expense").map((x) => x.category))];
  const sums = categories.map((name) => ({ name, value: transactions.filter((x) => x.type === "expense" && x.category === name).reduce((s, x) => s + x.amount, 0) }));
  const palette = ["#b7f36b", "#779fe8", "#d9a778", "#a586d8", "#ffffff30", "#6ebbb1"];
  let turn = 0; const totalExpense = sums.reduce((s, x) => s + x.value, 0);
  const donut = sums.map((x, index) => {
    const from = turn;
    turn += totalExpense ? x.value / totalExpense * 100 : 0;
    return `${palette[index % palette.length]} ${from}% ${turn}%`;
  }).join(", ");
  return `<div class="stat-grid">${statCard("Saldo acumulado", t.balance, "Soma demonstrativa de movimentações")}${statCard("Receitas do mês", t.income, "Valores de exemplo")}${statCard("Despesas do mês", t.expense, "Valores de exemplo")}${statCard("Economia do mês", t.savings, "Cálculo sobre estes dados")}</div>
    <div class="chart-grid"><section class="panel"><div class="panel-head"><h2>Receitas e despesas</h2><div class="legend"><span><b></b>Receitas</span><span><b class="blue"></b>Despesas</span></div></div><div class="chart-bars">${chartBars()}</div></section>
    <section class="panel"><div class="panel-head"><h2>Distribuição de despesas</h2><span class="muted" style="font-size:10px">Por categoria</span></div><div class="donut-wrap"><div style="position:relative"><div class="donut" style="background:${sums.length ? `conic-gradient(${donut})` : "conic-gradient(#ffffff19 0 100%)"}"></div><div class="donut-center"><strong>${money(totalExpense)}</strong>Total demo</div></div></div><div class="legend" style="flex-wrap:wrap">${sums.slice(0, 4).map((item, i) => `<span><b style="background:${palette[i % palette.length]}"></b>${esc(item.name)}</span>`).join("")}</div></section></div>
    <section class="panel" style="margin-top:14px"><div class="panel-head"><h2>Movimentações recentes</h2><a class="inline-button" href="#/moneta/transactions">Ver todas →</a></div>${recentTable(sortedTransactions().slice(0, 5))}</section>`;
}
function transactionView() {
  const rows = sortedTransactions(transactionFilter.sort).filter((item) => (!transactionFilter.search || item.description.toLowerCase().includes(transactionFilter.search.toLowerCase())) && (!transactionFilter.category || item.category === transactionFilter.category) && (!transactionFilter.type || item.type === transactionFilter.type));
  return `<section class="panel"><div class="panel-head"><h2>Movimentações</h2><button class="button button-primary button-small" data-action="add-transaction">+ Nova transação</button></div><div class="filter-row" style="margin-bottom:15px"><input class="control" aria-label="Buscar descrição" placeholder="Buscar descrição..." data-filter="search" value="${esc(transactionFilter.search)}"><select class="control" aria-label="Filtrar categoria" data-filter="category"><option value="">Todas as categorias</option>${[...new Set([...expenseCategories, ...incomeCategories])].map((x) => `<option ${transactionFilter.category === x ? "selected" : ""}>${x}</option>`).join("")}</select><select class="control" aria-label="Filtrar tipo" data-filter="type"><option value="">Todos os tipos</option><option value="income" ${transactionFilter.type === "income" ? "selected" : ""}>Receitas</option><option value="expense" ${transactionFilter.type === "expense" ? "selected" : ""}>Despesas</option></select><select class="control" aria-label="Ordenar movimentações" data-filter="sort"><option value="date-desc" ${transactionFilter.sort === "date-desc" ? "selected" : ""}>Data ↓</option><option value="date-asc" ${transactionFilter.sort === "date-asc" ? "selected" : ""}>Data ↑</option><option value="amount-desc" ${transactionFilter.sort === "amount-desc" ? "selected" : ""}>Valor ↓</option><option value="amount-asc" ${transactionFilter.sort === "amount-asc" ? "selected" : ""}>Valor ↑</option></select><button class="button button-small" data-action="clear-filters">Limpar</button></div>${recentTable(rows, true)}</section>`;
}
function budgetsView() {
  const lines = Object.entries(budgets).map(([category, limit]) => {
    const now = new Date();
    const spent = transactions.filter((x) => {
      const date = new Date(`${x.date}T12:00:00`);
      return x.type === "expense" && x.category === category && date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    }).reduce((s, x) => s + x.amount, 0);
    const ratio = limit > 0 ? Math.min(100, spent / limit * 100) : 0;
    return `<div class="budget-line"><strong>${esc(category)}</strong><span>${money(spent)} de ${money(limit)}</span><div class="progress"><i style="width:${ratio}%;${ratio >= 90 ? "background:#f08b8b" : ""}"></i></div></div>`;
  }).join("");
  return `<div class="chart-grid"><section class="panel"><div class="panel-head"><h2>Orçamentos demonstrativos</h2><button class="button button-primary button-small" data-action="add-budget">+ Categoria</button></div><div class="budget-list">${lines || "<p class='muted'>Cadastre um orçamento para começar.</p>"}</div></section><section class="panel"><h2>Como funciona</h2><p class="muted" style="font-size:12px;line-height:1.8;margin:12px 0">Os valores utilizados são calculados a partir das despesas registradas nesta demonstração. Cadastre, edite ou exclua transações para ver a atualização do consumo por categoria.</p></section></div>`;
}
function reportsView() {
  const incomes = transactions.filter((x) => x.type === "income").reduce((s, x) => s + x.amount, 0);
  const expenses = transactions.filter((x) => x.type === "expense").reduce((s, x) => s + x.amount, 0);
  return `<section class="panel"><div class="panel-head"><div><h2>Relatório geral</h2><span class="muted" style="font-size:10px">Conjunto atual de dados demonstrativos</span></div><button class="button button-primary button-small" data-action="export-csv">Exportar CSV ↓</button></div><div class="stat-grid">${statCard("Receitas no período", incomes, "Todas as receitas cadastradas")}${statCard("Despesas no período", expenses, "Todas as despesas cadastradas")}${statCard("Resultado", incomes - expenses, "Receitas menos despesas")}${statCard("Movimentações", transactions.length, "Registros demonstrativos")}</div><div style="margin-top:18px">${recentTable(sortedTransactions())}</div></section>`;
}
function settingsView() {
  return `<section class="panel" style="max-width:650px"><h2>Preferências</h2><p class="muted" style="font-size:12px;line-height:1.7">Esta experiência não tem autenticação real. Preferências e dados ficam apenas neste navegador, em armazenamento local.</p><div class="filter-row" style="margin-top:20px"><button class="button" data-action="reset-moneta">Restaurar dados demonstrativos</button><a class="button" href="#/">Voltar ao portfólio</a></div></section>`;
}
function renderMoneta() {
  document.title = `MONETA — ${monetaView} · RT STUDIO`;
  document.body.className = "mono-app";
  const views = { overview: overviewView, transactions: transactionView, budgets: budgetsView, reports: reportsView, settings: settingsView };
  ROOT.innerHTML = `${monetaHeader()}<main class="shell app-content"><div class="app-title-row"><div><span class="eyebrow">FINANÇAS PESSOAIS · DEMONSTRAÇÃO</span><h1>${({ overview: "Visão geral", transactions: "Transações", budgets: "Orçamentos", reports: "Relatórios", settings: "Configurações" })[monetaView]}</h1></div>${monetaView === "overview" ? `<button class="button button-primary button-small" data-action="add-transaction">+ Nova transação</button>` : ""}</div>${views[monetaView]()}<p class="demo-banner">MONETA é uma demonstração local. Todos os valores e registros são fictícios; nenhum banco, instituição financeira ou serviço externo está conectado.</p></main>`;
}
function transactionDialog(existing = null) {
  const data = existing || { description: "", category: "", date: new Date().toISOString().slice(0, 10), type: "expense", amount: "" };
  const categories = data.type === "income" ? incomeCategories : expenseCategories;
  const backdrop = document.createElement("div");
  backdrop.className = "modal-backdrop";
  backdrop.innerHTML = `<section class="modal" role="dialog" aria-modal="true" aria-labelledby="tx-title"><h2 id="tx-title">${existing ? "Editar transação" : "Nova transação"}</h2><form id="tx-form" class="form-grid"><label class="field">Descrição<input name="description" maxlength="100" required value="${esc(data.description)}"></label><label class="field">Tipo<select name="type"><option value="expense" ${data.type === "expense" ? "selected" : ""}>Despesa</option><option value="income" ${data.type === "income" ? "selected" : ""}>Receita</option></select></label><label class="field">Categoria<select name="category" required>${[...new Set([...categories, data.category].filter(Boolean))].map((cat) => `<option ${cat === data.category ? "selected" : ""}>${esc(cat)}</option>`).join("")}</select></label><label class="field">Data<input name="date" type="date" required value="${esc(data.date)}"></label><label class="field">Valor (R$)<input name="amount" type="number" min="0.01" step="0.01" required value="${esc(data.amount)}"></label><div class="modal-actions"><button type="button" class="button" data-action="close-modal">Cancelar</button><button class="button button-primary" type="submit">Salvar</button></div></form></section>`;
  document.body.append(backdrop);
  const form = backdrop.querySelector("#tx-form");
  const typeInput = form.elements.type;
  typeInput.addEventListener("change", () => {
    const select = form.elements.category;
    const list = typeInput.value === "income" ? incomeCategories : expenseCategories;
    select.innerHTML = list.map((cat) => `<option>${esc(cat)}</option>`).join("");
  });
  form.elements.description.focus();
  backdrop.addEventListener("click", (event) => { if (event.target === backdrop || event.target.closest('[data-action="close-modal"]')) backdrop.remove(); });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const fields = new FormData(form);
    const amount = Number(fields.get("amount"));
    if (!Number.isFinite(amount) || amount <= 0) return notify("Informe um valor maior que zero.");
    const row = { id: existing?.id || `tx-${Date.now()}`, description: String(fields.get("description")).trim(), category: String(fields.get("category")), date: String(fields.get("date")), type: String(fields.get("type")), amount };
    if (!row.description || !row.date) return notify("Preencha os campos obrigatórios.");
    transactions = existing ? transactions.map((x) => x.id === existing.id ? row : x) : [row, ...transactions];
    saveStore("rt-moneta-transactions", transactions);
    backdrop.remove();
    renderMoneta();
    notify(existing ? "Transação atualizada." : "Transação adicionada.");
  });
}

const products = [
  { id: "a1", name: "Blazer estruturado", price: 589, category: "Feminino", color: "Preto", sizes: ["P", "M", "G"], image: "photo-1591047139829-d91aecb6caea" },
  { id: "a2", name: "Camisa de algodão", price: 289, category: "Masculino", color: "Off-white", sizes: ["P", "M", "G", "GG"], image: "photo-1598033129183-c4f50c736f10" },
  { id: "a3", name: "Bolsa em couro", price: 459, category: "Acessórios", color: "Caramelo", sizes: ["Único"], image: "photo-1584917865442-de89df76afd3" },
  { id: "a4", name: "Vestido fluido", price: 379, category: "Feminino", color: "Areia", sizes: ["P", "M", "G"], image: "photo-1539008835657-9e8e9680c956" },
  { id: "a5", name: "Tricot essencial", price: 329, category: "Masculino", color: "Cinza", sizes: ["P", "M", "G", "GG"], image: "photo-1618354691373-d851c5c3a990" },
  { id: "a6", name: "Óculos de sol", price: 249, category: "Acessórios", color: "Preto", sizes: ["Único"], image: "photo-1511499767150-a48a237f0083" },
  { id: "a7", name: "Jaqueta minimal", price: 649, category: "Feminino", color: "Oliva", sizes: ["P", "M", "G"], image: "photo-1548126032-079a0fb0099d" },
  { id: "a8", name: "Calça reta", price: 359, category: "Masculino", color: "Grafite", sizes: ["P", "M", "G", "GG"], image: "photo-1473966968600-fa801b869a1a" },
];
const productImage = (product, width = 720) => `https://images.unsplash.com/${product.image}?auto=format&fit=crop&w=${width}&q=82`;
let cart = readStore("rt-atelier-cart", []);
let favorites = readStore("rt-atelier-favorites", []);
let atelierCategory = "Todos";
let atelierSearch = "";
let atelierSort = "featured";
let atelierMinPrice = "";
let atelierMaxPrice = "";
function priceTag(number) { return money(number).replace(",00", ""); }
function atelierHeader() {
  return `<header class="atelier-header"><div class="shell topbar"><a class="atelier-brand" href="#/atelier">ATELIER</a><nav class="atelier-nav" aria-label="Categorias"><a href="#/atelier/category/feminino">Feminino</a><a href="#/atelier/category/masculino">Masculino</a><a href="#/atelier/category/acessorios">Acessórios</a><a href="#/atelier/category/novidades">Novidades</a><a href="#/atelier/category/essenciais">Essenciais</a></nav><div class="atelier-tools"><button class="atelier-tool" data-action="atelier-search" aria-label="Busca">Busca</button><button class="atelier-tool" data-action="favorites">Favoritos (${favorites.length})</button><button class="atelier-tool" data-action="cart">Sacola (${cart.reduce((s, x) => s + x.quantity, 0)})</button><a class="atelier-tool" href="#/">RT STUDIO</a></div></div></header>`;
}
function atelierHero() {
  return `<section class="atelier-hero"><div class="shell"><span class="eyebrow">COLEÇÃO · ESTUDO DE PRODUTO</span><h1>Menos,<br>melhor.</h1><p>Peças essenciais. Silhuetas atemporais. Estilo sem excessos.</p><a class="button atelier-button" href="#atelier-catalog">Explorar coleção →</a></div></section>`;
}
function renderAtelier() {
  document.title = "ATELIER — E-commerce demonstrativo · RT STUDIO";
  document.body.className = "atelier-page";
  const category = atelierCategory.toLowerCase();
  let rows = products.filter((p) => {
    const matchCategory = atelierCategory === "Todos" || p.category.toLowerCase() === category || (category === "novidades" && ["a1", "a4", "a7"].includes(p.id)) || (category === "essenciais" && ["a2", "a5", "a8"].includes(p.id));
    return matchCategory && (!atelierSearch || p.name.toLowerCase().includes(atelierSearch.toLowerCase())) && (!atelierMinPrice || p.price >= Number(atelierMinPrice)) && (!atelierMaxPrice || p.price <= Number(atelierMaxPrice));
  });
  if (atelierSort === "price-asc") rows.sort((a, b) => a.price - b.price);
  if (atelierSort === "price-desc") rows.sort((a, b) => b.price - a.price);
  ROOT.innerHTML = `${atelierHeader()}${atelierCategory === "Todos" ? atelierHero() : ""}<main class="shell atelier-content" id="atelier-catalog"><div class="section-heading"><div><span class="eyebrow" style="color:#666">SELEÇÃO ATUAL</span><h2 style="font:400 34px var(--serif);letter-spacing:-.03em;margin:7px 0">${atelierCategory === "Todos" ? "Nova coleção" : esc(atelierCategory)}</h2></div><p style="color:#777;font-size:12px">Peças demonstrativas · ${rows.length} produtos</p></div><div class="atelier-toolbar"><div class="atelier-categories">${["Todos", "Feminino", "Masculino", "Acessórios", "Novidades", "Essenciais"].map((x) => `<button class="${x === atelierCategory ? "active" : ""}" data-category="${x}">${x}</button>`).join("")}</div><div class="atelier-filters"><input type="search" aria-label="Buscar produtos" placeholder="Buscar produto" value="${esc(atelierSearch)}" data-action="product-search"><input type="number" min="0" placeholder="Preço mín." aria-label="Preço mínimo" value="${esc(atelierMinPrice)}" data-action="min-price"><input type="number" min="0" placeholder="Preço máx." aria-label="Preço máximo" value="${esc(atelierMaxPrice)}" data-action="max-price"><select aria-label="Ordenar produtos" data-action="sort-products"><option value="featured">Destaques</option><option value="price-asc" ${atelierSort === "price-asc" ? "selected" : ""}>Menor preço</option><option value="price-desc" ${atelierSort === "price-desc" ? "selected" : ""}>Maior preço</option></select></div></div><div class="product-grid">${rows.length ? rows.map((product) => `<article class="product-card" tabindex="0" role="button" aria-label="Ver detalhes: ${esc(product.name)}" data-product="${product.id}"><div class="product-image"><img src="${productImage(product)}" alt="${esc(product.name)} — produto demonstrativo" loading="lazy"><button class="product-favorite ${favorites.includes(product.id) ? "active" : ""}" data-favorite="${product.id}" aria-label="${favorites.includes(product.id) ? "Remover dos favoritos" : "Adicionar aos favoritos"}">${favorites.includes(product.id) ? "♥" : "♡"}</button></div><div class="product-info"><strong>${esc(product.name)}</strong><span>${priceTag(product.price)}</span></div><div class="product-subtitle">${esc(product.category)} · ${esc(product.color)}</div></article>`).join("") : `<p style="grid-column:1/-1;padding:40px 0;color:#777">Nenhum produto corresponde à busca.</p>`}</div><p class="demo-banner" style="color:#666;border-color:#1112">ATELIER é uma loja demonstrativa. Preços, disponibilidade, catálogo e checkout são fictícios; nenhum pagamento ou pedido real é processado.</p></main><footer class="site-footer" style="background:#111;color:#aaa;border:0"><div class="shell footer-row"><span>ATELIER · experiência demonstrativa</span><a href="#/">Voltar ao RT STUDIO ↑</a></div></footer>`;
}
function showDrawer(kind) {
  document.querySelector(".atelier-drawer")?.remove();
  const drawer = document.createElement("aside");
  drawer.className = "atelier-drawer";
  drawer.setAttribute("aria-label", kind === "cart" ? "Sacola de compras demonstrativa" : "Favoritos demonstrativos");
  const rows = kind === "cart" ? cart.map((line) => ({ ...products.find((p) => p.id === line.id), quantity: line.quantity })) : products.filter((p) => favorites.includes(p.id));
  const subtotal = cart.reduce((sum, line) => sum + (products.find((p) => p.id === line.id)?.price || 0) * line.quantity, 0);
  drawer.innerHTML = `<div class="drawer-head"><h2>${kind === "cart" ? `Sacola (${cart.reduce((s, x) => s + x.quantity, 0)})` : `Favoritos (${rows.length})`}</h2><button class="drawer-close" data-action="close-drawer" aria-label="Fechar">×</button></div><div class="cart-lines">${rows.length ? rows.map((p) => `<div class="cart-line"><img src="${productImage(p, 180)}" alt=""><div><strong>${esc(p.name)}</strong><p>${esc(p.color)} · ${esc(p.selectedSize || "Tamanho não selecionado")}</p><p>${priceTag(p.price)}</p>${kind === "cart" ? `<label style="font-size:10px">Qtd. <input type="number" min="1" max="10" value="${p.quantity}" data-quantity="${p.id}" aria-label="Quantidade de ${esc(p.name)}"></label>` : ""}</div><button class="inline-button" data-remove="${p.id}" aria-label="Remover ${esc(p.name)}">Remover</button></div>`).join("") : `<p style="color:#777;font-size:12px">${kind === "cart" ? "Sua sacola está vazia." : "Você ainda não salvou favoritos."}</p>`}</div>${kind === "cart" ? `<div class="atelier-summary"><div><span>Subtotal demonstrativo</span><strong>${priceTag(subtotal)}</strong></div><p style="color:#777;font-size:10px">Frete e pagamentos não estão disponíveis nesta demonstração.</p><button class="button atelier-button" style="width:100%" data-action="checkout" ${rows.length ? "" : "disabled"}>Continuar para checkout demo</button></div>` : ""}`;
  document.body.append(drawer);
  drawer.querySelector("[data-action='close-drawer']").focus();
}
function showProduct(product) {
  const overlay = document.createElement("div"); overlay.className = "modal-backdrop";
  overlay.innerHTML = `<section class="modal atelier-modal" role="dialog" aria-modal="true" aria-labelledby="product-title"><div class="product-detail"><img src="${productImage(product, 800)}" alt="${esc(product.name)} — peça demonstrativa"><div><button class="drawer-close" style="float:right" data-action="close-modal" aria-label="Fechar">×</button><span class="eyebrow" style="color:#777">${esc(product.category)}</span><h2 id="product-title">${esc(product.name)}</h2><strong>${priceTag(product.price)}</strong><p>Peça demonstrativa da coleção ATELIER. Cor disponível: ${esc(product.color)}. Valores fictícios, sem venda ou disponibilidade real.</p><form id="product-form" class="form-grid"><label class="field">Tamanho<select name="size" required>${product.sizes.map((x) => `<option>${esc(x)}</option>`).join("")}</select></label><button class="button atelier-button" type="submit">Adicionar à sacola</button><button class="button" type="button" data-favorite="${product.id}">♡ Salvar nos favoritos</button></form></div></div></section>`;
  document.body.append(overlay);
  overlay.querySelector("[name=size]").focus();
  overlay.addEventListener("click", (event) => { if (event.target === overlay || event.target.closest('[data-action="close-modal"]')) overlay.remove(); });
  overlay.querySelector("#product-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const size = new FormData(event.currentTarget).get("size");
    const line = cart.find((x) => x.id === product.id && x.size === size);
    if (line) line.quantity = Math.min(10, line.quantity + 1); else cart.push({ id: product.id, size, quantity: 1 });
    saveStore("rt-atelier-cart", cart); overlay.remove(); renderAtelier(); notify("Adicionado à sacola demonstrativa.");
  });
}
function checkoutModal() {
  const backdrop = document.createElement("div"); backdrop.className = "modal-backdrop";
  const subtotal = cart.reduce((sum, line) => sum + products.find((p) => p.id === line.id).price * line.quantity, 0);
  backdrop.innerHTML = `<section class="modal atelier-modal" role="dialog" aria-modal="true" aria-labelledby="checkout-title"><h2 id="checkout-title">Checkout demonstrativo</h2><p style="color:#666;font-size:12px;line-height:1.6">Este fluxo não realiza compras. Não insira dados reais de pagamento; nenhum dado será transmitido.</p><p style="font-size:12px">Subtotal de exemplo: <strong>${priceTag(subtotal)}</strong></p><form id="checkout-form" class="form-grid"><label class="field">Nome para demonstração<input name="name" required maxlength="100" autocomplete="off"></label><label class="field">E-mail de exemplo<input name="email" type="email" required maxlength="160" autocomplete="off"></label><label class="field">Endereço de demonstração<input name="address" required maxlength="180" autocomplete="off"></label><label class="field">Entrega<select name="shipping"><option>Entrega padrão demonstrativa</option><option>Retirada demonstrativa</option></select></label><div class="modal-actions"><button type="button" class="button" data-action="close-modal">Cancelar</button><button class="button atelier-button" type="submit">Concluir demonstração</button></div></form></section>`;
  document.body.append(backdrop);
  backdrop.addEventListener("click", (event) => { if (event.target === backdrop || event.target.closest('[data-action="close-modal"]')) backdrop.remove(); });
  backdrop.querySelector("#checkout-form").addEventListener("submit", (event) => {
    event.preventDefault();
    backdrop.remove(); cart = []; saveStore("rt-atelier-cart", cart); renderAtelier(); notify("Checkout demonstrativo concluído. Nenhum pedido ou pagamento foi processado.");
  });
}

document.addEventListener("click", (event) => {
  const target = event.target;
  const editButton = target.closest("[data-edit]");
  if (editButton) { const item = transactions.find((x) => x.id === editButton.dataset.edit); if (item) transactionDialog(item); return; }
  const deleteButton = target.closest("[data-delete]");
  if (deleteButton) {
    const item = transactions.find((x) => x.id === deleteButton.dataset.delete);
    if (item && confirm(`Excluir "${item.description}" dos dados demonstrativos?`)) {
      transactions = transactions.filter((x) => x.id !== item.id);
      saveStore("rt-moneta-transactions", transactions);
      renderMoneta();
    }
    return;
  }
  const removeButton = target.closest("[data-remove]");
  if (removeButton) {
    const id = removeButton.dataset.remove;
    const drawer = removeButton.closest(".atelier-drawer");
    const isCart = drawer?.getAttribute("aria-label").startsWith("Sacola");
    if (isCart) cart = cart.filter((x) => x.id !== id);
    else favorites = favorites.filter((x) => x !== id);
    saveStore("rt-atelier-cart", cart);
    saveStore("rt-atelier-favorites", favorites);
    drawer?.remove();
    renderAtelier();
    if (isCart) showDrawer("cart");
    return;
  }
  const actionNode = target.closest("[data-action]");
  if (target.closest(".atelier-categories [data-category]")) { atelierCategory = target.closest(".atelier-categories [data-category]").dataset.category; renderAtelier(); return; }
  if (target.closest("[data-favorite]")) {
    event.preventDefault(); event.stopPropagation();
    const id = target.closest("[data-favorite]").dataset.favorite;
    favorites = favorites.includes(id) ? favorites.filter((x) => x !== id) : [...favorites, id];
    saveStore("rt-atelier-favorites", favorites);
    document.querySelector(".modal-backdrop")?.remove(); renderAtelier(); notify(favorites.includes(id) ? "Salvo nos favoritos." : "Removido dos favoritos."); return;
  }
  if (target.closest("[data-product]")) { const card = target.closest("[data-product]"); const product = products.find((p) => p.id === card.dataset.product); if (product) showProduct(product); return; }
  if (actionNode) {
    const { action } = actionNode.dataset;
    if (action === "keyboard-sound") { toggleKeyboardSound(actionNode); return; }
    if (action === "add-transaction") { transactionDialog(); return; }
    if (action === "close-modal") { actionNode.closest(".modal-backdrop")?.remove(); return; }
    if (action === "clear-filters") { transactionFilter = { search: "", category: "", type: "", sort: "date-desc" }; renderMoneta(); return; }
    if (action === "add-budget") {
      const category = prompt(`Categoria para o orçamento (${expenseCategories.join(", ")})`);
      if (!category) return;
      if (!expenseCategories.includes(category)) return notify("Escolha uma categoria disponível na lista.");
      const amount = Number(prompt(`Limite mensal demonstrativo para ${category} (R$)`));
      if (!Number.isFinite(amount) || amount <= 0) return notify("Informe um limite maior que zero.");
      budgets = { ...budgets, [category]: amount }; saveStore("rt-moneta-budgets", budgets); renderMoneta(); return;
    }
    if (action === "reset-moneta") { if (confirm("Restaurar os dados demonstrativos originais?")) { transactions = [...defaultTransactions]; budgets = { Alimentação: 1200, Moradia: 2100, Transporte: 600, Lazer: 400, Saúde: 350 }; saveStore("rt-moneta-transactions", transactions); saveStore("rt-moneta-budgets", budgets); renderMoneta(); } return; }
    if (action === "export-csv") {
      const rows = [["Descrição", "Categoria", "Data", "Tipo", "Valor"], ...sortedTransactions().map((x) => [x.description, x.category, x.date, x.type === "income" ? "Receita" : "Despesa", x.amount])];
      const csv = rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(";")).join("\r\n");
      const url = URL.createObjectURL(new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" }));
      const a = document.createElement("a"); a.href = url; a.download = "moneta-relatorio-demo.csv"; a.click(); URL.revokeObjectURL(url); return;
    }
    if (action === "cart") { showDrawer("cart"); return; }
    if (action === "favorites") { showDrawer("favorites"); return; }
    if (action === "close-drawer") { actionNode.closest(".atelier-drawer")?.remove(); return; }
    if (action === "checkout") { document.querySelector(".atelier-drawer")?.remove(); checkoutModal(); return; }
    if (action === "atelier-search") { document.querySelector('[data-action="product-search"]')?.focus(); document.querySelector("#atelier-catalog")?.scrollIntoView({ behavior: "smooth" }); return; }
  }
  if (target.closest("[data-remove]")) return;
});
document.addEventListener("input", (event) => {
  const filter = event.target.dataset.filter;
  if (filter) { transactionFilter[filter] = event.target.value; const cursor = event.target.selectionStart; renderMoneta(); const next = document.querySelector(`[data-filter="${filter}"]`); next?.focus(); if (filter === "search") next?.setSelectionRange(cursor, cursor); }
  if (event.target.matches('[data-action="product-search"]')) { atelierSearch = event.target.value; renderAtelier(); const input = document.querySelector('[data-action="product-search"]'); input?.focus(); input?.setSelectionRange(atelierSearch.length, atelierSearch.length); }
  if (event.target.matches('[data-action="min-price"]')) { atelierMinPrice = event.target.value; renderAtelier(); const input = document.querySelector('[data-action="min-price"]'); input?.focus(); input?.setSelectionRange(atelierMinPrice.length, atelierMinPrice.length); }
  if (event.target.matches('[data-action="max-price"]')) { atelierMaxPrice = event.target.value; renderAtelier(); const input = document.querySelector('[data-action="max-price"]'); input?.focus(); input?.setSelectionRange(atelierMaxPrice.length, atelierMaxPrice.length); }
  if (event.target.matches("[data-quantity]")) {
    const line = cart.find((x) => x.id === event.target.dataset.quantity);
    const value = Math.max(1, Math.min(10, Number(event.target.value) || 1));
    if (line) { line.quantity = value; saveStore("rt-atelier-cart", cart); const drawer = document.querySelector(".atelier-drawer"); drawer?.remove(); showDrawer("cart"); }
  }
});
document.addEventListener("change", (event) => {
  const filter = event.target.dataset.filter;
  if (filter) { transactionFilter[filter] = event.target.value; renderMoneta(); }
  if (event.target.matches('[data-action="sort-products"]')) { atelierSort = event.target.value; renderAtelier(); }
});
document.addEventListener("keydown", (event) => {
  if ((event.key === "Enter" || event.key === " ") && event.target.matches("[data-product]")) { event.preventDefault(); const product = products.find((p) => p.id === event.target.dataset.product); if (product) showProduct(product); }
  if (event.key === "Escape") { document.querySelector(".modal-backdrop")?.remove(); document.querySelector(".atelier-drawer")?.remove(); }
});
document.addEventListener("submit", (event) => {
  if (event.target.id === "residence-form") {
    event.preventDefault();
    if (!event.target.reportValidity()) return;
    event.target.reset();
    document.querySelector("#residence-result").textContent = "Demonstração recebida neste navegador; nenhum dado foi enviado.";
  }
});
function render() {
  const current = route();
  if (["projetos", "habilidades", "sobre"].includes(current) && ROOT.querySelector("#habilidades")) return;
  heroCharacterCleanup?.();
  heroCharacterCleanup = null;
  if (current === "residence") { residence(); return; }
  if (current.startsWith("moneta")) { monetaView = current.split("/")[1] || "overview"; if (!["overview", "transactions", "budgets", "reports", "settings"].includes(monetaView)) monetaView = "overview"; renderMoneta(); return; }
  if (current === "atelier" || current.startsWith("atelier/")) {
    const part = current.split("/")[2];
    atelierCategory = part ? ({ feminino: "Feminino", masculino: "Masculino", acessorios: "Acessórios", novidades: "Novidades", essenciais: "Essenciais" })[part] || "Todos" : "Todos";
    renderAtelier(); return;
  }
  portfolio();
}
window.addEventListener("hashchange", render);
render();
