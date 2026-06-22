document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.container');
    const splash = document.querySelector('.splash');
    const sidebar = document.querySelector('.floating-sidebar');
    const existenceText = document.querySelector('.existence-text');
    const scribble = document.getElementById('scribble');
    
    let flashlightUnlocked = false;

    // Sidebar Visibility and Active State
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const sidebarItems = document.querySelectorAll('.sidebar-item');
    
    sidebarItems.forEach(item => {
        const href = item.getAttribute('href');
        if (href === currentPath || (currentPath === 'index.html' && href === 'index.html#bio')) {
            item.classList.add('active');
        }
    });

    if (container) {
        const hasSplash = container.querySelector('.splash');
        if (hasSplash) {
            container.addEventListener('scroll', () => {
                const scrollPosition = container.scrollTop;
                if (scrollPosition > 100) {
                    sidebar.classList.add('visible');
                } else {
                    sidebar.classList.remove('visible');
                }
            });
        } else {
            sidebar.classList.add('visible');
        }
    } else if (sidebar) {
        // If not on homepage (no container), ensure sidebar is always visible
        sidebar.classList.add('visible');
    }

    // Flashlight logic
    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;
    let firstMove = true;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (firstMove) {
            currentX = mouseX;
            currentY = mouseY;
            firstMove = false;
        }
    });

    let lastRect = existenceText.getBoundingClientRect();
    // Update rect only on scroll/resize for performance
    window.addEventListener('scroll', () => { lastRect = existenceText.getBoundingClientRect(); }, true);
    window.addEventListener('resize', () => { lastRect = existenceText.getBoundingClientRect(); });

    const updateFlashlight = () => {
        const hasSplash = container && container.querySelector('.splash');
        if (!flashlightUnlocked || (hasSplash && container.scrollTop < window.innerHeight * 0.5)) {
            existenceText.style.setProperty('--mask-size', '0px');
            requestAnimationFrame(updateFlashlight);
            return;
        }

        // Snappy lerp (0.4) for high-end smoothness without excessive lag
        currentX += (mouseX - currentX) * 0.4;
        currentY += (mouseY - currentY) * 0.4;

        const x = currentX - lastRect.left;
        const y = currentY - lastRect.top;
        
        existenceText.style.setProperty('--mask-x', `${x}px`);
        existenceText.style.setProperty('--mask-y', `${y}px`);
        existenceText.style.setProperty('--mask-size', '180px');
        
        requestAnimationFrame(updateFlashlight);
    };

    updateFlashlight();

    document.addEventListener('mouseleave', () => {
        mouseX = -1000;
        mouseY = -1000;
    });

    // Scribble Interaction - Unlocks Flashlight
    if (scribble) {
        scribble.addEventListener('mouseover', () => {
            scribble.style.opacity = '0';
            setTimeout(() => {
                scribble.remove();
                flashlightUnlocked = true;
                // Force sync rect on unlock
                lastRect = existenceText.getBoundingClientRect();
                currentX = mouseX;
                currentY = mouseY;
            }, 300);
        });
    }

    // Technical flair: Dynamic Session ID and System Clock
    const sessionTag = document.querySelector('[style*="REF_001_INDEX"]');
    if (sessionTag) {
        const sessionId = Math.random().toString(36).substring(2, 10).toUpperCase();
        sessionTag.textContent = `REF_${sessionId}_INDEX`;
    }

    const createClock = () => {
        const clockTag = document.createElement('div');
        clockTag.className = 'tech-tag';
        clockTag.style.bottom = '20px';
        clockTag.style.right = '20px';
        clockTag.style.fontFamily = 'var(--mono-font)';
        document.body.appendChild(clockTag);

        setInterval(() => {
            const now = new Date();
            clockTag.textContent = `SYS_TIME: ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
        }, 1000);
    };
    createClock();
});
