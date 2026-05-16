<script lang="ts">
	import Card from '$lib/components/ui/card.svelte';
	let { data } = $props();
</script>

<svelte:head>
	<title>Jogadores | AGP</title>
	<meta name="description" content="Jogadores da Associação dos Guris Profissionais." />
</svelte:head>

<section class="space-y-8">
	<div>
		<p class="font-bold uppercase text-agp-green">Jogadores</p>
		<h1 class="font-serif text-4xl font-black text-agp-ink sm:text-5xl">Elenco dos guris</h1>
		<p class="mt-2 text-xl text-agp-muted">Todo mundo que está oficialmente na corrida.</p>
	</div>
	<div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
		{#each data.members as member}
			<Card class="p-5 lg:p-6">
				<a class="flex items-center gap-4" href={`/players/${member.id}`}>
					<span
						class="flex h-16 w-16 items-center justify-center rounded-full bg-agp-green-soft text-2xl font-black text-agp-green"
						>{member.displayName.slice(0, 1)}</span
					>
					<span>
						<strong class="block text-2xl text-agp-ink">{member.displayName}</strong>
						<span class="text-agp-muted"
							>{member.currentRating} pts · {member.wins}/{member.losses}</span
						>
					</span>
				</a>
			</Card>
		{/each}
	</div>
</section>
