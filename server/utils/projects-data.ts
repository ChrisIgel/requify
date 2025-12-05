// In-memory projects storage for development/demo purposes
export type Requirement = {
  id: number
  shortName: string
  description: string
  number: string
  weight: string
}

export type Category = {
  id: string
  name: string
  requirements: Requirement[]
}

export type Project = {
  id: number
  name: string
  short: string
  categories: Category[]
}

let nextReqId = 5

export const projects: Project[] = [
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
]

export function getAllProjects() {
  return projects
}

export function getProjectById(id: number) {
  return projects.find(p => p.id === id) || null
}

export function createProject(payload: Partial<Project>) {
  const id = projects.length ? Math.max(...projects.map(p => p.id)) + 1 : 1
  const newProject: Project = {
    id,
    name: payload.name || `New Project ${id}`,
    short: payload.short || `P-${id}`,
    categories: payload.categories || [],
  }
  projects.push(newProject)
  return newProject
}

export function updateProject(id: number, payload: Partial<Project>) {
  const p = getProjectById(id)
  if (!p) return null
  if (payload.name) p.name = payload.name
  if (payload.short) p.short = payload.short
  if (payload.categories) p.categories = payload.categories
  return p
}

export function deleteProject(id: number) {
  const idx = projects.findIndex(p => p.id === id)
  if (idx === -1) return false
  projects.splice(idx, 1)
  return true
}

export function addRequirement(projectId: number, categoryId: string, req: Omit<Requirement, 'id'>) {
  const p = getProjectById(projectId)
  if (!p) return null
  let cat = p.categories.find(c => c.id === categoryId)
  if (!cat) {
    cat = { id: categoryId, name: categoryId, requirements: [] }
    p.categories.push(cat)
  }
  const newReq: Requirement = { id: ++nextReqId, ...req }
  cat.requirements.push(newReq)
  return newReq
}

export function updateRequirement(projectId: number, reqId: number, payload: Partial<Requirement>) {
  const p = getProjectById(projectId)
  if (!p) return null
  for (const cat of p.categories) {
    const r = cat.requirements.find(x => x.id === reqId)
    if (r) {
      Object.assign(r, payload)
      return r
    }
  }
  return null
}

export function deleteRequirement(projectId: number, reqId: number) {
  const p = getProjectById(projectId)
  if (!p) return false
  for (const cat of p.categories) {
    const idx = cat.requirements.findIndex(x => x.id === reqId)
    if (idx !== -1) {
      cat.requirements.splice(idx, 1)
      return true
    }
  }
  return false
}
