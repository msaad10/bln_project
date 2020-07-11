
export class MicrogridDetails{
    area: string;
    date: Date;
    time: string;
    activeConsumers: Int32Array;
    inactiveConsumers: Int32Array;
    activeProducers: Int32Array;
    inactiveProducers: Int32Array;
    unitsConsumed: Int32Array;
    unitsProduced: Int32Array;
}