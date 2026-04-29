import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Page from './auth/login/+page.svelte';

describe('/auth/login/+page.svelte', () => {
	it('should render login email field', () => {
		const { container } = render(Page);
		expect(container.querySelector('#email-input')).toBeTruthy();
	});
});
