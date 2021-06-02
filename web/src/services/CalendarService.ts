import moment, { MomentInput } from "moment";

// tipagem dos dados de items
interface Item {
    id: string;
    user_id: string;
    type: string;
    title: string;
    date: string;
    start_date: string;
    finish_date: string;
    description: string;
    location: string;

}

// objeto responsável pelas marcações no calendário
const CalendarVerifier = {
    // verificar se é mês atual
    isCurrentMonth: (date: MomentInput, referencedDate: MomentInput) => {
        if(moment(date).month() === moment(referencedDate).month()) {
            return true;
        }
        return false;
        
    },
    // verificar se é o dia de hoje, se for
    isToday: (date: MomentInput) => {
        if(date === moment().format("yyyy-MM-DD")) {
            return true;
        } else {
            return false;
        }
    },
    // verificar se há lembretes no dia tal
    isReminderDay: (date: MomentInput, items: Item[]) => {
        if (items.length > 0) {
            const foundItem = items.find(item => moment(moment(item.date).local()).format("yyyy-MM-DD") === date
            && item.type === "reminder")
            if (foundItem) {
                return true;
            }
            return false;
        }
        return false;
        
    },
    // verificar se há eventos que iniciam no dia tal, se houver
    isEventDay: (date: MomentInput, items: Item[]) => {
        if (items.length > 0) {
            const foundItem = items.find(item => (moment(moment(item.start_date).local()).format("yyyy-MM-DD") === date 
            || moment(moment(item.finish_date).local()).format("yyyy-MM-DD") === date )
            && item.type === "event")
            if (foundItem) {
                return true;
            }
            return false;
        }
        return false;
    }
    
}

export { CalendarVerifier };