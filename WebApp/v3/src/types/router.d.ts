import type { MiddlewareHandlers } from '@/router';

export {}

import 'vue-router'

declare module 'vue-router' {
    interface RouteMeta {
        middleware?: MiddlewareHandlers
    }
}
