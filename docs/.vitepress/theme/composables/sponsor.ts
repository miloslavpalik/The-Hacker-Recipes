import { onMounted, onUnmounted, ref } from 'vue'

interface Sponsors {
  special: Sponsor[]
  platinum: Sponsor[]
  platinum_china: Sponsor[]
  gold: Sponsor[]
  silver: Sponsor[]
  bronze: Sponsor[]
  banner: BannerSponsor[] // Ajout de la catégorie banner
}

interface Sponsor {
  name: string
  img: string
  url: string
  hasDark?: true
}

interface BannerSponsor {
  name: string
  url: string
  tagline: string
  description: string
  categories: string[] // Ajout des catégories
  lightTheme: {
    primaryColor: string
    secondaryColor: string
    logo: string
  }
  darkTheme: {
    primaryColor: string
    secondaryColor: string
    logo: string
  }
}

// shared data across instances so we load only once.
const data = ref()

// Set dataHost to an empty string since images are local
const dataHost = ''

const viteSponsors: Pick<Sponsors, 'special' | 'gold' | 'banner'> = {
  special: [
    {
      name: 'Google',
      url: 'https://www.google.com',
      img: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
    },
    {
      name: 'Amazon',
      url: 'https://www.amazon.com',
      img: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
    },
  ],
  gold: [
    {
      name: 'Facebook',
      url: 'https://www.facebook.com',
      img: 'https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg',
    },
    {
      name: 'Apple',
      url: 'https://www.apple.com',
      img: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg',
    },
    {
      name: 'Microsoft',
      url: 'https://www.microsoft.com',
      img: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg',
    },
    {
      name: 'OpenAI',
      url: 'https://www.openai.com',
      img: 'https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI_Logo.svg',
    },
    {
      name: 'Tesla',
      url: 'https://www.tesla.com',
      img: 'https://upload.wikimedia.org/wikipedia/commons/b/bd/Tesla_Motors.svg',
    },
    {
      name: 'IBM',
      url: 'https://www.ibm.com',
      img: 'https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg',
    },
  ],
  banner: [
    {
      name: 'Evil Corp',
      url: 'https://www.evil-corp.com',
      tagline: 'Corrupt conglomerate.',
      description: "Systemic manipulation as a service. Empowering the next generation of cybercriminals. Your local surveillance state that you can't opt out of.",
      categories: ['ad'], // Spécifiez les catégories ici
      lightTheme: {
        primaryColor: '#7b42f6',
        secondaryColor: '#42aaff',
        logo: '/images/sponsors/logo_light.png'
      },
      darkTheme: {
        primaryColor: '#9e6eff',
        secondaryColor: '#66bbff',
        logo: '/images/sponsors/logo_dark.png'
      }
    }
  ]
}

function toggleDarkLogos() {
  if (data.value) {
    const isDark = document.documentElement.classList.contains('dark')
    data.value.forEach(({ items }) => {
      items.forEach((s: Sponsor) => {
        if (s.hasDark) {
          s.img = isDark
            ? s.img.replace(/(\.\w+)$/, '-dark$1')
            : s.img.replace(/-dark(\.\w+)$/, '$1')
        }
      })
    })
  }
}

export function useSponsor() {
  onMounted(() => {
    const ob = new MutationObserver((list) => {
      for (const m of list) {
        if (m.attributeName === 'class') {
          toggleDarkLogos()
        }
      }
    })
    ob.observe(document.documentElement, { attributes: true })
    onUnmounted(() => {
      ob.disconnect()
    })

    if (data.value) {
      return
    }

    // Use local static data
    data.value = mapSponsors(viteSponsors)
    toggleDarkLogos()
  })

  return {
    data,
  }
}

function mapSponsors(sponsors: Pick<Sponsors, 'special' | 'gold' | 'banner'>) {
  return [
    {
      tier: 'Special Sponsors',
      size: 'big',
      items: sponsors['special'],
    },
    {
      tier: 'Gold Sponsors',
      size: 'small',
      items: sponsors['gold'],
    },
    {
      tier: 'Banner Sponsors',
      size: 'medium',
      items: sponsors['banner'],
    },
  ]
}

const viteSponsorNames = new Set(
  Object.values(viteSponsors).flatMap((sponsors) =>
    sponsors.map((s) => s.name),
  ),
)

/**
 * Map Vue/Vite sponsors data to objects and filter out Vite-specific sponsors
 */
function mapImgPath(sponsors: Sponsor[]) {
  return sponsors
    .filter((sponsor) => !viteSponsorNames.has(sponsor.name))
    .map((sponsor) => ({
      ...sponsor,
      img: `${dataHost}${sponsor.img}`, // Use local path
    }))
}
