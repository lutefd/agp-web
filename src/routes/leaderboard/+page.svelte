<script lang="ts">
	let { data } = $props();
</script>

<section class="space-y-6">
	<div><p class="text-sm font-bold uppercase text-emerald-700">Ranking</p><h1 class="text-4xl font-black text-emerald-950">Quem manda na quadra?</h1></div>
	<div class="overflow-hidden rounded-3xl border border-emerald-900/10 bg-white shadow-sm">
		<table class="w-full min-w-[720px] text-left text-sm">
			<thead class="bg-emerald-950 text-white"><tr><th class="p-4">Posição</th><th>Jogador</th><th>Rating</th><th>Vitórias</th><th>Derrotas</th><th>Partidas</th><th>Forma recente</th></tr></thead>
			<tbody>
				{#each data.members as member, index}
					<tr class="border-t border-emerald-900/10"><td class="p-4 font-black">#{index + 1}</td><td><a class="font-bold text-emerald-800" href={`/players/${member.id}`}>{member.displayName}</a></td><td class="font-black">{member.currentRating}</td><td>{member.wins}</td><td>{member.losses}</td><td>{member.matchesPlayed}</td><td>{data.formByMember[member.id]?.join(' ') || 'Sem partidas'}</td></tr>
				{:else}<tr><td class="p-6 text-center text-slate-500" colspan="7">Nenhum jogador na liga ainda.</td></tr>{/each}
			</tbody>
		</table>
	</div>
</section>
