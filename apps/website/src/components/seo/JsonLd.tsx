const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': 'https://vellira.dev/#organization',
  name: 'Vellira',
  url: 'https://vellira.dev',
  description:
    'Open-source cross-platform design system for React and React Native.',
  logo: {
    '@type': 'ImageObject',
    url: 'https://vellira.dev/brand/logos/logo-gradient.svg',
  },
  sameAs: ['https://github.com/vellira-dev/vellira'],
};

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': 'https://vellira.dev/#website',
  name: 'Vellira',
  url: 'https://vellira.dev',
  description:
    'A cross-platform design system for React and React Native with accessible components and semantic design tokens.',
  publisher: {
    '@id': 'https://vellira.dev/#organization',
  },
};

const sourceCodeJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareSourceCode',
  '@id': 'https://vellira.dev/#source-code',
  name: 'Vellira',
  url: 'https://vellira.dev',
  codeRepository: 'https://github.com/vellira-dev/vellira',
  programmingLanguage: 'TypeScript',
  license: 'https://opensource.org/license/mit',
  creator: {
    '@id': 'https://vellira.dev/#organization',
  },
};

function serializeJsonLd(value: object): string {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

export function JsonLd() {
  return (
    <>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(organizationJsonLd),
        }}
      />

      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(websiteJsonLd),
        }}
      />

      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(sourceCodeJsonLd),
        }}
      />
    </>
  );
}
