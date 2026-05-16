<script lang="ts">
	import { cn } from '$lib/utils';

	let {
		class: className = '',
		variant = 'default',
		size = 'default',
		href,
		children,
		...rest
	}: {
		class?: string;
		variant?: 'default' | 'outline' | 'ghost' | 'destructive';
		size?: 'default' | 'sm' | 'lg' | 'icon';
		href?: string;
		children?: import('svelte').Snippet;
		[key: string]: unknown;
	} = $props();

	const variants = {
		default: 'bg-agp-green text-white shadow-sm hover:bg-agp-green/95',
		outline: 'border border-agp-border bg-white text-agp-ink hover:bg-agp-cream',
		ghost: 'text-agp-muted hover:bg-agp-soft hover:text-agp-green',
		destructive: 'border border-red-200 bg-red-50 text-red-700 hover:bg-red-100'
	};
	const sizes = {
		default: 'h-12 px-5 text-base',
		sm: 'h-9 px-3 text-sm',
		lg: 'h-14 px-7 text-lg',
		icon: 'h-11 w-11'
	};
	const classes = $derived(
		cn(
			'inline-flex items-center justify-center gap-2 rounded-2xl font-bold transition-colors disabled:pointer-events-none disabled:opacity-50',
			variants[variant],
			sizes[size],
			className
		)
	);
</script>

{#if href}
	<a class={classes} {href} {...rest}>{@render children?.()}</a>
{:else}
	<button class={classes} {...rest}>{@render children?.()}</button>
{/if}
