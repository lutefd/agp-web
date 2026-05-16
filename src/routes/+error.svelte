<script lang="ts">
	import Button from '$lib/components/ui/button.svelte';
	import Card from '$lib/components/ui/card.svelte';
	import { page } from '$app/state';
	import { ShieldAlert } from '@lucide/svelte';

	const title = $derived(page.status === 403 ? 'Acesso bloqueado' : 'Algo saiu errado');
	const message = $derived(
		page.status === 403
			? 'Você não tem permissão para fazer isso nessa partida ou nessa liga.'
			: page.error?.message || 'Não conseguimos completar essa jogada.'
	);
</script>

<svelte:head>
	<title>{title} | AGP</title>
</svelte:head>

<section class="mx-auto flex min-h-[65vh] max-w-3xl items-center py-10">
	<Card class="w-full overflow-hidden">
		<div class="bg-gradient-to-br from-red-50 via-white to-agp-green-soft p-8 sm:p-10">
			<div
				class="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100 text-red-700"
			>
				<ShieldAlert size={34} />
			</div>
			<p class="font-bold uppercase tracking-widest text-red-700">Erro {page.status}</p>
			<h1 class="mt-3 font-serif text-5xl font-black text-agp-ink sm:text-6xl">{title}</h1>
			<p class="mt-5 text-xl leading-relaxed text-agp-muted">{message}</p>
		</div>
		<div class="grid gap-3 p-6 sm:flex sm:p-8">
			<Button href="/matches">Ver partidas</Button>
			<Button href="/leaderboard" variant="outline">Voltar ao ranking</Button>
		</div>
	</Card>
</section>
