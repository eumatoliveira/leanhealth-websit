/**
 * LeanHealth Animations
 * TextType + ScrollFloat - Vanilla JS with GSAP
 * @version 1.0.0
 */

// ============================================
// TEXTTYPE - Typing Animation Effect
// ============================================
class TextType {
    constructor(selector, options = {}) {
        this.element = typeof selector === 'string' 
            ? document.querySelector(selector) 
            : selector;
        
        if (!this.element) return;

        // Options
        this.texts = Array.isArray(options.text) ? options.text : [options.text || ''];
        this.typingSpeed = options.typingSpeed || 75;
        this.deletingSpeed = options.deletingSpeed || 50;
        this.pauseDuration = options.pauseDuration || 1500;
        this.loop = options.loop !== false;
        this.showCursor = options.showCursor !== false;
        this.cursorChar = options.cursorCharacter || '|';
        
        // State
        this.currentTextIndex = 0;
        this.currentCharIndex = 0;
        this.isDeleting = false;
        this.isPaused = false;

        // Check reduced motion
        this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        if (this.prefersReducedMotion) {
            this.element.textContent = this.texts[0];
            return;
        }

        this.init();
    }

    init() {
        // Create wrapper
        this.textSpan = document.createElement('span');
        this.textSpan.className = 'text-type-text';
        
        if (this.showCursor) {
            this.cursorSpan = document.createElement('span');
            this.cursorSpan.className = 'text-type-cursor';
            this.cursorSpan.textContent = this.cursorChar;
            this.cursorSpan.style.cssText = 'margin-left: 2px; animation: blink 1s step-end infinite;';
        }

        // Add CSS for cursor blink
        if (!document.getElementById('text-type-styles')) {
            const style = document.createElement('style');
            style.id = 'text-type-styles';
            style.textContent = `
                @keyframes blink {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0; }
                }
                .text-type-cursor {
                    font-weight: 100;
                }
            `;
            document.head.appendChild(style);
        }

        this.element.textContent = '';
        this.element.appendChild(this.textSpan);
        if (this.cursorSpan) this.element.appendChild(this.cursorSpan);

        this.type();
    }

    type() {
        const currentText = this.texts[this.currentTextIndex];
        
        if (this.isDeleting) {
            this.currentCharIndex--;
            this.textSpan.textContent = currentText.substring(0, this.currentCharIndex);
        } else {
            this.currentCharIndex++;
            this.textSpan.textContent = currentText.substring(0, this.currentCharIndex);
        }

        let delay = this.isDeleting ? this.deletingSpeed : this.typingSpeed;

        // Finished typing current word
        if (!this.isDeleting && this.currentCharIndex === currentText.length) {
            delay = this.pauseDuration;
            this.isDeleting = true;
        }
        // Finished deleting
        else if (this.isDeleting && this.currentCharIndex === 0) {
            this.isDeleting = false;
            this.currentTextIndex = (this.currentTextIndex + 1) % this.texts.length;
            
            if (!this.loop && this.currentTextIndex === 0) {
                this.currentTextIndex = this.texts.length - 1;
                this.textSpan.textContent = this.texts[this.currentTextIndex];
                return;
            }
            delay = 500;
        }

        setTimeout(() => this.type(), delay);
    }
}

// ============================================
// SCROLLFLOAT - Scroll-triggered Text Animation
// ============================================
class ScrollFloat {
    constructor(selector, options = {}) {
        this.elements = typeof selector === 'string'
            ? document.querySelectorAll(selector)
            : [selector];

        if (!this.elements.length) return;

        // Options
        this.animationDuration = options.animationDuration || 1;
        this.ease = options.ease || 'back.inOut(2)';
        this.scrollStart = options.scrollStart || 'center bottom+=50%';
        this.scrollEnd = options.scrollEnd || 'bottom bottom-=40%';
        this.stagger = options.stagger || 0.03;

        // Check reduced motion
        this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        if (this.prefersReducedMotion) return;

        // Check if GSAP is loaded
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
            console.warn('ScrollFloat: GSAP and ScrollTrigger are required');
            return;
        }

