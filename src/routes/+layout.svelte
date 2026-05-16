<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
 	import '../app.css';

	let { data, children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="min-h-screen bg-[#f6f2e8]">
	<header class="border-b border-emerald-900/10 bg-white/80 backdrop-blur">
		<nav class="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-4">
			<a class="mr-auto text-xl font-black text-emerald-950" href="/leaderboard">{data.appName}</a>
			{#if data.user}
				<a class="rounded-full px-3 py-2 text-sm font-bold hover:bg-emerald-100" href="/leaderboard">Ranking</a>
				<a class="rounded-full px-3 py-2 text-sm font-bold hover:bg-emerald-100" href="/matches">Partidas</a>
				<a class="rounded-full bg-lime-300 px-3 py-2 text-sm font-black text-emerald-950" href="/matches/new">Enviar resultado</a>
				<a class="rounded-full px-3 py-2 text-sm font-bold hover:bg-emerald-100" href="/rules">Regras</a>
				{#if data.member?.isAdmin}<a class="rounded-full px-3 py-2 text-sm font-bold hover:bg-emerald-100" href="/admin">Admin</a>{/if}
				<a class="rounded-full px-3 py-2 text-sm font-bold hover:bg-red-100" href="/logout">Sair</a>
			{:else}
				<a class="rounded-full bg-emerald-950 px-4 py-2 text-sm font-black text-white" href="/login">Entrar</a>
			{/if}
		</nav>
	</header>
	<main class="mx-auto max-w-6xl px-4 py-8">{@render children()}</main>
</div>
