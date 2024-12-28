export const getCookieHeader = (request: Request) => {
	return request.headers.get('Cookie')
}
