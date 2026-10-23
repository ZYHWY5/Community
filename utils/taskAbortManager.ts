type AbortFn = () => void

class TaskAbortManager {
    private tasks = new Map<string, AbortFn>()

    register(taskId: string, abortFn: AbortFn) {
        this.tasks.set(taskId, abortFn)
    }

    abort(taskId: string) {
        const abortFn = this.tasks.get(taskId)
        if (abortFn) {
            abortFn()
            this.tasks.delete(taskId)
        }
    }

    abortAll() {
        for (const [taskId, abortFn] of this.tasks.entries()) {
            abortFn()
            this.tasks.delete(taskId)
        }
    }

    unregister(taskId: string) {
        this.tasks.delete(taskId)
    }
}

export const taskAbortManager = new TaskAbortManager()
