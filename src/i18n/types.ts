export type Lang = 'en' | 'hi' | 'bn' | 'ne';

export type Entry = Partial<Record<Exclude<Lang, 'en'>, string>>;
