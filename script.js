// ==========================================
// 1. التحكم في القائمة الجانبية (Sidebar) مع إغلاق تلقائي
// ==========================================
const menuBtn = document.getElementById('menuBtn');
const closeBtn = document.getElementById('closeBtn');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');
const sidebarLinks = document.querySelectorAll('.sidebar ul li a');

function toggleMenu() {
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
}

if (menuBtn) menuBtn.addEventListener('click', toggleMenu);
if (closeBtn) closeBtn.addEventListener('click', toggleMenu);
if (overlay) overlay.addEventListener('click', toggleMenu);

sidebarLinks.forEach(link => {
    link.addEventListener('click', () => {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
    });
});

// ==========================================
// 2. التحكم في الأسئلة الشائعة (FAQ Accordion)
// ==========================================
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (question) {
        question.addEventListener('click', () => {
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            item.classList.toggle('active');
        });
    }
});

// ==========================================
// 3. تأثيرات ظهور الأقسام بسلاسة أثناء التمرير (Scroll Reveal)
// ==========================================
window.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section');
    
    sections.forEach(sec => {
        sec.style.opacity = '0';
        sec.style.transform = 'translateY(25px)';
        sec.style.transition = 'opacity 0.7s ease-out, transform 0.7s ease-out';
    });

    const checkSections = () => {
        const triggerBottom = window.innerHeight * 0.85;
        sections.forEach(sec => {
            const secTop = sec.getBoundingClientRect().top;
            if (secTop < triggerBottom) {
                sec.style.opacity = '1';
                sec.style.transform = 'translateY(0)';
            }
        });
    };

    checkSections();
    window.addEventListener('scroll', checkSections);

    // ==========================================
    // 4. تأثير تفاعلي للكبسولات العائمة فوق الصورة الرئيسية (Floating Badges Parallax/Hover)
    // ==========================================
    const showcaseCard = document.querySelector('.material-preview-card');
    if (showcaseCard) {
        showcaseCard.addEventListener('mousemove', (e) => {
            const rect = showcaseCard.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            // تحريك خفيف للصورة لإعطاء عمق ثلاثي الأبعاد (3D Effect)
            showcaseCard.style.transform = `perspective(1000px) rotateY(${x * 0.01}deg) rotateX(${-y * 0.01}deg) translateY(-4px)`;
        });

        showcaseCard.addEventListener('mouseleave', () => {
            showcaseCard.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) translateY(0)';
            showcaseCard.style.transition = 'transform 0.5s ease';
        });
        
        showcaseCard.addEventListener('mouseenter', () => {
            showcaseCard.style.transition = 'none';
        });
    }
});
