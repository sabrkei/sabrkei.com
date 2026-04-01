const { createApp, ref, reactive, nextTick, onMounted, onUnmounted } = Vue;

createApp({
  setup() {
    const activeSection = ref(null);
    let lastFocusedElement = null;

    const VALID_SECTIONS = ['portfolio', 'about', 'stackcv', 'contact'];

    const openSection = (name) => {
      lastFocusedElement = document.activeElement;
      activeSection.value = name;
      history.pushState(null, '', '/' + name);
      nextTick(() => document.querySelector('.back-btn')?.focus());
    };

    const goHome = () => {
      activeSection.value = null;
      history.pushState(null, '', '/');
      nextTick(() => lastFocusedElement?.focus());
    };

    const onKeydown = (e) => {
      if (e.key === 'Escape' && activeSection.value) goHome();
    };

    const onPopState = () => {
      const path = window.location.pathname.slice(1);
      const hash = window.location.hash.slice(1);
      const section = VALID_SECTIONS.includes(path) ? path
                    : VALID_SECTIONS.includes(hash) ? hash
                    : null;
      if (section) {
        activeSection.value = section;
        if (hash) history.replaceState(null, '', '/' + section);
        nextTick(() => document.querySelector('.back-btn')?.focus());
      } else {
        activeSection.value = null;
      }
    };

    onMounted(() => {
      window.addEventListener('keydown', onKeydown);
      window.addEventListener('popstate', onPopState);
      const path = window.location.pathname.slice(1);
      const hash = window.location.hash.slice(1);
      const section = VALID_SECTIONS.includes(path) ? path
                    : VALID_SECTIONS.includes(hash) ? hash
                    : null;
      if (section) {
        activeSection.value = section;
        if (hash) history.replaceState(null, '', '/' + section);
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
    const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xjgywnje';
    let formStatusTimeout = null;

    // Project data
    const DI = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons';

    const personalProjects = ref([
      {
        title: 'The Daily Grind',
        description: 'First HTML/CSS project focusing on layout.',
        image: 'images/thedailygrindlogo.webp',
        link: 'https://github.com/sabrkei/the-daily-grind',
        liveUrl: 'https://sabrkei.github.io/the-daily-grind',
        stack: [
          { name: 'HTML5',  icon: `${DI}/html5/html5-original.svg` },
          { name: 'CSS3',   icon: `${DI}/css3/css3-original.svg` },
        ],
      },
      {
        title: 'United by Sound',
        description: 'UX/UI group project exploring community music.',
        image: 'images/unitedbysound.webp',
        link: 'https://github.com/sabrkei/united-by-sound',
        liveUrl: 'https://www.figma.com/proto/vZKmLu3fBcpQJ06vfaQ8Lb/Festival-projekt?node-id=441-627&starting-point-node-id=441%3A627&t=yLvrFnAjrCLXzmut-1',
        stack: [
          { name: 'Figma', icon: `${DI}/figma/figma-original.svg` },
        ],
      },
      {
        title: 'Football Stats Hub',
        description: 'Native JS API project comparing football teams.',
        image: 'images/footballstatshublogo.webp',
        link: 'https://github.com/sabrkei/football-stats-hub',
        liveUrl: 'https://sabrkei.github.io/football-stats-hub',
        stack: [
          { name: 'JavaScript', icon: `${DI}/javascript/javascript-original.svg` },
          { name: 'HTML5',      icon: `${DI}/html5/html5-original.svg` },
          { name: 'CSS3',       icon: `${DI}/css3/css3-original.svg` },
        ],
      },
      {
        title: 'Historical Currency Exchange Rates',
        description: 'Vue router project fetching historical exchange rates.',
        image: 'images/currencyexchange.webp',
        link: 'https://github.com/sabrkei/currencyexchange',
        liveUrl: 'https://sabrkei.github.io/currencyexchange',
        stack: [
          { name: 'Vue.js',     icon: `${DI}/vuejs/vuejs-original.svg` },
          { name: 'JavaScript', icon: `${DI}/javascript/javascript-original.svg` },
        ],
      },
      {
        title: 'TripLingo — Agil Group Project',
        description: 'Group project: a language learning web app built with Vue 3 and Vite.',
        image: 'https://raw.githubusercontent.com/mandys-k/Grupp5/main/public/triplingofavicon.png',
        link: 'https://github.com/mandys-k/Grupp5',
        liveUrl: 'https://mandys-k.github.io/Grupp5/#/',
        stack: [
          { name: 'Vue.js',     icon: `${DI}/vuejs/vuejs-original.svg` },
          { name: 'Vite',       icon: `${DI}/vite/vite-original.svg` },
          { name: 'Bootstrap',  icon: `${DI}/bootstrap/bootstrap-original.svg` },
        ],
      },
    ]);

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
      activeSection,
      openSection,
      goHome,
      personalProjects,
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
