<script lang="ts">
	import Button from '$lib/components/ui/button.svelte';
	import Card from '$lib/components/ui/card.svelte';
	import { CheckCircle2, Swords, Trophy, Zap } from '@lucide/svelte';
</script>

<svelte:head>
	<title>AGP | Associação dos Guris Profissionais</title>
	<meta
		name="description"
		content="A liga privada de tênis dos guris, com ranking Elo, partidas confirmadas e rivalidades oficiais."
	/>
</svelte:head>

<section class="space-y-16 pb-12 lg:space-y-24 lg:pb-20">
	<div class="grid items-center gap-10 pt-8 lg:grid-cols-[1.05fr_0.95fr] lg:pt-20">
		<div>
			<div
				class="mb-6 inline-flex items-center gap-3 rounded-2xl bg-agp-green-soft px-4 py-2 font-bold text-agp-green"
			>
				<span class="h-2.5 w-2.5 rounded-full bg-agp-green/60"></span>
				Liga privada dos guris
			</div>
			<h1
				class="max-w-4xl font-serif text-5xl font-black leading-none text-agp-ink sm:text-6xl lg:text-8xl"
			>
				Ranking sério para partidas nem tão sérias.
			</h1>
			<p class="mt-6 max-w-2xl text-xl leading-relaxed text-agp-muted sm:text-2xl">
				A AGP registra resultados, confirma partidas e transforma cada vitória do churras em pontos
				no Elo oficialíssimo.
			</p>
			<div class="mt-8 flex flex-col gap-3 sm:flex-row">
				<Button href="/login" size="lg">Entrar na liga</Button>
				<Button href="/rules" variant="outline" size="lg">Ver regras</Button>
			</div>
			<p class="mt-4 text-sm font-bold text-agp-muted">
				Acesso por convite. Sem peladeiro aleatório no ranking.
			</p>
		</div>

		<Card class="overflow-hidden">
			<div class="bg-gradient-to-br from-agp-green-soft to-white p-6 sm:p-8">
				<div class="flex items-center justify-between gap-4">
					<div>
						<p class="text-agp-muted">Líder imaginário</p>
						<h2 class="font-serif text-4xl font-black text-agp-ink">Luis Dourado</h2>
					</div>
					<p class="font-serif text-5xl font-black text-agp-green">1042</p>
				</div>
			</div>
			<div class="space-y-4 p-6 sm:p-8">
				<div class="grid grid-cols-[3rem_1fr_auto] items-center gap-4 rounded-2xl bg-stone-100 p-4">
					<span
						class="flex h-12 w-12 items-center justify-center rounded-full bg-agp-green text-xl font-black text-white"
						>L</span
					>
					<div>
						<b>Pietro venceu Kdinho</b>
						<p class="text-sm text-agp-muted">6-4 3-6 10-8</p>
					</div>
					<span class="font-black text-agp-green">+18</span>
				</div>
				<div class="grid grid-cols-[3rem_1fr_auto] items-center gap-4 rounded-2xl bg-orange-50 p-4">
					<span
						class="flex h-12 w-12 items-center justify-center rounded-full bg-agp-green-soft text-xl font-black text-agp-green"
						>J</span
					>
					<div>
						<b>Kdinho reportou vitória</b>
						<p class="text-sm text-agp-muted">Leo precisa confirmar</p>
					</div>
					<span class="font-black text-orange-600">pendente</span>
				</div>
			</div>
		</Card>
	</div>

	<div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
		<Card class="p-6"
			><Trophy class="mb-5 text-agp-gold" />
			<h2 class="text-2xl font-black">Ranking Elo</h2>
			<p class="mt-2 text-agp-muted">Todo mundo começa com 1000 e o resto é na raquete.</p></Card
		>
		<Card class="p-6"
			><CheckCircle2 class="mb-5 text-agp-green" />
			<h2 class="text-2xl font-black">Confirmação obrigatória</h2>
			<p class="mt-2 text-agp-muted">Resultado só vale depois do adversário confirmar.</p></Card
		>
		<Card class="p-6"
			><Swords class="mb-5 text-orange-600" />
			<h2 class="text-2xl font-black">Rivalidades oficiais</h2>
			<p class="mt-2 text-agp-muted">
				Histórico, forma recente e confrontos diretos sem achismo.
			</p></Card
		>
		<Card class="p-6"
			><Zap class="mb-5 text-orange-600" />
			<h2 class="text-2xl font-black">Zebra valorizada</h2>
			<p class="mt-2 text-agp-muted">Ganhar de quem está acima rende mais pontos.</p></Card
		>
	</div>

	<Card class="p-6 sm:p-8">
		<div class="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
			<div>
				<h2 class="font-serif text-4xl font-black text-agp-ink sm:text-5xl">
					Pronto para entrar na briga?
				</h2>
				<p class="mt-3 text-xl text-agp-muted">
					Peça um convite para um admin da liga e venha defender seu rating.
				</p>
			</div>
			<Button href="/login" size="lg">Entrar</Button>
		</div>
	</Card>
</section>
