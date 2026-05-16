<script lang="ts">
	import Button from '$lib/components/ui/button.svelte';
	import Card from '$lib/components/ui/card.svelte';
	import { formatDate } from '$lib/format';
	import { AlertCircle, CheckCircle2, Star } from '@lucide/svelte';

	let { data } = $props();
	const name = (id: string) => data.members.find((m) => m.id === id)?.displayName ?? 'Jogador';
	const initial = (id: string) => name(id).slice(0, 1);
</script>

<section class="grid gap-10 xl:grid-cols-[1fr_1fr] xl:gap-12">
	<div class="space-y-8">
		<div class="flex flex-wrap items-end justify-between gap-4">
			<div>
				<h1 class="font-serif text-4xl font-black text-agp-ink sm:text-5xl">Partidas Recentes</h1>
				<p class="mt-2 text-xl text-agp-muted">Resultados validados pelos jogadores</p>
			</div>
			<a class="font-bold text-agp-green" href="/matches">Ver todas →</a>
		</div>

		<div class="space-y-5">
			{#each data.matches.filter((m) => m.status === 'confirmed').slice(0, 4) as match}
				<Card class="p-5 lg:p-6">
					<a
						class="grid gap-5 md:grid-cols-[1fr_auto_1fr] md:items-center lg:gap-6"
						href={`/matches/${match.id}`}
					>
						<div>
							<span
								class="inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 font-bold text-agp-green"
								><CheckCircle2 size={16} /> Confirmado</span
							>
							<div class="mt-6 flex items-center gap-4">
								<span
									class="flex h-16 w-16 items-center justify-center rounded-full bg-agp-green text-2xl font-black text-white"
									>{initial(match.winnerMemberId)}</span
								>
								<div>
									<strong class="text-2xl">{name(match.winnerMemberId)} 🏆</strong>
									<p class="font-bold text-agp-green">vitória registrada</p>
								</div>
							</div>
						</div>
						<strong
							class="w-fit rounded-2xl bg-stone-100 px-5 py-3 font-serif text-2xl md:w-auto md:px-6 md:py-4"
							>{match.scoreText}</strong
						>
						<div class="text-left md:text-right">
							<p class="text-agp-muted">{formatDate(match.playedAt)}</p>
							<div class="mt-6 flex items-center gap-4 md:justify-end">
								<div>
									<strong class="text-2xl text-agp-muted"
										>{name(
											match.winnerMemberId === match.playerOneMemberId
												? match.playerTwoMemberId
												: match.playerOneMemberId
										)}</strong
									>
									<p class="font-bold text-red-600">derrota</p>
								</div>
								<span
									class="flex h-16 w-16 items-center justify-center rounded-full bg-stone-100 text-2xl font-black text-agp-muted"
									>{initial(
										match.winnerMemberId === match.playerOneMemberId
											? match.playerTwoMemberId
											: match.playerOneMemberId
									)}</span
								>
							</div>
						</div>
					</a>
				</Card>
			{:else}
				<Card class="p-8 text-agp-muted">Nenhuma partida confirmada ainda.</Card>
			{/each}
		</div>
	</div>

	<div class="space-y-8">
		<div>
			<h2 class="flex items-center gap-3 text-2xl font-black text-agp-ink sm:text-3xl">
				<AlertCircle class="text-orange-600" /> Aguardando Confirmação
			</h2>
		</div>
		{#each data.matches.filter((m) => m.status === 'pending').slice(0, 2) as match}
			<Card class="overflow-hidden border-orange-200">
				<div
					class="border-b border-orange-200 bg-orange-50 px-6 py-5 text-lg font-bold text-orange-700"
				>
					Aguardando o adversário não fugir...
				</div>
				<div class="p-5 lg:p-6">
					<a
						class="grid gap-5 md:grid-cols-[1fr_auto_1fr] md:items-center lg:gap-6"
						href={`/matches/${match.id}`}
					>
						<div class="flex items-center gap-4">
							<span
								class="flex h-16 w-16 items-center justify-center rounded-full bg-agp-green-soft text-2xl font-black text-agp-green"
								>{initial(match.winnerMemberId)}</span
							>
							<div>
								<strong class="text-2xl">{name(match.winnerMemberId)}</strong>
								<p class="text-agp-muted">reportou vitória</p>
							</div>
						</div>
						<div class="text-left md:text-center">
							<strong class="font-serif text-3xl">{match.scoreText}</strong>
							<p class="text-agp-muted">Super tiebreak</p>
						</div>
						<div class="flex items-center gap-4 md:justify-end">
							<div class="text-left md:text-right">
								<strong class="text-2xl text-agp-muted"
									>{name(
										match.winnerMemberId === match.playerOneMemberId
											? match.playerTwoMemberId
											: match.playerOneMemberId
									)}</strong
								>
								<p class="text-agp-muted">precisa confirmar</p>
							</div>
							<span
								class="flex h-16 w-16 items-center justify-center rounded-full bg-stone-100 text-2xl font-black text-agp-muted"
								>{initial(
									match.winnerMemberId === match.playerOneMemberId
										? match.playerTwoMemberId
										: match.playerOneMemberId
								)}</span
							>
						</div>
					</a>
				</div>
			</Card>
		{:else}
			<Card class="p-8 text-agp-muted">Nada pendente. Paz temporária na AGP.</Card>
		{/each}

		<div class="flex items-center gap-3 pt-8">
			<Star class="text-agp-gold" />
			<h2 class="text-3xl font-black">Destaque da Semana</h2>
		</div>
		<Card class="bg-gradient-to-r from-agp-green-soft to-white p-6 lg:p-8">
			<p class="text-xl text-agp-muted">Líder do ranking</p>
			<h3 class="font-serif text-4xl font-black text-agp-ink sm:text-5xl">
				{data.members[0]?.displayName ?? 'Em aberto'}
			</h3>
			<p class="mt-2 text-5xl font-black text-agp-green">
				{data.members[0]?.currentRating ?? 1000}
			</p>
		</Card>
		<Button href="/matches/new" class="w-full">Registrar partida</Button>
	</div>
</section>
