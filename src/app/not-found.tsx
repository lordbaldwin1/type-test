import Link from 'next/link'
 
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen max-w-md mx-auto text-center tracking-wider">
      <h2 className="text-2xl font-semibold">Stop! You violated the law!</h2>
      <p className="text-sm text-muted-foreground max-w-sm">Just kidding, this is the <b className="text-lg">404 page.</b> I tried searching everywhere for this page but it appears it doesn&apos;t exist.</p>
      <Link href="/" className="text-xl underline">return home</Link>
    </div>
  )
}