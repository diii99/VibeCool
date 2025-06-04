// Windows 11 Style JavaScript - Modern Implementation

// Set the current time in the taskbar
function updateClock() {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const timeString = `${hours}:${minutes}`;
  const dateString = now.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  });
  
  const clockElement = document.getElementById('clock');
  if (clockElement) {
    clockElement.innerHTML = `<div style="text-align: right; line-height: 1.2;"><div>${timeString}</div><div style="font-size: 11px; opacity: 0.8;">${dateString}</div></div>`;
  }
}

// Update the clock every minute
setInterval(updateClock, 60000);
updateClock(); // Initial call

// Windows 11 Taskbar functionality
class Win11Taskbar {
  constructor() {
    this.activeApps = new Set();
    this.init();
  }

  init() {
    this.setupStartButton();
    this.setupSearchButton();
    this.setupTaskbarItems();
  }

  setupStartButton() {
    const startButton = document.querySelector('.start-button-win11');
    const startMenu = document.getElementById('start-menu-panel');
    
    if (startButton && startMenu) {
      startButton.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleStartMenu();
      });
    }
  }

  setupSearchButton() {
    const searchButton = document.getElementById('taskbar-search');
    const searchPanel = document.getElementById('search-panel');
    
    if (searchButton && searchPanel) {
      searchButton.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleSearchPanel();
      });
    }
  }

  setupTaskbarItems() {
    // Setup taskbar app icons with Windows 11 behavior
    const taskbarItems = document.querySelectorAll('.taskbar-item');
    taskbarItems.forEach(item => {
      item.addEventListener('click', () => {
        this.activateApp(item);
      });
    });
  }

  toggleStartMenu() {
    const startMenu = document.getElementById('start-menu-panel');
    const startButton = document.querySelector('.start-button-win11');
    const searchPanel = document.getElementById('search-panel');
    
    if (startMenu) {
      const isVisible = startMenu.style.display === 'flex';
      
      // Close search if open
      if (searchPanel) {
        searchPanel.style.display = 'none';
        document.getElementById('taskbar-search')?.classList.remove('active');
      }
      
      if (isVisible) {
        startMenu.style.display = 'none';
        startButton?.classList.remove('active');
      } else {
        startMenu.style.display = 'flex';
        startButton?.classList.add('active');
        
        // Focus on search input
        const searchInput = startMenu.querySelector('input[type="text"]');
        if (searchInput) {
          setTimeout(() => searchInput.focus(), 100);
        }
      }
    }
  }

  toggleSearchPanel() {
    const searchPanel = document.getElementById('search-panel');
    const searchButton = document.getElementById('taskbar-search');
    const startMenu = document.getElementById('start-menu-panel');
    
    if (searchPanel) {
      const isVisible = searchPanel.style.display === 'flex';
      
      // Close start menu if open
      if (startMenu) {
        startMenu.style.display = 'none';
        document.querySelector('.start-button-win11')?.classList.remove('active');
      }
      
      if (isVisible) {
        searchPanel.style.display = 'none';
        searchButton?.classList.remove('active');
      } else {
        searchPanel.style.display = 'flex';
        searchButton?.classList.add('active');
        
        // Focus on search input
        const searchInput = searchPanel.querySelector('input[type="text"]');
        if (searchInput) {
          setTimeout(() => searchInput.focus(), 100);
        }
      }
    }
  }

  activateApp(taskbarItem) {
    // Add visual feedback for app activation
    taskbarItem.classList.add('active');
    setTimeout(() => {
      taskbarItem.classList.remove('active');
    }, 200);
  }

  addTaskbarIcon(appId, iconSrc, title) {
    // Dynamically add app to taskbar
    const container = document.getElementById('minimized-apps-container');
    if (container) {
      const icon = document.createElement('div');
      icon.className = 'taskbar-item';
      icon.title = title;
      icon.dataset.appId = appId;
      icon.innerHTML = `<img src="${iconSrc}" alt="${title}" style="width: 24px; height: 24px;">`;
      
      icon.addEventListener('click', () => {
        this.restoreApp(appId);
      });
      
      container.appendChild(icon);
    }
  }

  removeTaskbarIcon(appId) {
    const icon = document.querySelector(`[data-app-id="${appId}"]`);
    if (icon) {
      icon.remove();
    }
  }

  restoreApp(appId) {
    const window = document.getElementById(appId);
    if (window) {
      window.style.display = 'flex';
      this.removeTaskbarIcon(appId);
    }
  }
}

// Windows 11 Window Management
class Win11WindowManager {
  constructor() {
    this.windows = new Map();
    this.zIndexCounter = 1000;
    this.init();
  }

  init() {
    this.setupWindowControls();
    this.setupDragAndDrop();
    this.setupDesktopIcons();
  }

