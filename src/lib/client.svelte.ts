import { createContext } from 'svelte';
import { browser } from '$app/environment';
import * as z from 'zod';

const zThemeMode = z.enum(['light', 'dark', 'system']);

const zThemeSettings = z.object({
	mode: zThemeMode
});

type ZThemeSettings = z.infer<typeof zThemeSettings>;

const THEME_MODE_KEY = 'theme_settings_mode';

class Client {
	public themeSettings: ZThemeSettings = $state({ mode: 'system' });
	private mediaQueryList: MediaQueryList | null = null;

	constructor() {
		if (browser) {
			this.initTheme();

			this.mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)');
			this.mediaQueryList.addEventListener('change', () => {
				if (this.themeSettings.mode === 'system') {
					this.applyThemeToDocument('system');
				}
			});

			$effect(() => {
				localStorage.setItem(THEME_MODE_KEY, this.themeSettings.mode);
				this.applyThemeToDocument(this.themeSettings.mode);
			});
		}
	}

	public initTheme = () => {
		if (!browser) return;
		const storedTheme = localStorage.getItem(THEME_MODE_KEY);
		const parsedTheme = z.safeParse(zThemeMode, storedTheme);

		if (parsedTheme.success) {
			this.themeSettings.mode = parsedTheme.data;
		}
	};

	private applyThemeToDocument = (themeMode: ZThemeSettings['mode']) => {
		if (!browser) return;
		const isDark =
			themeMode === 'dark' ||
			(themeMode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

		if (isDark) {
			document.documentElement.classList.remove('light');
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
			document.documentElement.classList.add('light');
		}
	};

	public toggleTheme = () => {
		if (this.themeSettings.mode === 'light') {
			this.themeSettings.mode = 'dark';
		} else if (this.themeSettings.mode === 'dark') {
			this.themeSettings.mode = 'system';
		} else {
			this.themeSettings.mode = 'light';
		}
	};

	public setTheme = (mode: ZThemeSettings['mode']) => {
		this.themeSettings.mode = mode;
	};
}

export const [getClient, setClient] = createContext<Client>();

export default Client;
