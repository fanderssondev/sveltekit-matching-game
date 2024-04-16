<script lang="ts">
	import '../app.css';
	import { emojis } from '$lib/emojis';
	import Card from '$lib/Card.svelte';
	import Menu from '$lib/Menu.svelte';
	import Timer from '$lib/Timer.svelte';
	import Matches from '$lib/Matches.svelte';

	let state: State = 'start';

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

	function startGameTimer(): void {
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

	function gameWon(): void {
		state = 'won';
		resetGame();
	}

	function gameLost(): void {
		state = 'lost';
		resetGame();
	}

	function resetGame(): void {
		timerID && clearInterval(timerID);
		grid = createGrid();
		maxMatches = grid.length / 2;
		selected = [];
		matches = [];
		timerID = null;
		time = 60;
	}

	function pauseGame(e: KeyboardEvent): void {
		if (e.key === 'Escape') {
			switch (state) {
				case 'playing':
					state = 'paused';
					break;
				case 'paused':
					state = 'playing';
					break;
			}
		}
	}

	function setState(newState: State): void {
		state = newState;
	}

	$: selected.length === 2 && matchCards();
	$: maxMatches === matches.length && gameWon();
	$: state === 'playing' && !timerID && startGameTimer();
	$: time === 0 && gameLost();
</script>

<svelte:window on:keydown={pauseGame} />

{#if state === 'start'}
	<Menu {setState} newState={'playing'} btnText={'Play'}>Matching Game</Menu>
{/if}

{#if state === 'playing'}
	<Timer {time} />

	<Matches {matches} />

	<div class="cards">
		{#each grid as card, cardIndex}
			{@const isSelected = selected.includes(cardIndex)}
			{@const match = matches.includes(card)}

			<Card {card} {isSelected} {match} {selectCard} {cardIndex} />
		{/each}
	</div>
{/if}

{#if state === 'won'}
	<Menu {setState} newState={'playing'} btnText={'Play again'}>You win! 🏆</Menu>
{/if}

{#if state === 'lost'}
	<Menu {setState} newState={'playing'} btnText={'Play again'}>You loose! 💩</Menu>
{/if}

{#if state === 'paused'}
	<Menu {setState} newState={'playing'} btnText={'Continue'}>Game Paused!</Menu>
{/if}

<style>
	.cards {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		gap: 0.4rem;
	}
</style>
