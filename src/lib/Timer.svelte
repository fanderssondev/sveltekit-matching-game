<script lang="ts">
	export let time: number;
</script>

<h1 class="timer" class:pulse={time < 10}>{time}</h1>

<style>
	h1 {
		width: max-content;
		margin: 0 auto;
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
