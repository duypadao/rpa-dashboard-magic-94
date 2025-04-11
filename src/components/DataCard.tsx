
export const DataCard = ({
  title,
  value,
  rate,
  description,
  description2
}) => {
  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow @container/card">
      <div className="flex flex-col space-y-1.5 p-6 relative">
        <div className="text-sm text-muted-foreground">{title}</div>
        <div className="tracking-tight text-5xl text-2xl font-semibold tabular-nums">{value}</div>
        {rate && (<div className="absolute right-4 top-4">
          <div className="items-center border px-2.5 py-0.5 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground flex gap-1 rounded-lg text-xs">
            {/* <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-trending-up size-3">
              <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
              <polyline points="16 7 22 7 22 13"></polyline>
            </svg> */}
            {rate} %
          </div>
        </div>)}

      </div>
      <div className="flex p-6 pt-0 flex-col items-start gap-1 text-sm">
        <div className="line-clamp-1 flex gap-2 font-medium">{description}
          {/* <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-trending-up size-4">
            <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
            <polyline points="16 7 22 7 22 13"></polyline>
          </svg> */}
        </div>
        <div className="text-muted-foreground">{description2}</div>
      </div>
    </div>
  )
}
