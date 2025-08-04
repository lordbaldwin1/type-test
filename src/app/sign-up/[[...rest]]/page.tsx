import { SignUp, SignedIn, SignedOut } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function SignUpPage() {
  const { userId } = await auth();
  
  // If user is already signed in, redirect to home
  if (userId) {
    redirect("/");
  }

  return (
    <div className="flex h-full w-full items-center justify-center">
      <SignedOut>
        <SignUp 
          redirectUrl="/login"
          signInUrl="/login"
          appearance={{
            elements: {
              formButtonPrimary: "bg-primary text-primary-foreground hover:bg-primary/90",
              card: "bg-card text-card-foreground shadow-lg",
            },
            layout: {
              socialButtonsPlacement: "top",
            }
          }}
        />
      </SignedOut>
      <SignedIn>
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold">Redirecting...</h1>
        </div>
      </SignedIn>
    </div>
  );
} 