<script lang="ts">
	import { formatStatus } from '$lib/format';
	let { data, form } = $props();
	const name = (id: string) => data.members.find((m) => m.id === id)?.displayName ?? 'Jogador';
</script>

<section class="space-y-6">
	<div>
		<p class="font-bold uppercase text-emerald-700">Admin</p>
		<h1 class="text-4xl font-black text-emerald-950">Painel simples</h1>
	</div>
	{#if form?.message}<p class="rounded-2xl bg-red-50 p-3 text-red-700">{form.message}</p>{/if}
	<form
		method="POST"
		action="?/addMember"
		class="grid gap-3 rounded-3xl bg-white p-6 shadow-sm sm:grid-cols-4"
	>
		<input
			name="email"
			placeholder="email@exemplo.com"
			class="rounded-xl border p-3"
			required
		/><input name="displayName" placeholder="Nome no ranking" class="rounded-xl border p-3" /><label
			class="flex items-center gap-2 font-bold"
			><input type="checkbox" name="isAdmin" /> Admin</label
		><button class="rounded-full bg-emerald-950 px-4 py-3 font-black text-white"
			>Adicionar membro</button
		>
	</form>
	<div class="grid gap-4 md:grid-cols-2">
		<div class="rounded-3xl bg-white p-6 shadow-sm">
			<h2 class="font-black">Membros</h2>
			{#each data.members as member}<p>
					{member.displayName}
					{member.isAdmin ? '· admin' : ''}
				</p>{/each}
		</div>
		<div class="rounded-3xl bg-white p-6 shadow-sm">
			<h2 class="font-black">Pendentes e contestadas</h2>
			{#each data.matches as match}<form
					method="POST"
					action="?/cancelMatch"
					class="my-3 rounded-2xl border p-3"
				>
					<input type="hidden" name="matchId" value={match.id} />
					<p>
						{name(match.playerOneMemberId)} x {name(match.playerTwoMemberId)} · {formatStatus(
							match.status
						)}
					</p>
					<button class="mt-2 rounded-full bg-red-100 px-3 py-2 font-bold text-red-800"
						>Cancelar partida</button
					>
				</form>{:else}<p class="text-slate-500">Nada para resolver.</p>{/each}
		</div>
	</div>
</section>
