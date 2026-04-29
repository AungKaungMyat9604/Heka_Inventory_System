#!/usr/bin/env bash
# Replay synthetic Git history (April 2026). Run from repo root after `git init` / orphan branch.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

commit_at() {
	local date="$1"
	shift
	export GIT_AUTHOR_DATE="$date"
	export GIT_COMMITTER_DATE="$date"
	git commit "$@"
}

[[ -d .git ]] || {
	echo "No .git in $ROOT" >&2
	exit 1
}

# --- Commit 1: scaffold ---
git add \
	.gitignore \
	.dockerignore \
	.npmrc \
	.prettierignore \
	.prettierrc \
	.vscode \
	.env.example \
	package.json \
	pnpm-lock.yaml \
	pnpm-workspace.yaml \
	package-lock.json \
	vite.config.ts \
	svelte.config.js \
	tsconfig.json \
	eslint.config.js \
	playwright.config.ts \
	static

commit_at '2026-04-02T09:40:00+0630' -m "chore: scaffold SvelteKit app with adapter-node and tooling"

# --- Commit 2: UI foundations ---
git add src/lib/action src/lib/asset src/lib/component src/lib/service src/lib/state src/lib/tool src/lib/util

commit_at '2026-04-03T14:05:00+0630' -m "chore(ui): add Tailwind, DaisyUI, and shared UI foundations"

# --- Commit 3: Paraglide source ---
git add project.inlang messages

commit_at '2026-04-04T11:20:00+0630' -m "feat(i18n): add Paraglide messages and compiler wiring"

# --- Commit 4: Drizzle TS tables + drizzle folder ---
git add src/lib/server/db drizzle drizzle.config.ts

commit_at '2026-04-07T10:15:00+0630' -m "feat(db): introduce Drizzle tables + schema barrel"

# --- Commit 5: Auth ---
git add src/lib/auth src/lib/config src/routes/auth \
	src/routes/api/\(private\)/heka/auth \
	src/hooks.server.ts src/app.d.ts

commit_at '2026-04-08T15:50:00+0630' -m "feat(auth): Better Auth endpoints and login/signup UI"

# --- Commit 6: Hospital shell + model types ---
git add src/app.html src/routes/+layout.svelte src/routes/+layout.server.ts src/routes/layout.css \
	src/routes/\(private\)/heka/+layout.svelte \
	src/routes/\(private\)/heka/+layout.server.ts \
	src/routes/\(private\)/heka/admin \
	src/routes/\(private\)/heka/hospital/+layout.svelte \
	src/routes/\(private\)/heka/hospital/+layout.server.ts \
	src/routes/\(private\)/heka/hospital/+page.svelte \
	src/routes/\(private\)/heka/hospital/\[hospital_id\]/+layout.server.ts \
	src/routes/\(private\)/heka/hospital/\[hospital_id\]/home/+layout.svelte \
	src/routes/\(private\)/heka/hospital/\[hospital_id\]/home/+layout.server.ts \
	src/routes/\(private\)/heka/hospital/\[hospital_id\]/home/+page.svelte \
	src/routes/\(private\)/heka/hospital/\[hospital_id\]/home/+page.server.ts \
	src/routes/\(private\)/heka/hospital/\[hospital_id\]/home/set-selected-branch/+server.ts \
	src/routes/\(private\)/heka/hospital/\[hospital_id\]/home/set-selected-user-group/+server.ts \
	src/routes/\(private\)/heka/hospital/\[hospital_id\]/home/set-selected-inventory-from-store/+server.ts \
	src/lib/model \
	src/routes/api/\(private\)/session \
	src/routes/api/\(private\)/heka/hospital/+server.ts \
	src/routes/api/\(private\)/heka/staff

commit_at '2026-04-09T10:35:00+0630' -m "feat(admin): hospital selection shell and navigation"

# --- Commit 7: Administration (staff/branches/depts/user-group) ---
git add \
	src/routes/\(private\)/heka/hospital/\[hospital_id\]/home/administration/+page.svelte \
	src/routes/\(private\)/heka/hospital/\[hospital_id\]/home/administration/branches \
	src/routes/\(private\)/heka/hospital/\[hospital_id\]/home/administration/departments \
	src/routes/\(private\)/heka/hospital/\[hospital_id\]/home/administration/staff \
	src/routes/\(private\)/heka/hospital/\[hospital_id\]/home/administration/user-group \
	src/routes/api/\(private\)/heka/hospital/\[hospital_id\]/home/administration/branches \
	src/routes/api/\(private\)/heka/hospital/\[hospital_id\]/home/administration/departments \
	src/routes/api/\(private\)/heka/hospital/\[hospital_id\]/home/administration/staff \
	src/routes/api/\(private\)/heka/hospital/\[hospital_id\]/home/administration/user-group \
	src/lib/server/heka/hospital.server.ts \
	src/lib/server/heka/hospital-branch.server.ts \
	src/lib/server/heka/ensure-can-access-hospital.server.ts \
	src/lib/server/heka/master/department.server.ts \
	src/lib/server/heka/administration/staff.server.ts \
	src/lib/server/heka/administration/staff-registration.server.ts \
	src/lib/server/heka/administration/user-group

