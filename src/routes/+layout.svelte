<script lang="ts">
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
	<title>AGP</title>
	<link rel="icon" href="/favicon/favicon.ico" sizes="any" />
	<link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
	<link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
	<link rel="apple-touch-icon" href="/favicon/apple-touch-icon.png" />
	<link rel="manifest" href="/favicon/site.webmanifest" />
</svelte:head>

<div class="agp-grid min-h-screen bg-agp-cream pb-24 lg:pb-0">
	<header class="sticky top-0 z-40 border-b border-agp-border bg-white/95 backdrop-blur">
		<nav
			class="mx-auto flex max-w-[92rem] flex-wrap items-center gap-3 px-4 py-3 lg:gap-4 lg:px-10 lg:py-5"
		>
			<a
				class="mr-auto flex min-w-0 items-center gap-3"
				href={data.user ? '/leaderboard' : '/'}
				aria-label="AGP"
			>
				<img
					class="h-11 w-11 shrink-0 object-contain lg:h-14 lg:w-14"
					src="/logo/agp-no-bg.png"
					alt=""
				/>
				<span class="min-w-0">
					<span class="block font-serif text-2xl font-black leading-none text-agp-ink lg:text-3xl"
						>AGP</span
					>
					<span class="hidden text-sm text-agp-muted sm:block lg:text-base"
						>Associação dos Guris Profissionais</span
					>
				</span>
			</a>

			{#if data.user}
				<div
					class="order-last -mx-4 flex w-[calc(100%+2rem)] gap-2 overflow-x-auto border-t border-agp-border px-4 pt-3 lg:order-none lg:mx-0 lg:w-auto lg:border-0 lg:px-0 lg:pt-0"
				>
					{#each navItems as item}
						<a
							class="shrink-0 rounded-2xl px-3 py-2 text-sm font-bold text-agp-muted transition hover:bg-agp-green-soft hover:text-agp-green lg:px-4 lg:py-3 lg:text-base"
							href={item.href}>{item.label}</a
						>
					{/each}
				</div>
				{#if data.member?.isAdmin}<a
						class="rounded-2xl px-4 py-3 font-bold text-agp-muted hover:bg-agp-green-soft hover:text-agp-green"
						href="/admin">Admin</a
					>{/if}
				<Button href="/matches/new" class="hidden lg:inline-flex">+ Registrar partida</Button>
				<a
					class="rounded-2xl px-4 py-3 font-bold text-agp-muted hover:bg-red-50 hover:text-red-700"
					href="/logout"
					data-sveltekit-reload>Sair</a
				>
			{:else}
				<Button href="/login">Entrar</Button>
			{/if}
		</nav>
	</header>
	<main class="mx-auto max-w-[92rem] px-4 py-6 sm:px-5 lg:px-10 lg:py-8">{@render children()}</main>
	{#if data.user}
		<a
			class="fixed bottom-4 left-4 right-4 z-50 rounded-2xl bg-agp-green px-5 py-4 text-center font-black text-white shadow-xl lg:hidden"
			href="/matches/new">+ Registrar partida</a
		>
	{/if}
</div>