        gsap.registerPlugin(ScrollTrigger);
        this.init();
    }

    init() {
        this.elements.forEach(el => {
            const text = el.textContent.trim();
            el.innerHTML = '';
            el.style.overflow = 'hidden';

            // Create wrapper span
            const wrapper = document.createElement('span');
            wrapper.style.display = 'inline';

            // Split into words first, then characters
            const words = text.split(/(\s+)/); // Keep spaces as separate items
            
            words.forEach(word => {
                if (word.match(/^\s+$/)) {
                    // It's whitespace - add as-is
                    const space = document.createElement('span');
                    space.className = 'scroll-float-char';
                    space.style.display = 'inline-block';
                    space.innerHTML = '&nbsp;';
                    wrapper.appendChild(space);
                } else {
                    // It's a word - wrap chars in a word container
                    const wordWrapper = document.createElement('span');
                    wordWrapper.style.display = 'inline-block';
                    wordWrapper.style.whiteSpace = 'nowrap';
                    
                    word.split('').forEach(char => {
                        const span = document.createElement('span');
                        span.className = 'scroll-float-char';
                        span.style.display = 'inline-block';
                        span.textContent = char;
                        wordWrapper.appendChild(span);
                    });
                    
                    wrapper.appendChild(wordWrapper);
                }
            });

            el.appendChild(wrapper);

            // Animate
            const chars = el.querySelectorAll('.scroll-float-char');
            
            gsap.fromTo(chars, 
                {
                    opacity: 0,
                    yPercent: 120,
                    scaleY: 2.3,
                    scaleX: 0.7,
                    transformOrigin: '50% 0%'
                },
                {
                    duration: this.animationDuration,
                    ease: this.ease,
                    opacity: 1,
                    yPercent: 0,
                    scaleY: 1,
                    scaleX: 1,
                    stagger: this.stagger,
                    scrollTrigger: {
                        trigger: el,
                        start: this.scrollStart,
                        end: this.scrollEnd,
                        scrub: true
                    }
                }
            );
        });
    }
}

// ============================================
// AUTO-INIT ON DOM READY
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize TextType on hero
    const heroTextType = document.querySelector('[data-text-type]');
    if (heroTextType) {
        const texts = heroTextType.dataset.textTypeTexts 
            ? heroTextType.dataset.textTypeTexts.split('|')
            : ['Clínica', 'Gestão de Saúde', 'Operação'];
        
        new TextType(heroTextType, {
            text: texts,
            typingSpeed: 75,
            pauseDuration: 1500,
            showCursor: true,
            cursorCharacter: '|'
        });
    }

    // Initialize ScrollFloat on marked elements
    const scrollFloatElements = document.querySelectorAll('[data-scroll-float]');
    if (scrollFloatElements.length > 0) {
        new ScrollFloat('[data-scroll-float]', {
            animationDuration: 1,
            ease: 'back.inOut(2)',
            scrollStart: 'center bottom+=50%',
            scrollEnd: 'bottom bottom-=40%',
            stagger: 0.03
        });
    }

    // Initialize MagicBento on marked containers
    const magicBentoContainers = document.querySelectorAll('[data-magic-bento]');
    magicBentoContainers.forEach(container => {
        new MagicBento(container, {
            enableSpotlight: true,
            enableBorderGlow: true,
            enableTilt: true,
            enableMagnetism: true,
            enableParticles: true,
            clickEffect: true,
            glowColor: '124, 58, 237'
        });
    });
});

// ============================================
// MAGICBENTO - Interactive Card Effects
// ============================================
class MagicBento {
    constructor(container, options = {}) {
        this.container = container;
        if (!this.container) return;

        this.cards = this.container.querySelectorAll('[data-bento-card]');
        if (!this.cards.length) return;

        this.enableSpotlight = options.enableSpotlight !== false;
        this.enableBorderGlow = options.enableBorderGlow !== false;
        this.enableTilt = options.enableTilt !== false;
        this.enableMagnetism = options.enableMagnetism !== false;
        this.enableParticles = options.enableParticles !== false;
        this.clickEffect = options.clickEffect !== false;
        this.glowColor = options.glowColor || '124, 58, 237';
        this.spotlightRadius = options.spotlightRadius || 300;
        this.particleCount = options.particleCount || 6;

        this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (this.prefersReducedMotion) return;

        this.injectStyles();
        this.init();
    }