commit_at '2026-04-10T13:10:00+0630' -m "feat(admin): branches, departments, staff, and user groups"

# --- Commit 8: Prefix + financial year ---
git add \
	src/routes/\(private\)/heka/hospital/\[hospital_id\]/home/administration/prefix-configuration \
	src/routes/\(private\)/heka/hospital/\[hospital_id\]/home/administration/financial-year \
	src/routes/api/\(private\)/heka/hospital/\[hospital_id\]/home/administration/prefix-configuration \
	src/routes/api/\(private\)/heka/hospital/\[hospital_id\]/home/administration/financial-year \
	src/lib/server/heka/administration/prefix-configuration.server.ts \
	src/lib/server/heka/administration/financial-year.server.ts \
	src/lib/server/heka/prefix

commit_at '2026-04-13T10:05:00+0630' -m "feat(admin): prefix configuration and financial year UI"

# --- Commit 9: Unit master + stores ---
git add \
	src/routes/\(private\)/heka/hospital/\[hospital_id\]/home/inventory-setup/+layout.svelte \
	src/routes/\(private\)/heka/hospital/\[hospital_id\]/home/inventory-setup/+page.svelte \
	src/routes/\(private\)/heka/hospital/\[hospital_id\]/home/inventory-setup/unit-master \
	src/routes/\(private\)/heka/hospital/\[hospital_id\]/home/inventory-setup/stores \
	src/routes/api/\(private\)/heka/hospital/\[hospital_id\]/home/inventory-setup/unit-master \
	src/routes/api/\(private\)/heka/hospital/\[hospital_id\]/home/inventory-setup/stores \
	src/lib/server/heka/administration/unit-master.server.ts \
	src/lib/server/heka/administration/store.server.ts \
	src/lib/server/heka/master/lookup-lists.server.ts \
	src/lib/server/heka/master/status-list.server.ts \
	src/routes/api/\(private\)/heka/master

commit_at '2026-04-14T14:35:00+0630' -m "feat(inventory-setup): unit master and stores"

# --- Commit 10: Suppliers + pharmacy generics ---
git add \
	src/routes/\(private\)/heka/hospital/\[hospital_id\]/home/inventory-setup/supplier-setup \
	src/routes/\(private\)/heka/hospital/\[hospital_id\]/home/inventory-setup/pharmacy-generic \
	src/routes/api/\(private\)/heka/hospital/\[hospital_id\]/home/inventory-setup/supplier-setup \
	src/routes/api/\(private\)/heka/hospital/\[hospital_id\]/home/inventory-setup/pharmacy-generic \
	src/lib/server/heka/administration/supplier.server.ts \
	src/lib/server/heka/administration/pharmacy-generic.server.ts \
	src/lib/server/heka/administration/inventory-party-geo.server.ts

commit_at '2026-04-16T09:30:00+0630' -m "feat(inventory-setup): suppliers and pharmacy generic setup"

# --- Commit 11: Item master + item-unit master ---
git add \
	src/routes/\(private\)/heka/hospital/\[hospital_id\]/home/inventory-setup/item-master \
	src/routes/\(private\)/heka/hospital/\[hospital_id\]/home/inventory-setup/item-unit-master \
	src/routes/api/\(private\)/heka/hospital/\[hospital_id\]/home/inventory-setup/item-master \
	src/routes/api/\(private\)/heka/hospital/\[hospital_id\]/home/inventory-setup/item-unit-master \
	src/lib/server/heka/administration/item-master.server.ts \
	src/lib/server/heka/administration/item-unit-master.server.ts \
	src/lib/server/heka/inventory/item-unit-inventory.server.ts

commit_at '2026-04-17T15:15:00+0630' -m "feat(inventory-setup): item master and item-unit master"

# --- Commit 12: PR + approval plumbing ---
git add \
	src/routes/\(private\)/heka/hospital/\[hospital_id\]/home/inventory/+layout.svelte \
	src/routes/\(private\)/heka/hospital/\[hospital_id\]/home/inventory/+page.svelte \
	src/routes/\(private\)/heka/hospital/\[hospital_id\]/home/inventory-setup/approval-config \
	src/routes/\(private\)/heka/hospital/\[hospital_id\]/home/inventory/purchase-requisition \
	src/routes/api/\(private\)/heka/hospital/\[hospital_id\]/home/inventory-setup/approval-config \
	src/routes/api/\(private\)/heka/hospital/\[hospital_id\]/home/inventory/purchase-requisition \
	src/lib/server/heka/inventory/pr.server.ts \
	src/lib/server/heka/inventory/approval-config.server.ts \
	src/lib/server/heka/inventory/approval-workflow.server.ts \
	src/lib/server/heka/inventory/inventory-scope.server.ts \
	src/lib/server/heka/inventory/inv-validate.server.ts

