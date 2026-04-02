export class MovementCreation {
    date: Date;
    value: number;
    originAccountId: number;
    targetAccountId: number;

    constructor(
        date: Date, 
        value: number, 
        originAccountId: number, 
        targetAccountId: number, 
    ) {
        this.date = date;
        this.value = value;
        this.originAccountId = originAccountId;
        this.targetAccountId = targetAccountId;;
    }
  
}