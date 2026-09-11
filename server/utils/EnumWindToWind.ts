import { Wind } from '~~/generated/prisma/enums'

export default function (wind: EnumWind): Wind {
  return wind === EnumWind.EAST
    ? Wind.EAST
    : wind === EnumWind.SOUTH
      ? Wind.SOUTH
      : wind === EnumWind.WEST
        ? Wind.WEST
        : Wind.NORTH
}
