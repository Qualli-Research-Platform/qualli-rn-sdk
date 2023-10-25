export interface Survey {
    unique_identifier: string;
    slides: Array<
        | InputSlide
        | MultipleChoiceSlide
        | StarSlide
        | NumericSlide
        | NPSSlide
        | TextSlide
        // | CSATSlide
    >;
    person?: Person;
    theme: SurveyTheme;
}

// DIFFERENT TYPES
export interface InputSlide extends Slide {
    type: SlideType.input;
    placeholder: string;
    multiline?: boolean;
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

export interface TextSlide extends Slide {
    type: SlideType.text;
}

export interface NPSSlide extends Slide {
    type: SlideType.nps;
}

// export interface CSATSlide extends Slide {
//     type: SlideType.csat;
// }

// BASE
export interface Slide {
    unique_identifier: string;
    title: string;
    subtitle?: string;
    type: SlideType;
    button_label?: string;
}

export interface SurveyTheme {
    unique_identifier: string;
    name: string;
    title_color: string;
    subtitle_color: string;
    answer_color: string;
    button_color: string;
    button_text_color: string;
    background_color: string;
}

interface Person {
    name: string;
    role?: string;
    avatar: string;
}

export enum SlideType {
    'input' = 'input',
    'multiplechoice' = 'multiplechoice',
    'star' = 'star',
    'numeric' = 'numeric',
    'nps' = 'nps',
    'text' = 'text',
    // 'csat' = 'csat',
}

export enum SurveyActions {
    SURVEY_SHOWN = 'survey_shown',
    SURVEY_COMPLETED = 'survey_completed',
    SURVEY_SKIPPED = 'survey_skipped',
}
