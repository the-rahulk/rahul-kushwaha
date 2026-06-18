// Conversational Portfolio Animation Engine

let pendingUnlockSection = null;
let chatObserver = null;

function handleScrollUnlock() {
  if (!pendingUnlockSection) return;

  const scrollPos = window.scrollY + window.innerHeight;
  // Threshold: 100px from the bottom of the current document
  const bottomThreshold = document.documentElement.scrollHeight - 100;

  if (scrollPos >= bottomThreshold) {
    const nextSec = pendingUnlockSection;
    pendingUnlockSection = null; // Clear to prevent dual triggers
    
    // Unlock next section in the document flow
    nextSec.classList.remove('locked');
    
    // Start observing it to trigger typewriter
    if (chatObserver) {
      chatObserver.observe(nextSec);
    }
  }
}

export function initChatEngine() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Track state of each section to prevent re-animation
  const sectionStates = new Map();

  const sections = document.querySelectorAll('.chat-section');
  
  if (prefersReducedMotion) {
    // If user prefers reduced motion, bypass all animations and display everything immediately
    sections.forEach(section => {
      section.classList.remove('locked');
      revealSectionInstantly(section);
    });
    // Also trigger the strikethrough instantly
    const strike = document.getElementById('not-looking-for-strike');
    if (strike) strike.classList.add('struck');
    return;
  }

  // Lock all sections except the first one initially for first-time sequential reveal
  sections.forEach((section, idx) => {
    if (idx > 0) {
      section.classList.add('locked');
    }
  });

  // Setup IntersectionObserver for scroll triggers
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -15% 0px', // Trigger when section is 85% into the viewport
    threshold: 0.05
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const section = entry.target;
        const sectionId = section.getAttribute('data-section');
        
        if (!sectionStates.has(sectionId)) {
          sectionStates.set(sectionId, 'QUESTION_TYPING');
          startSectionSequence(section, sectionId, sections, observer);
          observer.unobserve(section); // Only animate once
        }
      }
    });
  }, observerOptions);

  chatObserver = observer;

  // Initially, only observe the first section (the others are locked/hidden)
  if (sections[0]) {
    observer.observe(sections[0]);
  }

  // Setup scroll event listener to unlock next sections as the user scrolls to the bottom
  window.removeEventListener('scroll', handleScrollUnlock);
  window.addEventListener('scroll', handleScrollUnlock, { passive: true });
}

// Immediately show everything for reduced motion
function revealSectionInstantly(section) {
  // 1. Show question instantly
  const questionText = section.querySelector('.typing-text');
  if (questionText) {
    questionText.textContent = questionText.getAttribute('data-text');
  }

  // 2. Show answer instantly
  const answerBubble = section.querySelector('.flex.invisible');
  if (answerBubble) {
    answerBubble.classList.remove('invisible');
  }

  // 3. Show all staggered lines
  const lines = section.querySelectorAll('.line-reveal');
  lines.forEach(line => line.classList.add('revealed'));

  // 4. Trigger section-specific components instantly
  const sectionId = section.getAttribute('data-section');
  triggerInstantWidgets(section, sectionId);
}

// Start typing the question, then reveal answer
function startSectionSequence(section, sectionId, sections, observer) {
  // Reveal the section container first
  section.classList.remove('opacity-0');
  section.classList.add('opacity-100');

  const questionText = section.querySelector('.typing-text');
  if (!questionText) return;

  const fullText = questionText.getAttribute('data-text');
  let index = 0;
  
  // Add terminal cursor style while typing
  questionText.classList.add('border-r-2', 'border-pale-wire', 'pr-0.5', 'cursor-blink');

  const typingSpeed = 40; // ms per char

  const typingInterval = setInterval(() => {
    questionText.textContent += fullText.charAt(index);
    index++;
    
    if (index >= fullText.length) {
      clearInterval(typingInterval);
      // Remove cursor blink from question
      questionText.classList.remove('border-r-2', 'border-pale-wire', 'pr-0.5', 'cursor-blink');
      
      // Move to NEXT state: pause, then answer
      setTimeout(() => {
        revealAnswer(section, sectionId, sections, observer);
      }, 600);
    }
  }, typingSpeed);
}

