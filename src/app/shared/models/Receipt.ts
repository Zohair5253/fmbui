import { Base } from './Base';
import { ConsumerAccount } from './ConsumerAccount';

export class Receipt extends Base {
    receiptId?: string;
    receiptNumber?:number;
    date: Date;
    consumerName: string;
    amount: number;
    paymentMode:string;
    remarks?:string;
    takenBy: string;
    consumerAccountId: string;
    consumerAccount?: ConsumerAccount;
}