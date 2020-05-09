import { Person } from './Person';
import { DeliveryMan } from './DeliveryMan';
import { Tiffin } from './Tiffin';
import { ConsumerAccount } from './ConsumerAccount';

export class Consumer extends Person {
    consumerId?: string;
    itsId: string;
    sabilNumber:string;
    area: string;
    isActive: boolean;
    deliveryManId: string;
    deliveryMan?: DeliveryMan;
    tiffin: Tiffin;
    consumerAccounts?: Array<ConsumerAccount>; 
    
}