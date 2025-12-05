import { getProjectById, updateProject, deleteProject } from '@@/server/utils/projects-data'

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params?.id)
  if (!id) return sendError(event, createError({ statusCode: 400, statusMessage: 'Invalid id' }))

  const method = event.node.req.method
  if (method === 'GET') {
    const p = getProjectById(id)
    if (!p) return sendError(event, createError({ statusCode: 404, statusMessage: 'Not found' }))
    return p
  }

  if (method === 'PUT') {
    const body = await readBody(event)
    const updated = updateProject(id, body)
    if (!updated) return sendError(event, createError({ statusCode: 404, statusMessage: 'Not found' }))
    return updated
  }

  if (method === 'DELETE') {
    const ok = deleteProject(id)
    return { success: !!ok }
  }

  return sendError(event, createError({ statusCode: 405, statusMessage: 'Method Not Allowed' }))
})
