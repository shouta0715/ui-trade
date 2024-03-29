import { Component, Like, Prisma, User } from "@prisma/client";

function generateComponentLikes({
  components,
  users,
}: {
  components: Component[];
  users: User[];
}): Prisma.LikeCreateManyInput[] {
  const created = components.map((component) => {
    return Array.from({ length: users.length }, (_, j) => ({
      componentId: component.id,
      userId: users[j].id,
    }));
  });

  return created.flat();
}

export async function seedComponentLikes(
  tx: Prisma.TransactionClient,
  components: Component[],
  users: User[]
): Promise<Like[]> {
  const has = await tx.like.findMany();

  if (has.length) {
    return has;
  }

  const created = generateComponentLikes({ components, users });

  await tx.like.createMany({
    data: created,
  });

  return tx.like.findMany();
}
