<script lang="ts">
	import { page } from '$app/state';
	import DaisyUiCard from '$lib/component/daisyui/card/DaisyUiCard.svelte';
	import DaisyUiCardBody from '$lib/component/daisyui/card/body/DaisyUiCardBody.svelte';
	import DaisyUiCardBodyTitle from '$lib/component/daisyui/card/body/title/DaisyUiCardBodyTitle.svelte';
	import { hekaHospitalPageUrl } from '$lib/model/enum/routes.enum';
	import { m } from '$lib/paraglide/messages';

	const hospitalId = $derived(
		typeof page.params.hospital_id === 'string' ? page.params.hospital_id : ''
	);

	function url(dbPath: string): string {
		return hekaHospitalPageUrl(hospitalId, dbPath);
	}

	const cards = $derived.by(() => [
		{
			title: m.home_inv_dashboard_low_stock(),
			description: m.inv_reports_card_low_stock_desc(),
			href: url('/heka/home/inventory/reports/low-stock')
		},
		{
			title: m.home_inv_dashboard_expired(),
			description: m.inv_reports_card_expired_desc(),
			href: url('/heka/home/inventory/reports/expired')
		},
		{
			title: m.inv_reports_movement(),
			description: m.inv_reports_card_movement_desc(),
			href: url('/heka/home/inventory/reports/movement')
		}
	]);
</script>

<div class="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-6 lg:px-8 lg:py-8">
	<header class="space-y-2">
		<h1 class="text-2xl font-semibold tracking-tight">
			{m.inv_reports_title()}
		</h1>
		<p class="text-sm text-base-content/70">
			{m.inv_reports_subtitle()}
		</p>
	</header>

	<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
		{#each cards as card (card.href)}
			<a
				href={card.href}
				class="block rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
			>
				<DaisyUiCard
					animate={true}
					className="h-full transition-shadow hover:shadow-lg"
				>
					<DaisyUiCardBody className="gap-2">
						<DaisyUiCardBodyTitle>{card.title}</DaisyUiCardBodyTitle>
						<p class="text-sm text-base-content/70">
							{card.description}
						</p>
						<div class="mt-2 text-sm font-medium text-primary">
							{m.inv_reports_open()}
						</div>
					</DaisyUiCardBody>
				</DaisyUiCard>
			</a>
		{/each}
	</div>
</div>