// Fade/slide in answer bubble and stagger paragraphs
function revealAnswer(section, sectionId, sections, observer) {
  const answerBubble = section.querySelector('.invisible');
  if (!answerBubble) return;

  answerBubble.classList.remove('invisible');
  answerBubble.classList.add('animate-fade-in'); // Smooth CSS fade for the bubble wrap

  const lines = section.querySelectorAll('.line-reveal');
  let staggerDelay = 0;

  lines.forEach((line, idx) => {
    setTimeout(() => {
      line.classList.add('revealed');
      
      // If it's the last line, trigger widgets and register pending section unlock
      if (idx === lines.length - 1) {
        setTimeout(() => {
          triggerWidgets(section, sectionId);
          unlockNextSection(section, sections, observer);
        }, 300);
      }
    }, staggerDelay);
    staggerDelay += 200; // 200ms stagger between paragraph lines
  });

  // If there are no .line-reveal text tags, trigger widgets immediately
  if (lines.length === 0) {
    triggerWidgets(section, sectionId);
    unlockNextSection(section, sections, observer);
  }
}

// Set up next section unlock trigger on scroll
function unlockNextSection(currentSection, sections, observer) {
  const index = Array.from(sections).indexOf(currentSection);
  if (index !== -1 && index < sections.length - 1) {
    const nextSection = sections[index + 1];
    
    // Stage it for unlock upon scroll
    pendingUnlockSection = nextSection;
    
    // Check if user is already at the bottom or very close to it
    const scrollPos = window.scrollY + window.innerHeight;
    const bottomThreshold = document.documentElement.scrollHeight - 100;
    
    if (scrollPos >= bottomThreshold) {
      setTimeout(() => {
        if (pendingUnlockSection === nextSection) {
          pendingUnlockSection = null;
          nextSection.classList.remove('locked');
          if (observer) {
            observer.observe(nextSection);
          }
        }
      }, 500);
    }
  }
}

// Trigger animations for custom widgets depending on the active frame
function triggerWidgets(section, sectionId) {
  switch (sectionId) {
    case 'what-do-you-do':
      // Card grid handles hover via CSS, but we can stagger their initial display slightly
      const cards = section.querySelectorAll('.grid > div');
      cards.forEach((card, idx) => {
        setTimeout(() => {
          card.classList.add('animate-fade-in');
        }, idx * 100);
      });
      break;

    case 'whats-your-stack':
      // Staggered cascade of pill tags
      const tagGroups = ['stack-group-1', 'stack-group-2', 'stack-group-3', 'stack-group-4', 'stack-group-5', 'stack-group-6', 'stack-group-7', 'stack-group-8', 'stack-group-9'];
      let tagDelay = 0;
      
      tagGroups.forEach(groupId => {
        const groupEl = document.getElementById(groupId);
        if (groupEl) {
          const tags = groupEl.querySelectorAll('span');
          tags.forEach(tag => {
            setTimeout(() => {
              tag.style.opacity = '1';
              tag.style.transform = 'translateY(0)';
            }, tagDelay);
            tagDelay += 35; // Stagger each tag in sequence
          });
        }
      });
      break;

    case 'deloitte-work':
      // Stagger reveal of git commit cards
      const commitCards = section.querySelectorAll('.commit-card');
      commitCards.forEach((card, idx) => {
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
          
          // Trigger progress bar inside this card
          const progressBar = card.querySelector('.progress-bar');
          if (progressBar) {
            setTimeout(() => {
              const targetWidth = progressBar.getAttribute('data-width');
              progressBar.style.transition = 'width 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
              progressBar.style.width = targetWidth;
            }, 150);
          }
        }, idx * 120);
      });
      break;

    case 'side-projects':
      // 3D Flip up of project cards
      const projects = section.querySelectorAll('.project-card');
      projects.forEach((proj, idx) => {
        setTimeout(() => {
          proj.classList.add('revealed');
          // Setup desktop 3D hover tilt
          if (window.innerWidth >= 1024) {
            enable3DTilt(proj);
          }
        }, idx * 200);
      });
      break;

    case 'certifications':
      // Spring scale-in staggered badges
      const badges = ['badge-1', 'badge-2', 'badge-3', 'badge-4'];
      badges.forEach((badgeId, idx) => {
        const badge = document.getElementById(badgeId);
        if (badge) {
          setTimeout(() => {
            badge.style.transition = 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.5s ease-out';
            badge.style.opacity = '1';
            badge.style.transform = 'scale(1)';
          }, idx * 150);
        }
      });
      break;

    case 'real-numbers':
      // Count-up stats dashboard numbers
      const counters = section.querySelectorAll('.count-number');
      counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'), 10);
        countUp(counter, target);
      });
      break;

    case 'what-are-you-looking-for':
      // Strikethrough effect on "not looking for" line
      const strikeEl = document.getElementById('not-looking-for-strike');
      if (strikeEl) {
        setTimeout(() => {
          strikeEl.classList.add('struck');
        }, 400);
      }
      break;
      
    case 'how-do-i-reach-you':
      // Highlight contact buttons subtly
      const contactButtons = section.querySelectorAll('a');
      contactButtons.forEach((btn, idx) => {
        btn.style.opacity = '0';
        btn.style.transform = 'scale(0.95)';
        btn.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.2), opacity 0.4s ease-out';
        setTimeout(() => {
          btn.style.opacity = '1';
          btn.style.transform = 'scale(1)';
        }, idx * 80 + 100);
      });
      break;
  }
}