    injectStyles() {
        if (document.getElementById('magic-bento-styles')) return;
        const style = document.createElement('style');
        style.id = 'magic-bento-styles';
        style.textContent = `
            [data-bento-card] {
                --glow-x: 50%;
                --glow-y: 50%;
                --glow-intensity: 0;
                position: relative;
                transform-style: preserve-3d;
            }
            [data-bento-card]::before {
                content: '';
                position: absolute;
                inset: 0;
                padding: 2px;
                background: radial-gradient(300px circle at var(--glow-x) var(--glow-y),
                    rgba(124, 58, 237, calc(var(--glow-intensity) * 0.5)) 0%,
                    rgba(124, 58, 237, calc(var(--glow-intensity) * 0.2)) 40%,
                    transparent 70%);
                border-radius: inherit;
                -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
                -webkit-mask-composite: xor;
                mask-composite: exclude;
                pointer-events: none;
                z-index: 1;
            }
            .magic-particle {
                position: absolute;
                width: 4px;
                height: 4px;
                border-radius: 50%;
                background: rgba(124, 58, 237, 0.8);
                box-shadow: 0 0 6px rgba(124, 58, 237, 0.5);
                pointer-events: none;
                z-index: 10;
            }
        `;
        document.head.appendChild(style);
    }

    init() {
        if (this.enableSpotlight) this.createSpotlight();
        this.cards.forEach(card => this.setupCard(card));
        document.addEventListener('mousemove', this.handleMouseMove.bind(this));
    }

    createSpotlight() {
        this.spotlight = document.createElement('div');
        this.spotlight.style.cssText = `
            position: fixed;
            width: 500px;
            height: 500px;
            border-radius: 50%;
            pointer-events: none;
            background: radial-gradient(circle, rgba(${this.glowColor}, 0.08) 0%, transparent 60%);
            z-index: 9999;
            opacity: 0;
            transform: translate(-50%, -50%);
            mix-blend-mode: screen;
        `;
        document.body.appendChild(this.spotlight);
    }

    handleMouseMove(e) {
        if (this.spotlight) {
            const rect = this.container.getBoundingClientRect();
            const inside = e.clientX >= rect.left && e.clientX <= rect.right && 
                           e.clientY >= rect.top && e.clientY <= rect.bottom;
            this.spotlight.style.left = e.clientX + 'px';
            this.spotlight.style.top = e.clientY + 'px';
            gsap.to(this.spotlight, { opacity: inside ? 0.6 : 0, duration: 0.2 });
        }

        this.cards.forEach(card => {
            const rect = card.getBoundingClientRect();
            const relX = ((e.clientX - rect.left) / rect.width) * 100;
            const relY = ((e.clientY - rect.top) / rect.height) * 100;
            const dist = Math.hypot(e.clientX - (rect.left + rect.width/2), e.clientY - (rect.top + rect.height/2));
            const intensity = Math.max(0, 1 - dist / this.spotlightRadius);
            card.style.setProperty('--glow-x', `${relX}%`);
            card.style.setProperty('--glow-y', `${relY}%`);
            card.style.setProperty('--glow-intensity', intensity.toString());
        });
    }

