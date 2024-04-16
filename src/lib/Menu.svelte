<script lang="ts">
	export let newState: State;
	export let setState: (newState: State) => void;
	export let btnText: string;
</script>

<h1><slot /></h1>
<button on:click={() => setState(newState)}>{btnText}</button>
