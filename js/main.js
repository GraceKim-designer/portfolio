(function () {
  'use strict';
  var stage = document.getElementById('stage');

  // 화면 폭이 1440보다 좁으면 전체를 비율에 맞춰 축소 (sticky 헤더 유지를 위해 zoom 사용)
  function fit() {
    var w = document.documentElement.clientWidth;
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
  window.addEventListener('resize', fit);
  fit();

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
