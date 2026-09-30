const { createApp, ref, reactive, nextTick, onMounted, onUnmounted } = Vue;

createApp({
  setup() {
    const activeSection = ref(null);
    let lastFocusedElement = null;

    const VALID_SECTIONS = ['portfolio', 'about', 'stackcv', 'contact'];

    // Theme (initial value is set on <html> by the inline script in <head>)
    const isDark = ref(document.documentElement.getAttribute('data-theme') === 'dark');

    const toggleTheme = () => {
      isDark.value = !isDark.value;
      const theme = isDark.value ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', theme);
      try { localStorage.setItem('theme', theme); } catch {}
    };

    // About video: skip autoplay for reduced-motion users, and always offer pause/play (WCAG 2.2.2)
    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    const aboutVideo = ref(null);
    const videoPaused = ref(prefersReducedMotion);

    const toggleVideo = () => {
      const video = aboutVideo.value;
      if (!video) return;
      if (video.paused) video.play().catch(() => {});
      else video.pause();
    };

    const openSection = (name) => {
      lastFocusedElement = document.activeElement;
      activeSection.value = name;
      history.pushState(null, '', name);
      nextTick(() => document.querySelector('.back-btn')?.focus());
    };

    const goHome = () => {
      activeSection.value = null;
      history.pushState(null, '', './');
      nextTick(() => lastFocusedElement?.focus());
    };

    const onKeydown = (e) => {
      if (e.key === 'Escape' && activeSection.value) goHome();
    };

    const getPathSection = () => {
      const segments = window.location.pathname.split('/').filter(Boolean);
      return segments[segments.length - 1] || '';
    };

    const onPopState = () => {
      const path = getPathSection();
      const hash = window.location.hash.slice(1);
      const section = VALID_SECTIONS.includes(path) ? path
                    : VALID_SECTIONS.includes(hash) ? hash
                    : null;
      if (section) {
        activeSection.value = section;
        if (hash) history.replaceState(null, '', section);
        nextTick(() => document.querySelector('.back-btn')?.focus());
      } else {
        activeSection.value = null;
      }
    };

    onMounted(() => {
      window.addEventListener('keydown', onKeydown);
      window.addEventListener('popstate', onPopState);
      const path = getPathSection();
      const hash = window.location.hash.slice(1);
      const section = VALID_SECTIONS.includes(path) ? path
                    : VALID_SECTIONS.includes(hash) ? hash
                    : null;
      if (section) {
        activeSection.value = section;
        if (hash) history.replaceState(null, '', section);
      }
    });

    onUnmounted(() => {
      window.removeEventListener('keydown', onKeydown);
      window.removeEventListener('popstate', onPopState);
    });

    // Form state
    const formData = reactive({ name: '', email: '', message: '' });
    const formLoading = ref(false);
    const formStatus = reactive({ type: '', message: '' });
    const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mlgozolk';
    let formStatusTimeout = null;

    // Project data
    const DI = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons';

    const siteBuilds = ref([
      {
        title: 'Dance Spectacular',
        description: 'dancespectacular.us — Dance event in Clearwater, Florida',
        mockup: 'images/mockups/dsmockup.png',
        link: 'https://dancespectacular.us',
        stack: [
          { name: 'HTML5',      icon: `${DI}/html5/html5-original.svg` },
          { name: 'CSS3',       icon: `${DI}/css3/css3-original.svg` },
          { name: 'JavaScript', icon: `${DI}/javascript/javascript-original.svg` },
        ],
      },
      {
        title: 'LA Survey',
        description: 'la-survey.se — LA Survey specializes in high-resolution documentation of complex underwater structures',
        mockup: 'images/mockups/lamockup.png',
        link: 'https://la-survey.se',
        stack: [
          { name: 'HTML5',      icon: `${DI}/html5/html5-original.svg` },
          { name: 'CSS3',       icon: `${DI}/css3/css3-original.svg` },
          { name: 'JavaScript', icon: `${DI}/javascript/javascript-original.svg` },
        ],
      },
      {
        title: 'Locksafe',
        description: 'locksafe.se — Swedish security company',
        mockup: 'images/mockups/lsmockup.png',
        link: 'https://locksafe.se',
        stack: [
          { name: 'HTML5',      icon: `${DI}/html5/html5-original.svg` },
          { name: 'CSS3',       icon: `${DI}/css3/css3-original.svg` },
          { name: 'JavaScript', icon: `${DI}/javascript/javascript-original.svg` },
        ],
      },
    ]);

    const npmBuilds = ref([
      {
        title: 'g-client-handover',
        description: 'A CLI tool for generating structured client handover documents for web projects.',
        image: 'images/g-client-handover.webp',
        link: 'https://www.npmjs.com/package/g-client-handover',
        repo: 'https://github.com/sabrkei/gemini-client-handover',
        npmCommand: 'npx g-client-handover',
        stack: [
          { name: 'Node.js',    icon: `${DI}/nodejs/nodejs-original.svg` },
          { name: 'JavaScript', icon: `${DI}/javascript/javascript-original.svg` },
        ],
      },
    ]);

    // Copy command state
    const copiedCmd = ref(null);

    const copyCommand = async (cmd) => {
      try {
        await navigator.clipboard.writeText(cmd);
        copiedCmd.value = cmd;
        setTimeout(() => { copiedCmd.value = null; }, 2000);
      } catch {
        // fallback: select a temp textarea
        const el = document.createElement('textarea');
        el.value = cmd;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        copiedCmd.value = cmd;
        setTimeout(() => { copiedCmd.value = null; }, 2000);
      }
    };

    // Form submission
    const submitForm = async () => {
      if (formStatusTimeout) clearTimeout(formStatusTimeout);
      formStatus.type = '';
      formStatus.message = '';
      formLoading.value = true;

      try {
        const response = await fetch(FORMSPREE_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(formData),
        });
        const data = await response.json();

        if (response.ok) {
          formStatus.type = 'success';
          formStatus.message = "Message sent successfully! I'll get back to you soon.";
          Object.assign(formData, { name: '', email: '', message: '' });
          formStatusTimeout = setTimeout(() => {
            formStatus.type = '';
            formStatus.message = '';
          }, 5000);
        } else {
          formStatus.type = 'error';
          formStatus.message = data.errors?.[0]?.message || 'Failed to send message. Please try again.';
        }
      } catch {
        formStatus.type = 'error';
        formStatus.message = 'Network error. Please check your connection and try again.';
      } finally {
        formLoading.value = false;
      }
    };

    return {
      isDark,
      toggleTheme,
      prefersReducedMotion,
      aboutVideo,
      videoPaused,
      toggleVideo,
      activeSection,
      openSection,
      goHome,
      siteBuilds,
      npmBuilds,
      formData,
      formLoading,
      formStatus,
      submitForm,
      copiedCmd,
      copyCommand,
    };
  },
}).mount('#app');
