import { createParamDecorator } from "type-graphql";

export default function CurrentUser() {
  return createParamDecorator(
    ({ context }: { context: { userId: string } }) => context.userId
  );
}
