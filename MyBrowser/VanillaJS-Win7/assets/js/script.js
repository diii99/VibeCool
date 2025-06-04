// Windows 95 Style JavaScript

// Set the current time in the taskbar
function updateClock() {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  document.getElementById('clock').textContent = `${hours}:${minutes}`;
}

// Update the clock every minute
setInterval(updateClock, 60000);
updateClock(); // Initial call

// Add draggable functionality to windows
document.addEventListener('DOMContentLoaded', function() {
  const windows = document.querySelectorAll('.window:not(.fixed-window)');
  
  // Prevent default resize behavior on borders
  document.addEventListener('mousedown', function(e) {
    // Prevent resize functionality for all window borders
    if (e.target.closest('.window') && !e.target.closest('.title-bar') && !e.target.closest('.window-body')) {
      e.preventDefault();
      return false;
    }
  });
  
  windows.forEach(function(win) {
    const titleBar = win.querySelector('.title-bar');
    
    if (titleBar) {
      let isDragging = false;
      let offsetX, offsetY;
      
      titleBar.addEventListener('mousedown', function(e) {
        // Check if this is a project item (theme project)
        const isProjectItem = win.classList.contains('project-item');
        
        // Only allow dragging when clicking on the title bar, not on its buttons
        // And not for project items
        if (!e.target.closest('.title-bar-controls') && !isProjectItem) {
          isDragging = true;
          offsetX = e.clientX - win.getBoundingClientRect().left;
          offsetY = e.clientY - win.getBoundingClientRect().top;
          
          // Bring window to front
          windows.forEach(w => w.style.zIndex = "1");
          win.style.zIndex = "999";
        }
      });
      
      document.addEventListener('mousemove', function(e) {
        if (isDragging) {
          // Store the existing width and other properties before changing position
          const currentWidth = win.style.width;
          
          // Special handling for windows with transform (like FAQ window)
          if (win.id === 'faq-window' || win.style.transform) {
            // For windows that use transform to center, remove the transform and adjust position
            win.style.transform = 'none';
            win.style.position = 'absolute';
            
            // Initial drag may need to account for the window's mid-point offset
            if (!win.dataset.dragInitialized) {
              // Get window dimensions for proper centering
              const rect = win.getBoundingClientRect();
              win.style.left = (e.clientX - offsetX) + 'px';
              win.style.top = (e.clientY - offsetY) + 'px';
              win.dataset.dragInitialized = 'true';
            } else {
              win.style.left = (e.clientX - offsetX) + 'px';
              win.style.top = (e.clientY - offsetY) + 'px';
            }
          } else {
            // Normal handling for other windows
            win.style.position = 'absolute';
            win.style.left = (e.clientX - offsetX) + 'px';
            win.style.top = (e.clientY - offsetY) + 'px';
          }
          
          // Ensure width doesn't change during drag
          win.style.width = currentWidth;
        }
      });
      
      document.addEventListener('mouseup', function() {
        isDragging = false;
        // Reset drag initialization flag when dragging ends
        if (win.dataset.dragInitialized) {
          win.dataset.dragInitialized = 'false';
        }
      });
    }
  });
  
  // Window control buttons functionality
  const closeButtons = document.querySelectorAll('.close-btn');
  closeButtons.forEach(function(btn) {
    btn.addEventListener('click', function() {
      const window = btn.closest('.window');
      if (window) {
        window.style.display = 'none';
      }
    });
  });
  
  // Minimize button functionality
  const minimizeButtons = document.querySelectorAll('.minimize-btn');
  minimizeButtons.forEach(function(btn) {
    btn.addEventListener('click', function() {
      const window = btn.closest('.window');
      if (window) {
        if (window.dataset.minimized === 'true') {
          // Restore window
          window.querySelector('.window-body').style.display = 'block';
          window.dataset.minimized = 'false';
        } else {
          // Minimize window
          window.querySelector('.window-body').style.display = 'none';
          window.dataset.minimized = 'true';
        }
      }
    });
  });
  
  // Maximize button functionality removed
  // No more maximize buttons in the HTML
  
  // Simulate slow loading with progress bar
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
  
  // Form submission is handled in the HTML
  // Removing duplicate event listeners to prevent double submissions
  
  // Tab navigation
  const tabs = document.querySelectorAll('.tab');
  const tabContents = document.querySelectorAll('.tab-content');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', function() {
      const tabId = this.getAttribute('data-tab');
      
      // Remove active class from all tabs and content
      tabs.forEach(t => t.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));
      
      // Add active class to clicked tab and corresponding content
      this.classList.add('active');
      document.getElementById(`content-${tabId}`).classList.add('active');
      
      // No need to show prize window as it's already visible
      // Prize window is now permanently displayed
    });
  });
  
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
    // Update title
    howtoTitle.textContent = `How to Participate: Step ${currentStep} of 3`;
    
    // Show current step, hide others
    steps.forEach((step, index) => {
      if (index + 1 === currentStep) {
        step.style.display = 'block';
      } else {
        step.style.display = 'none';
      }
    });
    
    // Update buttons
    prevBtn.style.display = currentStep > 1 ? 'block' : 'none';
    nextBtn.style.display = currentStep < 3 ? 'block' : 'none';
    submitEntryBtn.style.display = currentStep === 3 ? 'block' : 'none';
  }
  
  // Prize rules popup
  const learnMoreBtn = document.getElementById('learn-more-btn');
  const rulesPopup = document.getElementById('rules-popup');
  
  if (learnMoreBtn) {
    learnMoreBtn.addEventListener('click', function() {
      rulesPopup.style.display = 'block';
    });
  }
  
  // Copy post button functionality for both buttons
  const copyFunctionality = function(buttonId) {
    const copyBtn = document.getElementById(buttonId);
    if (copyBtn) {
      copyBtn.addEventListener('click', function() {
        // Get the text content from the example post
        const postText = "Just joined the @youwareai challenge — theme: Retro Vibes × Future AI.\n" +
                        "Had so much fun creating a site that captures those nostalgic, retro-future vibes — and now I'm in the running for the $1000 prize pool.\n" +
                        "Come take a look & tell me what you think: [your project link]\n" +
                        "#YouWareRetroChallenge";
        
        // Copy to clipboard
        navigator.clipboard.writeText(postText).then(() => {
          // Provide feedback
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
  
  // Apply copy functionality to both buttons
  copyFunctionality('copy-post-btn');
  copyFunctionality('step-copy-post-btn');
});