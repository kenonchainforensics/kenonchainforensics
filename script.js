document.addEventListener('DOMContentLoaded', () => {
    
    /* ==========================================================================
       0. Automated Visitor Notification (URL MATCHED TO BACKEND)
       ========================================================================== */
    fetch('/api/notify-visit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
            referrer: document.referrer || 'Direct Visit',
            timestamp: new Date().toISOString()
        })
    }).catch(err => console.log('Notification skipped'));

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
            document.body.style.overflow = 'hidden'; 
        }
    };

    const closeTray = () => {
        if (sideTray && trayOverlay) {
            sideTray.classList.remove('active');
            trayOverlay.classList.remove('active');
            document.body.style.overflow = ''; 
        }
    };

    if (menuOpenBtn) menuOpenBtn.addEventListener('click', openTray);
    if (menuCloseBtn) menuCloseBtn.addEventListener('click', closeTray);
    if (trayOverlay) trayOverlay.addEventListener('click', closeTray);

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
            
            faqItem.classList.toggle('active');
            
            faqQuestions.forEach(otherQuestion => {
                const otherItem = otherQuestion.parentElement;
                if (otherItem !== faqItem) {
                    otherItem.classList.remove('active');
                }
            });
        });
    });

    /* ==========================================================================
       3. Dynamic Case Intake Conditional Logic
       ========================================================================== */
    const assetTypeSelect = document.getElementById('assetType');
    const cryptoBlock = document.getElementById('cryptoFields');
    const wireBlock = document.getElementById('wireFields');
    const giftcardBlock = document.getElementById('giftcardFields');

    if (assetTypeSelect && cryptoBlock && wireBlock && giftcardBlock) {
        assetTypeSelect.addEventListener('change', (e) => {
            const selectedValue = e.target.value;

            cryptoBlock.style.display = 'none';
            wireBlock.style.display = 'none';
            giftcardBlock.style.display = 'none';

            if (selectedValue === 'crypto') {
                cryptoBlock.style.display = 'block';
            } else if (selectedValue === 'wire') {
                wireBlock.style.display = 'block'; 
            } else if (selectedValue === 'giftcard') {
                giftcardBlock.style.display = 'block';
            }
        });
    }

    /* ==========================================================================
       4. Simulated Drag and Drop File Selection
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
            
            const trackingId = "KEN-" + Math.floor(100000 + Math.random() * 900000);
            const assetType = document.getElementById('assetType')?.value || 'Crypto Asset';
            
            const initialCaseData = {
                caseId: trackingId,
                asset: assetType,
                currentStep: 1, 
                progressPercent: 15,
                logs: [
                    { time: new Date().toLocaleTimeString(), text: "Secure telemetry pipeline successfully initialized." },
                    { time: new Date().toLocaleTimeString(), text: "Case dossier registered in local analytical memory index." }
                ],
                toolLink: "https://your-purchase-tool-link.com" 
            };
            
            localStorage.setItem('activeCase', JSON.stringify(initialCaseData));
            alert(`Dossier accepted. Redirecting to secure tracking pipeline for Case ID: ${trackingId}`);
            window.location.href = `success.html?caseId=${trackingId}`;
        });
    }

    /* ==========================================================================
       6. Certificate 3D Rotating Slider
       ========================================================================== */
    const cards = document.querySelectorAll(".cert-card");
    let currentIndex = 0;
    const intervalTime = 3500; 

    function updateSlider() {
        const totalCards = cards.length;
        if (totalCards === 0) return;

        cards.forEach((card, index) => {
            card.className = "cert-card";

            if (index === currentIndex) {
                card.classList.add("active");
            } else if (index === (currentIndex - 1 + totalCards) % totalCards) {
                card.classList.add("left-side");
            } else if (index === (currentIndex + 1) % totalCards) {
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

    updateSlider();
    let sliderInterval = setInterval(nextSlide, intervalTime);

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