  setupWindowControls() {
    // Close button functionality
    document.addEventListener('click', (e) => {
      if (e.target.matches('.close-btn')) {
        const window = e.target.closest('.app-window');
        if (window) {
          this.closeWindow(window);
        }
      }
      
      if (e.target.matches('.minimize-btn')) {
        const window = e.target.closest('.app-window');
        if (window) {
          this.minimizeWindow(window);
        }
      }
    });
  }

  setupDragAndDrop() {
    const windows = document.querySelectorAll('.app-window');
    
    windows.forEach(window => {
      const titleBar = window.querySelector('.app-window-title-bar');
      if (titleBar) {
        this.makeDraggable(window, titleBar);
      }
    });
  }

  makeDraggable(element, handle) {
    let isDragging = false;
    let currentX = 0;
    let currentY = 0;
    let initialX = 0;
    let initialY = 0;

    handle.addEventListener('mousedown', (e) => {
      initialX = e.clientX - element.offsetLeft;
      initialY = e.clientY - element.offsetTop;
      
      if (e.target === handle || handle.contains(e.target)) {
        isDragging = true;
        this.bringToFront(element);
      }
    });

    document.addEventListener('mousemove', (e) => {
      if (isDragging) {
        e.preventDefault();
        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;

        // Keep window within viewport
        const maxX = window.innerWidth - element.offsetWidth;
        const maxY = window.innerHeight - element.offsetHeight;
        
        currentX = Math.max(0, Math.min(currentX, maxX));
        currentY = Math.max(0, Math.min(currentY, maxY));

        element.style.left = currentX + 'px';
        element.style.top = currentY + 'px';
        element.style.transform = 'none';
      }
    });

    document.addEventListener('mouseup', () => {
      isDragging = false;
    });
  }

  bringToFront(window) {
    window.style.zIndex = ++this.zIndexCounter;
  }

  closeWindow(window) {
    // Add close animation
    window.style.opacity = '0';
    window.style.transform = 'scale(0.95)';
    window.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
    
    setTimeout(() => {
      window.style.display = 'none';
      window.style.opacity = '';
      window.style.transform = '';
      window.style.transition = '';
    }, 200);
  }

  minimizeWindow(window) {
    // Add to taskbar and hide window
    const taskbar = new Win11Taskbar();
    const title = window.querySelector('.app-window-title-bar h1')?.textContent || 'App';
    const appId = window.id;
    
    taskbar.addTaskbarIcon(appId, 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3QgeD0iMyIgeT0iMyIgd2lkdGg9IjE4IiBoZWlnaHQ9IjE4IiByeD0iMiIgZmlsbD0iIzAwNzhkNCIvPgo8L3N2Zz4K', title);
    
    // Hide window with animation
    window.style.opacity = '0';
    window.style.transform = 'scale(0.9)';
    window.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
    
    setTimeout(() => {
      window.style.display = 'none';
      window.style.opacity = '';
      window.style.transform = '';
      window.style.transition = '';
    }, 200);
  }

  setupDesktopIcons() {
    const desktopIcons = document.querySelectorAll('.desktop-icon-win11');
    
    desktopIcons.forEach(icon => {
      icon.addEventListener('click', () => {
        const iconId = icon.id;
        this.handleDesktopIconClick(iconId);
    });
  });
  }


  showWindow(windowId) {
    const window = document.getElementById(windowId);
      if (window) {
      window.style.display = 'flex';
      this.bringToFront(window);
      
      // Add show animation
      window.style.opacity = '0';
      window.style.transform = 'scale(0.95)';
      window.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
      
      requestAnimationFrame(() => {
        window.style.opacity = '1';
        window.style.transform = 'scale(1)';
        
        setTimeout(() => {
          window.style.transition = '';
        }, 200);
      });
    }
  }

}

// Application initialization
document.addEventListener('DOMContentLoaded', function() {
  // Initialize Windows 11 components
  const taskbar = new Win11Taskbar();
  const windowManager = new Win11WindowManager();
  
  // Close panels when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('#start-menu-panel') && !e.target.closest('.start-button-win11')) {
      const startMenu = document.getElementById('start-menu-panel');
      if (startMenu && startMenu.style.display === 'flex') {
        startMenu.style.display = 'none';
        document.querySelector('.start-button-win11')?.classList.remove('active');
      }
    }
    
    if (!e.target.closest('#search-panel') && !e.target.closest('#taskbar-search')) {
      const searchPanel = document.getElementById('search-panel');
      if (searchPanel && searchPanel.style.display === 'flex') {
        searchPanel.style.display = 'none';
        document.getElementById('taskbar-search')?.classList.remove('active');
      }
    }
  });

  // Simulate loading with progress bar
  const progressBar = document.getElementById('progress-bar');
  if (progressBar) {
    let width = 1;
    const interval = setInterval(function() {
      if (width >= 100) {
        clearInterval(interval);
        document.getElementById('loading-screen').style.display = 'none';
        document.getElementById('main-content').style.display = 'block';
      } else {
        width++;
        progressBar.style.width = width + '%';
        document.getElementById('progress-text').textContent = 'Loading... ' + width + '%';
      }
    }, 20);
  }
  
  // Tab navigation for existing content
  const tabs = document.querySelectorAll('.tab');
  const tabContents = document.querySelectorAll('.tab-content');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', function() {
      const tabId = this.getAttribute('data-tab');
      
      tabs.forEach(t => t.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));
      
      this.classList.add('active');
      const content = document.getElementById(`content-${tabId}`);
      if (content) {
        content.classList.add('active');
      }
    });
  });

  // Start menu item functionality
  document.addEventListener('click', (e) => {
    if (e.target.closest('.start-menu-item')) {
      const item = e.target.closest('.start-menu-item');
      const title = item.getAttribute('title');
      
      // Close start menu
      document.getElementById('start-menu-panel').style.display = 'none';
      document.querySelector('.start-button-win11')?.classList.remove('active');
      
      // Handle start menu item actions
      if (title === 'YouWare Challenge') {
        windowManager.showWindow('youware-challenge-app');
      } else if (title === 'Notepad') {
        windowManager.createNotepadWindow();
      }
    }
  });

  // Search functionality
  const searchInputs = document.querySelectorAll('input[type="text"][placeholder*="search" i], input[type="text"][placeholder*="Search" i]');
  searchInputs.forEach(input => {
    input.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      // Add search functionality here
      console.log('Searching for:', query);
    });
  });
  
  // Existing functionality for the YouWare Challenge
  setupChallengeApp();
});

