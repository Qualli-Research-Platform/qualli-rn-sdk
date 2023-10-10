import { type Survey, SlideType } from '../../src/types';

export const SingleText: Survey = {
    id: 'single-text',
    slides: [
        {
            title: 'How was your experience?',
            subtitle: 'Please tell us more about your experience.',
            type: 'input',
            placeholder: 'Type your answer here...',
            multiline: false,
        },
    ],
    style: {
        colorScheme: 'dark',
        backgroundColor: '#FFAE1A',
    },
};
