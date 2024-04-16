<script lang="ts">
	export let card: string;
	export let isSelected: boolean;
	export let match: boolean;
	export let cardIndex: number;
	export let selectCard: (cardIndex: number) => void;

	$: isSelectedOrMatch = isSelected || match;
</script>

<button
	class="card"
	class:selected={isSelected}
	class:flip={isSelectedOrMatch}
	disabled={isSelectedOrMatch}
	on:click={() => selectCard(cardIndex)}
>
	<div class="back" class:match>{card}</div>
</button>

<style>
	.card {
		--size: 140px;

		height: var(--size);
		aspect-ratio: 1;
		font-size: 4rem;
		background-color: var(--bg-2);
		transition: rotate 0.3s ease-out;
		transform-style: preserve-3d;

		&.selected {
			border: 4px solid var(--border);
		}

		&.flip {
			rotate: y 180deg;
			pointer-events: none;
		}

		& .back {
			position: absolute;
			inset: 0;
			display: grid;
			place-content: center;
			backface-visibility: hidden;
			rotate: y 180deg;
		}

		& .match {
			transition: opacity 0.3s ease-out;
			opacity: 0.5;
		}
	}
</style>
