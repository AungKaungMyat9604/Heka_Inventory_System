<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import DaisyUiButton from '$lib/component/daisyui/button/DaisyUiButton.svelte';
	import { hekaHospitalPageUrl } from '$lib/model/enum/routes.enum';
	import { formatIntegerDisplay } from '$lib/util/number-display.util';
	import { m } from '$lib/paraglide/messages';
	import type {
		InventoryDashboardCounts,
		InventoryDashboardStockAlertCounts
	} from './+page.server';

	let { data } = $props();

	const hospitalId = $derived(page.params.hospital_id ?? '');
	const counts = $derived(
		(data as { inventoryDashboard?: InventoryDashboardCounts })
			.inventoryDashboard ?? {
			storeCount: 0,
			itemMasterCount: 0,
			stockLotCount: 0
		}
	);
	const branchScopeName = $derived(
		(data as { branchScopeName?: string | null }).branchScopeName ??
			null
	);
	const stockAlerts = $derived(
		(data as { inventoryStockAlerts?: InventoryDashboardStockAlertCounts })
			.inventoryStockAlerts ?? {
			lowStockCount: 0,
			expiredLotCount: 0,
			expiringSoonLotCount: 0
		}
	);

	function fmt(n: number): string {
		return formatIntegerDisplay(n, '0');
	}

	function url(dbPath: string): string {
		return hekaHospitalPageUrl(hospitalId, dbPath);
	}
</script>

<div
	class="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-6 lg:px-8 lg:py-8"
>
	<header class="space-y-2">
		<h1 class="text-2xl font-semibold tracking-tight">
			{m.home_inv_dashboard_title()}
		</h1>
		<p class="text-sm text-base-content/70">
			{m.home_inv_dashboard_subtitle()}
		</p>
		<p class="text-sm font-medium text-base-content/80">
			{m.inv_common_hospital()}: {data.currentHospitalName ?? '—'}
			{#if branchScopeName}
				· {branchScopeName}
			{/if}
		</p>
	</header>

	<div
		class="d-stats d-stats-vertical rounded-2xl border border-base-300 bg-base-100 shadow-sm lg:d-stats-horizontal"
	>
		<div class="d-stat">
			<div class="d-stat-title">{m.home_inv_dashboard_stores()}</div>
			<div class="d-stat-value text-primary">
				{fmt(counts.storeCount)}
			</div>
		</div>
		<div class="d-stat">
			<div class="d-stat-title">{m.home_inv_dashboard_items()}</div>
			<div class="d-stat-value text-secondary">
				{fmt(counts.itemMasterCount)}
			</div>
		</div>
		<div class="d-stat">
			<div class="d-stat-title">
				{m.home_inv_dashboard_stock_lots()}
			</div>
			<div class="d-stat-value text-accent">
				{fmt(counts.stockLotCount)}
			</div>
		</div>
	</div>

	<section class="space-y-3">
		<div class="space-y-1">
			<div class="text-sm font-semibold text-base-content/80">
				{m.home_inv_dashboard_stock_alerts_title()}
			</div>
			<p class="text-xs text-base-content/60">
				{m.home_inv_dashboard_stock_alerts_hint()}
			</p>
		</div>
		<div
			class="d-stats d-stats-vertical rounded-2xl border border-base-300 bg-base-100 shadow-sm lg:d-stats-horizontal"
		>
			<a
				class="d-stat hover:bg-base-200/40"
				href={url('/heka/home/inventory/reports/low-stock')}
				data-sveltekit-preload-data
			>
				<div class="d-stat-title">
					{m.home_inv_dashboard_low_stock()}
				</div>
				<div class="d-stat-value text-warning">
					{fmt(stockAlerts.lowStockCount)}
				</div>
			</a>
			<a
				class="d-stat hover:bg-base-200/40"
				href={url('/heka/home/inventory/reports/expired?mode=expired')}
				data-sveltekit-preload-data
			>
				<div class="d-stat-title">
					{m.home_inv_dashboard_expired()}
				</div>
				<div class="d-stat-value text-error">
					{fmt(stockAlerts.expiredLotCount)}
				</div>
			</a>
			<a
				class="d-stat hover:bg-base-200/40"
				href={url('/heka/home/inventory/reports/expired?mode=soon')}
				data-sveltekit-preload-data
			>
				<div class="d-stat-title">
					{m.home_inv_dashboard_expiring_soon()}
				</div>
				<div class="d-stat-value text-warning">
					{fmt(stockAlerts.expiringSoonLotCount)}
				</div>
			</a>
		</div>
	</section>

	<div class="flex flex-wrap gap-3">
		<DaisyUiButton
			className="d-btn-primary"
			onClick={() =>
				void goto(url('/heka/home/inventory-setup/stores'))}
		>
			{m.home_inv_dashboard_open_setup()}
		</DaisyUiButton>
		<DaisyUiButton
			className="d-btn-outline"
			onClick={() => void goto(url('/heka/home/inventory/stock'))}
		>
			{m.home_inv_dashboard_open_inventory()}
		</DaisyUiButton>
	</div>
</div>