    setupCard(card) {
        let particles = [];

        card.addEventListener('mouseenter', () => {
            if (this.enableParticles) this.spawnParticles(card, particles);
        });

        card.addEventListener('mouseleave', () => {
            this.clearParticles(particles);
            particles = [];
            if (this.enableTilt || this.enableMagnetism) {
                gsap.to(card, { rotateX: 0, rotateY: 0, x: 0, y: 0, duration: 0.3, ease: 'power2.out' });
            }
        });

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left, y = e.clientY - rect.top;
            const cx = rect.width / 2, cy = rect.height / 2;

            if (this.enableTilt) {
                gsap.to(card, { rotateX: ((y - cy) / cy) * -6, rotateY: ((x - cx) / cx) * 6, 
                    duration: 0.1, transformPerspective: 1000 });
            }
            if (this.enableMagnetism) {
                gsap.to(card, { x: (x - cx) * 0.02, y: (y - cy) * 0.02, duration: 0.2 });
            }
        });

        if (this.clickEffect) {
            card.addEventListener('click', (e) => this.createRipple(card, e));
        }
    }

    spawnParticles(card, particles) {
        const rect = card.getBoundingClientRect();
        for (let i = 0; i < this.particleCount; i++) {
            setTimeout(() => {
                const p = document.createElement('div');
                p.className = 'magic-particle';
                p.style.left = Math.random() * rect.width + 'px';
                p.style.top = Math.random() * rect.height + 'px';
                card.appendChild(p);
                particles.push(p);
                gsap.fromTo(p, { scale: 0, opacity: 0 }, { scale: 1, opacity: 0.8, duration: 0.3 });
                gsap.to(p, { x: (Math.random() - 0.5) * 40, y: (Math.random() - 0.5) * 40, 
                    duration: 2, repeat: -1, yoyo: true });
            }, i * 60);
        }
    }

    clearParticles(particles) {
        particles.forEach(p => gsap.to(p, { scale: 0, opacity: 0, duration: 0.2, onComplete: () => p.remove() }));
    }

    createRipple(card, e) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left, y = e.clientY - rect.top;
        const r = Math.max(Math.hypot(x, y), Math.hypot(x - rect.width, y), 
            Math.hypot(x, y - rect.height), Math.hypot(x - rect.width, y - rect.height));
        const ripple = document.createElement('div');
        ripple.style.cssText = `position: absolute; width: ${r*2}px; height: ${r*2}px; left: ${x-r}px; 
            top: ${y-r}px; border-radius: 50%; pointer-events: none; z-index: 100;
            background: radial-gradient(circle, rgba(${this.glowColor}, 0.2) 0%, transparent 70%);`;
        card.appendChild(ripple);
        gsap.fromTo(ripple, { scale: 0, opacity: 1 }, { scale: 1, opacity: 0, duration: 0.5, onComplete: () => ripple.remove() });
    }
}

// Export for manual use
window.TextType = TextType;
window.ScrollFloat = ScrollFloat;
window.MagicBento = MagicBento;

// ============================================
// ROI CALCULATOR - Interactive Calculator
// ============================================
class ROICalculator {
    constructor() {
        this.faturamentoSlider = document.getElementById('faturamentoSlider');
        this.desperdicioSlider = document.getElementById('desperdicioSlider');
        this.margemSlider = document.getElementById('margemSlider');
        
        this.faturamentoValue = document.getElementById('faturamentoValue');
        this.desperdicioValue = document.getElementById('desperdicioValue');
        this.margemValue = document.getElementById('margemValue');
        this.dinheiroNaMesa = document.getElementById('dinheiroNaMesa');
        this.novaMargemValue = document.getElementById('novaMargemValue');
        
        if (!this.faturamentoSlider) return;
        
        this.init();
    }
    
    init() {
        // Add event listeners
        this.faturamentoSlider.addEventListener('input', () => this.calculate());
        this.desperdicioSlider.addEventListener('input', () => this.calculate());
        this.margemSlider.addEventListener('input', () => this.calculate());
        
        // Initial calculation
        this.calculate();
    }
    
