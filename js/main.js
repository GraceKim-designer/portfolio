(function () {
  'use strict';
  var stage = document.getElementById('stage');

  // 화면 폭이 1440보다 좁으면 전체를 비율에 맞춰 축소 (sticky 헤더 유지를 위해 zoom 사용)
  var mq = window.matchMedia('(max-width: 700px)');
  function fit() {
    var w = document.documentElement.clientWidth;
    if (mq.matches) { document.body.style.zoom = ''; return; }
    var z = Math.min(1, w / 1440);
    // 메인 화면은 높이도 맞춰 스크롤 없이 한 화면에 보이도록 축소
    document.body.style.zoom = z < 1 ? z : '';
    // 메인: 헤더는 서브페이지와 같은 크기로 두고, 일러스트 영역만 높이에 맞춰 축소
    var art = document.getElementById('art');
    if (art) {
      var s = Math.min(1, ((window.innerHeight / z) - 66) / 970);
      art.style.transform = 'scale(' + s + ')';
      stage.style.height = (66 + 970 * s) + 'px';
    }
  }
  // 모바일 메인: 잘라낸 영역(가로 816px)이 화면 폭에 맞도록 배율 계산
  function fitHero() {
    var hero = document.getElementById('mhero'), cv = document.getElementById('mcanvas');
    if (!hero || !cv) return;
    var sc = hero.clientWidth / 816;
    cv.style.transform = 'scale(' + sc + ') translate(-302px, -65px)';
    // 중앙 줄을 상단 바의 선까지 이어 그림 (원본 줄 위치: x 709.2)
    var r = document.getElementById('mrope');
    if (r) { r.style.left = (hero.offsetLeft + (709.2 - 302) * sc - 0.5) + 'px'; r.style.height = (hero.offsetTop + 2) + 'px'; }
  }
  // 모바일 메인: 오브젝트를 누르면 제목과 하위 메뉴가 바뀜 (PC의 마우스 오버와 같은 역할)
  (function () {
    var t = document.getElementById('mtitle2'); if (!t) return;
    var cur = 'intro', timer = null;
    Array.prototype.forEach.call(document.querySelectorAll('.mhot'), function (h) {
      h.addEventListener('click', function () {
        var key = h.getAttribute('data-key'); if (key === cur) return; cur = key;
        t.className = 'out';
        clearTimeout(timer);
        timer = setTimeout(function () {
          t.textContent = h.getAttribute('data-title'); t.className = 'in';
          void t.offsetWidth; t.className = '';
        }, 200);
        Array.prototype.forEach.call(document.querySelectorAll('.mmain .mlinks'), function (m) {
          if (m.getAttribute('data-for') === key) m.removeAttribute('hidden'); else m.setAttribute('hidden', '');
        });
      });
    });
  })();
  window.addEventListener('resize', function () { fit(); fitHero(); });
  fit();
  fitHero();

  // 영상: 화면 종류에 맞는 것만 불러옴 (모바일은 작은 영상만, PC는 PC용만)
  function loadVideos() {
    var attr = mq.matches ? 'data-m-src' : 'data-d-src';
    Array.prototype.forEach.call(document.querySelectorAll('video[' + attr + ']'), function (v) {
      if (!v.getAttribute('src')) { v.setAttribute('src', v.getAttribute(attr)); v.play && v.play().catch(function () {}); }
    });
  }
  loadVideos();
  if (mq.addEventListener) mq.addEventListener('change', function () { fit(); loadVideos(); });

  // 모바일 햄버거 메뉴
  var burger = document.querySelector('.mburger'), mnav = document.getElementById('mnav');
  if (burger && mnav) {
    burger.addEventListener('click', function () {
      var open = !mnav.classList.contains('open');
      mnav.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      mnav.setAttribute('aria-hidden', open ? 'false' : 'true');
      document.body.classList.toggle('mlock', open);
    });
    Array.prototype.forEach.call(mnav.querySelectorAll('.mnav-btn'), function (b) {
      b.addEventListener('click', function () {
        var cat = b.parentNode, open = !cat.classList.contains('open');
        cat.classList.toggle('open', open);
        b.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    });
  }

  // 상단 메뉴: 클릭으로 열고, 다른 메뉴를 열거나 바깥을 누르거나 마우스가 벗어나면 닫힘
  var menus = Array.prototype.slice.call(document.querySelectorAll('.menu'));
  var timers = new WeakMap();
  function closeAll(except) {
    menus.forEach(function (m) {
      if (m !== except) {
        m.classList.remove('open');
        m.querySelector('.mlabel').setAttribute('aria-expanded', 'false');
      }
    });
  }
  menus.forEach(function (m) {
    var btn = m.querySelector('.mlabel');
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var willOpen = !m.classList.contains('open');
      closeAll(m);
      m.classList.toggle('open', willOpen);
      btn.setAttribute('aria-expanded', String(willOpen));
    });
    m.addEventListener('mouseleave', function () {
      timers.set(m, setTimeout(function () {
        m.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      }, 250));
    });
    m.addEventListener('mouseenter', function () { clearTimeout(timers.get(m)); });
  });
  document.addEventListener('click', function () { closeAll(null); });

  // 메인: 오브젝트에 마우스를 올리면 하단 제목이 분류명으로 바뀜
  var mt = document.getElementById('mt');
  if (mt) {
    var current = 'Introduce';
    function swap(next) {
      if (next === current) return;
      current = next;
      mt.className = 'out';
      setTimeout(function () {
        mt.textContent = next;
        mt.className = 'in';
        void mt.offsetWidth;
        mt.className = '';
      }, 160);
    }
    Array.prototype.forEach.call(document.querySelectorAll('.hot'), function (h) {
      h.addEventListener('mouseenter', function () { swap(h.getAttribute('data-label')); });
      h.addEventListener('mouseleave', function () { swap('Introduce'); });
    });
  }
})();
