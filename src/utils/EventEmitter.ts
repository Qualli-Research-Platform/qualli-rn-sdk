import { SurveyEvents } from './../types/events';

class EventEmitter {
    private events: { [key: string]: Function[] } = {};

    on(event: SurveyEvents, listener: Function) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(listener);
        return () => this.off(event, listener as Function);
    }

    off(event: SurveyEvents, listener: Function) {
        if (!this.events[event]) return;
        this.events[event] = this.events[event].filter(l => l !== listener);
    }

    emit(event: SurveyEvents, ...args: any[]) {
        if (!this.events[event]) return;
        this.events[event].forEach(listener => listener(...args));
    }
}
const eventEmitterInstance = new EventEmitter();
export { eventEmitterInstance as eventEmitter };
