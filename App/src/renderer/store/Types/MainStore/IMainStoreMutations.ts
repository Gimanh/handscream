export interface IMainStoreMutations {
    setVersion( v: string ): void;

    setDarkMode( v: boolean ): void;

    setLayout( v: string ): void;

    setUsagesMode( v: string ): void;

    setAllowSort( v: boolean ): void;
}
