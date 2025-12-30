# 🏥 LeanHealth Website

Website institucional da **LeanHealth** - Soluções em Gestão de Saúde.

![LeanHealth](img/glx-logo.png)

---

## 🚀 Tecnologias

| Tecnologia | Uso |
|------------|-----|
| **HTML5** | Estrutura semântica |
| **CSS3** | Estilização e animações |
| **JavaScript** | Interatividade e efeitos |
| **GSAP** | Animações avançadas |
| **OGL** | WebGL shaders (Aurora) |

---

## ✨ Animações Implementadas

### 1. TextType (Hero Section)
- Palavras alternando: `Clínica` → `Gestão de Saúde` → `Operação`
- Cursor piscante `|`

### 2. ScrollFloat (Títulos de Seção)
- **"Crescimento acelerado com resultados mensuráveis"**
- **"Veja como nós evoluímos a sua gestão"**
- **"Resultados que geramos para nossos clientes"**
- Letras flutuam ao scroll, com quebra natural entre palavras

### 3. MagicBento (Cards de Serviços)
| Efeito | Descrição |
|--------|-----------|
| ✨ Partículas | Flutuantes no hover |
| 💡 Spotlight | Roxo seguindo o mouse |
| 🔮 Border Glow | Brilho nas bordas dos cards |
| 🎯 Tilt 3D | Inclinação 3D interativa |
| 🧲 Magnetismo | Atração magnética |
| 💥 Ripple | Ondulação no click |

---

## 🌌 Aurora Animation - Plano de Implementação

### 🎯 Objetivo
Adicionar efeito **Aurora Boreal** (WebGL shader) nas seções de CTA do site.

### 📍 Locais de Implementação

#### 1. CTA Banner (Prioridade Alta)
**Seção:** "Acelere os seus resultados com a LeanHealth"
- Background animado com Aurora
- Cores: `#7c3aed` (roxo), `#ffffff` (branco), `#dccbfa` (lilás)

#### 2. Footer CTA (Opcional)
**Seção final** com "Acelere os seus resultados com a LeanHealth"
- Mesmo efeito para consistência visual

### 🛠️ Arquitetura Técnica

#### Dependência
```html
<script src="https://unpkg.com/ogl@1.0.11/dist/ogl.mjs" type="module"></script>
```

#### js/aurora.js
- Classe `Aurora` standalone (sem React)
- WebGL setup com OGL
- GLSL shaders para simplex noise
- Auto-resize handler
- Cleanup adequado

### ⚠️ Considerações de Performance

1. **GPU-accelerated** - Usa WebGL nativo
2. **requestAnimationFrame** - Sync com refresh rate
3. **Fallback** - Gradient CSS se WebGL não disponível
4. **prefers-reduced-motion** - Pausa animação

### ✅ Checklist Aurora
- [ ] Criar aurora.js com classe vanilla JS
- [ ] Adicionar OGL CDN ao index.html
- [ ] Adicionar container na seção CTA
- [ ] Testar no browser
- [ ] Verificar fallback

---

## 📁 Estrutura do Projeto

```
leanhealth-website/
├── index.html          # Página principal
├── thank-you.html      # Página de agradecimento
├── css/
│   └── styles.css      # Estilos globais
├── js/
│   └── animations.js   # TextType, ScrollFloat, MagicBento
└── img/
    ├── glx-logo.jpg
    └── glx-logo.png
```

---

## 🛠️ Arquivos Modificados

| Arquivo | Mudança |
|---------|---------|
| `js/animations.js` | Criado: TextType, ScrollFloat, MagicBento |
| `index.html` | GSAP CDN + data attributes |

---

## ✅ Validações

| Teste | Status |
|-------|--------|
| TextType animando | ✅ |
| ScrollFloat sem quebra de palavra | ✅ |
| MagicBento spotlight | ✅ |
| MagicBento partículas | ✅ |
| MagicBento tilt | ✅ |
| MagicBento ripple | ✅ |
| Sem erros de console | ✅ |

---

## 🚀 Como Executar

1. Clone o repositório:
```bash
git clone https://github.com/eumatoliveira/leanhealth-websit.git
```

2. Abra o `index.html` no navegador ou use um servidor local:
```bash
npx serve .
```

---

## 📄 Licença

© 2025 LeanHealth. Todos os direitos reservados.

---

**Desenvolvido com ❤️ por GLX Partners**
