import type { ContainerInput, ContainerOptions } from '../types';

function isOptions(value: unknown): value is ContainerOptions {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }

  return 'color' in (value as Record<string, unknown>);
}

/**
 * Splits the overloaded container inputs into options and components.
 *
 * @param args Container arguments.
 * @returns Normalized container options and component list.
 */
export function splitContainerArgs(
  args: [ContainerOptions, ...ContainerInput[]] | ContainerInput[],
) {
  const head = args[0];

  if (!isOptions(head)) {
    return {
      options: {} as ContainerOptions,
      components: args as ContainerInput[],
    };
  }

  return {
    options: head,
    components: args.slice(1) as ContainerInput[],
  };
}
