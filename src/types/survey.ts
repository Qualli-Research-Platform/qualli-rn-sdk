export interface Survey {
    unique_identifier: string;
    slides: Array<
        | InputSlide
        | SelectSlide
        | MultipleChoiceSlide
        | StarSlide
        | NumericSlide
        | NPSSlide
        // | CSATSlide
    >;
    person?: Person;
    style: Style;
}

// DIFFERENT TYPES
export interface InputSlide extends Slide {
    type: SlideType.input;
    placeholder: string;
    multiline?: boolean;
}

export interface SelectSlide extends Slide {
    type: SlideType.select;
    multiple: false;
    options: { label: string }[];
}

export interface MultipleChoiceSlide extends Slide {
    type: SlideType.multiplechoice;
    multiple: true;
    options: { label: string }[];
}

export interface StarSlide extends Slide {
    type: SlideType.star;
}

export interface NumericSlide extends Slide {
    type: SlideType.numeric;
    min: number;
    max: number;
}

export interface NPSSlide extends Slide {
    type: SlideType.nps;
}

export interface CSATSlide extends Slide {
    type: SlideType.csat;
}

// BASE
export interface Slide {
    unique_identifier: string;
    title: string;
    subtitle?: string;
    type: SlideType;
    // logic?: {
    //     conditions: {
    //         type: 'equals' | 'greaterThan' | 'lessThan';
    //         valueIndex?: number;
    //         value?: string;
    //         goToSlideId: string;
    //         closeSurvey: boolean;
    //     }[];
    //     fallbackSlideId?: string;
    // };
}

interface Style {
    // iconStyle?: 'outline' | 'coloured' | 'emoji';
    backgroundColor?: string;
    colorScheme: 'light' | 'dark';
}

interface Person {
    name: string;
    role?: string;
    avatar: string;
}

export enum SlideType {
    'input' = 'input',
    'select' = 'select',
    'multiplechoice' = 'multiplechoice',
    'star' = 'star',
    'numeric' = 'numeric',
    'nps' = 'nps',
    // 'csat' = 'csat',
}

export enum SurveyActions {
    SURVEY_SHOWN = 'survey_shown',
    SURVEY_COMPLETED = 'survey_completed',
    SURVEY_SKIPPED = 'survey_skipped',
}