    formatCurrency(value) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
    }
    
    calculate() {
        const faturamento = parseInt(this.faturamentoSlider.value);
        const desperdicio = parseInt(this.desperdicioSlider.value);
        const margem = parseInt(this.margemSlider.value);
        
        // Update display values
        this.faturamentoValue.textContent = this.formatCurrency(faturamento);
        this.desperdicioValue.textContent = `${desperdicio}%`;
        this.margemValue.textContent = `${margem}%`;
        
        // Calculate "Dinheiro na Mesa" (annual waste recovery)
        // GLX method recovers ~60% of operational waste
        const wasteRecoveryRate = 0.6;
        const monthlyWaste = faturamento * (desperdicio / 100);
        const annualRecovery = monthlyWaste * wasteRecoveryRate * 12;
        
        this.dinheiroNaMesa.textContent = this.formatCurrency(annualRecovery);
        
        // Calculate new projected margin
        // New margin = current margin + (recovered waste as % of revenue)
        const recoveredMarginPoints = (monthlyWaste * wasteRecoveryRate / faturamento) * 100;
        const newMargin = margem + recoveredMarginPoints;
        
        this.novaMargemValue.textContent = `${newMargin.toFixed(1)}%`;
        
        // Animate the value changes
        if (typeof gsap !== 'undefined') {
            gsap.fromTo(this.dinheiroNaMesa, 
                { scale: 1.1, color: '#22c55e' }, 
                { scale: 1, color: '#ffffff', duration: 0.3 }
            );
            gsap.fromTo(this.novaMargemValue, 
                { scale: 1.1 }, 
                { scale: 1, duration: 0.3 }
            );
        }
    }
}

// Initialize ROI Calculator on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    new ROICalculator();
});

window.ROICalculator = ROICalculator;

// ============================================
// LUNA CHATBOT - GLX AI Assistant
// ============================================
class LunaChatbot {
    constructor() {
        this.chatToggle = document.getElementById('chatToggle');
        this.chatWindow = document.getElementById('chatWindow');
        this.chatClose = document.getElementById('chatClose');
        this.chatInput = document.getElementById('chatInput');
        this.chatSend = document.getElementById('chatSend');
        this.chatMessages = document.getElementById('chatMessages');
        this.chatIcon = document.getElementById('chatIcon');
        
        if (!this.chatToggle) return;
        
        this.isOpen = false;
        this.init();
    }
    
    init() {
        // Toggle chat
        this.chatToggle.addEventListener('click', () => this.toggle());
        this.chatClose.addEventListener('click', () => this.close());
        
        // Send message
        this.chatSend.addEventListener('click', () => this.sendMessage());
        this.chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
    }
    
    toggle() {
        this.isOpen = !this.isOpen;
        if (this.isOpen) {
            this.chatWindow.classList.remove('scale-0', 'opacity-0');
            this.chatWindow.classList.add('scale-100', 'opacity-100');
            this.chatIcon.textContent = 'close';
            this.chatInput.focus();
        } else {
            this.close();
        }
    }
    
    close() {
        this.isOpen = false;
        this.chatWindow.classList.add('scale-0', 'opacity-0');
        this.chatWindow.classList.remove('scale-100', 'opacity-100');
        this.chatIcon.textContent = 'chat';
    }
    
    sendMessage() {
        const message = this.chatInput.value.trim();
        if (!message) return;
        
        // Add user message
        this.addMessage(message, 'user');
        this.chatInput.value = '';
        
        // Show typing indicator
        this.showTyping();
        
        // Get AI response after delay
        setTimeout(() => {
            this.hideTyping();
            const response = this.getAIResponse(message);
            this.addMessage(response, 'bot');
        }, 1000 + Math.random() * 1000);
    }
    
    addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'flex gap-2' + (sender === 'user' ? ' justify-end' : '');
        
        if (sender === 'user') {
            messageDiv.innerHTML = `
                <div class="bg-primary text-white rounded-2xl rounded-tr-sm p-3 shadow-sm max-w-[80%]">
                    <p class="text-sm">${text}</p>
                </div>
            `;
        } else {
            messageDiv.innerHTML = `
                <div class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm shrink-0">🌙</div>
                <div class="bg-white rounded-2xl rounded-tl-sm p-3 shadow-sm max-w-[80%]">
                    <p class="text-sm text-slate-700">${text}</p>
                </div>
            `;
        }
        
