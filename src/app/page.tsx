import { Button } from "@/components/ui/button";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const { userId } = await auth();

  if (userId != null) {
    redirect("/events");
  }

  return (
    <div className="text-center container my-4 mx-auto">
      <div className="text-3xl mb-4">Fancy home page</div>
      <div className="flex gap-2 justify-center">
        <Button asChild>
          <SignInButton />
        </Button>
        <Button asChild>
          <SignUpButton />
        </Button>
      </div>
    </div>
  );
}