function setupChallengeApp() {
  // How to participate step navigation
  const openHowToBtn = document.getElementById('open-howto-btn');
  const howtoPopup = document.getElementById('howto-popup');
  const nextBtn = document.getElementById('next-btn');
  const prevBtn = document.getElementById('prev-btn');
  const submitEntryBtn = document.getElementById('submit-entry-btn');
  const howtoTitle = document.getElementById('howto-title');
  const steps = document.querySelectorAll('.howto-step');
  
  let currentStep = 1;
  
  if (openHowToBtn) {
    openHowToBtn.addEventListener('click', function() {
      howtoPopup.style.display = 'block';
      currentStep = 1;
      updateStepView();
    });
  }
  
  if (nextBtn) {
    nextBtn.addEventListener('click', function() {
      if (currentStep < 3) {
        currentStep++;
        updateStepView();
      }
    });
  }
  
  if (prevBtn) {
    prevBtn.addEventListener('click', function() {
      if (currentStep > 1) {
        currentStep--;
        updateStepView();
      }
    });
  }
  
  if (submitEntryBtn) {
    submitEntryBtn.addEventListener('click', function() {
      const websiteUrlInput = document.getElementById('website_link');
      const socialUrlInput = document.getElementById('social_link');
      
      if (!websiteUrlInput.value || !socialUrlInput.value) {
        alert('Please fill in both URL fields to submit your entry.');
      } else {
        alert('Thanks for submitting your entry! Good luck in the challenge.');
        howtoPopup.style.display = 'none';
      }
    });
  }
  
  function updateStepView() {
    if (howtoTitle) {
    howtoTitle.textContent = `How to Participate: Step ${currentStep} of 3`;
    }
    
    steps.forEach((step, index) => {
      if (index + 1 === currentStep) {
        step.style.display = 'block';
      } else {
        step.style.display = 'none';
      }
    });
    
    if (prevBtn) prevBtn.style.display = currentStep > 1 ? 'block' : 'none';
    if (nextBtn) nextBtn.style.display = currentStep < 3 ? 'block' : 'none';
    if (submitEntryBtn) submitEntryBtn.style.display = currentStep === 3 ? 'block' : 'none';
  }
  
  // Prize rules popup
  const learnMoreBtn = document.getElementById('learn-more-btn');
  const rulesPopup = document.getElementById('rules-popup');
  
  if (learnMoreBtn) {
    learnMoreBtn.addEventListener('click', function() {
      rulesPopup.style.display = 'block';
    });
  }
  
  // Copy post button functionality
  const copyFunctionality = function(buttonId) {
    const copyBtn = document.getElementById(buttonId);
    if (copyBtn) {
      copyBtn.addEventListener('click', function() {
        const postText = "Just joined the @youwareai challenge — theme: Retro Vibes × Future AI.\n" +
                        "Had so much fun creating a site that captures those nostalgic, retro-future vibes — and now I'm in the running for the $1000 prize pool.\n" +
                        "Come take a look & tell me what you think: [your project link]\n" +
                        "#YouWareRetroChallenge";
        
        navigator.clipboard.writeText(postText).then(() => {
          copyBtn.textContent = "Copied!";
          setTimeout(() => {
            copyBtn.textContent = "Copy";
          }, 2000);
        }).catch(err => {
          console.error('Failed to copy: ', err);
          alert('Failed to copy text. Please try again.');
        });
      });
    }
  };
  
  copyFunctionality('copy-post-btn');
  copyFunctionality('step-copy-post-btn');
} 