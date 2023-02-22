// Need to use the React-specific entry point to allow generating React hooks
import { useQuery } from "@tanstack/react-query";
import type { Pokemon } from "./types";

const baseUrl = "https://pokeapi.co/api/v2";

async function fetchJson<T>(input: RequestInfo | URL): Promise<T> {
  const response = await fetch(input);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
}

// Export hook for specified endpoint
export function useGetPokemonByNameQuery(name: string) {
  return useQuery({
    queryKey: ["getPokemonByName", { name }],
    queryFn: () => fetchJson<Pokemon>(`${baseUrl}/pokemon/${name}`),
  });
}
