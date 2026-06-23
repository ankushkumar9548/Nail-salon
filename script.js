document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       MOBILE DRAWER MENU
       ========================================================================== */
    const menuToggle = document.getElementById('menuToggle');
    const mobileDrawer = document.getElementById('mobileDrawer');
    const drawerLinks = document.querySelectorAll('.drawer-link, .drawer-cta');

    const toggleDrawer = () => {
        const isOpen = mobileDrawer.classList.toggle('open');
        menuToggle.classList.toggle('active');
        document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    menuToggle.addEventListener('click', toggleDrawer);

    // Close drawer when clicking a link
    drawerLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileDrawer.classList.contains('open')) {
                toggleDrawer();
            }
        });
    });

    // Close drawer when clicking outside the drawer
    document.addEventListener('click', (e) => {
        if (mobileDrawer.classList.contains('open') && 
            !mobileDrawer.contains(e.target) && 
            !menuToggle.contains(e.target)) {
            toggleDrawer();
        }
    });

    /* ==========================================================================
       SCROLL ACTIVE STATE (SCROLL-SPY)
       ========================================================================== */
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const scrollActive = () => {
        const scrollY = window.pageYOffset;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 120; // offset for sticky navbar
            const sectionId = current.getAttribute('id');
            const correspondingNavLink = document.querySelector(`.nav-link[href*=${sectionId}]`);

            if (correspondingNavLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLinks.forEach(link => link.classList.remove('active'));
                    correspondingNavLink.classList.add('active');
                }
            }
        });
    };

    window.addEventListener('scroll', scrollActive);

    /* ==========================================================================
       TESTIMONIALS CAROUSEL
       ========================================================================== */
    const slider = document.getElementById('testimonialSlider');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;
    const totalSlides = dots.length;
    let slideInterval;

    const goToSlide = (index) => {
        currentSlide = index;
        slider.style.transform = `translateX(-${currentSlide * 33.333}%)`;
        
        // Update dots active class
        dots.forEach((dot, idx) => {
            dot.classList.toggle('active', idx === currentSlide);
        });
    };

    const nextSlide = () => {
        currentSlide = (currentSlide + 1) % totalSlides;
        goToSlide(currentSlide);
    };

    // Auto playing
    const startSlideShow = () => {
        slideInterval = setInterval(nextSlide, 5000); // changes every 5 seconds
    };

    const stopSlideShow = () => {
        clearInterval(slideInterval);
    };

    // Initialize carousel listeners
    dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            stopSlideShow();
            const slideIndex = parseInt(e.target.getAttribute('data-slide'));
            goToSlide(slideIndex);
            startSlideShow();
        });
    });

    startSlideShow();

    // Pause autoplay on mouse hover
    slider.addEventListener('mouseenter', stopSlideShow);
    slider.addEventListener('mouseleave', startSlideShow);

    /* ==========================================================================
       GALLERY LIGHTBOX MODAL
       ========================================================================== */
    const galleryItems = document.querySelectorAll('.lookbook-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImage');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    
    let currentImgIndex = 0;
    const imagesList = [];

    // Populate images array
    galleryItems.forEach((item, idx) => {
        const imgPath = item.getAttribute('data-image');
        const imgAlt = item.querySelector('.lookbook-img').getAttribute('alt');
        imagesList.push({ src: imgPath, alt: imgAlt, title: imgAlt });

        item.addEventListener('click', () => {
            currentImgIndex = idx;
            openLightbox(imagesList[currentImgIndex]);
        });
    });

    const openLightbox = (imageObj) => {
        lightbox.style.display = 'flex';
        lightboxImg.src = imageObj.src;
        lightboxImg.alt = imageObj.alt;
        lightboxCaption.innerHTML = `<strong>${imageObj.title}</strong>`;
        document.body.style.overflow = 'hidden'; // prevent page scrolling
    };

    const closeLightbox = () => {
        lightbox.style.display = 'none';
        document.body.style.overflow = ''; // re-enable scrolling
    };

    const showPrevImage = () => {
        currentImgIndex = (currentImgIndex - 1 + imagesList.length) % imagesList.length;
        openLightbox(imagesList[currentImgIndex]);
    };

    const showNextImage = () => {
        currentImgIndex = (currentImgIndex + 1) % imagesList.length;
        openLightbox(imagesList[currentImgIndex]);
    };

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', showPrevImage);
    lightboxNext.addEventListener('click', showNextImage);

    // Close lightbox on click outside the image
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target === lightboxClose) {
            closeLightbox();
        }
    });

    // Keyboard support
    document.addEventListener('keydown', (e) => {
        if (lightbox.style.display === 'flex') {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showPrevImage();
            if (e.key === 'ArrowRight') showNextImage();
        }
    });

    /* ==========================================================================
       APPOINTMENT FORM VALIDATION
       ========================================================================== */
    const form = document.getElementById('appointmentForm');
    const nameInput = document.getElementById('clientName');
    const phoneInput = document.getElementById('clientPhone');
    const serviceSelect = document.getElementById('serviceNeeded');
    const dateInput = document.getElementById('preferredDate');
    const formStatus = document.getElementById('formStatus');

    // Utility: Check Phone Number format (Indian 10-digit style, supporting optional 0, 91, or +91 prefix)
    const isValidPhone = (phone) => {
        // Strip out non-digit characters
        const cleaned = phone.replace(/\D/g, '');
        // Check standard 10-digit number
        if (cleaned.length === 10) {
            return /^[6-9]\d{9}$/.test(cleaned);
        }
        // Check 11-digit number starting with 0
        if (cleaned.length === 11 && cleaned.startsWith('0')) {
            return /^[6-9]\d{9}$/.test(cleaned.slice(1));
        }
        // Check 12-digit number starting with 91
        if (cleaned.length === 12 && cleaned.startsWith('91')) {
            return /^[6-9]\d{9}$/.test(cleaned.slice(2));
        }
        // Check 13-digit number starting with 091
        if (cleaned.length === 13 && cleaned.startsWith('091')) {
            return /^[6-9]\d{9}$/.test(cleaned.slice(3));
        }
        return false;
    };

    const setError = (element, errorElementId, show) => {
        const parent = element.parentElement;
        if (show) {
            parent.classList.add('invalid');
        } else {
            parent.classList.remove('invalid');
        }
    };

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let isValid = true;

        // Validate Name
        if (nameInput.value.trim() === '') {
            setError(nameInput, 'nameError', true);
            isValid = false;
        } else {
            setError(nameInput, 'nameError', false);
        }

        // Validate Phone
        if (!isValidPhone(phoneInput.value)) {
            setError(phoneInput, 'phoneError', true);
            isValid = false;
        } else {
            setError(phoneInput, 'phoneError', false);
        }

        // Validate Service Select
        if (serviceSelect.value === '') {
            setError(serviceSelect, 'serviceError', true);
            isValid = false;
        } else {
            setError(serviceSelect, 'serviceError', false);
        }

        // Validate Date & Time (Must be in future)
        const selectedDate = new Date(dateInput.value);
        const now = new Date();
        if (dateInput.value === '' || selectedDate <= now) {
            setError(dateInput, 'dateError', true);
            isValid = false;
        } else {
            setError(dateInput, 'dateError', false);
        }

        if (isValid) {
            // Generate WhatsApp message content
            const name = nameInput.value.trim();
            const phone = phoneInput.value.trim();
            const serviceText = serviceSelect.options[serviceSelect.selectedIndex].text;
            const dateTime = dateInput.value;
            const notes = document.getElementById('specialNotes').value.trim();

            // Format date-time nicely
            const formattedDate = new Date(dateTime).toLocaleString('en-IN', {
                dateStyle: 'medium',
                timeStyle: 'short'
            });

            let message = `Hi! I'd like to book an appointment at Neha Makeover.\n\n`;
            message += `*Name:* ${name}\n`;
            message += `*Phone:* ${phone}\n`;
            message += `*Service:* ${serviceText}\n`;
            message += `*Preferred Date & Time:* ${formattedDate}\n`;
            if (notes) {
                message += `*Special Requests:* ${notes}\n`;
            }

            // Encode message for URL
            const encodedMessage = encodeURIComponent(message);
            
            // Neha Makeover WhatsApp number
            const whatsappUrl = `https://wa.me/917906602296?text=${encodedMessage}`;

            // Show success status
            formStatus.className = 'form-status success';
            formStatus.innerHTML = `<strong>Redirecting to WhatsApp...</strong> Opening chat with your booking details.`;

            // Reset form
            form.reset();
            
            // Remove validation styling classes
            document.querySelectorAll('.form-group').forEach(group => {
                group.classList.remove('invalid');
            });

            // Redirect to WhatsApp after 1.5 seconds
            setTimeout(() => {
                window.open(whatsappUrl, '_blank');
                formStatus.style.display = 'none';
            }, 1500);
        } else {
            formStatus.className = 'form-status error';
            formStatus.innerHTML = `<strong>Please correct the highlighted fields</strong> and submit again.`;
        }
    });

    // Real-time error removing on input changes
    nameInput.addEventListener('input', () => {
        if (nameInput.value.trim() !== '') setError(nameInput, 'nameError', false);
    });

    phoneInput.addEventListener('input', () => {
        if (isValidPhone(phoneInput.value)) setError(phoneInput, 'phoneError', false);
    });

    serviceSelect.addEventListener('change', () => {
        if (serviceSelect.value !== '') setError(serviceSelect, 'serviceError', false);
    });

    dateInput.addEventListener('input', () => {
        const selectedDate = new Date(dateInput.value);
        const now = new Date();
        if (dateInput.value !== '' && selectedDate > now) setError(dateInput, 'dateError', false);
    });

    /* ==========================================================================
       BACK TO TOP BUTTON
       ========================================================================== */
    const backToTopBtn = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 400) {
            backToTopBtn.style.opacity = '1';
            backToTopBtn.style.visibility = 'visible';
            backToTopBtn.style.transform = 'translateY(0)';
        } else {
            backToTopBtn.style.opacity = '0';
            backToTopBtn.style.visibility = 'hidden';
            backToTopBtn.style.transform = 'translateY(15px)';
        }
    });

    // Ensure initial button visibility state is correct
    backToTopBtn.style.opacity = '0';
    backToTopBtn.style.visibility = 'hidden';
    backToTopBtn.style.transition = 'all 0.3s ease';

});
