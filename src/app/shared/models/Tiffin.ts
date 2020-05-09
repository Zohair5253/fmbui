import { Base } from './Base';
import { Consumer } from './Consumer';

export class Tiffin  extends Base{
    tiffinId?: string;
    number?: number;
    size: string;
    rate: number;
    consumerId?: string;
    consumer?: Consumer;

    

}