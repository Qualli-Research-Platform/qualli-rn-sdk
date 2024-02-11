import { SlideJumpConditions, SlideJump, SlideType } from './../types';

// Helper function to validate and clean the answer
const cleanAndValidateAnswer = (
    answer: any,
    expectedType: 'string' | 'number' | 'array',
): any => {
    if (expectedType === 'number') {
        // parse number to string
        // check if valid number from string
        // return number or false
        const parsed = parseFloat(answer);
        return isNaN(parsed) ? false : parsed;
    } else if (expectedType === 'array') {
        return Array.isArray(answer) ? answer : false;
    }

    return typeof answer === 'string' ? answer : false;
};

// Updated evaluateJumpCondition function
export const evaluateJumpCondition = (
    jump: SlideJump,
    answer: any,
    type: SlideType,
): boolean => {
    try {
        if (jump.condition === SlideJumpConditions.SUBMITTED) return true;

        const isNumericAnswer =
            type === SlideType.numeric ||
            type === SlideType.nps ||
            type === SlideType.star;
        const isArrayAnswer = type === SlideType.multiplechoice;

        let expectedType: 'string' | 'number' | 'array' = 'string';
        if (isNumericAnswer) expectedType = 'number';
        else if (isArrayAnswer) expectedType = 'array';

        const cleanedAnswer = cleanAndValidateAnswer(answer, expectedType);
        const cleanedValue = cleanAndValidateAnswer(
            isArrayAnswer ? jump.selected_values : jump.value,
            expectedType,
        );

        if (cleanedAnswer === false || cleanedValue === false) {
            return false; // Invalid answer type
        }

        const selectedValueAnswerLabels =
            jump.selected_values?.map(sv => sv.label) || [];

        switch (jump.condition) {
            case SlideJumpConditions.EQUALS:
                if (isArrayAnswer) {
                    return selectedValueAnswerLabels.every(val =>
                        cleanedAnswer.includes(val),
                    );
                }

                return cleanedAnswer === cleanedValue;
            case SlideJumpConditions.DOES_NOT_EQUAL:
                if (isArrayAnswer) {
                    return (
                        selectedValueAnswerLabels.every(val =>
                            cleanedAnswer.includes(val),
                        ) === false
                    );
                }
                return cleanedAnswer !== cleanedValue;
            case SlideJumpConditions.GREATER_THAN:
                return cleanedAnswer > cleanedValue;
            case SlideJumpConditions.LESS_THAN:
                return cleanedAnswer < cleanedValue;
            case SlideJumpConditions.GREATER_THAN_OR_EQUAL:
                return cleanedAnswer >= cleanedValue;
            case SlideJumpConditions.LESS_THAN_OR_EQUAL:
                return cleanedAnswer <= cleanedValue;
            case SlideJumpConditions.INCLUDES_ANY:
                return selectedValueAnswerLabels.some(val =>
                    cleanedAnswer.includes(val),
                );
            case SlideJumpConditions.INCLUDES_ALL:
                return selectedValueAnswerLabels.every(val =>
                    cleanedAnswer.includes(val),
                );
            default:
                return false;
        }
    } catch (e) {
        return false;
    }
};
