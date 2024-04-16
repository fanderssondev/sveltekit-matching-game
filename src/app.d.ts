// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
   namespace App {
      // interface Error {}
      // interface Locals {}
      // interface PageData {}
      // interface PageState {}
      // interface Platform {}
   }
   type State = 'start' | 'playing' | 'won' | 'lost' | 'paused';
   type Difficulty = 'easy' | 'medium' | 'hard';
}

export {};