commit_at '2026-04-20T11:45:00+0630' -m "feat(inventory): purchase requisition flow (new, edit, approve)"

# --- Commit 13: PO ---
git add \
	src/routes/\(private\)/heka/hospital/\[hospital_id\]/home/inventory/purchase-order \
	src/routes/api/\(private\)/heka/hospital/\[hospital_id\]/home/inventory/purchase-order \
	src/lib/server/heka/inventory/po.server.ts

commit_at '2026-04-21T14:10:00+0630' -m "feat(inventory): purchase order flow (new, view, approve)"

# --- Commit 14: GRN ---
git add \
	src/routes/\(private\)/heka/hospital/\[hospital_id\]/home/inventory/grn \
	src/routes/api/\(private\)/heka/hospital/\[hospital_id\]/home/inventory/grn \
	src/routes/api/\(private\)/heka/hospital/\[hospital_id\]/home/inventory/grn/received-by-search \
	src/routes/api/\(private\)/upload/grn-invoice \
	src/routes/api/\(private\)/grn-invoice \
	src/lib/server/heka/inventory/grn.server.ts \
	src/lib/server/heka/inventory/item-batch.server.ts

commit_at '2026-04-22T10:20:00+0630' -m "feat(inventory): GRN flow and receiving search"

# --- Commit 15: Department indent + issue + receipt ---
git add \
	src/routes/\(private\)/heka/hospital/\[hospital_id\]/home/inventory/department-indent \
	src/routes/\(private\)/heka/hospital/\[hospital_id\]/home/inventory/department-issue \
	src/routes/\(private\)/heka/hospital/\[hospital_id\]/home/inventory/receipt-from-store \
	src/routes/api/\(private\)/heka/hospital/\[hospital_id\]/home/inventory/department-indent \
	src/routes/api/\(private\)/heka/hospital/\[hospital_id\]/home/inventory/department-issue \
	src/lib/server/heka/inventory/department-indent.server.ts \
	src/lib/server/heka/inventory/department-issue.server.ts \
	src/lib/server/heka/inventory/transfer.server.ts

commit_at '2026-04-23T14:00:00+0630' -m "feat(inventory): department indent and department issue flows"

# --- Commit 16: Department consumption ---
git add \
	src/routes/\(private\)/heka/hospital/\[hospital_id\]/home/inventory/department-consumption \
	src/routes/api/\(private\)/heka/hospital/\[hospital_id\]/home/inventory/department-consumption \
	src/lib/server/heka/inventory/department-consumption.server.ts

commit_at '2026-04-24T10:30:00+0630' -m "feat(inventory): department consumption and approvals"

# --- Commit 17: Stock + reports ---
git add \
	src/routes/\(private\)/heka/hospital/\[hospital_id\]/home/inventory/stock \
	src/routes/\(private\)/heka/hospital/\[hospital_id\]/home/inventory/reports \
	src/routes/api/\(private\)/heka/hospital/\[hospital_id\]/home/inventory/stock \
	src/routes/api/\(private\)/heka/hospital/\[hospital_id\]/home/inventory/reports \
	src/lib/server/heka/inventory/stock.server.ts \
	src/lib/server/heka/inventory/stock-reports.server.ts

commit_at '2026-04-27T11:10:00+0630' -m "feat(inventory): stock view and inventory reports"

# --- Commit 18: Reorder + stock alerts + cron ---
git add \
	src/routes/\(private\)/heka/hospital/\[hospital_id\]/home/inventory-setup/reorder-level \
	src/routes/\(private\)/heka/hospital/\[hospital_id\]/home/inventory-setup/stock-alerts \
	src/routes/api/\(private\)/heka/hospital/\[hospital_id\]/home/inventory-setup/reorder-level \
	src/routes/api/\(private\)/heka/hospital/\[hospital_id\]/home/inventory-setup/stock-alerts \
	src/routes/api/\(private\)/heka/hospital/\[hospital_id\]/home/inventory/stock-alerts \
	src/routes/api/\(private\)/cron \
	src/lib/server/heka/inventory/reorder-level.server.ts \
	src/lib/server/heka/inventory/stock-alert-settings.server.ts \
	src/lib/server/heka/inventory/stock-alerts.server.ts

commit_at '2026-04-28T16:10:00+0630' -m "feat(inventory): reorder levels and stock alert policies/recipients"

# --- Commit 19: Remaining repo files ---
git add -A

commit_at '2026-04-29T15:40:00+0630' -m "chore: scripts, seeds, uploads, and final cleanup"

echo "Replay complete. Verify: git status"
