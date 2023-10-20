'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.SurveyActions = exports.SlideType = void 0;
let SlideType;
(function (SlideType) {
    SlideType.input = 'input';
    SlideType.select = 'select';
    SlideType.multiplechoice = 'multiplechoice';
    SlideType.star = 'star';
    SlideType.numeric = 'numeric';
    SlideType.nps = 'nps';
    // 'csat' = 'csat',
})((SlideType = exports.SlideType || (exports.SlideType = {})));
let SurveyActions;
(function (SurveyActions) {
    SurveyActions.SURVEY_SHOWN = 'survey_shown';
    SurveyActions.SURVEY_COMPLETED = 'survey_completed';
    SurveyActions.SURVEY_SKIPPED = 'survey_skipped';
})((SurveyActions = exports.SurveyActions || (exports.SurveyActions = {})));
