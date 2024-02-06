export interface Survey {
    unique_identifier: string;
    slides: Array<
        | InputSlide
        | MultipleChoiceSlide
        | StarSlide
        | NumericSlide
        | NPSSlide
        | TextSlide
    >;
    outro?: OutroSlide;
    theme: SurveyTheme;
    delay: number;
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

export interface OutroSlide {
    unique_identifier: string;
    type: SlideType.outro;
    title: string;
    subtitle?: string;
    button_label?: string;
    button_url?: string;
}

// BASE
export interface Slide {
    unique_identifier: string;
    title: string;
    subtitle?: string;
    type: SlideType;
    button_label?: string;
    logic?: SlideLogic;
    order?: number;
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
export interface SlideLogic {
    version: 1;
    jumps: SlideJump[];
}

export interface SlideJump {
    condition: SlideJumpConditions;
    value: string;
    selected_values?: { label: string; identifier: string }[];
    slide_unique_identifier: string;
}

export const SlideJumpEndKey = '#END_SURVEY';

export enum SlideType {
    'input' = 'input',
    'multiplechoice' = 'multiplechoice',
    'star' = 'star',
    'numeric' = 'numeric',
    'nps' = 'nps',
    'text' = 'text',
    'outro' = 'outro',
}

export enum SurveyActions {
    SURVEY_SHOWN = 'survey_shown',
    SURVEY_COMPLETED = 'survey_completed',
    SURVEY_SKIPPED = 'survey_skipped',
    SURVEY_SLIDE_ANSWERED = 'survey_slide_answered',
}

export enum SlideJumpConditions {
    EQUALS = 'equals',
    DOES_NOT_EQUAL = 'does_not_equal',
    GREATER_THAN = 'greater_than',
    LESS_THAN = 'less_than',
    GREATER_THAN_OR_EQUAL = 'greater_than_or_equal',
    LESS_THAN_OR_EQUAL = 'less_than_or_equal',
    SUBMITTED = 'submitted',
    INCLUDES_ANY = 'includes_any',
    INCLUDES_ALL = 'includes_all',
}
