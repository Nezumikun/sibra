import { EnumWind } from '~/types/EnumWind'

export default function (wind: EnumWind): string {
  return wind === EnumWind.EAST
    ? 'Восток'
    : wind === EnumWind.SOUTH
      ? 'Юг'
      : wind === EnumWind.WEST
        ? 'Запад'
        : 'Север'
}
