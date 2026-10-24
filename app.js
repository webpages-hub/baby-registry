(function () {
  "use strict";

  var CFG = window.REGISTRY_CONFIG || {};
  var ITEMS = window.REGISTRY_ITEMS || [];
  var CATS = window.REGISTRY_CATEGORIES || [];
  var CAT_ICON = {};
  CATS.forEach(function (c) { CAT_ICON[c.name] = c.icon; });

  var formReady = !!(CFG.formResponseUrl && CFG.nameEntry && CFG.itemEntry);
  var sheetReady = !!CFG.sheetCsvUrl;

  var $ = function (id) { return document.getElementById(id); };
  var state = { cat: "all", availOnly: false, sort: "wanted" };
  var sheetCounts = {};          // item key -> rows found in the Google Sheet
  var local = loadLocal();       // item id -> { base, n }: reservations made on this device
  var current = null;            // item shown in the dialog
  var qty = 1;
  var lastFocus = null;

  /* ---------- helpers ---------- */
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function key(name) { return String(name).trim().toLowerCase(); }
  function money(n) { return (CFG.currency || "") + Number(n).toLocaleString("en-NG"); }
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }
  function loadLocal() { try { return JSON.parse(store("registry_local") || "{}") || {}; } catch (e) { return {}; } }
  function saveLocal() { store("registry_local", JSON.stringify(local)); }
  function icon(id, vb) { return '<svg viewBox="' + (vb || "0 0 64 64") + '" aria-hidden="true"><use href="#' + id + '"/></svg>'; }

  function reservedCount(item) {
    var fromSheet = sheetCounts[key(item.name)] || 0;
    var l = local[item.id];
    var fromLocal = l ? l.base + l.n : 0;
    return Math.min(item.qty, Math.max(fromSheet, fromLocal));
  }
  function remaining(item) { return item.qty - reservedCount(item); }

  /* ---------- text from config ---------- */
  var babyName = CFG.babyName || "Little One";
  var parents = CFG.parents || "";
  document.title = babyName + "'s Baby Registry";
  $("brandName").textContent = babyName + "'s registry";
  $("heroName").textContent = babyName;
  $("heroParents").textContent = parents;
  $("signName").textContent = parents;
  if (!formReady) $("previewNote").hidden = false;

  /* ---------- floating background icons ---------- */
  (function floaters() {
    var box = $("floaters");
    var kinds = [
      ["i-balloon", "0 0 48 84", 26, 46, "#a8744a"], ["i-teddy", "0 0 64 70", 38, 42, "#a8744a"],
      ["i-diaper", "0 0 64 56", 36, 32, "#c8955f"], ["i-star", "0 0 64 64", 24, 24, "#d2a77c"],
      ["i-bottle", "0 0 40 72", 22, 40, "#b07a4b"], ["i-rattle", "0 0 64 64", 32, 32, "#8a5a3b"],
      ["i-balloon", "0 0 48 84", 24, 42, "#6f4a33"], ["i-heart", "0 0 64 60", 22, 20, "#b07a4b"],
      ["i-pacifier", "0 0 64 64", 30, 30, "#b07a4b"], ["i-bootie", "0 0 40 46", 26, 30, "#a8744a"],
      ["i-onesie", "0 0 64 64", 34, 34, "#c8955f"], ["i-bottle2", "0 0 48 70", 24, 34, "#8a5a3b"],
      ["i-sparkle", "0 0 64 64", 18, 18, "#d2a77c"]
    ];
    var count = window.innerWidth < 600 ? 10 : 18;
    for (var i = 0; i < count; i++) {
      var k = kinds[i % kinds.length];
      var el = document.createElement("div");
      el.className = "fl";
      var scale = 0.8 + Math.random() * 0.9;
      el.style.cssText = "left:" + (Math.random() * 94).toFixed(1) + "%;width:" + (k[2] * scale).toFixed(0) + "px;height:" + (k[3] * scale).toFixed(0) +
        "px;animation-duration:" + (26 + Math.random() * 28).toFixed(1) + "s;animation-delay:-" + (Math.random() * 40).toFixed(1) + "s;--c1:" + k[4];
      el.innerHTML = '<svg viewBox="' + k[1] + '" style="animation-duration:' + (4 + Math.random() * 4).toFixed(1) + 's"><use href="#' + k[0] + '"/></svg>';
      box.appendChild(el);
    }
  })();

  /* ---------- filters ---------- */
  function buildChips() {
    var total = ITEMS.length;
    var most = ITEMS.filter(function (i) { return i.priority === "most"; }).length;
    var html = chip("all", "i-star", "All", total) + chip("most", "i-heart", "Most wanted", most, "most");
    CATS.forEach(function (c) {
      var n = ITEMS.filter(function (i) { return i.category === c.name; }).length;
      html += chip(c.name, c.icon, c.name, n);
    });
    $("chips").innerHTML = html;
  }
  function chip(val, ic, label, n, extra) {
    var on = state.cat === val;
    var vb = ic === "i-teddy" ? "0 0 64 70" : ic === "i-heart" ? "0 0 64 60" : ic === "i-diaper" ? "0 0 64 56" : "0 0 64 64";
    return '<button class="chip ' + (extra || "") + (on ? " on" : "") + '" role="tab" aria-selected="' + on + '" data-cat="' + esc(val) + '">' +
      icon(ic, vb) + "<span>" + esc(label) + '</span><span class="n">' + n + "</span></button>";
  }

  function visibleItems() {
    var list = ITEMS.filter(function (i) {
      if (state.cat === "most" && i.priority !== "most") return false;
      if (state.cat !== "all" && state.cat !== "most" && i.category !== state.cat) return false;
      if (state.availOnly && remaining(i) <= 0) return false;
      return true;
    });
    var order = {}; ITEMS.forEach(function (i, idx) { order[i.id] = idx; });
    list.sort(function (a, b) {
      var ra = remaining(a) <= 0 ? 1 : 0, rb = remaining(b) <= 0 ? 1 : 0;
      if (ra !== rb) return ra - rb;                        // fully reserved go last
      if (state.sort === "low") return a.price - b.price;
      if (state.sort === "high") return b.price - a.price;
      var pa = a.priority === "most" ? 0 : 1, pb = b.priority === "most" ? 0 : 1;
      if (pa !== pb) return pa - pb;                        // most wanted first
      return order[a.id] - order[b.id];
    });
    return list;
  }

  /* ---------- rendering ---------- */
  function mediaHTML(item) {
    if (item.image) return '<img src="' + esc(item.image) + '" alt="' + esc(item.name) + '" loading="lazy" data-art="' + esc(item.id) + '">';
    return (window.REGISTRY_ART ? window.REGISTRY_ART(item.id) : "") + SPARKS;
  }
  var SPARKS = '<svg class="spark sp1" viewBox="0 0 64 64" aria-hidden="true"><use href="#i-sparkle"/></svg><svg class="spark sp2" viewBox="0 0 64 64" aria-hidden="true"><use href="#i-sparkle"/></svg>';

  function cardHTML(item, idx) {
    var left = remaining(item), done = left <= 0;
    var ic = CAT_ICON[item.category] || "i-teddy";
    var vb = ic === "i-diaper" ? "0 0 64 56" : "0 0 64 64";
    var avail;
    if (done) avail = "Reserved";
    else if (item.qty > 1) {
      var pips = "";
      for (var p = 0; item.qty <= 6 && p < item.qty; p++) pips += '<span class="pip' + (p >= left ? " gone" : "") + '"></span>';
      avail = (pips ? '<span class="pips" aria-hidden="true">' + pips + "</span>" : "") + left + " of " + item.qty + " still needed";
    } else avail = "Still needed";

    return '<article class="card' + (item.priority === "most" ? " most" : "") + (done ? " done" : "") + '" style="animation-delay:' + Math.min(idx * 40, 400) + 'ms">' +
      (done ? '<div class="ribbon">Reserved</div>' : "") +
      '<div class="media">' + mediaHTML(item) + '</div>' +
      '<div class="card-top"><span class="cat">' + esc(item.category) + "</span>" +
      (item.priority === "most" && !done ? '<span class="badge">' + icon("i-heart", "0 0 64 60") + "Most wanted</span>" : "") + "</div>" +
      "<h3>" + esc(item.name) + "</h3>" +
      '<p class="desc">' + esc(item.desc) + "</p>" +
      '<div class="price-row"><span class="price">' + money(item.price) + '</span><span class="avail">' + avail + "</span></div>" +
      '<p class="vendor">See it on <a href="https://www.instagram.com/' + encodeURIComponent(item.vendor) + '/" target="_blank" rel="noopener">@' + esc(item.vendor) + "</a></p>" +
      '<button class="btn btn-primary" data-reserve="' + esc(item.id) + '"' + (done ? " disabled" : "") + ">" + (done ? "Reserved" : "Reserve") + "</button>" +
      "</article>";
  }

  function render() {
    var list = visibleItems();
    $("grid").innerHTML = list.map(cardHTML).join("");
    $("empty").hidden = list.length > 0;
    $("resultCount").textContent = list.length + (list.length === 1 ? " gift" : " gifts");
    renderProgress();
  }

  function renderChipState() {
    Array.prototype.forEach.call($("chips").children, function (b) {
      var on = b.getAttribute("data-cat") === state.cat;
      b.classList.toggle("on", on);
      b.setAttribute("aria-selected", on);
    });
  }

  function renderProgress() {
    var total = 0, taken = 0;
    ITEMS.forEach(function (i) { total += i.qty; taken += reservedCount(i); });
    var pct = total ? Math.round((taken / total) * 100) : 0;
    $("progressCount").textContent = taken + " of " + total;
    $("barFill").style.width = pct + "%";
    $("barTeddy").style.left = pct + "%";
    $("progressNote").textContent = pct === 0 ? "0% of the list is taken care of." : pct >= 100 ? "Everything is taken care of. Thank you!" : pct + "% of the list is taken care of.";
  }

  /* ---------- Google Sheet sync ---------- */
  function parseCSV(text) {
    var rows = [], row = [], cell = "", q = false;
    for (var i = 0; i < text.length; i++) {
      var c = text[i];
      if (q) {
        if (c === '"') { if (text[i + 1] === '"') { cell += '"'; i++; } else q = false; }
        else cell += c;
      } else if (c === '"') q = true;
      else if (c === ",") { row.push(cell); cell = ""; }
      else if (c === "\n" || c === "\r") {
        if (c === "\r" && text[i + 1] === "\n") i++;
        row.push(cell); cell = ""; rows.push(row); row = [];
      } else cell += c;
    }
    if (cell !== "" || row.length) { row.push(cell); rows.push(row); }
    return rows;
  }

  function syncSheet() {
    if (!sheetReady) return Promise.resolve(false);
    var url = CFG.sheetCsvUrl + (CFG.sheetCsvUrl.indexOf("?") > -1 ? "&" : "?") + "t=" + Date.now();
    return fetch(url, { cache: "no-store" })
      .then(function (r) { if (!r.ok) throw new Error("sheet " + r.status); return r.text(); })
      .then(function (text) {
        var rows = parseCSV(text);
        if (!rows.length) return false;
        var col = rows[0].findIndex(function (h) { return /item|gift/i.test(h); });
        if (col < 0) col = Math.min(2, rows[0].length - 1);
        var counts = {};
        rows.slice(1).forEach(function (r) {
          var k = key(r[col] || "");
          if (k) counts[k] = (counts[k] || 0) + 1;
        });
        sheetCounts = counts;
        return true;
      })
      .catch(function (e) { console.warn("Could not read reservations sheet:", e); return false; });
  }

  function refresh() { return syncSheet().then(function (ok) { if (ok && $("overlay").hidden) render(); else if (ok) renderProgress(); }); }

  /* ---------- dialog ---------- */
  function openDialog(item) {
    current = item; qty = 1; lastFocus = document.activeElement;
    var left = remaining(item);
    $("dlgItem").textContent = item.name + " · " + money(item.price);
    var ic = CAT_ICON[item.category] || "i-teddy";
    $("dlgIcon").setAttribute("viewBox", ic === "i-diaper" ? "0 0 64 56" : "0 0 64 64");
    $("dlgIcon").innerHTML = '<use href="#' + ic + '"/>';
    $("qtyField").hidden = left <= 1;
    $("qtyHint").textContent = left + " still needed";
    updateQty();
    $("fullName").value = store("registry_name") || "";
    $("fullName").classList.remove("bad");
    $("formError").hidden = true;
    $("submitBtn").disabled = false;
    $("submitBtn").textContent = "Reserve";
    $("reserveForm").hidden = false;
    $("thanks").hidden = true;
    $("overlay").hidden = false;
    document.body.style.overflow = "hidden";
    setTimeout(function () { $("fullName").focus(); }, 60);
  }
  function closeDialog() {
    $("overlay").hidden = true;
    document.body.style.overflow = "";
    current = null;
    if (lastFocus && lastFocus.focus) try { lastFocus.focus(); } catch (e) {}
  }
  function updateQty() {
    var left = current ? remaining(current) : 1;
    $("qtyVal").textContent = qty;
    $("qtyMinus").disabled = qty <= 1;
    $("qtyPlus").disabled = qty >= left;
    $("submitBtn").textContent = qty > 1 ? "Reserve " + qty : "Reserve";
  }
  function showError(msg) { $("formError").textContent = msg; $("formError").hidden = false; }

  function post(item, name) {
    if (!formReady) return new Promise(function (res) { setTimeout(res, 700); });
    var body = new URLSearchParams();
    body.append(CFG.nameEntry, name);
    body.append(CFG.itemEntry, item.name);
    // no-cors: Google Forms does not send CORS headers, so the reply is opaque but the response is saved.
    return fetch(CFG.formResponseUrl, { method: "POST", mode: "no-cors", body: body });
  }

  $("reserveForm").addEventListener("submit", function (e) {
    e.preventDefault();
    var item = current;
    var name = $("fullName").value.trim().replace(/\s+/g, " ");
    $("formError").hidden = true;
    if (name.length < 3 || name.indexOf(" ") < 0) {
      $("fullName").classList.add("bad");
      showError("Please enter your full name (first and last) so the parents know who to thank.");
      $("fullName").focus();
      return;
    }
    $("fullName").classList.remove("bad");
    var btn = $("submitBtn");
    btn.disabled = true; btn.textContent = "Reserving…";
    var n = qty;

    syncSheet().then(function () {
      if (remaining(item) < n) {
        render();
        if (remaining(item) <= 0) { closeDialog(); return; }
        qty = Math.min(qty, remaining(item));
        $("qtyField").hidden = remaining(item) <= 1; $("qtyHint").textContent = remaining(item) + " still needed";
        updateQty();
        btn.disabled = false;
        showError("Someone just reserved some of these. We updated how many are left.");
        throw new Error("taken");
      }
      var posts = []; for (var i = 0; i < n; i++) posts.push(post(item, name));
      return Promise.all(posts);
    }).then(function () {
      // Count it right away; the shared sheet may take a minute or two to publish the new rows.
      local[item.id] = { base: reservedCount(item), n: n };
      saveLocal();
      store("registry_name", name);
      render();
      showThanks(item, name, n);
    }).catch(function (err) {
      if (err && err.message === "taken") return;
      btn.disabled = false; updateQty();
      showError("We couldn't save that just now. Please check your connection and try again.");
    });
  });

  function showThanks(item, name, n) {
    var first = name.split(" ")[0];
    $("thanksTitle").textContent = "Thank you for the love, " + first + "!";
    $("thanksBody").textContent = "You reserved " + (n > 1 ? n + " × " : "") + item.name + ". We're so grateful for your kindness and can't wait to celebrate with you.";
    $("reserveForm").hidden = true;
    $("thanks").hidden = false;
    $("thanksDone").focus();
    confetti();
  }

  function confetti() {
    if (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var box = $("confetti");
    var kinds = [["i-heart", "0 0 64 60"], ["i-star", "0 0 64 64"], ["i-balloon", "0 0 48 84"], ["i-pacifier", "0 0 64 64"], ["i-sparkle", "0 0 64 64"], ["i-bootie", "0 0 40 46"], ["i-heart", "0 0 64 60"], ["i-onesie", "0 0 64 64"]];
    var colors = ["#a8744a", "#d2a77c", "#6f4a33", "#c4764f", "#b07a4b", "#8a5a3b"];
    for (var i = 0; i < 34; i++) {
      var k = kinds[i % kinds.length], el = document.createElement("i");
      var ang = Math.random() * Math.PI * 2, dist = 120 + Math.random() * Math.min(window.innerWidth, 520) * 0.7;
      el.style.cssText = "--dx:" + (Math.cos(ang) * dist).toFixed(0) + "px;--dy:" + (Math.sin(ang) * dist - 140).toFixed(0) + "px;--rot:" + ((Math.random() - 0.5) * 540).toFixed(0) +
        "deg;--c1:" + colors[i % colors.length] + ";width:" + (16 + Math.random() * 16).toFixed(0) + "px;height:" + (16 + Math.random() * 16).toFixed(0) + "px;animation-delay:" + (Math.random() * 0.25).toFixed(2) + "s";
      el.innerHTML = '<svg viewBox="' + k[1] + '"><use href="#' + k[0] + '"/></svg>';
      box.appendChild(el);
    }
    setTimeout(function () { box.innerHTML = ""; }, 2600);
  }

  /* ---------- events ---------- */
  $("chips").addEventListener("click", function (e) {
    var b = e.target.closest(".chip"); if (!b) return;
    state.cat = b.getAttribute("data-cat");
    renderChipState(); render();
  });
  $("availOnly").addEventListener("change", function (e) { state.availOnly = e.target.checked; render(); });
  $("sort").addEventListener("change", function (e) { state.sort = e.target.value; render(); });
  $("grid").addEventListener("click", function (e) {
    var b = e.target.closest("[data-reserve]"); if (!b || b.disabled) return;
    var item = ITEMS.filter(function (i) { return i.id === b.getAttribute("data-reserve"); })[0];
    if (item && remaining(item) > 0) openDialog(item);
  });
  // If a real photo is missing or fails to load, fall back to the drawn illustration.
  $("grid").addEventListener("error", function (e) {
    var id = e.target.getAttribute && e.target.getAttribute("data-art");
    if (id) e.target.outerHTML = window.REGISTRY_ART(id);
  }, true);
  $("qtyMinus").addEventListener("click", function () { if (qty > 1) { qty--; updateQty(); } });
  $("qtyPlus").addEventListener("click", function () { if (current && qty < remaining(current)) { qty++; updateQty(); } });
  $("dlgClose").addEventListener("click", closeDialog);
  $("thanksDone").addEventListener("click", closeDialog);
  $("overlay").addEventListener("mousedown", function (e) { if (e.target === $("overlay")) closeDialog(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !$("overlay").hidden) closeDialog(); });
  $("fullName").addEventListener("input", function () { this.classList.remove("bad"); });

  /* ---------- go ---------- */
  buildChips();
  render();
  refresh();
  if (sheetReady) setInterval(refresh, Math.max(20, CFG.refreshSeconds || 60) * 1000);
})();
