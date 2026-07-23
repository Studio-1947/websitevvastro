/**
 * Client entry — mirrors the original js/main.js IIFE. Every module is
 * null-guarded, so it runs on any page and no-ops where its markup is absent
 * (identical to the source). Loaded once, globally, via BaseLayout.
 */
import { scrollReveal, countUps } from './reveal';
import { approachFill } from './animations';
import { accordion } from './faq';
import { approachStepper } from './stepper';
import { approachStrings } from './approachStrings';
import { cocreateCycle } from './cocreate';
import { commitmentCarousel } from './carousel';
import { mobileMenu } from './mobileMenu';
import { navDropdowns } from './nav';
import { personModal } from './personModal';
import { duplicateMarquees } from './marquee';
import { hydrateYear, darjeelingLive } from './darjeeling';
import { heroAurora } from './heroAurora';
import { contactModal } from './contactModal';
import { caseLightbox } from './lightbox';
import { contactForms } from './formSubmit';
import { initSmoothScroll } from './smoothScroll';

function init(): void {
  // Smooth scroll first so ScrollTrigger (in approachFill) syncs to Lenis.
  initSmoothScroll();

  // Same call order as the original init().
  scrollReveal();
  countUps();
  approachFill();
  accordion();
  approachStepper();
  approachStrings();
  cocreateCycle();
  commitmentCarousel();
  mobileMenu();
  navDropdowns();
  personModal();
  duplicateMarquees();
  hydrateYear();
  darjeelingLive();
  heroAurora();
  contactModal();
  caseLightbox();
  contactForms();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
