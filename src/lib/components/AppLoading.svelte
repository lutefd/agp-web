<script lang="ts">
	const cards = Array.from({ length: 4 });
</script>

<div class="pointer-events-none fixed inset-x-0 top-0 z-[60] h-1 overflow-hidden bg-agp-green-soft">
	<div class="h-full w-1/3 animate-[agp-loading_1.1s_ease-in-out_infinite] bg-agp-green"></div>
</div>

<div class="mx-auto max-w-[92rem] px-4 py-6 sm:px-5 lg:px-10 lg:py-8">
	<div class="animate-pulse space-y-8">
		<div class="mx-auto max-w-3xl space-y-4 text-center">
			<div class="mx-auto h-10 w-40 rounded-2xl bg-agp-green-soft"></div>
			<div class="mx-auto h-14 w-11/12 rounded-3xl bg-stone-200/80 sm:h-20"></div>
			<div class="mx-auto h-6 w-2/3 rounded-2xl bg-stone-200/80"></div>
		</div>

		<div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
			{#each cards as _}
				<div class="rounded-[1.6rem] border border-agp-border bg-white p-6 shadow-sm">
					<div class="mb-6 h-14 w-14 rounded-2xl bg-agp-green-soft"></div>
					<div class="mb-3 h-4 w-24 rounded-xl bg-stone-200"></div>
					<div class="h-8 w-40 rounded-xl bg-stone-200"></div>
				</div>
			{/each}
		</div>

		<div class="overflow-hidden rounded-[1.6rem] border border-agp-border bg-white shadow-sm">
			<div class="border-b border-agp-border bg-stone-100/70 px-6 py-5">
				<div class="h-5 w-48 rounded-xl bg-stone-200"></div>
			</div>
			<div class="divide-y divide-agp-border">
				{#each [1, 2, 3] as _}
					<div class="grid gap-4 px-6 py-6 lg:grid-cols-[4rem_1fr_8rem_8rem] lg:items-center">
						<div class="h-12 w-12 rounded-full bg-stone-200"></div>
						<div class="space-y-2">
							<div class="h-6 w-52 rounded-xl bg-stone-200"></div>
							<div class="h-4 w-32 rounded-xl bg-stone-200"></div>
						</div>
						<div class="h-8 w-20 rounded-xl bg-stone-200"></div>
						<div class="h-8 w-24 rounded-xl bg-stone-200"></div>
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>
