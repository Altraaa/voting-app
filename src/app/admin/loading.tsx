export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <main className="flex-1 p-8 bg-muted/30">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="space-y-2">
                <div className="h-7 w-64 bg-muted rounded-lg animate-pulse"></div>
                <div className="h-4 w-80 bg-muted rounded animate-pulse"></div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-9 w-32 bg-muted rounded-md animate-pulse"></div>
                <div className="h-9 w-32 bg-muted rounded-md animate-pulse"></div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="p-6 border-border bg-card rounded-lg border"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-muted rounded-lg animate-pulse"></div>
                    <div className="space-y-2">
                      <div className="h-5 w-24 bg-muted rounded animate-pulse"></div>
                      <div className="h-4 w-32 bg-muted rounded animate-pulse"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="p-6 border-border bg-card rounded-lg border"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-muted rounded-lg animate-pulse"></div>
                  <div className="h-5 w-12 bg-muted rounded animate-pulse"></div>
                </div>
                <div className="h-8 w-16 bg-muted rounded animate-pulse mb-1"></div>
                <div className="h-4 w-20 bg-muted rounded animate-pulse"></div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-8">
            <div className="col-span-2 space-y-8">
              <div className="p-6 border-border bg-card rounded-lg border">
                <div className="flex items-center justify-between mb-4">
                  <div className="space-y-2">
                    <div className="h-6 w-40 bg-muted rounded animate-pulse"></div>
                    <div className="h-4 w-56 bg-muted rounded animate-pulse"></div>
                  </div>
                  <div className="h-9 w-48 bg-muted rounded-md animate-pulse"></div>
                </div>
                <div className="h-80 bg-muted rounded-lg animate-pulse"></div>
              </div>

              <div className="p-0 border-border bg-card rounded-lg border">
                <div className="p-6 pb-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="h-6 w-32 bg-muted rounded animate-pulse"></div>
                      <div className="h-4 w-64 bg-muted rounded animate-pulse"></div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-20 bg-muted rounded-md animate-pulse"></div>
                      <div className="h-8 w-24 bg-muted rounded-md animate-pulse"></div>
                    </div>
                  </div>
                </div>
                <div className="border-t border-border">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center p-4 border-b border-border last:border-b-0"
                    >
                      <div className="flex-1 grid grid-cols-6 gap-4">
                        <div className="h-4 bg-muted rounded animate-pulse"></div>
                        <div className="h-4 bg-muted rounded animate-pulse"></div>
                        <div className="h-4 bg-muted rounded animate-pulse"></div>
                        <div className="h-4 bg-muted rounded animate-pulse"></div>
                        <div className="h-4 bg-muted rounded animate-pulse"></div>
                        <div className="h-6 w-16 bg-muted rounded animate-pulse"></div>
                      </div>
                      <div className="w-8 h-8 bg-muted rounded animate-pulse ml-4"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="p-0 border-border bg-card rounded-lg border">
                <div className="p-6 pb-4">
                  <div className="h-6 w-32 bg-muted rounded animate-pulse"></div>
                </div>
                <div className="space-y-0">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-4 border-b border-border last:border-b-0"
                    >
                      <div className="w-10 h-10 bg-muted rounded-full animate-pulse"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 w-24 bg-muted rounded animate-pulse"></div>
                        <div className="h-3 w-32 bg-muted rounded animate-pulse"></div>
                        <div className="h-2 w-full bg-muted rounded animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-0 border-border bg-card rounded-lg border">
                <div className="p-6 pb-4">
                  <div className="h-6 w-36 bg-muted rounded animate-pulse"></div>
                </div>
                <div className="space-y-0">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-4 border-b border-border last:border-b-0"
                    >
                      <div className="w-2 h-2 bg-muted rounded-full animate-pulse"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 w-28 bg-muted rounded animate-pulse"></div>
                        <div className="h-3 w-40 bg-muted rounded animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
