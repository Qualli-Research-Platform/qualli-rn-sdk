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

export const SingleSelect: Survey = {
    id: 'single-select',
    slides: [
        {
            title: 'How was your experience?',
            subtitle: 'Please tell us more about your experience.',
            type: 'select',
            multiple: false,
            options: ['Feature A', 'Feature B', 'Feature C', 'Feature D'],
        },
    ],
    style: {
        colorScheme: 'dark',
        backgroundColor: '#D9E5FF',
    },
};
