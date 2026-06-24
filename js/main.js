/* =========================================================
   Places2Secours — Interactions & rendu
   ========================================================= */

/* ---------- Configuration contact ---------- */
// Numéro WhatsApp au format international (France : 0671938654 -> 33671938654)
const WHATSAPP_NUMBER = "33671938654";

function whatsappLink(message) {
  const txt = encodeURIComponent(message || "Bonjour Places2Secours, je vous contacte depuis votre site.");
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${txt}`;
}

/* =========================================================
   1. Starfield galaxie (canvas)
   ========================================================= */
(function starfield() {
  const canvas = document.getElementById("starfield");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let w, h, stars, dpr;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.width = innerWidth * dpr;
    h = canvas.height = innerHeight * dpr;
    canvas.style.width = innerWidth + "px";
    canvas.style.height = innerHeight + "px";
    const count = Math.min(220, Math.floor((innerWidth * innerHeight) / 9000));
    stars = Array.from({ length: count }, () => newStar());
  }

  function newStar() {
    const palette = ["#ffffff", "#cdb4ff", "#8ad8ff", "#d9a8ff", "#9aa8ff"];
    return {
      x: Math.random() * w,
      y: Math.random() * h,
      r: (Math.random() * 1.5 + 0.3) * dpr,
      a: Math.random(),
      tw: Math.random() * 0.025 + 0.004,
      dir: Math.random() > 0.5 ? 1 : -1,
      vx: (Math.random() - 0.5) * 0.06 * dpr,
      vy: (Math.random() - 0.5) * 0.06 * dpr,
      c: palette[Math.floor(Math.random() * palette.length)],
    };
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    for (const s of stars) {
      s.a += s.tw * s.dir;
      if (s.a <= 0.1 || s.a >= 1) s.dir *= -1;
      s.x += s.vx; s.y += s.vy;
      if (s.x < 0) s.x = w; if (s.x > w) s.x = 0;
      if (s.y < 0) s.y = h; if (s.y > h) s.y = 0;

      ctx.globalAlpha = Math.max(0.1, Math.min(1, s.a));
      ctx.fillStyle = s.c;
      ctx.shadowBlur = 6 * dpr;
      ctx.shadowColor = s.c;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
    requestAnimationFrame(draw);
  }

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  resize();
  window.addEventListener("resize", resize);
  if (!reduced) draw();
  else { // dessin statique
    for (const s of stars) {
      ctx.globalAlpha = s.a; ctx.fillStyle = s.c;
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill();
    }
  }
})();

/* =========================================================
   2. Halo lumineux qui suit la souris
   ========================================================= */
(function cursorGlow() {
  const glow = document.getElementById("cursor-glow");
  if (!glow) return;
  let tx = 0, ty = 0, cx = 0, cy = 0;
  window.addEventListener("mousemove", (e) => {
    tx = e.clientX; ty = e.clientY;
    glow.style.opacity = "1";
  });
  window.addEventListener("mouseleave", () => (glow.style.opacity = "0"));
  (function loop() {
    cx += (tx - cx) * 0.12;
    cy += (ty - cy) * 0.12;
    glow.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
    requestAnimationFrame(loop);
  })();
})();

/* =========================================================
   3. Navbar : scroll + menu mobile
   ========================================================= */
(function navbar() {
  const nav = document.querySelector(".nav");
  if (nav) {
    const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", () => links.classList.toggle("open"));
    links.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => links.classList.remove("open"))
    );
  }
})();

/* =========================================================
   4. Reveal au scroll
   ========================================================= */
(function reveal() {
  const els = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window) || !els.length) {
    els.forEach((e) => e.classList.add("in"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
    }),
    { threshold: 0.12 }
  );
  els.forEach((e) => io.observe(e));
})();

/* =========================================================
   5. FAQ accordéon
   ========================================================= */
(function faq() {
  document.querySelectorAll(".faq-item").forEach((item) => {
    item.addEventListener("click", () => {
      const open = item.classList.contains("open");
      document.querySelectorAll(".faq-item").forEach((i) => i.classList.remove("open"));
      if (!open) item.classList.add("open");
    });
  });
})();

/* =========================================================
   6. Compteurs animés (stats)
   ========================================================= */
(function counters() {
  const els = document.querySelectorAll("[data-count]");
  if (!els.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const el = en.target;
      const end = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || "";
      const dur = 1400;
      const start = performance.now();
      function tick(now) {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.floor(eased * end).toLocaleString("fr-FR") + suffix;
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = end.toLocaleString("fr-FR") + suffix;
      }
      requestAnimationFrame(tick);
      io.unobserve(el);
    });
  }, { threshold: 0.5 });
  els.forEach((e) => io.observe(e));
})();

/* =========================================================
   7. Données billets + page billets + modal
   ========================================================= */
const TICKETS = [
  {
    id: "david-guetta-2025",
    artist: "David Guetta",
    event: "F*** Me I'm Famous — Live",
    type: ["concerts", "dj-sets"],
    category: "Concert / DJ Set",
    genre: "Électro",
    venue: "Accor Arena, Paris",
    date: "Samedi 13 décembre 2025 — 20h00",
    seats: "Carré Or — Fosse avant",
    qty: "2 places côte à côte",
    price: "Sur demande",
    badge: "Sold out",
    hot: true,
    gradient: "linear-gradient(135deg, #7c3aed 0%, #2563eb 50%, #06b6d4 100%)",
    emoji: "🎧",
    desc:
      "Deux places en Carré Or pour la date parisienne complète de David Guetta. " +
      "Billets achetés en prévente avant le sold out, 100% authentiques et transférables. " +
      "Idéal pour vivre le show au plus près de la scène. Places côte à côte garanties.",
  },
];

const ticketGradient = (t) => t.gradient || "var(--grad-violet)";

/* --- Rendu de la grille de billets --- */
function renderTickets(filter = "all") {
  const grid = document.getElementById("tickets-grid");
  if (!grid) return;

  const list = filter === "all"
    ? TICKETS
    : TICKETS.filter((t) => (t.type || []).includes(filter));

  if (!list.length) {
    grid.innerHTML = `<div class="glass" style="padding:40px;text-align:center;grid-column:1/-1;color:var(--text-muted)">
      Aucun billet dans cette catégorie pour le moment.<br>
      <a class="see" style="cursor:pointer" href="https://wa.me/${WHATSAPP_NUMBER}" target="_blank" rel="noopener">Demandez-nous sur WhatsApp →</a></div>`;
    return;
  }

  grid.innerHTML = list.map((t) => `
    <article class="ticket reveal" data-id="${t.id}" tabindex="0" role="button" aria-label="Voir les détails : ${t.artist}">
      <div class="ticket-banner" style="background:${ticketGradient(t)}">
        <div class="glare"></div>
        <span class="tag ${t.hot ? "hot" : ""}">${t.badge || "Disponible"}</span>
        <div style="position:absolute;top:14px;left:16px;font-size:2rem;filter:drop-shadow(0 2px 8px rgba(0,0,0,.4))">${t.emoji || "🎟️"}</div>
        <h3>${t.artist}</h3>
      </div>
      <div class="ticket-body">
        <div class="ticket-meta">
          <div class="row"><span class="i">📍</span>${t.venue}</div>
          <div class="row"><span class="i">📅</span>${t.date}</div>
          <div class="row"><span class="i">🎟️</span>${t.qty}</div>
        </div>
        <div class="ticket-foot">
          <div class="ticket-price">À partir de <b>${t.price}</b></div>
          <span class="see">Voir les places →</span>
        </div>
      </div>
    </article>
  `).join("");

  // (re)brancher reveal sur les cartes injectées
  grid.querySelectorAll(".reveal").forEach((el, i) => {
    el.style.transitionDelay = (i * 0.06) + "s";
    setTimeout(() => el.classList.add("in"), 60);
  });

  // ouverture modal + tilt
  grid.querySelectorAll(".ticket").forEach((card) => {
    card.addEventListener("click", () => openModal(card.dataset.id));
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openModal(card.dataset.id); }
    });
    attachTilt(card);
  });
}

/* --- Filtres + premier rendu --- */
(function ticketsPage() {
  const grid = document.getElementById("tickets-grid");
  if (!grid) return;
  renderTickets("all");

  document.querySelectorAll(".filters .chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      document.querySelectorAll(".filters .chip").forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      renderTickets(chip.dataset.filter || "all");
    });
  });
})();

/* --- Tilt 3D au survol --- */
function attachTilt(card) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const banner = card.querySelector(".ticket-banner .glare");
  card.addEventListener("mousemove", (e) => {
    const r = card.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform = `perspective(900px) rotateY(${px * 8}deg) rotateX(${-py * 8}deg) translateY(-4px)`;
    if (banner) banner.style.background =
      `radial-gradient(circle at ${(px + 0.5) * 100}% ${(py + 0.5) * 100}%, rgba(255,255,255,0.35), transparent 45%)`;
  });
  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
    if (banner) banner.style.background = "";
  });
}

/* --- Modal --- */
function openModal(id) {
  const t = TICKETS.find((x) => x.id === id);
  const overlay = document.getElementById("modal");
  if (!t || !overlay) return;

  const msg =
    `Bonjour Places2Secours 👋\n\nJe suis intéressé(e) par les places pour *${t.artist}* — ${t.event}\n` +
    `📅 ${t.date}\n📍 ${t.venue}\n🎟️ ${t.qty}\n\nSont-elles toujours disponibles ?`;

  overlay.querySelector(".modal").innerHTML = `
    <button class="modal-close" aria-label="Fermer">✕</button>
    <div class="modal-banner" style="background:${ticketGradient(t)}">
      <div style="position:absolute;top:18px;left:22px;font-size:2.4rem;filter:drop-shadow(0 2px 10px rgba(0,0,0,.45))">${t.emoji || "🎟️"}</div>
      <h2>${t.artist}</h2>
    </div>
    <div class="modal-body">
      <div class="modal-tags">
        <span class="t">${t.category}</span>
        <span class="t">${t.genre}</span>
        <span class="t" style="color:#fda4af;border-color:rgba(248,113,113,.4)">${t.badge}</span>
      </div>
      <div class="modal-details">
        <div class="detail"><div class="k">Événement</div><div class="v">${t.event}</div></div>
        <div class="detail"><div class="k">Lieu</div><div class="v">${t.venue}</div></div>
        <div class="detail"><div class="k">Date</div><div class="v">${t.date}</div></div>
        <div class="detail"><div class="k">Placement</div><div class="v">${t.seats}</div></div>
        <div class="detail"><div class="k">Quantité</div><div class="v">${t.qty}</div></div>
        <div class="detail"><div class="k">Prix</div><div class="v">${t.price}</div></div>
      </div>
      <p class="modal-desc">${t.desc}</p>
      <div class="modal-actions">
        <a class="btn btn-whatsapp btn-lg" href="${whatsappLink(msg)}" target="_blank" rel="noopener">
          <span style="font-size:1.2rem">🟢</span> Contacter sur WhatsApp pour ces places
        </a>
        <p class="modal-note">Réponse rapide • Billets vérifiés • Aucun paiement sur le site</p>
      </div>
    </div>
  `;

  overlay.querySelector(".modal-close").addEventListener("click", closeModal);
  overlay.classList.add("show");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  const overlay = document.getElementById("modal");
  if (!overlay) return;
  overlay.classList.remove("show");
  document.body.style.overflow = "";
}

(function modalEvents() {
  const overlay = document.getElementById("modal");
  if (!overlay) return;
  overlay.addEventListener("click", (e) => { if (e.target === overlay) closeModal(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });
})();

/* =========================================================
   8. Liens WhatsApp génériques (data-wa)
   ========================================================= */
(function genericWhatsapp() {
  document.querySelectorAll("[data-wa]").forEach((el) => {
    el.setAttribute("href", whatsappLink(el.dataset.wa));
    el.setAttribute("target", "_blank");
    el.setAttribute("rel", "noopener");
  });
})();

/* Année footer */
document.querySelectorAll("[data-year]").forEach((e) => (e.textContent = new Date().getFullYear()));
