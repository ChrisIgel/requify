const projects = [
  {
    id: 1,
    name: 'Website Redesign',
    short: 'WR-001',
    categories: [
      {
        id: 'ui',
        name: 'UI / UX',
        requirements: [
          {
            id: 1,
            shortName: 'Responsive nav',
            description: 'Main navigation adapts to mobile and desktop.',
            number: 'UI-01',
            weight: 'mandatory',
          },
          {
            id: 2,
            shortName: 'Accessible forms',
            description: 'All forms must meet WCAG AA standards.',
            number: 'UI-02',
            weight: 'important',
          },
        ],
      },
      {
        id: 'backend',
        name: 'Backend',
        requirements: [
          {
            id: 3,
            shortName: 'Auth',
            description: 'User authentication with sessions and tokens.',
            number: 'BE-01',
            weight: 'mandatory',
          },
          {
            id: 4,
            shortName: 'Rate limiting',
            description: 'Protect APIs from excessive requests.',
            number: 'BE-02',
            weight: 'nice-to-have',
          },
        ],
      },
    ],
  },
  {
    id: 2,
    name: 'Some Software',
    short: 'WR-002',
    categories: [
      {
        id: 'ui',
        name: 'UI / UX',
        requirements: [
          {
            id: 1,
            shortName: 'Responsive nav',
            description: 'Main navigation adapts to mobile and desktop.',
            number: 'UI-01',
            weight: 'mandatory',
          },
          {
            id: 2,
            shortName: 'Accessible forms',
            description: 'All forms must meet WCAG AA standards.',
            number: 'UI-02',
            weight: 'important',
          },
        ],
      },
      {
        id: 'backend',
        name: 'Backend',
        requirements: [
          {
            id: 3,
            shortName: 'Auth',
            description: 'User authentication with sessions and tokens.',
            number: 'BE-01',
            weight: 'mandatory',
          },
          {
            id: 4,
            shortName: 'Rate limiting',
            description: 'Protect APIs from excessive requests.',
            number: 'BE-02',
            weight: 'nice-to-have',
          },
        ],
      },
    ],
  },
]

export default eventHandler(async () => {
  return projects
})
