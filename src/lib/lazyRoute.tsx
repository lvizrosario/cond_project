import { lazy, Suspense, type ComponentType } from 'react'
import { PageSpinner } from '@/components/shared/LoadingSpinner'

export function lazyRouteComponent(importer: () => Promise<{ default: ComponentType }>) {
  const LazyComponent = lazy(importer)

  return function LazyRouteComponent() {
    return (
      <Suspense fallback={<PageSpinner />}>
        <LazyComponent />
      </Suspense>
    )
  }
}
