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
            options: [
                { label: '😍 LOVE IT' },
                { label: '🤩 Feature B' },
                { label: '😇 Feature C' },
                { label: '😎 Feature D' },
            ],
        },
    ],
    style: {
        colorScheme: 'dark',
        backgroundColor: '#FFAE1A',
    },
};

export const Star: Survey = {
    id: 'star',
    slides: [
        {
            title: 'How was your experience?',
            subtitle: 'Please tell us more about your experience.',
            type: 'star',
        },
    ],
    style: {
        colorScheme: 'dark',
        backgroundColor: '#FFAE1A',
    },
};

export const NPS: Survey = {
    id: 'nps',
    slides: [
        {
            title: 'How was your experience?',
            subtitle: 'Please tell us more about your experience.',
            type: 'nps',
        },
    ],
    style: {
        colorScheme: 'dark',
        backgroundColor: '#FFAE1A',
    },
};

export const Numeric: Survey = {
    id: 'numeric',
    slides: [
        {
            title: 'How was your experience?',
            subtitle: 'Please tell us more about your experience.',
            type: 'numeric',
            min: 10,
            max: 50,
        },
    ],
    style: {
        colorScheme: 'dark',
        backgroundColor: '#FFAE1A',
    },
};

export const MultiSlide: Survey = {
    id: 'multi-slide',
    slides: [
        {
            id: 'slide-1',
            title: 'How was your experience?',
            subtitle: 'Please tell us more about your experience.',
            type: 'input',
            placeholder: 'Type your answer here...',
            multiline: false,
        },
        {
            id: 'slide-2',
            title: 'How was your experience?',
            subtitle: 'Please tell us more about your experience.',
            type: 'select',
            multiple: false,
            options: [
                { label: '😍 LOVE IT' },
                { label: '🤩 Feature B' },
                { label: '😇 Feature C' },
                { label: '😎 Feature D' },
                { label: '😎 Feature E' },
                { label: '😎 Feature F' },
                { label: '😎 Feature G' },
                { label: '😎 Feature H' },
            ],
        },
        {
            id: 'slide-3',
            title: 'How was your experience?',
            subtitle: 'Please tell us more about your experience.',
            type: 'star',
        },
        {
            id: 'slide-4',
            title: 'How was your experience?',
            subtitle: 'Please tell us more about your experience.',
            type: 'multiplechoice',
            multiple: true,
            options: [
                { label: '😍 LOVE IT' },
                { label: '🤩 Feature B' },
                { label: '😇 Feature C' },
                { label: '😎 Feature D' },
                { label: '😎 Feature E' },
                { label: '😎 Feature F' },
                { label: '😎 Feature G' },
                { label: '😎 Feature H' },
            ],
        },
        {
            id: 'slide-5',
            title: 'How was your experience?',
            subtitle: 'Please tell us more about your experience.',
            type: 'nps',
        },
        {
            id: 'slide-6',
            title: 'How was your experience?',
            subtitle: 'Please tell us more about your experience.',
            type: 'numeric',
            min: 10,
            max: 50,
        },
    ],
    style: {
        colorScheme: 'dark',
        backgroundColor: '#FFAE1A',
    },
};
