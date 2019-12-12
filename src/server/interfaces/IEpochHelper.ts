
export interface IEpochHelper {

    getDateOfMonday(anotherDayInTheWeek: Date): Date;

    getRandomSentence( length: number, terminateWithPunctuation: boolean ): string;

    getRandomSentence( minNumberOfWords: number, maxNumberOfWords: number, terminateWithPunctuation: boolean ): string;

    getRandomUniqueSentence( length: number, terminateWithPunctuation: boolean ): string;
}
