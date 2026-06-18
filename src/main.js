// Entrypoint for Rahul's Conversational Portfolio
import { initChatEngine } from './chatEngine.js';
import { initParticles } from './particles.js';

document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    // If reduced motion, show hero instantly and run chat engine immediately
    const commandText = document.querySelector('#hero-command .typing-cursor');
    if (commandText) {
      commandText.textContent = './introduce_yourself';
      commandText.classList.remove('border-r-2');
    }
    const heroOutput = document.getElementById('hero-output');
    if (heroOutput) {
      heroOutput.classList.remove('hidden', 'opacity-0');
      heroOutput.classList.add('opacity-100');
    }
    initChatEngine();
    initScrollUIHandlers();
    return;
  }

  // Otherwise, run the detailed typing intro sequence
  runHeroSequence();
});

function runHeroSequence() {
  const commandSpan = document.querySelector('#hero-command .typing-cursor');
  if (!commandSpan) return;

  const commandStr = './introduce_yourself';
  commandSpan.textContent = ''; // Clear initial content to type it
  let index = 0;

  // Type command out in ~1.5s
  const charInterval = 1500 / commandStr.length;
  
  const typingTimer = setInterval(() => {
    commandSpan.textContent += commandStr.charAt(index);
    index++;

    if (index >= commandStr.length) {
      clearInterval(typingTimer);
      
      // Stop blinking cursor on command line after 300ms
      setTimeout(() => {
        commandSpan.classList.remove('border-r-2', 'border-electric-indigo');
      }, 300);

      // 600ms pause, then show output initialising line
      setTimeout(() => {
        showHeroOutput();
      }, 600);
    }
  }, charInterval);
}

function showHeroOutput() {
  const heroOutput = document.getElementById('hero-output');
  if (!heroOutput) return;

  // Reveal output container
  heroOutput.classList.remove('hidden');
  
  // Custom transition: Wait 400ms after showing initialization, then fade-in full credentials
  setTimeout(() => {
    heroOutput.classList.remove('opacity-0');
    heroOutput.classList.add('opacity-100');

    // Initialize background particles and scroll engine after hero completes reveal
    setTimeout(() => {
      initParticles();
      initChatEngine();
      initScrollUIHandlers();
    }, 500);

  }, 400);
}

function initScrollUIHandlers() {
  const scrollCue = document.getElementById('scroll-cue');
  const chatHeader = document.getElementById('chat-header');
  const chatInputBar = document.getElementById('chat-input-bar');
  const scrollToTopBtn = document.getElementById('scroll-to-top-btn');

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = window.innerHeight;
    
    // Check if user is scrolled to the absolute bottom (contact section)
    const isAtBottom = (scrollPos + clientHeight) >= (scrollHeight - 100);

    // Fade out scroll cue once user starts scrolling
    if (scrollCue) {
      if (scrollPos > 50) {
        scrollCue.classList.add('opacity-0', 'pointer-events-none');
      } else {
        scrollCue.classList.remove('opacity-0', 'pointer-events-none');
      }
    }

    // Toggle chat top header and bottom input bar
    if (chatHeader && chatInputBar) {
      if (scrollPos > 300) {
        chatHeader.classList.remove('opacity-0', 'pointer-events-none', '-translate-y-2');
        chatHeader.classList.add('opacity-100', 'translate-y-0');
        
        // Hide input bar if at the very bottom of the page
        if (isAtBottom) {
          chatInputBar.classList.add('opacity-0', 'pointer-events-none', 'translate-y-2');
          chatInputBar.classList.remove('opacity-100', 'translate-y-0');
        } else {
          chatInputBar.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-2');
          chatInputBar.classList.add('opacity-100', 'translate-y-0');
        }
      } else {
        chatHeader.classList.add('opacity-0', 'pointer-events-none', '-translate-y-2');
        chatHeader.classList.remove('opacity-100', 'translate-y-0');
        
        chatInputBar.classList.add('opacity-0', 'pointer-events-none', 'translate-y-2');
        chatInputBar.classList.remove('opacity-100', 'translate-y-0');
      }
    }
  }, { passive: true });

  if (scrollToTopBtn) {
    scrollToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}
