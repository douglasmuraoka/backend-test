import { Observable } from "rxjs"

/**
 * Helper class to create an async iterable observer.
 *
 * This class subscribes to an Observable, and whenever the
 * Observable publishes a value, it stores as a resolved value
 * (so when the async iterator asks for the next value, it will
 * be ready to serve), or resolves a pending value from the
 * async iterator.
 */
class AsyncIterableObserver<T> implements AsyncIterable<T> {
  observable: Observable<T>
  isDone = false
  resolvedValues: T[] = []
  pendingResolves: { (data: T): void }[] = []

  constructor(observable: Observable<T>) {
    this.observable = observable
  }

  public subscribe(): void {
    this.observable.subscribe(
      next => {
        const pendingResolve = this.pendingResolves.shift()
        if (pendingResolve) {
          pendingResolve(next)
        } else {
          this.resolvedValues.push(next)
        }
      },
      error => {
        const pendingResolve = this.pendingResolves.shift()
        if (pendingResolve) {
          pendingResolve(error)
        } else {
          this.resolvedValues.push(error)
        }
      },
      () => {
        this.isDone = true
      },
    )
  }

  [Symbol.asyncIterator]() {
    return {
      next: async (): Promise<IteratorResult<any>> => ({
        done: this.isDone && this.resolvedValues.length === 0 && this.pendingResolves.length === 0,
        value: this.resolvedValues.length
          ? this.resolvedValues.shift()
          : await new Promise(resolve => {
              this.pendingResolves.push(resolve)
            }),
      }),
    }
  }
}

export default AsyncIterableObserver
