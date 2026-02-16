// Speed Reader Web App

(function() {
  'use strict';

  // State
  let words = [];
  let currentWordIndex = 0;
  let isPlaying = false;
  let wpm = 300;
  let interval = null;
  let wordElements = [];

  // DOM Elements
  const inputSection = document.getElementById('inputSection');
  const readerSection = document.getElementById('readerSection');
  const textInput = document.getElementById('textInput');
  const urlInput = document.getElementById('urlInput');
  const startBtn = document.getElementById('startBtn');
  const closeReaderBtn = document.getElementById('closeReaderBtn');
  const currentWordEl = document.getElementById('currentWord');
  const playPauseBtn = document.getElementById('playPauseBtn');
  const playIcon = document.getElementById('playIcon');
  const pauseIcon = document.getElementById('pauseIcon');
  const restartBtn = document.getElementById('restartBtn');
  const rewindBtn = document.getElementById('rewindBtn');
  const forwardBtn = document.getElementById('forwardBtn');
  const speedSlider = document.getElementById('speedSlider');
  const wpmValue = document.getElementById('wpmValue');
  const readingTime = document.getElementById('readingTime');
  const progressFill = document.getElementById('progressFill');
  const finishOverlay = document.getElementById('finishOverlay');
  const readAgainBtn = document.getElementById('readAgainBtn');
  const loadingOverlay = document.getElementById('loadingOverlay');
  const errorToast = document.getElementById('errorToast');
  const tabs = document.querySelectorAll('.tab');
  const tabContents = document.querySelectorAll('.tab-content');
  const themeToggle = document.getElementById('themeToggle');
  const textContent = document.getElementById('textContent');
  const textView = document.getElementById('textView');

  // CORS Proxies for fetching external URLs (with fallback)
  // All proxies must accept URL-encoded target URL
  const CORS_PROXIES = [
    'https://api.allorigins.win/raw?url=',
    'https://corsproxy.io/?'
  ];

  // Theme functions
  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);

    const sunIcons = document.querySelectorAll('#sunIcon, .sun-icon');
    const moonIcons = document.querySelectorAll('#moonIcon, .moon-icon');

    sunIcons.forEach(icon => icon.style.display = theme === 'dark' ? 'block' : 'none');
    moonIcons.forEach(icon => icon.style.display = theme === 'dark' ? 'none' : 'block');
  }

  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('speedReaderTheme', newTheme);
  }

  // Handle URL parameters for extension integration
  function handleUrlParams() {
    const params = new URLSearchParams(window.location.search);

    // Switch tab if specified
    const tab = params.get('tab');
    if (tab === 'url' || tab === 'text') {
      tabs.forEach(t => t.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      const targetTab = document.querySelector(`.tab[data-tab="${tab}"]`);
      const targetContent = document.getElementById(tab + 'Tab');

      if (targetTab) targetTab.classList.add('active');
      if (targetContent) targetContent.classList.add('active');
    }

    // Auto-fill URL and optionally start loading
    const url = params.get('url');
    if (url) {
      // Switch to URL tab
      tabs.forEach(t => t.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));
      document.querySelector('.tab[data-tab="url"]').classList.add('active');
      document.getElementById('urlTab').classList.add('active');

      urlInput.value = decodeURIComponent(url);

      // Auto-start if specified
      if (params.get('auto') === '1') {
        setTimeout(() => handleStart(), 100);
      }
    }

    // Auto-fill text
    const text = params.get('text');
    if (text) {
      // Switch to text tab
      tabs.forEach(t => t.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));
      document.querySelector('.tab[data-tab="text"]').classList.add('active');
      document.getElementById('textTab').classList.add('active');

      textInput.value = decodeURIComponent(text);

      // Auto-start if specified
      if (params.get('auto') === '1') {
        setTimeout(() => handleStart(), 100);
      }
    }
  }

  // Initialize
  function init() {
    // Load saved theme
    const savedTheme = localStorage.getItem('speedReaderTheme') || 'light';
    setTheme(savedTheme);

    // Load saved WPM
    const savedWpm = localStorage.getItem('speedReaderWpm');
    if (savedWpm) {
      wpm = parseInt(savedWpm);
      speedSlider.value = wpm;
      wpmValue.textContent = wpm + ' wpm';
    }

    // Handle URL parameters (for extension integration)
    handleUrlParams();

    // Theme toggle
    themeToggle.addEventListener('click', toggleTheme);

    // Tab switching
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById(tab.dataset.tab + 'Tab').classList.add('active');
      });
    });

    // Start button
    startBtn.addEventListener('click', handleStart);

    // Close reader
    closeReaderBtn.addEventListener('click', closeReader);

    // Playback controls
    playPauseBtn.addEventListener('click', togglePlayPause);
    restartBtn.addEventListener('click', restart);
    rewindBtn.addEventListener('click', () => skipWord(-1));
    forwardBtn.addEventListener('click', () => skipWord(1));

    // Speed slider
    speedSlider.addEventListener('input', (e) => {
      wpm = parseInt(e.target.value);
      wpmValue.textContent = wpm + ' wpm';
      localStorage.setItem('speedReaderWpm', wpm);
      updateReadingTime();
    });

    // Read again
    readAgainBtn.addEventListener('click', () => {
      finishOverlay.classList.add('hidden');
      restart();
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboard);
  }

  // Handle start button
  async function handleStart() {
    const activeTab = document.querySelector('.tab.active').dataset.tab;

    if (activeTab === 'text') {
      const text = textInput.value.trim();
      if (!text) {
        showError('Please enter some text');
        return;
      }
      loadText(text);
      showReader();
    } else {
      const url = urlInput.value.trim();
      if (!url) {
        showError('Please enter a URL');
        return;
      }
      if (!isValidUrl(url)) {
        showError('Please enter a valid URL');
        return;
      }
      await loadFromUrl(url);
    }
  }

  // Load text into reader
  function loadText(text) {
    const allTokens = splitText(text);
    words = [];
    currentWordIndex = 0;
    wordElements = [];

    // Build text view with clickable words
    textContent.innerHTML = '';
    let wordIndex = 0;

    allTokens.forEach((token) => {
      if (token === '\n\n') {
        // Paragraph break - add visual break but don't count as word
        const br = document.createElement('div');
        br.className = 'paragraph-break';
        textContent.appendChild(br);
      } else {
        // Regular word
        words.push(token);
        const span = document.createElement('span');
        span.className = 'word';
        span.textContent = token;
        span.dataset.index = wordIndex;
        span.addEventListener('click', () => jumpToWord(parseInt(span.dataset.index)));
        textContent.appendChild(span);
        textContent.appendChild(document.createTextNode(' '));
        wordElements.push(span);
        wordIndex++;
      }
    });

    displayWord(words[0]);
    highlightWordInText(0);
    updateProgress();
    updateReadingTime();
  }

  // Load article from URL with fallback proxies
  async function loadFromUrl(url) {
    showLoading(true);
    const cleanedUrl = cleanUrl(url);

    let lastError = null;
    const errors = [];

    // First try direct fetch (some sites allow CORS)
    try {
      console.log('Trying direct fetch...');
      const response = await fetch(cleanedUrl, {
        signal: AbortSignal.timeout(8000)
      });

      if (response.ok) {
        const html = await response.text();
        const result = parseArticle(html);
        if (result) {
          loadText(result);
          showReader();
          showLoading(false);
          return;
        }
      }
    } catch (error) {
      console.log('Direct fetch failed (expected for most sites):', error.message);
    }

    // Try each proxy in sequence
    for (let i = 0; i < CORS_PROXIES.length; i++) {
      const proxy = CORS_PROXIES[i];

      try {
        console.log(`Trying proxy ${i + 1}/${CORS_PROXIES.length}: ${proxy}`);

        const response = await fetch(proxy + encodeURIComponent(cleanedUrl), {
          signal: AbortSignal.timeout(15000) // 15 second timeout
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const html = await response.text();

        if (!html || html.length < 100) {
          throw new Error('Empty or invalid response');
        }

        const result = parseArticle(html);
        if (!result) {
          throw new Error('Could not extract article content');
        }

        loadText(result);
        showReader();
        showLoading(false);
        return; // Success!

      } catch (error) {
        console.error(`Proxy ${i + 1} failed:`, error);
        errors.push(`${proxy.split('/')[2]}: ${error.message}`);
        lastError = error;
        // Continue to next proxy
      }
    }

    // All proxies failed
    showLoading(false);
    console.error('All proxies failed:', errors);
    showError('Could not load article. The site may be blocking requests. Try copying the text directly.');
  }

  // Parse article content from HTML
  function parseArticle(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const reader = new Readability(doc);
    const article = reader.parse();

    if (article && article.textContent && article.textContent.trim().length >= 100) {
      return article.textContent;
    }
    return null;
  }

  // Show/hide reader
  function showReader() {
    readerSection.classList.remove('hidden');
  }

  function closeReader() {
    stopReading();
    readerSection.classList.add('hidden');
    finishOverlay.classList.add('hidden');
  }

  // Split text into words, preserving paragraph breaks
  function splitText(text) {
    const result = [];
    // Split by paragraph breaks (2+ newlines)
    const paragraphs = text.split(/\n\s*\n/);

    paragraphs.forEach((para, paraIndex) => {
      const words = para.split(/\s+/).filter(w => w.length > 0);
      words.forEach(word => result.push(word));
      // Add paragraph marker (except after last paragraph)
      if (words.length > 0 && paraIndex < paragraphs.length - 1) {
        result.push('\n\n');
      }
    });

    return result;
  }

  // Display word with ORP highlighting
  function displayWord(word) {
    if (!word) return;

    // Calculate pivot position (ORP)
    let pivot;
    if (word.length === 1) {
      pivot = 0;
    } else if (word.length < 6) {
      pivot = 1;
    } else if (word.length < 9) {
      pivot = 2;
    } else if (word.length < 13) {
      pivot = 3;
    } else if (word.length < 18) {
      pivot = 4;
    } else if (word.length <= 25) {
      pivot = Math.floor(word.length * 0.5);
    } else {
      pivot = Math.floor(word.length * 0.6);
    }

    const before = word.slice(0, pivot);
    const pivotChar = word[pivot] || '';
    const after = word.slice(pivot + 1);

    // Build HTML
    currentWordEl.innerHTML = '';

    const beforeSpan = document.createElement('span');
    beforeSpan.className = 'word-before';
    beforeSpan.textContent = before;

    const pivotSpan = document.createElement('span');
    pivotSpan.className = 'word-pivot';
    pivotSpan.textContent = pivotChar;

    const afterSpan = document.createElement('span');
    afterSpan.className = 'word-after';
    afterSpan.textContent = after;

    currentWordEl.appendChild(beforeSpan);
    currentWordEl.appendChild(pivotSpan);
    currentWordEl.appendChild(afterSpan);

    // Adjust font size for long words
    let fontSize = 42;
    if (word.length > 12) fontSize = 36;
    if (word.length > 18) fontSize = 32;
    if (word.length > 25) fontSize = 28;
    if (word.length > 30) fontSize = 24;
    currentWordEl.style.fontSize = fontSize + 'px';

    // Center based on pivot
    requestAnimationFrame(() => {
      const beforeWidth = beforeSpan.offsetWidth;
      const pivotWidth = pivotSpan.offsetWidth;
      const offset = -(beforeWidth + pivotWidth / 2);
      currentWordEl.style.transform = `translateX(${offset}px)`;
    });
  }

  // Highlight word in text view
  function highlightWordInText(index) {
    wordElements.forEach((el, i) => {
      el.classList.remove('active');
      if (i < index) {
        el.classList.add('read');
      } else {
        el.classList.remove('read');
      }
    });

    if (wordElements[index]) {
      wordElements[index].classList.add('active');
      scrollToWord(index);
    }
  }

  // Scroll to word in text view
  function scrollToWord(index) {
    const wordEl = wordElements[index];
    if (!wordEl) return;

    const container = textView;
    const wordRect = wordEl.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    // Check if word is outside visible area
    if (wordRect.top < containerRect.top || wordRect.bottom > containerRect.bottom) {
      const scrollTop = wordEl.offsetTop - container.offsetTop - container.clientHeight / 3;
      container.scrollTop = scrollTop;
    }
  }

  // Jump to specific word
  function jumpToWord(index) {
    const wasPlaying = isPlaying;
    stopReading();

    currentWordIndex = index;
    displayWord(words[currentWordIndex]);
    highlightWordInText(currentWordIndex);
    updateProgress();
    updateReadingTime();

    if (wasPlaying) {
      startReading();
    }
  }

  // Get delay for word (punctuation-aware)
  function getWordDelay(word) {
    const baseDelay = 60000 / wpm;
    let multiplier = 1.0;

    if (word.length > 8) {
      multiplier += (word.length - 8) * 0.04;
    }

    const lastChar = word[word.length - 1];
    if (lastChar === '.' || lastChar === '!' || lastChar === '?') {
      multiplier += 1.0;
    } else if (lastChar === ',' || lastChar === ';' || lastChar === ':') {
      multiplier += 0.4;
    } else if (lastChar === '—' || lastChar === '–') {
      multiplier += 0.4;
    }

    if (word.endsWith('...') || word.endsWith('…')) {
      multiplier += 0.5;
    }

    return baseDelay * multiplier;
  }

  // Start reading
  function startReading() {
    if (!words.length) return;

    isPlaying = true;
    updatePlayButton();

    function showNext() {
      if (!isPlaying) return;

      if (currentWordIndex < words.length) {
        const word = words[currentWordIndex];
        displayWord(word);
        highlightWordInText(currentWordIndex);
        updateProgress();
        updateReadingTime();

        interval = setTimeout(() => {
          currentWordIndex++;
          showNext();
        }, getWordDelay(word));
      } else {
        stopReading();
        showFinish();
      }
    }

    showNext();
  }

  // Stop reading
  function stopReading() {
    isPlaying = false;
    if (interval) {
      clearTimeout(interval);
      interval = null;
    }
    updatePlayButton();
  }

  // Toggle play/pause
  function togglePlayPause() {
    if (isPlaying) {
      stopReading();
    } else {
      startReading();
    }
  }

  // Restart from beginning
  function restart() {
    stopReading();
    finishOverlay.classList.add('hidden');
    currentWordIndex = 0;
    if (words.length > 0) {
      displayWord(words[0]);
      highlightWordInText(0);
      updateProgress();
      updateReadingTime();
    }
  }

  // Skip word forward/backward
  function skipWord(direction) {
    const wasPlaying = isPlaying;
    stopReading();

    currentWordIndex = Math.max(0, Math.min(words.length - 1, currentWordIndex + direction));
    displayWord(words[currentWordIndex]);
    highlightWordInText(currentWordIndex);
    updateProgress();
    updateReadingTime();

    if (wasPlaying) {
      startReading();
    }
  }

  // Update play button icon
  function updatePlayButton() {
    playIcon.style.display = isPlaying ? 'none' : 'block';
    pauseIcon.style.display = isPlaying ? 'block' : 'none';
  }

  // Update progress bar
  function updateProgress() {
    if (words.length === 0) return;
    const percent = (currentWordIndex / words.length) * 100;
    progressFill.style.width = percent + '%';
  }

  // Update reading time
  function updateReadingTime() {
    if (words.length === 0) {
      readingTime.textContent = '';
      return;
    }

    const remaining = words.length - currentWordIndex;
    const minutes = remaining / wpm;

    if (minutes < 1) {
      readingTime.textContent = `~${Math.ceil(minutes * 60)}s`;
    } else {
      readingTime.textContent = `~${Math.ceil(minutes)}m`;
    }
  }

  // Show finish screen with confetti
  function showFinish() {
    const confettiContainer = document.getElementById('confetti');
    confettiContainer.innerHTML = '';

    const colors = ['#e74c3c', '#3498db', '#2ecc71', '#f1c40f', '#9b59b6'];

    for (let i = 0; i < 40; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      piece.style.left = Math.random() * 100 + '%';
      piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      piece.style.width = (6 + Math.random() * 6) + 'px';
      piece.style.height = (6 + Math.random() * 6) + 'px';
      piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
      piece.style.animationDelay = Math.random() * 0.5 + 's';
      piece.style.animationDuration = (1 + Math.random() * 1) + 's';
      confettiContainer.appendChild(piece);
    }

    finishOverlay.classList.remove('hidden');
  }

  // Keyboard shortcuts
  function handleKeyboard(e) {
    // Only work when reader is visible
    if (readerSection.classList.contains('hidden')) return;

    // Don't trigger in input fields
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    switch (e.code) {
      case 'Space':
        e.preventDefault();
        togglePlayPause();
        break;
      case 'ArrowLeft':
        e.preventDefault();
        skipWord(-1);
        break;
      case 'ArrowRight':
        e.preventDefault();
        skipWord(1);
        break;
      case 'ArrowUp':
        e.preventDefault();
        wpm = Math.min(1000, wpm + 50);
        speedSlider.value = wpm;
        wpmValue.textContent = wpm + ' wpm';
        localStorage.setItem('speedReaderWpm', wpm);
        updateReadingTime();
        break;
      case 'ArrowDown':
        e.preventDefault();
        wpm = Math.max(100, wpm - 50);
        speedSlider.value = wpm;
        wpmValue.textContent = wpm + ' wpm';
        localStorage.setItem('speedReaderWpm', wpm);
        updateReadingTime();
        break;
      case 'KeyR':
        if (!e.ctrlKey && !e.metaKey) {
          e.preventDefault();
          restart();
        }
        break;
      case 'Escape':
        e.preventDefault();
        closeReader();
        break;
    }
  }

  // Show loading
  function showLoading(show) {
    loadingOverlay.classList.toggle('visible', show);
  }

  // Show error toast
  function showError(message) {
    errorToast.textContent = message;
    errorToast.classList.add('visible');
    setTimeout(() => {
      errorToast.classList.remove('visible');
    }, 3000);
  }

  // Validate URL
  function isValidUrl(string) {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  }

  // Clean URL from tracking parameters
  function cleanUrl(urlString) {
    try {
      const url = new URL(urlString);
      const trackingParams = [
        'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
        'fbclid', 'gclid', 'yclid', 'ref', 'source'
      ];
      trackingParams.forEach(param => url.searchParams.delete(param));
      return url.toString();
    } catch {
      return urlString;
    }
  }

  // Initialize app
  init();
})();
