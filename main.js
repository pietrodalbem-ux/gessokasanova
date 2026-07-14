// main.js - Gessokasanova Interactions

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Sticky Navbar & Glassmorphism on Scroll
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {    
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 2. Mobile Menu Toggle
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-link');

    mobileBtn.addEventListener('click', () => {
        navLinks.classList.toggle('mobile-active');
        // Toggle icon
        const icon = mobileBtn.querySelector('i');
        if (navLinks.classList.contains('mobile-active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // Close mobile menu on link click
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navLinks.classList.remove('mobile-active');
            const icon = mobileBtn.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        });
    });

    // 3. Scroll Reveal Animations (Intersection Observer)
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealOptions = {
        threshold: 0.15, // Trigger when 15% of element is visible
        rootMargin: "0px 0px -50px 0px" // Trigger slightly before it comes into view
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Stop observing once revealed
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });

    // 4. Smooth Scrolling for Anchor Links (Fallback if CSS scroll-behavior is not supported)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Offset for fixed navbar
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // 5. Dynamic Photo Gallery (Rotaciona a cada 3 minutos)
    const fetchAndRotatePhotos = async () => {
        try {
            let fotos = [];
            
            // 1ª Tentativa: Usar o arquivo PHP (Rápido e dinâmico)
            try {
                const response = await fetch('get_fotos.php?t=' + new Date().getTime());
                if (response.ok) {
                    const text = await response.text();
                    try {
                        fotos = JSON.parse(text);
                    } catch (e) {
                        console.warn("Resposta do PHP não é JSON válido.");
                    }
                }
            } catch (error) {
                console.warn("PHP falhou, usando fallback...");
            }
            
            // 2ª Tentativa (Fallback estático): Se o servidor não rodar PHP, busca pelas fotos .jpg dinamicamente via JS
            if (!fotos || fotos.length === 0) {
                console.log("Usando fallback de checagem JS...");
                let count = 1;
                while (count <= 100) { // Limite de segurança de 100 fotos para o fallback
                    try {
                        const testUrl = `fotos/${count}.jpg`;
                        const res = await fetch(testUrl, { method: 'HEAD' });
                        if (res.ok) {
                            fotos.push(testUrl);
                            count++;
                        } else {
                            break; // Parar quando não encontrar a próxima foto
                        }
                    } catch (e) {
                        break;
                    }
                }
            }

            if (fotos.length === 0) {
                // Se tudo falhar, tenta pelo menos as 6 primeiras fixas para não ficar branco
                fotos = ['fotos/1.jpg', 'fotos/2.jpg', 'fotos/3.jpg', 'fotos/4.jpg', 'fotos/5.jpg', 'fotos/6.jpg'];
            }

            const galleryImages = document.querySelectorAll('.dynamic-photo');
            if (galleryImages.length === 0) return;

            let availablePhotos = [...fotos];
            
            // Função para pegar foto aleatória e remover do pool
            const getNextPhoto = () => {
                if (availablePhotos.length === 0) {
                    availablePhotos = [...fotos]; // Recarrega o pool quando acabam
                }
                const randomIndex = Math.floor(Math.random() * availablePhotos.length);
                return availablePhotos.splice(randomIndex, 1)[0];
            };

            // Função para atualizar as imagens
            const updateImages = (withFade = true) => {
                galleryImages.forEach((img, index) => {
                    if (withFade) {
                        setTimeout(() => {
                            img.style.opacity = '0';
                            setTimeout(() => {
                                img.src = getNextPhoto();
                                img.onload = () => { img.style.opacity = '1'; };
                                setTimeout(() => { img.style.opacity = '1'; }, 500);
                            }, 500);
                        }, index * 200);
                    } else {
                        img.src = getNextPhoto();
                    }
                });
            };

            // Atualiza as fotos imediatamente ao abrir a página (sem fade, para não aparecerem as placeholders)
            updateImages(false);

            // Configura a rotação a cada 3 minutos (180000 ms)
            setInterval(() => updateImages(true), 3 * 60 * 1000); 

        } catch (error) {
            console.error('Erro ao carregar fotos:', error);
        }
    };

    fetchAndRotatePhotos();

    // 6. Atualizar Ano do Footer Automaticamente
    const currentYearElement = document.getElementById('current-year');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }
});
