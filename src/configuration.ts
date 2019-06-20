export default interface Configuration {
    debug: boolean;
    mongo: {
        url: string;
    }
    port: number;
}