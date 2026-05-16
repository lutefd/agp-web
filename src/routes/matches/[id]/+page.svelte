<script lang="ts">
	import Button from '$lib/components/ui/button.svelte';
	import Card from '$lib/components/ui/card.svelte';
	import { formatDate, formatStatus } from '$lib/format';
	import { AlertTriangle, CheckCircle2, Trophy, X } from '@lucide/svelte';

	let { data } = $props();
	let actionInProgress = $state(false);
	const name = (id: string) => data.members.find((m) => m.id === id)?.displayName ?? 'Jogador';
	const initial = (id: string) => name(id).slice(0, 1);
	const loserId = $derived(
		data.match.winnerMemberId === data.match.playerOneMemberId
			? data.match.playerTwoMemberId
			: data.match.playerOneMemberId
	);
</script>

<svelte:head>
	<title>{name(data.match.playerOneMemberId)} x {name(data.match.playerTwoMemberId)} | AGP</title>
	<meta
		name="description"
		content={`Detalhes da partida entre ${name(data.match.playerOneMemberId)} e ${name(data.match.playerTwoMemberId)}.`}
	/>
</svelte:head>

<section class="mx-auto max-w-5xl space-y-8 pb-16">
	<Card class="overflow-hidden">
		<div class="bg-gradient-to-br from-agp-green-soft via-white to-orange-50 p-6 sm:p-8">
			<div class="flex flex-wrap items-start justify-between gap-4">
				<span
					class="inline-flex items-center gap-2 rounded-full px-4 py-2 font-black {data.match
						.status === 'pending'
						? 'bg-orange-100 text-orange-700'
						: data.match.status === 'confirmed'
							? 'bg-green-100 text-agp-green'
							: 'bg-red-100 text-red-700'}"
				>
					{formatStatus(data.match.status)}
				</span>
				<p class="text-agp-muted">Jogado em {formatDate(data.match.playedAt)}</p>
			</div>

			<div class="mt-8 grid gap-6 md:grid-cols-[1fr_auto_1fr] md:items-center">
				<div class="flex items-center gap-4">
					<span
						class="flex h-20 w-20 items-center justify-center rounded-full bg-agp-green text-4xl font-black text-white"
						>{initial(data.match.winnerMemberId)}</span
					>
					<div>
						<p class="flex items-center gap-2 font-bold text-agp-green">
							<Trophy size={18} /> Vencedor
						</p>
						<h1 class="font-serif text-4xl font-black text-agp-ink sm:text-5xl">
							{name(data.match.winnerMemberId)}
						</h1>
					</div>
				</div>

				<div class="rounded-3xl bg-white/80 px-6 py-5 text-center shadow-sm">
					<p class="text-sm font-bold uppercase tracking-widest text-agp-muted">Placar</p>
					<strong class="font-serif text-4xl font-black text-agp-ink">{data.match.scoreText}</strong
					>
				</div>

				<div class="flex items-center gap-4 md:justify-end">
					<div class="md:text-right">
						<p class="font-bold text-agp-muted">Adversário</p>
						<h2 class="text-3xl font-black text-agp-muted">{name(loserId)}</h2>
					</div>
					<span
						class="flex h-16 w-16 items-center justify-center rounded-full bg-stone-100 text-2xl font-black text-agp-muted"
						>{initial(loserId)}</span
					>
				</div>
			</div>
		</div>

		{#if data.ratingEvents.length}
			<div class="grid gap-4 border-t border-agp-border p-6 sm:grid-cols-2 sm:p-8">
				{#each data.ratingEvents as event}
					<div class="rounded-2xl bg-stone-100 p-5">
						<p class="font-bold text-agp-muted">{name(event.memberId)}</p>
						<p
							class="mt-2 text-3xl font-black {event.ratingDelta > 0
								? 'text-agp-green'
								: 'text-red-600'}"
						>
							{event.ratingDelta > 0 ? '+' : ''}{event.ratingDelta}
						</p>
						<p class="text-agp-muted">{event.ratingBefore} → {event.ratingAfter}</p>
					</div>
				{/each}
			</div>
		{/if}
	</Card>

	{#if data.match.status === 'pending'}
		<Card class="overflow-hidden border-orange-200">
			<div class="border-b border-orange-200 bg-orange-50 p-6">
				<h2 class="flex items-center gap-3 text-2xl font-black text-agp-ink">
					<AlertTriangle class="text-orange-600" /> Aguardando revisão
				</h2>
				<p class="mt-2 text-agp-muted">
					O adversário precisa confirmar ou contestar para essa partida sair do limbo.
				</p>
			</div>
			<div class="p-6">
				{#if data.canReview}
					<form
						method="POST"
						class="grid gap-3 sm:grid-cols-[1fr_auto]"
						onsubmit={() => {
							actionInProgress = true;
						}}
					>
						<button
							formaction="?/confirm"
							disabled={actionInProgress}
							class="inline-flex items-center justify-center gap-2 rounded-2xl bg-agp-green px-5 py-4 font-black text-white disabled:opacity-60"
						>
							<CheckCircle2 size={20} /> Confirmar resultado
						</button>
						<button
							formaction="?/dispute"
							disabled={actionInProgress}
							class="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 font-black text-red-700 disabled:opacity-60"
						>
							<X size={20} /> Contestar
						</button>
					</form>
				{:else}
					<p class="rounded-2xl bg-stone-100 p-5 font-bold text-agp-muted">
						Você pode acompanhar essa partida, mas só o adversário de quem enviou pode confirmar ou
						contestar.
					</p>
				{/if}
			</div>
		</Card>
	{/if}

	{#if data.match.notes}
		<Card class="p-6 text-agp-muted">{data.match.notes}</Card>
	{/if}
</section>
