<script lang="ts">
	let { data, form } = $props();
	const defaultOpponentId = $derived(
		data.members.find((member) => member.id !== data.member.id)?.id ?? ''
	);
	let opponentMemberId = $state('');
	let submitted = $state(false);
	const selectedOpponentId = $derived(opponentMemberId || defaultOpponentId);
	const selectedOpponent = $derived(
		data.members.find((member) => member.id === selectedOpponentId)
	);
	const winnerOptions = $derived(
		selectedOpponent ? [data.member, selectedOpponent] : [data.member]
	);
</script>

<svelte:head>
	<title>Registrar partida | AGP</title>
	<meta name="description" content="Registrar resultado de uma partida da AGP." />
</svelte:head>

<section class="mx-auto max-w-2xl space-y-6">
	<div>
		<p class="text-sm font-bold uppercase text-emerald-700">Nova partida</p>
		<h1 class="text-4xl font-black text-emerald-950">Enviar resultado</h1>
		<p class="text-slate-600">O resultado só muda o ranking depois que o adversário confirmar.</p>
	</div>
	<form
		method="POST"
		class="space-y-4 rounded-3xl bg-white p-6 shadow-sm"
		onsubmit={() => {
			submitted = true;
		}}
	>
		{#if form?.message}<p class="rounded-2xl bg-red-50 p-3 text-red-700">{form.message}</p>{/if}
		<label class="block font-bold">
			Adversário
			<select
				bind:value={opponentMemberId}
				name="opponentMemberId"
				class="mt-1 w-full rounded-xl border p-3"
				required
			>
				{#each data.members.filter((member) => member.id !== data.member.id) as member}
					<option value={member.id}>{member.displayName}</option>
				{/each}
			</select>
		</label>
		<label class="block font-bold">
			Vencedor
			<select name="winnerMemberId" class="mt-1 w-full rounded-xl border p-3" required>
				{#each winnerOptions as member}
					<option value={member.id}>{member.displayName}</option>
				{/each}
			</select>
		</label>
		<label class="block font-bold"
			>Placar<input
				name="scoreText"
				placeholder="6-1 4-6 10-8"
				inputmode="text"
				pattern="[0-9]+[-–][0-9]+(\s+[0-9]+[-–][0-9]+)*"
				title="Use espaços entre sets. Exemplo: 6-1 4-6 10-8"
				class="mt-1 w-full rounded-xl border p-3"
				required
			/><span class="mt-1 block text-sm font-normal text-slate-500"
				>Use espaços entre sets. Exemplo: 6-1 4-6 10-8</span
			></label
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
			<button
				class="rounded-full bg-emerald-950 px-5 py-3 font-black text-white disabled:opacity-60"
				disabled={submitted}>{submitted ? 'Enviando...' : 'Enviar resultado'}</button
			><a class="rounded-full px-5 py-3 font-bold" href="/matches">Cancelar</a>
		</div>
	</form>
</section>
