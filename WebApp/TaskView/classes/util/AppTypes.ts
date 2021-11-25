export type AppConfigResponse = {
    response: {
        namespace: string
    },
    rid: string | null
};

export type JWTPayload = {
    exp: number
    id: number
    type: 'jwt'
    userData: {
        email: string
        id: number
        login: string
        permissions: {
            [ key: string ]: true
        }
    }
};

export type RefreshTokenResponse = {
    access: string
    refresh: string
}
