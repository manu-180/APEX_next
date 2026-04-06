'use client'

/**
 * BotLode Chat Widget — integración Next.js App Router
 *
 * Estrategia:
 * - El iframe y las hitzone divs se renderizan como JSX estático.
 * - Los dos scripts se inyectan con next/script `lazyOnload` para que no
 *   compitan con el render inicial/LCP.
 * - Las dos `<link>` de preconexión viven en layout.tsx para que el navegador
 *   resuelva el DNS/TLS lo antes posible.
 */

import Script from 'next/script'

/** false = no se monta el iframe ni el bot flotante del player Flutter (botlode-player). */
const ENABLE_BOTLODE_PLAYER = false

export function BotlodeChat() {
  if (!ENABLE_BOTLODE_PLAYER) return null

  return (
    <>
      {/* ── Iframe principal ───────────────────────────────── */}
      <iframe
        id="botlode-player"
        tabIndex={0}
        src="https://botlode-player.vercel.app?botId=0b99e786-fa91-42ba-9578-5784f5049140&v=2.5"
        style={{
          position: 'fixed',
          bottom: '16px',
          right: '16px',
          width: '150px',
          height: '150px',
          border: 'none',
          zIndex: 100003,
          pointerEvents: 'auto',
          background: 'transparent',
          opacity: 0,
          willChange: 'width, height',
          transform: 'translateZ(0)',
          touchAction: 'manipulation',
        }}
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-top-navigation-by-user-activation"
        allow="clipboard-write"
        allowTransparency
      />

      {/* ── Hit-zone del bot (burbuja flotante) ────────────── */}
      <div
        id="botlode-hitzone-bot"
        style={{
          position: 'fixed',
          bottom: '28px',
          right: '28px',
          width: '100px',
          height: '100px',
          zIndex: 100002,
          pointerEvents: 'none',
          cursor: 'wait',
          borderRadius: '50%',
          display: 'none',
          background: 'transparent',
          WebkitTapHighlightColor: 'transparent',
          touchAction: 'manipulation',
        }}
      />

      {/* ── Hit-zone de WhatsApp (botón secundario) ─────────── */}
      <div
        id="botlode-hitzone-wpp"
        style={{
          position: 'fixed',
          bottom: '168px',
          right: '28px',
          width: '100px',
          height: '100px',
          zIndex: 100002,
          pointerEvents: 'none',
          cursor: 'wait',
          borderRadius: '50%',
          display: 'none',
          background: 'transparent',
          WebkitTapHighlightColor: 'transparent',
          touchAction: 'manipulation',
        }}
      />

      {/* ── Lógica principal del widget ─────────────────────── */}
      <Script id="botlode-main" strategy="lazyOnload">{`
(function() {
  const iframe = document.getElementById('botlode-player');
  const hitzoneBotEl = document.getElementById('botlode-hitzone-bot');
  const hitzoneWppEl = document.getElementById('botlode-hitzone-wpp');
  if (!iframe) return;
  let isExpanded = false;
  let isOpening = false;
  let isAnimatingBubble = false;
  let botDisabled = false;
  const BUBBLE_HEIGHT_SOLO_BOT = 150;
  const BUBBLE_HEIGHT_WITH_WPP = 290;
  const BUBBLE_HEIGHT_OFF = 0;
  const BUBBLE_WIDTH_SOLO_BOT = 150;
  const BUBBLE_WIDTH_WITH_WPP = 140;
  let bubbleHeight = BUBBLE_HEIGHT_SOLO_BOT;
  let bubbleWidth = BUBBLE_WIDTH_SOLO_BOT;
  let iframeReady = false;
  let pendingOpenWhenReady = false;
  let justClosedTimestamp = 0;
  let firstOpenWarmupDone = false;
  const FIRST_OPEN_REVEAL_DELAY_MS = 45;
  let firstOpenLayoutPrimed = false;
  let lastClickTime = 0;
  const CLICK_COOLDOWN_MS = 150;
  let retryTimer = null;
  let retryCount = 0;
  const MAX_RETRIES = 2;
  const RETRY_DELAY_MS = 250;
  let touchHandled = false;
  let mouseHandled = false;
  let chatOpenViewportHeight = null;
  let currentKeyboardHeight = 0;
  const FLUTTER_FIX_STYLE_ID = 'botlode-flutter-pointer-fix';
  let flutterFixRetryTimer = null;
  let flutterFixRetryCount = 0;
  const FLUTTER_FIX_RETRY_DELAYS = [0, 50, 150, 300, 600];

  function applyFlutterPointerFix() {
    var styleEl = document.getElementById(FLUTTER_FIX_STYLE_ID);
    if (styleEl) styleEl.remove();
    var s = document.createElement('style');
    s.id = FLUTTER_FIX_STYLE_ID;
    s.textContent = 'flutter-view, flt-glass-pane, flt-scene-host, flt-glass-pane *, flt-scene-host *, flt-glass-pane canvas, flt-scene-host canvas { pointer-events: none !important; }';
    document.head.appendChild(s);
  }

  function removeFlutterPointerFix() {
    var styleEl = document.getElementById(FLUTTER_FIX_STYLE_ID);
    if (styleEl) styleEl.remove();
    if (flutterFixRetryTimer) { clearTimeout(flutterFixRetryTimer); flutterFixRetryTimer = null; }
    flutterFixRetryCount = 0;
  }

  function moveIframeToTop() {
    if (iframe && iframe.parentNode === document.body && document.body.lastChild !== iframe) {
      document.body.appendChild(iframe);
    }
  }

  function setFlutterHostPointerEventsForChat(chatExpanded) {
    if (!chatExpanded || !isNarrowScreen()) { removeFlutterPointerFix(); return; }
    if (flutterFixRetryTimer) { clearTimeout(flutterFixRetryTimer); flutterFixRetryTimer = null; }
    flutterFixRetryCount = 0;
    function doApply() {
      applyFlutterPointerFix();
      moveIframeToTop();
      flutterFixRetryCount++;
      if (flutterFixRetryCount < FLUTTER_FIX_RETRY_DELAYS.length && isExpanded && isNarrowScreen()) {
        flutterFixRetryTimer = setTimeout(doApply, FLUTTER_FIX_RETRY_DELAYS[flutterFixRetryCount]);
      }
    }
    doApply();
  }

  let expandedStyleCache = null;
  function cacheExpandedStyle() {
    if (isExpanded) {
      expandedStyleCache = {
        width: iframe.style.width, height: iframe.style.height,
        left: iframe.style.left, top: iframe.style.top,
        right: iframe.style.right, bottom: iframe.style.bottom
      };
    }
  }

  function restoreExpandedStyle() {
    if (isExpanded && expandedStyleCache) {
      iframe.style.transition = 'none';
      Object.keys(expandedStyleCache).forEach(function(key) { iframe.style[key] = expandedStyleCache[key]; });
      iframe.offsetHeight;
      iframe.style.transition = '';
    }
  }

  function forwardEventToIframe(event, eventType) {
    try {
      if (!iframe.contentWindow) return;
      const iframeRect = iframe.getBoundingClientRect();
      iframe.contentWindow.postMessage({ type: eventType, clientX: event.clientX || 0, clientY: event.clientY || 0, iframeX: iframeRect.left, iframeY: iframeRect.top }, '*');
    } catch (e) {}
  }

  function sendClickToIframe() {
    const rect = iframe.getBoundingClientRect();
    try {
      iframe.contentWindow.postMessage({ type: 'HITZONE_CLICK_BOT', clientX: rect.left + rect.width / 2, clientY: rect.bottom - 70, iframeX: rect.left, iframeY: rect.top }, '*');
      iframe.contentWindow.postMessage('HITZONE_CLICK_BOT', '*');
    } catch (e) {}
  }

  function openBotChat(source) {
    const now = Date.now();
    try { window.focus(); } catch(e) {}
    if (!iframeReady) { pendingOpenWhenReady = true; if (hitzoneBotEl) hitzoneBotEl.style.cursor = 'wait'; return; }
    if (botDisabled || isExpanded) return;
    if (now - lastClickTime < CLICK_COOLDOWN_MS) return;
    lastClickTime = now;
    iframe.style.pointerEvents = 'auto';
    updateHitzones(false);
    updateWppHitzone(false);
    sendClickToIframe();
    retryCount = 0;
    if (retryTimer) clearTimeout(retryTimer);
    retryTimer = setTimeout(function retryFn() {
      if (isExpanded) return;
      retryCount++;
      if (retryCount <= MAX_RETRIES) { sendClickToIframe(); retryTimer = setTimeout(retryFn, RETRY_DELAY_MS); }
    }, RETRY_DELAY_MS);
  }

  function openWppChat() {
    const now = Date.now();
    if (!iframeReady || botDisabled || isExpanded) return;
    if (now - lastClickTime < CLICK_COOLDOWN_MS) return;
    lastClickTime = now;
    const rect = iframe.getBoundingClientRect();
    try {
      iframe.contentWindow.postMessage({ type: 'HITZONE_CLICK_WPP', clientX: rect.left + rect.width / 2, clientY: rect.top + 50, iframeX: rect.left, iframeY: rect.top }, '*');
    } catch (e) {}
    /* Misma UX que WhatsAppOutboundLink: wa.me en pestaña nueva + /gracias en esta. Debe coincidir con BotlodeGraciasBridge. */
    try { window.dispatchEvent(new CustomEvent('apex-botlode-whatsapp')); } catch (e) {}
  }

  function updateHitzones() { if (hitzoneBotEl) { hitzoneBotEl.style.display = 'none'; hitzoneBotEl.style.pointerEvents = 'none'; } }
  function updateWppHitzone() { if (hitzoneWppEl) { hitzoneWppEl.style.display = 'none'; hitzoneWppEl.style.pointerEvents = 'none'; } }

  if (hitzoneBotEl) {
    hitzoneBotEl.addEventListener('pointerdown', function(e) {
      e.preventDefault(); e.stopPropagation();
      if (e.pointerType === 'touch') { touchHandled = true; setTimeout(function() { touchHandled = false; }, 500); }
      else { mouseHandled = true; setTimeout(function() { mouseHandled = false; }, 500); }
      openBotChat('pointerdown');
    }, { passive: false });
    hitzoneBotEl.addEventListener('touchstart', function(e) {
      e.preventDefault(); e.stopPropagation();
      if (touchHandled) return;
      touchHandled = true; openBotChat('touchstart');
      setTimeout(function() { touchHandled = false; }, 500);
    }, { passive: false });
    hitzoneBotEl.addEventListener('mousedown', function(e) {
      e.preventDefault(); e.stopPropagation();
      if (mouseHandled || touchHandled) return;
      mouseHandled = true; openBotChat('mousedown');
      setTimeout(function() { mouseHandled = false; }, 500);
    }, { passive: false });
    hitzoneBotEl.addEventListener('click', function(e) {
      e.preventDefault(); e.stopPropagation();
      if (touchHandled || mouseHandled) return;
      openBotChat('click');
    }, { passive: false });
    hitzoneBotEl.addEventListener('mouseenter', function(e) { if (!isExpanded) forwardEventToIframe(e, 'HITZONE_ENTER_BOT'); });
    hitzoneBotEl.addEventListener('mouseleave', function(e) { if (!isExpanded) forwardEventToIframe(e, 'HITZONE_LEAVE_BOT'); });
    hitzoneBotEl.addEventListener('contextmenu', function(e) { e.preventDefault(); });
    hitzoneBotEl.addEventListener('dragstart', function(e) { e.preventDefault(); });
  }

  if (hitzoneWppEl) {
    hitzoneWppEl.addEventListener('pointerdown', function(e) {
      e.preventDefault(); e.stopPropagation();
      if (e.pointerType === 'touch') { touchHandled = true; setTimeout(function() { touchHandled = false; }, 500); }
      else { mouseHandled = true; setTimeout(function() { mouseHandled = false; }, 500); }
      openWppChat();
    }, { passive: false });
    hitzoneWppEl.addEventListener('touchstart', function(e) {
      e.preventDefault(); e.stopPropagation();
      if (touchHandled) return;
      touchHandled = true; openWppChat();
      setTimeout(function() { touchHandled = false; }, 500);
    }, { passive: false });
    hitzoneWppEl.addEventListener('mousedown', function(e) {
      e.preventDefault(); e.stopPropagation();
      if (mouseHandled || touchHandled) return;
      mouseHandled = true; openWppChat();
      setTimeout(function() { mouseHandled = false; }, 500);
    }, { passive: false });
    hitzoneWppEl.addEventListener('click', function(e) {
      e.preventDefault(); e.stopPropagation();
      if (touchHandled || mouseHandled) return;
      openWppChat();
    }, { passive: false });
    hitzoneWppEl.addEventListener('contextmenu', function(e) { e.preventDefault(); });
    hitzoneWppEl.addEventListener('dragstart', function(e) { e.preventDefault(); });
  }

  function activateIframe() {
    if (iframeReady) return;
    iframeReady = true;
    iframe.style.pointerEvents = 'auto';
    iframe.style.transition = 'opacity 0.3s ease-out';
    iframe.style.opacity = '1';
    setTimeout(function() {
      iframe.style.transition = '';
      primeFirstOpenLayout();
    }, 350);
    if (pendingOpenWhenReady) {
      pendingOpenWhenReady = false;
      setTimeout(function() { openBotChat('pendingOpen'); }, 200);
    }
  }

  function isNarrowScreen() { return window.innerWidth < 640; }

  function getCollapsedBubbleSize() {
    if (!isNarrowScreen()) {
      return { width: bubbleWidth, height: bubbleHeight };
    }

    if (bubbleHeight === BUBBLE_HEIGHT_OFF) {
      return { width: 0, height: 0 };
    }

    if (bubbleHeight === BUBBLE_HEIGHT_WITH_WPP) {
      return { width: 44, height: 96 };
    }

    return { width: 44, height: 44 };
  }

  function applyHitzonePosition() {
    const mobile = isNarrowScreen();
    const anchorInset = mobile ? 16 : 28;
    const hitzoneSize = mobile ? 44 : 100;
    const wppOffset = mobile ? 68 : 168;

    if (hitzoneBotEl) {
      hitzoneBotEl.style.right = anchorInset + 'px';
      hitzoneBotEl.style.bottom = anchorInset + 'px';
      hitzoneBotEl.style.width = hitzoneSize + 'px';
      hitzoneBotEl.style.height = hitzoneSize + 'px';
    }

    if (hitzoneWppEl) {
      hitzoneWppEl.style.right = anchorInset + 'px';
      hitzoneWppEl.style.bottom = wppOffset + 'px';
      hitzoneWppEl.style.width = hitzoneSize + 'px';
      hitzoneWppEl.style.height = hitzoneSize + 'px';
    }
  }

  function applyBubblePosition() {
    if (isExpanded) return;
    const collapsedSize = getCollapsedBubbleSize();
    iframe.style.left = 'auto'; iframe.style.top = 'auto';
    iframe.style.right = '16px'; iframe.style.bottom = '16px';
    iframe.style.width = collapsedSize.width + 'px'; iframe.style.height = collapsedSize.height + 'px';
  }

  function primeFirstOpenLayout() {
    if (firstOpenLayoutPrimed) return;
    firstOpenLayoutPrimed = true;
    const prevTransition = iframe.style.transition;
    const prevVisibility = iframe.style.visibility;
    const prevOpacity = iframe.style.opacity;
    const prevFilter = iframe.style.filter;
    const prevTransform = iframe.style.transform;
    iframe.style.transition = 'none';
    iframe.style.visibility = 'hidden';
    iframe.style.opacity = '0';
    iframe.style.filter = '';
    iframe.style.transform = 'translateZ(0)';
    if (isNarrowScreen()) {
      iframe.style.left = '0'; iframe.style.top = '0'; iframe.style.right = '0'; iframe.style.bottom = '0';
      iframe.style.width = '100%'; iframe.style.height = '100%';
    } else {
      iframe.style.left = 'auto'; iframe.style.top = 'auto';
      iframe.style.right = '16px'; iframe.style.bottom = '16px';
      iframe.style.width = '450px'; iframe.style.height = 'calc(100vh - 32px)';
    }
    iframe.offsetHeight;
    applyBubblePosition();
    iframe.offsetHeight;
    iframe.style.transition = prevTransition || 'none';
    iframe.style.visibility = prevVisibility || 'visible';
    iframe.style.opacity = prevOpacity || '1';
    iframe.style.filter = prevFilter || '';
    iframe.style.transform = prevTransform || 'translateZ(0)';
  }

  const T = { closeFadeOut: 120, closeWaitChat: 380, pauseBeforeEntrance: 100, entranceDelay: 60, entranceMain: 380, entranceBounce2: 180, entranceSettle: 120, resetAfter: 80 };

  function animateBubbleEntrance() {
    isAnimatingBubble = true;
    iframe.style.opacity = '0';
    iframe.style.transform = 'translateZ(0) scale(0.3) rotate(-15deg)';
    iframe.style.filter = 'blur(8px) brightness(2)';
    setTimeout(function() {
      iframe.style.transition = 'opacity ' + (T.entranceMain * 0.4) + 'ms cubic-bezier(0.34, 1.56, 0.64, 1), transform ' + T.entranceMain + 'ms cubic-bezier(0.34, 1.56, 0.64, 1), filter ' + (T.entranceMain * 0.5) + 'ms ease-out';
      requestAnimationFrame(function() {
        iframe.style.opacity = '1';
        iframe.style.transform = 'translateZ(0) scale(1.1) rotate(3deg)';
        iframe.style.filter = 'blur(0px) brightness(1.3)';
      });
      setTimeout(function() {
        iframe.style.transition = 'transform ' + T.entranceBounce2 + 'ms cubic-bezier(0.25, 0.46, 0.45, 0.94), filter ' + T.entranceBounce2 + 'ms ease-out';
        iframe.style.transform = 'translateZ(0) scale(0.95) rotate(-1deg)';
        iframe.style.filter = 'blur(0px) brightness(1.1)';
        setTimeout(function() {
          iframe.style.transition = 'transform ' + T.entranceSettle + 'ms ease-out, filter ' + T.entranceSettle + 'ms ease-out';
          iframe.style.transform = 'translateZ(0) scale(1) rotate(0deg)';
          iframe.style.filter = 'blur(0px) brightness(1)';
          setTimeout(function() { iframe.style.transition = ''; iframe.style.filter = ''; isAnimatingBubble = false; }, T.resetAfter);
        }, T.entranceBounce2 * 0.6);
      }, T.entranceMain);
    }, T.entranceDelay);
  }

  window.addEventListener('message', function(event) {
    const data = event.data;
    if ((isExpanded || isOpening) && (data === 'CMD_WPP_VISIBLE' || data === 'CMD_WPP_HIDDEN')) return;
    const timeSinceClose = Date.now() - justClosedTimestamp;
    if (justClosedTimestamp > 0 && timeSinceClose < 500 && (data === 'CMD_WPP_VISIBLE' || data === 'CMD_WPP_HIDDEN' || data === 'CMD_OPEN')) return;

    if (data === 'CMD_READY') { activateIframe(); return; }

    if (data === 'CMD_BOT_DISABLED') {
      botDisabled = true; setFlutterHostPointerEventsForChat(false); isExpanded = false;
      bubbleHeight = BUBBLE_HEIGHT_OFF;
      iframe.style.transition = 'height 0.25s ease-out, width 0.25s ease-out, opacity 0.25s ease-out';
      iframe.style.height = '0px'; iframe.style.width = '0px'; iframe.style.minWidth = '0px'; iframe.style.minHeight = '0px';
      iframe.style.opacity = '0'; iframe.style.pointerEvents = 'none'; iframe.style.visibility = 'hidden';
      iframe.style.overflow = 'hidden'; iframe.style.display = 'none';
      if (hitzoneBotEl) hitzoneBotEl.style.display = 'none';
      if (hitzoneWppEl) hitzoneWppEl.style.display = 'none';
      return;
    }

    if (data === 'CMD_BOT_ENABLED') {
      if (botDisabled) {
        botDisabled = false; setFlutterHostPointerEventsForChat(false); isExpanded = false;
        bubbleHeight = BUBBLE_HEIGHT_SOLO_BOT; bubbleWidth = BUBBLE_WIDTH_SOLO_BOT;
        iframe.style.display = ''; iframe.style.visibility = ''; iframe.style.overflow = '';
        iframe.style.minWidth = ''; iframe.style.minHeight = '';
        iframe.style.transition = 'height 0.25s ease-out, width 0.25s ease-out, opacity 0.25s ease-out';
        iframe.style.width = bubbleWidth + 'px'; iframe.style.height = bubbleHeight + 'px';
        iframe.style.opacity = '1'; iframe.style.pointerEvents = iframeReady ? 'auto' : 'none';
        updateHitzones(); updateWppHitzone(); applyBubblePosition();
      }
      return;
    }

    if (data === 'CMD_OPEN') {
      if (botDisabled) return;
      if (!isExpanded && !isOpening) {
        if (retryTimer) { clearTimeout(retryTimer); retryTimer = null; }
        isOpening = true; isExpanded = true; isAnimatingBubble = false;
        setFlutterHostPointerEventsForChat(true);
        iframe.style.filter = ''; iframe.style.transform = 'translateZ(0)';
        iframe.style.transition = 'none'; iframe.style.opacity = '0'; iframe.style.pointerEvents = 'auto';
        try { iframe.focus(); } catch(e) {}
        updateHitzones(); updateWppHitzone();
        if (isNarrowScreen() && window.visualViewport) chatOpenViewportHeight = window.visualViewport.height;
        const isFirstOpen = !firstOpenWarmupDone;
        if (isFirstOpen) { iframe.style.visibility = 'hidden'; iframe.style.clipPath = 'inset(100% 100% 100% 100%)'; }
        if (isNarrowScreen()) {
          iframe.style.left = '0'; iframe.style.top = '0'; iframe.style.right = '0'; iframe.style.bottom = '0';
          iframe.style.width = '100%'; iframe.style.height = '100%';
        } else {
          iframe.style.left = 'auto'; iframe.style.top = 'auto';
          iframe.style.right = '16px'; iframe.style.bottom = '16px';
          iframe.style.width = '450px'; iframe.style.height = 'calc(100vh - 32px)';
        }
        iframe.offsetHeight;
        const revealDelay = isFirstOpen ? FIRST_OPEN_REVEAL_DELAY_MS : 0;
        setTimeout(function() {
          requestAnimationFrame(function() {
            requestAnimationFrame(function() {
              iframe.style.transition = 'opacity 100ms ease-out';
              if (isFirstOpen) { iframe.style.visibility = 'visible'; iframe.style.clipPath = 'none'; }
              iframe.style.opacity = '1';
              setTimeout(function() { iframe.style.transition = 'none'; isOpening = false; }, 150);
            });
          });
        }, revealDelay);
        firstOpenWarmupDone = true;
        setTimeout(cacheExpandedStyle, 50);
      }
    } else if (data === 'CMD_CLOSE') {
      if (botDisabled) return;
      if (isExpanded) {
        setFlutterHostPointerEventsForChat(false);
        isExpanded = false; isOpening = false; expandedStyleCache = null;
        justClosedTimestamp = Date.now(); isAnimatingBubble = false;
        iframe.style.pointerEvents = iframeReady ? 'auto' : 'none';
        chatOpenViewportHeight = null; currentKeyboardHeight = 0;
        updateHitzones(); updateWppHitzone();
        iframe.style.filter = 'none'; iframe.style.transform = 'none';
        iframe.style.transition = 'opacity ' + (T.closeFadeOut / 1000) + 's ease-out';
        iframe.style.opacity = '0';
        setTimeout(function() {
          if (botDisabled) return;
          iframe.style.transition = 'none';
          if (isNarrowScreen()) { applyBubblePosition(); }
          else { iframe.style.width = bubbleWidth + 'px'; iframe.style.height = bubbleHeight + 'px'; }
          iframe.offsetHeight;
          setTimeout(animateBubbleEntrance, T.pauseBeforeEntrance);
        }, T.closeWaitChat);
      }
    } else if (data === 'CMD_WPP_VISIBLE') {
      if (botDisabled) return;
      bubbleHeight = BUBBLE_HEIGHT_WITH_WPP; bubbleWidth = BUBBLE_WIDTH_WITH_WPP;
      updateWppHitzone();
      if (!isExpanded) { iframe.style.transition = 'height 0.25s ease-out, width 0.25s ease-out'; iframe.style.width = bubbleWidth + 'px'; iframe.style.height = BUBBLE_HEIGHT_WITH_WPP + 'px'; }
    } else if (data === 'CMD_WPP_HIDDEN') {
      if (botDisabled) return;
      bubbleHeight = BUBBLE_HEIGHT_SOLO_BOT; bubbleWidth = BUBBLE_WIDTH_SOLO_BOT;
      updateWppHitzone();
      if (!isExpanded) { iframe.style.transition = 'height 0.25s ease-out, width 0.25s ease-out'; iframe.style.width = bubbleWidth + 'px'; iframe.style.height = BUBBLE_HEIGHT_SOLO_BOT + 'px'; }
    }
  });

  function handleCollapsedResize() {
    applyHitzonePosition();
    if (!isExpanded) {
      applyBubblePosition();
    }
  }

  window.addEventListener('resize', handleCollapsedResize, { passive: true });
  applyHitzonePosition();
  applyBubblePosition();

  setTimeout(function() { if (!iframeReady) activateIframe(); }, 8000);

  let lastExpandedCheck = 0;
  const sizeObserver = new MutationObserver(function() {
    const now = Date.now();
    if (now - lastExpandedCheck < 50) return;
    lastExpandedCheck = now;
    if (isExpanded && !isAnimatingBubble && !isOpening) {
      const currentWidth = parseInt(iframe.style.width) || iframe.offsetWidth;
      const currentHeight = parseInt(iframe.style.height) || iframe.offsetHeight;
      const isNarrow = isNarrowScreen();
      if (currentWidth < (isNarrow ? 300 : 400) || currentHeight < (isNarrow ? 400 : 500)) restoreExpandedStyle();
    }
  });
  sizeObserver.observe(iframe, { attributes: true, attributeFilter: ['style'] });

  setInterval(function() {
    if (isExpanded && !isAnimatingBubble && !isOpening) {
      const currentWidth = parseInt(iframe.style.width) || iframe.offsetWidth;
      const currentHeight = parseInt(iframe.style.height) || iframe.offsetHeight;
      const isNarrow = isNarrowScreen();
      if (currentWidth < (isNarrow ? 300 : 400) || currentHeight < (isNarrow ? 400 : 500)) restoreExpandedStyle();
    }
  }, 16);

  if (window.visualViewport) {
    function handleKeyboardViewport() {
      if (!isExpanded || !isNarrowScreen() || !chatOpenViewportHeight) return;
      const vv = window.visualViewport;
      const diff = chatOpenViewportHeight - vv.height;
      if (diff > 80) {
        currentKeyboardHeight = diff;
        iframe.style.height = Math.round(vv.height) + 'px';
        iframe.style.top = Math.round(vv.offsetTop) + 'px';
        iframe.style.bottom = 'auto';
      } else if (currentKeyboardHeight > 0) {
        currentKeyboardHeight = 0; chatOpenViewportHeight = vv.height;
        iframe.style.height = '100%'; iframe.style.top = '0'; iframe.style.bottom = '0';
      }
    }
    window.visualViewport.addEventListener('resize', handleKeyboardViewport);
    window.visualViewport.addEventListener('scroll', handleKeyboardViewport);
  }

  const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
  if (!isTouchDevice) {
    let lastMouseUpdate = 0;
    const MOUSE_THROTTLE_MS = 50;
    function onMouseMove(event) {
      const now = Date.now();
      if (now - lastMouseUpdate < MOUSE_THROTTLE_MS) return;
      lastMouseUpdate = now;
      try {
        if (!iframe.contentWindow) return;
        const iframeRect = iframe.getBoundingClientRect();
        iframe.contentWindow.postMessage({ type: 'MOUSE_MOVE', x: event.clientX, y: event.clientY, iframeX: iframeRect.left, iframeY: iframeRect.top, iframeWidth: iframeRect.width, iframeHeight: iframeRect.height }, '*');
      } catch (e) {}
    }
    function onMouseLeave() {
      try { if (iframe.contentWindow) iframe.contentWindow.postMessage({ type: 'MOUSE_LEAVE' }, '*'); } catch (e) {}
    }
    document.addEventListener('mousemove', onMouseMove, true);
    document.addEventListener('mouseleave', onMouseLeave, true);
    document.documentElement.addEventListener('mouseleave', onMouseLeave, true);
  }
})();
      `}</Script>

      {/* ── Snackbars de conectividad ────────────────────────── */}
      <Script id="botlode-connectivity" strategy="lazyOnload">{`
(function() {
  'use strict';
  var C = 'botlode-connectivity-snackbars', O = 'botlode-snackbar-offline', N = 'botlode-snackbar-online';
  var showOfflineAlert = true;
  var currentNetworkStatus = typeof navigator !== 'undefined' ? navigator.onLine : true;
  var onlineTimeout = null, lastOnlineCallTime = 0, DEBOUNCE_MS = 500;

  var SVG_OFFLINE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/><line x1="2" y1="2" x2="22" y2="22" stroke-dasharray="2 2"/></svg>';
  var SVG_ONLINE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';

  function injectStyles() {
    if (document.getElementById('botlode-connectivity-styles')) return;
    var s = document.createElement('style');
    s.id = 'botlode-connectivity-styles';
    s.textContent = '#' + C + '{position:fixed;bottom:32px;left:50%;transform:translateX(-50%);z-index:2147483647;display:flex;flex-direction:column;align-items:center;gap:12px;pointer-events:none}'
      + '.botlode-snackbar{position:relative;display:flex;align-items:center;gap:16px;padding:18px 26px;min-width:320px;max-width:min(90vw,480px);border-radius:16px;font-family:Oxanium,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;font-size:15px;font-weight:600;letter-spacing:.6px;box-sizing:border-box;pointer-events:none;opacity:0;transform:translateY(24px) scale(.94);transition:opacity .45s cubic-bezier(.34,1.56,.64,1),transform .45s cubic-bezier(.34,1.56,.64,1),box-shadow .35s ease;backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);box-shadow:0 8px 32px rgba(0,0,0,.3),0 2px 8px rgba(0,0,0,.2)}'
      + '.botlode-snackbar.show{opacity:1;transform:translateY(0) scale(1)}'
      + '.botlode-snackbar.hide{opacity:0;transform:translateY(-16px) scale(.92);transition-duration:.32s}'
      + '.botlode-snackbar-offline{background:linear-gradient(135deg,rgba(25,14,10,.92) 0%,rgba(18,10,6,.95) 100%);border:1.5px solid rgba(255,145,70,.6);color:#ffc299;box-shadow:0 0 28px rgba(255,120,50,.22),inset 0 1px 0 rgba(255,200,120,.12),0 12px 40px rgba(0,0,0,.35)}'
      + '.botlode-snackbar-offline .snackbar-glow{position:absolute;inset:-2px;border-radius:16px;padding:2px;background:linear-gradient(135deg,rgba(255,145,70,.3) 0%,transparent 50%,rgba(220,70,50,.2) 100%);-webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);-webkit-mask-composite:xor;mask-composite:exclude;pointer-events:none;animation:botlode-pulse-off 2.8s ease-in-out infinite}'
      + '@keyframes botlode-pulse-off{0%,100%{opacity:.65}50%{opacity:1}}'
      + '.botlode-snackbar-online{background:linear-gradient(135deg,rgba(10,28,18,.92) 0%,rgba(6,20,14,.95) 100%);border:1.5px solid rgba(90,230,150,.55);color:#a0ffcc;box-shadow:0 0 28px rgba(70,230,130,.18),inset 0 1px 0 rgba(140,255,200,.14),0 12px 40px rgba(0,0,0,.35)}'
      + '.botlode-snackbar-online .snackbar-glow{position:absolute;inset:-2px;border-radius:16px;padding:2px;background:linear-gradient(135deg,rgba(90,230,150,.25) 0%,transparent 50%,rgba(70,190,110,.15) 100%);-webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);-webkit-mask-composite:xor;mask-composite:exclude;pointer-events:none;animation:botlode-pulse-on 2.8s ease-in-out infinite}'
      + '@keyframes botlode-pulse-on{0%,100%{opacity:.55}50%{opacity:1}}'
      + '.botlode-snackbar .snackbar-icon{flex-shrink:0;width:32px;height:32px;display:flex;align-items:center;justify-content:center;animation:botlode-icon-pop .5s cubic-bezier(.34,1.56,.64,1)}'
      + '@keyframes botlode-icon-pop{0%{transform:scale(.4) rotate(-12deg);opacity:0}60%{transform:scale(1.12) rotate(4deg)}100%{transform:scale(1) rotate(0deg);opacity:1}}'
      + '.botlode-snackbar .snackbar-icon svg{width:100%;height:100%}'
      + '.botlode-snackbar-offline .snackbar-icon{color:#ff9d6e;filter:drop-shadow(0 0 8px rgba(255,140,80,.4))}'
      + '.botlode-snackbar-online .snackbar-icon{color:#70f0a0;filter:drop-shadow(0 0 8px rgba(100,240,160,.45))}'
      + '.botlode-snackbar .snackbar-text{flex:1;line-height:1.5;text-shadow:0 1px 2px rgba(0,0,0,.3)}';
    (document.head || document.documentElement).appendChild(s);
  }

  function createSnackbars() {
    if (document.getElementById(C)) return;
    var w = document.createElement('div');
    w.id = C; w.setAttribute('aria-live', 'polite');
    w.innerHTML = '<div id="' + O + '" class="botlode-snackbar botlode-snackbar-offline" role="status" hidden>'
      + '<span class="snackbar-glow"></span>'
      + '<span class="snackbar-icon" aria-hidden="true">' + SVG_OFFLINE + '</span>'
      + '<span class="snackbar-text">Conexión perdida. Comprueba tu red.</span>'
      + '</div>'
      + '<div id="' + N + '" class="botlode-snackbar botlode-snackbar-online" role="status" hidden>'
      + '<span class="snackbar-glow"></span>'
      + '<span class="snackbar-icon" aria-hidden="true">' + SVG_ONLINE + '</span>'
      + '<span class="snackbar-text">Reconexión exitosa</span>'
      + '</div>';
    document.body.appendChild(w);
  }

  function showOffline() {
    if (typeof navigator !== 'undefined' && navigator.onLine) { currentNetworkStatus = true; return; }
    currentNetworkStatus = false;
    if (!showOfflineAlert) return;
    var so = document.getElementById(O), son = document.getElementById(N);
    if (!so) return;
    if (onlineTimeout) { clearTimeout(onlineTimeout); onlineTimeout = null; }
    if (son) { son.classList.remove('show'); son.classList.add('hide'); son.setAttribute('hidden', ''); }
    so.removeAttribute('hidden'); so.classList.remove('hide');
    requestAnimationFrame(function() { so.classList.add('show'); });
  }

  function showOnline() {
    currentNetworkStatus = true;
    if (!showOfflineAlert) return;
    var now = Date.now();
    if (now - lastOnlineCallTime < DEBOUNCE_MS) return;
    lastOnlineCallTime = now;
    var so = document.getElementById(O), son = document.getElementById(N);
    if (!son || !so) return;
    so.classList.remove('show'); so.classList.add('hide');
    setTimeout(function() { so.setAttribute('hidden', ''); so.classList.remove('hide'); }, 300);
    son.removeAttribute('hidden'); son.classList.remove('hide');
    requestAnimationFrame(function() { son.classList.add('show'); });
    if (onlineTimeout) clearTimeout(onlineTimeout);
    onlineTimeout = setTimeout(function() {
      if (son) { son.classList.remove('show'); son.classList.add('hide'); setTimeout(function() { if (son) { son.setAttribute('hidden', ''); son.classList.remove('show', 'hide'); } }, 300); }
      onlineTimeout = null;
    }, 3000);
  }

  function onMessage(ev) {
    var d = ev.data;
    if (d && typeof d === 'object' && d.type === 'BOT_CONFIG') {
      var prev = showOfflineAlert;
      showOfflineAlert = d.showOfflineAlert === true;
      if (!showOfflineAlert) {
        var so = document.getElementById(O);
        if (so && so.classList.contains('show')) { so.classList.remove('show'); so.classList.add('hide'); setTimeout(function() { so.setAttribute('hidden', ''); }, 300); }
      } else if (showOfflineAlert && !prev && !currentNetworkStatus) {
        if (!navigator.onLine) showOffline();
      }
      return;
    }
    if (d && typeof d === 'object' && d.type === 'connectivity') { if (d.online) showOnline(); else showOffline(); return; }
    if (d === 'NETWORK_OFFLINE') { showOffline(); return; }
    if (d === 'NETWORK_ONLINE') { showOnline(); return; }
  }

  function init() {
    injectStyles(); createSnackbars();
    window.addEventListener('message', onMessage);
    window.addEventListener('online', function() { currentNetworkStatus = true; showOnline(); });
    window.addEventListener('offline', function() { currentNetworkStatus = false; if (showOfflineAlert) showOffline(); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
      `}</Script>
    </>
  )
}
