export function getHeroes(state) {
  return state.heroes.toJSON().list;
}
