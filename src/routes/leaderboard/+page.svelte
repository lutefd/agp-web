<script lang="ts">
	import Card from '$lib/components/ui/card.svelte';
	import { Swords, Target, Trophy, Zap } from '@lucide/svelte';

	let { data } = $props();
	const rankedMembers = $derived(data.members.filter((member) => member.matchesPlayed > 0));
	const leader = $derived(rankedMembers[0]);
	const biggestUpset = $derived(
		rankedMembers.length > 1
			? `${rankedMembers.at(-1)?.displayName} → ${leader?.displayName}`
			: 'Em aberto'
	);
	const rivalry = $derived(
		rankedMembers.length > 1
			? `${rankedMembers[0].displayName} vs ${rankedMembers[1].displayName}`
			: 'Aguardando jogos'
	);
</script>

<svelte:head>
	<title>Rankings | AGP</title>
	<meta name="description" content="Ranking oficial da Associação dos Guris Profissionais." />
</svelte:head>

<section class="space-y-10 pb-10 lg:space-y-16 lg:pb-16">
	<div class="pt-8 text-center lg:pt-24">
		<div
			class="mx-auto mb-8 inline-flex items-center gap-3 rounded-2xl bg-agp-green-soft px-5 py-3 font-bold text-agp-green"
		>
			<span class="h-2.5 w-2.5 rounded-full bg-agp-green/60"></span>
			Temporada 2026
		</div>
		<h1
			class="mx-auto max-w-5xl font-serif text-4xl font-black leading-none text-agp-ink sm:text-6xl md:text-8xl"
		>
			Race to the Churras Finals
		</h1>
		<p class="mx-auto mt-5 max-w-3xl text-lg text-agp-muted sm:text-2xl lg:mt-8">
			A temporada oficialíssima dos guris até o fim do ano.
		</p>
	</div>

	<div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
		<Card class="relative overflow-hidden p-5 lg:p-7">
			<div
				class="mb-7 flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-100 text-agp-gold"
			>
				<Trophy />
			</div>
			<p class="text-lg text-agp-muted">Líder atual</p>
			<h2 class="mt-3 text-2xl font-black text-agp-ink lg:text-3xl">
				{leader?.displayName ?? 'Sem líder'}
			</h2>
			<p class="mt-2 text-xl font-bold">{leader ? `${leader.currentRating} pts` : '-'}</p>
		</Card>
		<Card class="p-5 lg:p-7">
			<div
				class="mb-7 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-agp-green"
			>
				<Target />
			</div>
			<p class="text-lg text-agp-muted">Partidas jogadas</p>
			<h2 class="mt-3 text-3xl font-black text-agp-ink">{data.confirmedCount}</h2>
			<p class="mt-2 text-xl font-bold text-agp-green">esta temporada</p>
		</Card>
		<Card class="p-5 lg:p-7">
			<div
				class="mb-7 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-orange-600"
			>
				<Zap />
			</div>
			<p class="text-lg text-agp-muted">Maior zebra</p>
			<h2 class="mt-3 text-2xl font-black text-agp-ink lg:text-3xl">{biggestUpset}</h2>
			<p class="mt-2 text-xl font-bold text-orange-600">ranking em movimento</p>
		</Card>
		<Card class="p-5 lg:p-7">
			<div
				class="mb-7 flex h-14 w-14 items-center justify-center rounded-2xl bg-stone-100 text-agp-muted"
			>
				<Swords />
			</div>
			<p class="text-lg text-agp-muted">Próxima rivalidade</p>
			<h2 class="mt-3 text-2xl font-black text-agp-ink lg:text-3xl">{rivalry}</h2>
			<p class="mt-2 text-xl font-bold text-agp-muted">H2H pegando fogo</p>
		</Card>
	</div>

	<div class="flex flex-wrap items-end justify-between gap-4">
		<div>
			<h2 class="font-serif text-4xl font-black text-agp-ink lg:text-5xl">Ranking Oficialíssimo</h2>
			<p class="mt-2 text-xl text-agp-muted">Atualizado após cada partida confirmada</p>
		</div>
		<div class="flex flex-wrap items-center gap-3 text-base text-agp-muted lg:text-lg">
			<span class="h-3 w-3 rounded-full bg-agp-green"></span>
			Sistema Elo <span class="text-agp-border">|</span> Base: 1000 pts
		</div>
	</div>

	<Card class="overflow-hidden">
		<div
			class="grid grid-cols-[5rem_1fr_8rem_8rem_14rem_8rem] items-center bg-stone-100/70 px-8 py-6 text-sm font-black uppercase tracking-widest text-agp-muted max-lg:hidden"
		>
			<span>#</span><span>Jogador</span><span>Rating</span><span>V/D</span><span>Últimas 5</span
			><span>Tendência</span>
		</div>
		<div class="divide-y divide-agp-border">
			{#each data.members as member, index}
				<a
					class="grid gap-4 px-5 py-6 transition hover:bg-agp-green-soft/40 lg:grid-cols-[5rem_1fr_8rem_8rem_14rem_8rem] lg:items-center lg:px-8 lg:py-8"
					href={`/players/${member.id}`}
				>
					<div class="hidden items-center gap-4 lg:flex">
						<span
							class="flex h-12 w-12 items-center justify-center rounded-full {index === 0
								? 'bg-agp-gold text-agp-ink'
								: 'bg-stone-100 text-agp-muted'} font-black"
							>{member.matchesPlayed === 0 ? '-' : index === 0 ? '♛' : index + 1}</span
						>
					</div>
					<div class="flex items-center gap-5">
						<span
							class="flex h-16 w-16 items-center justify-center rounded-full bg-agp-green-soft text-2xl font-black text-agp-green"
							>{member.displayName.slice(0, 1)}</span
						>
						<strong class="text-2xl text-agp-ink">{member.displayName}</strong>
					</div>
					<div class="grid grid-cols-2 gap-4 lg:contents">
						<strong class="font-serif text-3xl text-agp-ink"
							><span
								class="block text-xs font-sans uppercase tracking-widest text-agp-muted lg:hidden"
								>Rating</span
							>{member.matchesPlayed === 0 ? '-' : member.currentRating}</strong
						>
						<span class="text-2xl"
							><b class="text-agp-green">{member.wins}</b> /
							<b class="text-red-600">{member.losses}</b></span
						>
					</div>
					<div class="flex flex-wrap gap-2">
						{#each data.formByMember[member.id] ?? [] as result}
							<span
								class="rounded-lg px-3 py-2 font-black {result === 'V'
									? 'bg-green-100 text-agp-green'
									: 'bg-red-100 text-red-700'}">{result === 'V' ? 'W' : 'L'}</span
							>
						{:else}
							<span class="text-agp-muted">Sem jogos</span>
						{/each}
					</div>
					{#if member.matchesPlayed > 0}
						<span class="font-black text-agp-green"
							>↗ +{Math.max(0, member.wins - member.losses)}</span
						>
					{:else}
						<span class="font-black text-agp-muted">-</span>
					{/if}
				</a>
			{:else}
				<p class="p-10 text-center text-agp-muted">Nenhum jogador na liga ainda.</p>
			{/each}
		</div>
	</Card>
</section>
