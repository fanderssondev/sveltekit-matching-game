<script lang="ts">
	import '../app.css';
	import { emojis } from '$lib/emojis';

	type State = 'start' | 'playing' | 'won' | 'lost' | 'pause';

	let state: State = 'won';

	let size = 20;
	let grid = createGrid();
	let maxMatches = grid.length / 2;
	let selected: number[] = [];
	let matches: string[] = [];

	let timerID: number | null = null;
	let time = 60;

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

	function startGameTimer() {
		function countDown() {
			state === 'playing' && (time -= 1);
		}

		timerID = setInterval(countDown, 1000);
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
		state = 'won';
		resetGame();
	}

	function gameLost() {
		state = 'lost';
		resetGame();
	}

	function resetGame() {
		timerID && clearInterval(timerID);
		grid = createGrid();
		maxMatches = grid.length / 2;
		selected = [];
		matches = [];
		timerID = null;
		time = 60;
	}

	$: selected.length === 2 && matchCards();
	$: maxMatches === matches.length && gameWon();
	$: state === 'playing' && !timerID && startGameTimer();
	$: time === 0 && gameLost();
</script>

{#if state === 'start'}
	<h1>Matching Game</h1>
	<button on:click={() => (state = 'playing')}>Play</button>
{/if}

{#if state === 'playing'}
	<h1 class="timer" class:pulse={time < 10}>{time}</h1>

	<div class="matches">
		{#each matches as match}
			<div>{match}</div>
		{/each}
	</div>

	<div class="cards">
		{#each grid as card, cardIndex}
			{@const isSelected = selected.includes(cardIndex)}
			{@const match = matches.includes(card)}
			{@const isSelectedOrMatch = isSelected || match}

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

{#if state === 'won'}
	<h1>You win! 🏆</h1>
	<button on:click={() => (state = 'playing')}>Play again</button>
{/if}

{#if state === 'lost'}
	<h1>You loose! 💩</h1>
	<button on:click={() => (state = 'playing')}>Play again</button>
{/if}

{#if state === 'pause'}
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

	.timer {
		transition: color 0.3 ease;
	}

	.pulse {
		color: var(--pulse);
		animation: pulse 1s infinite ease;
	}

	@keyframes pulse {
		to {
			scale: 1.4;
		}
	}
</style>
