export const configuration = {
	//   host: '*',
	// * For CORS
	host: 'https://example.com',
	referer: 'https://example.com',
	methods: ['GET', 'HEAD', 'POST', 'OPTIONS', 'PATCH'],
};

// * List of APIs provided by the worker
export const list_api: { readonly [key: string]: string } = {
	home: '/',
	price: '/price',
};
