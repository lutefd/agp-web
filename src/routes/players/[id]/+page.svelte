<script lang="ts">
	import Card from '$lib/components/ui/card.svelte';
	import { Swords, TrendingUp, Trophy } from '@lucide/svelte';

	let { data } = $props();
	const biggestGain = $derived(Math.max(0, ...data.events.map((e) => e.ratingDelta)));
	const biggestLoss = $derived(Math.min(0, ...data.events.map((e) => e.ratingDelta)));
</script>

<section class="space-y-8 pb-16">
	<Card class="overflow-hidden">
		<div
			class="bg-gradient-to-r from-agp-green-soft to-white p-5 md:flex md:items-center md:justify-between lg:p-8"
		>
			<div class="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-6">
				<span
					class="flex h-20 w-20 items-center justify-center rounded-full bg-agp-green text-4xl font-black text-white lg:h-28 lg:w-28 lg:text-5xl"
					>{data.member.displayName.slice(0, 1)}</span
				>
				<div>
					<p class="font-bold uppercase text-agp-green">Jogador</p>
					<h1 class="font-serif text-4xl font-black text-agp-ink sm:text-5xl lg:text-6xl">
						{data.member.displayName}
					</h1>
					<p class="text-xl text-agp-muted">Perfil oficial da AGP</p>
				</div>
			</div>
			<div class="mt-6 text-left md:mt-0 md:text-right">
				<p class="font-serif text-5xl font-black text-agp-green lg:text-7xl">
					{data.member.currentRating}
				</p>
				<p class="text-xl text-agp-muted">pontos</p>
			</div>
		</div>
		<div class="grid gap-4 p-5 sm:grid-cols-2 md:grid-cols-4 lg:p-8">
			<div class="rounded-2xl bg-stone-100 p-5">
				<p class="text-agp-muted">Vitórias</p>
				<b class="text-4xl text-agp-green">{data.member.wins}</b>
			</div>
			<div class="rounded-2xl bg-stone-100 p-5">
				<p class="text-agp-muted">Derrotas</p>
				<b class="text-4xl text-red-600">{data.member.losses}</b>
			</div>
			<div class="rounded-2xl bg-stone-100 p-5">
				<p class="text-agp-muted">Partidas</p>
				<b class="text-4xl">{data.member.matchesPlayed}</b>
			</div>
			<div class="rounded-2xl bg-stone-100 p-5">
				<p class="text-agp-muted">Maior variação</p>
				<b class="text-3xl">+{biggestGain} / {biggestLoss}</b>
			</div>
		</div>
	</Card>

	<div class="grid gap-5 md:grid-cols-2">
		<Card class="p-7"
			><TrendingUp class="mb-4 text-agp-green" />
			<p class="text-agp-muted">Maior vitória</p>
			<h2 class="text-3xl font-black">+{biggestGain} pontos</h2></Card
		>
		<Card class="p-7"
			><Swords class="mb-4 text-orange-600" />
			<p class="text-agp-muted">Nêmesis</p>
			<h2 class="text-3xl font-black">A definir</h2>
			<p class="text-agp-muted">H2H aparece com mais partidas</p></Card
		>
	</div>

	<Card class="p-8">
		<h2 class="mb-5 flex items-center gap-3 text-3xl font-black">
			<Trophy class="text-agp-gold" /> Histórico recente
		</h2>
		<div class="space-y-3">
			{#each data.events as event}<p class="rounded-2xl bg-stone-100 p-4 font-bold">
					{event.ratingDelta > 0 ? '+' : ''}{event.ratingDelta}: {event.ratingBefore} → {event.ratingAfter}
				</p>{:else}<p class="text-agp-muted">Sem histórico de rating ainda.</p>{/each}
		</div>
	</Card>
</section>
