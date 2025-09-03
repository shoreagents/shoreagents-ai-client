"use client"

import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardFooter, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUpIcon } from "lucide-react"
import Image from "next/image"
import { useAuth } from "@/contexts/auth-context"

interface GrowthRateCardProps {
  className?: string
}

interface MemberInfo {
  country: string
}

export function GrowthRateCard({ className }: GrowthRateCardProps) {
  const { user } = useAuth()
  const [memberInfo, setMemberInfo] = useState<MemberInfo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMemberInfo = async () => {
      if (!user?.memberId) {
        setLoading(false)
        return
      }

      try {
        const response = await fetch(`/api/members?memberId=${user.memberId}`)
        if (response.ok) {
          const data = await response.json()
          setMemberInfo(data)
        }
      } catch (error) {
        console.error('Failed to fetch member info:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMemberInfo()
  }, [user?.memberId])

  return (
    <Card className={`@container/card relative overflow-hidden ${className}`}>
      <CardHeader className="relative">
        <CardTitle>Connect</CardTitle>
        <CardDescription>Chat and collaborate with your team in real time via Connect chat.</CardDescription>
      </CardHeader>
      <CardContent className="relative w-full grid">
        {/* Globe aligned at bottom and overlapping the card without absolute positioning */}
        <div className="col-start-1 row-start-1 w-full flex items-end justify-center">
          <Image
            src="https://sanljwkkoawwdpaxrper.supabase.co/storage/v1/object/public/designs/global.png"
            alt="Growth Globe"
            width={520}
            height={520}
            className="pointer-events-none select-none w-[110%] h-auto object-contain mb-[-250px]"
          />
        </div>
      </CardContent>
      <CardFooter className="flex-col items-start gap-1 text-sm">
      </CardFooter>
      {/* Bottom aligned badge overlay */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
        <Badge variant="outline" className="rounded-full text-sm px-3 py-1 bg-white/80 backdrop-blur-sm border-border text-black">
          Coming Soon
        </Badge>
      </div>
    </Card>
  )
}
