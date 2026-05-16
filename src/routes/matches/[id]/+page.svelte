<script lang="ts">
	import { formatDate, formatStatus } from '$lib/format';
	let { data } = $props();
	const name = (id) => data.members.find((m) => m.id === id)?.displayName ?? 'Jogador';
</script>

<section class="mx-auto max-w-3xl space-y-6 rounded-3xl bg-white p-6 shadow-sm">
	<p class="font-bold uppercase text-emerald-700">{formatStatus(data.match.status)}</p>
	<h1 class="text-4xl font-black text-emerald-950">{name(data.match.winnerMemberId)} venceu {data.match.winnerMemberId === data.match.playerOneMemberId ? name(data.match.playerTwoMemberId) : name(data.match.playerOneMemberId)}</h1>
	<p class="text-2xl font-black">{data.match.scoreText}</p>
	<p>Jogado em {formatDate(data.match.playedAt)}</p>
	{#if data.ratingEvents.length}<div class="rounded-2xl bg-emerald-50 p-4"><h2 class="font-black">Mudança de rating</h2>{#each data.ratingEvents as event}<p>{name(event.memberId)}: {event.ratingDelta > 0 ? '+' : ''}{event.ratingDelta} ({event.ratingBefore} → {event.ratingAfter})</p>{/each}</div>{/if}
	{#if data.match.status === 'pending'}<p class="rounded-2xl bg-amber-50 p-4">Aguardando confirmação do adversário.</p><form method="POST" class="flex gap-3"><button formaction="?/confirm" class="rounded-full bg-emerald-950 px-5 py-3 font-black text-white">Confirmar resultado</button><button formaction="?/dispute" class="rounded-full bg-red-100 px-5 py-3 font-black text-red-800">Contestar resultado</button></form>{/if}
	{#if data.match.notes}<p class="text-slate-600">{data.match.notes}</p>{/if}
</section>
