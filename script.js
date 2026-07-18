document.addEventListener('DOMContentLoaded', () => {
    
    /* ==========================================================================
       1. Sliding Drawer Menu Control
       ========================================================================== */
    const menuOpenBtn = document.getElementById('menuOpenBtn');
    const menuCloseBtn = document.getElementById('menuCloseBtn');
    const sideTray = document.getElementById('sideTray');
    const trayOverlay = document.getElementById('trayOverlay');
    const trayLinks = document.querySelectorAll('.tray-link');

    const openTray = () => {
        if (sideTray && trayOverlay) {
            sideTray.classList.add('active');
            trayOverlay.classList.add('active');
            document.body.style.overflow = 'hidden'; // Lock scrolling behind tray
        }
    };

    const closeTray = () => {
        if (sideTray && trayOverlay) {
            sideTray.classList.remove('active');
            trayOverlay.classList.remove('active');
            document.body.style.overflow = ''; // Restore background scrolling
        }
    };

    if (menuOpenBtn) menuOpenBtn.addEventListener('click', openTray);
    if (menuCloseBtn) menuCloseBtn.addEventListener('click', closeTray);
    if (trayOverlay) trayOverlay.addEventListener('click', closeTray);

    // Close tray when any menu link inside it is clicked
    trayLinks.forEach(link => {
        link.addEventListener('click', closeTray);
    });

    /* ==========================================================================
       2. Interactive Accordion FAQs
       ========================================================================== */
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.parentElement;
            
            // Toggle active status
            faqItem.classList.toggle('active');
            
            // Close other items if one is opened
            faqQuestions.forEach(otherQuestion => {
                const otherItem = otherQuestion.parentElement;
                if (otherItem !== faqItem) {
                    otherItem.classList.remove('active');
                }
            });
        });
    });

    /* ==========================================================================
       3. Dynamic Case Intake Conditional Logic (BUG FIXED)
       ========================================================================== */
    const assetTypeSelect = document.getElementById('assetType');
    const cryptoBlock = document.getElementById('cryptoFields');
    const wireBlock = document.getElementById('wireFields');
    const giftcardBlock = document.getElementById('giftcardFields');

    if (assetTypeSelect && cryptoBlock && wireBlock && giftcardBlock) {
        assetTypeSelect.addEventListener('change', (e) => {
            const selectedValue = e.target.value;

            // Hide all conditional blocks initially
            cryptoBlock.style.display = 'none';
            wireBlock.style.display = 'none';
            giftcardBlock.style.display = 'none';

            // Toggle visibility based on selection (Corrected block routing)
            if (selectedValue === 'crypto') {
                cryptoBlock.style.display = 'block';
            } else if (selectedValue === 'wire') {
                wireBlock.style.display = 'block'; // FIXED: Changed from cryptoBlock to wireBlock
            } else if (selectedValue === 'giftcard') {
                giftcardBlock.style.display = 'block';
            }
        });
    }

    /* ==========================================================================
       4. Simulated Drag and Drop File Selection Visual Trigger
       ========================================================================== */
    const dropZone = document.querySelector('.file-drop-zone');
    const fileInput = document.getElementById('fileUpload');

    if (dropZone && fileInput) {
        dropZone.addEventListener('click', () => {
            fileInput.click();
        });

        fileInput.addEventListener('change', () => {
            if (fileInput.files.length > 0) {
                const paragraph = dropZone.querySelector('p');
                if (paragraph) {
                    paragraph.innerHTML = `Selected <span class="accent-text">${fileInput.files.length} file(s)</span> for pipeline submission.`;
                }
            }
        });
    }

   /* ==========================================================================
       5. Form Submit Capture (Redirecting to Tracker)
       ========================================================================== */
    const secureForm = document.getElementById('secureIntakeForm');
    
    if (secureForm) {
        secureForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Generate a professional-looking tracking ID
            const trackingId = "KEN-" + Math.floor(100000 + Math.random() * 900000);
            
            // Collect basic details to personalize the tracker
            const assetType = document.getElementById('assetType')?.value || 'Crypto Asset';
            
            // Set up initial state in localStorage for this case
            const initialCaseData = {
                caseId: trackingId,
                asset: assetType,
                currentStep: 1, // Start at step 1: Initialization
                progressPercent: 15,
                logs: [
                    { time: new Date().toLocaleTimeString(), text: "Secure telemetry pipeline successfully initialized." },
                    { time: new Date().toLocaleTimeString(), text: "Case dossier registered in local analytical memory index." }
                ],
                toolLink: "https://your-purchase-tool-link.com" // Default link
            };
            
            // Save to browser memory
            localStorage.setItem('activeCase', JSON.stringify(initialCaseData));
            
            alert(`Dossier accepted. Redirecting to secure tracking pipeline for Case ID: ${trackingId}`);
            
            // Redirect to the new tracking page
            window.location.href = `success.html?caseId=${trackingId}`;
        });
    }

    /* ==========================================================================
       6. Certificate 3D Rotating Slider (Cleanly Integrated)
       ========================================================================== */
    const cards = document.querySelectorAll(".cert-card");
    let currentIndex = 0;
    const intervalTime = 3500; // Time in milliseconds for each transition (3.5 seconds)

    function updateSlider() {
        const totalCards = cards.length;
        if (totalCards === 0) return;

        cards.forEach((card, index) => {
            // Remove previous positioning classes safely
            card.className = "cert-card";

            if (index === currentIndex) {
                // The current card goes to the center (sharp focus)
                card.classList.add("active");
            } else if (index === (currentIndex - 1 + totalCards) % totalCards) {
                // The previous card goes to the left side (blurred)
                card.classList.add("left-side");
            } else if (index === (currentIndex + 1) % totalCards) {
                // The next card goes to the right side (blurred)
                card.classList.add("right-side");
            }
        });
    }

    function nextSlide() {
        if (cards.length > 0) {
            currentIndex = (currentIndex + 1) % cards.length;
            updateSlider();
        }
    }

    // Initialize the starting layout
    updateSlider();

    // Start the automatic infinity loop
    let sliderInterval = setInterval(nextSlide, intervalTime);

    // Pause rotation when the cursor hovers over the slider
    const sliderContainer = document.querySelector(".slider-container");
    if (sliderContainer) {
        sliderContainer.addEventListener("mouseenter", () => {
            clearInterval(sliderInterval);
        });

        sliderContainer.addEventListener("mouseleave", () => {
            sliderInterval = setInterval(nextSlide, intervalTime);
        });
    }
});