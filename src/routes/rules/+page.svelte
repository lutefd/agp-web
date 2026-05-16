<script lang="ts">
	import Card from '$lib/components/ui/card.svelte';
	import { CheckCircle2, Scale, ShieldAlert, TrendingUp } from '@lucide/svelte';
</script>

<svelte:head>
	<title>Regras | AGP</title>
	<meta name="description" content="Regras do ranking Elo da AGP." />
</svelte:head>

<section class="mx-auto max-w-5xl space-y-10 pb-16">
	<div class="text-center">
		<p class="font-bold uppercase text-agp-green">Regras</p>
		<h1 class="mt-3 font-serif text-6xl font-black text-agp-ink">Manual anti-treta</h1>
		<p class="mx-auto mt-5 max-w-3xl text-2xl text-agp-muted">
			Ranking de amigos só funciona quando todo mundo entende por que subiu ou caiu.
		</p>
	</div>

	<div class="grid gap-5 md:grid-cols-2">
		<Card class="p-7"
			><Scale class="mb-5 text-agp-green" />
			<h2 class="text-2xl font-black">Todos começam com 1000</h2>
			<p class="mt-3 text-lg text-agp-muted">
				A base é igual para todo mundo. Depois disso, a quadra decide.
			</p></Card
		>
		<Card class="p-7"
			><CheckCircle2 class="mb-5 text-agp-green" />
			<h2 class="text-2xl font-black">Só confirmado conta</h2>
			<p class="mt-3 text-lg text-agp-muted">
				Resultado enviado não mexe no ranking até o adversário confirmar.
			</p></Card
		>
		<Card class="p-7"
			><TrendingUp class="mb-5 text-agp-green" />
			<h2 class="text-2xl font-black">Usamos Elo</h2>
			<p class="mt-3 text-lg text-agp-muted">
				Ganhar de alguém acima vale mais. Perder para alguém abaixo custa mais.
			</p></Card
		>
		<Card class="p-7"
			><ShieldAlert class="mb-5 text-orange-600" />
			<h2 class="text-2xl font-black">Placar não altera cálculo</h2>
			<p class="mt-3 text-lg text-agp-muted">
				6-0 ou 7-6 contam como vitória do mesmo jeito nesta versão.
			</p></Card
		>
	</div>

	<Card class="p-8">
		<h2 class="font-serif text-4xl font-black">K-factor</h2>
		<div class="mt-6 grid gap-4 md:grid-cols-3">
			<div class="rounded-2xl bg-agp-green-soft p-5">
				<b class="text-3xl text-agp-green">40</b>
				<p>Primeiras 5 partidas</p>
			</div>
			<div class="rounded-2xl bg-stone-100 p-5">
				<b class="text-3xl text-agp-ink">32</b>
				<p>Da 6ª à 15ª partida</p>
			</div>
			<div class="rounded-2xl bg-stone-100 p-5">
				<b class="text-3xl text-agp-ink">24</b>
				<p>Depois de 15 partidas</p>
			</div>
		</div>
	</Card>
</section>
