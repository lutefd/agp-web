<script lang="ts">
	import Card from '$lib/components/ui/card.svelte';
	import { Swords, Target, Trophy, Zap } from '@lucide/svelte';

	let { data } = $props();
	const leader = $derived(data.members[0]);
	const biggestUpset = $derived(
		data.members.length > 1
			? `${data.members.at(-1)?.displayName} → ${leader?.displayName}`
			: 'Em aberto'
	);
	const rivalry = $derived(
		data.members.length > 1
			? `${data.members[0].displayName} vs ${data.members[1].displayName}`
			: 'Aguardando jogos'
	);
</script>

<section class="space-y-16 pb-16">
	<div class="pt-16 text-center lg:pt-24">
		<div
			class="mx-auto mb-8 inline-flex items-center gap-3 rounded-2xl bg-agp-green-soft px-5 py-3 font-bold text-agp-green"
		>
			<span class="h-2.5 w-2.5 rounded-full bg-agp-green/60"></span>
			Temporada 2026
		</div>
		<h1
			class="mx-auto max-w-5xl font-serif text-6xl font-black leading-none text-agp-ink md:text-8xl"
		>
			Race to the Churras Finals
		</h1>
		<p class="mx-auto mt-8 max-w-3xl text-2xl text-agp-muted">
			A temporada oficialíssima dos guris até o fim do ano.
		</p>
	</div>

	<div class="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
		<Card class="relative overflow-hidden p-7">
			<div
				class="mb-7 flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-100 text-agp-gold"
			>
				<Trophy />
			</div>
			<p class="text-lg text-agp-muted">Líder atual</p>
			<h2 class="mt-3 text-3xl font-black text-agp-ink">{leader?.displayName ?? 'Sem líder'}</h2>
			<p class="mt-2 text-xl font-bold">{leader?.currentRating ?? 1000} pts</p>
		</Card>
		<Card class="p-7">
			<div
				class="mb-7 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-agp-green"
			>
				<Target />
			</div>
			<p class="text-lg text-agp-muted">Partidas jogadas</p>
			<h2 class="mt-3 text-3xl font-black text-agp-ink">{data.confirmedCount}</h2>
			<p class="mt-2 text-xl font-bold text-agp-green">esta temporada</p>
		</Card>
		<Card class="p-7">
			<div
				class="mb-7 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-orange-600"
			>
				<Zap />
			</div>
			<p class="text-lg text-agp-muted">Maior zebra</p>
			<h2 class="mt-3 text-3xl font-black text-agp-ink">{biggestUpset}</h2>
			<p class="mt-2 text-xl font-bold text-orange-600">ranking em movimento</p>
		</Card>
		<Card class="p-7">
			<div
				class="mb-7 flex h-14 w-14 items-center justify-center rounded-2xl bg-stone-100 text-agp-muted"
			>
				<Swords />
			</div>
			<p class="text-lg text-agp-muted">Próxima rivalidade</p>
			<h2 class="mt-3 text-3xl font-black text-agp-ink">{rivalry}</h2>
			<p class="mt-2 text-xl font-bold text-agp-muted">H2H pegando fogo</p>
		</Card>
	</div>

	<div class="flex flex-wrap items-end justify-between gap-4">
		<div>
			<h2 class="font-serif text-5xl font-black text-agp-ink">Ranking Oficialíssimo</h2>
			<p class="mt-2 text-xl text-agp-muted">Atualizado após cada partida confirmada</p>
		</div>
		<div class="flex items-center gap-3 text-lg text-agp-muted">
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
					class="grid gap-4 px-8 py-8 transition hover:bg-agp-green-soft/40 lg:grid-cols-[5rem_1fr_8rem_8rem_14rem_8rem] lg:items-center"
					href={`/players/${member.id}`}
				>
					<div class="flex items-center gap-4">
						<span
							class="flex h-12 w-12 items-center justify-center rounded-full {index === 0
								? 'bg-agp-gold text-agp-ink'
								: 'bg-stone-100 text-agp-muted'} font-black">{index === 0 ? '♛' : index + 1}</span
						>
					</div>
					<div class="flex items-center gap-5">
						<span
							class="flex h-16 w-16 items-center justify-center rounded-full bg-agp-green-soft text-2xl font-black text-agp-green"
							>{member.displayName.slice(0, 1)}</span
						>
						<strong class="text-2xl text-agp-ink">{member.displayName}</strong>
					</div>
					<strong class="font-serif text-3xl text-agp-ink">{member.currentRating}</strong>
					<span class="text-2xl"
						><b class="text-agp-green">{member.wins}</b> /
						<b class="text-red-600">{member.losses}</b></span
					>
					<div class="flex gap-2">
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
					<span class="font-black text-agp-green"
						>↗ +{Math.max(0, member.wins - member.losses)}</span
					>
				</a>
			{:else}
				<p class="p-10 text-center text-agp-muted">Nenhum jogador na liga ainda.</p>
			{/each}
		</div>
	</Card>
</section>
