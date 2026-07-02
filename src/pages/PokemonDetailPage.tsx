import { Link, useParams } from "react-router-dom";
import { useQueries, useQuery } from "@tanstack/react-query";
import {
  getEvolutionChain,
  getPokemonByType,
  getPokemonDetail,
  getPokemonSpecies,
} from "@/services/pokeapi";
import {
  STAT_LABELS,
  TYPE_TINTS,
  bestSprite,
  computeWeaknesses,
  formatPokemonName,
  genderRatio,
  heightToMeters,
  speciesGenus,
  weightToKilograms,
} from "@/lib/pokemon";
import { TypeBadge } from "@/components/TypeBadge";
import { FavoriteButton } from "@/components/FavoriteButton";
import { StatBar } from "@/components/StatBar";
import { EvolutionChain } from "@/components/EvolutionChain";
import type { PokemonType } from "@/types/pokeapi";

export function PokemonDetailPage() {
  const { name } = useParams<{ name: string }>();

  const detailQuery = useQuery({
    queryKey: ["pokemon-detail", name],
    queryFn: () => getPokemonDetail(name as string),
    enabled: Boolean(name),
    staleTime: Infinity,
  });

  const speciesQuery = useQuery({
    queryKey: ["pokemon-species", name],
    queryFn: () => getPokemonSpecies(name as string),
    enabled: Boolean(name),
    staleTime: Infinity,
  });

  const evolutionQuery = useQuery({
    queryKey: ["evolution-chain", speciesQuery.data?.evolution_chain.url],
    queryFn: () => getEvolutionChain(speciesQuery.data!.evolution_chain.url),
    enabled: Boolean(speciesQuery.data),
    staleTime: Infinity,
  });

  const pokemonTypeNames =
    detailQuery.data?.types.map((t) => t.type.name) ?? [];
  const typeQueries = useQueries({
    queries: pokemonTypeNames.map((type) => ({
      queryKey: ["pokemon-type", type],
      queryFn: () => getPokemonByType(type),
      staleTime: Infinity,
    })),
  });

  if (detailQuery.isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 text-center text-neutral-500">
        Carregando...
      </div>
    );
  }

  if (detailQuery.isError || !detailQuery.data) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 text-center text-neutral-500">
        Não foi possível carregar este pokémon.{" "}
        <Link to="/" className="text-brand-500 underline">
          Voltar
        </Link>
      </div>
    );
  }

  const pokemon = detailQuery.data;
  const sprite = bestSprite(pokemon.sprites);
  const primaryType = pokemon.types[0]?.type.name as PokemonType | undefined;
  const headerTint = primaryType ? TYPE_TINTS[primaryType] : "bg-neutral-100";

  const flavorText =
    speciesQuery.data?.flavor_text_entries.find(
      (e) => e.language.name === "pt-BR" || e.language.name === "pt",
    )?.flavor_text ??
    speciesQuery.data?.flavor_text_entries.find((e) => e.language.name === "en")
      ?.flavor_text;

  const genus = speciesQuery.data ? speciesGenus(speciesQuery.data) : null;
  const gender = speciesQuery.data
    ? genderRatio(speciesQuery.data.gender_rate)
    : null;
  const primaryAbility =
    pokemon.abilities.find((a) => !a.is_hidden) ?? pokemon.abilities[0];

  const weaknesses =
    typeQueries.length > 0 && typeQueries.every((q) => q.data)
      ? computeWeaknesses(
          pokemonTypeNames,
          typeQueries.map((q) => q.data!),
        )
      : [];

  return (
    <div className="mx-auto max-w-3xl sm:px-4 sm:py-6">
      <div className="overflow-hidden bg-white sm:rounded-3xl sm:border sm:border-neutral-200 sm:shadow-sm">
        <div
          className={`flex flex-col items-center px-6 pb-8 pt-4 ${headerTint}`}
        >
          <div className="mb-2 flex w-full items-center justify-between">
            <Link
              to="/"
              aria-label="Voltar"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/70 text-neutral-700"
            >
              ←
            </Link>
            <FavoriteButton name={pokemon.name} size="md" />
          </div>
          {sprite && (
            <img
              src={sprite}
              alt={pokemon.name}
              className="h-40 w-40 object-contain sm:h-52 sm:w-52"
            />
          )}
        </div>

        <div className="px-6 py-5">
          <span className="text-xs font-semibold text-neutral-400">
            Nº{String(pokemon.id).padStart(3, "0")}
          </span>
          <h1 className="text-2xl font-bold text-neutral-800">
            {formatPokemonName(pokemon.name)}
          </h1>
          <div className="mt-2 flex gap-1.5">
            {pokemon.types.map((slot) => (
              <TypeBadge key={slot.type.name} type={slot.type.name} />
            ))}
          </div>

          {flavorText && (
            <p className="mt-3 text-sm text-neutral-500">
              {flavorText.replace(/\f|\n/g, " ")}
            </p>
          )}

          <Link
            to={`/comparar?a=${pokemon.name}`}
            className="mt-3 inline-block rounded-full border border-brand-500 px-4 py-1.5 text-sm font-semibold text-brand-500 hover:bg-brand-50"
          >
            Comparar este pokémon
          </Link>

          <div className="mt-5 grid grid-cols-2 divide-x divide-neutral-100 rounded-xl border border-neutral-100">
            <InfoCell
              icon="⚖️"
              label="PESO"
              value={`${weightToKilograms(pokemon.weight)} kg`}
            />
            <InfoCell
              icon="📏"
              label="ALTURA"
              value={`${heightToMeters(pokemon.height)} m`}
            />
          </div>

          <div className="mt-3 grid grid-cols-2 divide-x divide-neutral-100 rounded-xl border border-neutral-100">
            <InfoCell icon="🏷️" label="CATEGORIA" value={genus ?? "—"} />
            <InfoCell
              icon="✨"
              label="HABILIDADE"
              value={
                primaryAbility
                  ? formatPokemonName(primaryAbility.ability.name)
                  : "—"
              }
            />
          </div>

          {gender && (
            <section className="mt-5">
              <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-neutral-500">
                Gênero
              </h2>
              <div className="flex h-2.5 overflow-hidden rounded-full bg-neutral-100">
                <div
                  className="bg-sky-400"
                  style={{ width: `${gender.male}%` }}
                />
                <div
                  className="bg-pink-400"
                  style={{ width: `${gender.female}%` }}
                />
              </div>
              <div className="mt-1 flex justify-between text-xs font-semibold text-neutral-500">
                <span>♂ {gender.male.toFixed(1)}%</span>
                <span>♀ {gender.female.toFixed(1)}%</span>
              </div>
            </section>
          )}

          {weaknesses.length > 0 && (
            <section className="mt-5">
              <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-neutral-500">
                Fraquezas
              </h2>
              <div className="grid grid-cols-2 gap-1.5">
                {weaknesses.map((type) => (
                  <TypeBadge
                    key={type}
                    type={type}
                    className="justify-center"
                  />
                ))}
              </div>
            </section>
          )}

          <section className="mt-5">
            <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-neutral-500">
              Estatísticas base
            </h2>
            <div className="flex flex-col gap-2">
              {pokemon.stats.map((s) => (
                <StatBar
                  key={s.stat.name}
                  label={STAT_LABELS[s.stat.name] ?? s.stat.name}
                  value={s.base_stat}
                />
              ))}
            </div>
          </section>

          <section className="mt-5">
            <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-neutral-500">
              Evoluções
            </h2>
            {evolutionQuery.data ? (
              <EvolutionChain chain={evolutionQuery.data.chain} />
            ) : (
              <p className="text-sm text-neutral-400">Carregando...</p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

function InfoCell({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2 px-3 py-3">
      <span aria-hidden="true">{icon}</span>
      <div>
        <div className="text-[10px] font-semibold uppercase tracking-wide text-neutral-400">
          {label}
        </div>
        <div className="text-sm font-semibold text-neutral-800">{value}</div>
      </div>
    </div>
  );
}
