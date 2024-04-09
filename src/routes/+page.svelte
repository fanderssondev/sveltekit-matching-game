<script lang="ts">
	import '../app.css';
	import { emojis } from '$lib/emojis';

	type State = 'Start' | 'Playing' | 'Won' | 'Lost' | 'Pause';

	let state: State = 'Playing';

	let size = 20;
	let grid = createGrid();
	let maxMatches = grid.length / 2;
	let selected: number[] = [];
	let matches: string[] = [];

	function createGrid(): string[] {
		let cards = new Set<string>();

		let maxSize = size / 2;

		while (cards.size < maxSize) {
			const randomIndex = Math.floor(Math.random() * emojis.length);
			cards.add(emojis[randomIndex]);
		}

		return shuffleCards([...cards, ...cards]);
	}

	function shuffleCards(array: string[]): string[] {
		return array.sort(() => Math.random() - 0.5);
	}

	function selectCard(cardIndex: number): void {
		selected = selected.concat(cardIndex);
	}

	function matchCards(): void {
		const [first, second] = selected;

		if (grid[first] === grid[second]) {
			matches = matches.concat(grid[first]);
		}

		// Clear selected
		setTimeout(() => (selected = []), 300);
	}

	function gameWon() {
		state === 'Won';
	}

	$: selected.length === 2 && matchCards();
	$: maxMatches === matches.length && gameWon();
</script>

{#if state === 'Start'}
	<h1>Matching Game</h1>
	<button on:click={() => state === 'Playing'}>Play</button>
{/if}

{#if state === 'Playing'}
	<div class="matches">
		{#each matches as match}
			<div>{match}</div>
		{/each}
	</div>

	<div class="cards">
		{#each grid as card, cardIndex}
			{@const isSelected = selected.includes(cardIndex)}
			{@const isSelectedOrMatch = isSelected || matches.includes(card)}
			{@const match = matches.includes(card)}

			<button
				class="card"
				class:selected={isSelected}
				disabled={isSelectedOrMatch}
				on:click={() => selectCard(cardIndex)}
			>
				<div class:match>{card}</div>
			</button>
		{/each}
	</div>
{/if}

{#if state === 'Won'}
	<h1>You win! 🏆</h1>
	<button on:click={() => state === 'Playing'}>Play again</button>
{/if}

{#if state === 'Lost'}
	<h1>You loose! 💩</h1>
	<button on:click={() => state === 'Playing'}>Play again</button>
{/if}

{#if state === 'Pause'}
	<!-- Todo -->
{/if}

<style>
	.cards {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		gap: 0.4rem;
	}

	.card {
		--size: 140px;

		height: var(--size);
		aspect-ratio: 1;
		font-size: 4rem;
		background-color: var(--bg-2);

		&.selected {
			border: 4px solid var(--border);
		}

		& .match {
			transition: opacity 0.3s ease-out;
			opacity: 0.3;
		}
	}

	.matches {
		display: flex;
		gap: 1rem;
		margin-block: 2rem;
		font-size: 3rem;
	}
</style>