// Setup instant widgets display for reduced motion
function triggerInstantWidgets(section, sectionId) {
  switch (sectionId) {
    case 'whats-your-stack':
      const tagGroups = ['stack-group-1', 'stack-group-2', 'stack-group-3', 'stack-group-4', 'stack-group-5', 'stack-group-6', 'stack-group-7', 'stack-group-8', 'stack-group-9'];
      tagGroups.forEach(groupId => {
        const groupEl = document.getElementById(groupId);
        if (groupEl) {
          const tags = groupEl.querySelectorAll('span');
          tags.forEach(tag => {
            tag.style.opacity = '1';
            tag.style.transform = 'none';
          });
        }
      });
      break;

    case 'deloitte-work':
      const commitCards = section.querySelectorAll('.commit-card');
      commitCards.forEach(card => {
        card.style.opacity = '1';
        card.style.transform = 'none';
        const progressBar = card.querySelector('.progress-bar');
        if (progressBar) {
          progressBar.style.width = progressBar.getAttribute('data-width');
        }
      });
      break;

    case 'side-projects':
      const projects = section.querySelectorAll('.project-card');
      projects.forEach(proj => {
        proj.classList.add('revealed');
      });
      break;

    case 'certifications':
      const badges = ['badge-1', 'badge-2', 'badge-3', 'badge-4'];
      badges.forEach(badgeId => {
        const badge = document.getElementById(badgeId);
        if (badge) {
          badge.style.opacity = '1';
          badge.style.transform = 'none';
        }
      });
      break;

    case 'real-numbers':
      const counters = section.querySelectorAll('.count-number');
      counters.forEach(counter => {
        counter.textContent = counter.getAttribute('data-target');
      });
      break;
  }
}

// Math helpers for count-up metrics
function countUp(element, target) {
  let start = 0;
  const duration = 1200; // 1.2 seconds duration
  const startTime = performance.now();

  function updateCount(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Ease-out quad formula
    const easeProgress = progress * (2 - progress);
    
    const currentValue = Math.floor(easeProgress * target);
    element.textContent = currentValue;

    if (progress < 1) {
      requestAnimationFrame(updateCount);
    } else {
      element.textContent = target; // Ensure exact final value is reached
    }
  }

  requestAnimationFrame(updateCount);
}

// JS 3D Card Hover Tilt logic (Desktop only)
function enable3DTilt(card) {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left; // x position inside element
    const y = e.clientY - rect.top;  // y position inside element
    
    // Calculate tilt coefficients (-5 to 5 degrees)
    const tiltX = -((rect.height / 2 - y) / (rect.height / 2)) * 6;
    const tiltY = ((rect.width / 2 - x) / (rect.width / 2)) * 6;
    
    card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.01, 1.01, 1.01)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  });
}
