import { updateRequirement, deleteRequirement } from '@@/server/utils/projects-data'

export default defineEventHandler(async (event) => {
  const projectId = Number(event.context.params?.id)
  const rid = Number(event.context.params?.rid)
  if (!projectId || !rid) return sendError(event, createError({ statusCode: 400, statusMessage: 'Invalid id' }))

  const method = event.node.req.method
  if (method === 'PUT') {
    const body = await readBody(event)
    const updated = updateRequirement(projectId, rid, body)
    if (!updated) return sendError(event, createError({ statusCode: 404, statusMessage: 'Not found' }))
    return updated
  }

  if (method === 'DELETE') {
    const ok = deleteRequirement(projectId, rid)
    return { success: !!ok }
  }

  return sendError(event, createError({ statusCode: 405, statusMessage: 'Method Not Allowed' }))
})
