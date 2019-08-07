export interface KeyEntry<T> {
    createdAt: Date,
    lastModified: Date,
    key: string,
    data: T
}

export interface IKeyMapSource<T> {
    loadAll(): KeyMap<T>;
    saveAll(entries: KeyMap<T>): void;
    saveNew(data: T): KeyEntry<T>;
    save(entry: KeyEntry<T>): KeyEntry<T>;
    onUpdate(cb: () => void): void;
    unRegister(cb: () => void): void;
}

export type KeyMap<T> = Record<string, KeyEntry<T>>;

export interface StreamEntry<T> extends KeyEntry<T> {
    page: number;
}

export interface StreamEntryRef {
    key: string;
    page: number;
}

export interface IStreamSource<T> {
    pushNew(value: T): StreamEntry<T>;
    getEntries(page?: number): StreamEntry<T>[];
    edit(entry: StreamEntry<T>): StreamEntry<T>;
    remove(entry: StreamEntry<T>): boolean;
    canRemove(entry: StreamEntry<T>): boolean;
    find(ref: StreamEntryRef): StreamEntry<unknown>;
    onUpdate(cb: () => void): void;
    unRegister(cb: () => void): void;
}