import { AbstractEntity } from 'common/abstract.entity';

export function MapDto(items: AbstractEntity[]) {
  return items.map(elements => {
    return elements.toDto();
  });
}
