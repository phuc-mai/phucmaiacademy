import { auth } from "@clerk/nextjs"
import { redirect } from "next/navigation"

import DataCard from "@/components/performance/DataCard"
import { getPerformance } from "@/actions/getPerformance"
import Chart from "@/components/performance/Chart"

const Performance = async () => {
  const { userId } = auth()

  if (!userId) {
    return redirect('/sign-in')
  }

  const { data, totalRevenue, totalSales } = await getPerformance(userId)

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <DataCard value={totalSales} label="Total Sales"/>
        <DataCard value={totalRevenue} label="Total Revenue" shouldFormat />
        <Chart data={data} />
      </div>
    </div>
  )
}

export default Performance