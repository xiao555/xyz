import { als } from 'asynchronous-local-storage'

export const useContext = () => als.get('ctx')
export const useInject = <T>(key: string) => als.get<T>(key)
export const useMutation = <T>(key: string, value: T) => als.set<T>(key, value)

export const runWithAls = (
  inject: Record<string, any>,
  fn: (...args: unknown[]) => unknown,
  args: any[]
) => {
  return new Promise((r) => {
    als.runWith(
      async () => {
        r(await fn(...args))
      },
      { ...inject }
    )
  })
}

export { als }
