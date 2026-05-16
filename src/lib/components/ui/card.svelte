<script lang="ts">
	import { cn } from '$lib/utils';
	let { class: className = '', children }: { class?: string; children?: import('svelte').Snippet } =
		$props();
</script>

<div class={cn('rounded-[1.6rem] border border-agp-border bg-white shadow-sm', className)}>
	{@render children?.()}
</div>
