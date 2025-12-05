import { getAllProjects, createProject } from '@@/server/utils/projects-data'

export default defineEventHandler(async (event) => {
  const method = event.node.req.method
  if (method === 'GET') {
    return getAllProjects()
  }

  if (method === 'POST') {
    const body = await readBody(event)
    const p = createProject(body)
    return p
  }

  return sendError(event, createError({ statusCode: 405, statusMessage: 'Method Not Allowed' }))
})
