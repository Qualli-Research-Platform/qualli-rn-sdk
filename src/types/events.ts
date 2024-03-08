export enum SurveyEvents {
    SURVEY_COMPLETED = 'survey_completed',
    SURVEY_SHOWN = 'survey_shown',
    SURVEY_CLOSED = 'survey_closed',
    SURVEY_SKIPPED = 'survey_skipped',
}

export interface EventCompletedPayload {
    survey_unique_identifier: string;
    answers: {
        slide_unique_id: string;
        slide_title: string;
        answer: string | number | Array<string | number>;
    }[];
}

export interface EventSkippedPayload {
    survey_unique_identifier: string;
    answers: {
        slide_unique_id: string;
        slide_title: string;
        answer: string | number | Array<string | number>;
    }[];
}

export interface EventShownPayload {
    survey_unique_identifier: string;
}

export interface EventClosedPayload {
    survey_unique_identifier: string;
}