        this.chatMessages.appendChild(messageDiv);
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }
    
    showTyping() {
        const typing = document.createElement('div');
        typing.id = 'typingIndicator';
        typing.className = 'flex gap-2';
        typing.innerHTML = `
            <div class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm shrink-0">🌙</div>
            <div class="bg-white rounded-2xl rounded-tl-sm p-3 shadow-sm">
                <div class="flex gap-1">
                    <span class="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style="animation-delay: 0ms"></span>
                    <span class="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style="animation-delay: 150ms"></span>
                    <span class="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style="animation-delay: 300ms"></span>
                </div>
            </div>
        `;
        this.chatMessages.appendChild(typing);
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }
    
    hideTyping() {
        const typing = document.getElementById('typingIndicator');
        if (typing) typing.remove();
    }
    
    getAIResponse(message) {
        const msg = message.toLowerCase();
        
        // ============================================
        // CONFIGURATION - EDIT THESE LINKS:
        // ============================================
        // TODO: Replace with your actual Typeform URL for scheduling meetings
        const TYPEFORM_URL = 'https://glxpartners.typeform.com/agendar'; 
        
        // TODO: Replace with your actual support email
        const EMAIL_SUPORTE = 'contato@glxpartners.com.br';
        // ============================================
        
        // MEETING/SCHEDULING - Primary conversion goal
        if (msg.includes('agendar') || msg.includes('reunião') || msg.includes('marcar') || 
            msg.includes('quero') || msg.includes('sim') || msg.includes('vamos') ||
            msg.includes('interesse') || msg.includes('começar') || msg.includes('iniciar')) {
            return `🚀 Excelente decisão! Vamos transformar sua clínica juntos!<br><br>
                👉 <a href="${TYPEFORM_URL}" target="_blank" class="bg-primary text-white px-3 py-1 rounded-full text-xs font-bold hover:bg-violet-600 inline-block mt-2">AGENDAR REUNIÃO GRATUITA</a><br><br>
                É rápido, só 2 minutinhos! Um especialista entrará em contato em até 24h. 💜`;
        }
        
        // DOUBTS/QUESTIONS - Send to email
        if (msg.includes('dúvida') || msg.includes('duvida') || msg.includes('ajuda') || 
            msg.includes('e-mail') || msg.includes('email') || msg.includes('suporte') ||
            msg.includes('falar com') || msg.includes('humano') || msg.includes('atendente')) {
            return `📧 Sem problemas! Nossa equipe está pronta para te ajudar:<br><br>
                ✉️ <a href="mailto:${EMAIL_SUPORTE}" class="text-primary underline font-bold">${EMAIL_SUPORTE}</a><br><br>
                Ou se preferir, posso te ajudar agora mesmo! Me conta: qual é sua principal dificuldade na clínica hoje?`;
        }
        
        // PRICE OBJECTION - Handle and redirect to value
        if (msg.includes('preço') || msg.includes('caro') || msg.includes('quanto custa') || 
            msg.includes('valor') || msg.includes('investimento') || msg.includes('orçamento') ||
            msg.includes('custo') || msg.includes('pagar')) {
            return `� Entendo sua preocupação com investimento! Mas deixa eu te mostrar algo importante:<br><br>
                Nossa <a href="#calculadora" class="text-primary underline">Calculadora de ROI</a> mostra que clínicas perdem em média <strong>15-25% do faturamento</strong> com desperdícios ocultos.<br><br>
                📊 Exemplo: Uma clínica com R$200k/mês deixa <strong>R$360.000/ano na mesa</strong>!<br><br>
                O investimento na GLX se paga em <strong>3-4 meses</strong>. Quer ver os números da SUA clínica?<br><br>
                👉 <a href="${TYPEFORM_URL}" target="_blank" class="text-primary underline font-bold">Agendar análise gratuita</a>`;
        }
        
        // TIME OBJECTION - Handle and show quick results
        if (msg.includes('tempo') || msg.includes('ocupado') || msg.includes('depois') ||
            msg.includes('agora não') || msg.includes('mais tarde') || msg.includes('pensar')) {
            return `⏰ Entendo! Gestores de clínica são muito ocupados mesmo. Por isso nossa metodologia é <strong>prática e focada</strong>:<br><br>
                ✅ Diagnóstico inicial: 30 minutos<br>
                ✅ Primeiros resultados: 4 semanas<br>
                ✅ ROI positivo: 3-4 meses<br><br>
                Que tal uma conversa rápida de 15 minutos para entender se faz sentido para você?<br><br>
                👉 <a href="${TYPEFORM_URL}" target="_blank" class="text-primary underline font-bold">Agendar conversa rápida</a>`;
        }
        
        // TRUST/CREDIBILITY OBJECTION
        if (msg.includes('funciona') || msg.includes('resultado') || msg.includes('prova') ||
            msg.includes('garantia') || msg.includes('confia') || msg.includes('certeza')) {
            return `� Ótima pergunta! Nossos resultados falam por si:<br><br>
                🎯 <strong>+87%</strong> de eficiência operacional<br>
                💰 <strong>-30%</strong> de custos desnecessários<br>
                😊 <strong>+95%</strong> satisfação do paciente<br>
                ⏱️ <strong>50%</strong> menos tempo de espera<br><br>
                A metodologia GLX é baseada em <strong>Lean Six Sigma</strong>, usada pelas maiores empresas do mundo!<br><br>
                Quer ver como isso se aplica na sua clínica?<br>
                👉 <a href="${TYPEFORM_URL}" target="_blank" class="text-primary underline font-bold">Agendar demonstração</a>`;
        }
        
        // METHODOLOGY QUESTION
        if (msg.includes('lean') || msg.includes('six sigma') || msg.includes('metodologia') || msg.includes('método') || msg.includes('como funciona')) {
            return `🎯 A metodologia <strong>GLX 4.0</strong> combina o melhor de:<br><br>
                📐 <strong>Lean Six Sigma</strong> - eliminar desperdícios<br>
                🖥️ <strong>Tecnologia</strong> - automação inteligente<br>
                💼 <strong>UX Estratégico</strong> - jornada do paciente<br>
                📊 <strong>BI</strong> - dados para decisões<br><br>
                Resultado? Sua clínica operando com <strong>máxima eficiência</strong> e <strong>margens maiores</strong>.<br><br>
                Quer entender como isso funciona na prática?<br>
                👉 <a href="${TYPEFORM_URL}" target="_blank" class="text-primary underline font-bold">Agendar demonstração</a>`;
        }
        
        // SERVICES QUESTION
        if (msg.includes('serviço') || msg.includes('oferece') || msg.includes('faz') || msg.includes('entrega')) {
            return `🏥 A GLX Partners transforma clínicas com:<br><br>
                🎨 <strong>Posicionamento de Marca</strong> - diferenciação no mercado<br>
                🛤️ <strong>Jornada do Paciente</strong> - experiência impecável<br>
                💻 <strong>Software de Gestão</strong> - otimização operacional<br>
                💰 <strong>Arquitetura de Receita</strong> - novas fontes de lucro<br>
                📊 <strong>Dashboards de BI</strong> - visão 360° do negócio<br><br>
                Qual dessas áreas mais precisa de atenção na sua clínica?<br><br>
                Conte-me mais, ou <a href="${TYPEFORM_URL}" target="_blank" class="text-primary underline font-bold">agende uma análise gratuita</a>!`;
        }
        
        // CALCULATOR/ROI QUESTION
        if (msg.includes('calculadora') || msg.includes('roi') || msg.includes('retorno') || msg.includes('impacto')) {
            return `📊 A <strong>Calculadora de Impacto</strong> mostra exatamente quanto dinheiro está "escapando" da sua clínica!<br><br>
                Experimente agora: <a href="#calculadora" class="text-primary underline">Ver Calculadora</a><br><br>
                <strong>Mas os números reais são ainda melhores!</strong> Na análise personalizada, encontramos oportunidades que a calculadora genérica não mostra.<br><br>
                👉 <a href="${TYPEFORM_URL}" target="_blank" class="text-primary underline font-bold">Agendar análise personalizada</a>`;
        }
        
        // GREETING
        if (msg.includes('olá') || msg.includes('oi') || msg.includes('hey') || msg.includes('boa') || msg.includes('ola')) {
            return `Olá! 😊 Sou a <strong>Luna</strong>, assistente virtual da GLX Partners!<br><br>
                Estou aqui para te ajudar a descobrir como <strong>aumentar a margem de lucro</strong> da sua clínica.<br><br>
                Me conta: qual é o maior desafio que você enfrenta hoje na gestão?`;
        }
        
        // THANKS
        if (msg.includes('obrigad')) {
            return `Por nada! 💜<br><br>
                Lembre-se: cada dia sem otimização é dinheiro deixado na mesa! 💸<br><br>
                Quando quiser transformar sua clínica, estou aqui:<br>
                👉 <a href="${TYPEFORM_URL}" target="_blank" class="text-primary underline font-bold">Agendar reunião</a>`;
        }
        
        // NEGATIVE/REJECTION
        if (msg.includes('não') || msg.includes('nao') || msg.includes('nunca') || msg.includes('negativo')) {
            return `Sem problemas! 😊 Posso te ajudar de outra forma?<br><br>
                Se tiver qualquer dúvida técnica, nosso time está disponível:<br>
                ✉️ <a href="mailto:${EMAIL_SUPORTE}" class="text-primary underline">${EMAIL_SUPORTE}</a><br><br>
                Ou explore nossa <a href="#calculadora" class="text-primary underline">Calculadora de Impacto</a> para ver o potencial da sua clínica!`;
        }
        
        // DEFAULT - Always guide to meeting
        return `Interessante! 🤔<br><br>
            Para te dar a resposta mais precisa, seria ideal conversar com um especialista da GLX sobre o cenário da sua clínica.<br><br>
            A reunião é <strong>gratuita, sem compromisso</strong>, e você já sai com insights valiosos!<br><br>
            👉 <a href="${TYPEFORM_URL}" target="_blank" class="bg-primary text-white px-3 py-1 rounded-full text-xs font-bold hover:bg-violet-600 inline-block">AGENDAR AGORA</a><br><br>
            Ou me conta mais sobre sua dúvida que tento te ajudar! 💜`;
    }
}

