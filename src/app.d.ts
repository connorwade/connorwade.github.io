// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import type { AppCookie } from '$lib/global-schema';

declare global {
	namespace App {
		interface Platform {
			env: Env;
			ctx: ExecutionContext;
			caches: CacheStorage;
			cf?: IncomingRequestCfProperties;
		}

		// interface Error {}
		interface Locals {
			app: AppCookie;
		}
		// interface PageData {}
		// interface PageState {}
	}
}

export {};
