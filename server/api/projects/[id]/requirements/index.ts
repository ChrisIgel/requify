import { addRequirement } from '@@/server/utils/projects-data'

export default defineEventHandler(async (event) => {
  const projectId = Number(event.context.params?.id)
  if (!projectId) return sendError(event, createError({ statusCode: 400, statusMessage: 'Invalid project id' }))

  const method = event.node.req.method
  if (method === 'POST') {
    const body = await readBody(event)
    const categoryId = body.categoryId || 'default'
    const payload = {
      shortName: body.shortName,
      description: body.description,
      number: body.number,
      weight: body.weight,
    }
    const created = addRequirement(projectId, categoryId, payload)
    if (!created) return sendError(event, createError({ statusCode: 404, statusMessage: 'Project not found' }))
    return created
  }

  return sendError(event, createError({ statusCode: 405, statusMessage: 'Method Not Allowed' }))
})
