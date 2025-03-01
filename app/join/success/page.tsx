import Link from "next/link"
import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function SuccessPage() {
  return (
    <div className="container flex min-h-[calc(100vh-16rem)] items-center justify-center py-10">
      <Card className="mx-auto max-w-md text-center">
        <CardHeader>
          <div className="flex justify-center">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl">Application Submitted!</CardTitle>
          <CardDescription>Thank you for applying to join the IT Club</CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            We&apos;ve received your application and our panel members will review it soon. You&apos;ll receive an email
            notification regarding the status of your application within the next few days.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link href="/">
            <Button>Return to Homepage</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}

