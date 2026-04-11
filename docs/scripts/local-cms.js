(function (global) {
  "use strict";

  const STORAGE_KEY = "sema-local-cms-v1";
  const CATEGORY_LABELS = {
    onam: "Onam",
    boat: "Boat Race",
    christmas: "Christmas",
    blood: "Blood Donation",
    cricket: "Cricket",
    food: "Food (Sadya)",
  };
  const EVENT_CATEGORIES = [
    "Cultural Festival",
    "Community Meeting",
    "Social Initiative",
    "Sports & Wellness",
    "Educational",
  ];
  const EVENT_STATUSES = ["Published", "Draft", "Archived"];

  const DEFAULT_HOME = {
    title: "South Edmonton Malayalee Association",
    subtitle:
      "Celebrating Kerala's rich culture and heritage in South Edmonton. A vibrant home away from home for the Malayalee community.",
    primaryCtaText: "Join Our Community",
    secondaryCtaText: "View Events",
    primaryCtaHref: "membership.html#membership",
    secondaryCtaHref: "events.html",
    aboutText:
      "South Edmonton Malayalee Association (SEMA) is dedicated to fostering a strong sense of belonging among Malayalees in Edmonton. We strive to keep the essence of God's Own Country alive through cultural exchange and community support.\n\nFrom the grand celebrations of Onam and Vishu to the festive warmth of Christmas and New Year, we bring families together to celebrate our roots. Our commitment extends beyond festivities to social responsibility, organizing regular blood donation drives and community outreach programs.",
    heroImage: "images/onam-dance-performance.jpg",
    metrics: [
      { value: "1,200+", label: "Active Members" },
      { value: "45+", label: "Annual Events" },
      { value: "15", label: "Years Legacy" },
    ],
    seoTitle: "SEMA | South Edmonton Malayalee Association",
    seoDescription:
      "Official portal for SEMA Edmonton. Find events, community news, and cultural resources for Malayalees in Alberta.",
    seoKeywords: "SEMA, Malayalees, Edmonton, Kerala community, Alberta",
  };

  const DEFAULT_EVENTS = [
    {
      id: "event-onam-2026",
      title: "Onam Celebration 2026",
      date: "2026-09-12",
      time: "10:00 AM - 4:00 PM",
      category: "Cultural Festival",
      location: "Edmonton Community Hall",
      description:
        "Join us for pookalam, pulikali, stage performances, and a grand Onasadhya as the community gathers for SEMA's biggest cultural celebration of the year.",
      image: "images/onam-mahabali-group.jpg",
      status: "Published",
      featured: true,
    },
    {
      id: "event-blood-2026",
      title: "Blood Donation Drive",
      date: "2026-08-22",
      time: "9:00 AM - 1:00 PM",
      category: "Social Initiative",
      location: "Canadian Blood Services, Edmonton",
      description:
        "Support the wider Edmonton community by joining our regular blood donation initiative in partnership with Canadian Blood Services.",
      image: "images/sema-cover-collage.jpg",
      status: "Published",
      featured: false,
    },
    {
      id: "event-christmas-2026",
      title: "Christmas & New Year Celebration",
      date: "2026-12-19",
      time: "5:00 PM - 10:00 PM",
      category: "Cultural Festival",
      location: "Parish Community Centre",
      description:
        "An evening of carols, dinner, cultural performances, and a joyful year-end celebration for SEMA families.",
      image: "images/christmas-2025-poster.jpg",
      status: "Published",
      featured: false,
    },
    {
      id: "event-meeting-2026",
      title: "Quarterly General Meeting",
      date: "2026-07-09",
      time: "6:00 PM - 8:00 PM",
      category: "Community Meeting",
      location: "SEMA Office Suite",
      description:
        "Planning and review session for volunteers, committee leads, and community members ahead of the fall season.",
      image: "images/sema-cover-collage.jpg",
      status: "Draft",
      featured: false,
    },
  ];

  const DEFAULT_GALLERY = [
    {
      id: "gallery-1",
      src: "images/onam-thiruvathirakali.jpg",
      category: "onam",
      caption: "Onam - Thiruvathirakali Performance",
      visible: true,
    },
    {
      id: "gallery-2",
      src: "images/onam-mahabali-group.jpg",
      category: "onam",
      caption: "Welcome Mahabali - Onam 2024",
      visible: true,
    },
    {
      id: "gallery-3",
      src: "images/onam-dance-performance.jpg",
      category: "onam",
      caption: "Cultural Dance - Onam Celebration",
      visible: true,
    },
    {
      id: "gallery-4",
      src: "images/onam-kids-dance.jpg",
      category: "onam",
      caption: "Little Stars - Kids Dance at Onam",
      visible: true,
    },
    {
      id: "gallery-5",
      src: "images/onam-kids-red-dance.jpg",
      category: "onam",
      caption: "Junior Performers - Onam Stage",
      visible: true,
    },
    {
      id: "gallery-6",
      src: "images/onam-sadya-feast.jpg",
      category: "food",
      caption: "Onasadhya - The Great Feast",
      visible: true,
    },
    {
      id: "gallery-7",
      src: "images/onam-2024-banner.jpg",
      category: "onam",
      caption: "Onam 2024 - Life Church Edmonton",
      visible: true,
    },
    {
      id: "gallery-8",
      src: "images/onam-celebration-banner.jpg",
      category: "onam",
      caption: "South Edmonton Onam Celebration",
      visible: true,
    },
    {
      id: "gallery-9",
      src: "images/christmas-2025-poster.jpg",
      category: "christmas",
      caption: "Christmas & New Year 2025",
      visible: true,
    },
    {
      id: "gallery-10",
      src: "images/christmas-2023-poster.jpg",
      category: "christmas",
      caption: "Christmas & New Year 2023",
      visible: true,
    },
    {
      id: "gallery-11",
      src: "images/sema-cover-collage.jpg",
      category: "onam",
      caption: "SEMA Community - Event Highlights",
      visible: true,
    },
  ];

  let fallbackState = null;

  function deepClone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function normalizeAssetPath(path) {
    if (!path || typeof path !== "string") {
      return "";
    }
    if (/^(data:|blob:|https?:|\/)/i.test(path)) {
      return path;
    }
    return path.replace(/^\.\.\//, "").replace(/^\.\//, "");
  }

  function isAdminPath() {
    return /\/admin\//.test(global.location.pathname);
  }

  function resolveAssetPath(path) {
    const normalizedPath = normalizeAssetPath(path);
    if (!normalizedPath) {
      return "";
    }
    if (/^(data:|blob:|https?:|\/)/i.test(normalizedPath)) {
      return normalizedPath;
    }
    if (isAdminPath() && normalizedPath.indexOf("images/") === 0) {
      return "../" + normalizedPath;
    }
    return normalizedPath;
  }

  function makeId(prefix) {
    return (
      prefix +
      "-" +
      Date.now().toString(36) +
      "-" +
      Math.random().toString(36).slice(2, 8)
    );
  }

  function normalizeHome(home) {
    const source = home && typeof home === "object" ? home : {};
    const sourceMetrics = Array.isArray(source.metrics) ? source.metrics : [];
    const metrics = DEFAULT_HOME.metrics.map(function (metric, index) {
      const sourceMetric = sourceMetrics[index] || {};
      return {
        value: sourceMetric.value || metric.value,
        label: sourceMetric.label || metric.label,
      };
    });

    return {
      title: source.title || DEFAULT_HOME.title,
      subtitle: source.subtitle || DEFAULT_HOME.subtitle,
      primaryCtaText: source.primaryCtaText || DEFAULT_HOME.primaryCtaText,
      secondaryCtaText: source.secondaryCtaText || DEFAULT_HOME.secondaryCtaText,
      primaryCtaHref: source.primaryCtaHref || DEFAULT_HOME.primaryCtaHref,
      secondaryCtaHref: source.secondaryCtaHref || DEFAULT_HOME.secondaryCtaHref,
      aboutText: source.aboutText || DEFAULT_HOME.aboutText,
      heroImage: normalizeAssetPath(source.heroImage || DEFAULT_HOME.heroImage),
      metrics: metrics,
      seoTitle: source.seoTitle || DEFAULT_HOME.seoTitle,
      seoDescription: source.seoDescription || DEFAULT_HOME.seoDescription,
      seoKeywords: source.seoKeywords || DEFAULT_HOME.seoKeywords,
    };
  }

  function normalizeEvent(event) {
    const source = event && typeof event === "object" ? event : {};
    return {
      id: source.id || makeId("event"),
      title: source.title || "Untitled Event",
      date: source.date || "",
      time: source.time || "",
      category: EVENT_CATEGORIES.indexOf(source.category) >= 0 ? source.category : EVENT_CATEGORIES[0],
      location: source.location || "",
      description: source.description || "",
      image: normalizeAssetPath(source.image || "images/sema-cover-collage.jpg"),
      status: EVENT_STATUSES.indexOf(source.status) >= 0 ? source.status : "Draft",
      featured: Boolean(source.featured),
    };
  }

  function normalizeGalleryItem(item) {
    const source = item && typeof item === "object" ? item : {};
    const category =
      Object.prototype.hasOwnProperty.call(CATEGORY_LABELS, source.category) ? source.category : "onam";

    return {
      id: source.id || makeId("gallery"),
      src: normalizeAssetPath(source.src || "images/sema-cover-collage.jpg"),
      category: category,
      caption: source.caption || CATEGORY_LABELS[category] + " Photo",
      visible: source.visible !== false,
    };
  }

  function buildDefaultState() {
    return {
      version: 1,
      home: {
        published: normalizeHome(DEFAULT_HOME),
        draft: normalizeHome(DEFAULT_HOME),
      },
      events: DEFAULT_EVENTS.map(normalizeEvent),
      gallery: DEFAULT_GALLERY.map(normalizeGalleryItem),
    };
  }

  function readStorage() {
    try {
      const raw = global.localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      return fallbackState ? deepClone(fallbackState) : null;
    }
  }

  function writeStorage(state) {
    fallbackState = deepClone(state);
    try {
      global.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      return false;
    }
    return true;
  }

  function normalizeState(state) {
    const defaults = buildDefaultState();
    const source = state && typeof state === "object" ? state : {};
    const sourceHome = source.home && typeof source.home === "object" ? source.home : {};

    defaults.home.published = normalizeHome(sourceHome.published || sourceHome);
    defaults.home.draft = normalizeHome(sourceHome.draft || sourceHome.published || sourceHome);

    if (Array.isArray(source.events) && source.events.length) {
      defaults.events = source.events.map(normalizeEvent);
    }

    if (Array.isArray(source.gallery) && source.gallery.length) {
      defaults.gallery = source.gallery.map(normalizeGalleryItem);
    }

    return defaults;
  }

  function getState() {
    return normalizeState(readStorage());
  }

  function saveState(state) {
    const normalized = normalizeState(state);
    writeStorage(normalized);
    return deepClone(normalized);
  }

  function updateState(mutator) {
    const nextState = getState();
    mutator(nextState);
    return saveState(nextState);
  }

  function sortEvents(events) {
    return deepClone(events).sort(function (left, right) {
      const leftTime = left.date ? new Date(left.date).getTime() : 0;
      const rightTime = right.date ? new Date(right.date).getTime() : 0;
      return leftTime - rightTime;
    });
  }

  const api = {
    STORAGE_KEY: STORAGE_KEY,
    CATEGORY_LABELS: CATEGORY_LABELS,
    EVENT_CATEGORIES: EVENT_CATEGORIES.slice(),
    EVENT_STATUSES: EVENT_STATUSES.slice(),
    resolveAssetPath: resolveAssetPath,
    getState: function () {
      return getState();
    },
    resetState: function () {
      const defaults = buildDefaultState();
      saveState(defaults);
      return defaults;
    },
    getHomeDraft: function () {
      return getState().home.draft;
    },
    getHomePublished: function () {
      return getState().home.published;
    },
    saveHomeDraft: function (home) {
      return updateState(function (state) {
        state.home.draft = normalizeHome(home);
      }).home.draft;
    },
    publishHome: function (home) {
      return updateState(function (state) {
        const published = normalizeHome(home || state.home.draft);
        state.home.published = deepClone(published);
        state.home.draft = deepClone(published);
      }).home.published;
    },
    getEvents: function () {
      return sortEvents(getState().events);
    },
    getPublishedEvents: function () {
      return sortEvents(
        getState().events.filter(function (event) {
          return event.status === "Published";
        })
      );
    },
    blankEvent: function () {
      return normalizeEvent({
        id: makeId("event"),
        title: "",
        date: "",
        time: "",
        category: EVENT_CATEGORIES[0],
        location: "",
        description: "",
        image: "images/sema-cover-collage.jpg",
        status: "Draft",
        featured: false,
      });
    },
    saveEvents: function (events) {
      return updateState(function (state) {
        state.events = Array.isArray(events) ? events.map(normalizeEvent) : [];
      }).events;
    },
    upsertEvent: function (event) {
      return updateState(function (state) {
        const normalized = normalizeEvent(event);
        const index = state.events.findIndex(function (item) {
          return item.id === normalized.id;
        });
        if (index >= 0) {
          state.events[index] = normalized;
        } else {
          state.events.push(normalized);
        }
      }).events;
    },
    deleteEvent: function (id) {
      return updateState(function (state) {
        state.events = state.events.filter(function (event) {
          return event.id !== id;
        });
      }).events;
    },
    getUpcomingFeaturedEvent: function () {
      const published = this.getPublishedEvents();
      if (!published.length) {
        return null;
      }

      const now = new Date();
      const upcoming = published.filter(function (event) {
        return event.date && new Date(event.date) >= now;
      });
      const pool = upcoming.length ? upcoming : published;
      const featured = pool.find(function (event) {
        return event.featured;
      });
      return featured || pool[0];
    },
    getGallery: function () {
      return deepClone(getState().gallery);
    },
    getVisibleGallery: function () {
      return getState().gallery.filter(function (item) {
        return item.visible;
      });
    },
    saveGallery: function (gallery) {
      return updateState(function (state) {
        state.gallery = Array.isArray(gallery) ? gallery.map(normalizeGalleryItem) : [];
      }).gallery;
    },
  };

  if (!readStorage()) {
    saveState(buildDefaultState());
  }

  global.SemaCMS = api;
})(window);
