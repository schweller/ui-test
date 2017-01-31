'use strict';

(function() {

var ui = (function() {

  var state = {
    activeMenu: null,
    overlayOn: false
  };

  var nav, openNav, closeNav, navOverlay, subMenuSelectors;

  var prepareApp = function() {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      var OK = 200;
      var DONE = 4;
      if (xhr.readyState === DONE) {
        if (xhr.status === OK) {
          var data = JSON.parse(xhr.response).items;
          var html = buildMenu(data);
          document.querySelector('.huge-nav-container').innerHTML = html;
          attachHandlers();
        }
      }
    }

    xhr.open('GET', '/api/nav.json');
    xhr.send();
  }

  var buildMenu = function (data, subMenu) {
    var listClass = "huge-nav-list",
        linkClass = "huge-nav-link",
        linkClassSubMenu = "huge-nav-link sub-menu";

    if (subMenu) {
      listClass = "huge-nav-sub-list";
      linkClass = "huge-nav-sub-link"
    }

    var html = '';
    html += '<ul class="' + listClass + '">';
    data.forEach(function(menu, i, arr) {
      html += '<li>';
      if (menu.items && menu.items.length > 0) { // An array will return 'object'
        if (subMenu) {
          html += '<a class="' + linkClass + '" href="' + menu.url + '">' + menu.label + '</a>';
        } else {
          html += '<a class="' + linkClassSubMenu + '" href="' + menu.url + '">' + menu.label + '</a>';
        }
        html += buildMenu(menu.items, true); // Submenu found. Calling recursively same method (and wrapping it in a div)
      } else {
        html += '<a class="' + linkClass + '" href="' + menu.url + '">' + menu.label + '</a>';
      }
      html += '</li>';
    })
    html += '</ul>';
    // html += (isSub)?'</div>':'';
    return html;
  }

  var attachHandlers = function() {
    nav = document.querySelector('.huge-nav');
    openNav = document.querySelector('.open-huge-nav');
    closeNav = document.querySelector('.close-huge-nav');
    navOverlay = document.querySelector('.huge-nav-overlay');
    subMenuSelectors = document.querySelectorAll('.sub-menu')

    openNav.addEventListener('click', function(e) {
      e.preventDefault();
      nav.classList.add('opened');
      nav.classList.remove('closed');
      toggleOverlay()
    })

    closeNav.addEventListener('click', closeMenu())

    navOverlay.addEventListener('click', closeMenu())

    for (var i = 0; i < subMenuSelectors.length; i++) {
      subMenuSelectors[i].addEventListener('click', handleMenu(i))
    }
  }

  var handleMenu = function (index) {
    return function (e) {
      e.preventDefault();
      toggleMenu(index);
    }
  }

  var closeMenu = function() {
    return function(e) {
      e.preventDefault();
      console.log('lala')
      nav.classList.remove('opened');
      nav.classList.add('closed');
      if (state.activeMenu !== null) closeMenuItem(subMenuSelectors[state.activeMenu]);
      toggleOverlay();
    }
  }

  var toggleMenu = function(index) {
    var selector = subMenuSelectors[index],
        activeMenu = state.activeMenu

    if (activeMenu === null) {
      openMenuItem(selector)
      state.activeMenu = index;
      if (document.body.scrollWidth > 768)
        toggleOverlay();
    } else if (activeMenu !== index) {
      console.log('activeMenu !== index')
      openMenuItem(selector)
      closeMenuItem(subMenuSelectors[activeMenu])
      state.activeMenu = index;
    } else if (activeMenu === index) {
      console.log('activeMenu === index')
      closeMenuItem(selector)
      state.activeMenu = null
      if (document.body.scrollWidth > 768 && state.overlayOn === true)
        toggleOverlay();
    }
  }

  var openMenuItem = function(selector) {
    selector.classList.add('opened')
    selector.classList.remove('closed')
  }

  var closeMenuItem = function(selector) {
    selector.classList.remove('opened')
    selector.classList.add('closed')
  }

  var toggleOverlay = function() {
    var overlayOn = state.overlayOn
    document.body.classList.toggle('crop-view-y')
    navOverlay.classList.toggle('visible')
    state.overlayOn = !overlayOn
  }

  return {
    init: function() {
      prepareApp();
    }
  }

})();

ui.init();

})();
