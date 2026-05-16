<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import Button from '$lib/components/ui/button.svelte';
	import '../app.css';

	let { data, children } = $props();
	const navItems = [
		{ href: '/leaderboard', label: 'Rankings' },
		{ href: '/matches', label: 'Partidas' },
		{ href: '/players', label: 'Jogadores' },
		{ href: '/rules', label: 'Regras' }
	];
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="agp-grid min-h-screen bg-agp-cream">
	<header class="border-b border-agp-border bg-white/90 backdrop-blur">
		<nav class="mx-auto flex max-w-[92rem] flex-wrap items-center gap-4 px-5 py-5 lg:px-10">
			<a class="mr-auto flex items-center gap-3" href="/leaderboard" aria-label="AGP">
				<span
					class="relative flex h-14 w-14 items-center justify-center rounded-full bg-agp-green text-2xl font-black text-white"
				>
					A
					<span
						class="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-4 border-agp-gold bg-agp-ink"
					></span>
				</span>
				<span>
					<span class="block font-serif text-3xl font-black leading-none text-agp-ink">AGP</span>
					<span class="text-sm text-agp-muted sm:text-base">Associação dos Guris Profissionais</span
					>
				</span>
			</a>

			{#if data.user}
				<div class="order-last flex w-full gap-2 overflow-x-auto lg:order-none lg:w-auto">
					{#each navItems as item}
						<a
							class="rounded-2xl px-4 py-3 text-base font-bold text-agp-muted transition hover:bg-agp-green-soft hover:text-agp-green"
							href={item.href}>{item.label}</a
						>
					{/each}
				</div>
				{#if data.member?.isAdmin}<a
						class="rounded-2xl px-4 py-3 font-bold text-agp-muted hover:bg-agp-green-soft hover:text-agp-green"
						href="/admin">Admin</a
					>{/if}
				<Button href="/matches/new">+ Registrar partida</Button>
				<a
					class="rounded-2xl px-4 py-3 font-bold text-agp-muted hover:bg-red-50 hover:text-red-700"
					href="/logout">Sair</a
				>
			{:else}
				<Button href="/login">Entrar</Button>
			{/if}
		</nav>
	</header>
	<main class="mx-auto max-w-[92rem] px-5 py-8 lg:px-10">{@render children()}</main>
</div>
