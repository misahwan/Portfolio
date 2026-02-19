(function(html) {

    'use strict';

   /* preloader
    * -------------------------------------------------- */
    const ssPreloader = function() {

        const siteBody = document.querySelector('body');
        const preloader = document.querySelector('#preloader');
        if (!preloader) return;

        html.classList.add('ss-preload');
        
        window.addEventListener('load', function() {
            html.classList.remove('ss-preload');
            html.classList.add('ss-loaded');
            
            preloader.addEventListener('transitionend', function afterTransition(e) {
                if (e.target.matches('#preloader'))  {
                    siteBody.classList.add('ss-show');
                    e.target.style.display = 'none';
                    preloader.removeEventListener(e.type, afterTransition);
                }
            });
        });

    }; 


   /* move header
    * -------------------------------------------------- */
    const ssMoveHeader = function () {

        // UPDATED: This now looks for ".main-header" (the name we made)
        const hdr = document.querySelector('.main-header'); 
        const hero = document.querySelector('#intro');
        let triggerHeight;

        if (!(hdr && hero)) return;

        setTimeout(function() {
            triggerHeight = hero.offsetHeight - 240;
        }, 120);

        window.addEventListener('scroll', function () {

            let loc = window.scrollY;

            if (loc > triggerHeight) {
                hdr.classList.add('sticky');
            } else {
                hdr.classList.remove('sticky');
            }

            if (loc > triggerHeight + 20) {
                hdr.classList.add('offset');
            } else {
                hdr.classList.remove('offset');
            }

            if (loc > triggerHeight + 150) {
                hdr.classList.add('scrolling');
            } else {
                hdr.classList.remove('scrolling');
            }

        });

    }; 


   /* mobile menu
    * ---------------------------------------------------- */ 
    const ssMobileMenu = function() {

        const toggleButton = document.querySelector('.header-menu-toggle');
        const mainNavWrap = document.querySelector('.header-nav');
        const siteBody = document.querySelector('body');

        if (!(toggleButton && mainNavWrap)) return;

        toggleButton.addEventListener('click', function(e) {
            e.preventDefault();
            toggleButton.classList.toggle('is-clicked');
            siteBody.classList.toggle('menu-is-open');
        });

        mainNavWrap.querySelectorAll('.header-nav a').forEach(function(link) {

            link.addEventListener("click", function(event) {

                // at 900px and below
                if (window.matchMedia('(max-width: 900px)').matches) {
                    toggleButton.classList.toggle('is-clicked');
                    siteBody.classList.toggle('menu-is-open');
                }
            });
        });

        window.addEventListener('resize', function() {

            // above 900px
            if (window.matchMedia('(min-width: 901px)').matches) {
                if (siteBody.classList.contains('menu-is-open')) siteBody.classList.remove('menu-is-open');
                if (toggleButton.classList.contains('is-clicked')) toggleButton.classList.remove('is-clicked');
            }
        });

    }; 

      
   /* highlight active menu link on pagescroll
    * ------------------------------------------------------ */
     const ssScrollSpy = function() {

        const sections = document.querySelectorAll('.target-section');
        if (!sections) return;

        // Add an event listener listening for scroll
        window.addEventListener('scroll', navHighlight);

        function navHighlight() {
        
            // Get current scroll position
            let scrollY = window.pageYOffset;
        
            // Loop through sections to get height(including padding and border), 
            // top and ID values for each
            sections.forEach(function(current) {
                const sectionHeight = current.offsetHeight;
                const sectionTop = current.offsetTop - 50;
                const sectionId = current.getAttribute('id');
            
                /* If our current scroll position enters the space where current section 
                * on screen is, add .current class to parent element(li) of the thecorresponding 
                * navigation link, else remove it. To know which link is active, we use 
                * sectionId variable we are getting while looping through sections as 
                * an selector
                */
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    document.querySelector('.header-nav a[href*=' + sectionId + ']').parentNode.classList.add('current');
                } else {
                    document.querySelector('.header-nav a[href*=' + sectionId + ']').parentNode.classList.remove('current');
                }
            });
        }

    }; 


   /* tabs (Required for Projects Section)
    * ---------------------------------------------------- */ 
    const sstabs = function(nextTab = false) {

        const tabList = document.querySelector('.tab-nav__list');
        const tabPanels = document.querySelectorAll('.tab-content__item');
        const tabItems = document.querySelectorAll('.tab-nav__list li');
        const tabLinks = [];

        if (!(tabList && tabPanels)) return;

        const tabClickEvent = function(tabLink, tabLinks, tabPanels, linkIndex, e) {
    
            // Reset all the tablinks
            tabLinks.forEach(function(link) {
                link.setAttribute('tabindex', '-1');
                link.setAttribute('aria-selected', 'false');
                link.parentNode.removeAttribute('data-tab-active');
                link.removeAttribute('data-tab-active');
            });
    
            // set the active link attributes
            tabLink.setAttribute('tabindex', '0');
            tabLink.setAttribute('aria-selected', 'true');
            tabLink.parentNode.setAttribute('data-tab-active', '');
            tabLink.setAttribute('data-tab-active', '');
    
            // Change tab panel visibility
            tabPanels.forEach(function(panel, index) {
                if (index != linkIndex) {
                    panel.setAttribute('aria-hidden', 'true');
                    panel.removeAttribute('data-tab-active');
                } else {
                    panel.setAttribute('aria-hidden', 'false');
                    panel.setAttribute('data-tab-active', '');
                }
            });

            window.dispatchEvent(new Event("resize"));

        };
    
        const keyboardEvent = function(tabLink, tabLinks, tabPanels, tabItems, index, e) {

            let keyCode = e.keyCode;
            let currentTab = tabLinks[index];
            let previousTab = tabLinks[index - 1];
            let nextTab = tabLinks[index + 1];
            let firstTab = tabLinks[0];
            let lastTab = tabLinks[tabLinks.length - 1];
    
            // ArrowRight and ArrowLeft are the values when event.key is supported
            switch (keyCode) {
                case 'ArrowLeft':
                case 37:
                    e.preventDefault();
    
                    if (!previousTab) {
                        lastTab.focus();
                    } else {
                        previousTab.focus();
                    }
                    break;
    
                case 'ArrowRight':
                case 39:
                    e.preventDefault();
    
                    if (!nextTab) {
                        firstTab.focus();
                    } else {
                        nextTab.focus();
                    }
                    break;
            }
    
        };

        // Add accessibility roles and labels
        tabList.setAttribute('role','tablist');
        tabItems.forEach(function(item, index) {
    
            let link = item.querySelector('a');
    
            // collect tab links
            tabLinks.push(link);
            item.setAttribute('role', 'presentation');
    
            if (index == 0) {
                item.setAttribute('data-tab-active', '');
            }
    
        });
    
        // Set up tab links
        tabLinks.forEach(function(link, i) {
            let anchor = link.getAttribute('href').split('#')[1];
            let attributes = {
                'id': 'tab-link-' + i,
                'role': 'tab',
                'tabIndex': '-1',
                'aria-selected': 'false',
                'aria-controls': anchor
            };
    
            // if it's the first element update the attributes
            if (i == 0) {
                attributes['aria-selected'] = 'true';
                attributes.tabIndex = '0';
                link.setAttribute('data-tab-active', '');
            };
    
            // Add the various accessibility roles and labels to the links
            for (var key in attributes) {
                link.setAttribute(key, attributes[key]);
            }
                  
            // Click Event Listener
            link.addEventListener('click', function(e) {
                e.preventDefault();
            });
          
            // Click Event Listener
            link.addEventListener('focus', function(e) {
                tabClickEvent(this, tabLinks, tabPanels, i, e);
            });
    
            // Keyboard event listener
            link.addEventListener('keydown', function(e) {
                keyboardEvent(link, tabLinks, tabPanels, tabItems, i, e);
            });
        });
    
        // Set up tab panels
        tabPanels.forEach(function(panel, i) {
    
            let attributes = {
                'role': 'tabpanel',
                'aria-hidden': 'true',
                'aria-labelledby': 'tab-link-' + i
            };
          
            if (nextTab) {
                let nextTabLink = document.createElement('a');
                let nextTabLinkIndex = (i < tabPanels.length - 1) ? i + 1 : 0;

                 // set up next tab link
                nextTabLink.setAttribute('href', '#tab-link-' + nextTabLinkIndex);
                nextTabLink.textContent = 'Next Tab';
                panel.appendChild(nextTabLink);
            }
                
            if (i == 0) {
                attributes['aria-hidden'] = 'false';
                panel.setAttribute('data-tab-active', '');
            }
    
            for (let key in attributes) {
                panel.setAttribute(key, attributes[key]);
            }
        });
    };


   /* smoothscroll
    * ---------------------------------------------------- */ 
    const ssSmoothScroll = function() {
        
        // Easing functions for smooth scroll animation
        const easeFunctions = {
            easeInQuad: function(t, b, c, d) {
                t /= d;
                return c * t * t + b;
            },
            easeOutQuad: function(t, b, c, d) {
                t /= d;
                return -c * t * (t - 2) + b;
            },
            easeInOutQuad: function(t, b, c, d) {
                t /= d/2;
                if (t < 1) return c/2*t*t + b;
                t--;
                return -c/2 * (t*(t-2) - 1) + b;
            },
            easeInOutCubic: function(t, b, c, d) {
                t /= d/2;
                if (t < 1) return c/2*t*t*t + b;
                t -= 2;
                return c/2*(t*t*t + 2) + b;
            },
            easeSmoothInOut: function(t, b, c, d) {
                t /= d/2;
                if (t < 1) return c/2*t*t*t*t*t + b;
                t -= 2;
                return c/2*(t*t*t*t*t + 2) + b;
            }
        };

        // Scroll configuration options
        const config = {            
            // onStart: function() { console.log('Scroll started'); },
            // onComplete: function() { console.log('Scroll completed'); },
            tolerance: 0,
            duration: 1800,
            easing: 'easeSmoothInOut',
            container: window
        };

        // Track animation state
        let animationFrameId = null;
        let isScrolling = false;

        // Smooth scroll to target element
        function smoothScrollTo(target, options) {

            // Cancel ongoing animation if active
            if (isScrolling && animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
            isScrolling = true;

            // Destructure options and set initial values
            const { duration, easing, tolerance, container, onStart, onComplete } = options;
            const startY = container === window ? window.pageYOffset : container.scrollTop;
            const startTime = performance.now();

            // Trigger start callback
            if (typeof onStart === 'function') onStart();

            // Animation loop
            function animateScroll(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);

                // Calculate target position
                const targetRect = target.getBoundingClientRect();
                const targetY = (container === window ? targetRect.top + window.pageYOffset : targetRect.top) - tolerance;
                const change = targetY - startY;

                // Apply easing to scroll position
                const easedProgress = easeFunctions[easing](progress, startY, change, 1);

                // Update scroll position
                if (container === window) {
                    window.scrollTo(0, easedProgress);
                } else {
                    container.scrollTop = easedProgress;
                }

                // Continue or complete animation
                if (progress < 1) {
                    animationFrameId = requestAnimationFrame(animateScroll);
                } else {
                    isScrolling = false;
                    animationFrameId = null;

                    // Ensure target is focusable
                    if (target && target.focus && !target.hasAttribute('tabindex')) {
                        target.setAttribute('tabindex', '-1');
                    }
                    if (target && target.focus) {
                        target.focus({ preventScroll: true });
                    }

                    // Trigger complete callback
                    if (typeof onComplete === 'function') onComplete();
                }
            }

            // Start animation
            animationFrameId = requestAnimationFrame(animateScroll);
        }
        
        // Find smooth scroll triggers
        const triggers = document.querySelectorAll('.smoothscroll');        

        // Add click event listeners to triggers
        triggers.forEach(function(trigger) {

            trigger.addEventListener('click', function(e) {
                e.preventDefault();
                const href = trigger.getAttribute('href');
                const target = href === '#' ? { getBoundingClientRect: function() { return { top: 0 }; } } : document.querySelector(href);

                // Scroll to target or warn if not found
                if (target) {
                    smoothScrollTo(target, config);
                } else {
                    console.warn(`Target "${href}" not found`);
                }
            });

        });

    }; 


   /* Initialize
    * ------------------------------------------------------ */
    (function ssInit() {

        ssPreloader();
        ssMoveHeader();
        ssMobileMenu();
        ssScrollSpy();
        sstabs();
        ssSmoothScroll();

    })();

})(document.documentElement);