// Initialize Luna Chatbot
document.addEventListener('DOMContentLoaded', () => {
    new LunaChatbot();
});

window.LunaChatbot = LunaChatbot;

// ============================================
// SCROLL TO TOP BUTTON
// ============================================
class ScrollToTop {
    constructor() {
        this.button = document.getElementById('scrollToTop');
        if (!this.button) return;
        
        this.init();
    }
    
    init() {
        // Show/hide on scroll
        window.addEventListener('scroll', () => this.handleScroll());
        
        // Smooth scroll to top on click
        this.button.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    handleScroll() {
        if (window.scrollY > 300) {
            this.button.classList.remove('opacity-0', 'translate-y-10', 'pointer-events-none');
            this.button.classList.add('opacity-100', 'translate-y-0', 'pointer-events-auto');
        } else {
            this.button.classList.add('opacity-0', 'translate-y-10', 'pointer-events-none');
            this.button.classList.remove('opacity-100', 'translate-y-0', 'pointer-events-auto');
        }
    }
}

// Initialize ScrollToTop
document.addEventListener('DOMContentLoaded', () => {
    new ScrollToTop();
});

window.ScrollToTop = ScrollToTop;

// ============================================
// MOBILE MENU HANDLER
// ============================================
class MobileMenu {
    constructor() {
        this.menuBtn = document.getElementById('mobileMenuBtn');
        this.menu = document.getElementById('mobileMenu');
        
        if (!this.menuBtn || !this.menu) return;
        
        this.init();
    }
    
    init() {
        // Toggle menu
        this.menuBtn.addEventListener('click', () => {
            this.menu.classList.toggle('hidden');
        });
        
        // Close menu when clicking links
        const menuLinks = this.menu.querySelectorAll('a');
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.menu.classList.add('hidden');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.menuBtn.contains(e.target) && !this.menu.contains(e.target)) {
                this.menu.classList.add('hidden');
            }
        });
    }
}

// Initialize Mobile Menu
document.addEventListener('DOMContentLoaded', () => {
    new MobileMenu();
});

window.MobileMenu = MobileMenu;
