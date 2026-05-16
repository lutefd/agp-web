<script lang="ts">
	let { data, form } = $props();
</script>

<section class="mx-auto max-w-2xl space-y-6">
	<div>
		<p class="text-sm font-bold uppercase text-emerald-700">Nova partida</p>
		<h1 class="text-4xl font-black text-emerald-950">Enviar resultado</h1>
		<p class="text-slate-600">O resultado só muda o ranking depois que o adversário confirmar.</p>
	</div>
	<form method="POST" class="space-y-4 rounded-3xl bg-white p-6 shadow-sm">
		{#if form?.message}<p class="rounded-2xl bg-red-50 p-3 text-red-700">{form.message}</p>{/if}
		<label class="block font-bold"
			>Adversário<select name="opponentMemberId" class="mt-1 w-full rounded-xl border p-3" required
				>{#each data.members.filter((m) => m.id !== data.member.id) as member}<option
						value={member.id}>{member.displayName}</option
					>{/each}</select
			></label
		>
		<label class="block font-bold"
			>Vencedor<select name="winnerMemberId" class="mt-1 w-full rounded-xl border p-3" required
				>{#each data.members as member}<option value={member.id}>{member.displayName}</option
					>{/each}</select
			></label
		>
		<label class="block font-bold"
			>Placar<input
				name="scoreText"
				placeholder="6-4 3-6 10-8"
				class="mt-1 w-full rounded-xl border p-3"
				required
			/></label
		>
		<label class="block font-bold"
			>Data da partida<input
				name="playedAt"
				type="datetime-local"
				class="mt-1 w-full rounded-xl border p-3"
				required
			/></label
		>
		<label class="block font-bold"
			>Observações<textarea name="notes" class="mt-1 w-full rounded-xl border p-3"
			></textarea></label
		>
		<div class="flex gap-3">
			<button class="rounded-full bg-emerald-950 px-5 py-3 font-black text-white"
				>Enviar resultado</button
			><a class="rounded-full px-5 py-3 font-bold" href="/matches">Cancelar</a>
		</div>
	</form>
</section>
