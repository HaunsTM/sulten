import { IEpochHelper } from "../interfaces/IEpochHelper";

export class EpochHelper implements IEpochHelper {

    public getDateOfMonday(anotherDayInTheWeek: Date): Date {

        const day = anotherDayInTheWeek.getDay();
        const diff = anotherDayInTheWeek.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
        return new Date(anotherDayInTheWeek.setDate(diff));
    }

    private getMonth1_12(date: Date): number {
        const month1_12 = date.getMonth() + 1;
        return month1_12;
    }
    private getISO8601WeekNumber(initialDate: Date): number {
        initialDate.setHours(0, 0, 0, 0);

        // https://weeknumber.net/how-to/javascript

        // Thursday in current week decides the year.
        initialDate.setDate(initialDate.getDate() + 3 - (initialDate.getDay() + 6) % 7);

        // January 4 is always in week 1.
        const week1 = new Date(initialDate.getFullYear(), 0, 4);

        // Adjust to Thursday in week 1 and count number of weeks from date to week1.
        return 1 +
            Math.round(((initialDate.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
    }

    public getMonthThatStartedThisWeek() {

    }
 getRandomSentence( length: number, terminateWithPunctuation: boolean ): string;
    getRandomSentence( minNumberOfWords: number, maxNumberOfWords: number, terminateWithPunctuation: boolean ): string;
    getRandomSentence( arg1: number, arg2: any, arg3?: boolean ): string {

        if ( arg3 !== undefined ) {
            const minNumberOfWords: number = arg1;
            const maxNumberOfWords: number = arg2;
            const terminateWithPunctuation: boolean = arg3;

            const numberOfWordsInSentence = Math.floor( Math.random() * maxNumberOfWords ) + minNumberOfWords;
            let sentence = '';
            let previousWord = '';
            let currentWord = '';

            for ( let i = 0; i < numberOfWordsInSentence; i++ ) {

                while (previousWord === currentWord) {
                    currentWord = this.getRandomWord();
                }

                if ( i === 0 ) {
                    currentWord = currentWord.replace(/^(.)/g, currentWord[0].toUpperCase());

                    sentence += currentWord + ' ';

                } else if ( ( i + 1 ) === numberOfWordsInSentence ) {

                    if ( terminateWithPunctuation ) {
                        sentence += currentWord + this.getRandomPunctuation();
                    } else {
                        sentence += currentWord;
                    }
                } else {
                    sentence += currentWord + ' ';
                }
                previousWord = currentWord;
            }

            return sentence;

        } else {

            const length: number = arg1;
            const terminateWithPunctuation: boolean = arg2;

            const retVal = terminateWithPunctuation ?
                this.getRandomSentence(length, length, false).substring(0, length - 1 ) + this.getRandomPunctuation()
                : this.getRandomSentence(length, length, false).substring(0, length);

            return retVal;
        }
    }

}
