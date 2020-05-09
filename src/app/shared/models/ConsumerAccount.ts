import { Base } from './Base';
import { Receipt } from './Receipt';
import { Consumer } from './Consumer';

export class ConsumerAccount extends Base {
    consumerAccountId?: string;
    year: string;
    amountPaid: number;
    consumerId: string;
    isActive : boolean;
    receipts?: Array<Receipt>;
    consumer?:Consumer;
}