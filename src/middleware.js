export async function onRequest({ locals, request }, next) {
  if (request['method'] === 'POST') {
    const requestBody = await request.json()
    if (requestBody && requestBody['is_storyblok_preview']) {
      locals['_storyblok_preview_data'] = requestBody
    }
  }
  return next()
}
