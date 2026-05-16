<script lang="ts">
	import { formatDate, formatStatus } from '$lib/format';
	let { data } = $props();
	const name = (id: string) => data.members.find((m) => m.id === id)?.displayName ?? 'Jogador';
</script>

<section class="space-y-6">
	<div class="flex flex-wrap items-end justify-between gap-3"><div><p class="text-sm font-bold uppercase text-emerald-700">Partidas</p><h1 class="text-4xl font-black text-emerald-950">Partidas recentes</h1></div><a class="rounded-full bg-lime-300 px-4 py-2 font-black" href="/matches/new">Enviar resultado</a></div>
	<div class="grid gap-4 md:grid-cols-3">
		{#each ['pending', 'disputed', 'confirmed'] as status}
			<div class="rounded-3xl bg-white p-5 shadow-sm"><h2 class="mb-4 font-black">{status === 'pending' ? 'Aguardando confirmação' : status === 'disputed' ? 'Partidas contestadas' : 'Confirmadas'}</h2>
				<div class="space-y-3">{#each data.matches.filter((m) => m.status === status) as match}<a class="block rounded-2xl border p-4 hover:bg-emerald-50" href={`/matches/${match.id}`}><b>{name(match.winnerMemberId)} venceu</b><p>{name(match.playerOneMemberId)} x {name(match.playerTwoMemberId)}</p><p>{match.scoreText}</p><small>{formatStatus(match.status)} · {formatDate(match.playedAt)}</small></a>{:else}<p class="text-sm text-slate-500">Nada por aqui.</p>{/each}</div>
			</div>
		{/each}
	</div>
</section>
