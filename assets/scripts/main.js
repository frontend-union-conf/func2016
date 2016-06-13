'use strict';

(() => {

let sticky = document.querySelector('[data-sticky]');
let stickyHeight = sticky.offsetHeight;
let stickyHeightNew = 74;
let stickyPoint = document.querySelector('[data-sticky-action]').offsetTop - stickyHeightNew;

let main = document.querySelector('main');
let mainPadding = stickyHeight.toString() + 'px';

let logoText = document.getElementById('logoText');

window.onscroll = () => {
  let y = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
  if (y >= stickyPoint) {
    sticky.classList.add('header--sticky');
    main.style.paddingTop = mainPadding;
    logoText.style.display = "none";
  }
  else {
    sticky.classList.remove('header--sticky');
    main.style.paddingTop = 0;
    logoText.style.display = "block";
  }
};

})();
